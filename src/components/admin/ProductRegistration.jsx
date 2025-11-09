import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_WIDTH } from '../../constants/layout';

const ProductRegistration = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    originalPrice: '',
    discountPercentage: '',
    discountedPrice: '',
    sku: '',
    image: '',
    detailPage: '',
    description: '',
    isNew: false,
    isSale: false,
    inStock: false
  });

  const [variants, setVariants] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [newVariant, setNewVariant] = useState({
    color: '',
    size: '',
    stock: 0,
    image: '',
    variantSku: ''
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
    
    if (name === 'originalPrice' || name === 'discountPercentage' || name === 'discountedPrice') {
      const numValue = value === '' ? '' : parseFloat(value);
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        
        // 할인율이 입력되면 할인가 계산
        if (name === 'originalPrice' || name === 'discountPercentage') {
          const origPrice = name === 'originalPrice' ? numValue : parseFloat(prev.originalPrice) || 0;
          const discountPct = name === 'discountPercentage' ? numValue : parseFloat(prev.discountPercentage) || 0;
          
          if (origPrice > 0 && discountPct >= 0 && discountPct <= 100) {
            const discountAmount = Math.round(origPrice * (discountPct / 100));
            updated.discountedPrice = (origPrice - discountAmount).toString();
          }
        }
        // 할인가가 입력되면 할인율 계산
        else if (name === 'discountedPrice') {
          const origPrice = parseFloat(prev.originalPrice) || 0;
          const discPrice = numValue;
          
          if (origPrice > 0 && discPrice >= 0 && discPrice <= origPrice) {
            const discountAmount = origPrice - discPrice;
            const discountPct = origPrice > 0 ? Math.round((discountAmount / origPrice) * 100) : 0;
            updated.discountPercentage = discountPct.toString();
          }
        }
        
        return updated;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: name === 'stock' ? (value === '' ? 0 : parseInt(value) || 0) : value
    }));
  };

  const addVariant = () => {
    if (!newVariant.color || !newVariant.size) {
      alert('컬러와 사이즈를 모두 입력해주세요.');
      return;
    }

    // 중복 체크
    const isDuplicate = variants.some(
      v => v.color === newVariant.color && v.size.toUpperCase() === newVariant.size.toUpperCase()
    );

    if (isDuplicate) {
      alert('이미 존재하는 컬러-사이즈 조합입니다.');
      return;
    }

    const variant = {
      ...newVariant,
      size: newVariant.size.toUpperCase(),
      stock: parseInt(newVariant.stock) || 0
    };

    setVariants(prev => [...prev, variant]);
    
    // availableColors와 availableSizes 업데이트
    if (!availableColors.includes(newVariant.color)) {
      setAvailableColors(prev => [...prev, newVariant.color]);
    }
    if (!availableSizes.includes(newVariant.size.toUpperCase())) {
      setAvailableSizes(prev => [...prev, newVariant.size.toUpperCase()]);
    }

    // 입력 필드 초기화
    setNewVariant({
      color: '',
      size: '',
      stock: 0,
      image: '',
      variantSku: ''
    });
  };

  const removeVariant = (index) => {
    const variant = variants[index];
    setVariants(prev => prev.filter((_, i) => i !== index));
    
    // availableColors와 availableSizes 업데이트
    const remainingColors = [...new Set(variants.filter((_, i) => i !== index).map(v => v.color))];
    const remainingSizes = [...new Set(variants.filter((_, i) => i !== index).map(v => v.size))];
    setAvailableColors(remainingColors);
    setAvailableSizes(remainingSizes);
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
    if (!formData.name || !formData.category || !formData.sku || !formData.image || !formData.detailPage) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    // 가격 검증
    const originalPrice = parseFloat(formData.originalPrice);
    if (isNaN(originalPrice) || originalPrice < 0) {
      alert('정가는 0 이상의 숫자여야 합니다.');
      return;
    }

    // 할인율 또는 할인가 중 하나는 필수
    const discountPercentage = formData.discountPercentage !== '' ? parseFloat(formData.discountPercentage) : undefined;
    const discountedPrice = formData.discountedPrice !== '' ? parseFloat(formData.discountedPrice) : undefined;

    if (discountPercentage === undefined && discountedPrice === undefined) {
      alert('할인율 또는 할인가를 입력해주세요.');
      return;
    }

    // status 배열 생성
    const status = [];
    if (formData.isNew) status.push('NEW');
    if (formData.isSale) status.push('SALE');
    if (formData.inStock) status.push('IN_STOCK');

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // 가격 객체 구성
      const priceData = {
        originalPrice: originalPrice
      };

      if (discountPercentage !== undefined) {
        priceData.discountPercentage = discountPercentage;
      } else {
        priceData.discountedPrice = discountedPrice;
      }

      // JSON 전송
      const body = JSON.stringify({
        name: formData.name,
        category: formData.category,
        price: priceData,
        sku: formData.sku,
        image: formData.image,
        detailPage: formData.detailPage,
        description: formData.description || undefined,
        variants: variants.length > 0 ? variants : undefined,
        availableColors: availableColors,
        availableSizes: availableSizes,
        status: status.length > 0 ? status : undefined
      });

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
          padding: '1.2rem 2.4rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <button
              onClick={() => navigate('/admin')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.44rem',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ←
            </button>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
              상품 관리
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
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
              padding: '0.9rem 1.8rem',
              cursor: 'pointer',
              fontSize: '1.15rem',
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
              padding: '0.9rem 1.8rem',
              cursor: 'pointer',
              fontSize: '1.15rem',
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
          padding: isMobile ? '2.4rem 1.2rem' : '3.6rem 2.4rem',
        }}
      >
        {/* Title Section */}
        <div style={{ marginBottom: '2.4rem' }}>
          <h1 style={{ fontSize: isMobile ? '2.16rem' : '3rem', margin: 0, marginBottom: '0.6rem', color: '#333', fontWeight: 'bold' }}>
            새 상품 등록
          </h1>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: 'white',
            padding: isMobile ? '1.8rem' : '2.4rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '2.4rem',
              }}
            >
              {/* Left Column */}
              <div>
                         {/* SKU */}
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
                      padding: '0.9rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      fontSize: '1.15rem',
                      outline: 'none',
                    }}
                  />
                </div>
                {/* 상품명 */}
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
                      padding: '0.9rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      fontSize: '1.15rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* 정가 & 할인율 & 할인가 */}
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
                    정가 (원가)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="37000"
                    min="0"
                    step="1"
                    required
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      fontSize: '1.15rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '1.15rem',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      할인율 (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      placeholder="20"
                      min="0"
                      max="100"
                      step="1"
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        fontSize: '1.15rem',
                        outline: 'none',
                      }}
                    />
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      할인율을 입력하면 할인가가 자동 계산됩니다
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '1.15rem',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      할인가
                    </label>
                    <input
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                      placeholder="29600"
                      min="0"
                      step="1"
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        fontSize: '1.15rem',
                        outline: 'none',
                      }}
                    />
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      할인가를 입력하면 할인율이 자동 계산됩니다
                    </p>
                  </div>
                </div>

                {/* 가격 미리보기 */}
                {formData.originalPrice && (formData.discountPercentage || formData.discountedPrice) && (
                  <div style={{ 
                    marginBottom: '1.8rem', 
                    padding: '1.2rem', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '5px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <p style={{ margin: 0, fontSize: '1.0rem', color: '#666', marginBottom: '0.6rem' }}>가격 미리보기</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.1rem' }}>
                        {parseInt(formData.originalPrice).toLocaleString()}원
                      </span>
                      {formData.discountPercentage && (
                        <span style={{ color: '#ff6b6b', fontWeight: '600', fontSize: '1.1rem' }}>
                          {parseInt(formData.discountPercentage)}%
                        </span>
                      )}
                      <span style={{ fontWeight: 'bold', fontSize: '1.32rem', color: '#333' }}>
                        {formData.discountedPrice ? parseInt(formData.discountedPrice).toLocaleString() : ''}원
                      </span>
                      {formData.discountPercentage && formData.originalPrice && (
                        <span style={{ color: '#ff6b6b', fontSize: '1.0rem' }}>
                          ({Math.round(parseInt(formData.originalPrice) * (parseInt(formData.discountPercentage) / 100)).toLocaleString()}원 할인)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 카테고리 */}
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
                    카테고리
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      fontSize: '1.15rem',
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

                {/* Variants 관리 */}
                <div style={{ marginBottom: '1.8rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.9rem',
                      fontSize: '1.15rem',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    상품 옵션 (컬러 & 사이즈)
                  </label>
                  
                  {/* Variant 추가 폼 */}
                  <div style={{ 
                    padding: '1.2rem', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '5px',
                    marginBottom: '1.2rem',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr auto', gap: '0.9rem', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>컬러</label>
                        <input
                          type="text"
                          name="color"
                          value={newVariant.color}
                          onChange={handleVariantChange}
                          placeholder="크림"
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '5px',
                            fontSize: '1.1rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>사이즈</label>
                        <input
                          type="text"
                          name="size"
                          value={newVariant.size}
                          onChange={handleVariantChange}
                          placeholder="S"
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '5px',
                            fontSize: '1.1rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>재고</label>
                        <input
                          type="number"
                          name="stock"
                          value={newVariant.stock}
                          onChange={handleVariantChange}
                          placeholder="0"
                          min="0"
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '5px',
                            fontSize: '1.1rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '1.0rem', color: '#666' }}>Variant SKU (선택)</label>
                        <input
                          type="text"
                          name="variantSku"
                          value={newVariant.variantSku}
                          onChange={handleVariantChange}
                          placeholder="SKU-001"
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '5px',
                            fontSize: '1.1rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addVariant}
                        style={{
                          backgroundColor: '#333',
                          color: 'white',
                          border: 'none',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          whiteSpace: 'nowrap',
                          height: 'fit-content',
                        }}
                      >
                        추가
                      </button>
                    </div>
                  </div>

                  {/* Variants 목록 */}
                  {variants.length > 0 && (
                    <div style={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '5px',
                      maxHeight: '360px',
                      overflowY: 'auto'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                            <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>컬러</th>
                            <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>사이즈</th>
                            <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>재고</th>
                            <th style={{ padding: '0.9rem', textAlign: 'left', fontSize: '1.0rem', fontWeight: '600' }}>Variant SKU</th>
                            <th style={{ padding: '0.9rem', textAlign: 'center', fontSize: '1.0rem', fontWeight: '600' }}>삭제</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((variant, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                              <td style={{ padding: '0.9rem', fontSize: '1.1rem' }}>{variant.color}</td>
                              <td style={{ padding: '0.9rem', fontSize: '1.1rem' }}>{variant.size}</td>
                              <td style={{ padding: '0.9rem', fontSize: '1.1rem' }}>{variant.stock}</td>
                              <td style={{ padding: '0.9rem', fontSize: '1.1rem', color: '#666' }}>
                                {variant.variantSku || '-'}
                              </td>
                              <td style={{ padding: '0.9rem', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  style={{
                                    backgroundColor: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '1.0rem',
                                  }}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

       
              </div>

              {/* Right Column */}
              <div>
                {/* 상품 설명 */}
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
                      padding: '0.9rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      fontSize: '1.15rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* 상세 페이지 URL */}
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
                    상세 페이지 URL
                  </label>
                  <input
                    type="text"
                    name="detailPage"
                    value={formData.detailPage}
                    onChange={handleChange}
                    placeholder="https://example.com/product-detail"
                    required
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      fontSize: '1.15rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* 메인 이미지 */}
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
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
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
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        width: 'fit-content',
                      }}
                    >
                      파일 선택
                    </label>
                    <p style={{ margin: 0, fontSize: '1.0rem', color: '#666' }}>
                      {mainImageFile ? mainImageFile.name : '선택된 파일 없음'}
                    </p>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="메인 이미지 미리보기"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '240px',
                          borderRadius: '5px',
                          marginTop: '0.6rem',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* 상품 상태 */}
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
                    상품상태
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                        style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1.15rem' }}>신상품</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="isSale"
                        checked={formData.isSale}
                        onChange={handleChange}
                        style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1.15rem' }}>세일</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1.15rem' }}>재고있음</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistration;

