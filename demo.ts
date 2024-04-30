

import * as ejs from 'ejs';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';



const server = http.createServer((req, res)=> {
    if(req.url === '/index.js'){
        const sPath = path.join(__dirname, 'index.js');
        fs.readFile(sPath,(err, data)=>{
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }else{
        fs.readFile(path.join(__dirname, 'views', 'demo.ejs'), 'utf-8', (err, data)=>{
            if(err){
                console.log("error in readfile");
            }
            const html = ejs.render(data);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    }
});

console.log("running on local 3000 port");
server.listen(3000);

