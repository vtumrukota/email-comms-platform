export interface IEmailForm {
  recipientEmail: string;
  recipientName: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  message: string;
}

export interface IEmailBEData {
  to: string;
  to_name: string;
  from: string;
  from_name: string;
  subject: string;
  body: string;
}

export enum EmailFields {
  RECIPIENT_EMAIL = 'recipientEmail',
  RECIPIENT_NAME = 'recipientName',
  SENDER_EMAIL = 'senderEmail',
  SENDER_NAME = 'senderName',
  SUBJECT = 'subject',
  MESSAGE = 'message',
}

export const DEFAULT_EMAIL_FORM = {
  recipientEmail: '',
  recipientName: '',
  senderEmail: '',
  senderName: '',
  subject: '',
  message: '',
};
