import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

function RoleSelection() {
  const navigate = useNavigate();
  return (
    <div className="welcome-page">
      <div className="welcome-logo"><Logo size={80} /></div>
      <div className="welcome-title">Uvaivo</div>
      <div className="welcome-sub">Your Local Marketplace</div>
      <div className="welcome-desc">Shop local products from nearby stores.</div>
      <div className="role-cards">
        <div className="role-card" onClick={() => navigate('/login')}>
          <div className="role-icon">🛒</div>
          <div className="role-info">
            <div className="role-title">Customer</div>
            <div className="role-sub">Browse products and place orders</div>
          </div>
          <div className="role-arrow">→</div>
        </div>
        <div className="role-card" onClick={() => navigate('/seller/login')}>
          <div className="role-icon">🏪</div>
          <div className="role-info">
            <div className="role-title">Seller</div>
            <div className="role-sub">Sell products through Uvaivo</div>
          </div>
          <div className="role-arrow">→</div>
        </div>
        <div className="role-card" onClick={() => navigate('/admin/login')}>
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

function CustomerLayout({ children, activeTab }) {
  const navigate = useNavigate();
  return (
    <>
      {children}
      <CustomerBottomNav active={activeTab} onChange={(tab) => navigate('/' + tab)} />
    </>
  );
}

function CustomerLoginWrapper() {
  const navigate = useNavigate();
  return (
    <CustomerLogin
      onBack={() => navigate('/')}
      onOtpSent={(mobile) => {
        sessionStorage.setItem('uvaivo_pending_mobile', mobile);
        navigate('/otp');
      }}
    />
  );
}

function OTPWrapper() {
  const navigate = useNavigate();
  const { loginCustomer } = useApp();
  const mobile = sessionStorage.getItem('uvaivo_pending_mobile') || '';
  if (!mobile) return <Navigate to="/login" replace />;

  return (
    <OTPVerification
      mobile={mobile}
      onBack={() => navigate('/login')}
      onVerified={async () => {
        const user = await loginCustomer(mobile);
        sessionStorage.setItem('uvaivo_profile_mobile', mobile);
        if (user?.name) navigate('/home');
        else navigate('/profile-setup');
      }}
    />
  );
}

function ProfileSetupWrapper() {
  const navigate = useNavigate();
  const { customer, updateCustomer } = useApp();
  const mobile = customer?.mobile || sessionStorage.getItem('uvaivo_profile_mobile') || '';
  if (!mobile) return <Navigate to="/login" replace />;

  return (
    <CustomerProfileSetup
      mobile={mobile}
      onDone={async (data) => {
        await updateCustomer(data);
        sessionStorage.removeItem('uvaivo_profile_mobile');
        navigate('/home');
      }}
    />
  );
}

function CustomerHomeRoute() {
  const navigate = useNavigate();
  return (
    <CustomerLayout activeTab="home">
      <CustomerHome
        onOpenStore={(s) => navigate('/store/' + s.id)}
        onOpenProduct={(p) => navigate('/product/' + p.id)}
        onOpenProfile={() => navigate('/profile')}
      />
    </CustomerLayout>
  );
}

function ProductDetailsRoute() {
  const navigate = useNavigate();
  const { products } = useApp();
  const id = window.location.pathname.split('/').pop();
  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="empty-state" style={{ paddingTop: 100 }}>
        <div className="empty-icon">❌</div>
        <div className="empty-title">Product not found</div>
        <button className="btn btn-primary btn-md mt-16" onClick={() => navigate('/home')}>Go Home</button>
      </div>
    );
  }
  return (
    <ProductDetails
      product={product}
      onBack={() => navigate(-1)}
      onOpenStore={(s) => navigate('/store/' + s.id)}
      onBuyNow={() => navigate('/checkout')}
    />
  );
}

function StoreDetailsRoute() {
  const navigate = useNavigate();
  const { allStores } = useApp();
  const id = window.location.pathname.split('/').pop();
  const store = allStores.find((s) => s.id === id);
  if (!store) {
    return (
      <div className="empty-state" style={{ paddingTop: 100 }}>
        <div className="empty-icon">❌</div>
        <div className="empty-title">Store not found</div>
        <button className="btn btn-primary btn-md mt-16" onClick={() => navigate('/home')}>Go Home</button>
      </div>
    );
  }
  return (
    <StoreDetails
      store={store}
      onBack={() => navigate(-1)}
      onOpenProduct={(p) => navigate('/product/' + p.id)}
    />
  );
}

function CartRoute() {
  const navigate = useNavigate();
  return (
    <CustomerLayout activeTab="cart">
      <Cart onContinueShopping={() => navigate('/home')} onCheckout={() => navigate('/checkout')} />
    </CustomerLayout>
  );
}

function OrdersRoute() {
  const navigate = useNavigate();
  return (
    <CustomerLayout activeTab="orders">
      <Orders onContinueShopping={() => navigate('/home')} onOpenOrder={() => {}} />
    </CustomerLayout>
  );
}

function ProfileRoute() {
  const navigate = useNavigate();
  const { logoutCustomer } = useApp();
  return (
    <CustomerLayout activeTab="profile">
      <CustomerProfilePage
        onLogout={() => { logoutCustomer(); navigate('/'); }}
        onOpenOrders={() => navigate('/orders')}
      />
    </CustomerLayout>
  );
}

function CheckoutRoute() {
  const navigate = useNavigate();
  return (
    <Checkout
      onBack={() => navigate(-1)}
      onProceedToPayment={(data) => {
        sessionStorage.setItem('uvaivo_checkout_data', JSON.stringify(data));
        navigate('/payment');
      }}
    />
  );
}

function PaymentRoute() {
  const navigate = useNavigate();
  const raw = sessionStorage.getItem('uvaivo_checkout_data');
  const data = raw ? JSON.parse(raw) : null;
  if (!data) return <Navigate to="/cart" replace />;

  return (
    <Payment
      orderData={data}
      onBack={() => navigate('/checkout')}
      onSuccess={(order) => {
        sessionStorage.removeItem('uvaivo_checkout_data');
        navigate('/order-success/' + order.id);
      }}
    />
  );
}

function OrderSuccessRoute() {
  const navigate = useNavigate();
  const { orders } = useApp();
  const id = window.location.pathname.split('/').pop();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="empty-state" style={{ paddingTop: 100 }}>
        <div className="empty-icon">❌</div>
        <div className="empty-title">Order not found</div>
        <button className="btn btn-primary btn-md mt-16" onClick={() => navigate('/home')}>Go Home</button>
      </div>
    );
  }
  return (
    <OrderSuccess
      order={order}
      onTrackOrder={() => navigate('/orders')}
      onContinueShopping={() => navigate('/home')}
    />
  );
}

// ============ SELLER WITH OTP ============
function SellerLoginWrapper() {
  const navigate = useNavigate();
  return (
    <SellerLogin
      onBack={() => navigate('/')}
      onOtpSent={(mobile) => {
        sessionStorage.setItem('uvaivo_seller_pending_mobile', mobile);
        navigate('/seller/otp');
      }}
    />
  );
}

function SellerOTPWrapper() {
  const navigate = useNavigate();
  const { loginSeller } = useApp();
  const mobile = sessionStorage.getItem('uvaivo_seller_pending_mobile') || '';
  if (!mobile) return <Navigate to="/seller/login" replace />;

  return (
    <OTPVerification
      mobile={mobile}
      onBack={() => navigate('/seller/login')}
      onVerified={async () => {
        sessionStorage.setItem('uvaivo_seller_mobile', mobile);
        sessionStorage.removeItem('uvaivo_seller_pending_mobile');
        const existing = await loginSeller(mobile);
        if (existing) {
          setTimeout(() => navigate('/seller/dashboard'), 150);
        } else {
          navigate('/seller/register');
        }
      }}
    />
  );
}

function SellerRegisterWrapper() {
  const navigate = useNavigate();
  const mobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!mobile) return <Navigate to="/seller/login" replace />;

  return (
    <SellerRegistration
      mobile={mobile}
      onDone={() => navigate('/seller/subscription')}
    />
  );
}

function SellerSubscriptionWrapper() {
  const navigate = useNavigate();
  const { seller } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <SellerSubscription
      seller={seller}
      onActivated={() => navigate('/seller/dashboard')}
      onLogout={() => {
        sessionStorage.removeItem('uvaivo_seller_mobile');
        navigate('/');
      }}
    />
  );
}

function SellerDashboardRoute() {
  const navigate = useNavigate();
  const { seller, subscription, logoutSeller } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <SellerDashboard
      seller={seller}
      subscription={subscription}
      onNavigate={(id) => navigate('/seller/' + id)}
      onLogout={() => {
        logoutSeller();
        sessionStorage.removeItem('uvaivo_seller_mobile');
        navigate('/');
      }}
    />
  );
}

function SellerProductsRoute() {
  const navigate = useNavigate();
  const { seller } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <SellerProducts
      seller={seller}
      onBack={() => navigate('/seller/dashboard')}
      onAdd={() => navigate('/seller/add')}
      onEdit={(p) => navigate('/seller/edit/' + p.id)}
    />
  );
}

function SellerAddProductRoute() {
  const navigate = useNavigate();
  const { seller, subscription } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <SellerAddProduct
      seller={seller}
      subscription={subscription}
      onBack={() => navigate('/seller/dashboard')}
      onSaved={() => navigate('/seller/products')}
    />
  );
}

function SellerEditProductRoute() {
  const navigate = useNavigate();
  const { seller, products } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  const id = window.location.pathname.split('/').pop();
  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="empty-state" style={{ paddingTop: 100 }}>
        <div className="empty-icon">❌</div>
        <div className="empty-title">Product not found</div>
        <button className="btn btn-primary btn-md mt-16" onClick={() => navigate('/seller/products')}>Back</button>
      </div>
    );
  }

  return (
    <SellerEditProduct
      product={product}
      onBack={() => navigate('/seller/products')}
      onSaved={() => navigate('/seller/products')}
    />
  );
}

function SellerOrdersRoute() {
  const navigate = useNavigate();
  const { seller } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return <SellerOrders seller={seller} onBack={() => navigate('/seller/dashboard')} />;
}

function SellerStoreRoute() {
  const navigate = useNavigate();
  const { seller, subscription } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <SellerStoreProfile
      seller={seller}
      subscription={subscription}
      onBack={() => navigate('/seller/dashboard')}
    />
  );
}

function SellerSettingsRoute() {
  const navigate = useNavigate();
  const { seller, logoutSeller } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/seller/dashboard')}>←</button>
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
        <button
          className="btn btn-danger btn-lg btn-full"
          onClick={() => {
            logoutSeller();
            sessionStorage.removeItem('uvaivo_seller_mobile');
            navigate('/');
          }}
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
}

function SellerSubscriptionViewRoute() {
  const navigate = useNavigate();
  const { seller, logoutSeller } = useApp();
  const savedMobile = sessionStorage.getItem('uvaivo_seller_mobile') || '';
  if (!seller && !savedMobile) return <Navigate to="/seller/login" replace />;
  if (!seller) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <SellerSubscription
      seller={seller}
      onActivated={() => navigate('/seller/dashboard')}
      onLogout={() => {
        logoutSeller();
        sessionStorage.removeItem('uvaivo_seller_mobile');
        navigate('/');
      }}
    />
  );
}

function AdminLoginWrapper() {
  const navigate = useNavigate();
  return (
    <AdminLogin onBack={() => navigate('/')} onSuccess={() => navigate('/admin/dashboard')} />
  );
}

function AdminDashboardWrapper() {
  const navigate = useNavigate();
  const { adminAuth, logoutAdmin } = useApp();
  if (!adminAuth) return <Navigate to="/admin/login" replace />;

  return <AdminDashboard onLogout={() => { logoutAdmin(); navigate('/'); }} />;
}

function AppInner() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<CustomerLoginWrapper />} />
        <Route path="/otp" element={<OTPWrapper />} />
        <Route path="/profile-setup" element={<ProfileSetupWrapper />} />
        <Route path="/home" element={<CustomerHomeRoute />} />
        <Route path="/product/:id" element={<ProductDetailsRoute />} />
        <Route path="/store/:id" element={<StoreDetailsRoute />} />
        <Route path="/cart" element={<CartRoute />} />
        <Route path="/checkout" element={<CheckoutRoute />} />
        <Route path="/payment" element={<PaymentRoute />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessRoute />} />
        <Route path="/orders" element={<OrdersRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />

        <Route path="/seller/login" element={<SellerLoginWrapper />} />
        <Route path="/seller/otp" element={<SellerOTPWrapper />} />
        <Route path="/seller/register" element={<SellerRegisterWrapper />} />
        <Route path="/seller/subscription" element={<SellerSubscriptionWrapper />} />
        <Route path="/seller/dashboard" element={<SellerDashboardRoute />} />
        <Route path="/seller/products" element={<SellerProductsRoute />} />
        <Route path="/seller/add" element={<SellerAddProductRoute />} />
        <Route path="/seller/edit/:id" element={<SellerEditProductRoute />} />
        <Route path="/seller/orders" element={<SellerOrdersRoute />} />
        <Route path="/seller/store" element={<SellerStoreRoute />} />
        <Route path="/seller/settings" element={<SellerSettingsRoute />} />
        <Route path="/seller/subscription-view" element={<SellerSubscriptionViewRoute />} />

        <Route path="/admin/login" element={<AdminLoginWrapper />} />
        <Route path="/admin/dashboard" element={<AdminDashboardWrapper />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
