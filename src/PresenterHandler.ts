import { Socket } from 'socket.io';
import Session from './Session';
import ThesisServer, { getNewSessionId } from './ThesisServer';
import { getPresentation } from './PresentationsProvider';
import SlideCollection from './SlideCollection';
import PresenterEvents, {
    IRequestNewSessionData,
    IRequestSlideChangeData,
    IPresentationListResultData,
    INewSessionData,
    ISessionDataData,
    IAttendeeData
} from './events/PresenterEvents';
import ClientEvents, {
    IPresentationContentData,
    IAssignContentData
} from './events/ClientEvents';

export function initialiseNewPresenter(server: ThesisServer, socket: Socket) {
    // 1. Listen for presentation list request
    socket.on(PresenterEvents.RequestPresentationsList, message =>
        handleRequestPresentationsList(server, socket)
    );

    // 2. Listen for new session request
    socket.on(PresenterEvents.RequestNewSession, message =>
        handleRequestNewSession(server, socket, message)
    );

    console.log('Presenter connected');
}

function handleRequestPresentationsList(server: ThesisServer, socket: Socket) {
    // 1. Emit presentations list
    const message: IPresentationListResultData = {
        presentations: [{ ref: '0', title: 'First Presentation' }]
    };
    socket.emit(PresenterEvents.EmitPresentationsListResult, message);
}

function handleRequestNewSession(
    server: ThesisServer,
    socket: Socket,
    message: IRequestNewSessionData
) {
    // 1. Create new session
    const presentation = getPresentation(message.presentationRef);
    const sessionId = getNewSessionId();
    const session = new Session(socket, sessionId, presentation);
    server.sessions.push(session);
    console.log(`Session [${session.sessionId}] created`);

    // 2. Emit session id
    const sessionResult: INewSessionData = {
        sessionId: session.sessionId,
        presentationStructure: presentation.getStructure()
    };
    socket.emit(PresenterEvents.EmitNewSessionCreated, sessionResult);

    // 3. Emit current content
    const content: IPresentationContentData = {
        currentSlide: session.currentSlide(),
        index: session.currentSlideIndex
    };
    socket.emit(PresenterEvents.EmitPresentationContent, content);

    // 4. Listen for slide change
    socket.on(PresenterEvents.RequestSlideChange, msg =>
        handleRequestSlideChange(server, socket, session, msg)
    );

    // 5. Listen for group operations
    socket.on(PresenterEvents.AssignContent, msg =>
        handleAssignContent(socket, session, msg)
    );

    // 7. Listen for content assignment
    socket.on(PresenterEvents.GroupOperation, msg =>
        handleGroupOperation(server, socket, session, msg)
    );

    console.log('Presenter connected');
}

function handleRequestSlideChange(
    server: ThesisServer,
    socket: Socket,
    session: Session,
    message: IRequestSlideChangeData
) {
    // 1. Update session
    const success = session.goToSlide(message.slide);
    if (!success) {
        console.log('Invalid slide request!');
        return;
    }

    // 2. Emit slide content
    socket.emit(
        ClientEvents.EmitPresentationContent,
        session.getSlideContent()
    );

    session.attendees.forEach(attendee => {
        attendee.socket.emit(
            ClientEvents.EmitPresentationContent,
            session.getSlideContent(attendee)
        );
    });
}

function handleAssignContent(
    socket: Socket,
    session: Session,
    message: IAssignContentData
) {
    if (message.target === undefined || message.target.length === 0) {
        session.attendees.forEach(attendee => {
            session.presentation.assignContent(
                attendee,
                message.slideIndex,
                message.subIndex
            );
        });
    } else {
        message.target.forEach(target => {
            const attendee = session.getAttendee(target);
            if (attendee === undefined) {
                console.log('Err! Attendee not found! [' + target + ']');
                return;
            }
            session.presentation.assignContent(
                attendee,
                message.slideIndex,
                message.subIndex
            );
        });
    }
    const sessionData: ISessionDataData = {
        attendees: session.getAttendeeDataList()
    };
    socket.emit(PresenterEvents.EmitSessionData, sessionData);

    session.attendees.forEach(attendee => {
        attendee.socket.emit(
            ClientEvents.EmitPresentationContent,
            session.getSlideContent(attendee)
        );
    });
}

function handleGroupOperation(
    server: ThesisServer,
    socket: Socket,
    session: Session,
    message: any
) {
    // 1. Perform operation
    // 2. Emit result
}
