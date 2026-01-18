const express = require('express');
const router = express.Router();

//index - users 
router.get('/', (req, res) => {
  res.send('get of users');
});

//show - user
router.get('/:id', (req, res) => {
  res.send("get for show user id" + req.params.id);
});

//post - route for creating user
router.post('/', (req, res) => {
  res.send('post for users');
});

//delete - route for deleting user
router.delete('/:id', (req, res) => {
  res.send("delete for user id " + req.params.id);
});

module.exports = router;
