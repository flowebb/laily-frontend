import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_WIDTH } from '../constants/layout';

const ProductRegistration = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    sku: '',
    size: '',
    color: '',
    image: '',
    description: '',
    isNew: false,
    isSale: false,
    inStock: false
  });

  const [mainImageFile, setMainImageFile] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.user) {
          if (data.user.user_type !== 'admin') {
            alert('관리자 권한이 필요합니다.');
            navigate('/admin');
            return;
          }
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      // 파일을 base64로 변환하여 미리보기용으로 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.name || !formData.category || !formData.price || !formData.sku || !formData.image) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    // 가격 검증
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      alert('가격은 0 이상의 숫자여야 합니다.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // 파일이 있으면 FormData로 전송, 없으면 JSON으로 전송
      let body;
      let headers = {
        'Authorization': `Bearer ${token}`,
      };

      if (mainImageFile) {
        // FormData 사용 (실제 파일 업로드가 구현되어 있다면)
        body = new FormData();
        body.append('name', formData.name);
        body.append('category', formData.category);
        body.append('price', price);
        body.append('sku', formData.sku);
        if (formData.originalPrice) body.append('originalPrice', formData.originalPrice);
        if (formData.size) body.append('size', formData.size);
        if (formData.color) body.append('color', formData.color);
        if (formData.description) body.append('description', formData.description);
        body.append('image', mainImageFile);
        body.append('detailPage', '');
        body.append('isNew', formData.isNew);
        body.append('isSale', formData.isSale);
        body.append('inStock', formData.inStock);
      } else {
        // JSON 전송 (현재 서버 API에 맞춤)
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: price,
          sku: formData.sku,
          image: formData.image,
          detailPage: '',
          description: formData.description || undefined
        });
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: headers,
        body: body,
      });

      const data = await response.json();

      if (response.ok) {
        alert('상품이 성공적으로 등록되었습니다.');
        navigate('/admin');
      } else {
        alert(data.error || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/admin')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ←
            </button>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              상품 관리
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>+</span>
            <span>새 상품 등록</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e0e0e0' }}>
          <button
            onClick={() => navigate('/admin/products')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '0.95rem',
              color: '#666',
              borderBottom: '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            상품 목록
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '0.95rem',
              color: '#333',
              fontWeight: '600',
              borderBottom: '2px solid #333',
              marginBottom: '-2px',
            }}
          >
            상품 등록
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        }}
      >
        {/* Title Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', margin: 0, marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
            새 상품 등록
          </h1>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: 'white',
            padding: isMobile ? '1.5rem' : '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '2rem',
              }}
            >
              {/* Left Column */}
              <div>
                {/* 상품명 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    상품명
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="상품명을 입력하세요"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* 판매가격 & 정가 */}
                <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      판매가격
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      정가(선택)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* 카테고리 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    카테고리
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">카테고리 선택</option>
                    <option value="OUTER">OUTER</option>
                    <option value="TOP">TOP</option>
                    <option value="BOTTOM">BOTTOM</option>
                    <option value="DRESS">DRESS</option>
                    <option value="ACC">ACC</option>
                  </select>
                </div>

                {/* 사이즈 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    사이즈(쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="XS, S, M, L, XL"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* 색상 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    색상
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Black"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* SKU */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="SKU를 입력하세요"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* 상품 설명 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    상품설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="상품에 대한 자세한 설명을 입력하세요"
                    rows="8"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* 메인 이미지 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    메인 이미지
                  </label>
                  <div
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="main-image-input"
                    />
                    <label
                      htmlFor="main-image-input"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        width: 'fit-content',
                      }}
                    >
                      파일 선택
                    </label>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                      {mainImageFile ? mainImageFile.name : '선택된 파일 없음'}
                    </p>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="메인 이미지 미리보기"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px',
                          marginTop: '0.5rem',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* 상품 상태 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    상품상태
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.95rem' }}>신상품</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="isSale"
                        checked={formData.isSale}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.95rem' }}>세일</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.95rem' }}>재고있음</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
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
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                {submitting ? '등록 중...' : '상품 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistration;
