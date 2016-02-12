import express from 'express';

const router = express.Router(); // eslint-disable-line

router.get('/api', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

export default router;
