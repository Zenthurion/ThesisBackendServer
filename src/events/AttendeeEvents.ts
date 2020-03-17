import ClientEvents from './ClientEvents';

/**
 * Events relating to the attendee client
 */
export default class AttendeeEvents extends ClientEvents {
    /**
     * Event for emitting session id validation result
     */
    static EmitSessionIdValidated = 'session-id-validated';

    /**
     * Event for emitting the result of an attempt to join a session
     *
     * See IJoinResultData
     */
    static EmitJoinResult = 'join-result';

    /**
     * Event to register a client as an attendee
     */
    static AttendeeConnected = 'attendee-connected';

    /**
     * Event to request validation of a session id
     *
     * See IValidateSessionIdData
     */
    static ValidateSessionId = 'validate-session-id';

    /**
     * Event to handle a join session attempt
     *
     * See IJoinSessionData
     */
    static JoinSession = 'join-session';

    /**
     * Event to handle interactions from attendees
     *
     * See IInteractionData
     */
    static Interaction = 'interaction';
}

/**
 * Interface for data related to PresenterEvents.JoinResult event
 */
export interface IJoinResultData {
    /**
     * Result of join.
     */
    successful: boolean;
}

/**
 * Interface for data related to PresenterEvents.ValidateSessionId event
 */
export interface IValidateSessionIdData {
    /**
     * Session ID being validated
     */
    sessionId: string;
}

/**
 * Interface for data related to PresenterEvents.JoinSession event
 */
export interface IJoinSessionData {
    /**
     * ID of session being joined
     */
    sessionId: string;

    /**
     * Name of joining attendee
     */
    username: string;
}

/**
 * Interface for data related to PresenterEvents.Interaction event
 */
export interface IInteractionData {
    /**
     * Reference to the element receiving the interaction.
     *
     * Type to be determined.
     */
    interactionElement: any;

    /**
     * The value associated with the interaction.
     * Values depend on type of the interaction element
     */
    value: string;
}
