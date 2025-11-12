// CartActions.jsx
// 장바구니 하단 액션 버튼 컴포넌트
import { useNavigate } from 'react-router-dom';

const CartActions = ({ selectedCount, onRemoveSelected, onClearCart, isMobile }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* 하단 액션 버튼 */}
      <div
        style={{
          marginTop: isMobile ? '1.5rem' : '2rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '0.75rem' : '1rem',
        }}
      >
        {/* 왼쪽 버튼들 */}
        <div style={{ display: 'flex', gap: isMobile ? '0.35rem' : '0.5rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          {!isMobile && (
            <button
              style={{
                padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                borderRadius: '4px',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                cursor: 'pointer',
              }}
            >
              견적서 출력
            </button>
          )}
          <button
            onClick={onRemoveSelected}
            style={{
              padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              cursor: 'pointer',
              flex: isMobile ? 1 : 'auto',
            }}
          >
            선택삭제
          </button>
          <button
            onClick={onClearCart}
            style={{
              padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              cursor: 'pointer',
              flex: isMobile ? 1 : 'auto',
            }}
          >
            {isMobile ? '비우기' : '장바구니 비우기'}
          </button>
        </div>

        {/* 오른쪽 버튼들 */}
        <div style={{ display: 'flex', gap: isMobile ? '0.35rem' : '0.5rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: isMobile ? '0.6rem 1rem' : '0.75rem 2rem',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              cursor: 'pointer',
              flex: isMobile ? 1 : 'auto',
            }}
          >
            쇼핑하기
          </button>
          <button
            disabled={selectedCount === 0}
            style={{
              padding: isMobile ? '0.6rem 1rem' : '0.75rem 2rem',
              border: 'none',
              backgroundColor: selectedCount > 0 ? '#000' : '#ccc',
              color: '#fff',
              borderRadius: '4px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              flex: isMobile ? 1 : 'auto',
            }}
          >
            주문하기
          </button>
        </div>
      </div>

      {/* 네이버페이 */}
      <div
        style={{
          marginTop: isMobile ? '0.75rem' : '1rem',
          padding: isMobile ? '0.75rem' : '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '0.75rem' : '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>NAVER</span>
          <span style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#666' }}>네이버ID로 간편구매 네이버페이</span>
        </div>
        <button
          style={{
            padding: isMobile ? '0.5rem 1rem' : '0.5rem 1.5rem',
            border: '1px solid #03C75A',
            backgroundColor: '#03C75A',
            color: '#fff',
            borderRadius: '4px',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            cursor: 'pointer',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          N pay 구매
        </button>
      </div>

      <div style={{ marginTop: isMobile ? '0.4rem' : '0.5rem', fontSize: isMobile ? '0.7rem' : '0.75rem', color: '#999', textAlign: 'center' }}>
        이벤트 결제 시 최대 3% 적...
      </div>
    </>
  );
};

export default CartActions;

