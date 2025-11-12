import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { MAX_WIDTH } from '../../constants/layout';

const New = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // API에서 NEW 상품 데이터 가져오기 (예: status에 NEW가 포함된 상품)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          // NEW 상품 필터링 (status에 'NEW'가 포함된 상품)
          const newProducts = data.products.filter(product => 
            product.status && product.status.includes('NEW')
          );
          setProducts(newProducts);
        }
      } catch (error) {
        console.error('상품 가져오기 실패:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Navbar />
        <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <p>상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '2rem', padding: isMobile ? '0 1rem' : '0' }}>NEW</h1>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
            <p>등록된 NEW 상품이 없습니다.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '1rem' : '2rem',
              justifyContent: 'center',
              justifyItems: 'center',
              padding: isMobile ? '0 1rem' : '0',
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                style={{ cursor: 'pointer', width: '100%', maxWidth: '100%' }}
              >
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
                    src={product.image || 'https://via.placeholder.com/300x400?text=No+Image'}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // 관심상품 추가 기능
                    }}
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
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
                  ₩{product.price?.discountedPrice?.toLocaleString() || product.price?.originalPrice?.toLocaleString() || '0'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default New;

