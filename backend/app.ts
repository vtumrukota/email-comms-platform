// Initialize Enviornment Variables & Modules
require('dotenv').config({ path: `${__dirname}/../.env` });
import express from 'express';
import axios from 'axios';

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
app.use(express.json());

app.listen(PORT, () => {
  console.log('Started server & listening on port: ', PORT);
  console.log('key', process.env.SENDGRID_KEY)
});
// Send Email POST API
app.post('/api/v1/email', async(req, res, next) => {
  try {
    const resp = sendgridPost(req.body);
    console.log('response', resp);
    return res.json(resp);
  } catch (err) {
    console.log('error on POST', err);
    return next(err);
  }
});

const sendgridPost = async(emailData: any = {}) => {
  try {
    console.log('fired sendgrid data', emailData);
    const data = setupSendgridData(emailData);
    console.log('DATA TO SENDGRID', data);
    return await ax.post('https://api.sendgrid.com/v3/mail/send', data);
  } catch (err) {
    console.log('hit sendgrid error: ', err);
    return err;
  }
}

const setupSendgridData = function(data: any): any {
  console.log('DATA in SETUP', data);
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
