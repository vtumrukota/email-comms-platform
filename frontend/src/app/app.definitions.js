"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_FIELDS_TEXT = exports.ALERTS = exports.DEFAULT_EMAIL_FORM = exports.EmailFields = void 0;
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
exports.ALERTS = {
    SUCCESS: 'Your Email was sent successfully!',
    API_ERROR: 'Sorry, both Email providers are down. Please try again later.',
    INVALID_REQUEST: 'Please fill out every field and use valid Email addresses.'
};
exports.EMAIL_FIELDS_TEXT = {
    SEND_EMAIL_BELOW: 'Send your Email below: ',
    RECIPIENT_EMAIL: {
        TEXT: 'Recipient Email',
        PLACEHOLDER: 'ex. jumpman23@gmail.com'
    },
    RECIPIENT_NAME: {
        TEXT: 'Recipient Name',
        PLACEHOLDER: 'ex. Michael Jordan',
    },
    SENDER_EMAIL: {
        TEXT: 'Sender Email',
        PLACEHOLDER: 'ex. vtumrukota@gmail.com'
    },
    SENDER_NAME: {
        TEXT: 'Sender Name',
        PLACEHOLDER: 'ex. Vivek Tumrukota',
    },
    SUBJECT: {
        TEXT: 'Subject',
        PLACEHOLDER: 'ex. "Hey there!"',
    },
    MESSAGE: {
        TEXT: 'Message',
        PLACEHOLDER: 'ex. "Lets hang out!"'
    },
    SEND_EMAIL: 'Send Email',
};
