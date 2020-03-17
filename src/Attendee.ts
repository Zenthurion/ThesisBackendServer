import { Socket } from 'socket.io';
import Session from './Session';
import AttendeeEvents from './events/AttendeeEvents';

export default class Attendee {
    socket: Socket;
    session: Session;
    name: string;

    constructor(socket: Socket, session: Session, name: string) {
        this.socket = socket;
        this.session = session;
        this.name = name;
    }

    emitCurrentContent = () => {
        this.socket.emit(
            AttendeeEvents.EmitPresentationContent,
            this.session.getSlideContent(this)
        );
    };
}
