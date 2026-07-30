import api from '@/api/axios';

export const productsApi = {
    listar: (params = {}) => api.get('/products', { params }),
    obtener: (id) => api.get(/products/),
    crear: (data) => api.post('/products', data),
    actualizar: (id, data) => api.put(/products/, data),
    eliminar: (id) => api.delete(/products/),
};
