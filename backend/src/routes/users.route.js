"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const user_controller_2 = require("../controllers/user.controller");
const express_validator_1 = require("express-validator");
//Create a new router instance
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.check)('firstName', 'First name is required').isString(),
    (0, express_validator_1.check)('lastName', 'Last name is required').isString(),
    (0, express_validator_1.check)('email', 'Email is required').isEmail(),
    (0, express_validator_1.check)('password', 'Password with six or more characters required').isLength({ min: 6 }),
], user_controller_1.registerUser);
// Define the route for updating user roles
router.put('/:id/role', auth_1.verifyToken, auth_1.isSuperAdmin, user_controller_2.updateUserRole);
router.get('/', auth_1.verifyToken, auth_1.isSuperAdmin, user_controller_2.getAllUsers);
exports.default = router;
