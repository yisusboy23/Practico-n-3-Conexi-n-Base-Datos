import { useState } from 'react';
import { useAuth } from './Components/features/auth/hooks/useAuth';
import { useCartId } from './Components/features/cart/hooks/useCartId';
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
  const [showRegister, setShowRegister] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const { user, logout, loading } = useAuth();
  const { cartId, loading: cartLoading, resetCart } = useCartId(user?.id);

  const isAdmin = user?.role === 'admin';

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
            <Login onLoginSuccess={() => {}} />
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
    if (!cartId) {
      alert('Tu carrito todavía se está preparando, intenta de nuevo en un momento.');
      return;
    }
    try {
      await cartApi.addItem(cartId, { product_id: product.id, quantity: 1 });
      alert(`${product.name} agregado al carrito`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  const handleCheckoutSuccess = (order) => {
    setOrderConfirmed(order);
    setShowCheckout(false);
    resetCart();
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

      {orderConfirmed && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', border: '1px solid #28a745', borderRadius: '4px', marginBottom: '20px' }}>
          ¡Pedido confirmado! Número de orden: <strong>{orderConfirmed.order_number}</strong>. Total: ${orderConfirmed.total}
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
        <ListaProductos
          onSeleccionarProducto={(p) => console.log('Producto:', p)}
          onAddToCart={handleAddToCart}
        />
      )}
      {seccion === 'categorias' && (
        <ListaCategorias onSeleccionarCategoria={(c) => console.log('Categoria:', c)} />
      )}
      {seccion === 'marcas' && (
        <ListaMarcas onSeleccionarMarca={(m) => console.log('Marca:', m)} />
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
