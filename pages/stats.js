const {Datastore} = require('@google-cloud/datastore')
const {getAuth} = require('../server/auth')

function Stats(props) {
  return (
    <div>
      <p>{props.message} {props.userInfo.email}</p>
      <p>Document: {props.documentId} has been viewed {props.viewCount} time(s) by {props.email}</p>
    </div>
  )
}

export async function getServerSideProps(context) {
  // Pass data to the page via props
  console.log(context.req.userInfo)

  const result = await getDocumentById('1CEkEK7NzQ0oXKXZWSTsHfSeqnwohHwVgSjBqB2cOnPM')

  console.log(result)

  return {
    props: {
      message: 'Hello, ',
      userInfo: context.req.userInfo,
      viewCount: result[0].viewCount,
      documentId: result[0].documentId,
      email: result[0].email
    }
  }
}

/* Support Functions */

async function getDatastoreClient() {
  const projectId = process.env.GCP_PROJECT_ID
  if (!projectId) {
    console.log('No GCP_PROJECT_ID provided! Will not connect to GCloud Datastore!')
    return null
  }

  // because auth credentials may be passed in multiple ways, recycle pathway used by main auth logic
  const {email, key} = await getAuth()

  return new Datastore({
    projectId,
    credentials: {
      client_email: email,
      private_key: key
    }
  })
}

async function getDocumentById(documentId) {
  const datastore = await getDatastoreClient()

  const query = datastore.createQuery(['LibraryViewDoc']).filter('documentId', '=', documentId)

  const result = await datastore.runQuery(query)

  return result.length > 0 ? result[0] : null
}

export default Stats
