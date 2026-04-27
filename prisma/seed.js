const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const seedQuestions = [
    {
        date: new Date("2026-04-19"),
        question: "What's the meaning of life?",
        answer: "Generating wealth for yourself"
    },
    {
        date: new Date("2026-04-19"),
        question: "Is quick sort O(nlogn)",
        answer: "No, it's 2^n"
    },
    {
        date: new Date("2026-04-19"),
        question: "What is the airspeed velocity of an unladen swallow?",
        answer: "A european or a asian swallow?"
    },
];

async function main() {

  const hashedPassword = await bcrypt.hash("1234", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("created user:" , user.email)

  await prisma.question.deleteMany();

  for (const question of seedQuestions) {

    await prisma.question.create({

      data: {
        date: question.date,
        question: question.question,
        answer: question.answer,
        userId: user.id
      },
      
    },

    )};

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());