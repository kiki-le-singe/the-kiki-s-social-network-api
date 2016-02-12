import express from 'express';

import { UserModel } from '../schemas';

const router = express.Router(); // eslint-disable-line

// route to return all users (GET http://localhost:9000/api/users)
router.get('/users', (req, res) => {
  UserModel.find({}, (err, users) => {
    res.json(users);
  });
});

router.use('/api', router);

export default router;
