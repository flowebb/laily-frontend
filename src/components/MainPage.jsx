import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { MAX_WIDTH } from '../constants/layout';

const MainPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock product data
  const bestProducts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: '상품명',
    price: '가격',
    image: `https://via.placeholder.com/300x400?text=Product+${i + 1}`,
  }));

  const newArrivals = Array.from({ length: 8 }, (_, i) => ({
    id: i + 9,
    name: '상품명',
    price: '가격',
    image: `https://via.placeholder.com/300x400?text=New+${i + 1}`,
  }));

  const recommendProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i + 17,
    name: '상품명',
    price: '가격',
    image: `https://via.placeholder.com/300x400?text=Recommend+${i + 1}`,
  }));

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
  };

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
          {bestProducts.map((product) => (
            <div
              key={product.id}
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
          {newArrivals.map((product) => (
            <div
              key={product.id}
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
          {recommendProducts.map((product) => (
            <div
              key={product.id}
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
