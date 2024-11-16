const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Adjust this as needed for security
        methods: ["GET", "POST"],
    },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Running");
});

io.on("connection", (socket) => {
    console.log("id: ", socket.id);

    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    // Add the blackOut event listener
    socket.on("blackOut", ({ targetCaller, isBlackOut }) => {
        console.log(`Received blackOut for ${targetCaller}: ${isBlackOut}`);
        io.to(targetCaller).emit("blackOut", isBlackOut);
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
