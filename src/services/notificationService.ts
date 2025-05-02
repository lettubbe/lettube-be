import axios from "axios";
import mailjet from "../providers/mailjetProvider";
import {
  IPushNotificationBody,
  MailOptions,
  SmsOptions,
} from "../lib/interfaces/notification.interface";
import config from "../config";
import expo from "../providers/expoProvider";
import Device from "../models/Devices";

const KNOWN_ERRORS = [
  "messaging/invalid-argument",
  "messaging/registration-token-not-registered",
];

class NotificationService {
  public static async sendEmail(options: MailOptions) {
    const request = mailjet.post("send", { version: "v3.1" }).request({
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
      const result = await request;
      console.log("success email", result.body);
    } catch (err) {
      console.log("sendEmail Error:", err);
    }
  }

  public static async sendSms(options: SmsOptions) {

    if (config.isDevelopment) {
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
      const request = await axios.post(
        "https://v3.api.termii.com/api/sms/send",
        requestParams
      );
      console.log("request sms", request);
    } catch (err: any) {
      console.log("sendSms Error:", err.response.data.message);
    }
  }

  public static async sendNotification(
    userId: string,
    input: IPushNotificationBody
  ) {
    
    const device = await Device.findOne({ userId });

    // if (device) {
    //   console.log("expo push notification ran", device.deviceToken);
    //   expo.sendPushNotificationsAsync([
    //     {
    //       to: device.deviceToken,
    //       title: input.title,
    //       body: input.description,
    //       data: { screen: "/rides-request" }
    //     },
    //   ]);
    // }

    
    if (device) {
      // console.log("device 12345", device);
      // Construct the notification payload
      const notificationPayload = {
        to: device.deviceToken,
        title: input.title,
        body: input.description,
        data: {
          ...input.metadata,              
        },
      };

      // console.log("notificationPayload", notificationPayload);
  
      // Send the notification via Expo Push API
      // await expo.sendPushNotificationsAsync([notificationPayload]);

      try {
      
        
        const response = await expo.sendPushNotificationsAsync([notificationPayload]);
        // console.log("response expo", response);

        // const receipts = await expo.getPushNotificationReceiptsAsync(['019478ca-c108-7fa5-873b-c40aa61d8f45']);

        // console.log("receipts", receipts);

      } catch (error) {
        console.error("Failed to send notification:", error);
      }
      
    }
  }
}

export default NotificationService;
