import { argv } from 'yargs';
import express from 'express'; // Web framework
import expressJWT from 'express-jwt';
import path from 'path'; // Utilities for dealing with file paths
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import colors from 'colors';
import morgan from 'morgan';

import toolsApi from './api/tools';
import stubTools from './stubs/tools.json';
import projectConfig from './config';

import indexRoute from './routes/index';
import authRoute from './routes/auth';
import userRoute from './routes/user';

const applicationRoot = __dirname;
const app = express(); // define server
const STUB_MODE = !!argv.stub;
const MONGODB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/the_kiki_s_social_network';
const db = mongoose.connect(MONGODB_URI);
const jwtCheck = expressJWT({
  secret: projectConfig.JWT.secret
});

/* **************
 Configuration
*************** */

// use morgan to log requests to the console
app.use(morgan('dev'))
// parses request body and populates request.body
app.use(bodyParser.urlencoded({ extended: true }));
// where to serve static content
app.use(express.static(path.join(applicationRoot, './public')));
app.use(jwtCheck.unless({
  path: projectConfig.JWT.unless.path
}));

/* *****
 Routes
****** */
// Docs: http://expressjs.com/guide/routing.html

// attaching routes to the application
app.use(indexRoute);
app.use(authRoute);
app.use(userRoute);


/* *******
 Database
******* */

db.connection.on('error', () => {
  console.log('connection failed to the database'.red);
});
db.connection.on('open', () => {
  console.log('connection established to the database'.green);
});


/* ***************
 Start the server
**************** */

app.listen(projectConfig.SERVER_PORT, () => {
  console.log(`Express server listening on projectConfig.SERVER_PORT ${projectConfig.SERVER_PORT} in ${app.settings.env} node`);
});
