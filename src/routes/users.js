/** @format */

import express from 'express';
import User from '../schemas/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../utils/config/config.js';
import { validator } from "../utils/validator.js"
import { UserLoginSchema, UserPatchSchema, UserPostSchema } from "../validators/Users.js"
import { isLoggedIn } from "../auth/IsloggedIn.js"
import {hasRole} from "../auth/hasRole.js"
const router = express.Router();



router.get('/users', isLoggedIn, async (req, res ) => {
    try {
        

        hasRole(req , res  , ['admin' ])

        let { limit = 10, skip = 0, q, by = 'created_at', order = 'asc' } = req.query || {}
        let filter = {}

        if (q) {
            filter = { username: { $regex: new RegExp(q, 'i') } }
        }

        limit = +limit
        skip = +skip

        const total = await User.countDocuments(filter);
        const data = await User.find(filter).sort({ [by]: order }).limit(limit).skip(limit * skip)
        res.json({ total, data, limit, skip });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

router.get('/users/:userId', isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.params || {};

        const user = await User.findById(userId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});



router.post('/register', validator(UserPostSchema), async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 12);
        const user = new User(req.body);
        const userExist = await User.findOne({ username: req.body?.username });
        if (userExist) {
            return res.status(400).send({ msg: 'Username already exists' });
        }
        await user.save();
        const token = jwt.sign({ id: user.id, role: user.role }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
        res.status(201).json({ data: user, token });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});


router.post('/login', validator(UserLoginSchema), async (req, res) => {
    try {
        console.log(req.body);
        const { username, password } = req.body || {};
        const user = await User.findOne({ username: username });
        console.log(user);

        if (!user) {
            return res.status(401).send({ msg: 'Invalid username or password' });
        }
        const decode = await bcrypt.compare(password, user.password);
        console.log(decode);

        if (!user || !decode) {

            return res.status(401).send({ msg: 'Invalid username or password' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, config.jwt.secret, {

            expiresIn: config.jwt.expiresIn,
        });

        res.json({ data: user, token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
});



router.patch('/users/:id', isLoggedIn, validator(UserPatchSchema), async (req, res) => {
    try {

        const { id } = req.params;
        console.log(id);
        const updated = await User.findByIdAndUpdate(id, { ...req.body });
        res.status(201).json('Updated');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
});



router.delete('/users/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params || {};

    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

export default router;
