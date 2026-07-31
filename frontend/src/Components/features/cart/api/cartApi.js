import api from '@/api/axios';

export const cartApi = {
    obtener: (id) => api.get(`/carts/${id}`),
    crear: (data) => api.post('/carts', data),
    addItem: (cartId, data) => api.post(`/carts/${cartId}/items`, data),
    clear: (cartId) => api.delete(`/carts/${cartId}/clear`),
    updateItem: (cartItemId, data) => api.put(`/cart-items/${cartItemId}`, data),
    deleteItem: (cartItemId) => api.delete(`/cart-items/${cartItemId}`),
};