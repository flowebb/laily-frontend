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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          paddingTop: '2rem',
          paddingBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
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
          <div style={{ width: '0', height: '0' }}></div>
        </nav>

        {/* Utility Icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginLeft: '8rem',
          }}
        >
          <button
            onClick={handleSearch}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.5rem',
            }}
          >
            SEARCH
          </button>
          <button
            onClick={handleCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.5rem',
            }}
          >
            CART
          </button>
          {!loading && user && (
            <button
              onClick={handleMyPage}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '0.5rem',
              }}
            >
              MY PAGE
            </button>
          )}
          {!loading && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#333' }}>
                {user.name}님 환영합니다
              </span>
              {user.user_type === 'admin' && (
                <button
                  onClick={handleAdmin}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  ADMIN
                </button>
              )}
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#000',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                로그아웃
              </button>
            </div>
          ) : !loading ? (
            <button
              onClick={handleLogin}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              LOGIN
            </button>
          ) : null}
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '0.5rem',
              }}
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem 0',
            borderTop: '1px solid #eee',
            marginTop: '1rem',
          }}
        >
          <div style={{ width: '0', height: '0' }}></div>
          <button
            onClick={() => {
              navigate('/outer');
              setIsMobileMenuOpen(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left',
              padding: '0.5rem 0',
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
              fontSize: '0.9rem',
              textAlign: 'left',
              padding: '0.5rem 0',
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
              fontSize: '0.9rem',
              textAlign: 'left',
              padding: '0.5rem 0',
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
              fontSize: '0.9rem',
              textAlign: 'left',
              padding: '0.5rem 0',
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
              fontSize: '0.9rem',
              textAlign: 'left',
              padding: '0.5rem 0',
            }}
          >
            ACC
          </button>
          <div style={{ width: '0', height: '0' }}></div>
        </nav>
      )}
    </header>
    </>
  );
};

export default Navbar;

