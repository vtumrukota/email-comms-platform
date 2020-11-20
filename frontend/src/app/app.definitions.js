"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EMAIL_FORM = exports.EmailFields = void 0;
var EmailFields;
(function (EmailFields) {
    EmailFields["RECIPIENT_EMAIL"] = "recipientEmail";
    EmailFields["RECIPIENT_NAME"] = "recipientName";
    EmailFields["SENDER_EMAIL"] = "senderEmail";
    EmailFields["SENDER_NAME"] = "senderName";
    EmailFields["SUBJECT"] = "subject";
    EmailFields["MESSAGE"] = "message";
})(EmailFields = exports.EmailFields || (exports.EmailFields = {}));
exports.DEFAULT_EMAIL_FORM = {
    recipientEmail: '',
    recipientName: '',
    senderEmail: '',
    senderName: '',
    subject: '',
    message: '',
};
