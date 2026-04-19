const express = require('express');
const app = express();

const questionsRouter = require('./routes/questions');

const PORT = process.env.PORT || 3000;

const prisma = require("./lib/prisma");

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());

// Use the questions router for routes starting with /api/questions
app.use('/api/questions', questionsRouter);

app.use((req, res) => {
  res.json({msg: "Route not found"});});


// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
