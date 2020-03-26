import ClientEvents from './ClientEvents';

/**
 * Events relating to the presenter client
 */
export default class PresenterEvents extends ClientEvents {
    /**
     * Server -> Teacher
     * Event for emitting a presentations list result back to client
     *
     * See IPresentationListData
     */
    static EmitPresentationsListResult = 'presentations-list-result';

    /**
     * Server -> Teacher
     * Event for emitting the creation of a new session to client
     *
     * See INewSessionData
     */
    static EmitNewSessionCreated = 'new-session-created';

    /**
     * Server -> Teacher
     * Event for emitting the result of a group operation back to client
     *
     * See IOperationResultData
     */
    static EmitOperationResult = 'operation-result';

    /**
     * Server -> Teacher
     * Event for emitting a session data back to client
     *
     * See ISessionDataData
     */
    static EmitSessionData = 'session-data';

    /**
     * Teacher -> Server
     * Event sent to identify a client as a presenter.
     */
    static PresenterConnected = 'presenter-connected';

    /**
     * Teacher -> Server
     * Event sent to request a list of available presentations.
     */
    static RequestPresentationsList = 'request-presentations-list';

    /**
     * Teacher -> Server
     * Event sent to request creation of a new session
     *
     * See IRequestNewSessionData
     */
    static RequestNewSession = 'request-new-session';

    /**
     * Teacher -> Server
     * Event sent to request a change in viewed slide
     *
     * See IRequestSlideChangeData
     */
    static RequestSlideChange = 'request-slide-change';

    /**
     * Teacher -> Server
     * Event to operate on a group of students, such as adding, removing, disbanding or creating.
     *
     * See IGroupOperationData
     */
    static GroupOperation = 'group-operation';
}

/**
 * Interface for data related to PresenterEvents.PresentationListResult event
 */
export interface IPresentationListResultData {
    /**
     * A list of tuples containing a reference to a presentation and the title of that presentation respectively
     */
    presentations: IPresentationListItem[];
}

/**
 * Interface for items associated with the presentations array of the IPresentationListResultData interface
 */
export interface IPresentationListItem {
    ref: string;
    title: string;
}

/**
 * Interface for data related to PresenterEvents.NewSession event
 */
export interface INewSessionData {
    /**
     * The created session ID associated with the new session
     */
    sessionId: string;

    /**
     * The graph structure of the presentation including slide titles
     */
    presentationStructure: IPresentationStructure;
}

/**
 * Interface for the presentation structure emitted to the presenter client through INewSessionData
 */
export interface IPresentationStructure {
    slides: IPresentationStructureSlide[];
}

/**
 * Base interface of a slide in the presentation structure of IPresentationStructure
 */
export interface IPresentationStructureSlide {
    type: string;
}

/**
 * Presentation structure interface for slides containing content
 */
export interface IPresentationStructureContentSlide
    extends IPresentationStructureSlide {
    title: string;
    body: string;
}

/**
 * Presentation structure interface for slides containing a collection of slides
 */
export interface IPresentationStructureCollectionSlide
    extends IPresentationStructureSlide {
    slides: IPresentationStructureContentSlide[];
}

/**
 * Interface for data related to PresenterEvents.OperationResult event
 */
export interface IOperationResultData {
    /**
     * Reference to the related operation
     */
    operationRef: string;
}

/**
 * Interface for data related to PresenterEvents.SessionData event
 */
export interface ISessionDataData {
    /**
     * A list of students currently in the session.
     */
    attendees: IAttendeeData[];
}

/**
 * Interface for attendee data being transmitted to presenter clients
 */
export interface IAttendeeData {
    /**
     * Name of attendee
     */
    name: string;

    /**
     * Data pair of slide index and sub index for collections
     */
    assignments: { [slideIndex: number]: number };
}

/**
 * Interface for data related to PresenterEvents.RequestNewSession event
 */
export interface IRequestNewSessionData {
    presentationRef: string;
}

/**
 * Interface for data related to PresenterEvents.RequestSlideChange event
 */
export interface IRequestSlideChangeData {
    /**
     * Slide index to change to
     */
    slide: number;
}

/**
 * Interface for data related to PresenterEvents.GroupOperation event
 */
export interface IGroupOperationData {
    /**
     * The operation being triggered.
     * Allowed values 'Create', 'Add', 'Remove', or 'Disband'
     */
    operation: string;

    /**
     * A reference to the operation. It is used to maintain identity of an operation between server and client.
     */
    operationRef: string;

    /**
     * A reference to the targeted group.
     * Not relevant for teh 'Add' operation
     */
    groupRef: string;

    /**
     * The IDs of students being acted upon
     */
    students: string[];
}
