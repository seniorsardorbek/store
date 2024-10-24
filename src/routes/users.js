/** @format */

import express from 'express';
import { validator } from "../utils/validator.js"
import { UserLoginSchema, UserPatchSchema, UserPostSchema } from "../validators/Users.js"
import { isLoggedIn } from "../auth/IsloggedIn.js"
import {deleteUser, getAllUsers, getOneUser, login, register, updateUser} from "../controllers/users.js"


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const router = express.Router();
/**
 * @swagger
 * components:'
 * security:
 *       - bearerAuth: []
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - role
 *         - username
 *         - password
 *       properties:
 *        
 *         first_name:
 *           type: string
 *           description: The first name of the user
 *         last_name:
 *           type: string
 *           description: The last name of the user
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: Role of the user
 *         username:
 *           type: string
 *           description: Username for login
 *         password:
 *           type: string
 *           description: User's password
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date of user creation
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: Hammasi hali zor boladi
 */
router.get('/users', isLoggedIn, getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successful response with the user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/users/:userId', isLoggedIn, getOneUser);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */
router.post('/register', validator(UserPostSchema), register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */
router.post('/login', validator(UserLoginSchema), login);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User updated successfully
 *       500:
 *         description: Server error
 */
router.patch('/users/:id', isLoggedIn, validator(UserPatchSchema), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       201:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/users/:id', isLoggedIn, deleteUser);


export default router;
