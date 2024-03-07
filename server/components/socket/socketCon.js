const { Server } = require("socket.io");
const http = require("http");

module.exports = class SocketCon{
    constructor(app, socket_port, frontend_uri){
        this.server = http.createServer(app).listen(socket_port);
        this.io = new Server(this.server, {
            cors: {
              origin: frontend_uri
            }
          });
        
          return this.io;
    }
}