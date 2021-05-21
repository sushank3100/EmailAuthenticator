const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// const mailgun = require('mailgun-js');
// const DOMAIN = '';
// const mg = mailgun({ apiKey: config.get('mailGunApiKey'), domain: DOMAIN });

router.put('/', (req, res) => {
  const { newPass, resetLink } = req.body;
  if (resetLink) {
    jwt.verify(
      resetLink,
      config.get('jwtSecret'),
      function (error, decodedData) {
        if (error) {
          return res.status(401).json({
            message: 'Incorrect Token or It is Expired',
          });
        }
        User.findOne({ resetLink }, (error, user) => {
          if (error || !user) {
            return res
              .status(400)
              .json({ error: "User with this Token doesn't exist" });
          }
          const obj = {
            password: newPass,
            resetLink: '',
          };

          // updates with new password here
          user = _.extend(user, obj);
          // Encrypt password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(newPass, salt);
          user.password = hash;
          // console.log(user.password);
          user.save((error, result) => {
            if (error) {
              return res.status(400).json({ error: 'Reset password Error' });
            } else {
              return res.status(200).json({
                message: 'Your Password has been Changed',
              });
            }
          });
        });
      }
    );
  } else {
    return res.status(401).json({ error: 'Autentication Error!!!' });
  }
});
module.exports = router;
