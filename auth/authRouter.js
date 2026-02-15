

import express from 'express';
import * as authController from './authController.js';
import * as jwt from '../middlewares/jwt.js';

const router=express.Router();
router.post('/login',authController.login);
router.post('/change-password',jwt.auth,authController.changePassword);
router.get('/verify-token',jwt.auth,authController.verifyToken);







export default router;
