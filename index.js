const server_i = require("ws");
const client_i = require("ws");
const fs = require('fs');
const port_client = 8080;
const port_server = 8484;
let html_s = fs.readFileSync('./server_page.html','utf-8')
let html_c = fs.readFileSync('./client_page.html','utf-8')

const server = new server_i.Server({port:port_server})
const client = new client_i.Server({port:port_client})

let response;
let maps=[];
var clients = {};
let gt='Bo1';

server.on('connection',(ws)=>{
    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);
    for (var key in clients) {
        clients[key].send(html_s);
    }
  
    ws.on('message', function(message) {
      console.log('получено сообщение ' + message);
        let response;
        if(message == 'get_lobby_info'){
            response = {
                game_type: gt,
                maps: maps
            }
        }else{
            try{
                body = JSON.parse(body)
            }catch(err){
                return;
            }
            if(body.game_type){
                gt = body.game_type
            }
            if(body.maps){
                maps = body.maps
            }
        }
        for (var key in clients) {
            clients[key].send(message);
        }
    });
  
    ws.on('close', function() {
      console.log('соединение закрыто ' + id);
      delete clients[id];
    });
})

client.on('connection',(ws)=>{
    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);
    for (var key in clients) {
        clients[key].send(html_c);
    }
  
    ws.on('message', function(message) {
      console.log('получено сообщение ' + message);
        let response;
        if(message == 'get_lobby_info'){
            response = {
                game_type: gt,
                maps: maps
            }
        }else{
            try{
                body = JSON.parse(body)
            }catch(err){
                return;
            }
            if(body.game_type){
                gt = body.game_type
            }
            if(body.maps){
                maps = body.maps
            }
        }
        for (var key in clients) {
            clients[key].send(message);
        }
    });
  
    ws.on('close', function() {
      console.log('соединение закрыто ' + id);
      delete clients[id];
    });
})
/*
client.createServer(async function(req, res){
    if(req.method == "POST"){
        let body='';
        req.on('data', data => {
            body += data;
        });
        req.on('end',() => {
            res.writeHead(200);
            if(body == 'get_lobby_info'){
                response = {
                    game_type: gt,
                    maps: maps
                }
                res.write(JSON.stringify(response));
            }
            res.end();
        });
    }
    if(req.method == "GET"){
        console.log()
        if(!req.url.match(/jpg/g)){
            res.write(html_c)
            res.end();
        }else{
            let url_photo = './'+req.url
            let photo;
            try{
                photo = fs.readFileSync(url_photo)
                res.writeHead(200, {'Content-Type': 'image/jpg'});
                res.write(photo);
            }catch(err){
                res.writeHead(404);
            }
            res.end();
        }
    }
}).listen(port_client,()=>{
    console.log('CLIENT http://127.0.0.1'+':'+port_client);
});*/