// import * as mongoose from 'mongoose';
// import Presentation, {IPresentation} from "./presentation.model";
//
// // Inspired by: https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
// describe('Presentation Model', () => {
//    beforeAll(async () => {
//        await mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true});
//    });
//
//    afterAll(async () => {
//        await mongoose.connection.close();
//    });
//
//    it('Should throw validation errors', () => {
//        const presentation = new Presentation();
//        expect(presentation.validate).toThrow();
//    });
//
//    it('Should save a user', async () => {
//        expect.assertions(3);
//        const presentation = new Presentation({
//           name: 'Test Name',
//           content: 'Test Content'
//        });
//        const spy = jest.spyOn(presentation, 'save');
//        await presentation.save();
//        expect(spy).toHaveBeenCalled();
//        expect(presentation).toMatchObject({
//            name: 'Test Name',
//            content: 'Test Content'
//        });
//        expect(presentation.content).toBe('Test Content');
//    })
// });