import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { MAX_WIDTH } from '../../constants/layout';

const Dress = () => {
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

  // API에서 DRESS 카테고리 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products?category=DRESS');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('상품 데이터 형식이 올바르지 않습니다:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('상품 데이터 가져오기 중 오류:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 가격 포맷팅 함수
  const formatPrice = (product) => {
    if (product.price?.discountedPrice) {
      return (
        <>
          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem', marginRight: '0.5rem' }}>
            ₩{product.price.originalPrice?.toLocaleString()}
          </span>
          <span style={{ fontWeight: 'bold' }}>
            ₩{product.price.discountedPrice.toLocaleString()}
          </span>
        </>
      );
    }
    return <span style={{ fontWeight: 'bold' }}>₩{product.price?.originalPrice?.toLocaleString() || '가격 없음'}</span>;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>로딩 중...</p>
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
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '2rem' }}>DRESS</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
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
                      // 위시리스트 기능 (추후 구현)
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
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{formatPrice(product)}</p>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>등록된 상품이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dress;




