const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Configure CORS for Express
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// Configure CORS for Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins (or set to http://10.100.1.107:8293 for specific)
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("Running");
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    console.log("id: ", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
