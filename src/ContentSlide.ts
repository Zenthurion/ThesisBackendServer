import BaseSlide from './BaseSlide';

export default class ContentSlide extends BaseSlide {
    content: {
        title: string;
        body: string;
        opotions?: string[];
        validation?: string[];
    };

    constructor(content: any) {
        super();

        this.type = content.type;
        this.content = content.content;
    }
}
