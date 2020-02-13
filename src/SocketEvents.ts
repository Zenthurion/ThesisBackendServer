
export default class SocketEvents {
    // Built-in
    static Disconnect = "disconnect";

    // Receive
    static PresenterConnected = "presenter-connected";
    static AttendeeConnected = "attendee-connected";
    static RequestNewSessionId = "request-new-session-id";
    static ValidateSessionId = "validate-session-id";
    static RequestNextSlide = "request-next-slide";
    static RequestCurrentSlide = "request-current-slide";
    static RequestPreviousSlide = "request-previous-slide";
    static RegisterAttendee = "register-attendee";

    // Emit
    static EmitNewSessionId = "emit-new-session-id";
    static EmitSessionIdValidated = "session-id-validated";
    static EmitPresentationContent = "emit-presentation-content";

}