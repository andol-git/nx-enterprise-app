import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

interface AuthRequest extends Request {
  user?: any;
}

const prisma = new PrismaClient();
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const SECRET = 'mysecret';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:4300',
    credentials: true,
  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('Incoming:', req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  res.json(user);
});

app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).send('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).send('Invalid password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    SECRET,
    { expiresIn: '1h' }
  );

    res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 1000,
  });

  return res.json({ success: true });
});

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('No token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    return next(); // IMPORTANT
  } catch {
    return res.status(401).send('Invalid token');
  }
};

app.get('/api/protected', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'Protected data',
    user: req.user,
  });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend 🚀' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
