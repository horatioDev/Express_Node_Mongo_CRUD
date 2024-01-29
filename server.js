// Create server for browser use w/ express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Listen for server on port localhost:3000
app.listen(PORT, function() {
  console.log(`Listening on localhost:${PORT}`)
});

// Run server
// cd working_dir && node server.js
// ----------------------------------------------------------------------------

// Nodemon --------------------------------------------------------------------
/*
Nodemon restarts the server automatically when you save a file that’s used by the server.js. 
npm install nodemon --save-dev

Update script in package.json
"scripts": {
  "dev": "nodemon server.js"
}

npm run dev to trigger nodemon server.js
*/
// ----------------------------------------------------------------------------

// Create ---------------------------------------------------------------------
/*
Browsers can only perform a Create operation if they send a POST request to the server though a <form> or javascript.

To send a POST request the index.html needs a <form> element.
The form should have an action, method attribute and a name attribute on each input element:
action: endpoint
method: Request
name: Descriptive name
*/

// ----------------------------------------------------------------------------

// Read -----------------------------------------------------------------------
/*
We handle GET request w/ get method:
app.get(endpoint, callback);

domain_name: www.website.com/dir/file/
endpoint: is anything after domain_name (/dir/file/)
callback: tells the server what to do when the requested endpoint  matches the endpoint in the route.

It takes (req, res) as parameters where req is the HTTP request and res is the  HTTP response.

app.get('/', (req, res) => {handle req})
*/

app.get('/', (req, res) => {
  // Let'serve index.html
  // __dirname is the current directory you're in. 
  console.log(__dirname)
  res.sendFile(__dirname + '/index.html')
});
// ----------------------------------------------------------------------------

// Update ---------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Delete ---------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Test server.js
console.log('Quotes:  Create, Read, Update & Delete');