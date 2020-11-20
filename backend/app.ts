// Requires & Imports
require('dotenv').config({ path: `${__dirname}/../.env` });
import express from 'express';
import axios from 'axios';
import { IEmailBEData } from '../frontend/src/app/app.definitions';
import { IPostmarkData, ISendgridData } from './app.definitions';

// Environment variables
const PORT = process.env.PORT || 8080;
const SENDGRID = process.env.SENDGRID_KEY || '';
const POSTMARK = process.env.POSTMARK_KEY || 'POSTMARK_API_TEST';

// Service API URLs
const sendgridUrl: string = 'https://api.sendgrid.com/v3/mail/send';
const postmarkUrl: string = 'https://api.postmarkapp.com/email';

// Configure axios for both Email services
const sgAxios = axios.create({
  timeout: 10000,
  headers: {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${SENDGRID}`,
  }
});

const pmAxios = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json',
    'X-Postmark-Server-Token': POSTMARK,
  }
})

// Initialize Server
const app : express.Application = express();
app.use(express.json());
app.listen(PORT, () => {
  console.log('Started server & listening on port: ', PORT);
  console.log('Loaded ENV variables: ');
  console.log('Sendgrid Key: ', SENDGRID);
  console.log('Postmark Key: ', POSTMARK);
});

// APIs (v1)
app.post('/api/v1/email', async(req: any, res: any) => {
  try {
    const resp = await sendgridPost(req as any);
    return res.json(resp);
  } catch {
    // If Sendgrid Service fails, try again with Postmark
    try {
      const resp = await postmarkPost(req.body);
      return res.json(resp);
    } catch (err) {
      // If both services fail, return error back to FE
      if (err.response) {
        const errCode: number = err.response.status;
        const data = err.response.data;
        res.status(errCode).send(data);
      } else if (err.request) {
      // TODO: Add error handling for below hooks
        console.log(err.request);
      } else {
        console.log('Error: ', err.message);
      }
    }
  }
});

// Email Service Calls
const sendgridPost = async(emailData: IEmailBEData): Promise<any> => {
  const data = setupSendgridData(emailData);
  return sgAxios.post(sendgridUrl, data);
}

const postmarkPost = async(emailData: IEmailBEData): Promise<any> => {
  const data = setupPostmarkData(emailData);
  return pmAxios.post(postmarkUrl, data);
}

// Helper Methods
const setupSendgridData = function(data: IEmailBEData): ISendgridData {
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
  }
}

const setupPostmarkData = function(data: IEmailBEData): IPostmarkData {
  const pmData: IPostmarkData =  {
    From: `${data.from_name} <${data.from}>`,
    To: `${data.to_name} <${data.to}>`,
    Subject: data.subject,
    HtmlBody: data.body,
    MessageStream: 'outbound',
  };
  if (data.reply_to) pmData.ReplyTo = data.reply_to;
  return pmData;
}
