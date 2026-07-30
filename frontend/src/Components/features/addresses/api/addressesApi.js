import api from '@/api/axios';

export const addressesApi = {
    listar: () => api.get('/addresses'),
    crear: (data) => api.post('/addresses', data),
};
