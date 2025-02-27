"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationStatusEnum = exports.NotificationSubType = exports.NotificationEnum = exports.RideRequestType = void 0;
var RideRequestType;
(function (RideRequestType) {
    RideRequestType["TITLE"] = "Ride Request";
    RideRequestType["DESCRIPTION"] = "Ride Request from ";
})(RideRequestType || (exports.RideRequestType = RideRequestType = {}));
;
var NotificationEnum;
(function (NotificationEnum) {
    NotificationEnum["TRANSACTIONS"] = "transactions";
    NotificationEnum["ACTIVITIES"] = "activities";
})(NotificationEnum || (exports.NotificationEnum = NotificationEnum = {}));
;
var NotificationSubType;
(function (NotificationSubType) {
    NotificationSubType["DRIVER_REQUEST"] = "driver request";
})(NotificationSubType || (exports.NotificationSubType = NotificationSubType = {}));
;
var NotificationStatusEnum;
(function (NotificationStatusEnum) {
    NotificationStatusEnum["UNREAD"] = "unread";
    NotificationStatusEnum["READ"] = "read";
})(NotificationStatusEnum || (exports.NotificationStatusEnum = NotificationStatusEnum = {}));
;
