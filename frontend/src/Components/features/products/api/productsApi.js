import api from '@/api/axios';

export const productsApi = {
    listar: (params = {}) => api.get('/products', { params }),
    obtener: (id) => api.get(`/products/${id}`),
    crear: (data) => api.post('/products', data),
    actualizar: (id, data) => api.put(`/products/${id}`, data),
    eliminar: (id) => api.delete(`/products/${id}`),
};