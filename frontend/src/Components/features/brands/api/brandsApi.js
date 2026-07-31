import api from '@/api/axios';

export const brandsApi = {
    listar: (params = {}) => api.get('/brands', { params }),
    obtener: (id) => api.get(`/brands/${id}`),
    crear: (data) => api.post('/brands', data),
    actualizar: (id, data) => api.put(`/brands/${id}`, data),
    eliminar: (id) => api.delete(`/brands/${id}`),
};