import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { MAX_WIDTH } from '../../constants/layout';

const Sale = () => {
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

  // API에서 SALE 상품 데이터 가져오기 (할인 가격이 있는 상품)
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
          // SALE 상품 필터링 (할인 가격이 있거나 status에 'SALE'이 포함된 상품)
          const saleProducts = data.products.filter(product => 
            (product.price?.discountedPrice && product.price.discountedPrice < product.price.originalPrice) ||
            (product.status && product.status.includes('SALE'))
          );
          setProducts(saleProducts);
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

  // 가격 포맷팅 함수
  const formatPrice = (product) => {
    if (product.price?.discountedPrice && product.price.discountedPrice < product.price.originalPrice) {
      const discountPercentage = Math.round(
        ((product.price.originalPrice - product.price.discountedPrice) / product.price.originalPrice) * 100
      );
      return (
        <>
          <span style={{ fontWeight: 'bold', color: '#ff0000', marginRight: '0.5rem' }}>
            ₩{product.price.discountedPrice.toLocaleString()}
          </span>
          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem', marginRight: '0.5rem' }}>
            ₩{product.price.originalPrice.toLocaleString()}
          </span>
          <span style={{ color: '#ff0000', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {discountPercentage}%
          </span>
        </>
      );
    }
    return <span style={{ fontWeight: 'bold' }}>₩{product.price?.originalPrice?.toLocaleString() || '가격 없음'}</span>;
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
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '2rem', padding: isMobile ? '0 1rem' : '0' }}>SALE</h1>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
            <p>등록된 SALE 상품이 없습니다.</p>
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
            {products.map((product) => {
              const discountPercentage = product.price?.discountedPrice && product.price.originalPrice
                ? Math.round(((product.price.originalPrice - product.price.discountedPrice) / product.price.originalPrice) * 100)
                : 0;

              return (
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
                    {discountPercentage > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#ff0000',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {discountPercentage}%
                      </div>
                    )}
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
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{formatPrice(product)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sale;

