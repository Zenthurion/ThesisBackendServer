import { Socket } from 'socket.io';
import Session from './Session';
import ThesisServer from './ThesisServer';
import retryTimes = jest.retryTimes;
import Attendee from './Attendee';
import AttendeeEvents, {
    IJoinSessionData,
    IJoinResultData,
    IValidateSessionIdData,
    ISessionIdValidatedData
} from './events/AttendeeEvents';
import { IAssignContentData } from './events/ClientEvents';

export function initialiseNewAttendee(server: ThesisServer, socket: Socket) {
    // 1. Listen for session id validation
    socket.on(AttendeeEvents.ValidateSessionId, message =>
        handleValidateSessionId(server, socket, message)
    );

    // 2. Listen for join session attempt
    socket.on(AttendeeEvents.JoinSession, message =>
        handleJoinSession(server, socket, message)
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
    const validationResult: ISessionIdValidatedData = {
        sessionId: message.sessionId,
        isValid: valid
    };
    socket.emit(AttendeeEvents.EmitSessionIdValidated, validationResult);
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

    // 6. Handle interaction events
    socket.on(AttendeeEvents.Interaction, data =>
        handleInteraction(server, socket, data)
    );

    // 7. Handle self-assignment
    socket.on(AttendeeEvents.AssignContent, data =>
        handleSelfAssignment(attendee, session, data)
    );
}

function handleSelfAssignment(
    attendee: Attendee,
    session: Session,
    data: IAssignContentData
) {
    session.presentation.assignContent(
        attendee,
        data.slideIndex,
        data.subIndex
    );
    session.emitSessionData();
    console.log(`assigned content to self [${attendee.name}]`);
}

function handleInteraction(server: ThesisServer, socket: Socket, message: any) {
    // 1. Handle interaction
}
