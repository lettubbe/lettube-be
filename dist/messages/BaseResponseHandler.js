"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponseHandler = ({ res, statusCode, success, message, data = null }) => {
    return res.status(statusCode).json(Object.assign({ success,
        message }, (data && { data })));
};
exports.default = baseResponseHandler;
