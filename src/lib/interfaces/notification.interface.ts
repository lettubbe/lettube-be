export type MailOptions = {
    to: string;
    subject: string;
    body: string;
};

export type SmsOptions = {
    to: string;
    text: string;
};

export interface PushNotificationBody {
    title: string
    description: string,
    type: string
    metadata: Record<string, string>;
}