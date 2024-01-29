import express from 'express';
const router = express.Router();

// Example admin panel route
router.get('/', (req, res) => {
  // This route will render your admin panel page
  res.send('Welcome to the Admin Panel');
});

export default router;
