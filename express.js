const { response } = require('express');
var express = require('express');
var app = express();

app.use(express.static('public'));
app.get('/', function (req, res){
    res.send('Hello World');
})

app.get('/index*', function (req, res){
    res.sendFile(__dirname + '/' + 'index.html'); 
})

app.get('/about*', function (req, res){
    res.sendFile(__dirname + '/' + 'about.html'); 
})

app.get('/process_get', function (req, res){
    // prepare output in JSON format
    response = {
        username:req.query.username,
        password:req.query.password
    };
    console.log(response);
    res.end(JSON.stringify(response));
})


var server = app.listen(8081, function (){
    var host = server.address().address
    var port = server.address().port

    console.log("Example app is listening at http://%s:%s", host, port)
})