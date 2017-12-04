var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var cache = {};
var chatServer = require('./lib/chat_server');



var server = http.createServer(function(req,resp){
    var filepath = false;

    if(req.url == '/'){
        filepath = 'public/index.html';
    }else{
        filepath= 'public' + req.url;
    }

    var absPath = './' + filepath;
    serveStatic(resp,cache,absPath);

}).listen(3000);


// adding function to handle with http
chatServer.listen(server);

function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404: not found');
    response.end();
}

function sendFile(response, filepath, fileContent){
    response.writeHead(200,{'Content-Type':mime.lookup(path.basename(filepath))})
    response.end(fileContent);
}

function serveStatic(response, cache, absPath){
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    }else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath,function(err,data){
                    if(err){
                        send404(response);
                    }else{}{
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                })
            }else{
                send404(response);
            }
        });
    }

}