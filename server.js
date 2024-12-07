const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

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
        if (newRes) {
          res.writeHead(200, { "content-type": "application/json" });
          res.write(JSON.stringify(newRes));
          res.end();
        } else {
          res.writeHead(404, { "content-type": "text/plain" });
          res.write(`${id} users is not Finded!`);
          res.end();
        }
      })
      .catch((err) => {
        res.writeHead(404, { "content-type": "text/plain" });
        res.write(err);
        res.end;
      });
  } else if (req.url.includes("?") && req.method === "GET") {
    let search = req.url.indexOf("?");
    const queryParams = req.url
      .slice(search + 1)
      .split("=")[1]
      .toLowerCase();
    fs.promises
      .readFile(createPath("db", "users.json"), "utf-8")
      .then((data) => {
        let result = JSON.parse(data);
        let newRes = result.filter(
          (el) => el.firstName.toLowerCase().indexOf(queryParams) > -1
        );

        if (newRes.length) {
          res.writeHead(200, { "content-type": "application/json" });
          res.write(JSON.stringify(newRes));
          res.end();
        } else {
          res.writeHead(404, { "content-type": "text/plain" });
          res.write(`${queryParams} users is not Finded!`);
          res.end();
        }
      })
      .catch((err) => {
        res.writeHead(404, { "content-type": "text/plain" });
        res.write(err);
        res.end;
      });
  } else if (req.url === "/api/users" && req.method === "POST") {
    let body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", () => {
      body = JSON.parse(body[0].toString());
      fs.promises
        .readFile(createPath("db", "users.json"), "utf-8")
        .then((data) => {
          let users = JSON.parse(data);
          users.push(body);
          return fs.promises.writeFile(
            createPath("db", "users.json"),
            JSON.stringify(users)
          );
        })
        .catch((err) => {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write(err);
          res.end();
        });
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

// fetch("http://localhost:3080/api/users", {
//   method: "POST",
//   headers: "Content-type: application/json",
//   body: {
//     id: new Date().getTime().toString(),
//     firstName: "Mike",
//     lastName: "Tyson",
//     age: 50,
//   },
// });
