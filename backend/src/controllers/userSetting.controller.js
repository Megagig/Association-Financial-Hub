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
exports.updateUserSettings = exports.getUserSettings = exports.changePassword = exports.updateProfile = exports.updateUserRole = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const UserSettings_model_1 = require("../models/UserSettings.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_types_1 = require("../types/user.types");
const mongoose_1 = __importDefault(require("mongoose"));
// Get all users (superadmin only)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({}).select('-password');
        res.status(200).json({ users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
exports.getAllUsers = getAllUsers;
// Update user role (superadmin only)
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        if (!Object.values(user_types_1.UserRole).includes(role)) {
            res.status(400).json({
                message: 'Invalid role',
                validRoles: Object.values(user_types_1.UserRole),
            });
            return;
        }
        const user = yield user_model_1.default.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user,
        });
    }
    catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});
exports.updateUserRole = updateUserRole;
// Update user profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { firstName, lastName, email } = req.body;
        const user = yield user_model_1.default.findByIdAndUpdate(userId, { firstName, lastName, email }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});
exports.updateProfile = updateProfile;
// Change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Current password is incorrect' });
            return;
        }
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});
exports.changePassword = changePassword;
// Get user settings
const getUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield UserSettings_model_1.UserSettings.findOne({ userId: req.params.userId });
        if (!settings) {
            res.status(404).json({ message: 'Settings not found' });
            return;
        }
        res.status(200).json(settings);
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});
exports.getUserSettings = getUserSettings;
// Update user settings
const updateUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailNotifications, paymentReminders, dueReminders, theme, language, } = req.body;
        const settings = yield UserSettings_model_1.UserSettings.findOneAndUpdate({ userId: req.params.userId }, {
            emailNotifications,
            paymentReminders,
            dueReminders,
            theme,
            language,
        }, { new: true });
        if (!settings) {
            res.status(404).json({ message: 'Settings not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings,
        });
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
});
exports.updateUserSettings = updateUserSettings;
