/**
 * Events relating to the either client
 */
export default class ClientEvents {
    /**
     * Client -> Server
     * Builtin event of Sockets.io for when a client disconnects.
     */
    static Disconnect = 'disconnect';

    /**
     * Client -> Server
     * Event to assign content to specific students
     *
     * See IAssignContentData
     */
    static AssignContent = 'assign-content';

    /**
     * Server -> Client
     * Event for emitting presentation content
     */
    static EmitPresentationContent = 'emit-presentation-content';
}

/**
 * Interface for data related to PresenterEvents.AssignContent event
 */
export interface IAssignContentData {
    /**
     * The IDs of students being assigned content. If undefined or empty, the target is either the attendee itself or if from a presenter, all connected attendees
     */
    target?: string[];
    /**
     * The reference to which slide collection is being operated on
     */
    slideIndex: number;
    /**
     * The content slide sub-index being assigned
     */
    subIndex: number;
}

/**
 * Interface for data related to PresenterEvents.PresentationContent event
 */
export interface IPresentationContentData {
    /**
     * The contents of the current slide to be shown
     */
    currentSlide: any;
    index: number;
}

/**
 * Interaction data representing an attendees interactions for a slide
 */
export interface IInteractionData {
    /**
     * Index of slide receiving the interaction
     */
    slideIndex: number;

    /**
     * Whether the data has been submitted or is still being worked on
     */
    submitted: boolean;

    /**
     * The type of interaction, e.g. Text answer of Multiple Choice
     */
    type: string;

    /**
     * The data of the interaction
     */
    data: string;
}
