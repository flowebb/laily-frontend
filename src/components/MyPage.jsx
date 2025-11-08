import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { MAX_WIDTH } from '../constants/layout';

const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
        navigate('/login');
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
          navigate('/login');
        }
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

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
          padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        }}
      >
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '2rem' }}>
          MY PAGE
        </h1>
        {user && (
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '2rem',
              borderRadius: '8px',
            }}
          >
            <h2 style={{ marginBottom: '1rem' }}>회원 정보</h2>
            <p style={{ marginBottom: '0.5rem' }}>이름: {user.name}</p>
            <p style={{ marginBottom: '0.5rem' }}>이메일: {user.email}</p>
            <p style={{ marginBottom: '0.5rem' }}>주소: {user.address || '미입력'}</p>
            <p style={{ marginBottom: '0.5rem' }}>회원 유형: {user.user_type === 'admin' ? '관리자' : '일반 회원'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;

