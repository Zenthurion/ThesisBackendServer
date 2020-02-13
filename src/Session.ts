import Presentation from "./Presentation";
import {IPresentation} from "./models/presentation.model";
import Slide from "./Slide";
import {Socket} from "socket.io";

export default class Session {
    presenterId: string;
    sessionId: string;
    presentation: Presentation;
    currentSlideIndex: number = 0;

    attendees: Socket[] = [];

    constructor(presenterId: string, sessionId: string, rawPresentation: IPresentation) {
        this.presentation = new Presentation(rawPresentation);
        this.presenterId = presenterId;
        this.sessionId = sessionId;
    }

    nextSlide = () : Slide => {
        return this.presentation.slide(this.currentSlideIndex + 1);
    };

    previousSlide = (): Slide => {
        return this.presentation.slide(this.currentSlideIndex - 1);
    };

    currentSlide = (): Slide => {
        return this.presentation.slide(this.currentSlideIndex);
    };

    goToNextSlide = () => {
        if(this.currentSlideIndex < this.presentation.slideCount()) {
            this.currentSlideIndex++;
        }
    };

    goToPreviousSlide = () => {
        if(this.currentSlideIndex < this.presentation.slideCount()) {
            this.currentSlideIndex--;
        }
    };

    addAttendee = (attendee: Socket) => {
        this.attendees.push(attendee);
    };

    removeAttendee = (attendee: Socket) => {
        this.attendees = this.attendees.filter(att => att !== attendee);
    };
}