const users = [];

export const addUser = (socketId, userId, room) => {
    const existUser = users.find(user => user.userId === userId);
    if (existUser) {
        existUser.room = room;
        return existUser;
    } else {
        const user = { socketId, userId, room };
        users.push(user);
        return user;
    }
};

export const getUser = (socketId) => {
    return users.find(user => user.socketId === socketId);
};

export const deleteUser = (socketId) => {
    const index = users.findIndex(user => user.socketId === socketId);
    if (index !== -1) return users.splice(index, 1)[0];
};

export const getUsers = (room) => {
    return users.filter(user => user.room === room);
};
