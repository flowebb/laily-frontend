import { useNavigate } from 'react-router-dom';

const ProductFormActions = ({ submitting }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end', marginTop: '2.4rem', paddingTop: '2.4rem', borderTop: '1px solid #e0e0e0' }}>
      <button
        type="button"
        onClick={() => navigate('/admin')}
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
        {submitting ? '등록 중...' : '상품 등록'}
      </button>
    </div>
  );
};

export default ProductFormActions;

