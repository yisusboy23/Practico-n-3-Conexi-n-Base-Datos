import api from '@/api/axios';

export const cartItemApi = {
    actualizar: (cartItemId, data) => api.put(`/cart-items/${cartItemId}`, data),
    eliminar: (cartItemId) => api.delete(`/cart-items/${cartItemId}`),
};
