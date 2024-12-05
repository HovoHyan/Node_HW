const http = require("http");
const fs = require("fs");
const path = require("path");

const createPath = (...args) =>
  path.join(__dirname, args.join(",").replaceAll(",", "/"));

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    fs.promises
      .readFile(createPath("pages", "index.html"), "utf-8")
      .then((data) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(data);
        res.end();
      })
      .catch((err) => {
        res.writeHead(404, { "content-type": "text/plain" });
        res.write(err);
        res.end;
      });
  } else if (req.url === "/api/users" && req.method === "GET") {
    fs.promises
      .readFile(createPath("db", "users.json"), "utf-8")
      .then((data) => {
        res.writeHead(200, { "content-type": "application/json" });
        res.write(data);
        res.end();
      })
      .catch((err) => {
        res.writeHead(404, { "content-type": "text/plain" });
        res.write(err);
        res.end;
      });
  } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET") {
    const id = req.url.split("/")[3];
    fs.promises
      .readFile(createPath("db", "users.json"), "utf-8")
      .then((data) => JSON.parse(data))
      .then((result) => {
        let newRes = result.find((el) => el.id === id);
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(newRes));
        res.end();
      })
      .catch((err) => {
        res.writeHead(404, { "content-type": "text/plain" });
        res.write(err);
        res.end;
      });
      
  } else {
  }
});

const port = 3080;
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is runing in ${port} port`);
  }
});
