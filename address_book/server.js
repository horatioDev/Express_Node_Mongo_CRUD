// Create server for browser use w/ express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
// Import password
const password = require('./password.js');
const PASSWORD = password.getPassword();
const CONNECTION_STRING = `mongodb+srv://contacts:${PASSWORD}@contacts-cluster.xsvvs0g.mongodb.net/?retryWrites=true&w=majority`;

// Create Database Client Connection 
MongoClient.connect(CONNECTION_STRING)
  .then(client => {
    console.log('Connected to MongoDB Server')
    const db = client.db("contactsDB");
    const contactsCollection = db.collection('contacts');

    // we need to set view engine to ejs. This tells Express we’re using EJS as the template engine
    app.set('view engine', 'ejs');

    // Body Parser ----------------------------------------------------------------
    /*
    Body-parser: is a middleware that helps express handle reading data from the <form> element.
    npm install body-parser --save
    
    They help tidy up request objects before use w/ use method:
    app.use(bodyParser.urlencoded({extended: true}))
    
    urlencoded: method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object:
    { inputName: inputValue }
    
    Make sure you place body-parser before your CRUD handlers!
    app.get()
    app.post()
    app.put()
    app.delete()
    */
    app.use(bodyParser.urlencoded({ extended: true }));
    // Read JSON --------------------------------------------------------------
    app.use(bodyParser.json());
    //  Serve Static Files ----------------------------------------------------
    app.use(express.static('public'));
    
    // ----------------------------------------------------------------------------

    // Create ---------------------------------------------------------------------
    /*
    Browsers can only perform a Create operation if they send a POST request:
    app.post(endpoint, callback);
    
    To the server though a <form> or javascript.
    
    To send a POST request the index.html needs a <form> element.
    The form should have an action, method attribute and a name attribute on each input element:
    action: tells the browser where to send the request: /endpoint
    method: tells the browser what kind of request to send: POST
    name: Descriptive name
    
    We can handle this POST request with a post method in server.js. The path should be the value you placed in the action attribute.
    app.post('/path', (req, res) => { handle post req});
    
    See: Body-parser
    */

    app.post('/contacts', (req, res) => {
      // console.log('This is a POST request');
      // console.log(req.body)

      // Add items to collection
      contactsCollection.insertOne(req.body)
        .then(result => {
          // redirect browser
          res.redirect('/');
        })
        .catch(err => console.error(err))
    });
    // ----------------------------------------------------------------------------

    // Read -----------------------------------------------------------------------
    /*
    We handle GET request w/ get method:
    app.get(endpoint, callback);
    
    domain_name: www.website.com/dir/file/
    endpoint: is anything after domain_name (/dir/file/)
    callback: tells the server what to do when the requested endpoint  matches the endpoint in the route.
    
    It takes (req, res) as parameters where req is the HTTP request and res is the  HTTP response.
    
    app.get('/', (req, res) => {handle get req})
    */

    // Home Page
    app.get('/', (req, res) => {
      // Let'serve index.html
      // __dirname is the current directory you're in. 
      // console.log(__dirname)
      // res.sendFile(__dirname + '/index.html')

      // Get contacts from database
      // const allContacts = db.collection('contacts').find();
      // Makes no sense logged
      // console.log(allContacts);

      // Convert data to array
      db.collection('contacts').find()
        .toArray()
        .then(results => {
          // Render ejs
          res.render('index.ejs', { contacts: results });
        })
        .catch(err => console.error(err));

    });


    // Get all contacts
    app.get('/contacts', (req, res) => {
      res.send('contacts')
    })

    // Get update form pre-filled
    app.get('/contacts/:id/edit', (req,res) => {
      let contactId = req.params.id;
      let contactQuery = { _id: new ObjectId(contactId)};
      console.log(contactId);
      // res.send(`Editing contact: ${contactId}`);
      db.collection("contacts").findOne(contactQuery)
       .then((result) =>{
         //console.log(result);
         if(!result){
           res.redirect("/")
         } else {
           res.render("edit-contact.ejs", {pageTitle:"Edit contact", contact: result})
         }
       }).catch((err)=>{
         console.log(err);
         res.status(500).send('Internal Server Error')
       })
    });
    // ----------------------------------------------------------------------------

    // Update -----------------------------------------------------------------
    app.put('/contacts/:id', (req,res) => {
      console.log('UDR:', req.body)
    });
    // ----------------------------------------------------------------------------

    // Delete ---------------------------------------------------------------------
    app.delete('/contacts', (req,res) => {
      console.log('DRR:', req.body)
    });
    // ----------------------------------------------------------------------------
  })
  .catch(error => { console.error(error) });


// Listen for server on port localhost:3000
app.listen(PORT, function () {
  console.log(`Listening on localhost:${PORT}`)
});

// Run server
// cd working_dir && node server.js
// ----------------------------------------------------------------------------

// Nodemon --------------------------------------------------------------------
/*
Nodemon: restarts the server automatically when you save a file that’s used by the server.js. 
npm install nodemon --save-dev

Update script in package.json
"scripts": {
  "dev": "nodemon server.js"
}

npm run dev to trigger nodemon server.js
*/

// ----------------------------------------------------------------------------


// Test server
console.log('Address Book:  Create, Read, Update & Delete');