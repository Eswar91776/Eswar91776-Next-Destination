const express = require('express');
const router = express.Router();

//Posts

//index
router.get('/', (req, res) => {
  res.send('get of posts');
});

//show 
router.get('/:id', (req, res) => {
  res.send("get for show post id" + req.params.id);
});

//post - route for creating post
router.post('/', (req, res) => {
  res.send('post for posts');
});

//delete - route for deleting post
router.delete('/:id', (req, res) => {
  res.send("delete for post id " + req.params.id);
});

module.exports = router;    