const io = require('socket.io')(process.env.PORT || 8900, {
    cors:{
        origin: "https://memoire-client.herokuapp.com",
    },
})
let users = [];

const addUser = (userId, socketId) =>{
    !users.some((user)=> user.userId === userId) &&
        users.push({userId, socketId})
};

const removeUser = (socketId)=>{
    users = users.filter((user)=> user.socketId !== socketId);
}

const getUser = (userId)=>{
    return users.find(user=> user.userId === userId)
}
io.on("connection", (socket) => {

    //When a connection
    console.log("utilisateur connecté");
    //io.emit("Bienvenue", "De la part de l'administrateur")
    //Take user id and socket from user
    socket.on("AddUser", userId=>{
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });
    //send and get messages
    socket.on("sendMessage", ({senderId, receiverId, text})=>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId, text
        })
    })
    //When a disconnect
    socket.on("disconnect", () => {
        console.log(" utilisataeur déconnecter");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})