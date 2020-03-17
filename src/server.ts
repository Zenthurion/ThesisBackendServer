import ThesisServer from './ThesisServer';
import { getPresentation } from './PresentationsProvider';
import Presentation from './Presentation';

const server = new ThesisServer();
server.get('/', (req, res) => {
    res.send('Hello World');
});
