// Navbar.jsx
// 사이트 상단 네비게이션 및 메뉴를 담당하는 컴포넌트
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MAX_WIDTH } from '../constants/layout';
import PromoBar from './PromoBar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모바일 메뉴가 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [location]);

  // 장바구니 아이템 개수 가져오기
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartItemCount(0);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/cart/count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCartItemCount(data.itemCount || 0);
          }
        }
      } catch (error) {
        console.error('장바구니 개수 가져오기 실패:', error);
      }
    };

    fetchCartCount();

    // 장바구니 업데이트 이벤트 리스너
    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [location, user]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  const handleMyPage = () => {
    navigate('/mypage');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleSignup = () => {
    navigate('/signup');
    setIsUserMenuOpen(false);
  };

  const handleOrderInquiry = () => {
    navigate('/mypage/orders');
    setIsUserMenuOpen(false);
  };

  const handleDeliveryInquiry = () => {
    navigate('/mypage/delivery');
    setIsUserMenuOpen(false);
  };

  const handleCouponInquiry = () => {
    navigate('/mypage/coupons');
    setIsUserMenuOpen(false);
  };

  const handleCustomerCenter = () => {
    navigate('/customer-center');
    setIsUserMenuOpen(false);
  };

  // 외부 클릭 시 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <PromoBar />
      <header
        style={{
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
        }}
      >
      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          paddingTop: isMobile ? '1rem' : '2rem',
          paddingBottom: isMobile ? '1rem' : '2rem',
          paddingLeft: isMobile ? '1rem' : '2rem',
          paddingRight: isMobile ? '1rem' : '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: isMobile ? '0.5rem' : '1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            flexShrink: 0,
          }}
        >
          HATBLUE
        </div>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: !isMobile ? 'flex' : 'none',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '0', height: '0' }}></div>
          <button
            onClick={() => navigate('/best')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/best') ? 'bold' : 'normal',
              color: isActive('/best') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            BEST
          </button>
          <button
            onClick={() => navigate('/new')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/new') ? 'bold' : 'normal',
              color: isActive('/new') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            NEW
          </button>
          <button
            onClick={() => navigate('/outer')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/outer') ? 'bold' : 'normal',
              color: isActive('/outer') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            OUTER
          </button>
          <button
            onClick={() => navigate('/top')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/top') ? 'bold' : 'normal',
              color: isActive('/top') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            TOP
          </button>
          <button
            onClick={() => navigate('/bottom')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/bottom') ? 'bold' : 'normal',
              color: isActive('/bottom') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            BOTTOM
          </button>
          <button
            onClick={() => navigate('/dress')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/dress') ? 'bold' : 'normal',
              color: isActive('/dress') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            DRESS
          </button>
          <button
            onClick={() => navigate('/acc')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/acc') ? 'bold' : 'normal',
              color: isActive('/acc') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            ACC
          </button>
          <button
            onClick={() => navigate('/sale')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: isActive('/sale') ? 'bold' : 'normal',
              color: isActive('/sale') ? '#000' : '#666',
              textDecoration: 'none',
              padding: '0.5rem 0',
            }}
          >
            SALE
          </button>
          <div style={{ width: '0', height: '0' }}></div>
        </nav>

        {/* Utility Icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '1rem' : '1.5rem',
            marginLeft: isMobile ? '0' : '8rem',
            position: 'relative',
          }}
        >
          {/* Search Icon */}
          <button
            onClick={handleSearch}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={handleCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </button>

          {/* User Profile Icon with Dropdown */}
          <div
            data-user-menu
            style={{
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  minWidth: '160px',
                  zIndex: 1000,
                  overflow: 'hidden',
                }}
              >
                {!loading && user ? (
                  <>
                    {user.user_type === 'admin' && (
                      <button
                        onClick={() => {
                          handleAdmin();
                          setIsUserMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          color: '#333',
                          borderBottom: '1px solid #eee',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                      >
                        관리자
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleMyPage();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      주문조회
                    </button>
                    <button
                      onClick={handleDeliveryInquiry}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      배송조회
                    </button>
                    <button
                      onClick={handleCouponInquiry}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      쿠폰조회
                    </button>
                    <button
                      onClick={handleCustomerCenter}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      고객센터
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      로그아웃
                    </button>
                  </>
                ) : !loading ? (
                  <>
                    <button
                      onClick={handleSignup}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      회원가입
                    </button>
                    <button
                      onClick={handleOrderInquiry}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      주문조회
                    </button>
                    <button
                      onClick={handleDeliveryInquiry}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      배송조회
                    </button>
                    <button
                      onClick={handleCouponInquiry}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      쿠폰조회
                    </button>
                    <button
                      onClick={handleCustomerCenter}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      고객센터
                    </button>
                    <button
                      onClick={() => {
                        handleLogin();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#333',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                    >
                      로그인
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
            }}
          />
          {/* Sidebar */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: '400px',
              height: '100vh',
              backgroundColor: '#fff',
              zIndex: 9999,
              overflowY: 'auto',
              boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
              transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            {/* Top Section: JOIN, LOGIN, MY PAGE */}
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => {
                  handleSignup();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#333',
                  padding: 0,
                }}
              >
                JOIN
              </button>
              {!loading && !user && (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    padding: 0,
                  }}
                >
                  LOGIN
                </button>
              )}
              {!loading && user && (
                <button
                  onClick={() => {
                    handleMyPage();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    padding: 0,
                  }}
                >
                  MY PAGE
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.9rem', color: '#666' }}>베스트</div>
              <div style={{ flex: 1 }}></div>
              <button
                onClick={() => {
                  handleSearch();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem 0',
              }}
            >
              <button
                onClick={() => {
                  navigate('/best');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                BEST
              </button>
              <button
                onClick={() => {
                  navigate('/new');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                NEW
              </button>
              <button
                onClick={() => {
                  navigate('/outer');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                OUTER
              </button>
              <button
                onClick={() => {
                  navigate('/top');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                TOP
              </button>
              <button
                onClick={() => {
                  navigate('/bottom');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                BOTTOM
              </button>
              <button
                onClick={() => {
                  navigate('/dress');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                DRESS
              </button>
              <button
                onClick={() => {
                  navigate('/acc');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                ACC
              </button>
              <button
                onClick={() => {
                  navigate('/sale');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  padding: '1rem',
                  color: '#333',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                SALE
              </button>
            </nav>

            {/* Customer Service Section */}
            <div
              style={{
                padding: '1.5rem 1rem',
                borderTop: '1px solid #eee',
                borderBottom: '1px solid #eee',
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
                고객센터
              </h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
                1644-4358
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>
                <div>CALL 09:00-17:00</div>
                <div>KAKAO TALK 10:00-17:00</div>
                <div style={{ marginTop: '0.5rem' }}>점심시간 12:00-13:00</div>
                <div style={{ marginTop: '0.5rem' }}>토, 일요일 및 공휴일 휴무</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}
            >
              <button
                onClick={() => {
                  window.location.href = 'tel:1644-4358';
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>📞</span>
                <span>전화걸기</span>
              </button>
              <button
                onClick={() => {
                  handleCustomerCenter();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>💬</span>
                <span>카카오상담</span>
              </button>
              <button
                onClick={() => {
                  handleCustomerCenter();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>❓</span>
                <span>자주 묻는 질문</span>
              </button>
              <button
                onClick={() => {
                  navigate('/products');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>✏️</span>
                <span>상품 리뷰</span>
              </button>
            </div>

            {/* Inquiry Buttons */}
            <div
              style={{
                padding: '1rem',
                borderTop: '1px solid #eee',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
              }}
            >
              <button
                onClick={() => {
                  handleOrderInquiry();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                상품 문의
              </button>
              <button
                onClick={() => {
                  handleDeliveryInquiry();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                배송 문의
              </button>
              <button
                onClick={() => {
                  handleOrderInquiry();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                배송후 교환/반품
              </button>
              <button
                onClick={() => {
                  handleOrderInquiry();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                입금 문의
              </button>
              <button
                onClick={() => {
                  handleOrderInquiry();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                배송전 취소/변경
              </button>
              <button
                onClick={() => {
                  handleCustomerCenter();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                기타 문의
              </button>
            </div>

            {/* Notice Section */}
            <div
              style={{
                padding: '1rem',
                borderTop: '1px solid #eee',
              }}
            >
              <button
                onClick={() => {
                  navigate('/notice');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: 0,
                }}
              >
                <span>NOTICE</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
    </>
  );
};

export default Navbar;

