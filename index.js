const server = require("http");
const client = require("http");
const fs = require('fs');
const port_client = 8080;
const port_server = 8484;
let html_s = fs.readFileSync('./server_page.html','utf-8')
let html_c = fs.readFileSync('./client_page.html','utf-8')

let response;
let maps=[];
let gt='Bo1';

server.createServer(async function(req, res){
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
            }else{
                try{
                    body = JSON.parse(body)
                }catch(err){
                    res.end()
                    return;
                }
                if(body.game_type){
                    gt = body.game_type
                }
                if(body.maps){
                    maps = body.maps
                }
            }
            res.end();
        });
    }else if(req.method == "GET"){
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html_s)
        res.end();
    }
}).listen(port_server,()=>{
    console.log('http://127.0.0.1'+':'+port_server);
});

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
        let body='';
        req.on('data', data => {
            body += data;
        });
        if(!req.url.match(/jpg/g) || !req.url.match(/png/g) | !req.url.match(/gif/g)){
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
    console.log('http://127.0.0.1'+':'+port_client);
});