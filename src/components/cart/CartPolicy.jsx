// CartPolicy.jsx
// 장바구니 정책 및 추가 정보 컴포넌트
const CartPolicy = ({ isMobile }) => {
  return (
    <div
      style={{
        marginTop: isMobile ? '1.5rem' : '2rem',
        padding: isMobile ? '1rem' : '1.5rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        fontSize: isMobile ? '0.75rem' : '0.85rem',
        lineHeight: isMobile ? 1.6 : 1.8,
        color: '#666',
      }}
    >
      <div style={{ marginBottom: isMobile ? '0.4rem' : '0.5rem', marginLeft: isMobile ? '0' : '0.8rem'}}>실결제 금액 5만원 이상 구매시 무료배송이 적용됩니다.</div>
      <div style={{ marginBottom: isMobile ? '0.4rem' : '0.5rem', marginLeft: isMobile ? '0' : '0.8rem'}}>레일리리 제품은 우체국택배로 배송됩니다.</div>
      <div style={{ marginBottom: isMobile ? '0.4rem' : '0.5rem', marginLeft: isMobile ? '0' : '0.8rem'}}>장바구니에 담은 상품은 14일동안 보관됩니다.</div>
      <div style={{ marginBottom: isMobile ? '0.4rem' : '0.5rem', marginLeft: isMobile ? '0' : '0.8rem'}}>
       현대카드 M포인트 결제 금액 최대 10% 사용 가능 (한도 5,000 포인트)
      </div>
     
      <div style={{ marginBottom: isMobile ? '0.4rem' : '0.5rem', marginLeft: isMobile ? '0' : '0.8rem'}}>
        예산이 소진되면 이벤트가 예정보다 빨리 마감될 수 있으니 결제 전 할인/적립 적용 여부를 꼭 확인바랍니다.
      </div>
      <div style={{ marginTop: isMobile ? '0.75rem' : '1rem', marginLeft: isMobile ? '0' : '0.8rem'}}>
        <a href="#" style={{ color: '#333', textDecoration: 'underline' }}>
          * 이 달의 무이자할부 보기 +
        </a>
      </div>
    </div>
  );
};

export default CartPolicy;

