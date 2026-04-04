const express = require('express');
const router = express.Router();

const questions = require('../data/questions');

// GET /questions - Retrieve all questions
// List all questions, or filter by keyword if query parameter is provided
router.get('/', (req, res) => {

    const { keyword } = req.query;

    if (!keyword) {
        res.json(questions);
    }
    else {
    const filteredQuestions = questions.filter(question =>
        question.keywords.includes(keyword.toLowerCase())
        );
        res.json(filteredQuestions);
    }
});

// GET /posts/:postId
// Show a specific post
router.get('/:id', (req, res) => {
    const Qid = Number(req.params.id);
    const question = questions.find(q => q.id === Qid);

    if (!question) {
        return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
});

// POST /questions - Create a new question

router.post('/', (req, res) => {

    const { question, answer }  = req.body;
    if (!question || !answer) {
        return res.status(400).json({ error: 'Missing required fields: question, answer' });
    }
    const currentMaxId = questions.length === 0 ? 0 : Math.max(...questions.map(q => q.id));

    const newQuestion = { id: currentMaxId + 1,
        question,
        answer
    };

    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

// PUT /questions/:id - Update an existing question
router.put('/:id', (req, res) => {
    const Qid = Number(req.params.id);
    const { question, answer } = req.body;

    const questionId = questions.findIndex(q => q.id === Qid);

    if (questionId === -1) {
        return res.status(404).json({ error: 'Question not found' });
    }

    if (!question || !answer) {
        return res.status(400).json({ error: 'Missing required fields: question, answer' });
    }

    questions[questionId].question = question;
    questions[questionId].answer = answer;
    res.json(questions[questionId]);

});

// DELETE /questions/:id - Delete a question
router.delete('/:id', (req, res) => {
    const Qid = Number(req.params.id);
    const questionIndex = questions.findIndex(q => q.id === Qid);

    if (questionIndex === -1) {
        return res.status(404).json({ error: 'Question not found' });
    }

    const deletedQuestion = questions.splice(questionIndex, 1);


    res.json({ message: 'Question deleted successfully', deletedQuestion: deletedQuestion[0] } );

});

module.exports = router;