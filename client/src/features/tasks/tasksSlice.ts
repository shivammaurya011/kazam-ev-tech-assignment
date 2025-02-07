
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// Define a Task type
export interface Task {
  _id: string;
  name: string;
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// Define the slice state
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};



// Fetch all tasks 
export const getTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/getTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk<
  Task,
  { name: string; description: string; status?: string; dueDate: string },
  { rejectValue: string }
>('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/tasks', taskData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create task'
    );
  }
});

// Update an existing task
export const updateTask = createAsyncThunk<
  Task,
  { id: string; taskData: Partial<Task> },
  { rejectValue: string }
>('tasks/updateTask', async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/tasks/${id}`, taskData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update task'
    );
  }
});

// Delete a task
export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/tasks/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete task'
    );
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Get Tasks ---
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      // --- Create Task ---
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create task';
      })
      // --- Update Task ---
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update task';
      })
      // --- Delete Task ---
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
