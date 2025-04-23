"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateUserRole = void 0;
exports.registerUser = registerUser;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
//Register a new user
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1️⃣ Get validation errors from the request
        const errors = (0, express_validator_1.validationResult)(req);
        // 2️⃣ If there are validation errors, return them to client
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: errors.array(),
            });
        }
        try {
            // Get the user data from the request body
            const { email, password, firstName, lastName } = req.body;
            //check if the user already exists
            const existingUser = yield user_model_1.default.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
            }
            //Create a new user instance and save it to the database
            const newUser = yield user_model_1.default.create({
                email,
                password,
                firstName,
                lastName,
            });
            // Modify the returned user object to exclude the password
            const _a = newUser.toObject(), { password: savedPassword } = _a, others = __rest(_a, ["password"]);
            //Generate a JWT token for the user
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
            // Set token as HTTP-only cookie
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true in production
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            // Send the user data and token as a response
            res.status(201).json({
                message: 'User registered successfully',
                user: others,
                token,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    });
}
//update user role
// This function updates the role of a user in the database
// It checks if the requestor is a superadmin before allowing the update
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1️⃣ Get user ID from request parameters
        const { userId, role } = req.body;
        // 2️⃣ Check if the requestor is a superadmin
        const requestor = yield user_model_1.default.findById(req.userId);
        if (((_a = requestor === null || requestor === void 0 ? void 0 : requestor.role) === null || _a === void 0 ? void 0 : _a.toString()) !== 'superadmin') {
            res.status(403).json({ message: 'Only superadmins can modify roles' });
            return;
        }
        // 3️⃣ Find the user by ID
        const user = yield user_model_1.default.findByIdAndUpdate(userId, { role }, { new: true } // Return the updated user
        ).select('-password'); // Exclude password from the response
        // 4️⃣ Check if user was found
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User role updated successfully', user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});
exports.updateUserRole = updateUserRole;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all users from the database
        const users = yield user_model_1.default.find({}).select('-password');
        res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
exports.getAllUsers = getAllUsers;
