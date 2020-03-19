import { Socket } from 'socket.io';
import Session from './Session';
import ThesisServer, { getNewSessionId } from './ThesisServer';
import { getPresentation } from './PresentationsProvider';
import SlideCollection from './SlideCollection';
import PresenterEvents, {
    IRequestNewSessionData,
    IRequestSlideChangeData,
    IPresentationListResultData,
    INewSessionData
} from './events/PresenterEvents';
import ClientEvents, { IPresentationContentData } from './events/ClientEvents';

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
        handleAssignContent(server, socket, session, msg)
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

    console.log(`Slide updated to ${message.slide}`);
}

function handleAssignContent(
    server: ThesisServer,
    socket: Socket,
    session: Session,
    message: any
) {
    // 1. Assign content
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
