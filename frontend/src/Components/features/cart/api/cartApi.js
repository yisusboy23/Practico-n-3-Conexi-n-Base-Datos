import api from '@/api/axios';

export const cartApi = {
    obtener: (id) => api.get(/carts/),
    crear: (data) => api.post('/carts', data),
    addItem: (cartId, data) => api.post(/carts//items, data),
    clear: (cartId) => api.delete(/carts//clear),
    updateItem: (cartItemId, data) => api.put(/cart-items/, data),
    deleteItem: (cartItemId) => api.delete(/cart-items/),
};
