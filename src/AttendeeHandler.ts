import { Socket } from 'socket.io';
import Session from './Session';
import ThesisServer from './ThesisServer';
import retryTimes = jest.retryTimes;
import Attendee from './Attendee';
import AttendeeEvents, {
    IJoinSessionData,
    IJoinResultData,
    IValidateSessionIdData
} from './events/AttendeeEvents';

export function initialiseNewAttendee(server: ThesisServer, socket: Socket) {
    // 1. Listen for session id validation
    socket.on(AttendeeEvents.ValidateSessionId, message =>
        handleValidateSessionId(server, socket, JSON.parse(message))
    );

    // 2. Listen for join session attempt
    socket.on(AttendeeEvents.JoinSession, message =>
        handleJoinSession(server, socket, JSON.parse(message))
    );

    socket.on(AttendeeEvents.Interaction, message =>
        handleInteraction(server, socket, JSON.parse(message))
    );

    console.log('Attendee connected');
}

function handleValidateSessionId(
    server: ThesisServer,
    socket: Socket,
    message: IValidateSessionIdData
) {
    // 1. Validate session id
    const valid = server.validateSessionId(message.sessionId);

    // 2. Emit result
    socket.emit(
        AttendeeEvents.EmitSessionIdValidated,
        `{ "sessionId": "${message.sessionId}", "isValid": ${valid} }`
    );
}

function handleJoinSession(
    server: ThesisServer,
    socket: Socket,
    message: IJoinSessionData
) {
    // 1. Validate session id
    const result: IJoinResultData = {
        successful: server.validateSessionId(message.sessionId)
    };
    if (!result.successful) {
        socket.emit(AttendeeEvents.EmitJoinResult, result);
        return;
    }

    console.log('b' + message.sessionId);

    // 2. Join session
    const session = server.getSession(message.sessionId);
    const attendee = new Attendee(socket, session, message.username);
    session.addAttendee(attendee);

    // 3. Emit result
    socket.emit(AttendeeEvents.EmitJoinResult, result);

    // 4. Emit slide content
    attendee.emitCurrentContent();

    // 5. Listen to disconnect and deregister attendee
    socket.on(AttendeeEvents.Disconnect, () =>
        session.removeAttendee(attendee)
    );
}

function handleInteraction(server: ThesisServer, socket: Socket, message: any) {
    // 1. Handle interaction
}
