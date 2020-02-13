import SocketIO, {Socket} from "socket.io";
import http, {Server} from 'http';
import express, {Express, raw, Request, Response} from 'express';
import cors from 'cors';
import mongoose, {Connection} from 'mongoose';
import {config as configureDotenv} from "dotenv";
import presentationsRouter from './routes/Presentations';
import presentationModel, {IPresentation} from './models/presentation.model';
import SocketEvents from "./SocketEvents";
import Presentation from "./Presentation";
import Session from "./Session";

export default class ThesisServer {

    private readonly server : Server;
    private readonly socketServer : SocketIO.Server;
    private readonly app : Express;
    private readonly port : number;
    private readonly dbUri : string;
    private readonly dbConnection : Connection;

    private sessions: Session[] = [];

    constructor(port?: number) {
        configureDotenv();
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

        this.socketServer.on('connection', (socket: Socket) => { this.handleClientConnection(socket) });



    }

    private handleClientConnection(socket: Socket) {
        socket.on(SocketEvents.Disconnect, () => console.log('Client disconnected'));
        socket.on(SocketEvents.PresenterConnected, (data: any) => this.handlePresenterConnected(socket, data));
        socket.on(SocketEvents.AttendeeConnected, (data: any) => this.handleAttendeeConnected(socket, data));

        console.log('New client connected');
    }

    private handleAttendeeConnected = (socket: Socket, connectionData: any) => {
       socket.on(SocketEvents.ValidateSessionId, message => this.handleValidateSessionId(socket, message));
       socket.on(SocketEvents.RegisterAttendee, message => this.handleRegisterAttendee(socket, message));
       socket.on(SocketEvents.RequestCurrentSlide, message => this.handleRequestCurrentSlide(socket, message));

        console.log('Attendee connected');
    };

    private handleValidateSessionId = (socket: Socket, message: any) => {
        const data = JSON.parse(message);
        socket.emit(SocketEvents.EmitSessionIdValidated, `{ "sessionId": "${data.sessionId}", "isValid": ${this.validateSessionId(data.sessionId)} }`)
    };

    private handleRegisterAttendee = (socket: Socket, message: any) => {
        const data = JSON.parse(message);
        const session = this.getSession(data.sessionId);
        session.addAttendee(socket);

        socket.on(SocketEvents.Disconnect, () => {
            session.removeAttendee(socket);
        });
    };

    private handleRequestCurrentSlide = (socket: Socket, message: any) => {
        const data = JSON.parse(message);
        const session = this.getSession(data.sessionId);
        if(session === undefined) {
            console.error('Couldn\'t find session ' + data.sessionId);
            return;
        }
        socket.emit(SocketEvents.EmitPresentationContent, this.getPresentationContent(session));
    };

    private validateSessionId = (sessionId: string) => {
        let validated = false;
        this.sessions.forEach((session, i) => {
            console.log(`checking if ${session.sessionId} and ${sessionId} matches`);
            if(session.sessionId === sessionId) {
                console.log('session id validated');
                validated = true;
                return;
            }
        });
        return validated;
    };

    private retrievePresentationFromDB = async () => {
        await this.dbConnection.useDb('PresentationsDatabase').collection('Presentations')
            .find<IPresentation>().next();
    };

    private handlePresenterConnected = (socket: Socket, data: any) => {
        const res = this.retrievePresentationFromDB();
        console.log(res);
        this.dbConnection.useDb('PresentationsDatabase')
            .collection('Presentations').find<IPresentation>().next()
            .then(pres => {
                // console.log(pres);
                const session = new Session(socket.id, ThesisServer.getNewSessionId(), pres);

                this.sessions.push(session);
                console.log(`Session [${session.sessionId}] created`);
                socket.emit(SocketEvents.EmitNewSessionId, `{"sessionId": "${session.sessionId}"}`);
                socket.emit(SocketEvents.EmitPresentationContent, this.getPresentationContent(session));

                socket.on(SocketEvents.RequestNextSlide, message => this.handleRequestNextSlide(socket, session, message));
                socket.on(SocketEvents.RequestPreviousSlide, message => this.handleRequestPreviousSlide(socket, session, message));

                console.log('Presenter connected');
            }).catch(reason => {
                console.error("Unable to start session. No presentation found! " + reason);
            });
    };

    private handleRequestPreviousSlide = (socket: Socket, session: Session, message: any) => {
        session.goToPreviousSlide();
        socket.emit(SocketEvents.EmitPresentationContent, this.getPresentationContent(session));
        session.attendees.forEach((attendee) => {
            attendee.emit(SocketEvents.EmitPresentationContent, this.getPresentationContent(session));
        });
    };

    private handleRequestNextSlide = (socket: Socket, session: Session, message: any) => {
        session.goToNextSlide();
        socket.emit(SocketEvents.EmitPresentationContent, this.getPresentationContent(session));
        session.attendees.forEach((attendee) => {
            attendee.emit(SocketEvents.EmitPresentationContent, this.getPresentationContent(session));
        });
    };

    private getPresentationContent = (session: Session) : string => {
        return (
            `{
                "previousSlide": ${session.previousSlide() ?? null},
                "currentSlide": ${session.currentSlide() ?? null},
                "nextSlide": ${session.nextSlide() ?? null}
            }`
        );
    };

    private getSession = (sessionId: string) : Session => {
        let result: Session;
        this.sessions.forEach((session) => {
            if(session.sessionId === sessionId) {
                result = session;
                return;
            }
        });

        return result;
    };

    public get(path: string, callback: (Request, Result) => void) {
        this.app.get(path, callback);
    }

    private async connect() {
        await mongoose.connect(this.dbUri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
    }

    private static getNewSessionId(): string {
        const id = Math.floor(100000 + Math.random() * 900000).toString(10);
        return id.substr(0,3) + '-' + id.substr(3, 3);
    }
}