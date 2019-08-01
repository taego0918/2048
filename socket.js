const express   = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
let connectionNum = 0;
let OPDate = [];
io.on('connection', (socket) => {
    connectionNum++;
    socket.on('connectNum',()=>{
        io.emit('connectNum',connectionNum);
    });
    socket.on('gamerData',(obj)=>{
        let isContain = false;
        for(let item = 0 ;item < OPDate.length;item++){
            if(OPDate[item].name === obj.name){
                OPDate[item] = obj;
                isContain = true;
                break;
            }
        }
        if(!isContain){OPDate.push(obj);}
        io.emit('OPData',OPDate);
    })
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