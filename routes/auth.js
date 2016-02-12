import express from 'express';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens

import projectConfig from '../config';
import { UserModel } from '../schemas';

const router = express.Router(); // eslint-disable-line

// route to create a user (POST http://localhost:9000/api/user/create)
router.post('/user/create', (req, res) => {
  const UserInstance = new UserModel({
    username: `username-${uniqid()}`,
    email: `donald.${uniqid()}@disney.com`,
    password: `${uniqid()}-donald`,
  });

  UserInstance.save(err => {
    if (err) {
      console.log(err);

      const { errors } = err;
      const { email, username } = errors;
      let message = '';

      if (email) {
        message = email.message;
      } else if (username) {
        message = username.message;
      }

      res.status(400)
        .json({ success: false, message });
    } else {
      res.status(201)
        .json({ message: 'Hooray! User created successfully!' });
    }
  });
});

// route to connect a user (POST http://localhost:9000/api/user/login)
router.post('/user/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400)
      .json({ success: false, message: 'You must send the username and the password.' });
  }

  // find the user
  UserModel.findOne({
    email
    // TODO: validated: 1
  }, (err, user) => {
    if (err) console.log(err);

    if (!user) {
      return res.status(401)
        .json({ success: false, message: 'Authentication failed. User not found.' });
    }

    // check if password matches
    if (user.password !== password) {
      return res.status(401)
        .json({ success: false, message: 'Authentication failed. Wrong password.' });
    }

    const { _id, email, slug } = user;

    // if user is found and password is right we create a token
    const token = jwt.sign({ _id, email, slug }, projectConfig.JWT.secret, {
      expiresIn: '2 days'
    });

    // return the information including token as JSON
    res.status(201).json({
      success: true,
      message: 'Hooray! User connected successfully! Enjoy your token!',
      token
    });
  });
});

router.use('/api', router);

export default router;
