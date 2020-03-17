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
     * Server -> Client
     * Event for emitting presentation content
     */
    static EmitPresentationContent = 'emit-presentation-content';
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
