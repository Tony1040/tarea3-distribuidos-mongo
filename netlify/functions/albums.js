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

// const get_artist = async (artist_id) => {
//   try {
//     const client = await clientPromise;

//     const artist = await client
//       .db(DB_NAME)
//       .collection(ARTIST_COLECTION)
//       .find({ _id: parseInt(artist_id) })
//       .toArray();
//     return artist[0];
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };
// const get_publisher = async (publisher_id) => {
//   try {
//     const client = await clientPromise;

//     const publisher = await client
//       .db(DB_NAME)
//       .collection(PUBLISHER_COLECTION)
//       .find({ _id: parseInt(publisher_id) })
//       .toArray();
//     return publisher[0];
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

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

    const data = req.body;
    data._id = parseInt(data._id);
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

    const data = req.body;
    const id = parseInt(data._id);
    data._id = id;
    await client
      .db(DB_NAME)
      .collection(ALBUMS_COLECTION)
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
