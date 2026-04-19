const express = require('express');
const router = express.Router();

const prisma = require("../lib/prisma");

function formatQuestion(question) {
  return {
    ...question,
    date: question.date.toISOString().split("T")[0],
  };
}

// GET /questions - get all questions
// List all question, (no keyword in the qieston project)
router.get('/', async (req, res) => {
    try {
        const questions = await prisma.question.findMany();
        res.json(questions.map(formatQuestion));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /questions/:id - get a specific question
router.get('/:id', async (req, res) => {
    try {
        const Qid = Number(req.params.id);
        const question = await prisma.question.findUnique({
            where: { id: Qid }
        });

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(formatQuestion(question));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /questions - create a new question
router.post('/', async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ error: 'Missing required fields: question, answer' });
        }

        const newQuestion = await prisma.question.create({
            data: {
                question,
                answer,
                date: new Date()
            }
        });
        res.status(201).json(formatQuestion(newQuestion));
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /questions/:id - replace the existing question
router.put('/:id', async (req, res) => {
    try {
        const Qid = Number(req.params.id);
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Missing required fields: question, answer' });
        }

        const updatedQuestion = await prisma.question.update({
            where: { id: Qid },
            data: {
                question,
                answer,
                date: new Date()
            }
        });
        res.json(formatQuestion(updatedQuestion));
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /questions/:id - delete a specific question
router.delete('/:id', async (req, res) => {
    try {
        const Qid = Number(req.params.id);

        const deletedQuestion = await prisma.question.delete({
            where: { id: Qid }
        });

        res.json({ message: 'Question deleted successfully', deletedQuestion: formatQuestion(deletedQuestion) });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;