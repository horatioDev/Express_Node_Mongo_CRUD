// Create server for browser use w/ express
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { connectToDB } = require('../../../middlewares/connectDatabase.js');
// ----------------------------------------------------------------------------

// Create ---------
// POST route for adding a new employee
router.post('/employees', connectToDB, (req, res) => {
  // Log the request body
  console.log('rb', req.body);

  const dbCollection = req.dbCollection;
  // Add the received employee to the database collection
  dbCollection.insertOne(req.body)
    .then(result => {
      // Redirect the browser to the home page after successfully adding the employee
      res.redirect('/employees');
    })
    .catch(err => {
      // Log any errors to the console
      console.error(err);
      res.sendStatus(404)
    });
});

// ----------------------------------------------------------------------------

// Read -------
// Home page route
// GET route for retrieving all employees
router.get('/employees', connectToDB, (req, res) => {

  const dbCollection = req.dbCollection;
  // Retrieve all employees from the database collection
  dbCollection.find()
    .toArray()
    .then(results => {
      // Log the results to the console
      console.log(results);
      res.render('employeesList', {
        title: "Employees List",
        employees: results,
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


// Route to retrieve all employees by ID
router.get('/employees/:id', connectToDB, (req, res) => {
  // Extract the employee ID from the request parameters
  let employeeId = req.params.id;

  // Define the query to find the employee by its ID
  let employeeQuery = { _id: new ObjectId(employeeId) };

  const dbCollection = req.dbCollection;
  // Use findOne to find the employee in the database
  dbCollection.findOne(employeeQuery)
    .then((result) => {
      // Log the result to the console
      // console.log('r', result);

      // Check if the employee is not found
      if (!result) {
        // If employee is not found, send a 404 status with a JSON response
        return res.status(404).json({ message: `Cannot find employee with ID ${employeeId}` });
      } else {
        // If the employee is found, send a 200 status with a JSON response containing the employee
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// GET route for editing a specific employee
router.get('/employees/:id/edit', connectToDB, (req, res) => {
  // Extract the employee ID from the request parameters
  let employeeId = req.params.id;

  // Define the query to find the employee by its ID
  let employeeQuery = { _id: new ObjectId(employeeId) };

  // Log the employee ID to the console
  console.log(employeeId, employeeQuery);

  const dbCollection = req.dbCollection;
  // Use findOne to find the employee in the database
  dbCollection.findOne(employeeQuery)
    .then((result) => {
      // Log the result to the console
      console.log('r', result);
      res.render('editEmployee', { employee: result })

      // Check if the employee is not found
      if (!result) 
        // If employee is not found, send a 404 status with a JSON response and redirect to the home page
        return res.status(404).json({ message: `Cannot find employee with ID ${employeeId}` }).redirect("/employees");
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});
// ----------------------------------------------------------------------------

// Update -----------------------------------------------------------------
router.put('/employees/:id', connectToDB, (req, res) => {
  const employeeId = req.params.id;
  const employeeQuery = { _id: new ObjectId(employeeId) };
  const employeeData = req.body;
  console.log('Updated Employee Data:', employeeData);

  const dbCollection = req.dbCollection;
  dbCollection.findOneAndUpdate(employeeQuery, { $set: employeeData }, { upsert: true, returnOriginal: false })
    .then((result) => {
      console.log("updateResult", employeeData);
      // res.send({employeeData})
      // result = Object.assign({}, employeeQuery, employeeData);
      console.log('EData', result, employeeData)
      if (!result.value) 
        return res.status(404).json({ message: `Cannot update employee with ID ${employeeId}` });
      // return res.status(200).json(result.value);
    })
    .catch((e) => {
      console.error(`Error updating employee ${employeeId}`, e);
      res.status(500).send('Server error');
    });

});
// ----------------------------------------------------------------------------

// Delete ---------------------------------------------------------------------
router.delete('/employees/:id/delete', connectToDB, (req, res) => {
  console.log('DRR:', req.body)
  const employeeId = req.params.id;
  const employeeQuery = { _id: new ObjectId(employeeId) };
  const employeeData = req.body;
  console.log('Delete Employee Data:', employeeData);

  const dbCollection = req.dbCollection;
  dbCollection.deleteOne(employeeQuery, employeeData)
    .then(result => {
      console.log('Delete Employee Data:', employeeData);
      console.log('dr', { ...result })
      if (result.deletedCount === 0) {
        res.json({ message: 'No record of that employee was found.' });
      } else {
        console.log('Deleted', result, employeeData);
        res.status(200).json(result)
      }
    })
    .catch((e) => {
      console.error(`Error deleting employee ${employeeId}`, e);
      res.status(500).send('Server error');
    });
});
// Export router(s)
module.exports = router;

// Test server
console.log('Team Tracker:  Create, Read, Update & Delete');
// ----------------------------------------------------------------------------