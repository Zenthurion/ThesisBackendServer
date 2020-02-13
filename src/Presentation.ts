import Slide from "./Slide";
import {IPresentation} from "./models/presentation.model";

export default class Presentation {
    private name: string;
    private slides: Slide[] = [];

    constructor(rawPresentation: IPresentation) {
        this.name = rawPresentation.name;

        rawPresentation.content.forEach((slide) => {
            this.slides.push(new Slide(slide.title, slide.body, slide.hasNext, slide.hasPrevious));
        });
    }

    slide = (index: number) => {
        if(index >= this.slides.length || index < 0) {
            return undefined;
        }
        return this.slides[index];
    };

    slideCount = () => {
        return this.slides.length;
    };
}