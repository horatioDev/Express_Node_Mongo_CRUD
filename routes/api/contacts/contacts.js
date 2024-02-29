// Create server for browser use w/ express
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { connectToDB } = require('../../../middlewares/connectDatabase.js');
// ----------------------------------------------------------------------------

// Create -----------
// POST route for adding a new contact
router.post('/contacts', connectToDB, (req, res) => {
  // Log the request body
  console.log('rb', req.body);

  const dbCollection = req.dbCollection;
  // Add the received contact to the database collection
  dbCollection.insertOne(req.body)
    .then(result => {
      // Redirect the browser to the home page after successfully adding the contact
      res.redirect('/contacts');
    })
    .catch(err => {
      // Log any errors to the console
      console.error(err);
    });
});

// Read ----------
// Home page route
// router.get('/', connectToDB, (req, res) => {

//   // Retrieve contacts from the database
//   contactsCollection.find()
//     .toArray() // Convert MongoDB cursor to array
//     .then(results => {
//       // Render the home page with the retrieved contacts
//       res.render('index', { contacts: results });

//       // Alternative approach: Determine the response format based on the request accept header
//       // if (req.accepts('html')) {
//       //   res.status(200).render('index.ejs', { contacts: results });
//       // } else {
//       //   res.status(200).json({ contacts: results });
//       // }
//     })
//     .catch(err => {
//       // Log any errors to the console
//       console.error(err);
//       // Send a 500 response for any internal server errors
//       res.status(500).send('Internal Server Error');
//     });
// });

// GET route for retrieving all contacts
router.get('/contacts', connectToDB, (req, res) => {
  const dbCollection = req.dbCollection;
  
  // Retrieve all contacts from the database collection
  dbCollection.find()
    .toArray()
    .then(results => {
      // Log the results to the console
      console.log(results);
      res.render('contactsList', {
        title: "Contacts List",
        contacts: results,
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

// GET route to retrieve contacts by ID
router.get('/contacts/:id', connectToDB, (req, res) => {
  // Extract the contact ID from the request parameters
  let contactId = req.params.id;

  // Define the query to find the contact by its ID
  let contactQuery = { _id: new ObjectId(contactId) };

  const dbCollection = req.dbCollection;
  // Use findOne to find the contact in the database
  dbCollection.findOne(contactQuery)
    .then((result) => {
      // Log the result to the console
      // console.log('r', result);

      // Check if the contact is not found
      if (!result) {
        // If contact is not found, send a 404 status with a JSON response
        return res.status(404).json({ message: `Cannot find contact with ID ${contactId}` });
      } else {
        // If the contact is found, send a 200 status with a JSON response containing the contact
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// GET route for editing a specific contact
router.get('/contacts/:id/edit', connectToDB, (req, res) => {
  // Extract the contact ID from the request parameters
  let contactId = req.params.id;

  // Define the query to find the contact by its ID
  let contactQuery = { _id: new ObjectId(contactId) };

  // Log the contact ID to the console
  console.log(contactId, contactQuery);

  const dbCollection = req.dbCollection;
  // Use findOne to find the contact in the database
  dbCollection.findOne(contactQuery)
    .then((result) => {
      // Log the result to the console
      console.log('r', result);
      res.render("editContact", { contact: result });

      // Check if the contact is not found
      if (!result) 
        // If contact is not found, send a 404 status with a JSON response and redirect to the home page
        return res.status(404).json({ message: `Cannot find contact with ID ${contactId}` }).redirect("/contacts");
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

// Update -----------
// PUT route for updating an existing contact
router.put('/contacts/:id', connectToDB, (req, res) => {
  const contactId = req.params.id;
  const contactQuery = { _id: new ObjectId(contactId) };
  const contactData = req.body;
  console.log('Updated Contact Data:', contactData);

  const dbCollection = req.dbCollection;
  dbCollection.findOneAndUpdate(contactQuery, { $set: contactData }, { upsert: true, returnOriginal: false })
    .then((result) => {
      console.log("updateResult", contactData);
      // res.send({contactData})
      result = Object.assign({}, contactQuery, contactData);
      if (!result.value)
        return res.status(404).json({ message: `Cannot update contact with ID ${contactId}` });
      // return res.status(200).json(result.value).redirect('/contacts')
    })
    .catch((e) => {
      console.error(`Error updating contact ${contactId}`, e);
      res.status(500).send('Server error');
    });

});

// Delete --------------
// DELETE route to delete a specific contact by its id
router.delete('/contacts/:id/delete', connectToDB, (req, res) => {
  console.log('DRR:', req.body)
  const contactId = req.params.id;
  const contactQuery = { _id: new ObjectId(contactId) };
  const contactData = req.body;
  console.log('Delete Contact Data:', contactData);

  const dbCollection = req.dbCollection;
  dbCollection.deleteOne(contactQuery, contactData)
    .then(result => {
      console.log('Delete Contact Data:', contactData);
      console.log('dr', { ...result })
      if (result.deletedCount === 0) {
        res.json({ message: 'No record of that contact was found.' });
      } else {
        console.log('Deleted', result, contactData);
        res.status(200).json(result);
      }
    })
    .catch((e) => {
      console.error(`Error deleting contact ${contactId}`, e);
      res.status(500).send('Server error');
    });
});

// Export router(s)
module.exports = router;

// Test server
console.log('(COMPLETED) Contacts:  Create, Read, Update & Delete');
// ----------------------------------------------------------------------------