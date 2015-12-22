import { argv } from 'yargs';
import express from 'express'; // Web framework
import path from 'path'; // Utilities for dealing with file paths
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import uniqid from 'uniqid';

import toolsApi from './api/tools';
import stubTools from './stubs/tools.json';
import projectConfig from './config';

// Schemas
import { UserModel } from './schemas';

const applicationRoot = __dirname;
const app = express(); // define server
const STUB_MODE = !!argv.stub;

// parses request body and populates request.body
app.use(bodyParser.urlencoded({ extended: true }));
// where to serve static content
app.use(express.static(path.join(applicationRoot, './public')));


/* *******
 DATABASE
 See:
  - http://stackoverflow.com/questions/11101955/mongodb-schema-design-for-multible-auth-user-accounts
********** */
const db = mongoose.connect('mongodb://localhost/the_kiki_s_social_network');
const UserInstance = new UserModel({
  username: `username`,
  email: `mickey.${uniqid()}@disney.com`,
  password: `${uniqid()}-mickey`,
});

UserInstance.save(function (err) {
  console.log(err);
});

db.connection.on('error', () => {
  console.log('connection failed to the database');
});
db.connection.on('open', () => {
  console.log('connection established to the database');
});


/* ******************
 ROUTES FOR OUR API
******************* */
// Docs: http://expressjs.com/guide/routing.html

// get an instance of the express Router
const router = express.Router(); // eslint-disable-line

// test route to make sure everything is working (accessed at GET http://localhost:9000/api)
router.get('/', (request, response) => {
  response.json({ message: 'hooray! welcome to our api!' });
});

router.route('/tools')
  // Get a list of tools
  .get((request, response) => {
    if (STUB_MODE) { // if stub enabled
      return response.json(stubTools);
    }
    response.status(200).json(toolsApi);
  })
  // Post a tool
  .post((request, response) => {
    const tools = toolsApi;
    const tool = request.body;

    tool.id = uniqid();
    tools.push(tool);
    response.status(200).json(tools);
  });

router.route('/tools/:id')
  // Get one tool
  .get((request, response) => {
    const tools = toolsApi;
    const count = tools.length;
    const toolId = request.params.id;

    for (let i = 0; i < count; i++) {
      if (tools[i].id == toolId) { // eslint-disable-line
        return response.status(200).json(tools[i]);
      }
    }
  })
  // Delete a tool
  .delete((request, response) => {
    const tools = toolsApi;
    const count = tools.length;
    const toolId = request.params.id;

    for (let i = 0; i < count; i++) {
      if (tools[i].id == toolId) { // eslint-disable-line
        tools.splice(i, 1);
        return response.status(200).json(tools);
      }
    }
    response.status(404).send('Not deleted');
  });

// all of our routes will be prefixed with /api
app.use('/api', router);

/* ****************
 START THE SERVER
***************** */

app.listen(projectConfig.SERVER_PORT, () => {
  console.log(`Express server listening on projectConfig.SERVER_PORT ${projectConfig.SERVER_PORT} in ${app.settings.env} node`);
});
