require('dotenv').config();

let HOST = process.env.MONGO_HOST;
let PORT = process.env.MONGO_PORT;
let DB_OLPTIONS = {
  'development': process.env.MONGO_DEV_DB,
  'test': process.env.MONGO_TEST_DB
}
let DB = DB_OLPTIONS[process.env.NODE_ENV]

let CONNECT_STRING = `mongodb://${HOST}:${PORT}/${DB}`;

module.exports = CONNECT_STRING;