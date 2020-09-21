const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const api = require('./routes');
const app = express();

const mongoose = require('mongoose');
const dev_db_url = "mongodb+srv://Pavlo:654321bonic@clustercapadastr.wlma4.mongodb.net/MongooseDatabase?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true }
    );
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', api);

const port = 4040;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
