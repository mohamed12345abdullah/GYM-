
import express from 'express';
import * as userController from './userController.js';


const router = express.Router();


router.route('/')
    .post(userController.createUser)

    .get(userController.getAllUsers)



router.route("/:id")
    .put(userController.editUser)
    .delete(userController.deleteUser)
    .get(userController.getUserById)
    .patch(userController.changePassword);



 

export default router;
