import http from "http"
/* express: Node.js 환경에서 API 서버를 개발할 때 사용할 수 있는 웹 프레임워크. HTTP를 기반으로 동작함. */
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);

const handleListen = () => console.log("Listening on http://localhost:3000");
server.listen(3000, handleListen);