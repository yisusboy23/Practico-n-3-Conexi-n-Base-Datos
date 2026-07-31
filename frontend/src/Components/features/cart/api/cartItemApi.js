import api from '@/api/axios';

export const cartItemApi = {
    actualizar: async (cartItemId, data) => {
        console.log('📤 cartItemApi.actualizar - ID:', cartItemId, 'Data:', data);
        try {
            const response = await api.put(`/cart-items/${cartItemId}`, data);
            console.log('📥 cartItemApi.actualizar - Respuesta:', response.data);
            return response;
        } catch (error) {
            console.error('❌ cartItemApi.actualizar - Error:', error);
            throw error;
        }
    },
    eliminar: async (cartItemId) => {
        console.log('📤 cartItemApi.eliminar - ID:', cartItemId);
        try {
            const response = await api.delete(`/cart-items/${cartItemId}`);
            console.log('📥 cartItemApi.eliminar - Respuesta:', response.data);
            return response;
        } catch (error) {
            console.error('❌ cartItemApi.eliminar - Error:', error);
            throw error;
        }
    },
};