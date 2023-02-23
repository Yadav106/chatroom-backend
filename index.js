const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data.room);
        console.log(`${data.userName} joined room : ${data.room}`);
        socket.to(data.room).emit("receive_message", {author: data.userName, message: 'User joined room'});
    })

    socket.on('send_message', (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data.content);
    })

    socket.on('leave_room', (data) => {
        socket.leave(data.room);
        socket.to(data.room).emit("receive_message", {author: data.userName, message: 'User left room'});
    })

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
    });
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})