// React 훅과 라우터 유틸리티
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 레이아웃 및 공유 컴포넌트
import Navbar from '../Navbar';
import { MAX_WIDTH } from '../../constants/layout';

// 유틸리티
import { getPriceInfo } from './utils/getPriceInfo';

// 컴포넌트
import ProductImage from './components/ProductImage';
import ProductHeader from './components/ProductHeader';
import ProductOptions from './components/ProductOptions';
import SelectedOptions from './components/SelectedOptions';
import PurchaseButtons from './components/PurchaseButtons';
import ProductTabs from './components/ProductTabs';
import ProductDescription from './components/ProductDescription';
import CartModal from './components/CartModal';

const ProductDetail = () => {
  // URL 파라미터와 네비게이션 관련 훅
  const { id } = useParams();
  const navigate = useNavigate();

  // 상품 정보와 화면 상태 관리
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isShippingAccordionOpen, setIsShippingAccordionOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [userRemovedDefaultOption, setUserRemovedDefaultOption] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isDuplicateItem, setIsDuplicateItem] = useState(false);

  // 파생되는 가격 정보와 합계
  const priceInfo = useMemo(() => getPriceInfo(product), [product]);
  const unitPrice = priceInfo.finalPrice || 0;
  const totalQuantity = selectedOptions.reduce((sum, option) => sum + option.quantity, 0);
  const totalPrice = selectedOptions.reduce(
    (sum, option) => sum + option.quantity * (option.unitPrice ?? unitPrice),
    0
  );

  // 페이지 로드 시 스크롤을 상단으로 이동 (이미지가 보이도록)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  // 마운트 시 또는 id가 변경될 때 상품 상세 정보를 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`상품을 불러오지 못했습니다. (${response.status})`);
        }
        const data = await response.json();
        if (!data.product) {
          throw new Error('상품 정보를 찾을 수 없습니다.');
        }

        setProduct(data.product);
        // 초기 상태: 컬러와 사이즈를 선택하지 않은 상태
        setSelectedColor('');
        setSelectedSize('');
        setSelectedOptions([]);
        setUserRemovedDefaultOption(false);
      } catch (err) {
        console.error(err);
        setError(err.message || '상품 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 뷰포트 크기를 추적하여 반응형 레이아웃 제어
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 기본 뒤로가기 동작
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const hasColorOptions = (product?.availableColors?.length || 0) > 0;
  const hasSizeOptions = (product?.availableSizes?.length || 0) > 0;
  
  // 선택된 컬러에 따라 사용 가능한 사이즈 필터링
  const availableSizesForColor = useMemo(() => {
    if (!product?.variants || !selectedColor) {
      return product?.availableSizes || [];
    }
    // 선택된 컬러에 해당하는 variant들의 사이즈만 추출
    const sizes = product.variants
      .filter(v => v.color === selectedColor)
      .map(v => v.size)
      .filter((size, index, self) => self.indexOf(size) === index); // 중복 제거
    return sizes;
  }, [product?.variants, selectedColor, product?.availableSizes]);

  const selectionKey = `${hasColorOptions ? selectedColor || 'NONE' : 'NO_COLOR'}|${
    hasSizeOptions ? selectedSize || 'NONE' : 'NO_SIZE'
  }`;
  const selectionReady = (!hasColorOptions || selectedColor) && (!hasSizeOptions || selectedSize);
  const isDuplicateSelection = selectedOptions.some((option) => option.key === selectionKey);
  const hasSelections = selectedOptions.length > 0;

  // 옵션이 없는 상품은 기본 항목을 자동으로 추가 (사용자가 삭제하지 않은 경우에만)
  useEffect(() => {
    if (!product) return;
    if (!hasColorOptions && !hasSizeOptions && selectedOptions.length === 0 && !userRemovedDefaultOption) {
      setSelectedOptions([
        {
          key: 'DEFAULT',
          color: '',
          size: '',
          quantity: 1,
          unitPrice,
        },
      ]);
    }
  }, [product, hasColorOptions, hasSizeOptions, selectedOptions.length, unitPrice, userRemovedDefaultOption]);

  // 컬러와 사이즈가 모두 선택되면 자동으로 옵션 추가
  useEffect(() => {
    if (!product || !selectionReady) return;
    
    // 옵션이 없는 상품은 제외
    if (!hasColorOptions && !hasSizeOptions) return;
    
    // 컬러와 사이즈 조합이 실제 variant에 존재하는지 확인
    if (hasColorOptions && hasSizeOptions && product?.variants) {
      const variantExists = product.variants.some(
        v => v.color === selectedColor && v.size === selectedSize
      );
      if (!variantExists) return;
    }
    
    // 자동으로 옵션 추가
    setSelectedOptions((prev) => {
      // 중복 체크 (안전장치)
      const currentSelectionKey = `${hasColorOptions ? selectedColor || 'NONE' : 'NO_COLOR'}|${
        hasSizeOptions ? selectedSize || 'NONE' : 'NO_SIZE'
      }`;
      const isAlreadyAdded = prev.some((option) => option.key === currentSelectionKey);
      if (isAlreadyAdded) return prev;
      
      return [
        ...prev,
        {
          key: currentSelectionKey,
          color: hasColorOptions ? selectedColor : '',
          size: hasSizeOptions ? selectedSize : '',
          quantity: 1,
          unitPrice,
        },
      ];
    });
  }, [selectedColor, selectedSize, product, hasColorOptions, hasSizeOptions, unitPrice]);

  // 선택된 옵션 배열에 새 항목 추가
  const handleAddSelection = () => {
    if (!selectionReady || isDuplicateSelection) {
      return;
    }
    
    // 컬러와 사이즈 조합이 실제 variant에 존재하는지 확인
    if (hasColorOptions && hasSizeOptions && product?.variants) {
      const variantExists = product.variants.some(
        v => v.color === selectedColor && v.size === selectedSize
      );
      if (!variantExists) {
        alert('선택하신 컬러와 사이즈 조합은 사용할 수 없습니다.');
        return;
      }
    }
    
    setSelectedOptions((prev) => [
      ...prev,
      {
        key: selectionKey,
        color: hasColorOptions ? selectedColor : '',
        size: hasSizeOptions ? selectedSize : '',
        quantity: 1,
        unitPrice,
      },
    ]);
  };

  // 옵션 수량 조정 유틸
  const updateOptionQuantity = (key, updater) => {
    setSelectedOptions((prev) =>
      prev.map((option) =>
        option.key === key
          ? {
              ...option,
              quantity: Math.max(1, updater(option.quantity)),
            }
          : option
      )
    );
  };

  const incrementOptionQuantity = (key) => updateOptionQuantity(key, (qty) => qty + 1);
  const decrementOptionQuantity = (key) => updateOptionQuantity(key, (qty) => qty - 1);

  const setOptionQuantity = (key, value) => {
    const num = Number(value);
    if (Number.isNaN(num) || num < 1) return;
    setSelectedOptions((prev) =>
      prev.map((option) => (option.key === key ? { ...option, quantity: num } : option))
    );
  };

  const handleRemoveSelection = (key) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((option) => option.key !== key);
      // 옵션이 없는 상품의 기본 옵션을 삭제한 경우 플래그 설정
      if (key === 'DEFAULT' && !hasColorOptions && !hasSizeOptions) {
        setUserRemovedDefaultOption(true);
      }
      return filtered;
    });
  };

  // 장바구니에 추가
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!hasSelections || selectedOptions.length === 0) {
      alert('옵션을 선택해주세요.');
      return;
    }

    try {
      setAddingToCart(true);
      const promises = selectedOptions.map((option) =>
        fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: id,
            color: option.color || '',
            size: option.size || '',
            quantity: option.quantity,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((res) => res.json()));

      // 모든 요청이 성공했는지 확인
      const allSuccess = results.every((result) => result.success);
      if (allSuccess) {
        // 중복 상품 여부 확인 (응답 메시지에 "수량이 추가되었습니다"가 포함되어 있으면 중복)
        const hasDuplicate = results.some((result) => 
          result.message && result.message.includes('수량이 추가되었습니다')
        );
        setIsDuplicateItem(hasDuplicate);
        
        // 장바구니 개수 업데이트를 위해 페이지 새로고침 또는 Navbar 업데이트
        window.dispatchEvent(new Event('cartUpdated'));
        // 모달 표시
        setIsCartModalOpen(true);
      } else {
        const errorMessages = results
          .filter((result) => !result.success)
          .map((result) => result.error)
          .join(', ');
        alert(`장바구니 추가 중 오류가 발생했습니다: ${errorMessages}`);
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니에 추가하는 중 오류가 발생했습니다.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#ff5a5a' }}>{error || '상품 정보를 찾을 수 없습니다.'}</p>
        <button
          type="button"
          onClick={handleBack}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '999px', border: '1px solid #333', background: '#fff', cursor: 'pointer' }}
        >
          이전으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto', padding: '3rem 1.5rem 5rem 1.5rem' }}>
        <div
          style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : 'minmax(400px, 1.1fr) minmax(410px, 1.0fr)',
            gap: isMobile ? '4rem' : '7rem',
            alignItems: 'start',
          }}
        >
          <ProductImage product={product} isMobile={isMobile} />

          {/* 상품 정보 패널 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              padding: isMobile ? '0 0.3rem' : 0,
            }}
          >
            <ProductHeader product={product} />

            <ProductOptions
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              availableSizesForColor={availableSizesForColor}
              hasColorOptions={hasColorOptions}
            />

            <SelectedOptions
              selectedOptions={selectedOptions}
              hasSizeOptions={hasSizeOptions}
              unitPrice={unitPrice}
              isMobile={isMobile}
              selectionReady={selectionReady}
              isDuplicateSelection={isDuplicateSelection}
              onAddSelection={handleAddSelection}
              onIncrementQuantity={incrementOptionQuantity}
              onDecrementQuantity={decrementOptionQuantity}
              onSetQuantity={setOptionQuantity}
              onRemoveSelection={handleRemoveSelection}
              totalQuantity={totalQuantity}
              totalPrice={totalPrice}
            />

            <PurchaseButtons
              hasSelections={hasSelections}
              addingToCart={addingToCart}
              onAddToCart={handleAddToCart}
              isShippingAccordionOpen={isShippingAccordionOpen}
              onToggleShippingAccordion={() => setIsShippingAccordionOpen(!isShippingAccordionOpen)}
              selectedOptions={selectedOptions}
              hasSizeOptions={hasSizeOptions}
            />
          </div>
        </div>

        <ProductTabs />
        <ProductDescription product={product} />
      </div>

      {/* 장바구니 추가 모달 */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        product={product}
        isDuplicate={isDuplicateItem}
      />
    </div>
  );
};

export default ProductDetail;
