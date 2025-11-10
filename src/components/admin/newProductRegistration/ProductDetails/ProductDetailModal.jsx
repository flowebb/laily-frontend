/**
 * ProductDetailModal.jsx
 * CKEditor 구현 파일
 * - 상세 페이지 편집을 위한 모달 컴포넌트
 * - CKEditor 5를 사용하여 리치 텍스트 편집 기능 제공
 * - Cloudinary를 통한 이미지 업로드 지원
 * - 이미지 갤러리와 연동하여 이미지 삽입 기능 제공
 */
import { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CloudinaryUploadAdapter } from '../../../../utils/CloudinaryUploadAdapter';
import ProductImageGallery from './ProductImageGallery';

const ProductDetailModal = ({ isOpen, onClose, formData, handleChange }) => {
  const [editorData, setEditorData] = useState(formData.detailPage || '');
  const [galleryImages, setGalleryImages] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEditorData(formData.detailPage || '');
      
      // 기존 HTML에서 이미지 URL 추출
      if (formData.detailPage) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(formData.detailPage, 'text/html');
        const images = Array.from(doc.querySelectorAll('img')).map(img => img.src);
        if (images.length > 0) {
          setGalleryImages(images);
        } else {
          setGalleryImages([]);
        }
      } else {
        setGalleryImages([]);
      }
    }
  }, [isOpen, formData.detailPage]);

  // 갤러리 이미지 변경 시 CKEditor에 자동 삽입
  useEffect(() => {
    if (editorRef.current && galleryImages.length > 0 && isOpen) {
      const editor = editorRef.current;
      const currentContent = editor.getData();
      
      // 이미 갤러리 이미지가 포함되어 있는지 확인
      const parser = new DOMParser();
      const doc = parser.parseFromString(currentContent, 'text/html');
      const existingImages = Array.from(doc.querySelectorAll('img')).map(img => img.src);
      
      // 새로운 이미지만 추가
      const newImages = galleryImages.filter(img => !existingImages.includes(img));
      
      if (newImages.length > 0) {
        // 새 이미지들을 HTML로 생성하여 에디터에 추가
        const imageHtml = newImages.map(img => `<figure class="image image_resized" style="width:100%;"><img src="${img}" alt="상세 이미지"></figure>`).join('');
        const updatedContent = currentContent + imageHtml;
        editor.setData(updatedContent);
        setEditorData(updatedContent);
        
        // formData 업데이트
        const syntheticEvent = {
          target: {
            name: 'detailPage',
            value: updatedContent,
          },
        };
        handleChange(syntheticEvent);
      }
    }
  }, [galleryImages, isOpen, handleChange]);

  const handleEditorReady = (editor) => {
    editorRef.current = editor;

    // Cloudinary 업로드 어댑터 설정
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CloudinaryUploadAdapter(loader);
    };
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);

    // formData 업데이트를 위한 이벤트 생성
    const syntheticEvent = {
      target: {
        name: 'detailPage',
        value: data,
      },
    };
    handleChange(syntheticEvent);
  };

  const handleSave = () => {
    // 현재 에디터 내용 저장
    if (editorRef.current) {
      let data = editorRef.current.getData();
      
      // 갤러리의 모든 이미지가 에디터에 포함되어 있는지 확인
      if (galleryImages.length > 0) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const existingImages = Array.from(doc.querySelectorAll('img')).map(img => img.src);
        
        // 갤러리에 있지만 에디터에 없는 이미지 추가
        const missingImages = galleryImages.filter(img => !existingImages.includes(img));
        if (missingImages.length > 0) {
          // 누락된 이미지들을 HTML로 생성하여 에디터에 추가
          const imageHtml = missingImages.map(img => `<figure class="image"><img src="${img}" alt="상세 이미지"></figure>`).join('');
          data = data + imageHtml;
        }
      }
      
      const syntheticEvent = {
        target: {
          name: 'detailPage',
          value: data,
        },
      };
      handleChange(syntheticEvent);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSave();
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            상세 페이지 편집
          </h2>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: '0.5rem',
              lineHeight: 1,
            }}
            title="닫기"
          >
            ×
          </button>
        </div>

        {/* 콘텐츠 */}
        <div
          style={{
            padding: '2rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* 이미지 갤러리 섹션 */}
          <ProductImageGallery 
            images={galleryImages} 
            onImagesChange={setGalleryImages}
            onInsertToEditor={(images) => {
              if (editorRef.current) {
                const editor = editorRef.current;
                const currentContent = editor.getData();
                
                // 이미지들을 HTML로 생성하여 에디터에 추가
                const imageHtml = images.map(img => `<figure class="image image_resized" style="width:100%;"><img src="${img}" alt="상세 이미지"></figure>`).join('');
                const updatedContent = currentContent + imageHtml;
                editor.setData(updatedContent);
                setEditorData(updatedContent);
                
                // formData 업데이트
                const syntheticEvent = {
                  target: {
                    name: 'detailPage',
                    value: updatedContent,
                  },
                };
                handleChange(syntheticEvent);
              }
            }}
          />

          {/* CKEditor 섹션 */}
          <div style={{ marginTop: '1.8rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.6rem',
                fontSize: '1.15rem',
                fontWeight: '600',
                color: '#333',
              }}
            >
              상세 페이지 콘텐츠
            </label>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                overflow: 'hidden',
                minHeight: '400px',
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onReady={handleEditorReady}
                onChange={handleEditorChange}
                config={{
                  placeholder: '여기에 텍스트를 입력하세요. 이미지 갤러리에서 업로드한 이미지가 자동으로 삽입됩니다.',
                  toolbar: {
                    items: [
                      'heading',
                      '|',
                      'bold',
                      'italic',
                      'link',
                      'bulletedList',
                      'numberedList',
                      '|',
                      'outdent',
                      'indent',
                      '|',
                      'imageUpload',
                      'blockQuote',
                      'insertTable',
                      'mediaEmbed',
                      '|',
                      'undo',
                      'redo',
                    ],
                  },
                  language: 'ko',
                  image: {
                    toolbar: [
                      'imageTextAlternative',
                      'toggleImageCaption',
                      'imageStyle:inline',
                      'imageStyle:block',
                      'imageStyle:side',
                    ],
                  },
                  table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                  },
                }}
              />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                📝 텍스트 입력 방법:
              </p>
              <ul style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
                <li>에디터 영역을 클릭하고 직접 타이핑하여 텍스트를 입력하세요</li>
                <li>툴바의 버튼을 사용하여 텍스트 스타일을 변경할 수 있습니다 (굵게, 기울임, 제목 등)</li>
                <li>이미지 갤러리에서 업로드한 이미지는 자동으로 에디터에 삽입됩니다</li>
                <li>에디터에서도 직접 이미지를 업로드할 수 있습니다 (툴바의 이미지 아이콘 클릭)</li>
              </ul>
              <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                💡 <strong>팁:</strong> 이미지와 텍스트를 자유롭게 배치하여 상세 페이지를 구성하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

