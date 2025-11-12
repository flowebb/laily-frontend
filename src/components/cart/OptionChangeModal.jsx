// OptionChangeModal.jsx
// 장바구니 아이템의 옵션을 변경하는 모달 컴포넌트
import { useState, useEffect } from 'react';

const OptionChangeModal = ({ 
  isOpen, 
  onClose, 
  item, 
  onConfirm,
  isMobile 
}) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(false);

  const product = item?.productId;
  const availableColors = product?.availableColors || [];
  const availableSizes = product?.availableSizes || [];
  const hasColorOptions = availableColors.length > 0;
  const hasSizeOptions = availableSizes.length > 0;

  // 모달이 열릴 때 현재 옵션으로 초기화
  useEffect(() => {
    if (isOpen && item) {
      setSelectedColor(item.color || '');
      setSelectedSize(item.size || '');
    }
  }, [isOpen, item]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedColor('');
      setSelectedSize('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    // 옵션이 변경되지 않았으면 닫기만
    if (selectedColor === (item?.color || '') && selectedSize === (item?.size || '')) {
      onClose();
      return;
    }

    // 옵션 선택 검증
    if (hasColorOptions && !selectedColor) {
      alert('색상을 선택해주세요.');
      return;
    }
    if (hasSizeOptions && !selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        color: hasColorOptions ? selectedColor : '',
        size: hasSizeOptions ? selectedSize : '',
      });
      onClose();
    } catch (error) {
      console.error('옵션 변경 실패:', error);
      alert('옵션 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
        zIndex: 10000,
        padding: isMobile ? '1rem' : '2rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: isMobile ? '1.5rem' : '2rem',
          maxWidth: isMobile ? '100%' : '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>
            옵션 변경
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            {product?.name || '상품명 없음'}
          </p>
        </div>

        {/* 색상 선택 */}
        {hasColorOptions && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
              색상
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: selectedColor === color ? '2px solid #000' : '1px solid #ddd',
                    backgroundColor: selectedColor === color ? '#f5f5f5' : '#fff',
                    color: selectedColor === color ? '#000' : '#666',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: selectedColor === color ? 600 : 400,
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 사이즈 선택 */}
        {hasSizeOptions && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
              사이즈
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: selectedSize === size ? '2px solid #000' : '1px solid #ddd',
                    backgroundColor: selectedSize === size ? '#f5f5f5' : '#fff',
                    color: selectedSize === size ? '#000' : '#666',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: selectedSize === size ? 600 : 400,
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 현재 선택된 옵션 표시 */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>선택된 옵션:</div>
          <div style={{ fontSize: '0.95rem', color: '#333', fontWeight: 500 }}>
            {hasColorOptions ? selectedColor || '미선택' : '기본'}
            {hasColorOptions && hasSizeOptions && ' / '}
            {hasSizeOptions ? selectedSize || '미선택' : hasColorOptions ? '' : 'FREE'}
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#666',
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: loading ? '#ccc' : '#000',
              color: '#fff',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {loading ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionChangeModal;

