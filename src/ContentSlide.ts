import BaseSlide from './BaseSlide';
import { IInteractionData } from './events/ClientEvents';
import Attendee from './Attendee';

export default class ContentSlide extends BaseSlide {
    content: {
        title: string;
        body: string;
        opotions?: string[];
        validation?: string[];
    };
    interactions: { [attendeeName: string]: IInteractionData } = {};

    constructor(content: any) {
        super();

        this.type = content.type;
        this.content = content.content;
    }

    registerInteraction = (
        attendee: Attendee,
        interaction: IInteractionData
    ) => {
        this.interactions[attendee.name] = interaction;
    };
}
