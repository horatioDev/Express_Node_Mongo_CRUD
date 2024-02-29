// Create server for browser use w/ express
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { connectToDB } = require('../../../middlewares/connectDatabase.js');
// ----------------------------------------------------------------------------

// Create ----------
// POST route for adding a new post
router.post('/posts', connectToDB, (req, res) => {
  // Log the request body
  console.log('rb', req.body);

  const dbCollection = req.dbCollection;
  // Add the received post to the database collection
  dbCollection.insertOne(req.body)
    .then(result => {
      // Redirect the browser to the home page after successfully adding the post
      res.redirect('/posts');
    })
    .catch(err => {
      // Log any errors to the console
      console.error(err);
    });
});
// ----------------------------------------------------------------------------

// Read ---------
// Home page route
// router.get('/', connectToDB, (req, res) => {

//   const dbCollection = req.dbCollection;
//   // Retrieve posts from the database
//   dbCollection.find()
//     .toArray() // Convert MongoDB cursor to array
//     .then(results => {
//       // Render the home page with the retrieved posts
//       res.render('index', { posts: results });

//       // Alternative approach: Determine the response format based on the request accept header
//       // if (req.accepts('html')) {
//       //   res.status(200).render('index.ejs', { posts: results });
//       // } else {
//       //   res.status(200).json({ posts: results });
//       // }
//     })
//     .catch(err => {
//       // Log any errors to the console
//       console.error(err);
//       // Send a 500 response for any internal server errors
//       res.status(500).send('Internal Server Error');
//     });
// });

// GET route for retrieving all posts
router.get('/posts', connectToDB, (req, res) => {
  
  const dbCollection = req.dbCollection;
  // Retrieve all posts from the database collection
  dbCollection.find()
    .toArray()
    .then(results => {
      // Log the results to the console
      console.log(results);
      res.render('postsList', {
        title: "Posts List",
        posts: results,
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

// Route to retrieve all posts by ID
router.get('/posts/:id', connectToDB, (req, res) => {
  // Extract the post ID from the request parameters
  let postId = req.params.id;

  // Define the query to find the post by its ID
  let postQuery = { _id: new ObjectId(postId) };

  const dbCollection = req.dbCollection;
  // Use findOne to find the post in the database
  dbCollection.findOne(postQuery)
    .then((result) => {
      // Log the result to the console
      // console.log('r', result);

      // Check if the post is not found
      if (!result) {
        // If post is not found, send a 404 status with a JSON response
        return res.status(404).json({ message: `Cannot find post with ID ${postId}` });
      } else {
        // If the post is found, send a 200 status with a JSON response containing the post
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// GET route for editing a specific post
router.get('/posts/:id/edit', connectToDB, (req, res) => {
  // Extract the post ID from the request parameters
  let postId = req.params.id;

  // Define the query to find the post by its ID
  let postQuery = { _id: new ObjectId(postId) };

  // Log the post ID to the console
  console.log(postId, postQuery);

  const dbCollection = req.dbCollection;
  // Use findOne to find the post in the database
  dbCollection.findOne(postQuery)
    .then((result) => {
      // Log the result to the console
      console.log('r', result);
      res.render("editPost", { post: result });

      // Check if the post is not found
      if (!result) 
        // If post is not found, send a 404 status with a JSON response and redirect to the home page
        return res.status(404).json({ message: `Cannot find post with ID ${postId}` }).redirect('/posts');
    })
    .catch((err) => {
      // Log any errors to the console and send a 500 status with a JSON response indicating internal server error
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});
// ----------------------------------------------------------------------------

// Update -----------------------------------------------------------------
router.put('/posts/:id', connectToDB, (req, res) => {
  const postId = req.params.id;
  const postQuery = { _id: new ObjectId(postId) };
  const postData = req.body;
  console.log('Updated Post Data:', postData);

  const dbCollection = req.dbCollection;
  dbCollection.findOneAndUpdate(postQuery, { $set: postData }, { upsert: true, returnOriginal: false })
    .then((result) => {
      console.log("updateResult", postData);
      // res.send({postData})
      result = Object.assign({}, postQuery, postData);
      if (!result.value) 
        return res.status(404).json({ message: `Cannot update post with ID ${postId}` });
      // return res.status(200).json(result.value);
    })
    .catch((e) => {
      console.error(`Error updating post ${postId}`, e);
      res.status(500).send('Server error');
    });

});
// ----------------------------------------------------------------------------

// Delete -----------
// DELETE route to delete a specific post by its id
router.delete('/posts/:id/delete', connectToDB, (req, res) => {
  console.log('DRR:', req.body)
  const postId = req.params.id;
  const postQuery = { _id: new ObjectId(postId) };
  const postData = req.body;
  console.log('Delete Post Data:', postData);

  const dbCollection = req.dbCollection;
  dbCollection.deleteOne(postQuery, postData)
    .then(result => {
      console.log('Delete Post Data:', postData);
      console.log('dr', { ...result })
      if (result.deletedCount === 0) {
        res.json({ message: 'No record of that post was found.' });
      } else {
        console.log('Deleted', result, postData);
        res.status(200).json(result)
      }
    })
    .catch((e) => {
      console.error(`Error deleting post ${postId}`, e);
      res.status(500).send('Server error');
    });
});

// Export router(S)
module.exports = router;
// Test server
console.log('(COMPLETED) Posts:  Create, Read, Update & Delete');
// ----------------------------------------------------------------------------