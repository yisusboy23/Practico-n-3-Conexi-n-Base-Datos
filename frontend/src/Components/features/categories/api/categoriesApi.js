import api from '@/api/axios';

export const categoriesApi = {
    listar: (params = {}) => api.get('/categories', { params }),
    obtener: (id) => api.get(`/categories/${id}`),
    crear: (data) => api.post('/categories', data),
    actualizar: (id, data) => api.put(`/categories/${id}`, data),
    eliminar: (id) => api.delete(`/categories/${id}`),
};