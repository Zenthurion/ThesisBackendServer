import ContentSlide from './ContentSlide';
import BaseSlide from './BaseSlide';

export default class SlideCollection extends BaseSlide {
    slides: ContentSlide[] = [];

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
}
