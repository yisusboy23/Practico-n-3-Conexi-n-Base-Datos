import api from '@/api/axios';

export const usersApi = {
    listar: (params = {}) => api.get('/users', { params }),
    obtener: (id) => api.get(`/users/${id}`),
    crear: (data) => api.post('/users', data),
    actualizar: (id, data) => api.put(`/users/${id}`, data),
    eliminar: (id) => api.delete(`/users/${id}`),
};