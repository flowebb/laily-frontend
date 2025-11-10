/**
 * ProductImageGallery.jsx
 * 에디터에 이미지 삽입 기능
 * - 상세 페이지용 이미지 갤러리 관리
 * - 다중 이미지 업로드 및 순서 변경 기능
 * - 에디터에 이미지를 삽입하는 기능 제공
 */
import { useState } from 'react';

const ProductImageGallery = ({ images, onImagesChange, onInsertToEditor }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleMultipleImageUpload = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary 설정이 필요합니다. 환경 변수를 확인해주세요.');
      return;
    }

    setUploading(true);
    const uploadedUrls = [];
    const totalFiles = files.length;

    // 각 파일을 순차적으로 업로드
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: totalFiles, fileName: file.name });

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        // 상세 페이지 이미지는 'product-details' 폴더에 저장
        formData.append('folder', 'product-details');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`이미지 업로드 실패: ${file.name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error(`이미지 업로드 오류 (${file.name}):`, error);
        alert(`${file.name} 업로드에 실패했습니다.`);
      }
    }

    // 업로드된 이미지들을 기존 이미지 목록에 추가
    const newImages = [...images, ...uploadedUrls];
    onImagesChange(newImages);
    setUploading(false);
    setUploadProgress({});
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleMultipleImageUpload(files);
    }
    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      onImagesChange(newImages);
    }
  };

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
        상세 이미지 갤러리 ({images.length}장)
      </label>

      {/* 업로드 버튼 */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.2rem',
            backgroundColor: '#333',
            color: 'white',
            borderRadius: '5px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? (
            `업로드 중... (${uploadProgress.current}/${uploadProgress.total})`
          ) : (
            '이미지 선택 (다중 선택 가능)'
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
        {images.length > 0 && onInsertToEditor && (
          <button
            type="button"
            onClick={() => onInsertToEditor(images)}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            에디터에 이미지 삽입
          </button>
        )}
        {uploading && uploadProgress.fileName && (
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            현재: {uploadProgress.fileName}
          </span>
        )}
      </div>

      {/* 이미지 갤러리 */}
      {images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            backgroundColor: '#fafafa',
          }}
        >
          {images.map((imageUrl, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '1px solid #e0e0e0',
              }}
            >
              <img
                src={imageUrl}
                alt={`상세 이미지 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  display: 'flex',
                  gap: '0.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: index === 0 ? '#ccc' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="위로 이동"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: index === images.length - 1 ? '#ccc' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: index === images.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="아래로 이동"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="삭제"
                >
                  ×
                </button>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
        여러 이미지를 한 번에 선택하여 업로드할 수 있습니다. 이미지 순서는 드래그로 변경할 수 있습니다.
      </p>
    </div>
  );
};

export default ProductImageGallery;

