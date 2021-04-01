const server_i = require("ws");
const client_i = require("ws");
const server_http = require("http");
const client_http = require("http");
const fs = require('fs');
const port_client = 8484;
const port_server = 8080;
let html_s = fs.readFileSync('./server_page.html','utf-8')
let html_c = fs.readFileSync('./client_page.html','utf-8')

const server = new server_i.Server({port:port_server})

let maps=[];
var clients = [];
let gt='Bo1';

server.on('connection',(ws)=>{
    var id = Math.random();
    clients[id] = ws;
    let response;
    ws.on('message', function(message) {
        if(message == 'reload_lobby'){
            gt = 'Bo1'
            maps = []
        }else if(message != 'get_lobby_info'){
            try{
                body = JSON.parse(message)
            }catch(err){
                body={}
            }
            if(body.game_type){
                gt = body.game_type
            }
            if(body.maps){
                maps = body.maps
            }
        }
        response = {
            game_type: gt,
            maps: maps
        }
        for (var key in clients) {
            clients[key].send(JSON.stringify(response));
        }
    });
    
    ws.on('close', function() {
        delete clients[id];
    });
})

server_http.createServer(async function(req, res){
    if(req.method == "GET"){
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html_s)
        res.end();
    }
}).listen('8181',()=>{
    console.log('SERVER http://127.0.0.1'+':'+'8181');
});

client_http.createServer(async function(req, res){
    if(req.method == "GET"){
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
}).listen('8383',()=>{
    console.log('CLIENT http://127.0.0.1'+':'+'8383');
});