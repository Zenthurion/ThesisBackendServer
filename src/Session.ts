import Presentation from './Presentation';
import { IPresentation } from './models/presentation.model';
import Slide from './Slide';
import { Socket } from 'socket.io';
import BaseSlide from './BaseSlide';
import Attendee from './Attendee';
import { IPresentationContentData } from './events/ClientEvents';
import SlideCollection from './SlideCollection';
import PresenterEvents, {
    ISessionDataData,
    IAttendeeData
} from './events/PresenterEvents';

export default class Session {
    presenter: Socket;
    sessionId: string;
    presentation: Presentation;
    currentSlideIndex: number = 0;

    attendees: Attendee[] = [];

    constructor(
        presenter: Socket,
        sessionId: string,
        presentation: Presentation
    ) {
        this.presentation = presentation;
        this.presenter = presenter;
        this.sessionId = sessionId;
    }

    nextSlide = (): BaseSlide => {
        return this.presentation.slide(this.currentSlideIndex + 1);
    };

    previousSlide = (): BaseSlide => {
        return this.presentation.slide(this.currentSlideIndex - 1);
    };

    currentSlide = (): BaseSlide => {
        return this.presentation.slide(this.currentSlideIndex);
    };

    addAttendee = (attendee: Attendee) => {
        this.attendees.push(attendee);
        this.emitSessionData();
    };

    getAttendeeDataList = () => {
        return this.attendees.map(attendee => this.getAttendeeData(attendee));
    };

    getAttendeeData = (attendee: Attendee) => {
        const attendeeData: IAttendeeData = {
            name: attendee.name,
            assignments: this.presentation.getAssignments(attendee)
        };
        return attendeeData;
    };

    removeAttendee = (attendee: Attendee) => {
        this.attendees = this.attendees.filter(att => att !== attendee);
        this.emitSessionData();
    };

    goToSlide(slide: number) {
        if (slide < 0 || slide > this.presentation.slideCount() - 1) {
            console.log(`Slide number out of bounds! ${slide}`);
            return false;
        }
        this.currentSlideIndex = slide;
        return true;
    }

    getSlideContent(attendee?: Attendee): IPresentationContentData {
        const slide = this.currentSlide();

        if (slide instanceof SlideCollection) {
            if (attendee === undefined) {
                return {
                    currentSlide: Presentation.individualExerciseSlide,
                    index: this.currentSlideIndex
                };
            } else {
                return {
                    currentSlide: slide.contentForAttendee(attendee),
                    index: this.currentSlideIndex
                };
            }
        } else {
            return {
                currentSlide: this.currentSlide(),
                index: this.currentSlideIndex
            };
        }
    }

    getAttendee = (attendeeName: string) => {
        let attendee: Attendee;
        this.attendees.forEach(a => {
            if (a.name === attendeeName) {
                attendee = a;
                return;
            }
        });
        return attendee;
    };
    emitSessionData = () => {
        const data: ISessionDataData = {
            attendees: this.getAttendeeDataList()
        };
        this.presenter.emit(PresenterEvents.EmitSessionData, data);
    };
}
