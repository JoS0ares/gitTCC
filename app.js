const server = require('./config/server');

server.listen(3000, '192.168.100.8', function(){
    console.log("server rodando em http://192.168.100.8:3000/espec_publicacao");
    console.log("http://192.168.100.8:3000/home");
    console.log("http://192.168.100.8:3000/espec_publicacao");
});