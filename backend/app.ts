import express from 'express';
import axios from 'axios';

const app : express.Application = express();
const PORT = process.env.PORT || 8080;

let offlineEmails: any[] = [];

// Initialize Server
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
    console.log('sendgrid data', data);
    return await axios.post('https://api.sendgrid.com/v3/mail/send', data);
  } catch (err) {
    console.log('hit sendgrid error: ', err);
    return err;
  }
}


const stub = async () => {
  console.log('stub called');
  setTimeout(() => {
    return { success: 'This stub succeeded'}
  }, 2000)
};