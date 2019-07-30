const express   = require('express');
const path      = require('path');
const app       = express();
const port      = process.env.PORT || 8091;
const server    = require('http').Server(app);
const io        = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile( __dirname + "/public/" + "index.html" );
});
app.get('/2048', function(req, res) {
    res.sendFile( __dirname + "/public/" + "2048.html" );
});

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/public/js'));
app.listen(port);