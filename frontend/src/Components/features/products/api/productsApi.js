import api from '@/api/axios';

export const productsApi = {
    listar: (params = {}) => api.get('/products', { params }),
    obtener: (id) => api.get(`/products/${id}`),
    crear: (data) => api.post('/products', data),
    actualizar: (id, data) => api.put(`/products/${id}`, data),
    eliminar: (id) => api.delete(`/products/${id}`),

    // --- MÉTODOS PARA IMÁGENES ---
    subirImagen: (productId, formData) => 
        api.post(`/products/${productId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        
    agregarImagenUrl: (productId, data) => 
        api.post(`/products/${productId}/images`, data),
        
    eliminarImagen: (imageId) => 
        api.delete(`/images/${imageId}`),
};