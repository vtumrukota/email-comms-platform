# Email Communications Platform

## Installation & Local Setup
Please clone the repo from Github here:
`git clone https://github.com/vtumrukota/email-comms-platform.git`

Please install Node.js prior to the next steps (https://nodejs.org/en/)

Once you have downloaded the files, you will need to install the NPM packges in both the frontend and backend folders.
  
  - Navigate from the parent directory to both /backend & /frontend and run `npm i`

To start the application, you will need to create a `.env` file to load in the necessary environment variables. You will also need API keys for both Sendgrid & Postmark to send an email out.

The `.env` file should contain the following for the application to work properly:
  PORT=8080
  SENDGRID_KEY=<your_sendgrid_api_key>
  POSTMARK_KEY=<your_postmark_api_key_>
  MONGO_DB_NAME=<mongodb_db_name>
  MONGO_USER_PW=<user_pw>

Once the file is ready, in your terminal you should open two windows for both the backend and frontend processes:
##### To start Frontend:
  `cd frontend`
  `npm start`
##### To start Backend:
  `cd backend`
  `node app.js`

Lastly, navigate in your browser to `localhost:4200` and you should see the app.

## Application Design & Packages
#### Frontend
  * Angular (10)
    - Angular is my frontend framework of choice for building enterprise-grade   applications and its also great to get quick prototypes up and running. It has great built in functionality around HTTP requests and Input Sanitization, which I took advantage of to quickly get a form up and running.
    - The downsize to Angular here is the bundle size is larger than say React's, but its strong 'right-out-of-the-box functionality gives it a competitive edge.
    - Angular Material is a great library I took advantage of that easily plugs in and provides rich UI components (such as input fields and buttons). This also allowed me to easily build a responsive UI without too much extra Sass/CSS code.

#### Backend
  * Node.js
    - Node is great backend choice here to handle this project as the NPM library of packages makes it amazingly easy to get up and running quickly with little code.
  * Express
    - Helped get a backend server with POST API hook up and running quickly and with only a few lines of code
  * Axios
    - Really simple & lightweight package to help make HTTP requests from within your Node.js code
  * Dotenv
    - This easily allows us to use the `.env` file properly and avoid exposing our API keys to our code repository via the `.gitignore`. This was an easy choice to pass these secret keys into the app smoothly and without too much setup.

* TypeScript was used on both ends of the stack. You will see many `defintiions.ts` files across the folders which self-document the code and give the developer a strong sense of the inputs/outouts of each function and the data structures being used across the application. This exposed simple bugs during development and helps ensure the developer can catch their own mistakes in real-time.

#### Features
  * The application doesn't allow an Email service choice as it is automatically going to attempt with Sendgrid and if that fails, it will default to try Postmark. Because of this I did not add an toggle option in the UI to save the user from having to think about it
  * The form will not save unless the user has provided valid emails and filled out every required field
  * The button is guarded against click-spamming and will only fire 1 email at a time synchronously
  * Success and Error Snackbars will appear based on the API call
  * On a successful Email delivery, the email will be stored directly to a MongoDB database being hosted on their Atlas platform
  > `Postmark caveat - I was unable to get my business account approved so Postmark will throw 422 errors at the moment (assuming Sendgrid fails) :(`

## 'Ready for Production' Improvements

#### Frontend
  - Add Translations for our English text for localization
  - Add more Accessibility other than 'aria-label' (i.e. screen reader handling, tabbing through inputs)
  - Custom input errors if user makes bad entries (i.e. invalid email)
  - Take advantage of Angulars FormControl handler to quickly & easily validate the form to ensure all 
  
#### Backend
  - Failed email queue & retry mechanism
    - i.e. if both services fail, the email would enter a queue that would be tracked within a poller running every X seconds to iterate through the queue and retry to send those emails. Upon success they would leave the queue and the poller would only run if the queue had any items
  - Better error handling if MongoDB writes fails
  - Ensure the email body requests dont break upper bounds of the service APIs
