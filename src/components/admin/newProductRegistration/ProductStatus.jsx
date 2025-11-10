const ProductStatus = ({ formData, handleChange }) => {
  return (
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
        상품상태
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="isNew"
            checked={formData.isNew}
            onChange={handleChange}
            style={{ width: '22px', height: '22px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '1.15rem' }}>신상품</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="isSale"
            checked={formData.isSale}
            onChange={handleChange}
            style={{ width: '22px', height: '22px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '1.15rem' }}>세일</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            style={{ width: '22px', height: '22px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '1.15rem' }}>재고있음</span>
        </label>
      </div>
    </div>
  );
};

export default ProductStatus;

