import Presentation from './Presentation';
import { IPresentation } from './models/presentation.model';
import Slide from './Slide';
import { Socket } from 'socket.io';
import BaseSlide from './BaseSlide';
import Attendee from './Attendee';
import { IPresentationContentData } from './events/ClientEvents';
import SlideCollection from './SlideCollection';

export default class Session {
    presenterId: string;
    sessionId: string;
    presentation: Presentation;
    currentSlideIndex: number = 0;

    attendees: Attendee[] = [];

    constructor(
        presenterId: string,
        sessionId: string,
        presentation: Presentation
    ) {
        this.presentation = presentation;
        this.presenterId = presenterId;
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
    };

    removeAttendee = (attendee: Attendee) => {
        this.attendees = this.attendees.filter(att => att !== attendee);
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
                    currentSlide: slide.slides[0],
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
}
