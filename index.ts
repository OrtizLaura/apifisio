import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
  })
);
app.use(bodyParser.json());

// Criar usuário
app.post("/users", async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { fullName, email, password },
    });
    res.json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Listar usuários
app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (e: any) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
});

// Criar paciente
app.post("/patients", async (req: Request, res: Response) => {
  const { name, treatment, observation } = req.body;
  try {
    const patient = await prisma.patient.create({
      data: { name, treatment, observation },
    });
    res.json(patient);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Listar pacientes
app.get("/patients", async (req: Request, res: Response) => {
  const patients = await prisma.patient.findMany();
  res.json(patients);
});
app.delete("/patients/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await prisma.patient.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Criar sessão
app.post("/sessions", async (req: Request, res: Response) => {
  const { patientId, userId, treatment, date, time, status } = req.body;
  try {
    const session = await prisma.session.create({
      data: {
        patientId,
        userId,
        treatment,
        date: new Date(date),
        time,
        status,
      },
    });
    res.json(session);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Listar sessões
app.get("/sessions", async (req: Request, res: Response) => {
  const sessions = await prisma.session.findMany();
  res.json(sessions);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
