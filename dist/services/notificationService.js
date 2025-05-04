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
const axios_1 = __importDefault(require("axios"));
const mailjetProvider_1 = __importDefault(require("../providers/mailjetProvider"));
const config_1 = __importDefault(require("../config"));
const expoProvider_1 = __importDefault(require("../providers/expoProvider"));
const Devices_1 = __importDefault(require("../models/Devices"));
const KNOWN_ERRORS = [
    "messaging/invalid-argument",
    "messaging/registration-token-not-registered",
];
class NotificationService {
    static sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = mailjetProvider_1.default.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: {
                            Email: "lwsrehearsal@gmail.com",
                            Name: "lettube",
                        },
                        To: [
                            {
                                Email: options.to,
                                Name: options.to,
                            },
                        ],
                        Subject: options.subject,
                        HTMLPart: options.body,
                    },
                ],
            });
            try {
                const result = yield request;
                console.log("success email", result.body);
            }
            catch (err) {
                console.log("sendEmail Error:", err);
            }
        });
    }
    static sendSms(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.default.isDevelopment) {
                console.log(`Skipping SMS send in development. Message: ${options.text}`);
                return;
            }
            const requestParams = {
                api_key: process.env.TERMII_API_KEY,
                to: options.to,
                sms: options.text,
                from: process.env.TERMII_API_SENDER_ID,
                type: "plain",
                channel: "dnd",
            };
            try {
                const request = yield axios_1.default.post("https://v3.api.termii.com/api/sms/send", requestParams);
                console.log("request sms", request);
            }
            catch (err) {
                console.log("sendSms Error:", err.response.data.message);
            }
        });
    }
    static sendNotification(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield Devices_1.default.findOne({ userId });
            if (device) {
                const notificationPayload = {
                    to: device.deviceToken,
                    title: input.title,
                    body: input.description,
                    data: Object.assign({}, input.metadata),
                };
                try {
                    const response = yield expoProvider_1.default.sendPushNotificationsAsync([notificationPayload]);
                    console.log("response expo", response);
                    // const receipts = await expo.getPushNotificationReceiptsAsync(['019478ca-c108-7fa5-873b-c40aa61d8f45']);
                    // console.log("receipts", receipts);
                }
                catch (error) {
                    console.error("Failed to send notification:", error);
                }
            }
        });
    }
}
exports.default = NotificationService;
