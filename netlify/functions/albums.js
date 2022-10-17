"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const headers = require("./headerCORS");
const clientPromise = require("./mongoDB");
const DB_NAME = "JazzLegendsApp";
const ARTIST_COLECTION = "artistas";
const ALBUMS_COLECTION = "albums";
const PUBLISHER_COLECTION = "discograficas";

const app = express.Router();

app.options("/", (req, res) => {
  res.json({ statusCode: 200, headers, body: "OK" });
});

app.get("/", async (req, res) => {
  try {
    const client = await clientPromise;

    const albums = await client
      .db(DB_NAME)
      .collection(ALBUMS_COLECTION)
      .find({})
      .toArray();
    res.json(albums);
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
    const album = await client
      .db(DB_NAME)
      .collection(ALBUMS_COLECTION)
      .find({ _id: parseInt(req.params.id) })
      .toArray();
    res.json(album);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.post("/", async (req, res) => {
  try {
    const client = await clientPromise;

    let data = req.body;
    data._id = parseInt(data._id);
    data.id_artista = parseInt(data.id_artista);
    data.id_discografica = parseInt(data.id_discografica);

    await client.db(DB_NAME).collection(ALBUMS_COLECTION).insertOne(data);

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const client = await clientPromise;

    let data = req.body;
    const id = parseInt(data._id);
    data._id = id;
    data.id_artista = parseInt(data.id_artista);
    data.id_discografica = parseInt(data.id_discografica);

    await client
      .db(DB_NAME)
      .collection(ALBUMS_COLECTION)
      .updateOne({ _id: id }, { $set: data });

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
      .collection(ALBUMS_COLECTION)
      .deleteOne({ _id: id });

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/albums", app);
module.exports = exp;
module.exports.handler = serverless(exp);
