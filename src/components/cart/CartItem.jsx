// CartItem.jsx
// 장바구니 개별 상품 아이템 컴포넌트
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OptionChangeModal from './OptionChangeModal';

const CartItem = ({
  item,
  isMobile,
  isSelected,
  onSelect,
  onQuantityChange,
  onRemove,
  onOptionChange,
  isUpdating,
}) => {
  const navigate = useNavigate();
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const product = item.productId;
  const priceInfo = getPriceInfo(item);
  const points = Math.floor(item.totalPrice * 0.01);

  const handleImageClick = () => {
    if (product?._id) {
      navigate(`/products/${product._id}`);
    }
  };

  if (isMobile) {
    // 모바일 레이아웃: 체크박스 + 이미지 + 상품 정보 (세로 배치)
    return (
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '1rem 0',
          borderBottom: '1px solid #eee',
          alignItems: 'flex-start',
        }}
      >
        {/* 체크박스 */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item._id, e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '0.25rem', flexShrink: 0 }}
        />

        {/* 상품 이미지 */}
        <img
          src={product?.image || 'https://via.placeholder.com/100x100?text=No+Image'}
          alt={product?.name || '상품'}
          onClick={handleImageClick}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            border: '1px solid #eee',
            flexShrink: 0,
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />

        {/* 상품 정보 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
          {/* 상품명 */}
          <div style={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4 }}>
            {product?.name || '상품명 없음'}
          </div>

          {/* 가격 */}
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#000' }}>
            {priceInfo.hasDiscount ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem', marginRight: '0.5rem' }}>
                  ₩{formatPrice(priceInfo.original)}
                </span>
                ₩{formatPrice(priceInfo.discounted)}
              </>
            ) : (
              `₩${formatPrice(item.unitPrice)}`
            )}
          </div>

          {/* 옵션 정보 */}
          <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.4 }}>
            [옵션: {item.color || ''}{item.color && item.size ? '/' : ''}{item.size || (item.color ? '' : 'FREE')}]
          </div>

          {/* 옵션변경 링크 */}
          <button
            onClick={() => setIsOptionModalOpen(true)}
            style={{
              padding: 0,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.8rem',
              color: '#666',
              cursor: 'pointer',
              textDecoration: 'underline',
              width: 'fit-content',
              textAlign: 'left',
            }}
          >
            옵션변경
          </button>

          {/* 수량 선택기 (왼쪽 정렬) */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
              <button
                onClick={() => onQuantityChange(item._id, item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                style={{
                  width: '28px',
                  height: '28px',
                  border: 'none',
                  backgroundColor: '#fff',
                  cursor: isUpdating || item.quantity <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onQuantityChange(item._id, parseInt(e.target.value) || 1)}
                disabled={isUpdating}
                style={{
                  width: '40px',
                  textAlign: 'center',
                  border: 'none',
                  borderLeft: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  padding: '0.25rem 0',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                disabled={isUpdating}
                style={{
                  width: '28px',
                  height: '28px',
                  border: 'none',
                  backgroundColor: '#fff',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 옵션 변경 모달 */}
        <OptionChangeModal
          isOpen={isOptionModalOpen}
          onClose={() => setIsOptionModalOpen(false)}
          item={item}
          onConfirm={onOptionChange}
          isMobile={isMobile}
        />
      </div>
    );
  }

  // 데스크톱 레이아웃
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 4fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr 1.2fr',
        gap: '1rem',
        padding: '1.5rem 0',
        borderBottom: '1px solid #eee',
        alignItems: 'center',
        fontSize: '0.9rem',
      }}
    >
      {/* 체크박스 */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(item._id, e.target.checked)}
        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
      />

      {/* 상품 정보 */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <img
          src={product?.image || 'https://via.placeholder.com/100x100?text=No+Image'}
          alt={product?.name || '상품'}
          onClick={handleImageClick}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            border: '1px solid #eee',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.4 }}>
            {product?.name || '상품명 없음'}
          </div>
          {/* 뱃지 */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {product?.status?.includes('NEW') && (
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  backgroundColor: '#FF6B35',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                신상 NEW COLOR
              </span>
            )}
            {product?.status?.includes('SALE') && (
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  backgroundColor: '#999',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                한정수량
              </span>
            )}
          </div>
          {/* 옵션 정보 */}
          <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.4 }}>
            {item.color && `색상: ${item.color}`}
            {item.color && item.size && ', '}
            {item.size && `사이즈: ${item.size}`}
            {!item.color && !item.size && '기본 옵션'}
            {' '}
            {item.quantity}개
          </div>
          <button
            onClick={() => setIsOptionModalOpen(true)}
            style={{
              padding: '0.3rem 0.8rem',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            옵션변경
          </button>
        </div>
      </div>

      {/* 가격 */}
      <div style={{ textAlign: 'center' }}>
        {priceInfo.hasDiscount ? (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>
              ₩{formatPrice(priceInfo.original)}
            </div>
            <div style={{ fontWeight: 600, color: '#000', marginTop: '0.25rem' }}>
              ₩{formatPrice(priceInfo.discounted)}
            </div>
          </div>
        ) : (
          <div style={{ fontWeight: 600 }}>₩{formatPrice(item.unitPrice)}</div>
        )}
      </div>

      {/* 수량 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => onQuantityChange(item._id, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          style={{
            width: '28px',
            height: '28px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: isUpdating || item.quantity <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onQuantityChange(item._id, parseInt(e.target.value) || 1)}
          disabled={isUpdating}
          style={{
            width: '50px',
            textAlign: 'center',
            border: '1px solid #ddd',
            padding: '0.25rem',
            fontSize: '0.9rem',
          }}
        />
        <button
          onClick={() => onQuantityChange(item._id, item.quantity + 1)}
          disabled={isUpdating}
          style={{
            width: '28px',
            height: '28px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {/* 합계 */}
      <div style={{ fontWeight: 600, textAlign: 'center' }}>₩{formatPrice(item.totalPrice)}</div>

      {/* 적립금 */}
      <div style={{ color: '#666', textAlign: 'center' }}>{formatPrice(points)}</div>

      {/* 배송비 */}
      <div style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>[기본배송] 조건</div>

      {/* 관심상품/삭제 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
        <button
          style={{
            padding: '0.4rem 0.8rem',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            width: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          관심상품 등록
        </button>
        <button
          onClick={() => onRemove(item._id)}
          style={{
            padding: '0.4rem 0.8rem',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            color: '#666',
            width: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          삭제하기
        </button>
      </div>

      {/* 옵션 변경 모달 */}
      <OptionChangeModal
        isOpen={isOptionModalOpen}
        onClose={() => setIsOptionModalOpen(false)}
        item={item}
        onConfirm={onOptionChange}
        isMobile={isMobile}
      />
    </div>
  );
};

// 헬퍼 함수들
const formatPrice = (price) => {
  return price.toLocaleString();
};

const getPriceInfo = (item) => {
  const product = item.productId;
  if (!product || !product.price) {
    return {
      original: item.unitPrice,
      discounted: item.unitPrice,
      hasDiscount: false,
    };
  }

  const original = product.price.originalPrice || item.unitPrice;
  const discounted = product.price.discountedPrice || original;
  return {
    original,
    discounted,
    hasDiscount: discounted < original,
  };
};

export default CartItem;

