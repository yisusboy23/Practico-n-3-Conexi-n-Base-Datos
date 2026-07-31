import { useState, useEffect } from 'react';
import { useAuth } from './Components/features/auth/hooks/useAuth';
import { cartApi } from './Components/features/cart/api/cartApi';
import Login from './Components/features/auth/components/Login';
import Register from './Components/features/auth/components/Register';
import ListaProductos from './Components/features/products/components/ListaProductos';
import ListaCategorias from './Components/features/categories/components/ListaCategorias';
import ListaMarcas from './Components/features/brands/components/ListaMarcas';
import AdminPanel from './Components/features/admin/AdminPanel';
import CartView from './Components/features/cart/components/CartView';
import Checkout from './Components/features/checkout/components/Checkout';
import './App.css';

function App() {
  const [seccion, setSeccion] = useState('productos');
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroMarca, setFiltroMarca] = useState(null); 
  const [showRegister, setShowRegister] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const { user, logout, loading } = useAuth();
  const isAdmin = user?.role === 'admin';

  // FUNCIÓN PARA CREAR/OBTENER CARRITO - VERSIÓN DEFINITIVA
  const getOrCreateCart = async () => {
    const token = localStorage.getItem('token');
    
    console.log('🔍 getOrCreateCart - token:', token ? 'SÍ' : 'NO');
    console.log('🔍 getOrCreateCart - user:', user);
    
    if (!token || !user?.id) {
      setCartLoading(false);
      return;
    }

    const storageKey = `cart_id_user_${user.id}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      console.log('🔍 Usando carrito guardado:', stored);
      setCartId(Number(stored));
      setCartLoading(false);
      setCartError(null);
      return;
    }

    setCartLoading(true);
    setCartError(null);

    try {
      console.log('🔍 Creando carrito nuevo...');
      const response = await fetch('http://127.0.0.1:8000/api/carts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      console.log('🔍 Respuesta carrito:', data);
      
      // Extraer el ID correctamente
      const cartData = data.data || data;
      if (cartData.id) {
        localStorage.setItem(storageKey, String(cartData.id));
        setCartId(cartData.id);
        setCartError(null);
        console.log('✅ Carrito creado con ID:', cartData.id);
      } else {
        setCartError('Error al crear carrito: ' + JSON.stringify(data));
        console.error('❌ Error:', data);
      }
    } catch (err) {
      setCartError('Error: ' + err.message);
      console.error('❌ Error:', err);
    } finally {
      setCartLoading(false);
    }
  };

  // Cuando el usuario cambia, obtener carrito
  useEffect(() => {
    if (user?.id) {
      getOrCreateCart();
    } else {
      setCartLoading(false);
      setCartId(null);
    }
  }, [user?.id]);

  // Recargar cuando hay error
  useEffect(() => {
    if (cartError) {
      console.log('⚠️ Hay error, mostrando mensaje');
    }
  }, [cartError]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;
  }

  if (!user) {
    return (
      <div>
        {showRegister ? (
          <div>
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setShowRegister(false)}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Login onLoginSuccess={() => {
              // Recargar después del login
              window.location.reload();
            }} />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setShowRegister(true)}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Registrarse
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  const handleAddToCart = async (product) => {
    console.log('🛒 Agregando producto:', product.name);
    console.log('🛒 cartId actual:', cartId);
    
    if (!cartId) {
      if (cartLoading) {
        alert('Preparando carrito, espera...');
        return;
      }
      // Intentar crear carrito nuevamente
      await getOrCreateCart();
      if (!cartId) {
        alert('Error con el carrito. Intenta de nuevo.');
        return;
      }
    }

    try {
      await cartApi.addItem(cartId, { 
        product_id: product.id, 
        quantity: 1 
      });
      alert(`${product.name} agregado al carrito`);
    } catch (err) {
      console.error('❌ Error:', err);
      alert(err.response?.data?.message || 'Error al agregar');
    }
  };

  const handleSeleccionarMarca = (marca) => {
      console.log('🏷️ Marca seleccionada:', marca);
      setFiltroMarca(marca.id);
      setFiltroCategoria(null); // Limpiar filtro de categoría
      setSeccion('productos');
  };
  const handleSeleccionarCategoria = (categoria) => {
      console.log('📂 Categoría seleccionada:', categoria);
      setFiltroCategoria(categoria.id);
      setFiltroMarca(null);
      setSeccion('productos');
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
      setFiltroCategoria(null);
      setFiltroMarca(null);
  };

  const handleCheckoutSuccess = (order) => {
    setOrderConfirmed(order);
    setShowCheckout(false);
    // Limpiar carrito guardado
    if (user?.id) {
      localStorage.removeItem(`cart_id_user_${user.id}`);
    }
    setCartId(null);
    getOrCreateCart();
    setSeccion('productos');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Tienda Tecnologica</h1>
        <div>
          <span style={{ marginRight: '15px' }}>
            {user.name}
            {isAdmin && (
              <span style={{ backgroundColor: '#28a745', color: 'white', padding: '2px 10px', borderRadius: '12px', marginLeft: '10px', fontSize: '12px' }}>
                ADMIN
              </span>
            )}
          </span>
          <button
            onClick={logout}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar Sesion
          </button>
        </div>
      </div>

      {cartError && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', border: '2px solid #dc3545', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>⚠️ Error:</strong> {cartError}
          <br />
          <button 
            onClick={() => {
              setCartError(null);
              getOrCreateCart();
            }}
            style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {orderConfirmed && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', border: '1px solid #28a745', borderRadius: '4px', marginBottom: '20px' }}>
          ✅ ¡Pedido confirmado! Número: <strong>{orderConfirmed.order_number}</strong>. Total: ${orderConfirmed.total}
          <button
            onClick={() => setOrderConfirmed(null)}
            style={{ marginLeft: '15px', background: 'none', border: 'none', color: '#155724', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Cerrar
          </button>
        </div>
      )}

      <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSeccion('productos')}
          style={{
            padding: '10px 20px',
            backgroundColor: seccion === 'productos' ? '#007bff' : 'transparent',
            color: seccion === 'productos' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Productos
        </button>
        <button
          onClick={() => setSeccion('categorias')}
          style={{
            padding: '10px 20px',
            backgroundColor: seccion === 'categorias' ? '#007bff' : 'transparent',
            color: seccion === 'categorias' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Categorias
        </button>
        <button
          onClick={() => setSeccion('marcas')}
          style={{
            padding: '10px 20px',
            backgroundColor: seccion === 'marcas' ? '#007bff' : 'transparent',
            color: seccion === 'marcas' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Marcas
        </button>
        <button
          onClick={() => { setSeccion('carrito'); setShowCheckout(false); }}
          style={{
            padding: '10px 20px',
            backgroundColor: seccion === 'carrito' ? '#007bff' : 'transparent',
            color: seccion === 'carrito' ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Carrito
        </button>

        {isAdmin && (
          <button
            onClick={() => setSeccion('admin')}
            style={{
              padding: '10px 20px',
              backgroundColor: seccion === 'admin' ? '#28a745' : 'transparent',
              color: seccion === 'admin' ? 'white' : '#28a745',
              border: '1px solid #28a745',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Panel Admin
          </button>
        )}
      </nav>

      {seccion === 'productos' && (
          <div>
              {/* Mostrar filtros activos */}
              {(filtroCategoria || filtroMarca) && (
                  <div style={{ marginBottom: '15px' }}>
                      <span style={{ backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '4px' }}>
                          {filtroCategoria ? '📂 Categoría filtrada' : '🏷️ Marca filtrada'}
                      </span>
                      <button 
                          onClick={limpiarFiltros}
                          style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                          ✕ Limpiar filtro
                      </button>
                  </div>
              )}
              <ListaProductos
                  filtros={{
                      category_id: filtroCategoria,
                      brand_id: filtroMarca
                  }}
                  onSeleccionarProducto={(p) => console.log('Producto:', p)}
                  onAddToCart={handleAddToCart}
              />
          </div>
      )}
      {seccion === 'categorias' && (
    <ListaCategorias onSeleccionarCategoria={handleSeleccionarCategoria} />
      )}
      {seccion === 'marcas' && (
          <ListaMarcas onSeleccionarMarca={handleSeleccionarMarca} />
      )}
      {seccion === 'carrito' && (
        cartLoading ? (
          <p>Preparando tu carrito...</p>
        ) : showCheckout ? (
          <Checkout
            cartId={cartId}
            user={user}
            onSuccess={handleCheckoutSuccess}
            onCancel={() => setShowCheckout(false)}
          />
        ) : (
          <CartView cartId={cartId} onCheckout={() => setShowCheckout(true)} />
        )
      )}
      {seccion === 'admin' && isAdmin && <AdminPanel />}
    </div>
  );
}

export default App;