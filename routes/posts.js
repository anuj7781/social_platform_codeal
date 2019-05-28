const express = require('express');
const router = express.Router();
const passport  = require('passport');

const postController = require('../controllers/posts_controller');

// second level of check not allowing the user to post if he is not authenticated
router.post('/create',passport.checkAuthentication,postController.create);

module.exports = router;