import api from '@/api/axios';

export const checkoutApi = {
    procesar: (data) => api.post('/checkout', data),
};
