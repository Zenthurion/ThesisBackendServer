import Presentation from "./Presentation";
import fs from 'fs';

export function getPresentation(ref: string) {
    const file = fs.readFileSync('presentations/presentation.json');

    return new Presentation(JSON.parse(file.toString()));
}
// export const one = {
//     "name": "First Presentation",
//     "slides": [
//         {
//             "type": "SlideCollection",
//             "collection": [
//                 {
//                     "type": "TextAnswerSlide",
//                     "title": "Addition",
//                     "content": "2 + 5 = ?",
//                     "validation": ["7", "seven"]
//                 },
//                 {
//                     "type": "TextAnswerSlide",
//                     "title": "Subtraction",
//                     "content": "2 - 5 = ?",
//                     "validation": ["-3", "minus three", "minus 3", "- 3"]
//                 },
//                 {
//                     "type": "Addition and Subtraction",
//                     "title": "Exercise 3",
//                     "content": "2 + 7 - 4 = ?",
//                     "validation": ["5", "five"]
//                 }
//             ]
//         },
//         {
//             "type": "PlainSlide",
//             "title": "Introduction",
//             "content": "Welcome to the first slide! Here is some pirate ipsum free of charge: \nPlate Fleet Jolly Roger spirits Corsair. Davy Jones' Locker fire in the hole shrouds Barbary Coast."
//         },
//         {
//             "type": "SlideChoiceSlide",
//             "title": "Choose your exercise",
//             "content": {
//                 "description": "Let's start off with some maths! \n\nWhich exercise would you like to do?",
//                 "choices": [
//                     "Exercise 1 (normal)",
//                     "Exercise 2 (hard)",
//                     "Exercise 3 (expert)"
//                 ]
//             }
//         },
//         {
//             "type": "SlideCollection",
//             "collection": [
//                 {
//                     "type": "TextAnswerSlide",
//                     "title": "Addition",
//                     "content": "2 + 5 = ?",
//                     "validation": ["7", "seven"]
//                 },
//                 {
//                     "type": "TextAnswerSlide",
//                     "title": "Subtraction",
//                     "content": "2 - 5 = ?",
//                     "validation": ["-3", "minus three", "minus 3", "- 3"]
//                 },
//                 {
//                     "type": "Addition and Subtraction",
//                     "title": "Exercise 3",
//                     "content": "2 + 7 - 4 = ?",
//                     "validation": ["5", "five"]
//                 }
//             ]
//         },
//         {
//             "type": "PlainSlide",
//             "title": "Good Job!",
//             "content": ""
//         },
//         {
//             "type": "SlideChoiceSlide",
//             "title": "Trivia Time!",
//             "content": {
//                 "description": "Choose the topic of your quiz",
//                 "choices": ["Geography", "History", "Exercise 3"]
//             }
//         },
//         {
//             "type": "SlideCollection",
//             "collection": [
//                 {
//                     "type": "MultipleChoiceSlide",
//                     "title": "Geography",
//                     "content": {
//                         "question": "Where is SDU Located?",
//                         "options": ["Odense", "Copenhagen", "Aarhus", "Aalborg"]
//                     },
//                     "validation": [0]
//                 },
//                 {
//                     "type": "MultipleChoiceSlide",
//                     "title": "History",
//                     "content": {
//                         "question": "What year is it?",
//                         "options": ["2019", "2020", "2002", "1950"]
//                     },
//                     "validation": [1]
//                 },
//                 {
//                     "type": "MultipleChoiceSlide",
//                     "title": "Technical",
//                     "content": {
//                         "question": "How do you save in Word?",
//                         "options": [
//                             "CTRL + S",
//                             "CTRL + SHIFT + S",
//                             "SHIFT + S",
//                             "CTRL + ALT + SHIFT + S"
//                         ]
//                     },
//                     "validation": [0, 1]
//                 }
//             ]
//         }
//     ]
// };