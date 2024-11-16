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

    // Add handler for the blackOut event
    socket.on("blackOut", ({ targetCaller, isBlackOut }) => {
        console.log(`Received blackOut for ${targetCaller}: ${isBlackOut}`);
        io.to(targetCaller).emit("blackOut", isBlackOut);
    });
});
