import { useNavigate, useLocation } from 'react-router-dom';

const ProductManagement = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // activeTab이 제공되지 않으면 현재 경로로 판단
  const currentTab = activeTab || (location.pathname.includes('/new') ? 'register' : 'list');

  return (
    <header
      style={{
        backgroundColor: 'white',
        padding: '1.2rem 2.4rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.44rem',
              padding: '0.3rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
            상품 관리
          </h1>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          style={{
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span>+</span>
          <span>새 상품 등록</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e0e0e0' }}>
        <button
          onClick={() => navigate('/admin/products')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0.9rem 1.8rem',
            cursor: 'pointer',
            fontSize: '1.15rem',
            color: currentTab === 'list' ? '#333' : '#666',
            fontWeight: currentTab === 'list' ? '600' : '400',
            borderBottom: currentTab === 'list' ? '2px solid #333' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          상품 목록
        </button>
        <button
          onClick={() => navigate('/admin/products/new')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0.9rem 1.8rem',
            cursor: 'pointer',
            fontSize: '1.15rem',
            color: currentTab === 'register' ? '#333' : '#666',
            fontWeight: currentTab === 'register' ? '600' : '400',
            borderBottom: currentTab === 'register' ? '2px solid #333' : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          상품 등록
        </button>
      </div>
    </header>
  );
};

export default ProductManagement;

