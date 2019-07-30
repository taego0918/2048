const express   = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
let connectionNum = 0;
io.on('connection', (socket) => {
    connectionNum++;
    socket.on('connectNum',()=>{
        io.emit('connectNum',connectionNum);
    });
    socket.on("message", (obj) => {
        let returnData;
        let getTime = new Date();
        returnData = {
            name: obj.name,
            msg : obj.msg,
            time: getTime
        }
        io.emit("message", returnData);
    });
    socket.on('disconnect',()=>{
        connectionNum--;
        io.emit('connectNum', connectionNum);
    });
});
server.listen(8092);