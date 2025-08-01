const { Server } = require("socket.io")

let connections = {};
let messages = {};
let timeOnline = {};

const connectToSocket = (server)=>{
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket)=>{
        // socket.on("join-call", (path)=>{
        //     if(connections[path] === undefined){
        //         connections[path] = [];
        //     }
        //     connections[path].push(socket.id);
        //     timeOnline[socket.id] = new Date();

        //     for(let a=0; a<connections[path].length; a++){
        //         io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
        //     }

        //     if(messages[path] !== undefined){
        //         for(let a=0; a<messages[path].length; a++){
        //             io.to(socket.id).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender']);
        //         }
        //     }
        // })
        socket.on("join-call", (path)=>{
    if(connections[path] === undefined){
        connections[path] = [];
    }

    // Send to the newly joined user the list of existing clients
    const existingClients = connections[path];
    socket.emit("user-joined", socket.id, existingClients);

    // Save user
    connections[path].push(socket.id);
    timeOnline[socket.id] = new Date();

    // Notify existing clients about the new user (excluding self)
    existingClients.forEach(clientId => {
        io.to(clientId).emit("user-joined", socket.id, [clientId, socket.id]);
    });

    // Existing chat messages
    if(messages[path] !== undefined){
        for(let a=0; a<messages[path].length; a++){
            io.to(socket.id).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender']);
        }
    }
});

        socket.on("signal", (toId, message)=>{
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender)=>{
            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([matchingRoom, isFound], [roomKey, roomValue]) => {
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true];
                }
                return [roomKey, isFound];
            }, ['', false]);

            if(found){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({"sender": sender, "data": data, "socket-id-sender": socket.id});
                
                console.log("message", matchingRoom, ":", sender, data);
                
                connections[matchingRoom].forEach((elem)=>{
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                })
            }
        })

        socket.on("disconnect", ()=>{
            let diffTime = Math.abs(timeOnline[socket.id] - new Date());

            for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
                for(let a=0; a<v.length; a++){
                    if(v[a] === socket.id){
                        let key = k;
                        for(let p=0; p<connections[key].length; p++){
                            io.to(connections[key][p]).emit("user-left", socket.id);
                        }
                        let idx = connections[key].indexOf(socket.id);
                        connections[key].splice(idx, 1);

                        if(connections[key].length === 0){
                            delete connections[key];
                        }
                    }
                }
            }
        })
    });

    return io;
}
module.exports = connectToSocket;