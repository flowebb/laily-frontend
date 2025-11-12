// 가격 정보를 계산하는 헬퍼 함수 (정가, 할인 등)
export const getPriceInfo = (product) => {
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

