const app = require("./app");
const http = require("http");

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', (err) => {
    console.log(err)
});
server.on('listening', () => {
    console.log("Listening on port: " + port)
});