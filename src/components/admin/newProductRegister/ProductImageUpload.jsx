import { useState, useEffect } from 'react';

const ProductImageUpload = ({ formData, handleChange }) => {
  const [imageUrl, setImageUrl] = useState(formData.image || '');

  useEffect(() => {
    setImageUrl(formData.image || '');
  }, [formData.image]);

  const openCloudinaryWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary 설정이 필요합니다. 환경 변수를 확인해주세요.');
      return;
    }

    if (!window.cloudinary) {
      alert('Cloudinary 위젯을 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'camera', 'url'],
        multiple: false,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Poppins',
              active: true
            }
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const uploadedUrl = result.info.secure_url;
          setImageUrl(uploadedUrl);
          
          // formData 업데이트를 위한 이벤트 생성
          const syntheticEvent = {
            target: {
              name: 'image',
              value: uploadedUrl
            }
          };
          handleChange(syntheticEvent);
        } else if (error) {
          console.error('Cloudinary 업로드 오류:', error);
          alert('이미지 업로드 중 오류가 발생했습니다.');
        }
      }
    );

    widget.open();
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
        메인 이미지
      </label>
      <div
       
      >
        <button
          type="button"
          onClick={openCloudinaryWidget}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#faf8f8',
            color: 'black',
            borderRadius: '5px',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '500',
            width: '100%',
          }}
        >
          메인 이미지 업로드
        </button>
        
        {imageUrl && (
          <>
            <div style={{ marginTop: '0.6rem' }}>
              <img
                src={imageUrl}
                alt="메인 이미지 미리보기"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '5px',
                  objectFit: 'contain',
                  border: '1px solid #e0e0e0',
                }}
              />
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              이미지가 업로드되었습니다
            </p>
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                const syntheticEvent = {
                  target: {
                    name: 'image',
                    value: ''
                  }
                };
                handleChange(syntheticEvent);
              }}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                width: 'fit-content',
                marginTop: '0.3rem',
              }}
            >
              이미지 제거
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;

