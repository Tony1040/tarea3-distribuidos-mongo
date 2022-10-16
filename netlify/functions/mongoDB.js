"use strict";

const { MongoClient } = require('mongodb');

const client = new MongoClient("mongodb+srv://admin:admin@jazzlegendsapp.zcwsmqr.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,  useUnifiedTopology: true });
  
module.exports = client.connect();