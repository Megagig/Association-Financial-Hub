"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.DueType = void 0;
const payment_types_1 = require("./payment.types"); // this exists in the payment.types.ts file
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return payment_types_1.PaymentStatus; } });
// Enum for due types (shared across frontend/backend)
var DueType;
(function (DueType) {
    DueType["ANNUAL"] = "annual";
    DueType["CONDOLENCE"] = "condolence";
    DueType["WEDDING"] = "wedding";
    DueType["OTHER"] = "other";
})(DueType || (exports.DueType = DueType = {}));
