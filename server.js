const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

// Import routes 
const routes  = require('./routes/index.js');
// Import logger middleware
const { logger } = require('./middlewares/logger.js');
// Middleware: JSON, logger, cookie parser, session, passport: local
// we need to set view engine to ejs. This tells Express we’re using EJS as the template engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.json());
app.use(logger);
// Handle Forms
app.use(express.urlencoded({ extended: false }))
//  Serve Static Files ----------------------------------------------------
app.use(express.static('public'));
// Use routes: contacts, posts,tasks, quotes, employees
app.use(routes);


// --- READ ---
// GET: Homepage
app.get('/', logger, (req, res) => {
  res.render('index')
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`)
})

// localhost:3000
// localhost:3000/endpoint
// localhost:3000/endpoint/id
// localhost:3000/endpoint?query1=value1&query2=value2