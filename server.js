const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const express = require('express');

const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);

app.use(errorHandler());

app.listen(PORT, () => {
	console.log('Listening on ' + PORT);
});

module.exports = app;
