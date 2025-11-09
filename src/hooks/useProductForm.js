import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useProductForm = () => {
  const navigate = useNavigate();
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
    
    if (!availableColors.includes(newVariant.color)) {
      setAvailableColors(prev => [...prev, newVariant.color]);
    }
    if (!availableSizes.includes(newVariant.size.toUpperCase())) {
      setAvailableSizes(prev => [...prev, newVariant.size.toUpperCase()]);
    }

    setNewVariant({
      color: '',
      size: '',
      stock: 0,
      image: '',
      variantSku: ''
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
    
    if (!formData.name || !formData.category || !formData.sku || !formData.image || !formData.detailPage) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    const originalPrice = parseFloat(formData.originalPrice);
    if (isNaN(originalPrice) || originalPrice < 0) {
      alert('정가는 0 이상의 숫자여야 합니다.');
      return;
    }

    const discountPercentage = formData.discountPercentage !== '' ? parseFloat(formData.discountPercentage) : undefined;
    const discountedPrice = formData.discountedPrice !== '' ? parseFloat(formData.discountedPrice) : undefined;

    if (discountPercentage === undefined && discountedPrice === undefined) {
      alert('할인율 또는 할인가를 입력해주세요.');
      return;
    }

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

