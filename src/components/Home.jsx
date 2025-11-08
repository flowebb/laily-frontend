import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

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
      </div>
    </div>
  );
};

export default Home;

