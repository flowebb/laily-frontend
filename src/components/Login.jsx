import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // 토큰 확인 및 리다이렉트
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCheckingToken(false);
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

        if (response.ok) {
          // 유효한 토큰이 있으면 메인 페이지로 리다이렉트
          navigate('/');
        } else {
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('토큰 검증 실패:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [navigate]);

  const handleKakaoLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      alert(data.error || '카카오 로그인 기능은 추후 구현 예정입니다.');
    } catch (err) {
      alert('카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleNaverLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/naver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      alert(data.error || '네이버 로그인 기능은 추후 구현 예정입니다.');
    } catch (err) {
      alert('네이버 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 필수 필드 검증
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!formData.password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '로그인에 실패했습니다.');
      }

      // 토큰과 유저 정보 저장
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // 성공 시 처리
      alert('로그인에 성공했습니다!');
      navigate('/');
    } catch (err) {
      // 네트워크 에러 또는 서버 에러 처리
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        setError('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        setError(err.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 토큰 확인 중이면 로딩 표시
  if (checkingToken) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <div style={{ fontSize: '1rem', color: '#666' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '5rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
            Laily 로그인
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
            회원가입 후 다양한 혜택을 받아보세요
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.9rem',
                textAlign: 'left',
              }}
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="이메일을 입력해주세요"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.9rem',
                textAlign: 'left',
              }}
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력해주세요"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginBottom: '1rem',
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Social Login Buttons */}
        <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1rem',
            gap: '0.5rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
            <span style={{ fontSize: '0.85rem', color: '#999', padding: '0 0.5rem' }}>또는</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
          </div>

          <button
            onClick={handleKakaoLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#FEE500',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#FEE500',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              TALK
            </div>
            <span>카카오로 로그인</span>
          </button>

          <button
            onClick={handleNaverLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#03C75A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#03C75A',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              N
            </div>
            <span>네이버로 로그인</span>
          </button>
        </div>

        {/* Signup Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
            아직 회원이 아니신가요?{' '}
            <Link 
              to="/signup" 
              style={{ 
                color: '#000', 
                fontWeight: '500', 
                textDecoration: 'none' 
              }}
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

