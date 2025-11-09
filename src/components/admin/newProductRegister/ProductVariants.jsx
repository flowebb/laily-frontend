const ProductVariants = ({ 
  variants, 
  newVariant, 
  handleVariantChange, 
  addVariant, 
  removeVariant, 
  isMobile 
}) => {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.9rem',
          fontSize: '1.15rem',
          fontWeight: '600',
          color: '#333',
        }}
      >
        상품 옵션 (컬러 & 사이즈)
      </label>
      
      {/* Variant 추가 폼 */}
      <div style={{ 
        padding: '1.2rem', 
        border: '1px solid #e0e0e0', 
        borderRadius: '5px',
        marginBottom: '1.2rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr auto', gap: '0.9rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>컬러</label>
            <input
              type="text"
              name="color"
              value={newVariant.color}
              onChange={handleVariantChange}
              placeholder="크림"
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1.1rem',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>사이즈</label>
            <input
              type="text"
              name="size"
              value={newVariant.size}
              onChange={handleVariantChange}
              placeholder="S"
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1.1rem',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>재고</label>
            <input
              type="number"
              name="stock"
              value={newVariant.stock}
              onChange={handleVariantChange}
              placeholder="0"
              min="0"
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1.1rem',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>Variant SKU (선택)</label>
            <input
              type="text"
              name="variantSku"
              value={newVariant.variantSku}
              onChange={handleVariantChange}
              placeholder="SKU-001"
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1.1rem',
                outline: 'none',
              }}
            />
          </div>
          <button
            type="button"
            onClick={addVariant}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              height: 'fit-content',
            }}
          >
            추가
          </button>
        </div>
      </div>

      {/* Variants 목록 */}
      {variants.length > 0 && (
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '5px',
          maxHeight: '360px',
          overflowY: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>컬러</th>
                <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>사이즈</th>
                <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>재고</th>
                <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>Variant SKU</th>
                <th style={{ padding: '0.9rem', textAlign: 'center', fontSize: '1.0rem', fontWeight: '600' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.9rem', fontSize: '1.1rem' }}>{variant.color}</td>
                  <td style={{ padding: '0.9rem', fontSize: '1.1rem' }}>{variant.size}</td>
                  <td style={{ padding: '0.9rem', fontSize: '1.1rem' }}>{variant.stock}</td>
                  <td style={{ padding: '0.9rem', fontSize: '1.1rem', color: '#666' }}>
                    {variant.variantSku || '-'}
                  </td>
                  <td style={{ padding: '0.9rem', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.0rem',
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;

