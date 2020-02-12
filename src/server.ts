import ThesisServer from './ThesisServer';

const server = new ThesisServer();
server.get("/", (req, res) =>{
    res.send("Hello World");
});