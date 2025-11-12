const ProductDescription = ({ product }) => {
  return (
    <>
      {/* 상세 설명 영역 */}
      <div style={{ padding: '3rem 1rem', color: '#444', lineHeight: 1.8 }}>
        {product.detailPage ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}
            dangerouslySetInnerHTML={{ __html: product.detailPage }}
          />
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>상세 설명이 준비 중입니다.</p>
        )}
      </div>

      {/* GUIDE/REVIEW/Q&A 안내 문구 */}
      <div style={{ padding: '0 1rem 3rem 1rem', display: 'grid', gap: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>GUIDE</h3>
          <p style={{ color: '#777', fontSize: '0.95rem' }}>
            배송, 교환 및 반품 안내는 추후 업데이트될 예정입니다. 고객센터로 문의해 주세요.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>REVIEW</h3>
          <p style={{ color: '#777', fontSize: '0.95rem' }}>
            아직 등록된 리뷰가 없습니다. 첫 번째 후기를 남겨주세요!
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Q&A</h3>
          <p style={{ color: '#777', fontSize: '0.95rem' }}>
            상품에 대해 궁금한 점이 있다면 Q&A 게시판을 통해 남겨주세요.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductDescription;

