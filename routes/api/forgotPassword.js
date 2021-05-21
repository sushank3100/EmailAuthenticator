const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const mailgun = require('mailgun-js');
const DOMAIN = '';
const mg = mailgun({ apiKey: config.get('mailGunApiKey'), domain: DOMAIN });

router.put('/', (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({ error: "User with Email doesn't exist" });
    }
    const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'), {
      expiresIn: '3000m',
    });
    const data = {
      from: 'noreply@VNRNetwork.com',
      to: email,
      subject: 'Password Reset Link',
      html: `
                  <h2>Please Click on given link to reset your password</h2>
                  <p>${config.get('clientUrl')}/api/reset-password/${token}</p>
            `,
    };
    return user.updateOne({ resetLink: token }, function (error, success) {
      if (error) {
        return res.status(400).json({ error: 'Reset password  link error' });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({
              message: error.message,
            });
          }
          return res.json({
            message: 'Email has been sent, kindly follow the instructions',
          });
        });
      }
    });
  });
});
module.exports = router;
