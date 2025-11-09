import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_WIDTH } from '../../constants/layout';

const Admin = () => {
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
          if (data.user.user_type !== 'admin') {
            alert('관리자 권한이 필요합니다.');
            navigate('/');
            return;
          }
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            Laliy
          </h1>
          <span
            style={{
              backgroundColor: '#ff6b6b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            ADMIN
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          쇼핑몰로 돌아가기
        </button>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 1rem' : '3rem 2rem',
      
        }}
      >
        {/* Title Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', margin: 0, marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
            관리자 대시보드
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
            HATBLUE 쇼핑몰 관리 시스템에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total Orders */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e8d5ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                🛒
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>총 주문</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>1,234</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#22c55e' }}>+12% from last month</p>
          </div>

          {/* Total Products */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ffe4b5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                📦
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>총 상품</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>156</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#22c55e' }}>+3% from last month</p>
          </div>

          {/* Total Customers */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e8d5ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                👥
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>총 고객</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>2,345</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#22c55e' }}>+8% from last month</p>
          </div>

          {/* Total Sales */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#d4edda',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                📈
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>총 매출</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>$45,678</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#22c55e' }}>+15% from last month</p>
          </div>
        </div>

        {/* Quick Actions and Recent Orders */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Quick Actions */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h2 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.2rem', color: '#333', fontWeight: 'bold' }}>
              빠른 작업
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/admin/products/new')}
                style={{
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                새 상품 등록
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                }}
              >
                주문 관리
              </button>
              <button
                onClick={() => navigate('/admin/analytics')}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                }}
              >
                매출 분석
              </button>
              <button
                onClick={() => navigate('/admin/customers')}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                }}
              >
                고객 관리
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333', fontWeight: 'bold' }}>
                최근 주문
              </h2>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: 0,
                }}
              >
                전체보기
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'ORD-001234', customer: '김민수', date: '2024-12-30', status: '처리중', amount: '$219' },
                { id: 'ORD-001233', customer: '이영희', date: '2024-12-29', status: '배송중', amount: '$156' },
                { id: 'ORD-001232', customer: '박정우', date: '2024-12-28', status: '완료', amount: '$432' },
                { id: 'ORD-001231', customer: '최나래', date: '2024-12-28', status: '완료', amount: '$98' },
              ].map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>
                      {order.id}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                      {order.customer} · {order.date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>
                      {order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Modules */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '1.5rem',
          }}
        >
          {/* Product Management */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/admin/products')}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ffe4b5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              📦
            </div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
              상품 관리
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              상품 등록, 수정 및 재고 관리
            </p>
          </div>

          {/* Order Management */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/admin/orders')}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#e8d5ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              🛒
            </div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
              주문 관리
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              주문 조회, 상태 변경 및 송장 관리
            </p>
          </div>

          {/* Customer Management */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/admin/customers')}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#e8d5ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              👥
            </div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
              고객 관리
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              고객 문의 응대 및 멤버십 관리
            </p>
          </div>

          {/* Marketing */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/admin/marketing')}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ffd6e8',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              ❤️
            </div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
              마케팅
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              쿠폰 발급 및 캠페인 설정
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

