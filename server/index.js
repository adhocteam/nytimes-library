const log = require('./logger');

(async () => {
  const gcpMetadata = require('gcp-metadata');
  const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

  // GCP Metadata is only available to the deployed instance.
  // Running locally, you would still use the .env file.
  const isDeployedInstance = await gcpMetadata.isAvailable();

  if (isDeployedInstance) {
    log.info('App Engine deployed instance detected...');

    // We're on GCP here.  Load up environment variables from 
    // Secrets Manager
    const projectId = await gcpMetadata.project('project-id');

    log.info(`Loading environment variables for project: ${projectId}`);

    // List of environment variables stored in base64-encoded format, rather than raw strings
    const base64Vars = ['GOOGLE_APPLICATION_JSON'];

    const client = new SecretManagerServiceClient();

    const parent = `projects/${projectId}`;

    const [secrets] = await client.listSecrets({
      parent: parent,
    });

    for (let secret of secrets) {
      const path = secret.name.split('/');
      const envVar = path[path.length - 1];

      log.info(`Loading environment variable ${envVar}`);

      process.env[envVar] = await getSecret(client, secret.name, base64Vars.indexOf(envVar) !== -1);
    }

    log.info('Environment variables loaded...')
  }

  startServer();
})();


// Gets secrets from the GCP Secret Manager
const getSecret = async (client, name, isBase64 = false) => {
  const [version] = await client.accessSecretVersion({
    name: `${name}/versions/latest`,
  });

  const payload = version.payload.data.toString('utf8');

  return isBase64 ? Buffer.from(payload, 'base64') : payload;
}


// Starts the Content Library Express Instance
const startServer = () => {
  const path = require('path')

  const express = require('express')
  const csp = require('helmet-csp')

  const { middleware: cache } = require('./cache')
  const { getMeta } = require('./list')
  const { allMiddleware, requireWithFallback } = require('./utils')
  const userInfo = requireWithFallback('./routes/userInfo') // AdHoc: Changed to requireWithFallback
  const pages = requireWithFallback('./routes/pages') // AdHoc: Changed to requireWithFallback
  const categories = requireWithFallback('./routes/categories') // AdHoc: Changed to requireWithFallback
  const playlists = requireWithFallback('./routes/playlists') // AdHoc: Changed to requireWithFallback
  const readingHistory = requireWithFallback('./routes/readingHistory') // AdHoc: Changed to requireWithFallback
  const redirects = requireWithFallback('./routes/redirects') // AdHoc: Changed to requireWithFallback
  const errorPages = requireWithFallback('./routes/errors') // AdHoc: Changed to requireWithFallback

  const userAuth = requireWithFallback('userAuth')
  const customCsp = requireWithFallback('csp')

  const app = express()
  // AdHoc: Added Body Parser to support posts
  app.use(express.json())

  const { preload, postload } = allMiddleware

  // The trust proxy flag tells the app to use https for links
  // and redirect urls if it sees indications that the request
  // passed through a proxy and was originally sent using https
  if ((process.env.TRUST_PROXY || '').toUpperCase() === 'TRUE') {
    app.enable('trust proxy')
  }

  app.set('view engine', 'ejs')
  app.set('views', [path.join(__dirname, '../custom/layouts'), path.join(__dirname, '../layouts')])

  app.get('/healthcheck', (req, res) => {
    res.send('OK')
  })

  app.use(csp({ directives: customCsp }))
  app.use(userAuth)

  preload.forEach((middleware) => app.use(middleware))

  app.use(userInfo)

  // serve all files in the public folder
  app.use('/assets', express.static(path.join(__dirname, '../public')))

  // strip trailing slashes from URLs
  app.get(/(.+)\/$/, (req, res, next) => {
    res.redirect(req.params[0])
  })

  app.get('/view-on-site/:docId', (req, res, next) => {
    const { docId } = req.params
    const doc = getMeta(docId)

    if (!doc) return next(Error('Not found'))

    res.redirect(doc.path)
  })

  // main pages
  app.use(readingHistory.middleware)

  // don't cache pages client-side to ensure browser always gets latest revision
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache')
    next()
  })

  // treat requests ending in .json as application/json
  app.use((req, res, next) => {
    if (req.path.endsWith('.json')) {
      req.headers.accept = 'application/json'
      req.url = req.baseUrl + req.path.slice(0, -5)
    }
    next()
  })

  app.use(pages)
  app.use(cache)

  // category pages will be cache busted when their last updated timestamp changes
  app.use(categories)
  app.use(playlists)

  postload.forEach((middleware) => app.use(middleware))

  // if no page has been served, check for a redirect before erroring
  app.use(redirects)

  // error handler for rendering the 404 and 500 pages, must go last
  app.use(errorPages)

  // If we are called directly, listen on port 3000, otherwise don't

  if (require.main === module) {
    app.listen(parseInt(process.env.PORT || '3000', 10))
  }

  module.exports = app
}
