// Create server for browser use w/ express
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { connectToDB } = require('../../../middlewares/connectDatabase.js');
// ----------------------------------------------------------------------------

// Create ----------
// POST route for adding a new quote
router.post('/quotes', connectToDB, (req, res) => {
  // Log the request body
  console.log('rb', req.body);

  const dbCollection = req.dbCollection;
  // Add the received quote to the database collection
  dbCollection.insertOne(req.body)
    .then(result => {
      // Redirect the browser to the home page after successfully adding the quote
      res.redirect('/quotes');
    })
    .catch(err => {
      // Log any errors to the console
      console.error(err);
      res.sendStatus(404)
    });
});
// ----------------------------------------------------------------------------

// Read ---------
// Home page route
// GET route for retrieving all quotes
router.get('/quotes', connectToDB, (req, res) => {

  const dbCollection = req.dbCollection;
  // Retrieve all quotes from the database collection
  dbCollection.find()
    .toArray()
    .then(results => {
      // Log the results to the console
      console.log(results);
      res.render('quotesList', {
        title: "Quotes List",
        quotes: results,
      })

      // Check if there are no results
      if (!results) 
        // If no results found, send a 404 status with a JSON response
        return res.status(404).json({ message: 'No Results' });
    })
    .catch(err => {
      // Log any errors to the console and send a 500 status with a JSON response containing the error
      console.error(err);
      res.status(500).json({ error: err })
    })
});


// Route to retrieve all quotes by ID
router.get('/quotes/:id', connectToDB, (req, res) => {
  // Extract the quote ID from the request parameters
  let quoteId = req.params.id;

  // Define the query to find the quote by its ID
  let quoteQuery = { _id: new ObjectId(quoteId) };

  const dbCollection = req.dbCollection;
  // Use findOne to find the quote in the database
  dbCollection.findOne(quoteQuery)
    .then((result) => {
      // Log the result to the console
      // console.log('r', result);

      // Check if the quote is not found
      if (!result) {
        // If quote is not found, send a 404 status with a JSON response
        return res.status(404).json({ message: `Cannot find quote with ID ${quoteId}` });
      } else {
        // If the quote is found, send a 200 status with a JSON response containing the quote
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// GET route for editing a specific quote
router.get('/quotes/:id/edit', connectToDB, (req, res) => {
  // Extract the quote ID from the request parameters
  let quoteId = req.params.id;

  // Define the query to find the quote by its ID
  let quoteQuery = { _id: new ObjectId(quoteId) };

  // Log the quote ID to the console
  console.log(quoteId);

  const dbCollection = req.dbCollection;
  // Use findOne to find the quote in the database
  dbCollection.findOne(quoteQuery)
    .then((result) => {
      // Log the result to the console
      console.log('r', result);
      res.render("editQuote", { quote: result });

      // Check if the quote is not found
      if (!result) 
        // If quote is not found, send a 404 status with a JSON response and redirect to the home page
        return res.status(404).json({ message: `Cannot find quote with ID ${quoteId}` }).redirect("/quotes");
      // } else {
      //   // If the quote is found

      //   // Check if the request's accept header indicates JSON format
      //   const acceptHeader = req.headers['accept'];
      //   if (acceptHeader && acceptHeader.includes('application/json')) {
      //     // If JSON format is requested, send a 200 status with a JSON response containing the quote
      //     return res.status(200).json(result);
      //   } else {
      //     // If HTML format is requested, render the edit-quote.ejs template with the quote data
      //     res.render("edit-quote.ejs", { quote: result });
      //   }
      // }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

// ----------------------------------------------------------------------------

// Update -----------------------------------------------------------------
router.put('/quotes/:id', connectToDB, (req, res) => {
  const quoteId = req.params.id;
  const quoteQuery = { _id: new ObjectId(quoteId) };
  const quoteData = req.body;
  console.log('Updated Quote Data:', quoteData);

  const dbCollection = req.dbCollection;
  dbCollection.findOneAndUpdate(quoteQuery, { $set: quoteData }, { upsert: true, returnOriginal: false })
    .then((result) => {
      console.log("updateResult",quoteData);
      // res.send({quoteData})
      result = Object.assign({}, quoteQuery, quoteData);
      if (!result.value) 
        return res.status(404).json({ message: `Cannot update quote with ID ${quoteId}` });
      // return res.status(200).json(result.value);
    })
    .catch((e) => {
      console.error(`Error updating quote ${quoteId}`, e);
      res.status(500).send('Server error');
    });

});
// ----------------------------------------------------------------------------

// Delete ---------
// DELETE route to delete a specific quote by its id
router.delete('/quotes/:id/delete', connectToDB, (req, res) => {
  console.log('DRR:', req.body)
  const quoteId = req.params.id;
  const quoteQuery = { _id: new ObjectId(quoteId) };
  const quoteData = req.body;
  console.log('Delete Quote Data:', quoteData);
  
  const dbCollection = req.dbCollection;
  dbCollection.deleteOne(quoteQuery, quoteData)
  .then(result => {
    console.log('Delete Quote Data:', quoteData);
    console.log('dr',{...result})
    if (result.deletedCount === 0) {
      res.json({message: 'No record of that quote was found.'});
    } else {
      console.log('Deleted', result, quoteData);
      res.status(200).json(result)
    }
  })
  .catch((e) => {
    console.error(`Error deleting quote ${quoteId}`, e);
    res.status(500).send('Server error');
  });
});

// Export router(s)
module.exports = router;

// Test server.js
console.log('(COMPLETED) Quotes:  Create, Read, Update & Delete');
// ----------------------------------------------------------------------------