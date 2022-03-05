import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { addUser, getUser, deleteUser, getUsers } from './user.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors);
app.get('/', (req, res) => {
    req.send('Server is up and running');
})

io.on('connection', (socket) => {
    console.log(`User connection: ${socket.id}`);
    socket.on('join', ({ userId, room }) => {
        console.log(`User join: ${userId} on ${room}`);
        const user = addUser(socket.id, userId, room);
        console.log(getUsers(room));
        socket.join(room);
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.userId} just entered the room` });
        socket.in(room).emit('participant-joined', { user: userId});
    });

    socket.on('sendMessage', message => {
        const user = getUser(socket.id);
        io.in(user.room).emit('message', { user: user.userId, text: message });
    });

    socket.on('disconnect', () => {
        console.log('User discconnect: ', socket.id);
        const user = deleteUser(socket.id);
        console.log(user);
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.userId} just left the room` });
            socket.in(user.room).emit('participant-left', { user: user.id});
        }
    });
})

server.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});
