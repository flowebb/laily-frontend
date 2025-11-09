import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { MAX_WIDTH } from '../../constants/layout';

const Top = () => {
  const products = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: '상품명',
    price: '가격',
    image: `https://via.placeholder.com/300x400?text=Top+${i + 1}`,
  }));

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
          padding: isMobile ? '2rem 0' : '4rem 0',
        }}
      >
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '2rem' }}>TOP</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          {products.map((product) => (
            <div key={product.id} style={{ cursor: 'pointer', width: '100%', maxWidth: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '133%',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <button
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ♡
                </button>
              </div>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{product.name}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top;



