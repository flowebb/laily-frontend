const ProductImage = ({ product, isMobile }) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#f9f7f5',
        borderRadius: '0px',
        overflow: 'hidden',
        border: '1px solid #f0ece8',
        boxShadow: '0 6px 14px rgba(0,0,0,0.04)',
        height: '80vh',
        maxHeight: isMobile ? '80vh' : '80vh',
      }}
    >
      <img
        src={product.image || 'https://via.placeholder.com/700x840?text=No+Image'}
        alt={product.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default ProductImage;

