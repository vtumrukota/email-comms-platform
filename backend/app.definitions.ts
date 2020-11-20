export interface ISendgridData {
  personalizations: ISendgridPersonalization[];
  from: IEmailUser;
  reply_to: IEmailUser;
  content: IEmailContent[];
}

interface ISendgridPersonalization {
  to: IEmailUser[];
  subject: string;
}

interface IEmailUser {
  name: string;
  email: string;
}

interface IEmailContent {
  type: string;
  value: string;
}

export interface IPostmarkData {
  From: string;
  To: string;
  ReplyTo?:string;
  Subject: string;
  HtmlBody: string;
  MessageStream: 'outbound' | string;
}