// Requires & Imports
require('dotenv').config({ path: `${__dirname}/../.env` });
const MongoClient = require('mongodb').MongoClient;
import express from 'express';
import axios from 'axios';
import { IEmailBEData } from '../frontend/src/app/app.definitions';
import { IPostmarkData, ISendgridData } from './app.definitions';

// Environment variables
const PORT = process.env.PORT || 8080;
const SENDGRID = process.env.SENDGRID_KEY || '';
const POSTMARK = process.env.POSTMARK_KEY || 'POSTMARK_API_TEST';
const MONGO_USER_PW = process.env.MONGO_USER_PW || '';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || '';

// Service API URLs
const sendgridUrl: string = 'https://api.sendgrid.com/v3/mail/send';
const postmarkUrl: string = 'https://api.postmarkapp.com/email';
const mongoAtlasUrl = `mongodb+srv://vivek:${MONGO_USER_PW}@cluster0.w8rbo.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

// Configure clients for both Email services & MongoDB
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
const mdbClient = new MongoClient(mongoAtlasUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Initialize Server
const app : express.Application = express();
app.use(express.json());
app.listen(PORT, () => {
  console.log('Started server & listening on port: ', PORT);
  SENDGRID && POSTMARK ?
    console.log('Loaded API Keys!') :
    console.log('Failed to load API Keys!');
});

// APIs (v1)
app.post('/api/v1/email', async(req, res) => {
  try {
    const resp = await sendgridPost(req.body);
    const mongoData = setupSendgridData(req.body);
    if (MONGO_USER_PW && MONGO_DB_NAME) await storeToMongo(mongoData);
    return res.json(resp.data);
  } catch (err) {
    // If Sendgrid Service fails, try again with Postmark
    try {
      const resp = await postmarkPost(req.body);
      const mongoData = setupPostmarkData(req.body);
      if (MONGO_USER_PW && MONGO_DB_NAME) await storeToMongo(mongoData);
      return res.json(resp.data);
    } catch (err) {
    // If both services fail, return error back to FE
      if (err.response) {
        const errCode: number = err.response.status;
        const data = err.response.data;
        return res.status(errCode).send(data);
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
const storeToMongo = async(email: ISendgridData | IPostmarkData) => {
  try {
    await mdbClient.connect();
    const db = mdbClient.db(process.env.MONGO_DB_NAME);
    const col = db.collection('emails');
    await col.insertOne(email);
  } catch (err) {
    // TODO: Add error logging & retry mechanism for DB write failures
    console.log('Error writing to MongoDB: ', err.stack);
  }
  finally {
    await mdbClient.close();
  }
}

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
