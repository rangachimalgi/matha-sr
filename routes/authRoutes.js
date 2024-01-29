import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { loginUser, getAllUsers, adminLogin } from '../controllers/authController.js';


const router = express.Router()

router.post("/register", registerUser)

router.post("/admin-login", adminLogin)

router.post('/login', loginUser);

router.get('/users', getAllUsers); 

export default router;