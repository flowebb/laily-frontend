// React 훅과 라우터 유틸리티
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 레이아웃 및 공유 컴포넌트
import Navbar from './Navbar';
import { MAX_WIDTH } from '../constants/layout';

// 가격 정보를 계산하는 헬퍼 함수 (정가, 할인 등)
const getPriceInfo = (product) => {
  if (!product?.price) {
    return {
      original: 0,
      discounted: null,
      discountAmount: 0,
      percentage: 0,
      finalPrice: 0,
      hasDiscount: false,
    };
  }

  const original = product.price.originalPrice || 0;
  const discounted = product.price.discountedPrice || null;
  const explicitPercentage = product.price.discountPercentage;
  const discountAmount = discounted ? Math.max(original - discounted, 0) : 0;
  const percentage = discounted
    ? explicitPercentage !== undefined
      ? explicitPercentage
      : original > 0
        ? Math.round((discountAmount / original) * 100)
        : 0
    : 0;

  return {
    original,
    discounted,
    discountAmount,
    percentage,
    finalPrice: discounted || original,
    hasDiscount: Boolean(discounted && original),
  };
};

// UI 헬퍼: 섹션 타이틀
const SectionTitle = ({ children }) => (
  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', color: '#444' }}>{children}</h4>
);

// UI 헬퍼: 상세/가이드/리뷰 탭 버튼
const TabButton = ({ active, label }) => (
  <button
    type="button"
    style={{
      flex: 1,
      padding: '1rem 0',
      border: 'none',
      borderBottom: active ? '2px solid #000' : '1px solid #e5e5e5',
      backgroundColor: 'transparent',
      fontSize: '0.95rem',
      fontWeight: active ? 600 : 400,
      letterSpacing: '0.05em',
      color: active ? '#000' : '#999',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

// UI 헬퍼: 상품 속성을 표시하는 행
const InfoRow = ({ label, children, alignTop, minHeight }) => (
  <div
    style={{
      display: 'flex',
      gap: '1.8rem',
      alignItems: alignTop ? 'flex-start' : 'center',
      padding: '0.6rem 0',
      borderBottom: '1px solid #f3f3f3',
      minHeight: minHeight || 'auto',
    }}
  >
    <span style={{ 
      width: '80px', 
      fontSize: '0.85rem', 
      color: '#9a9a9a', 
      letterSpacing: '0.08em',
      alignSelf: 'center',
    }}>{label}</span>
    <div style={{ flex: 1, fontSize: '0.95rem', color: '#3f3f3f', lineHeight: 1.6 }}>{children}</div>
  </div>
);

// UI 헬퍼: 색상/사이즈 선택용 칩
const OptionChip = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: '80px',
      height: '38px',
      padding: '0',
      borderRadius: '5px',
      border: active ? '2px solid #111' : '1px solid #d7d7d7',
      backgroundColor: active ? '#fff' : '#fff',
      color: active ? '#111' : '#555',
      fontSize: '0.9rem',
      letterSpacing: '0.04em',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {label}
  </button>
);

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
        setSelectedColor(data.product.availableColors?.[0] || '');
        setSelectedSize(data.product.availableSizes?.[0] || '');
        setSelectedOptions([]);
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

  const statuses = product?.status || [];
  const hasColorOptions = (product?.availableColors?.length || 0) > 0;
  const hasSizeOptions = (product?.availableSizes?.length || 0) > 0;
  const selectionKey = `${hasColorOptions ? selectedColor || 'NONE' : 'NO_COLOR'}|${
    hasSizeOptions ? selectedSize || 'NONE' : 'NO_SIZE'
  }`;
  const selectionReady = (!hasColorOptions || selectedColor) && (!hasSizeOptions || selectedSize);
  const isDuplicateSelection = selectedOptions.some((option) => option.key === selectionKey);
  const hasSelections = selectedOptions.length > 0;

  // 옵션이 없는 상품은 기본 항목을 자동으로 추가
  useEffect(() => {
    if (!product) return;
    if (!hasColorOptions && !hasSizeOptions && selectedOptions.length === 0) {
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
  }, [product, hasColorOptions, hasSizeOptions, selectedOptions.length, unitPrice]);

  // 선택된 옵션 배열에 새 항목 추가
  const handleAddSelection = () => {
    if (!selectionReady || isDuplicateSelection) {
      return;
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
    setSelectedOptions((prev) => prev.filter((option) => option.key !== key));
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
          <div
            style={{
              width: '100%',
              backgroundColor: '#f9f7f5',
              borderRadius: '0px',
              overflow: 'hidden',
              border: '1px solid #f0ece8',
              boxShadow: '0 6px 14px rgba(0,0,0,0.04)',
              height: '80vh',
              maxHeight: isMobile ? '80vh' : '80vh',
            }}
          >
            <img
              src={product.image || 'https://via.placeholder.com/700x840?text=No+Image'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* 상품 정보 패널 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              padding: isMobile ? '0 0.3rem' : 0,
            }}
          >
            {/* 상단 메타 정보: 뱃지, 상품명, 요약 설명, 가격 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* 뱃지 영역: 상품 상태 뱃지와 SKU 표시 */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {/* 상품 상태 뱃지 (NEW, SALE 등) */}
                {statuses.map((status) => (
                  <span
                    key={status}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      backgroundColor: '#000',
                      color: '#fff',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {status}
                  </span>
                ))}
              </div>
              {/* 상품명 */}
              <h1 style={{ fontSize: '2.0rem', lineHeight: 1.25, margin: 0, color: '#222', fontWeight: 600 }}>{product.name}</h1>
              {/* 요약 설명 */}
              <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.7 }}>{product.description || '상품에 대한 설명이 준비 중입니다.'}</p>

              {/* 가격 정보 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
                {/* 정가 (할인이 있는 경우에만 표시) */}
                {priceInfo.hasDiscount && (
                  <div style={{ fontSize: '1.2rem', color: '#a8a8a8', textDecoration: 'line-through' }}>
                    ₩{priceInfo.original.toLocaleString()}<span style={{ marginLeft: '0.35rem' }}>정가</span>
                  </div>
                )}
                {/* 최종 가격 및 할인 정보 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {/* 최종 판매 가격 */}
                  <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#222' }}>
                    ₩{(priceInfo.finalPrice || 0).toLocaleString()}
                  </span>
                  {/* 할인율 및 할인 금액 (할인이 있는 경우에만 표시) */}
                  {priceInfo.hasDiscount && (
                    <span style={{ fontSize: '1.2rem', color: '#d25c53', fontWeight: 600 }}>
                      {priceInfo.percentage}% ({priceInfo.discountAmount.toLocaleString()}원 할인)
                    </span>
                  )}
                </div>
                {/* 할인 기간 안내 (할인이 있는 경우에만 표시) */}
                {priceInfo.hasDiscount && (
                  <div style={{ fontSize: '0.9rem', color: '#c57e61', letterSpacing: '0.02em' }}>
                    할인기간 안내: 구매 시점 기준 할인 혜택이 적용됩니다.
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f3f3f3', borderBottom: '1px solid #f3f3f3' }}>
              <InfoRow label="배송">
                <span style={{ color: '#555', cursor: 'pointer', textDecoration: 'underline' }}>
                  자세한 배송정보는 여기를 클릭해 주세요.
                </span>
              </InfoRow>
              <InfoRow label="컬러" alignTop minHeight="39px">
                {product.availableColors?.length ? (
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {product.availableColors.map((color) => (
                      <OptionChip
                        key={color}
                        label={color}
                        active={selectedColor === color}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#aaa' }}>옵션 준비 중</span>
                )}
              </InfoRow>
              <InfoRow label="사이즈" alignTop minHeight="39px">
                {product.availableSizes?.length ? (
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {product.availableSizes.map((size) => (
                      <OptionChip
                        key={size}
                        label={size}
                        active={selectedSize === size}
                        onClick={() => setSelectedSize(size)}
                      />
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#aaa' }}>ONE SIZE</span>
                )}
              </InfoRow>
            </div>

            {/* 선택한 옵션 목록과 총 금액 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <SectionTitle>선택한 옵션</SectionTitle>
                {selectionReady && (
                  <button
                    type="button"
                    onClick={handleAddSelection}
                    disabled={isDuplicateSelection}
                    style={{
                      padding: '0.55rem 1.4rem',
                      borderRadius: '5px',
                      border: '1px solid #cfc6bf',
                      backgroundColor: '#fff',
                      color: '#7a6a5f',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      cursor: isDuplicateSelection ? 'not-allowed' : 'pointer',
                      opacity: isDuplicateSelection ? 0.5 : 1,
                    }}
                  >
                    옵션 추가
                  </button>
                )}
              </div>

              {hasSelections ? (
                <div style={{ border: '1px solid #eee4db', borderRadius: '12px', overflow: 'hidden' }}>
                  {selectedOptions.map((option, index) => {
                    const labelParts = [];
                    if (option.color) labelParts.push(option.color);
                    if (!hasSizeOptions) labelParts.push('FREE');
                    else if (option.size) labelParts.push(option.size);
                    if (labelParts.length === 0) labelParts.push('기본 옵션');
                    const optionLabel = labelParts.join(' / ');
                    const optionUnitPrice = option.unitPrice ?? unitPrice;

                    return (
                      <div
                        key={option.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.25rem',
                          padding: '0.9rem 1.2rem',
                          borderBottom: index === selectedOptions.length - 1 ? 'none' : '1px solid #f1ece6',
                          flexWrap: isMobile ? 'wrap' : 'nowrap',
                        }}
                      >
                        <div style={{ flex: isMobile ? '1 1 100%' : '1 1 auto', color: '#413a36', fontSize: '0.95rem', fontWeight: 500 }}>
                          {optionLabel}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '999px', overflow: 'hidden' }}>
                            <button
                              type="button"
                              onClick={() => decrementOptionQuantity(option.key)}
                              style={{ padding: '0.55rem 0.95rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={option.quantity}
                              onChange={(e) => setOptionQuantity(option.key, e.target.value)}
                              style={{
                                width: '54px',
                                textAlign: 'center',
                                border: 'none',
                                outline: 'none',
                                fontSize: '0.95rem',
                                padding: '0.55rem 0',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => incrementOptionQuantity(option.key)}
                              style={{ padding: '0.55rem 0.95rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '1rem', color: '#2d2926', fontWeight: 600 }}>
                          ₩{(optionUnitPrice * option.quantity).toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelection(option.key)}
                          style={{ border: 'none', background: 'transparent', color: '#c7b8ad', fontSize: '1.2rem', cursor: 'pointer' }}
                          aria-label="옵션 삭제"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {hasSelections && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0.25rem',
                    color: '#4a403a',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <span>총 상품금액</span>
                  <span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 700 }}>₩{totalPrice.toLocaleString()}</span>
                    <span style={{ fontSize: '0.95rem', color: '#8a7e76', marginLeft: '0.35rem' }}>({totalQuantity}개)</span>
                  </span>
                </div>
              )}
            </div>

            {/* 구매 관련 버튼 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* 실시간 당일발송 확인 아코디언 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={() => setIsShippingAccordionOpen(!isShippingAccordionOpen)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'gray',
                    color: '#fff',
                    fontSize: '0.95rem',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <span>실시간 당일발송 확인</span>
                  <span style={{ 
                    position: 'absolute',
                    right: '1rem',
                    fontSize: '0.7rem', 
                    transition: 'transform 0.3s ease', 
                    transform: isShippingAccordionOpen ? 'rotate(0deg)' : 'rotate(180deg)' 
                  }}>
                    ▲
                  </span>
                </button>
                {isShippingAccordionOpen && (
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e8e0d8',
                      borderTop: 'none',
                      borderRadius: '0 0 6px 6px',
                      padding: '1.5rem',
                      marginTop: '-6px',
                    }}
                  >
                    {/* 상품 옵션명 및 발송 상태 테이블 */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          borderBottom: '1px solid #ddd',
                          paddingBottom: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>상품 옵션명</div>
                        <div style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>발송 상태</div>
                      </div>
                      {selectedOptions.length > 0 ? (
                        selectedOptions.map((option) => {
                          const labelParts = [];
                          if (option.color) labelParts.push(`[${option.color}]`);
                          if (!hasSizeOptions && option.size === '') labelParts.push('FREE');
                          else if (option.size) labelParts.push(option.size);
                          if (labelParts.length === 0) labelParts.push('기본 옵션');
                          const optionLabel = labelParts.join(' ');

                          return (
                            <div
                              key={option.key}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid #eee',
                                backgroundColor: '#fafafa',
                              }}
                            >
                              <div style={{ color: '#555', fontSize: '0.9rem' }}>{optionLabel}</div>
                              <div style={{ color: '#555', fontSize: '0.9rem' }}>제작배송</div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid #eee',
                            backgroundColor: '#fafafa',
                          }}
                        >
                          <div style={{ color: '#999', fontSize: '0.9rem' }}>선택된 옵션이 없습니다.</div>
                          <div style={{ color: '#999', fontSize: '0.9rem' }}>-</div>
                        </div>
                      )}
                    </div>

                    {/* 상세 배송 정보 */}
                    <div style={{ fontSize: '0.80rem', lineHeight: 1.8, color: '#444' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#222', marginBottom: '0.5rem' }}>당일출발/오늘드림:</div>
                        <div style={{ paddingLeft: '1rem', color: '#666' }}>
                          <div>• <strong>당일출발 :</strong> 13시 이전 주문시 당일출고됩니다. -전지역</div>
                          <div>• <strong>오늘드림 :</strong> 13시 이전 주문 시 당일 도착합니다. -서울 전 지역/경기, 인천 일부지역</div>
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.3rem', display: 'flex', gap: '0.3rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, color: '#222' }}>일반배송 :</div>
                        <div style={{ color: '#666', flex: 1 }}> 결제완료 후 2-4일 가량이 소요됩니다.</div>
                      </div>
                      <div style={{ marginBottom: '0.3rem', display: 'flex', gap: '0.3rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, color: '#222' }}>제작배송 :</div>
                        <div style={{ color: '#666', flex: 1 }}> 제작중으로 4-15일 가량이 소요됩니다.</div>
                      </div>
                      <div style={{ marginBottom: '0.3rem', display: 'flex', gap: '0.3rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, color: '#222' }}>일시품절 :</div>
                        <div style={{ color: '#666', flex: 1 }}>재고가 소진되어 리오더 중으로 빠르게 재입고하도록 노력하겠습니다.</div>
                      </div>
                      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.3rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, color: '#222' }}>품절 :</div>
                        <div style={{ color: '#666', flex: 1 }}>제작처 품절로 인해 재입고가 어려운 상품입니다.</div>
                      </div>
                      <div style={{ marginBottom: '0.2rem', color: '#666' }}>
                      빠른발송이 아닌 상품과 함께 구매하신 경우 일반배송/제작배송 출고일자에 맞춰 출고됩니다.(영업일 기준)
                      </div>
                      <div style={{ marginBottom: '0.2rem', color: '#666' }}>
                      재고가 빠르게 소진될 시 위 재고 표의 출고 일정과 차이가 있을 수 있습니다.
                      </div>
                      <div style={{ marginBottom: '0.2rem', color: '#666' }}>
                      오늘드림 서비스는 자사몰에서만 해당됩니다.
                      </div>
                      <div style={{ color: '#666' }}>
                      문의사항은 고객센터 및 실시간 문의로 부탁드립니다.
                      </div>
                    </div>

                    {/* 하단 푸터 */}
                    <div style={{ textAlign: 'right', marginTop: '1.5rem', fontSize: '0.75rem', color: '#999' }}>
                      SNAP COMPANY
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={!hasSelections}
                style={{
                  width: '100%',
                  padding: '1.1rem 0',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#A48167',
                  color: '#fff',
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  cursor: hasSelections ? 'pointer' : 'not-allowed',
                  opacity: hasSelections ? 1 : 0.5,
                }}
              >
                BUY NOW
              </button>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  disabled={!hasSelections}
                  style={{
                    flex: 1,
                    padding: '1.05rem 0',
                    borderRadius: '10px',
                    border: '1px solid #1f1f1f',
                    backgroundColor: '#fff',
                    color: '#1f1f1f',
                    fontSize: '1.05rem',
                    cursor: hasSelections ? 'pointer' : 'not-allowed',
                    opacity: hasSelections ? 1 : 0.5,
                  }}
                >
                  CART
                </button>
                <button
                  type="button"
                  disabled={!hasSelections}
                  style={{
                    flex: 1,
                    padding: '1.05rem 0',
                    borderRadius: '10px',
                    border: '1px solid #1f1f1f',
                    backgroundColor: '#fff',
                    color: '#1f1f1f',
                    fontSize: '1.05rem',
                    cursor: hasSelections ? 'pointer' : 'not-allowed',
                    opacity: hasSelections ? 1 : 0.5,
                  }}
                >
                  WISH LIST
                </button>
              </div>
            </div>

         
          </div>
        </div>

        {/* 상단 탭 네비게이션 */}
        <div
          style={{
            marginTop: '4rem',
            borderTop: '1px solid #e5e5e5',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
          }}
        >
          <TabButton active label="DETAIL" />
          <TabButton label="GUIDE" />
          <TabButton label="REVIEW" />
          <TabButton label="Q&A" />
        </div>

        {/* 상세 설명 영역 */}
        <div style={{ padding: '3rem 1rem', color: '#444', lineHeight: 1.8 }}>
          {product.detailPage ? (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}
              dangerouslySetInnerHTML={{ __html: product.detailPage }}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>상세 설명이 준비 중입니다.</p>
          )}
        </div>

        {/* GUIDE/REVIEW/Q&A 안내 문구 */}
        <div style={{ padding: '0 1rem 3rem 1rem', display: 'grid', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>GUIDE</h3>
            <p style={{ color: '#777', fontSize: '0.95rem' }}>
              배송, 교환 및 반품 안내는 추후 업데이트될 예정입니다. 고객센터로 문의해 주세요.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>REVIEW</h3>
            <p style={{ color: '#777', fontSize: '0.95rem' }}>
              아직 등록된 리뷰가 없습니다. 첫 번째 후기를 남겨주세요!
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Q&A</h3>
            <p style={{ color: '#777', fontSize: '0.95rem' }}>
              상품에 대해 궁금한 점이 있다면 Q&A 게시판을 통해 남겨주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
