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
exports.isSuperAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**Middleware to verify JWT token
and attach user ID to the request object
This middleware checks for the presence of a JWT token in the request cookies,
verifies it, and if valid, extracts the user ID from the token payload.

 */
const verifyToken = (req, res, next) => {
    try {
        // Check for auth token in cookies
        const token = req.cookies.auth_token;
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // Add the decoded user to the request object
        if (typeof decoded === 'object' && 'userId' in decoded) {
            req.userId = decoded.userId;
            next();
        }
        else {
            res.status(401).json({ message: 'Invalid token payload' });
        }
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
// Middleware to check if the user is a superadmin
const isSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.default.findById(req.userId);
        // Convert the Mongoose schema type to string for comparison
        if (!user || ((_a = user.role) === null || _a === void 0 ? void 0 : _a.toString()) !== 'superadmin') {
            res.status(403).json({ message: 'Access denied. Super Admin only.' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Error verifying super admin status' });
    }
});
exports.isSuperAdmin = isSuperAdmin;
