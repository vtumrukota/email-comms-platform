import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Setup Enviornment Variables
dotenv.config();
const PORT = process.env.PORT || 8080;
// Configure axios
const ax = axios.create({
  timeout: 10000,
  headers: {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${process.env.SENDGRID_KEY}`,
  }
});

// Initialize Server
const app : express.Application = express();
app.listen(PORT, () => {
  console.log('Started server & listening on port: ', PORT);
});
// Send Email POST API
app.post('/api/v1/email', async(req, res, next) => {
  try {
    // console.log('request', request);
    // const resp = await stub();
    const resp = sendgridPost(req);
    console.log('response', resp);
    return res.json(resp);
  } catch (err) {
    console.log('error on POST', err);
    return next(err);
  }
});

const sendgridPost = async(data: any = {}) => {
  try {
    console.log('fired sendgrid data', data, setupSendgridData(data));
    return await ax.post('https://api.sendgrid.com/v3/mail/send', );
  } catch (err) {
    console.log('hit sendgrid error: ', err);
    return err;
  }
}

const setupSendgridData = function(data: any): any {
  return {
    personalizations: [
      {
        to: [
          {
            email: data.to,
            name: data.to_name,
          }
        ],
        subject: data.subject,
      },
    ],
    from: {
      email: data.from,
      name: data.from_name,
    },
    reply_to: {
      email: data.from,
      name: data.from_name,
    },
    content: [
      {
        type: 'text/html',
        value: data.body
      }
    ],
  }
}


const stub = async () => {
  console.log('stub called');
  setTimeout(() => {
    return { success: 'This stub succeeded'}
  }, 2000)
};