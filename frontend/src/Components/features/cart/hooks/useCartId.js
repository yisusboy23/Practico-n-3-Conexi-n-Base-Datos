import { useEffect, useState } from 'react';
import { cartApi } from '../api/cartApi';

// Obtiene el carrito activo del usuario. Si no existe uno guardado
// en localStorage, crea uno nuevo en el backend y lo persiste.
export function useCartId(userId) {
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setCartId(null);
            setLoading(false);
            return;
        }

        const storageKey = `cart_id_user_${userId}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
            setCartId(Number(stored));
            setLoading(false);
            return;
        }

        setLoading(true);
        cartApi.crear({ user_id: userId })
            .then((response) => {
                const newCartId = response.data.id;
                localStorage.setItem(storageKey, String(newCartId));
                setCartId(newCartId);
            })
            .catch(() => {
                setCartId(null);
            })
            .finally(() => setLoading(false));
    }, [userId]);

    // Se usa después de completar un checkout, para forzar
    // la creación de un carrito nuevo en la próxima compra.
    const resetCart = () => {
        if (userId) {
            localStorage.removeItem(`cart_id_user_${userId}`);
        }
        setCartId(null);
    };

    return { cartId, loading, resetCart };
}
