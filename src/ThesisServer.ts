import SocketIO, {Socket} from "socket.io";
import http, {Server} from 'http';
import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import mongoose, {Connection} from 'mongoose';
import {config} from "dotenv";
import presentationsRouter from './routes/Presentations';

export default class ThesisServer {

    private readonly server : Server;
    private readonly socketServer : SocketIO.Server;
    private readonly app : Express;
    private readonly port : number;
    private readonly dbUri : string;
    private readonly dbConnection : Connection;

    private clients = {};

    constructor(port?: number) {
        config();
        this.app = express();
        this.port = port ?? parseInt(process.env.PORT, 10);
        this.dbUri = process.env.ATLAS_URI ?? "UNDEFINED_DB_URI";

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use('/presentations', presentationsRouter);

        this.connect().catch((reason) => {
            console.error(`Unable to establish a connection to the server: ${reason}`);
        });
        this.dbConnection = mongoose.connection;
        this.dbConnection.once('open', () => {
            console.log('MongoDB connection established successfully');
        });

        this.app.get('/', (req : Request, res : Response) => {
            res.send('Do I really need this?');
        });

        this.server = http.createServer(this.app);
        this.server.listen(this.port, () => console.log(`SocketIO server is now listening on port ${this.port}`));
        this.socketServer = SocketIO(this.server);

        this.socketServer.on('connection', (socket: Socket) => {
            console.log('New client connected');
            setInterval(() => this.emitter(socket), 1000);
            socket.on('disconnect', () => console.log('Client disconnected'));
        });
    }

    private emitter = async (socket: Socket) => {
        socket.emit('MESSAGE', "Content...");
    };

    public get(path: string, callback: (Request, Result) => void) {
        this.app.get(path, callback);
    }

    private async connect() {
        await mongoose.connect(this.dbUri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
    }
}