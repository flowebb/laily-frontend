import { useNavigate } from 'react-router-dom';

const ProductFormActions = ({ submitting, mode = 'register' }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (mode === 'edit') {
      navigate('/admin/products');
    } else {
      navigate('/admin');
    }
  };

  const getButtonText = () => {
    if (mode === 'edit') {
      return submitting ? '수정 중...' : '상품 수정';
    }
    return submitting ? '등록 중...' : '상품 등록';
  };

  return (
    <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end', marginTop: '2.4rem', paddingTop: '2.4rem', borderTop: '1px solid #e0e0e0' }}>
      <button
        type="button"
        onClick={handleCancel}
        style={{
          backgroundColor: '#f0f0f0',
          color: '#333',
          border: 'none',
          padding: '0.9rem 1.8rem',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1.15rem',
          fontWeight: '500',
        }}
      >
        취소
      </button>
      <button
        type="submit"
        disabled={submitting}
        style={{
          backgroundColor: submitting ? '#ccc' : '#333',
          color: 'white',
          border: 'none',
          padding: '0.9rem 1.8rem',
          borderRadius: '5px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontSize: '1.15rem',
          fontWeight: '500',
        }}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default ProductFormActions;

