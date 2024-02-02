// Create server for browser use w/ express
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
// Import password
const password = require('./password.js');
const PASSWORD = password.getPassword();
const CONNECTION_STRING = `mongodb+srv://quotes:${PASSWORD}@quotes-cluster.2cczmmj.mongodb.net/?retryWrites=true&w=majority`;

// Create Database Client Connection 
MongoClient.connect(CONNECTION_STRING)
  .then(client => {
    console.log('Connected to MongoDB Server')
    const db = client.db("quotesDB");
    const quotesCollection = db.collection('quotes')

    // we need to set view engine to ejs. This tells Express we’re using EJS as the template engine
    app.set('view engine', 'ejs');
  
    // Body Parser -----------------------------------------------------------
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

    app.post('/quotes', (req, res) => {
      // console.log('This is a POST request');
      // console.log(req.body)

      // Add items to collection
      quotesCollection.insertOne(req.body)
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

    // Home page
    app.get('/', (req, res) => {
      // Let'serve index.html
      // __dirname is the current directory you're in. 
      // console.log(__dirname)
      // res.sendFile(__dirname + '/index.html')

      // Get quotes from database
      // const allQuotes = db.collection('quotes').find();
      // Makes no sense logged
      // console.log(allQuotes);

      // Convert data to array
      db.collection('quotes').find()
        .toArray()
        .then(results => {
          console.log(results);
          // Render ejs
          res.render('index.ejs', { quotes: results })
        })
        .catch(err => console.error(err));

    });

    // Get all quotes
    app.get('/quotes', (req, res) => {
      res.send('Quotes')
    })

    // Get update form pre-filled
    app.get('/quotes/:id/edit', (req,res) => {
      let quoteId = req.params.id;
      let quoteQuery = { _id: new ObjectId(quoteId)};
      console.log(quoteId);
      // res.send(`Editing Quote: ${quoteId}`);
      db.collection("quotes").findOne(quoteQuery)
       .then((result) =>{
         //console.log(result);
         if(!result){
           res.redirect("/")
         } else {
           res.render("edit-quote.ejs", {pageTitle:"Edit Quote", quote: result})
         }
       }).catch((err)=>{
         console.log(err);
         res.status(500).send('Internal Server Error')
       })
    });

  // Handle Update logic
  //  app.post('/quotes/:id/update', (req, res) => {
  //    let updatedQuote = req.body;
  //    delete updatedQuote.submit;
  //    console.log(updatedQuote);
  //    const id = req.params.id;
  //    db.collection("quotes").updateOne({ _id: new ObjectID(id)}, {$set: updatedQuote}, function(err, result) {
  //    db.collection("quotes").findOneAndUpdate({ _id : new ObjectID(id)}, 
  //                           {$set: updatedQuote}, {useFindAndModify: false} )
  //    .then(()=>{
  //      res.redirect('/');
  //    })
  //    .catch((err)=> {
  //      console.log(err);
  //      res.send("Error updating quote");
  //    });
  //  });
  //     res.render('edit-quote.ejs', {  _id: quoteId});
  //     // res.sendFile(__dirname + '/index.html')
  //     // db.collection('quotes').find({_id: quoteId}, (err, quote) => {
  //     //   if (err) {
  //     //     console.error("Error fetching quote from database:", err);
  //     //     res.status(500).send("Error fetching quote from database");
  //     //     return;
  //     //   }
  //     //   console.log('result', result);
  //     //   res.render('edit-quote.ejs', { quote });
  //     // });
  //   });
    // ----------------------------------------------------------------------------

    // Update -----------------------------------------------------------------
    app.put('/quotes/:id', (req,res) => {
      console.log('UDR:', req.body)
    });
    // ----------------------------------------------------------------------------

    // Delete ---------------------------------------------------------------------
    app.delete('/quotes', (req,res) => {
      console.log('DRR:', req.body)
    });
    // ----------------------------------------------------------------------------

  })
  .catch(error => console.error(error));

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


// Test server.js
console.log('Quotes:  Create, Read, Update & Delete');