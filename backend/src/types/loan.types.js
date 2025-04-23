"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepaymentTerms = exports.LoanStatus = void 0;
// Enum for loan status (shared across frontend/backend)
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["PENDING"] = "pending";
    LoanStatus["APPROVED"] = "approved";
    LoanStatus["REJECTED"] = "rejected";
    LoanStatus["DEFAULTED"] = "defaulted";
    LoanStatus["PAID"] = "paid";
})(LoanStatus || (exports.LoanStatus = LoanStatus = {}));
var RepaymentTerms;
(function (RepaymentTerms) {
    RepaymentTerms["THREE_MONTHS"] = "3_months";
    RepaymentTerms["SIX_MONTHS"] = "6_months";
    RepaymentTerms["TWELVE_MONTHS"] = "12_months";
    RepaymentTerms["TWENTY_FOUR_MONTHS"] = "24_months";
})(RepaymentTerms || (exports.RepaymentTerms = RepaymentTerms = {}));
