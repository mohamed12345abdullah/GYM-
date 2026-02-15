
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Logger from './utils/logger.js';
import path from 'path';
dotenv.config();


import connectDB from './utils/connectMongoose.js';
connectDB();



const app = express()

import cors from 'cors';
app.use(cors());

// app.use("/", express.static(path.join(import.meta.dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

 


//import routers

import userRouter from './users/userRouter.js'
import authRouter from './auth/authRouter.js'
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
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




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`https//localhost:${process.env.PORT}`);
    
})

