/** @format */

import express from 'express';
import { validator } from "../utils/validator.js"
import { UserLoginSchema, UserPatchSchema, UserPostSchema } from "../validators/Users.js"
import { isLoggedIn } from "../auth/IsloggedIn.js"
import {deleteUser, getAllUsers, getOneUser, login, register, updateUser} from "../controllers/users.js"



const router = express.Router();

router.get('/users', isLoggedIn, getAllUsers);


router.get('/users/:userId', isLoggedIn,getOneUser );


router.post('/register', validator(UserPostSchema), register );


router.post('/login', validator(UserLoginSchema), login );

router.patch('/users/:id', isLoggedIn, validator(UserPatchSchema), updateUser );


router.delete('/users/:id', isLoggedIn , deleteUser );

export default router;
