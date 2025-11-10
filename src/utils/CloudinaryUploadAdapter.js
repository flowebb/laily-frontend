/**
 * CKEditor 5용 Cloudinary 업로드 어댑터
 */
export class CloudinaryUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
          const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

          if (!cloudName || !uploadPreset) {
            reject('Cloudinary 설정이 필요합니다. 환경 변수를 확인해주세요.');
            return;
          }

          // FormData 생성
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          // 상세 페이지 이미지는 'product-details' 폴더에 저장
          formData.append('folder', 'product-details');

          // Cloudinary 업로드 API 호출
          fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('이미지 업로드에 실패했습니다.');
              }
              return response.json();
            })
            .then((data) => {
              // Cloudinary에서 반환된 secure_url 사용
              resolve({
                default: data.secure_url,
              });
            })
            .catch((error) => {
              console.error('Cloudinary 업로드 오류:', error);
              reject(error);
            });
        })
    );
  }

  abort() {
    // 업로드 취소 (필요시 구현)
  }
}

