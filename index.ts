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

app.get("/patients/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const patient = await prisma.patient.findFirst({
      where: { id },
    });
    res.status(200).send(patient);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
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
  const { patientId, userId, treatment, availableDateId, times, status } = req.body;
  // times: string[] - array de horários

  try {
    const sessions = await Promise.all(
      times.map((time: string) =>
        prisma.session.create({
          data: {
            patientId,
            userId,
            treatment,
            availableDateId,
            time,
            status,
          },
        })
      )
    );
    res.json(sessions);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Listar sessões
app.get("/sessions", async (req: Request, res: Response) => {
  const sessions = await prisma.session.findMany({
  include: {
    patient: true,
    availableDate: true
  },

  });
  res.json(sessions);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Criar data disponível
app.post("/available-dates", async (req, res) => {
  const { date } = req.body;
  try {
    const availableDate = await prisma.availableDate.create({
      data: { date: new Date(date), isActive: true },
    });
    res.json(availableDate);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Listar datas disponíveis ativas
app.get("/available-dates", async (req, res) => {
  const dates = await prisma.availableDate.findMany({
    where: { isActive: true },
    orderBy: { date: "asc" },
  });
  res.json(dates);
});
// Atualizar status da data
app.patch("/available-dates/:id", async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const updated = await prisma.availableDate.update({
      where: { id },
      data: { isActive },
    });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/available-dates/deactivate", async (req, res) => {
  const { date } = req.body;
  try {
    // Buscar a data disponível pelo campo date
    const availableDate = await prisma.availableDate.findUnique({
      where: { date: new Date(date) },
    });
    if (!availableDate) {
      return res.status(404).json({ error: "Data não encontrada" });
    }
    // Atualizar para isActive = false
    const updated = await prisma.availableDate.update({
      where: { id: availableDate.id },
      data: { isActive: false },
    });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});