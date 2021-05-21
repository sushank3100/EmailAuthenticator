const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, config.get('jwtSecret'), function (error, decodedToken) {
      if (error) {
        return res.status(400).json({ error: 'Incorrect or Exprired Link.' });
      }
      const { name, email, password } = decodedToken;
      // See if user exist
      User.findOne({ email }).exec((error, user) => {
        if (user) {
          console.log(user);
          return res
            .status(400)
            .json({ errors: [{ message: 'user already exists' }] });
        }
        user = new User({
          name,
          email,
          password,
        });
        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        user.save((error, success) => {
          if (error) {
            console.log('error in activation is:', error);
            return res.status(400).json({ error: 'Error Activating Account' });
          }
          res.json({ message: 'Signup Success' });
        });
      });
    });
  } else {
    return res.json({ message: 'Something went wrong!!' });
  }
});
module.exports = router;
