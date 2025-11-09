const ProductBasicInfo = ({ formData, handleChange, isMobile }) => {
  return (
    <div>
      {/* SKU */}
      <div style={{ marginBottom: '1.8rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.6rem',
            fontSize: '1.15rem',
            fontWeight: '600',
            color: '#333',
          }}
        >
          SKU
        </label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="SKU를 입력하세요"
          required
          style={{
            width: '100%',
            padding: '0.9rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1.15rem',
            outline: 'none',
          }}
        />
      </div>

      {/* 상품명 */}
      <div style={{ marginBottom: '1.8rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.6rem',
            fontSize: '1.15rem',
            fontWeight: '600',
            color: '#333',
          }}
        >
          상품명
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="상품명을 입력하세요"
          required
          style={{
            width: '100%',
            padding: '0.9rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1.15rem',
            outline: 'none',
          }}
        />
      </div>

      {/* 정가 */}
      <div style={{ marginBottom: '1.8rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.6rem',
            fontSize: '1.15rem',
            fontWeight: '600',
            color: '#333',
          }}
        >
          정가 (원가)
        </label>
        <input
          type="number"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          placeholder="37000"
          min="0"
          step="1"
          required
          style={{
            width: '100%',
            padding: '0.9rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1.15rem',
            outline: 'none',
          }}
        />
      </div>

      {/* 할인율 & 할인가 */}
      <div style={{ marginBottom: '1.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.6rem',
              fontSize: '1.15rem',
              fontWeight: '600',
              color: '#333',
            }}
          >
            할인율 (%)
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            placeholder="20"
            min="0"
            max="100"
            step="1"
            style={{
              width: '100%',
              padding: '0.9rem',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              fontSize: '1.15rem',
              outline: 'none',
            }}
          />
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            할인율을 입력하면 할인가가 자동 계산됩니다
          </p>
        </div>
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.6rem',
              fontSize: '1.15rem',
              fontWeight: '600',
              color: '#333',
            }}
          >
            할인가
          </label>
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            placeholder="29600"
            min="0"
            step="1"
            style={{
              width: '100%',
              padding: '0.9rem',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              fontSize: '1.15rem',
              outline: 'none',
            }}
          />
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            할인가를 입력하면 할인율이 자동 계산됩니다
          </p>
        </div>
      </div>

      {/* 가격 미리보기 */}
      {formData.originalPrice && (formData.discountPercentage || formData.discountedPrice) && (
        <div style={{ 
          marginBottom: '1.8rem', 
          padding: '1.2rem', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '5px',
          border: '1px solid #e0e0e0'
        }}>
          <p style={{ margin: 0, fontSize: '1.0rem', color: '#666', marginBottom: '0.6rem' }}>가격 미리보기</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.1rem' }}>
              {parseInt(formData.originalPrice).toLocaleString()}원
            </span>
            {formData.discountPercentage && (
              <span style={{ color: '#ff6b6b', fontWeight: '600', fontSize: '1.1rem' }}>
                {parseInt(formData.discountPercentage)}%
              </span>
            )}
            <span style={{ fontWeight: 'bold', fontSize: '1.32rem', color: '#333' }}>
              {formData.discountedPrice ? parseInt(formData.discountedPrice).toLocaleString() : ''}원
            </span>
            {formData.discountPercentage && formData.originalPrice && (
              <span style={{ color: '#ff6b6b', fontSize: '1.0rem' }}>
                ({Math.round(parseInt(formData.originalPrice) * (parseInt(formData.discountPercentage) / 100)).toLocaleString()}원 할인)
              </span>
            )}
          </div>
        </div>
      )}

      {/* 카테고리 */}
      <div style={{ marginBottom: '1.8rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.6rem',
            fontSize: '1.15rem',
            fontWeight: '600',
            color: '#333',
          }}
        >
          카테고리
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.9rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            fontSize: '1.15rem',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="">카테고리 선택</option>
          <option value="OUTER">OUTER</option>
          <option value="TOP">TOP</option>
          <option value="BOTTOM">BOTTOM</option>
          <option value="DRESS">DRESS</option>
          <option value="ACC">ACC</option>
        </select>
      </div>
    </div>
  );
};

export default ProductBasicInfo;

