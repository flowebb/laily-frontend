// CartTableHeader.jsx
// 장바구니 상품 목록 테이블 헤더
const CartTableHeader = ({ isMobile, onSelectAll, allSelected }) => {
  if (isMobile) {
    // 모바일: 전체선택만 표시
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 0',
          borderBottom: '1px solid #eee',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}
      >
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
        <div>전체선택</div>
      </div>
    );
  }

  // 데스크톱: 전체 헤더 표시
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 4fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr 1.2fr',
        gap: '1rem',
        padding: '1rem 0',
        borderBottom: '2px solid #333',
        fontSize: '0.9rem',
        fontWeight: 600,
        alignItems: 'center',
      }}
    >
      <input
        type="checkbox"
        checked={allSelected}
        onChange={(e) => onSelectAll(e.target.checked)}
        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
      />
      <div>상품명</div>
      <div style={{ textAlign: 'center' }}>가격</div>
      <div style={{ textAlign: 'center' }}>수량</div>
      <div style={{ textAlign: 'center' }}>합계</div>
      <div style={{ textAlign: 'center' }}>적립금</div>
      <div style={{ textAlign: 'center' }}>배송비</div>
      <div style={{ textAlign: 'center' }}>관심상품/삭제</div>
    </div>
  );
};

export default CartTableHeader;

