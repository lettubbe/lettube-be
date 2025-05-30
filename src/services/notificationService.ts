import axios from "axios";
import {
  IPushNotificationBody,
  MailOptions,
  SmsOptions,
} from "../lib/interfaces/notification.interface";
import config from "../config";
import Device from "../models/Auth/Devices";
import expo from "../providers/expoProvider";
import mailjet from "../providers/mailjetProvider";

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
            // Email: "lwsrehearsal@gmail.com",
            Email: 'rosmonpro@gmail.com',
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
    
    if (device) {
      const notificationPayload = {
        to: device.deviceToken,
        title: input.title,
        body: input.description,
        data: {
          ...input.metadata,              
        },
      };

      try {
      
        const response = await expo.sendPushNotificationsAsync([notificationPayload]);

        console.log("response expo", response);

      } catch (error) {
        console.error("Failed to send notification:", error);
      }
      
    }
  }
}

export default NotificationService;