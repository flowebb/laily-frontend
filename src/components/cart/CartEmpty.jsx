// CartEmpty.jsx
// 빈 장바구니 표시 컴포넌트
import { useNavigate } from 'react-router-dom';

const CartEmpty = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: isMobile ? '2rem 0' : '4rem 0' }}>
      <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#666', marginBottom: isMobile ? '1.5rem' : '2rem' }}>장바구니가 비어있습니다.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: isMobile ? '0.6rem 1.5rem' : '0.75rem 2rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: isMobile ? '0.9rem' : '1rem',
          cursor: 'pointer',
        }}
      >
        쇼핑하기
      </button>
    </div>
  );
};

export default CartEmpty;

