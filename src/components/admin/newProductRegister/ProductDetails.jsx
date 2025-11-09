const ProductDetails = ({ formData, handleChange }) => {
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
        상세 페이지 URL
      </label>
      <input
        type="text"
        name="detailPage"
        value={formData.detailPage}
        onChange={handleChange}
        placeholder="https://example.com/product-detail"
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
  );
};

export default ProductDetails;

