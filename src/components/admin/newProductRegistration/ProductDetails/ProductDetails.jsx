/**
 * ProductDetails.jsx
 * 모달을 여는 래퍼 컴포넌트
 * - 상세 페이지 미리보기 표시
 * - "상세 페이지 만들기/편집" 버튼 제공
 * - ProductDetailModal을 열고 닫는 기능
 */
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';

const ProductDetails = ({ formData, handleChange, errors = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 상세 페이지 미리보기 (간단한 요약)
  const getPreviewText = () => {
    if (!formData.detailPage) {
      return '상세 페이지가 작성되지 않았습니다.';
    }
    
    // HTML 태그 제거하고 텍스트만 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.detailPage, 'text/html');
    const text = doc.body.textContent || '';
    const imageCount = doc.querySelectorAll('img').length;
    
    const preview = text.substring(0, 100).trim();
    const hasMore = text.length > 100;
    
    return (
      <>
        {preview}
        {hasMore && '...'}
        {imageCount > 0 && ` (이미지 ${imageCount}장 포함)`}
      </>
    );
  };

  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.6rem',
          fontSize: '1.15rem',
          fontWeight: '600',
          color: errors.detailPage ? '#ef4444' : '#333',
        }}
      >
        상세 페이지 {errors.detailPage && <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>*</span>}
      </label>
      
      {/* 미리보기 영역 */}
      <div
        style={{
          border: errors.detailPage ? '2px solid #ef4444' : '1px solid #e0e0e0',
          borderRadius: '5px',
          padding: '1rem',
          backgroundColor: errors.detailPage ? '#fef2f2' : '#fafafa',
          marginBottom: '0.75rem',
          minHeight: '80px',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem', color: errors.detailPage ? '#ef4444' : '#666', lineHeight: '1.6' }}>
          {getPreviewText()}
        </p>
      </div>

      {/* 편집 버튼 */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        data-field="detailPage"
        style={{
          width: '100%',
          padding: '0.9rem',
          backgroundColor: errors.detailPage ? '#ef4444' : '#333',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
        }}
      >
        {formData.detailPage ? '상세 페이지 편집' : '상세 페이지 만들기'}
      </button>
      {errors.detailPage && (
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#ef4444' }}>
          {errors.detailPage}
        </p>
      )}

      {/* 모달 */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default ProductDetails;

