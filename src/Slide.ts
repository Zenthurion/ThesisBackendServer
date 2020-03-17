export default class Slide {
    title: string;
    body: string;
    hasNext: boolean;
    hasPrevious: boolean;

    constructor(title: string, body: string, hasNext: boolean, hasPrevious: boolean) {
        this.title = title;
        this.body = body;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    public toString = () : string => {
        return `{
            "title": "${this.title}",
            "body": "${this.body}",
            "hasNext": ${this.hasNext},
            "hasPrevious": ${this.hasPrevious}
        }`;
    }

}