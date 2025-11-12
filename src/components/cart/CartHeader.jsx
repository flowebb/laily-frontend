// CartHeader.jsx
// 장바구니 페이지 헤더 (제목 및 프로모션 바)
const CartHeader = ({ isMobile }) => {
  return (
    <>
      {/* 페이지 제목 */}
      <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.3rem', marginTop: '0.5rem', marginBottom: '2rem', fontWeight: 550, textAlign: 'center' }}>
        장바구니
      </h1>

      {/* 프로모션 바 */}
      <div
        style={{
          backgroundColor: '#666666',
          color: '#fff',
          padding: isMobile ? '0.75rem' : '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
          fontSize: isMobile ? '0.75rem' : '0.9rem',
          textAlign: 'center',
          lineHeight: isMobile ? 1.5 : 1.4,
        }}
      >
        N pay 버튼으로 카드 결제 시 최대 7천원 즉시할인 11/5(수) - 11/30(일) 예산 소진 시 조기 종료
      </div>
    </>
  );
};

export default CartHeader;

