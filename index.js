
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();


import connectDB from './utils/connectMongoose.js';
connectDB();



const app = express()

import cors from 'cors';
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

 


//import routers

import userRouter from './users/userRouter.js'
import authRouter from './auth/authRouter.js'
import exerciseRouter from './Exercises/exerciseRouter.js'

app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`);
    next();
});

 
app.use('/api/user', userRouter) ;
app.use('/api/auth', authRouter);
app.use('/api/exercises', exerciseRouter);
import fs from 'fs';



app.use((err, req, res, next) => {
  // Log error details
  Logger.error("Server Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Send error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "حدث خطأ في الخادم",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});




if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });
}



export default app;
