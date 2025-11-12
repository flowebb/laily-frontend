import { getPriceInfo } from '../utils/getPriceInfo';

const ProductHeader = ({ product }) => {
  const priceInfo = getPriceInfo(product);
  const statuses = product?.status || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 뱃지 영역: 상품 상태 뱃지 */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {statuses.map((status) => (
          <span
            key={status}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: '#000',
              color: '#fff',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
            }}
          >
            {status}
          </span>
        ))}
      </div>
      
      {/* 상품명 */}
      <h1 style={{ fontSize: '2.0rem', lineHeight: 1.25, margin: 0, color: '#222', fontWeight: 600 }}>
        {product.name}
      </h1>
      
      {/* 요약 설명 */}
      <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.7 }}>
        {product.description || '상품에 대한 설명이 준비 중입니다.'}
      </p>

      {/* 가격 정보 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
        {/* 정가 (할인이 있는 경우에만 표시) */}
        {priceInfo.hasDiscount && (
          <div style={{ fontSize: '1.2rem', color: '#a8a8a8', textDecoration: 'line-through' }}>
            ₩{priceInfo.original.toLocaleString()}<span style={{ marginLeft: '0.35rem' }}>정가</span>
          </div>
        )}
        {/* 최종 가격 및 할인 정보 */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* 최종 판매 가격 */}
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#222' }}>
            ₩{(priceInfo.finalPrice || 0).toLocaleString()}
          </span>
          {/* 할인율 및 할인 금액 (할인이 있는 경우에만 표시) */}
          {priceInfo.hasDiscount && (
            <span style={{ fontSize: '1.2rem', color: '#d25c53', fontWeight: 600 }}>
              {priceInfo.percentage}% ({priceInfo.discountAmount.toLocaleString()}원 할인)
            </span>
          )}
        </div>
        {/* 할인 기간 안내 (할인이 있는 경우에만 표시) */}
        {priceInfo.hasDiscount && (
          <div style={{ fontSize: '0.9rem', color: '#c57e61', letterSpacing: '0.02em' }}>
            할인기간 안내: 구매 시점 기준 할인 혜택이 적용됩니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;

