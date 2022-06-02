// 'use strict'
// const path = require('path')

// const express = require('express')
// const csp = require('helmet-csp')
// const next = require('next')

// const {middleware: cache} = require('./cache')
// const {getMeta} = require('./list')
// const {allMiddleware, requireWithFallback} = require('./utils')
// const userInfo = requireWithFallback('./routes/userInfo') // AdHoc: Changed to requireWithFallback
// const pages = requireWithFallback('./routes/pages') // AdHoc: Changed to requireWithFallback
// const categories = requireWithFallback('./routes/categories') // AdHoc: Changed to requireWithFallback
// const playlists = requireWithFallback('./routes/playlists') // AdHoc: Changed to requireWithFallback
// const readingHistory = requireWithFallback('./routes/readingHistory') // AdHoc: Changed to requireWithFallback
// const redirects = requireWithFallback('./routes/redirects') // AdHoc: Changed to requireWithFallback
// const errorPages = requireWithFallback('./routes/errors') // AdHoc: Changed to requireWithFallback

// const userAuth = requireWithFallback('userAuth')
// const customCsp = requireWithFallback('csp')

// const app = express()
// // AdHoc: Added Body Parser to support posts
// app.use(express.json())

// const {preload, postload} = allMiddleware

// // The trust proxy flag tells the app to use https for links
// // and redirect urls if it sees indications that the request
// // passed through a proxy and was originally sent using https
// if ((process.env.TRUST_PROXY || '').toUpperCase() === 'TRUE') {
//   app.enable('trust proxy')
// }

// app.set('view engine', 'ejs')
// app.set('views', [path.join(__dirname, '../custom/layouts'), path.join(__dirname, '../layouts')])

// app.get('/healthcheck', (req, res) => {
//   res.send('OK')
// })

// app.use(csp({directives: customCsp}))
// app.use(userAuth)

// preload.forEach((middleware) => app.use(middleware))

// app.use(userInfo)

// // serve all files in the public folder
// app.use('/assets', express.static(path.join(__dirname, '../public')))

// // strip trailing slashes from URLs
// app.get(/(.+)\/$/, (req, res, next) => {
//   res.redirect(req.params[0])
// })

// app.get('/view-on-site/:docId', (req, res, next) => {
//   const {docId} = req.params
//   const doc = getMeta(docId)

//   if (!doc) return next(Error('Not found'))

//   res.redirect(doc.path)
// })

// // main pages
// app.use(readingHistory.middleware)

// // don't cache pages client-side to ensure browser always gets latest revision
// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-cache')
//   next()
// })

// // treat requests ending in .json as application/json
// app.use((req, res, next) => {
//   if (req.path.endsWith('.json')) {
//     req.headers.accept = 'application/json'
//     req.url = req.baseUrl + req.path.slice(0, -5)
//   }
//   next()
// })

// app.use(pages)
// app.use(cache)

// // category pages will be cache busted when their last updated timestamp changes
// app.use(categories)
// app.use(playlists)

// postload.forEach((middleware) => app.use(middleware))

// //  if no page has been served, check for a redirect before erroring
// //app.use(redirects)

// //  error handler for rendering the 404 and 500 pages, must go last
// //app.use(errorPages)

// // If we are called directly, listen on port 3000, otherwise don't

// if (require.main === module) {
//   app.listen(parseInt(process.env.PORT || '3000', 10))
// }

// // app.all('*', (req, res) => {
// //   const dev = process.env.NODE_ENV !== 'production'
// //   const nextjs = next({dev})
// //   const handler = nextjs.getRequestHandler()
// //   return handler(req, res)
// // })

// module.exports = app
'use strict'

const express = require('express')
const next = require('next')
const path = require('path')

const csp = require('helmet-csp')

const {middleware: cache} = require('./cache')
const {getMeta} = require('./list')
const {allMiddleware, requireWithFallback} = require('./utils')
const userInfo = requireWithFallback('./routes/userInfo') // AdHoc: Changed to requireWithFallback
const pages = requireWithFallback('./routes/pages') // AdHoc: Changed to requireWithFallback
const categories = requireWithFallback('./routes/categories') // AdHoc: Changed to requireWithFallback
const playlists = requireWithFallback('./routes/playlists') // AdHoc: Changed to requireWithFallback
const readingHistory = requireWithFallback('./routes/readingHistory') // AdHoc: Changed to requireWithFallback
const redirects = requireWithFallback('./routes/redirects') // AdHoc: Changed to requireWithFallback
const errorPages = requireWithFallback('./routes/errors') // AdHoc: Changed to requireWithFallback

const userAuth = requireWithFallback('userAuth')
const customCsp = requireWithFallback('csp')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // AdHoc: Added Body Parser to support posts
  server.use(express.json())

  const {preload, postload} = allMiddleware

  // The trust proxy flag tells the app to use https for links
  // and redirect urls if it sees indications that the request
  // passed through a proxy and was originally sent using https
  // if ((process.env.TRUST_PROXY || ').toUpperCase() === 'TRUE') {
  //   server.enable('trust proxy')
  // }

  server.set('view engine', 'ejs')
  server.set('views', [
    path.join(__dirname, '../custom/layouts'),
    path.join(__dirname, '../layouts'),
  ])

  server.get('/healthcheck', (req, res) => {
    res.send('OK')
  })

  // server.use(csp({directives: customCsp}))
  server.use(userAuth)

  preload.forEach((middleware) => server.use(middleware))

  server.use(userInfo)

  // serve all files in the public folder
  server.use('/assets', express.static(path.join(__dirname, '../public')))

  // strip trailing slashes from URLs
  server.get(/(.+)\/$/, (req, res, nex) => {
    res.redirect(req.params[0])
  })

  server.get('/view-on-site/:docId', (req, res, nex) => {
    const {docId} = req.params
    const doc = getMeta(docId)

    if (!doc) return next(Error('Not found'))

    res.redirect(doc.path)
  })

  // main pages
  server.use(readingHistory.middleware)

  // don't cache pages client-side to ensure browser always gets latest revision
  server.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache')
    next()
  })

  // treat requests ending in .json as application/json
  server.use((req, res, next) => {
    if (req.path.endsWith('.json')) {
      req.headers.accept = 'application/json'
      req.url = req.baseUrl + req.path.slice(0, -5)
    }
    next()
  })

  server.use(pages)
  server.use(cache)

  // category pages will be cache busted when their last updated timestamp changes
  server.use(categories)
  server.use(playlists)

  postload.forEach((middleware) => app.use(middleware))

  //  if no page has been served, check for a redirect before erroring
  // app.use(redirects)

  // handle all other requests with next.js
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  //  error handler for rendering the 404 and 500 pages, must go last
  server.use(errorPages)

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
