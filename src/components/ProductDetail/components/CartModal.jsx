import { useNavigate } from 'react-router-dom';

const CartModal = ({ isOpen, onClose, product, isDuplicate = false }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinueShopping = () => {
    onClose();
  };

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
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
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>장바구니 담기</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* 내용 */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '2rem',
            alignItems: 'flex-start',
          }}
        >
          {/* 상품 이미지 */}
          <img
            src={product?.image || 'https://via.placeholder.com/100x100?text=No+Image'}
            alt={product?.name || '상품'}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #eee',
              borderRadius: '4px',
              flexShrink: 0,
            }}
          />

          {/* 메시지 */}
          <div style={{ flex: 1, paddingTop: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#333' }}>
              {isDuplicate 
                ? '장바구니에 이미 중복상품이 있어 수량이 변경되었습니다.'
                : '1개의 상품이 장바구니에 담겼습니다.'
              }
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleContinueShopping}
            style={{
              flex: 1,
              padding: '0.9rem 0',
              borderRadius: '4px',
              border: '1px solid #1f1f1f',
              backgroundColor: '#fff',
              color: '#1f1f1f',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            쇼핑 계속하기
          </button>
          <button
            type="button"
            onClick={handleGoToCart}
            style={{
              flex: 1,
              padding: '0.9rem 0',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#1f1f1f',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            장바구니 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

