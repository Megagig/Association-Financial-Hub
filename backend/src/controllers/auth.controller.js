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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Get validation errors from the request
    const errors = (0, express_validator_1.validationResult)(req);
    // 2️⃣ If there are validation errors, return them to client
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array() });
        return;
    }
    // Extract email and password from request body
    const { email, password } = req.body;
    try {
        // Find user by email in database
        const existingUser = yield user_model_1.default.findOne({ email });
        // Check if user exists
        if (!existingUser) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Compare passwords
        const isMatch = yield bcryptjs_1.default.compare(password, existingUser.password);
        // Check if passwords match
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        // Set HTTP cookie with token
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000, // 1 day in milliseconds
        });
        // Remove password from user object before sending
        const userWithoutPassword = {
            _id: existingUser._id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            role: existingUser.role,
        };
        // Return response with user ID
        res
            .status(200)
            .json({ message: 'Login Successfully', user: userWithoutPassword });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.loginUser = loginUser;
