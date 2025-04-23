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
exports.isAdminOrSuperAdmin = exports.canAccessMember = exports.isAdmin = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const member_model_1 = require("../models/member.model");
/**
 * Middleware to verify admin privileges
 * Must be used after verifyToken middleware
 */
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if user is admin
        if (((_a = user.role) === null || _a === void 0 ? void 0 : _a.toString()) !== 'admin') {
            res
                .status(403)
                .json({ message: 'Access denied. Admin privileges required' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ message: 'Error verifying admin status' });
    }
});
exports.isAdmin = isAdmin;
/**
 * Middleware to check if user can access specific member data
 * Must be used after verifyToken middleware
 */
const canAccessMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Admin can access any member
        if (((_a = user.role) === null || _a === void 0 ? void 0 : _a.toString()) === 'admin' ||
            ((_b = user.role) === null || _b === void 0 ? void 0 : _b.toString()) === 'superadmin') {
            return next();
        }
        const memberId = req.params.id;
        const targetUserId = req.params.userId || req.query.userId;
        // If we're checking by memberId
        if (memberId) {
            const member = yield member_model_1.Member.findById(memberId);
            if (!member) {
                res.status(404).json({ message: 'Member not found' });
                return;
            }
            if (member.userId.toString() !== req.userId) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
        }
        // If we're checking by userId
        else if (targetUserId) {
            if (targetUserId !== req.userId) {
                res.status(403).json({ message: 'Access denied' });
                return;
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
const isAdminOrSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield user_model_1.default.findById(req.userId);
        // Allow both admin and superadmin roles
        if (!user ||
            (((_a = user.role) === null || _a === void 0 ? void 0 : _a.toString()) !== 'admin' &&
                ((_b = user.role) === null || _b === void 0 ? void 0 : _b.toString()) !== 'superadmin')) {
            res
                .status(403)
                .json({ message: 'Access denied. Admin or Super Admin only.' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Error verifying admin status' });
    }
});
exports.isAdminOrSuperAdmin = isAdminOrSuperAdmin;
