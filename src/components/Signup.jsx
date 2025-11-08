import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
    user_type: 'customer',
    address: ''
  });
  const [agreements, setAgreements] = useState({
    age14: false,
    agreeAll: false,
    terms: false,
    privacy: false,
    marketing: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = () => {
    alert('카카오 로그인 기능은 추후 구현 예정입니다.');
  };

  const handleNaverLogin = () => {
    alert('네이버 로그인 기능은 추후 구현 예정입니다.');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'agreeAll') {
        setAgreements({
          age14: checked,
          agreeAll: checked,
          terms: checked,
          privacy: checked,
          marketing: checked
        });
      } else {
        setAgreements(prev => {
          const updated = {
            ...prev,
            [name]: checked
          };
          // 전체동의는 필수 항목들이 모두 체크되고 마케팅도 체크되어야 함
          updated.agreeAll = updated.age14 && updated.terms && updated.privacy && updated.marketing;
          return updated;
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleViewContent = (type) => {
    alert(`${type} 내용은 추후 구현 예정입니다.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 필수 필드 검증
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!formData.password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    // 필수 동의 체크
    if (!agreements.age14) {
      setError('만 14세 이상 동의는 필수입니다.');
      return;
    }
    if (!agreements.terms) {
      setError('이용약관 동의는 필수입니다.');
      return;
    }
    if (!agreements.privacy) {
      setError('개인정보 수집 및 이용 동의는 필수입니다.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 8 || formData.password.length > 16) {
      setError('비밀번호는 8자 이상 16자 이하여야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 서버에 전송할 데이터 준비
      const userData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
        user_type: formData.user_type || 'customer',
        address: formData.address.trim() || undefined
      };

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공 후 자동 로그인
      try {
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.token) {
          // 토큰과 유저 정보 저장
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          alert('회원가입이 완료되었습니다! 자동으로 로그인되었습니다.');
          navigate('/');
        } else {
          // 로그인 실패 시 회원가입은 성공했으므로 로그인 페이지로 이동
          alert('회원가입이 완료되었습니다! 로그인해주세요.');
          navigate('/login');
        }
      } catch (loginError) {
        // 자동 로그인 실패 시 회원가입은 성공했으므로 로그인 페이지로 이동
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/login');
      }
    } catch (err) {
      // 네트워크 에러 또는 서버 에러 처리
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        setError('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        setError(err.message || '회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: 'white',
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
        }}
      >
        {/* Header Section */}
        {!showForm ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderLeft: '2px solid #333',
                      borderBottom: '2px solid #333',
                      transform: 'rotate(-45deg) translate(1px, -1px)',
                    }}
                  />
                </div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
                  간편가입
                </h1>
              </div>
              <p style={{ margin: '0.5rem 0', fontSize: '1rem', color: '#666' }}>
                SNS로 간편하게 가입하세요!
              </p>
              <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                아이디, 비밀번호, 이름, 회원가입 절차가 귀찮으셨죠?<br />
                카카오, 네이버로 1초만에 회원가입 하세요
              </p>
            </div>

            {/* Benefits Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {/* Benefit 1 */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 0.5rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  📱
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', marginBottom: '0.25rem' }}>
                  모바일 앱다운시
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  5%쿠폰 발급
                </div>
              </div>

              {/* Benefit 2 */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 0.5rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  %
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', marginBottom: '0.25rem' }}>
                  신규가입시
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  2000원 할인쿠폰지급
                </div>
              </div>

              {/* Benefit 3 */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 0.5rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  ⭐
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', marginBottom: '0.25rem' }}>
                  리뷰작성시
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  최대 10000원 적립
                </div>
              </div>

              {/* Benefit 4 */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 0.5rem',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  🎂
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', marginBottom: '0.25rem' }}>
                  생일축하
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  5%쿠폰지급 (등급별 상이)
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
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
              <span style={{ flex: 1, textAlign: 'center' }}>카카오1초 로그인ㆍ회원가입</span>
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
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
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
              <span style={{ flex: 1, textAlign: 'center' }}>네이버 1초 로그인 회원가입</span>
            </button>

            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Laily사이트에 직접 회원가입
            </button>
          </>
        ) : (
          <SignupForm
            formData={formData}
            agreements={agreements}
            error={error}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleViewContent={handleViewContent}
          />
        )}
      </div>
    </div>
  );
};

export default Signup;

