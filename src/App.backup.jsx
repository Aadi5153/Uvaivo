import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import ToastContainer from './components/Toast.jsx';
import Logo from './components/Logo.jsx';
import CustomerBottomNav from './components/CustomerBottomNav.jsx';
import CustomerLogin from './pages/CustomerLogin.jsx';
import OTPVerification from './pages/OTPVerification.jsx';
import CustomerProfileSetup from './pages/CustomerProfileSetup.jsx';
import CustomerHome from './pages/CustomerHome.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import StoreDetails from './pages/StoreDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Payment from './pages/Payment.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Orders from './pages/Orders.jsx';
import CustomerProfilePage from './pages/CustomerProfilePage.jsx';
import SellerLogin from './pages/SellerLogin.jsx';
import SellerRegistration from './pages/SellerRegistration.jsx';
import SellerSubscription from './pages/SellerSubscription.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import SellerProducts from './pages/SellerProducts.jsx';
import SellerAddProduct from './pages/SellerAddProduct.jsx';
import SellerEditProduct from './pages/SellerEditProduct.jsx';
import SellerOrders from './pages/SellerOrders.jsx';
import SellerStoreProfile from './pages/SellerStoreProfile.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import './App.css';

// ==================== ROLE SELECTION ====================
function RoleSelection({ onSelect }) {
  return (
    <div className="welcome-page">
      <div className="welcome-logo"><Logo size={80} /></div>
      <div className="welcome-title">Uvaivo</div>
      <div className="welcome-sub">Your Local Marketplace</div>
      <div className="welcome-desc">Shop local products from nearby stores.</div>

      <div className="role-cards">
        <div className="role-card" onClick={() => onSelect('customer')}>
          <div className="role-icon">🛒</div>
          <div className="role-info">
            <div className="role-title">Customer</div>
            <div className="role-sub">Browse products and place orders</div>
          </div>
          <div className="role-arrow">→</div>
        </div>
        <div className="role-card" onClick={() => onSelect('seller')}>
          <div className="role-icon">🏪</div>
          <div className="role-info">
            <div className="role-title">Seller</div>
            <div className="role-sub">Sell products through Uvaivo</div>
          </div>
          <div className="role-arrow">→</div>
        </div>
        <div className="role-card" onClick={() => onSelect('admin')}>
          <div className="role-icon">🔐</div>
          <div className="role-info">
            <div className="role-title">Admin</div>
            <div className="role-sub">Manage the Uvaivo platform</div>
          </div>
          <div className="role-arrow">→</div>
        </div>
      </div>

      <div className="free-note">
        <span className="free-note-icon">✓</span>
        <span>Customer registration is FREE</span>
      </div>
    </div>
  );
}

// ==================== CUSTOMER FLOW ====================
function CustomerFlow({ onExit }) {
  const { customer, loginCustomer, updateCustomer, logoutCustomer } = useApp();
  const [step, setStep] = useState(customer ? 'home' : 'login');
  const [pendingMobile, setPendingMobile] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleLogout = () => {
    logoutCustomer();
    setStep('login');
    setActiveTab('home');
    onExit();
  };

  if (step === 'login') {
    return (
      <CustomerLogin
        onBack={onExit}
        onOtpSent={(m) => { setPendingMobile(m); setStep('otp'); }}
      />
    );
  }
  if (step === 'otp') {
    return (
      <OTPVerification
        mobile={pendingMobile}
        onBack={() => setStep('login')}
        onVerified={() => {
          const u = loginCustomer(pendingMobile);
          setStep(u?.name ? 'home' : 'profile');
        }}
      />
    );
  }
  if (step === 'profile') {
    return (
      <CustomerProfileSetup
        mobile={pendingMobile}
        onDone={(data) => { updateCustomer(data); setStep('home'); }}
      />
    );
  }
  if (step === 'success' && placedOrder) {
    return (
      <OrderSuccess
        order={placedOrder}
        onTrackOrder={() => { setStep('home'); setActiveTab('orders'); }}
        onContinueShopping={() => { setStep('home'); setActiveTab('home'); setPlacedOrder(null); }}
      />
    );
  }
  if (step === 'payment' && checkoutData) {
    return (
      <Payment
        orderData={checkoutData}
        onBack={() => setStep('checkout')}
        onSuccess={(order) => { setPlacedOrder(order); setStep('success'); }}
      />
    );
  }
  if (step === 'checkout') {
    return (
      <Checkout
        onBack={() => setStep('home')}
        onProceedToPayment={(data) => { setCheckoutData(data); setStep('payment'); }}
      />
    );
  }
  if (selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onOpenStore={(s) => { setSelectedProduct(null); setSelectedStore(s); }}
        onBuyNow={() => { setSelectedProduct(null); setStep('checkout'); }}
      />
    );
  }
  if (selectedStore) {
    return (
      <StoreDetails
        store={selectedStore}
        onBack={() => setSelectedStore(null)}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />
    );
  }

  return (
    <>
      {activeTab === 'home' && (
        <CustomerHome
          onOpenStore={(s) => setSelectedStore(s)}
          onOpenProduct={(p) => setSelectedProduct(p)}
          onOpenProfile={() => setActiveTab('profile')}
        />
      )}
      {activeTab === 'cart' && (
        <Cart
          onContinueShopping={() => setActiveTab('home')}
          onCheckout={() => setStep('checkout')}
        />
      )}
      {activeTab === 'orders' && (
        <Orders onContinueShopping={() => setActiveTab('home')} onOpenOrder={() => {}} />
      )}
      {activeTab === 'profile' && (
        <CustomerProfilePage
          onLogout={handleLogout}
          onOpenOrders={() => setActiveTab('orders')}
        />
      )}
      <CustomerBottomNav active={activeTab} onChange={setActiveTab} />
    </>
  );
}

// ==================== SELLER FLOW ====================
function SellerFlow({ onExit }) {
  const { seller, subscription, loginSeller, logoutSeller } = useApp();
  const [step, setStep] = useState(seller ? 'dashboard' : 'login');
  const [pendingMobile, setPendingMobile] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const handleLogout = () => {
    logoutSeller();
    setStep('login');
    onExit();
  };

  if (step === 'login') {
    return (
      <SellerLogin
        onBack={onExit}
        onOtpSent={(m) => {
          setPendingMobile(m);
          const existing = loginSeller(m);
          if (existing) {
            setStep('dashboard');
          } else {
            setStep('otp');
          }
        }}
      />
    );
  }
  if (step === 'otp') {
    return (
      <OTPVerification
        mobile={pendingMobile}
        onBack={() => setStep('login')}
        onVerified={() => setStep('register')}
      />
    );
  }
  if (step === 'register') {
    return (
      <SellerRegistration
        mobile={pendingMobile}
        onDone={() => setStep('subscription')}
      />
    );
  }
  if (step === 'subscription') {
    return (
      <SellerSubscription
        seller={seller}
        onActivated={() => setStep('dashboard')}
        onLogout={handleLogout}
      />
    );
  }
  if (!seller) {
    return (
      <SellerLogin
        onBack={onExit}
        onOtpSent={(m) => { setPendingMobile(m); setStep('otp'); }}
      />
    );
  }
  if (step === 'add') {
    return (
      <SellerAddProduct
        seller={seller}
        subscription={subscription}
        onBack={() => setStep('dashboard')}
        onSaved={() => setStep('products')}
      />
    );
  }
  if (step === 'products') {
    return (
      <SellerProducts
        seller={seller}
        onBack={() => setStep('dashboard')}
        onAdd={() => setStep('add')}
        onEdit={(p) => { setEditingProduct(p); setStep('edit'); }}
      />
    );
  }
  if (step === 'edit' && editingProduct) {
    return (
      <SellerEditProduct
        product={editingProduct}
        onBack={() => setStep('products')}
        onSaved={() => { setEditingProduct(null); setStep('products'); }}
      />
    );
  }
  if (step === 'orders') {
    return <SellerOrders seller={seller} onBack={() => setStep('dashboard')} />;
  }
  if (step === 'store') {
    return (
      <SellerStoreProfile
        seller={seller}
        subscription={subscription}
        onBack={() => setStep('dashboard')}
      />
    );
  }
  if (step === 'subscription-view') {
    return (
      <SellerSubscription
        seller={seller}
        onActivated={() => setStep('dashboard')}
        onLogout={handleLogout}
      />
    );
  }
  if (step === 'settings') {
    return (
      <>
        <div className="page-header">
          <button className="back-btn" onClick={() => setStep('dashboard')}>←</button>
          <div className="page-title">Settings</div>
        </div>
        <div className="section" style={{ marginTop: 16 }}>
          <div className="menu-card">
            <div className="menu-item">
              <span className="menu-icon">📱</span>
              <span className="menu-label">+91 {seller.mobile}</span>
            </div>
            <div className="menu-item">
              <span className="menu-icon">🏪</span>
              <span className="menu-label">{seller.storeName}</span>
            </div>
          </div>
          <button className="btn btn-danger btn-lg btn-full" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <SellerDashboard
      seller={seller}
      subscription={subscription}
      onNavigate={(id) => {
        if (id === 'subscription') setStep('subscription-view');
        else setStep(id);
      }}
      onLogout={handleLogout}
    />
  );
}

// ==================== ADMIN FLOW ====================
function AdminFlow({ onExit }) {
  const { adminAuth, logoutAdmin } = useApp();
  const [step, setStep] = useState(adminAuth ? 'dashboard' : 'login');

  const handleLogout = () => {
    logoutAdmin();
    setStep('login');
    onExit();
  };

  if (step === 'login') {
    return <AdminLogin onBack={onExit} onSuccess={() => setStep('dashboard')} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

// ==================== APP INNER ====================
function AppInner() {
  const [role, setRole] = useState(null);
  const isCustomer = role === 'customer';

  return (
    <div className={`app-shell ${isCustomer ? '' : 'full-width'}`}>
      {!role && <RoleSelection onSelect={setRole} />}
      {role === 'customer' && <CustomerFlow onExit={() => setRole(null)} />}
      {role === 'seller' && <SellerFlow onExit={() => setRole(null)} />}
      {role === 'admin' && <AdminFlow onExit={() => setRole(null)} />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
