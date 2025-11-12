// CartSummary.jsx
// 장바구니 총 결제 금액 요약 컴포넌트
const CartSummary = ({ totalAmount, isMobile }) => {
  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  return (
    <div
      style={{
        marginTop: isMobile ? '1.5rem' : '2rem',
        padding: isMobile ? '1.25rem' : '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: isMobile ? '0.75rem' : '1rem',
      }}
    >
      <div style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 600 }}>총 구매금액</div>
      <div>
        <div style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700 }}>₩{formatPrice(totalAmount)}</div>
        <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          결제 예정금액
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

