// Create server for browser use w/ express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Listen for server on port localhost:3000
app.listen(PORT, function() {
  console.log(`Listening on localhost:${PORT}`)
});
// ----------------------------------------------------------------------------

// Test server
console.log('Posts:  Create, Read, Update & Delete');