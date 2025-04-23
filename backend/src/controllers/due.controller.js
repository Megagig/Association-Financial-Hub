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
exports.getSoftDeletedDues = exports.restoreSoftDeletedDue = exports.softDeleteMultipleDues = exports.softDeleteDue = exports.bulkUpdateDueStatus = exports.bulkCreateDues = exports.getDueById = exports.getUserDues = exports.getAllDues = exports.updateDueStatus = exports.createDue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const due_types_1 = require("../types/due.types");
const user_types_1 = require("../types/user.types");
const due_model_1 = require("../models/due.model");
const member_model_1 = require("../models/member.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const payment_model_1 = require("../models/payment.model");
// / Create a new due
// export const createDue = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId, title, description, amount, type, dueDate, issuedBy } =
//       req.body;
//     // Basic validation
//     if (!userId || !title || !amount || !type || !dueDate || !issuedBy) {
//       res.status(400).json({ message: 'Required fields missing' });
//       return;
//     }
//     // Validate due type
//     if (!Object.values(DueType).includes(type)) {
//       res.status(400).json({
//         message: 'Invalid due type',
//         validTypes: Object.values(DueType),
//       });
//       return;
//     }
//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     // Check if issuer exists and has proper permissions
//     const issuer = await User.findById(issuedBy);
//     if (
//       !issuer ||
//       (issuer.role?.toString() !== UserRole.ADMIN &&
//         issuer.role?.toString() !== UserRole.SUPERADMIN)
//     ) {
//       res.status(403).json({
//         message: 'Not authorized to create dues',
//         required: [UserRole.ADMIN, UserRole.SUPERADMIN],
//         received: issuer?.role,
//       });
//       return;
//     }
//     // Create new due
//     const due = new Due({
//       userId,
//       title,
//       description,
//       amount,
//       type,
//       createdAt: new Date(),
//       dueDate: new Date(dueDate),
//       status: PaymentStatus.PENDING,
//       paidAmount: 0,
//       issuedBy,
//     });
//     // Validate the due date
//     if (due.dueDate <= new Date()) {
//       res.status(400).json({ message: 'Due date must be in the future' });
//       return;
//     }
//     await due.save();
//     // Update member's dues owing
//     const member = await Member.findOne({ userId });
//     if (member) {
//       member.duesOwing = (member.duesOwing || 0) + amount;
//       await member.save();
//     }
//     res.status(201).json({
//       success: true,
//       message: 'Due created successfully',
//       data: due,
//     });
//   } catch (error) {
//     console.error('Error creating due:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating due',
//     });
//   }
// };
// Create a new due with transaction
const createDue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Start a new session
    const session = yield mongoose_1.default.startSession();
    try {
        // Start transaction
        session.startTransaction();
        const { userId, title, description, amount, type, dueDate, issuedBy } = req.body;
        // Basic validation
        if (!userId || !title || !amount || !type || !dueDate || !issuedBy) {
            res.status(400).json({ message: 'Required fields missing' });
            return;
        }
        // Validate due type
        if (!Object.values(due_types_1.DueType).includes(type)) {
            res.status(400).json({
                message: 'Invalid due type',
                validTypes: Object.values(due_types_1.DueType),
            });
            return;
        }
        // Check if user exists
        const user = yield user_model_1.default.findById(userId).session(session);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            yield session.abortTransaction();
            return;
        }
        // Check if issuer exists and has proper permissions
        const issuer = yield user_model_1.default.findById(issuedBy).session(session);
        if (!issuer ||
            (((_a = issuer.role) === null || _a === void 0 ? void 0 : _a.toString()) !== user_types_1.UserRole.ADMIN &&
                ((_b = issuer.role) === null || _b === void 0 ? void 0 : _b.toString()) !== user_types_1.UserRole.SUPERADMIN)) {
            res.status(403).json({
                message: 'Not authorized to create dues',
                required: [user_types_1.UserRole.ADMIN, user_types_1.UserRole.SUPERADMIN],
                received: issuer === null || issuer === void 0 ? void 0 : issuer.role,
            });
            yield session.abortTransaction();
            return;
        }
        // Create new due
        const due = new due_model_1.Due({
            userId,
            title,
            description,
            amount,
            type,
            createdAt: new Date(),
            dueDate: new Date(dueDate),
            status: payment_model_1.PaymentStatus.PENDING,
            paidAmount: 0,
            issuedBy,
        });
        // Validate the due date
        if (due.dueDate <= new Date()) {
            res.status(400).json({ message: 'Due date must be in the future' });
            yield session.abortTransaction();
            return;
        }
        yield due.save({ session });
        // Update member's dues owing
        const member = yield member_model_1.Member.findOne({ userId }).session(session);
        if (member) {
            member.duesOwing = (member.duesOwing || 0) + amount;
            yield member.save({ session });
        }
        // Commit the transaction
        yield session.commitTransaction();
        res.status(201).json({
            success: true,
            message: 'Due created successfully',
            data: due,
        });
    }
    catch (error) {
        // Abort transaction on error
        yield session.abortTransaction();
        console.error('Error creating due:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating due',
        });
    }
    finally {
        // End session
        session.endSession();
    }
});
exports.createDue = createDue;
// Update due status with transaction
const updateDueStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Start a new session
    const session = yield mongoose_1.default.startSession();
    try {
        // Start transaction
        session.startTransaction();
        const { id } = req.params;
        const { status, paidAmount } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid due ID' });
            yield session.abortTransaction();
            return;
        }
        if (status && !Object.values(payment_model_1.PaymentStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid due status' });
            yield session.abortTransaction();
            return;
        }
        const due = yield due_model_1.Due.findById(id).session(session);
        if (!due) {
            res.status(404).json({ message: 'Due not found' });
            yield session.abortTransaction();
            return;
        }
        // If paid amount is provided, update it
        if (paidAmount !== undefined) {
            // Calculate new paid amount
            const newPaidAmount = due.paidAmount + paidAmount;
            // If fully paid, mark as approved
            if (newPaidAmount >= due.amount) {
                due.status = payment_model_1.PaymentStatus.APPROVED;
                due.paidAmount = due.amount;
            }
            else {
                due.paidAmount = newPaidAmount;
            }
            // Update member's dues owing
            const member = yield member_model_1.Member.findOne({ userId: due.userId }).session(session);
            if (member) {
                member.duesOwing = Math.max(0, member.duesOwing - paidAmount);
                member.totalDuesPaid += paidAmount;
                yield member.save({ session });
            }
        }
        else if (status) {
            // Just update the status
            due.status = status;
            // If marking as approved (fully paid), ensure paid amount equals total amount
            if (status === payment_model_1.PaymentStatus.APPROVED &&
                ((_a = due.paidAmount) !== null && _a !== void 0 ? _a : 0) < due.amount) {
                const remainingAmount = due.amount - ((_b = due.paidAmount) !== null && _b !== void 0 ? _b : 0);
                due.paidAmount = due.amount;
                // Update member's dues owing
                const member = yield member_model_1.Member.findOne({ userId: due.userId }).session(session);
                if (member) {
                    member.duesOwing = Math.max(0, member.duesOwing - remainingAmount);
                    member.totalDuesPaid += remainingAmount;
                    yield member.save({ session });
                }
            }
        }
        yield due.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        res.status(200).json(due);
    }
    catch (error) {
        // Abort transaction on error
        yield session.abortTransaction();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    finally {
        // End session
        session.endSession();
    }
});
exports.updateDueStatus = updateDueStatus;
// // Get all dues
// export const getAllDues = async (req: Request, res: Response) => {
//   try {
//     const dues = await Due.find().sort({ dueDate: 1 });
//     res.status(200).json(dues);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Get all dues with pagination
const getAllDues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalDues = yield due_model_1.Due.countDocuments();
        const totalPages = Math.ceil(totalDues / limit);
        const dues = yield due_model_1.Due.find().sort({ dueDate: 1 }).skip(skip).limit(limit);
        res.status(200).json({
            dues,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalDues,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllDues = getAllDues;
// Get user's dues with pagination
const getUserDues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const totalDues = yield due_model_1.Due.countDocuments({ userId });
        const totalPages = Math.ceil(totalDues / limit);
        const dues = yield due_model_1.Due.find({ userId })
            .sort({ dueDate: 1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            dues,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalDues,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserDues = getUserDues;
// Get due by ID
const getDueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid due ID' });
            return;
        }
        const due = yield due_model_1.Due.findById(id);
        if (!due) {
            res.status(404).json({ message: 'Due not found' });
            return;
        }
        res.status(200).json(due);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDueById = getDueById;
// // Update due status
// export const updateDueStatus = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { status, paidAmount } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({ message: 'Invalid due ID' });
//       return;
//     }
//     if (!Object.values(PaymentStatus).includes(status)) {
//       res.status(400).json({ message: 'Invalid due status' });
//       return;
//     }
//     const due = await Due.findById(id);
//     if (!due) {
//       res.status(404).json({ message: 'Due not found' });
//       return;
//     }
//     // If paid amount is provided, update it
//     if (paidAmount !== undefined) {
//       // Calculate new paid amount
//       const newPaidAmount = due.paidAmount + paidAmount;
//       // If fully paid, mark as approved
//       if (newPaidAmount >= due.amount) {
//         due.status = PaymentStatus.APPROVED;
//         due.paidAmount = due.amount;
//       } else {
//         due.paidAmount = newPaidAmount;
//       }
//       // Update member's dues owing
//       const member = await Member.findOne({ userId: due.userId });
//       if (member) {
//         member.duesOwing = Math.max(0, member.duesOwing - paidAmount);
//         member.totalDuesPaid += paidAmount;
//         await member.save();
//       }
//     } else {
//       // Just update the status
//       due.status = status;
//       // If marking as approved (fully paid), ensure paid amount equals total amount
//       if (
//         status === PaymentStatus.APPROVED &&
//         (due.paidAmount ?? 0) < due.amount
//       ) {
//         const remainingAmount = due.amount - (due.paidAmount ?? 0);
//         due.paidAmount = due.amount;
//         // Update member's dues owing
//         const member = await Member.findOne({ userId: due.userId });
//         if (member) {
//           member.duesOwing = Math.max(0, member.duesOwing - remainingAmount);
//           member.totalDuesPaid += remainingAmount;
//           await member.save();
//         }
//       }
//     }
//     await due.save();
//     res.status(200).json(due);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// // Get user's dues
// export const getUserDues = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { userId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       res.status(400).json({ message: 'Invalid user ID' });
//       return;
//     }
//     const dues = await Due.find({ userId }).sort({ dueDate: 1 });
//     res.status(200).json(dues);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Bulk create dues
const bulkCreateDues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Start a new session
    const session = yield mongoose_1.default.startSession();
    try {
        // Start transaction
        session.startTransaction();
        const { dues } = req.body;
        if (!Array.isArray(dues) || dues.length === 0) {
            res.status(400).json({ message: 'Invalid or empty dues array' });
            return;
        }
        const createdDues = [];
        const errors = [];
        const memberUpdates = new Map();
        // Validate all dues first
        for (let i = 0; i < dues.length; i++) {
            const dueData = dues[i];
            const { userId, title, description, amount, type, dueDate, issuedBy } = dueData;
            // Basic validation
            if (!userId || !title || !amount || !type || !dueDate || !issuedBy) {
                errors.push({ index: i, message: 'Required fields missing' });
                continue;
            }
            // Validate due type
            if (!Object.values(due_types_1.DueType).includes(type)) {
                errors.push({
                    index: i,
                    message: 'Invalid due type',
                    validTypes: Object.values(due_types_1.DueType),
                });
                continue;
            }
            // Check if user exists
            const user = yield user_model_1.default.findById(userId).session(session);
            if (!user) {
                errors.push({ index: i, message: 'User not found' });
                continue;
            }
            // Check if issuer exists and has proper permissions
            const issuer = yield user_model_1.default.findById(issuedBy).session(session);
            if (!issuer ||
                (((_a = issuer.role) === null || _a === void 0 ? void 0 : _a.toString()) !== user_types_1.UserRole.ADMIN &&
                    ((_b = issuer.role) === null || _b === void 0 ? void 0 : _b.toString()) !== user_types_1.UserRole.SUPERADMIN)) {
                errors.push({
                    index: i,
                    message: 'Not authorized to create dues',
                    required: [user_types_1.UserRole.ADMIN, user_types_1.UserRole.SUPERADMIN],
                    received: issuer === null || issuer === void 0 ? void 0 : issuer.role,
                });
                continue;
            }
            // Create due object
            const due = new due_model_1.Due({
                userId,
                title,
                description,
                amount,
                type,
                createdAt: new Date(),
                dueDate: new Date(dueDate),
                status: payment_model_1.PaymentStatus.PENDING,
                paidAmount: 0,
                issuedBy,
            });
            // Validate the due date
            if (due.dueDate <= new Date()) {
                errors.push({ index: i, message: 'Due date must be in the future' });
                continue;
            }
            // Track member updates
            if (memberUpdates.has(userId.toString())) {
                memberUpdates.set(userId.toString(), memberUpdates.get(userId.toString()) + amount);
            }
            else {
                memberUpdates.set(userId.toString(), amount);
            }
            yield due.save({ session });
            createdDues.push(due);
        }
        // If there are any errors, abort
        if (errors.length > 0) {
            yield session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Validation errors in bulk creation',
                errors,
            });
            return;
        }
        // Update all members
        for (const [userId, amountToAdd] of memberUpdates.entries()) {
            const member = yield member_model_1.Member.findOne({ userId }).session(session);
            if (member) {
                member.duesOwing = (member.duesOwing || 0) + amountToAdd;
                yield member.save({ session });
            }
        }
        yield session.commitTransaction();
        res.status(201).json({
            success: true,
            message: `Successfully created ${createdDues.length} dues`,
            data: createdDues,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error in bulk creating dues:', error);
        res.status(500).json({
            success: false,
            message: 'Error in bulk creating dues',
        });
    }
    finally {
        session.endSession();
    }
});
exports.bulkCreateDues = bulkCreateDues;
// Bulk update due statuses
const bulkUpdateDueStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Start a new session
    const session = yield mongoose_1.default.startSession();
    try {
        // Start transaction
        session.startTransaction();
        const { updates } = req.body;
        if (!Array.isArray(updates) || updates.length === 0) {
            res.status(400).json({ message: 'Invalid or empty updates array' });
            return;
        }
        const updatedDues = [];
        const errors = [];
        const memberUpdates = new Map();
        // Process all updates
        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            const { dueId, status, paidAmount } = update;
            if (!mongoose_1.default.Types.ObjectId.isValid(dueId)) {
                errors.push({ index: i, message: 'Invalid due ID' });
                continue;
            }
            if (status && !Object.values(payment_model_1.PaymentStatus).includes(status)) {
                errors.push({
                    index: i,
                    message: 'Invalid due status',
                    validValues: Object.values(payment_model_1.PaymentStatus),
                });
                continue;
            }
            const due = yield due_model_1.Due.findById(dueId).session(session);
            if (!due) {
                errors.push({ index: i, message: 'Due not found' });
                continue;
            }
            let paymentToRecord = 0;
            // If paid amount is provided, update it
            if (paidAmount !== undefined) {
                // Calculate new paid amount
                const newPaidAmount = due.paidAmount + paidAmount;
                paymentToRecord = paidAmount;
                // If fully paid, mark as approved
                if (newPaidAmount >= due.amount) {
                    due.status = payment_model_1.PaymentStatus.APPROVED;
                    due.paidAmount = due.amount;
                }
                else {
                    due.paidAmount = newPaidAmount;
                }
            }
            else if (status) {
                // Just update the status
                due.status = status;
                // If marking as approved (fully paid), ensure paid amount equals total amount
                if (status === payment_model_1.PaymentStatus.APPROVED &&
                    ((_a = due.paidAmount) !== null && _a !== void 0 ? _a : 0) < due.amount) {
                    paymentToRecord = due.amount - ((_b = due.paidAmount) !== null && _b !== void 0 ? _b : 0);
                    due.paidAmount = due.amount;
                }
            }
            // Track member updates if payment occurred
            if (paymentToRecord > 0) {
                const userId = due.userId.toString();
                if (memberUpdates.has(userId)) {
                    memberUpdates.set(userId, memberUpdates.get(userId) + paymentToRecord);
                }
                else {
                    memberUpdates.set(userId, paymentToRecord);
                }
            }
            yield due.save({ session });
            updatedDues.push(due);
        }
        // If there are any errors, abort
        if (errors.length > 0) {
            yield session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Errors in bulk update',
                errors,
            });
            return;
        }
        // Update all members
        for (const [userId, paymentAmount] of memberUpdates.entries()) {
            const member = yield member_model_1.Member.findOne({ userId }).session(session);
            if (member) {
                member.duesOwing = Math.max(0, member.duesOwing - paymentAmount);
                member.totalDuesPaid += paymentAmount;
                yield member.save({ session });
            }
        }
        yield session.commitTransaction();
        res.status(200).json({
            success: true,
            message: `Successfully updated ${updatedDues.length} dues`,
            data: updatedDues,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error in bulk updating dues:', error);
        res.status(500).json({
            success: false,
            message: 'Error in bulk updating dues',
        });
    }
    finally {
        session.endSession();
    }
});
exports.bulkUpdateDueStatus = bulkUpdateDueStatus;
const softDeleteDue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { id } = req.params;
        const { reason } = req.body;
        // Check if user exists in request
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            yield session.abortTransaction();
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid due ID' });
            yield session.abortTransaction();
            return;
        }
        const due = yield due_model_1.Due.findById(id).session(session);
        if (!due) {
            res.status(404).json({ message: 'Due not found' });
            yield session.abortTransaction();
            return;
        }
        if (due.isDeleted) {
            res.status(400).json({ message: 'Due is already deleted' });
            yield session.abortTransaction();
            return;
        }
        // Update the due document with soft delete information
        due.isDeleted = true;
        due.deletedAt = new Date();
        due.deletedBy = new mongoose_1.default.Types.ObjectId(req.user.id); // Safe to access after check
        due.deletionReason = reason || 'No reason provided';
        yield due.save({ session });
        yield session.commitTransaction();
        res.status(200).json({
            success: true,
            message: 'Due successfully soft deleted',
            dueId: id,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error during soft delete:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to soft delete due',
        });
    }
    finally {
        session.endSession();
    }
});
exports.softDeleteDue = softDeleteDue;
// Soft delete multiple dues
const softDeleteMultipleDues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { ids, reason } = req.body;
        const deletedBy = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 'unknown';
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ message: 'No valid IDs provided for deletion' });
            return;
        }
        // Validate all IDs
        const invalidIds = ids.filter((id) => !mongoose_1.default.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            res.status(400).json({
                message: 'Invalid due IDs found',
                invalidIds,
            });
            return;
        }
        // Find all dues that are not already deleted
        const dues = yield due_model_1.Due.find({
            _id: { $in: ids },
            isDeleted: { $ne: true },
        }).session(session);
        if (dues.length === 0) {
            res.status(404).json({ message: 'No dues found for deletion' });
            return;
        }
        // Update all found dues
        const updatePromises = dues.map((due) => {
            due.isDeleted = true;
            due.deletedAt = new Date();
            due.deletedBy = req.user.id;
            due.deletionReason = reason || 'Bulk deletion - no reason provided';
            return due.save({ session });
        });
        yield Promise.all(updatePromises);
        yield session.commitTransaction();
        res.status(200).json({
            message: `Successfully soft deleted ${dues.length} dues`,
            deletedIds: dues.map((due) => due._id),
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error during bulk soft delete:', error);
        res.status(500).json({
            message: 'Failed to soft delete dues',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
    finally {
        session.endSession();
    }
});
exports.softDeleteMultipleDues = softDeleteMultipleDues;
// Restore a soft deleted due
const restoreSoftDeletedDue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { id } = req.params;
        const restoredBy = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 'unknown';
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid due ID' });
            return;
        }
        const due = yield due_model_1.Due.findById(id).session(session);
        if (!due) {
            res.status(404).json({ message: 'Due not found' });
            return;
        }
        if (!due.isDeleted) {
            res
                .status(400)
                .json({ message: 'Due is not deleted and cannot be restored' });
            return;
        }
        // Restore the due document
        due.isDeleted = false;
        due.deletedAt = undefined;
        due.deletedBy = undefined;
        due.deletionReason = undefined;
        due.restoredAt = new Date();
        due.restoredBy = new mongoose_1.default.Types.ObjectId(restoredBy);
        yield due.save({ session });
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Due successfully restored',
            dueId: id,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error during due restoration:', error);
        res.status(500).json({
            message: 'Failed to restore due',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
    finally {
        session.endSession();
    }
});
exports.restoreSoftDeletedDue = restoreSoftDeletedDue;
// Get all soft deleted dues
const getSoftDeletedDues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalCount = yield due_model_1.Due.countDocuments({ isDeleted: true });
        const softDeletedDues = yield due_model_1.Due.find({ isDeleted: true })
            .populate('deletedBy', 'username email') // Assuming user has these fields
            .sort({ deletedAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            data: softDeletedDues,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    }
    catch (error) {
        console.error('Error fetching soft deleted dues:', error);
        res.status(500).json({
            message: 'Failed to fetch soft deleted dues',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.getSoftDeletedDues = getSoftDeletedDues;
