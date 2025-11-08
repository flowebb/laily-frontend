import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 토큰 확인 및 유저 정보 가져오기
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
          // 토큰이 유효하지 않으면 제거
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
  }, []);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃되었습니다.');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          Laily
        </h1>
        {!loading && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#333' }}>
              {user.name}님 반갑습니다.
            </span>
            <button
              onClick={handleLogout}
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
              로그아웃
            </button>
          </div>
        ) : !loading ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              로그인
            </button>
            <button
              onClick={handleSignup}
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
              회원가입
            </button>
          </div>
        ) : null}
      </header>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          flex: 1,
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
            Laily
          </h1>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
            쇼핑몰에 오신 것을 환영합니다
          </p>
          {!user && (
            <>
              <button
                onClick={handleLogin}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
              >
                로그인
              </button>
              <button
                onClick={handleSignup}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  color: '#000',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

