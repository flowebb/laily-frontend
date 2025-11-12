import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useProductForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
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
    stock: '',
    image: '',
    variantSku: '',
    baseSku: '' // 기본 SKU를 추적하기 위한 필드
  });
  const [mainImageFile, setMainImageFile] = useState(null);

  // formData.sku가 변경될 때 newVariant.variantSku를 자동으로 업데이트
  useEffect(() => {
    if (formData.sku) {
      setNewVariant(prev => {
        // variantSku가 비어있거나 이전 기본 SKU와 같으면 새 기본 SKU로 업데이트
        // 사용자가 직접 다른 값을 입력한 경우는 보존
        if (!prev.variantSku || prev.variantSku === prev.baseSku || !prev.baseSku) {
          return {
            ...prev,
            variantSku: formData.sku,
            baseSku: formData.sku
          };
        }
        return {
          ...prev,
          baseSku: formData.sku
        };
      });
    }
  }, [formData.sku]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 에러 상태 초기화
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // 할인 정보 관련 필드 변경 시 discount 에러도 제거
    if (name === 'discountPercentage' || name === 'discountedPrice') {
      if (errors.discount) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.discount;
          return newErrors;
        });
      }
    }
    
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
      [name]: name === 'stock' ? (value === '' ? '' : (isNaN(parseInt(value)) ? '' : parseInt(value))) : value
    }));
  };

  const addVariant = () => {
    if (!newVariant.color || !newVariant.size) {
      alert('컬러와 사이즈를 모두 입력해주세요.');
      return;
    }

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
      stock: newVariant.stock === '' ? 0 : (parseInt(newVariant.stock) || 0)
    };

    setVariants(prev => [...prev, variant]);
    
    if (!availableColors.includes(newVariant.color)) {
      setAvailableColors(prev => [...prev, newVariant.color]);
    }
    if (!availableSizes.includes(newVariant.size.toUpperCase())) {
      setAvailableSizes(prev => [...prev, newVariant.size.toUpperCase()]);
    }

    setNewVariant({
      color: '',
      size: '',
      stock: '',
      image: '',
      variantSku: formData.sku || '',
      baseSku: formData.sku || ''
    });
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
    
    const remainingColors = [...new Set(variants.filter((_, i) => i !== index).map(v => v.color))];
    const remainingSizes = [...new Set(variants.filter((_, i) => i !== index).map(v => v.size))];
    setAvailableColors(remainingColors);
    setAvailableSizes(remainingSizes);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 에러 초기화
    const newErrors = {};
    
    // 필수 필드 검증
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = '상품명을 입력해주세요.';
    }
    
    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = '카테고리를 선택해주세요.';
    }
    
    if (!formData.sku || formData.sku.trim() === '') {
      newErrors.sku = 'SKU를 입력해주세요.';
    }
    
    if (!formData.image || formData.image.trim() === '') {
      newErrors.image = '상품 이미지를 업로드해주세요.';
    }
    
    if (!formData.detailPage || formData.detailPage.trim() === '') {
      newErrors.detailPage = '상세 페이지를 작성해주세요.';
    }
    
    const originalPrice = parseFloat(formData.originalPrice);
    if (!formData.originalPrice || formData.originalPrice.trim() === '' || isNaN(originalPrice) || originalPrice < 0) {
      newErrors.originalPrice = '정가는 0 이상의 숫자여야 합니다.';
    }

    const discountPercentage = formData.discountPercentage !== '' ? parseFloat(formData.discountPercentage) : undefined;
    const discountedPrice = formData.discountedPrice !== '' ? parseFloat(formData.discountedPrice) : undefined;

    if (discountPercentage === undefined && discountedPrice === undefined) {
      newErrors.discount = '할인율 또는 할인가 중 하나를 입력해주세요.';
    }
    
    // 에러가 있으면 표시하고 첫 번째 에러 필드로 스크롤
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                          document.querySelector(`[data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      
      return;
    }
    
    // 에러 없으면 초기화
    setErrors({});

    const status = [];
    if (formData.isNew) status.push('NEW');
    if (formData.isSale) status.push('SALE');
    if (formData.inStock) status.push('IN_STOCK');

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const priceData = {
        originalPrice: originalPrice
      };

      if (discountPercentage !== undefined) {
        priceData.discountPercentage = discountPercentage;
      } else {
        priceData.discountedPrice = discountedPrice;
      }

      // 요청 본문 구성
      const requestBody = {
        name: formData.name.trim(),
        category: formData.category,
        price: priceData,
        sku: formData.sku.trim(),
        image: formData.image.trim(),
        detailPage: formData.detailPage.trim(),
      };

      // 선택적 필드 추가
      if (formData.description && formData.description.trim()) {
        requestBody.description = formData.description.trim();
      }

      // variants가 있는 경우에만 추가
      if (variants.length > 0) {
        requestBody.variants = variants.map(v => ({
          color: v.color.trim(),
          size: v.size.trim().toUpperCase(),
          stock: parseInt(v.stock) || 0,
          ...(v.image && v.image.trim() && { image: v.image.trim() }),
          ...(v.variantSku && v.variantSku.trim() && { variantSku: v.variantSku.trim().toUpperCase() })
        }));
      }

      // availableColors와 availableSizes는 variants에서 자동 추출되지만, 명시적으로 보내도 됨
      if (availableColors.length > 0) {
        requestBody.availableColors = availableColors;
      }
      if (availableSizes.length > 0) {
        requestBody.availableSizes = availableSizes;
      }

      // status가 있는 경우에만 추가
      if (status.length > 0) {
        requestBody.status = status;
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert('상품이 성공적으로 등록되었습니다.');
        // 폼 초기화
        setFormData({
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
        setVariants([]);
        setAvailableColors([]);
        setAvailableSizes([]);
        setMainImageFile(null);
        navigate('/admin');
      } else {
        // 서버에서 보낸 에러 메시지 표시
        const errorMessage = data.error || data.details || '상품 등록에 실패했습니다.';
        alert(`상품 등록 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    variants,
    newVariant,
    mainImageFile,
    submitting,
    errors,
    availableColors,
    availableSizes,
    handleChange,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleFileChange,
    handleSubmit
  };
};

