/* File for different parameters according to the node env */
require('dotenv').config();

config = {
    "development": {
        DBConnect: process.env.MONGO_DEV_URI
    },
    "test": {
        DBConnect: process.env.MONGO_TEST_URI
    }
}

module.exports = config;