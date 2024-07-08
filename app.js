import express from "express";
import {Server} from "socket.io";
import http from "http"; 
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", {id: socket.id, ...data});
        console.log(data);
    });
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
    console.log("Connected");
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`)
});