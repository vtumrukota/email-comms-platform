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
  reply_to?: string;
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

export const ALERTS = {
  SUCCESS: 'Your Email was sent successfully!',
  API_ERROR: 'Sorry, both Email providers are down. Please try again later.',
  INVALID_REQUEST: 'Please fill out every field and use valid Email addresses.'
};

export const EMAIL_FIELDS_TEXT = {
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
