import {Router} from 'express';
import Presentation from '../models/presentation.model'

const router = Router();
router.route('/').get((req, res) => {
    Presentation.find()
        .then(presentations => res.json(presentations))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
   const name = req.body.name;
   const content = req.body.content;

   const newPresentation = new Presentation({name, content});
   newPresentation.save()
       .then(() => res.json('Presentation added'))
       .catch(err => res.status(400).json('Error: ' + err));
});

export default router;