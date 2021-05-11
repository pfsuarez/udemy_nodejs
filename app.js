// const http = require("http");
// const routes = require("./routes");

import http from "http";
import routes from "./routes.js";


const server = http.createServer(routes);

server.listen(3000);
