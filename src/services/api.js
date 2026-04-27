import axios from 'axios';

const api = axios.create({
  baseURL: 'https://google-solution-challenge-cnbz.onrender.com/api',
});

// Interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const googleLoginUser = (token) => api.post('/auth/google', { token });
export const getNeeds = () => api.get('/needs');
export const assignTask = (needId) => api.post('/tasks/assign', { needId });
export const getMyTasks = () => api.get('/tasks/my');
export const updateTaskStatus = (taskId, status) => api.post('/tasks/update', { taskId, status });
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export default api;
