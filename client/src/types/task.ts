export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
  }