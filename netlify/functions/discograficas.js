"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const headers = require("./headerCORS");
const clientPromise = require("./mongoDB");
const DB_NAME = "JazzLegendsApp";
const PUBLISHER_COLECTION = "discograficas";
const ALBUMS_COLECTION = "albums";

const app = express.Router();

app.get("/", async (req, res) => {
  try {
    const client = await clientPromise;

    const discograficas = await client
      .db(DB_NAME)
      .collection(PUBLISHER_COLECTION)
      .find({})
      .toArray();
    res.json(discograficas);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.options("/", (req, res) => {
  res.json({ statusCode: 200, headers, body: "OK" });
});

app.get("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    console.log("params: ", req.params.id);
    const publisher = await client
      .db(DB_NAME)
      .collection(PUBLISHER_COLECTION)
      .find({ _id: parseInt(req.params.id) })
      .toArray();
    res.json(publisher);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.get("/:id/albums", async (req, res) => {
  try {
    const client = await clientPromise;

    const albums = await client
      .db(DB_NAME)
      .collection(ALBUMS_COLECTION)
      .find({ id_discografica: parseInt(req.params.id) })
      .toArray();
    res.json(albums);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    console.log("request body: ", req.body);
    let data = req.body;
    data._id = parseInt(data._id);

    console.log("this is the data: ", data);
    await client.db(DB_NAME).collection(PUBLISHER_COLECTION).insertOne(data);

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    console.log(req.body);
    let data = req.body;
    const id = parseInt(data._id);
    data._id = id;
    await client
      .db(DB_NAME)
      .collection(PUBLISHER_COLECTION)
      .updateOne({ _id: id, $set: data });

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    const id = parseInt(req.params.id);

    await client
      .db(DB_NAME)
      .collection(PUBLISHER_COLECTION)
      .deleteOne({ _id: id });

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/discograficas", app);
module.exports = exp;
module.exports.handler = serverless(exp);
