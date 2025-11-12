import { InfoRow, OptionChip } from './UIHelpers';

const ProductOptions = ({ 
  product, 
  selectedColor, 
  setSelectedColor, 
  selectedSize, 
  setSelectedSize,
  availableSizesForColor,
  hasColorOptions 
}) => {
  return (
    <div style={{ borderTop: '1px solid #f3f3f3', borderBottom: '1px solid #f3f3f3' }}>
      <InfoRow label="배송">
        <span style={{ color: '#555', cursor: 'pointer', textDecoration: 'underline' }}>
          자세한 배송정보는 여기를 클릭해 주세요.
        </span>
      </InfoRow>
      <InfoRow label="컬러" alignTop minHeight="39px">
        {product.availableColors?.length ? (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {product.availableColors.map((color) => (
              <OptionChip
                key={color}
                label={color}
                active={selectedColor === color}
                onClick={() => {
                  setSelectedColor(color);
                  // 컬러 변경 시 사이즈는 초기화 (사용자가 직접 선택하도록)
                  setSelectedSize('');
                }}
              />
            ))}
          </div>
        ) : (
          <span style={{ color: '#aaa' }}>옵션 준비 중</span>
        )}
      </InfoRow>
      <InfoRow label="사이즈" alignTop minHeight="39px">
        {hasColorOptions && selectedColor ? (
          availableSizesForColor.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {availableSizesForColor.map((size) => (
                <OptionChip
                  key={size}
                  label={size}
                  active={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                />
              ))}
            </div>
          ) : (
            <span style={{ color: '#aaa' }}>사이즈 옵션 없음</span>
          )
        ) : product.availableSizes?.length ? (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {product.availableSizes.map((size) => (
              <OptionChip
                key={size}
                label={size}
                active={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              />
            ))}
          </div>
        ) : (
          <span style={{ color: '#aaa' }}>ONE SIZE</span>
        )}
      </InfoRow>
    </div>
  );
};

export default ProductOptions;

