"use strict";

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_CONNECTION_URL,
  { useNewUrlParser: true,  useUnifiedTopology: true });
  
module.exports = client.connect();