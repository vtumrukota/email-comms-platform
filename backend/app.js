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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Requires & Imports
require('dotenv').config({ path: __dirname + "/../.env" });
var MongoClient = require('mongodb').MongoClient;
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
// Environment variables
var PORT = process.env.PORT || 8080;
var SENDGRID = process.env.SENDGRID_KEY || '';
var POSTMARK = process.env.POSTMARK_KEY || 'POSTMARK_API_TEST';
var MONGO_USER_PW = process.env.MONGO_USER_PW || '';
var MONGO_DB_NAME = process.env.MONGO_DB_NAME || '';
// Service API URLs
var sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
var postmarkUrl = 'https://api.postmarkapp.com/email';
var mongoAtlasUrl = "mongodb+srv://vivek:" + MONGO_USER_PW + "@cluster0.w8rbo.mongodb.net/" + MONGO_DB_NAME + "?retryWrites=true&w=majority";
// Configure clients for both Email services & MongoDB
var sgAxios = axios_1.default.create({
    timeout: 10000,
    headers: {
        'Content-type': 'application/json',
        'Authorization': "Bearer " + SENDGRID,
    }
});
var pmAxios = axios_1.default.create({
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK,
    }
});
var mdbClient = new MongoClient(mongoAtlasUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Initialize Server
var app = express_1.default();
app.use(express_1.default.json());
app.listen(PORT, function () {
    console.log('Started server & listening on port: ', PORT);
    SENDGRID && POSTMARK ?
        console.log('Loaded API Keys!') :
        console.log('Failed to load API Keys!');
});
// APIs (v1)
app.post('/api/v1/email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, mongoData, err_1, resp, mongoData, err_2, errCode, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 11]);
                return [4 /*yield*/, sendgridPost(req.body)];
            case 1:
                resp = _a.sent();
                mongoData = setupSendgridData(req.body);
                if (!(MONGO_USER_PW && MONGO_DB_NAME)) return [3 /*break*/, 3];
                return [4 /*yield*/, storeToMongo(mongoData)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, res.json(resp.data)];
            case 4:
                err_1 = _a.sent();
                _a.label = 5;
            case 5:
                _a.trys.push([5, 9, , 10]);
                return [4 /*yield*/, postmarkPost(req.body)];
            case 6:
                resp = _a.sent();
                mongoData = setupPostmarkData(req.body);
                if (!(MONGO_USER_PW && MONGO_DB_NAME)) return [3 /*break*/, 8];
                return [4 /*yield*/, storeToMongo(mongoData)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/, res.json(resp.data)];
            case 9:
                err_2 = _a.sent();
                // If both services fail, return error back to FE
                if (err_2.response) {
                    errCode = err_2.response.status;
                    data = err_2.response.data;
                    return [2 /*return*/, res.status(errCode).send(data)];
                }
                else if (err_2.request) {
                    // TODO: Add error handling for below hooks
                    console.log(err_2.request);
                }
                else {
                    console.log('Error: ', err_2.message);
                }
                return [3 /*break*/, 10];
            case 10: return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// Email Service Calls
var sendgridPost = function (emailData) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = setupSendgridData(emailData);
        return [2 /*return*/, sgAxios.post(sendgridUrl, data)];
    });
}); };
var postmarkPost = function (emailData) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = setupPostmarkData(emailData);
        return [2 /*return*/, pmAxios.post(postmarkUrl, data)];
    });
}); };
// Helper Methods
var storeToMongo = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var db, col, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, mdbClient.connect()];
            case 1:
                _a.sent();
                db = mdbClient.db(process.env.MONGO_DB_NAME);
                col = db.collection('emails');
                return [4 /*yield*/, col.insertOne(email)];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                err_3 = _a.sent();
                // TODO: Add error logging & retry mechanism for DB write failures
                console.log('Error writing to MongoDB: ', err_3.stack);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, mdbClient.close()];
            case 5:
                _a.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
var setupSendgridData = function (data) {
    return {
        personalizations: [
            {
                to: [{ email: data.to, name: data.to_name }],
                subject: data.subject,
            },
        ],
        from: { email: data.from, name: data.from_name },
        reply_to: { email: data.from, name: data.from_name },
        content: [{ type: 'text/html', value: data.body }],
    };
};
var setupPostmarkData = function (data) {
    var pmData = {
        From: data.from_name + " <" + data.from + ">",
        To: data.to_name + " <" + data.to + ">",
        Subject: data.subject,
        HtmlBody: data.body,
        MessageStream: 'outbound',
    };
    if (data.reply_to)
        pmData.ReplyTo = data.reply_to;
    return pmData;
};
