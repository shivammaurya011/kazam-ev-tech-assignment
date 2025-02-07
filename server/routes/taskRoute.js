import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import validate from '../middleware/validationMiddleware.js';
import { taskValidationSchema } from '../utils/taskValidation.js';

const router = express.Router();

// Routes for all task related requests
router.get('/', getTasks);
router.post('/', validate(taskValidationSchema), createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;