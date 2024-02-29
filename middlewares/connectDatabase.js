// Import password
const password = require('../secrets/password');
// Import credentials
const dbString = require('../secrets/credentials.js');
// const CONNECTION_STRING = dbString.getContactsDBString(PASSWORD)
const MongoClient = require('mongodb').MongoClient;


const connectToDB = (req,res,next) => {
  const DB_NAME = req.url.split('/')[1] +'DB';
  const DB_COLLECTION = req.url.split('/')[1];
  const DB_URL = getDB_URL(req);
  let dbCollection;

  MongoClient.connect(DB_URL)
  .then(client => {
    console.log('Connected to MongoDB Server', DB_NAME)
    const db = client.db(DB_NAME).collection(DB_COLLECTION);
    req.dbCollection = db
    console.log('DB', dbCollection)
    next()
  })
  .catch((err)=>{
    console.error("Could not Connect to the MongoDB", err);
    res.status(500).send('Internal Server Error')
  });
  return dbCollection;
}

function getDB_URL(req) {
  const db_URL = req.url;
  let CONNECTION_STRING;
  let PASSWORD;

  if (db_URL.startsWith('/contacts')) {
    PASSWORD = password.getContactsPassword()
    CONNECTION_STRING = dbString.getContactsDBString(PASSWORD);
  } else if (db_URL.startsWith('/posts')) {
    PASSWORD = password.getPostsPassword()
    CONNECTION_STRING = dbString.getPostsDBString(PASSWORD);
  } else if (db_URL.startsWith('/tasks')) {
    PASSWORD = password.getTasksPassword()
    CONNECTION_STRING = dbString.getTasksDBString(PASSWORD);
  } else if (db_URL.startsWith('/employees')) {
    PASSWORD = password.getEmployeesPassword()
    CONNECTION_STRING = dbString.getEmployeesDBString(PASSWORD);
  } else if (db_URL.startsWith('/quotes')) {
    PASSWORD = password.getQuotesPassword()
    CONNECTION_STRING = dbString.getQuotesDBString(PASSWORD);
  } else {
    return
  }
console.log('Request', CONNECTION_STRING, req.url.includes('contacts'))
return CONNECTION_STRING;
}

module.exports = {
  connectToDB
}