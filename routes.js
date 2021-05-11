//const fs = require("fs");
import fs from "fs";

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write(`<html>
    <head><title>Enter Message</title></head>
    <body>
      <form action="/message" method="POST">
        <input type="text" name="message">&nbsp;<button type="submit">Send</button>
      </form>
    </body>
    </html>`);

    return res.end();
  }
  //console.log(req.url, req.method, req.headers);
  //process.exit();
  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      console.log("", chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write(
    `<html><head><title>Main App</title></head><body><h1>Hello from nodejs server</h1></body</html>`
  );
  res.end();
};

export default requestHandler;

//module.exports = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someOtherHandler: "Some hard coded text"
// };

// module.exports.handler = requestHandler;
// module.exports.someOtherHandler = "Some hardcoded text";

// exports.handler = requestHandler;
// exports.someOtherHandler = "Some hardcoded text";