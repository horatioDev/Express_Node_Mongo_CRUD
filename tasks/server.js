// Create server for browser use w/ express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Listen for server on port localhost:3000
app.listen(PORT, function() {
  console.log(`Listening on localhost:${PORT}`)
});
// ----------------------------------------------------------------------------

// Create ---------------------------------------------------------------------
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
  res.sendFile(__dirname + '/index.html')
});
// ----------------------------------------------------------------------------

// Update ---------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Delete ---------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Test server
console.log('Tasks:  Create, Read, Update & Delete');