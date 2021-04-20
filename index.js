const server_i = require("ws");
const server_http = require("http");
const client_http = require("http");
const fs = require('fs');


var ip = require("ip");

const server = new server_i.Server({port:8080})

let maps=[];
let teams=[];
var clients = [];
let gt='Bo1';

server.on('connection',(ws)=>{
    var id = Math.random();
    clients[id] = ws;
    let response;
    console.log('new client')
    ws.on('message', function(message) {
        if(message == 'reload_lobby'){
            gt = 'Bo1'
            maps = []
            teams=[]
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
            if(body.teams){
                teams  = body.teams
            }
        }
        response = {
            game_type: gt,
            maps: maps,
            teams:teams
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
        let html_s = fs.readFileSync('./server_page.html','utf-8')
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html_s)
        res.end();
    }
}).listen('8181',()=>{
    console.log('SERVER http://'+ip.address()+':'+'8181');
});

client_http.createServer(async function(req, res){
    if(req.method == "GET"){
        let html_c = fs.readFileSync('./client_page.html','utf-8')
        if(!req.url.match(/.[A-Za-z]+$/g)){
            res.write(html_c)
            res.end();
        }else{
            let url_photo = './'+req.url
            let photo;
            try{
                photo = fs.readFileSync(url_photo)
                let photo_type='png';
                console.log(req.url)
                photo_type = req.url.match(/.[A-Za-z]+$/g)[0].replace('.','')
                res.writeHead(200, {'Content-Type': `image/${photo_type}`});
                res.write(photo);
            }catch(err){
                res.writeHead(404);
            }
            res.end();
        }
    }
}).listen('8383',()=>{
    console.log('CLIENT http://'+ip.address()+':'+'8383');
});