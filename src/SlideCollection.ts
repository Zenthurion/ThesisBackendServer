import ContentSlide from './ContentSlide';
import BaseSlide from './BaseSlide';
import Attendee from './Attendee';

export default class SlideCollection extends BaseSlide {
    slides: ContentSlide[] = [];
    assignments: { [attendeeId: string]: number } = {};

    constructor(content: any) {
        super();

        this.type = 'SlideCollection';

        if (!content.hasOwnProperty('collection')) {
            console.log('No slides in collection!');
            return;
        }

        const slides = content.collection;
        for (const slide of slides) {
            this.slides.push(new ContentSlide(slide));
        }
    }

    assignAttendee = (attendee: Attendee, index: number) => {
        this.assignments[attendee.socket.id] = index;
    };

    contentForAttendee = (attendee: Attendee): ContentSlide => {
        const index = this.assignments[attendee.socket.id];
        if (index === undefined) {
            return this.slides[0];
        }
        return this.slides[index];
    };
}
