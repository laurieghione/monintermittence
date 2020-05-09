This project is a MERN App to help the "intermittent du spectacle" to manage their income easily and friendly.

- Mongo db : Database no SQL
- Express.js : RESTful APIs
- React.js : Javascript Front-end library
- Node.js : A javascript runtime

## Package used

- Material UI
- Auth0
- Mongoose
- Bootstrap
- Styled components
- Moment
- Thunk
- Redux : to create a store with global state

## V1 :

- Form page to create a new active folder
- Form page to add several incomes at this folder
- Delete / update income functionality
- Calculation of different rates
- Autocompletion of employer's names
- Responsive
- Manage upload of documents
- User authentification with JWT

## V2 :

- Archive page to see the old folders
- Add confirmation modal to delete income
- Statistic page with Highcharts
- Add functionality of simulate

### `node index.js`

Api url is : http://localhost:3000/api

Swagger doc coming soon

## Available Scripts

In the project directory, you can run:

### `npm start` to start server and app

Runs the app in the development mode.<br />
Open [http://localhost:8081/](http://localhost:8081) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Environment Variables

a .env file with this variables :

- REACT_APP_AUTH0_DOMAIN is the auth0 domain
- REACT_APP_AUTH0_CLIENT_ID is auth0 client id
- REACT_APP_AUTH0_CALLBACK_URL is app home url for example : http://localhost:8081
- REACT_APP_AUTH0_AUDIENCE is server url for example : http://localhost:3000
- REACT_APP_API_URL is api url for example : http://localhost:3000
