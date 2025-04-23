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
exports.canAccessMember = exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const member_model_1 = require("../models/member.model");
/**
 * Middleware to authenticate user based on JWT token
 */
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from header
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Add user to request object for use in route handlers
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.authenticate = authenticate;
/**
 * Middleware to verify admin privileges
 * Must be used after authenticate middleware
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'admin') {
        return res
            .status(403)
            .json({ message: 'Access denied. Admin privileges required' });
    }
    next();
};
exports.isAdmin = isAdmin;
/**
 * Middleware to check if user can access specific member data
 * Must be used after authenticate middleware
 */
const canAccessMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Admin can access any member
        if (req.user.role === 'admin') {
            return next();
        }
        const memberId = req.params.id;
        const userId = req.params.userId || req.query.userId;
        // If we're checking by memberId
        if (memberId) {
            const member = yield member_model_1.Member.findById(memberId);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }
            if (member.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        // If we're checking by userId
        else if (userId) {
            if (userId !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        next();
    }
    catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.canAccessMember = canAccessMember;
