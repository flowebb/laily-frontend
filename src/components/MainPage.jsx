import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { MAX_WIDTH } from '../constants/layout';

const MainPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [allProducts, setAllProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // API에서 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          const products = data.products;
          setAllProducts(products);

          // BEST PRODUCT: SALE 상태인 상품들 (최대 8개)
          const saleProducts = products
            .filter(p => p.status && Array.isArray(p.status) && p.status.includes('SALE'))
            .slice(0, 8);
          setBestProducts(saleProducts);

          // NEW ARRIVAL: NEW 상태인 상품들 (최대 8개)
          const newProducts = products
            .filter(p => p.status && Array.isArray(p.status) && p.status.includes('NEW'))
            .slice(0, 8);
          setNewArrivals(newProducts);

          // RECOMMEND: 전체 상품 중 랜덤 선택 (최대 4개)
          const shuffled = [...products].sort(() => Math.random() - 0.5);
          const recommend = shuffled.slice(0, 4);
          setRecommendProducts(recommend);
        } else {
          console.error('상품 데이터 형식이 올바르지 않습니다:', data);
          setAllProducts([]);
          setBestProducts([]);
          setNewArrivals([]);
          setRecommendProducts([]);
        }
      } catch (error) {
        console.error('상품 데이터 가져오기 중 오류:', error);
        setAllProducts([]);
        setBestProducts([]);
        setNewArrivals([]);
        setRecommendProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
  };

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <Navbar />

      {/* Main Banner/Carousel */}
      <section
        style={{
          width: '100%',
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          position: 'relative',
          marginTop: '2rem',
          marginBottom: '4rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Main Carousel */}
          {!isMobile && (
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                gap: '1rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '500px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="https://via.placeholder.com/600x500?text=Model+1"
                  alt="Model 1"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  height: '500px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="https://via.placeholder.com/600x500?text=Model+2"
                  alt="Model 2"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          {/* Mobile Carousel */}
          {isMobile && (
            <div
              style={{
                flex: 1,
                position: 'relative',
                height: '400px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.3s ease',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    minWidth: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <img
                    src="https://via.placeholder.com/400x400?text=Model+1"
                    alt="Model 1"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    minWidth: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <img
                    src="https://via.placeholder.com/400x400?text=Model+2"
                    alt="Model 2"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Carousel Controls */}
              <button
                onClick={handlePrevSlide}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ‹
              </button>
              <button
                onClick={handleNextSlide}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ›
              </button>

              {/* Pagination Dots */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {[0, 1].map((dot) => (
                  <div
                    key={dot}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: dot === currentSlide ? '#000' : '#ccc',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BEST PRODUCT Section */}
      <section
        style={{
          width: '100%',
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 0' : '4rem 0',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
          }}
        >
          BEST PRODUCT
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          {bestProducts.length > 0 ? (
            bestProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '100%',
                }}
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
      </section>

      {/* NEW ARRIVAL Section */}
      <section
        style={{
          width: '100%',
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 0' : '4rem 0',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
          }}
        >
          NEW ARRIVAL
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '100%',
                }}
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
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              ‹
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: page === 1 ? '#000' : '#ccc',
                  }}
                />
              ))}
            </div>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              ›
            </button>
          </div>
        )}
      </section>

      {/* LOOKBOOK Section */}
      <section
        style={{
          width: '100%',
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 0' : '4rem 0',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
          }}
        >
          LOOKBOOK
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '133%',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://via.placeholder.com/500x600?text=Lookbook+1"
              alt="Lookbook 1"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '133%',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://via.placeholder.com/500x600?text=For+your+daily+look"
              alt="Lookbook 2"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: isMobile ? '1rem' : '1.5rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              For your daily look
            </div>
          </div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '133%',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://via.placeholder.com/500x600?text=Lookbook+3"
              alt="Lookbook 3"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </section>

      {/* RECOMMEND Section */}
      <section
        style={{
            width: '100%',
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 0' : '4rem 0',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
          }}
        >
          RECOMMEND
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          {recommendProducts.length > 0 ? (
            recommendProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '100%',
                }}
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
      </section>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          marginTop: '4rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>HATBLUE © 2024</p>
      </footer>
    </div>
  );
};

export default MainPage;
