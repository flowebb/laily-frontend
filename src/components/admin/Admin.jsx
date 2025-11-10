import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_WIDTH } from '../../constants/layout';

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPromoBarModalOpen, setIsPromoBarModalOpen] = useState(false);
  const [promoBarMessages, setPromoBarMessages] = useState([]);
  const [newPromoBarText, setNewPromoBarText] = useState('');
  const [promoBarActive, setPromoBarActive] = useState(true);
  const [promoBarLoading, setPromoBarLoading] = useState(false);

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

  // 홍보바 설정 가져오기
  const fetchPromoBar = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/promo-bar');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          const {
            isActive: activeFlag = true,
            messages: storedMessages = [],
            currentValue,
            value
          } = data.settings;

          let sanitizedMessages =
            storedMessages && storedMessages.length > 0
              ? storedMessages.map((msg) => ({
                  _id: msg._id,
                  text: msg.text || '',
                  isActive: Boolean(msg.isActive)
                }))
              : [];

          if (sanitizedMessages.length === 0) {
            sanitizedMessages = [
              {
                text: currentValue || value ,
                isActive: true
              }
            ];
          }

          if (!sanitizedMessages.some((msg) => msg.isActive)) {
            sanitizedMessages[0].isActive = true;
          }

          setPromoBarMessages(sanitizedMessages);
          setPromoBarActive(activeFlag);
          setNewPromoBarText('');
        }
      }
    } catch (error) {
      console.error('홍보바 설정 가져오기 오류:', error);
    }
  };

  // 홍보바 모달 열기
  const handleOpenPromoBarModal = async () => {
    await fetchPromoBar();
    setIsPromoBarModalOpen(true);
  };

  // 홍보바 설정 저장
  const handleSavePromoBar = async () => {
    try {
      setPromoBarLoading(true);
      const token = localStorage.getItem('token');
      const trimmedMessages = promoBarMessages
        .map((msg) => ({
          ...msg,
          text: typeof msg.text === 'string' ? msg.text.trim() : ''
        }))
        .filter((msg) => msg.text.length > 0);

      if (trimmedMessages.length === 0) {
        alert('홍보바 문구를 최소 1개 이상 입력해 주세요.');
        setPromoBarLoading(false);
        return;
      }

      if (!trimmedMessages.some((msg) => msg.isActive)) {
        trimmedMessages[0].isActive = true;
      }

      const activeMessage =
        trimmedMessages.find((msg) => msg.isActive) || trimmedMessages[0];

      const requestBody = {
        value: activeMessage.text,
        isActive: promoBarActive,
        messages: trimmedMessages.map(({ text, isActive: messageActive }) => ({
          text,
          isActive: messageActive
        }))
      };

      console.log('저장 요청 데이터:', requestBody);

      const response = await fetch('http://localhost:5000/api/settings/promo-bar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('서버 응답:', data);

      if (response.ok && data.success) {
        if (data.settings) {
          const storedMessages = (data.settings.messages || []).map((msg) => ({
            _id: msg._id,
            text: msg.text || '',
            isActive: Boolean(msg.isActive)
          }));
          if (storedMessages.length > 0) {
            setPromoBarMessages(storedMessages);
          }
          setPromoBarActive(data.settings.isActive);
        }
        alert('홍보바 설정이 저장되었습니다.');
        setIsPromoBarModalOpen(false);
      } else {
        const errorMsg = data.error || data.message || '홍보바 설정 저장에 실패했습니다.';
        console.error('저장 실패:', errorMsg, data);
        alert(`저장 실패: ${errorMsg}`);
      }
    } catch (error) {
      console.error('홍보바 설정 저장 오류:', error);
      alert('홍보바 설정 저장 중 오류가 발생했습니다.');
    } finally {
      setPromoBarLoading(false);
    }
  };

  const handleAddPromoBarMessage = () => {
    const trimmed = newPromoBarText.trim();
    if (trimmed.length === 0) {
      alert('추가할 홍보바 문구를 입력해 주세요.');
      return;
    }

    setPromoBarMessages((prev) => {
      const hasActive = prev.some((msg) => msg.isActive);
      return [
        ...prev,
        {
          text: trimmed,
          isActive: prev.length === 0 || !hasActive
        }
      ];
    });
    setNewPromoBarText('');
  };

  const handleUpdatePromoBarMessage = (index, text) => {
    setPromoBarMessages((prev) =>
      prev.map((msg, idx) => (idx === index ? { ...msg, text } : msg))
    );
  };

  const handleSetPromoBarActiveMessage = (index) => {
    setPromoBarMessages((prev) =>
      prev.map((msg, idx) => ({
        ...msg,
        isActive: idx === index ? !msg.isActive : msg.isActive
      }))
    );
  };

  const handleRemovePromoBarMessage = (index) => {
    setPromoBarMessages((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      if (updated.length > 0 && !updated.some((msg) => msg.isActive)) {
        updated[0].isActive = true;
      }
      return updated;
    });
  };

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

          {/* 홍보바 설정 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
            }}
            onClick={handleOpenPromoBarModal}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#8B7355',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              📢
            </div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
              프로모션 바 설정
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              상단 홍보바 문구 및 표시 여부 관리
            </p>
          </div>
        </div>
      </div>

      {/* 홍보바 설정 모달 */}
      {isPromoBarModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: isMobile ? '1rem' : '2rem',
          }}
          onClick={() => setIsPromoBarModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>
              프로모션 문구 설정
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                등록된 프로모션 문구를 관리하세요. 활성화된 문구들이 자동으로 순환하며 고객에게 노출됩니다.
              </p>
              {promoBarMessages.map((message, index) => (
                <div
                  key={message._id || `promo-message-${index}`}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>
                      문구 {index + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <label
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#555', cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(message.isActive)}
                          onChange={() => handleSetPromoBarActiveMessage(index)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        활성화
                      </label>
                      <button
                        onClick={() => handleRemovePromoBarMessage(index)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#666',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={message.text}
                    onChange={(e) => handleUpdatePromoBarMessage(index, e.target.value)}
                    placeholder="프로모션 바에 표시할 문구를 입력하세요"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                    }}
                  />
                </div>
              ))}

              {promoBarMessages.length === 0 && (
                <div
                  style={{
                    padding: '1rem',
                    border: '1px dashed #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#888',
                    textAlign: 'center',
                  }}
                >
                  등록된 문구가 없습니다. 아래 입력란에 문구를 입력한 뒤 <strong>문구 추가</strong> 버튼을 눌러 등록하세요.
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}
            >
              <input
                type="text"
                value={newPromoBarText}
                onChange={(e) => setNewPromoBarText(e.target.value)}
                placeholder="새로운 프로모션 문구를 입력하세요"
                style={{
                  flex: 1,
                  minWidth: isMobile ? '100%' : 'auto',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAddPromoBarMessage}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#475569',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                }}
              >
                문구 추가
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#666',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={promoBarActive}
                  onChange={(e) => setPromoBarActive(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                <span>프로모션 바에 표시 (활성화)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsPromoBarModalOpen(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                취소
              </button>
              <button
                onClick={handleSavePromoBar}
                disabled={promoBarLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#8B7355',
                  color: 'white',
                  cursor: promoBarLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  opacity: promoBarLoading ? 0.6 : 1,
                }}
              >
                {promoBarLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

