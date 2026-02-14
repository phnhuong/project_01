import usersRoutes from './routes/users.routes';
import studentsRoutes from './routes/students.routes';
import parentsRoutes from './routes/parents.routes';
import academicYearsRoutes from './routes/academic-years.routes';
import gradesRoutes from './routes/grades.routes';
import subjectsRoutes from './routes/subjects.routes';
import classesRoutes from './routes/classes.routes';
import scoresRoutes from './routes/scores.routes';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { ApiError } from './utils/ApiError';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
console.log('authRoutes:', authRoutes);

// @ts-ignore
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/academic-years', academicYearsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/scores', scoresRoutes);
app.get('/', (req, res) => {
  res.send('Student Management API is running!');
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Custom 404 handler for non-existent routes
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Global Error Handler (Must be last)
app.use(errorMiddleware as any);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
