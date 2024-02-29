// Create server for browser use w/ express
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { connectToDB } = require('../../../middlewares/connectDatabase.js');
// ----------------------------------------------------------------------------

// Create -----------
// POST route for adding a new task
router.post('/tasks', connectToDB, (req, res) => {
  // Log the request body
  console.log('rb', req.body);

  const dbCollection = req.dbCollection;
  // Add the received task to the database collection
  dbCollection.insertOne(req.body)
    .then(result => {
      // Redirect the browser to the home page after successfully adding the task
      res.redirect('/tasks');
    })
    .catch(err => {
      // Log any errors to the console
      console.error(err);
    });
})
// ----------------------------------------------------------------------------

// Read -------------
// Home page route
// GET route for retrieving all tasks
router.get('/tasks', connectToDB, (req, res) => {

  const dbCollection = req.dbCollection;
  // Retrieve all tasks from the database collection
  dbCollection.find()
    .toArray()
    .then(results => {
      // Log the results to the console
      console.log(results);
      res.render('tasksList', {
        title: "Tasks List",
        tasks: results,
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


// Route to retrieve all tasks by ID
router.get('/tasks/:id', connectToDB, (req, res) => {
  // Extract the task ID from the request parameters
  let taskId = req.params.id;

  // Define the query to find the task by its ID
  let taskQuery = { _id: new ObjectId(taskId) };

  const dbCollection = req.dbCollection;
  // Use findOne to find the task in the database
  dbCollection.findOne(taskQuery)
    .then((result) => {
      // Log the result to the console
      // console.log('r', result);

      // Check if the task is not found
      if (!result) {
        // If task is not found, send a 404 status with a JSON response
        return res.status(404).json({ message: `Cannot find task with ID ${taskId}` });
      } else {
        // If the task is found, send a 200 status with a JSON response containing the task
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// GET route for editing a specific task
router.get('/tasks/:id/edit', connectToDB, (req, res) => {
  // Extract the task ID from the request parameters
  let taskId = req.params.id;

  // Define the query to find the task by its ID
  let taskQuery = { _id: new ObjectId(taskId) };

  // Log the task ID to the console
  console.log(taskId);

  const dbCollection = req.dbCollection;
  // Use findOne to find the task in the database
  dbCollection.findOne(taskQuery)
    .then((result) => {
      // Log the result to the console
      console.log('r', result);
      res.render('editTask', { task: result });

      // Check if the task is not found
      if (!result) 
        // If task is not found, send a 404 status with a JSON response and redirect to the home page
        return res.status(404).json({ message: `Cannot find task with ID ${taskId}` }).redirect("/tasks");
      // } else {
      //   // If the task is found

      //   // Check if the request's accept header indicates JSON format
      //   const acceptHeader = req.headers['accept'];
      //   if (acceptHeader && acceptHeader.includes('application/json')) {
      //     // If JSON format is requested, send a 200 status with a JSON response containing the task
      //     return res.status(200).json(result);
      //   } else {
      //     // If HTML format is requested, render the edit-task.ejs template with the task data
      //     res.render("edit-task.ejs", { task: result });
      //   }
      // }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});
// ----------------------------------------------------------------------------

// Update -----------------------------------------------------------------
router.put('/tasks/:id', connectToDB, (req, res) => {
  const taskId = req.params.id;
  const taskQuery = { _id: new ObjectId(taskId) };
  const taskData = req.body;
  console.log('Updated Task Data:', taskData);

  const dbCollection = req.dbCollection; 
  dbCollection.findOneAndUpdate(taskQuery, { $set: taskData }, { upsert: true, returnOriginal: false })
    .then((result) => {
      console.log("updateResult",taskData);
      // res.send({taskData})
      result = Object.assign({}, taskQuery, taskData);
      if (!result.value)
        return res.status(404).json({ message: `Cannot update task with ID ${taskId}` });
      // return res.status(200).json(result.value);
    })
    .catch((e) => {
      console.error(`Error updating task ${taskId}`, e);
      res.status(500).send('Server error');
    });

});

// ----------------------------------------------------------------------------

// Delete ---------------------------------------------------------------------
router.delete('/tasks/:id/delete', connectToDB, (req, res) => {
  console.log('DRR:', req.body)
  const taskId = req.params.id;
  const taskQuery = { _id: new ObjectId(taskId) };
  const taskData = req.body;
  console.log('Delete Task Data:', taskData);

  const dbCollection = req.dbCollection;
  dbCollection.deleteOne(taskQuery, taskData)
    .then(result => {
      console.log('Delete Task Data:', taskData);
      console.log('dr', { ...result })
      if (result.deletedCount === 0) {
        res.json({ message: 'No record of that task was found.' });
      } else {
        console.log('Deleted', result, taskData);
        res.status(200).json(result)
      }
    })
    .catch((e) => {
      console.error(`Error deleting task ${taskId}`, e);
      res.status(500).send('Server error');
    });
});

// Export pouter(s)
module.exports = router;
// Test server
console.log('(COMPLETED) Tasks:  Create, Read, Update & Delete');
// ------------------------------------------------------------------------------