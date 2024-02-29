// Import the Router 
const express =  require('express');
// Create an instance of the express application
const router = express.Router();

// Import the contactsRouter and productsRouter
const contactsRouter = require('./routes/api/contacts/contacts.js');
const postsRouter = require('./routes/api/posts/posts.js');
const quotesRouter = require('./routes/api/quotes/quotes.js');
const tasksRouter = require('./routes/api/tasks/tasks.js');
const employeesRouter = require('./routes/api/employees/employees.js');

// Mount the contactsRouter, quotesRouter and postsRouter middleware
// Mount the contactsRouter, quotesRouter and postsRouter middleware
router.use('/', contactsRouter);
router.use('/', postsRouter);
router.use('/', quotesRouter);
router.use('/', tasksRouter);
router.use('/', employeesRouter);


// Export the express application (Note: Should be app, not router)
module.exports = router;
