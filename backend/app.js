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
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
// Environment variables
var PORT = process.env.PORT || 8080;
var SENDGRID = process.env.SENDGRID_KEY || '';
var POSTMARK = process.env.POSTMARK_KEY || 'POSTMARK_API_TEST';
// Service API URLs
var sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
var postmarkUrl = 'https://api.postmarkapp.com/email';
// Configure axios for both Email services
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
// Initialize Server
var app = express_1.default();
app.use(express_1.default.json());
app.listen(PORT, function () {
    console.log('Started server & listening on port: ', PORT);
    SENDGRID && POSTMARK ? console.log('Loaded API Keys!') : console.log('Failed to load API Keys!');
});
// APIs (v1)
app.post('/api/v1/email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, err_1, errCode, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, sendgridPost(req.body)];
            case 1:
                resp = _a.sent();
                console.log('HIT SENDGRID AND ESCAPE');
                return [2 /*return*/, res.json(resp.data)];
            case 2:
                err_1 = _a.sent();
                console.log('hitting error block');
                // If Sendgrid Service fails, try again with Postmark
                // try {
                //   const resp = await postmarkPost(req.body);
                //   return res.json(resp);
                // } catch (err) {
                //   // If both services fail, return error back to FE
                if (err_1.response) {
                    errCode = err_1.response.status;
                    data = err_1.response.data;
                    res.status(errCode).send(data);
                    //   } else if (err.request) {
                    //   // TODO: Add error handling for below hooks
                    //     console.log(err.request);
                    //   } else {
                    //     console.log('Error: ', err.message);
                    //   }
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Email Service Calls
var sendgridPost = function (emailData) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = setupSendgridData(emailData);
        console.log(JSON.stringify(data));
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
