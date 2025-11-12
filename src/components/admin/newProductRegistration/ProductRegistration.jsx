import { useState, useEffect } from 'react';
import { MAX_WIDTH } from '../../../constants/layout';
import { useAuth } from '../../../hooks/useAuth';
import { useProductForm } from '../../../hooks/useProductForm';
import ProductManagement from '../ProductManagement';
import ProductBasicInfo from './ProductBasicInfo';
import ProductVariants from './ProductVariants';
import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails/ProductDetails';
import ProductImageUpload from './ProductImageUpload';
import ProductStatus from './ProductStatus';
import ProductFormActions from './ProductFormActions';

const ProductRegistration = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, loading } = useAuth();
  
  const {
    formData,
    variants,
    newVariant,
    mainImageFile,
    submitting,
    errors,
    handleChange,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleFileChange,
    handleSubmit
  } = useProductForm();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <ProductManagement activeTab="register" />

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
                <ProductBasicInfo 
                  formData={formData} 
                  handleChange={handleChange} 
                  isMobile={isMobile}
                  errors={errors}
                />
                <ProductVariants 
                  variants={variants}
                  newVariant={newVariant}
                  handleVariantChange={handleVariantChange}
                  addVariant={addVariant}
                  removeVariant={removeVariant}
                  isMobile={isMobile}
                  baseSku={formData.sku}
                />
              </div>

              {/* Right Column */}
              <div>
                <ProductDescription 
                  formData={formData}
                  handleChange={handleChange}
                />
                <ProductDetails 
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
                <ProductImageUpload 
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
                <ProductStatus 
                  formData={formData}
                  handleChange={handleChange}
                />
              </div>
            </div>

            <ProductFormActions submitting={submitting} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistration;

