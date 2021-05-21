const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const mailgun = require('mailgun-js');
const DOMAIN = 'sandboxbdcaf9e7bcd44736a43d12bc6bd0ee34.mailgun.org';
const mg = mailgun({ apiKey: config.get('mailGunApiKey'), domain: DOMAIN });

// @route    POST api/users
// @desc     Register User
// @access   Public

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // See if user exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'user already exists' }] });
      }
      const token = jwt.sign(
        { name, email, password },
        config.get('jwtSecret'),
        { expiresIn: '3000m' }
      );
      const data = {
        from: 'noreply@VNRNetwork.com',
        to: email,
        subject: 'Account Activation Link',
        html: `
              <h2>Please Click on given link to activate your account</h2>
              <p>${config.get('clientUrl')}/api/email-activate/${token}</p>
        `,
      };
      mg.messages().send(data, function (error, body) {
        if (error) {
          return res.json({
            message: error.message,
          });
        }
        return res.json({
          message: 'Email has been sent, kindly activate your account',
        });
      });
      // user = new User({
      //   name,
      //   email,
      //   password,
      // });
      // // Encrypt password

      // const salt = await bcrypt.genSalt(10); //default value 10 more the value more secure

      // user.password = await bcrypt.hash(password, salt);

      // await user.save();

      // // Return jsonwebtoken

      // const payload = {
      //   user: {
      //     id: user.id,
      //   },
      // };

      // jwt.sign(
      //   payload,
      //   config.get('jwtSecret'),
      //   { expiresIn: 36000 },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   }
      // );
      // res.send("User Registerted");
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
