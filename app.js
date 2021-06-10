import express from "express";
import bodyParser from "body-parser";

import feedRoutes from "./routes/feed.js";

const app = express();

//app.use(bodyParser.urlencoded()); //x-www-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use("/feed", feedRoutes);

app.listen(8080);