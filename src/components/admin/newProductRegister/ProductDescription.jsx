const ProductDescription = ({ formData, handleChange }) => {
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
        상품설명
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="상품에 대한 자세한 설명을 입력하세요"
        rows="8"
        style={{
          width: '100%',
          padding: '0.9rem',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
          fontSize: '1.15rem',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
};

export default ProductDescription;

