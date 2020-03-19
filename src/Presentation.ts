import Slide from './Slide';
import { IPresentation } from './models/presentation.model';
import ContentSlide from './ContentSlide';
import BaseSlide from './BaseSlide';
import SlideCollection from './SlideCollection';

export default class Presentation {
    private name: string;
    private slides: BaseSlide[] = [];

    static individualExerciseSlide: ContentSlide = {
        type: 'PlainSlide',
        content: {
            title: 'Individual Exercise',
            body: 'Look at your own screen for your exercise'
        }
    };

    constructor(raw) {
        this.name = raw.hasOwnProperty('name') ? raw.name : 'unnamed';

        if (!raw.hasOwnProperty('slides')) {
            console.log('No slides in presentation!');
            return;
        }

        raw.slides.forEach(slide => {
            if (slide === undefined) {
                console.log('A slide is undefined');
                return;
            }
            if (!slide.hasOwnProperty('type')) {
                console.log('Missing type property!');
                return;
            }

            const type = slide.type;
            switch (type) {
                case 'PlainSlide':
                    this.slides.push(this.createPlainSlide(slide));
                    break;
                case 'MultipleChoiceSlide':
                    this.slides.push(this.createMultipleChoiceSlide(slide));
                    break;
                case 'TextAnswerSlide':
                    this.slides.push(this.createTextAnswerSlide(slide));
                    break;
                case 'SlideChoiceSlide':
                    this.slides.push(this.createSlideChoiceSlide(slide));
                    break;
                case 'SlideCollection':
                    this.slides.push(this.createSlideCollection(slide));
                    break;
            }
        });
    }

    private createPlainSlide = (slide: any) => {
        return new ContentSlide(slide);
    };

    private createMultipleChoiceSlide = (slide: any) => {
        return new ContentSlide(slide);
    };

    private createTextAnswerSlide = (slide: any) => {
        return new ContentSlide(slide);
    };

    private createSlideChoiceSlide = (slide: any) => {
        return new ContentSlide(slide);
    };

    private createSlideCollection = (slide: any) => {
        return new SlideCollection(slide);
    };

    slide = (index: number) => {
        if (index >= this.slides.length || index < 0) {
            return undefined;
        }
        return this.slides[index];
    };

    slideCount = () => {
        return this.slides.length;
    };

    getStructure = (): any => {
        return this.slides.map(slide => {
            return {
                type: slide.type,
                title: slide instanceof ContentSlide ? slide.content.title : ''
            };
        });
    };
}
