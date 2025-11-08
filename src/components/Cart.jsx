import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { MAX_WIDTH } from '../constants/layout';

const Cart = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />
      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        }}
      >
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '2rem' }}>CART</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '1rem', color: '#666' }}>
            장바구니 페이지입니다. 추후 구현 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;

