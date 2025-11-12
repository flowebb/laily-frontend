import { useState, useEffect } from 'react';
import { MAX_WIDTH } from '../../../constants/layout';
import { useAuth } from '../../../hooks/useAuth';
import { useProductEdit } from '../../../hooks/useProductEdit';
import ProductManagement from '../ProductManagement';
import ProductBasicInfo from '../newProductRegistration/ProductBasicInfo';
import ProductVariants from '../newProductRegistration/ProductVariants';
import ProductDescription from '../newProductRegistration/ProductDescription';
import ProductDetails from '../newProductRegistration/ProductDetails/ProductDetails';
import ProductImageUpload from '../newProductRegistration/ProductImageUpload';
import ProductStatus from '../newProductRegistration/ProductStatus';
import ProductFormActions from '../newProductRegistration/ProductFormActions';

const ProductEdit = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user, loading: authLoading } = useAuth();
  
  const {
    formData,
    variants,
    newVariant,
    mainImageFile,
    submitting,
    loading: productLoading,
    handleChange,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleFileChange,
    handleSubmit
  } = useProductEdit();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (authLoading || productLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <ProductManagement activeTab="list" />

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
            상품 수정
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
                />
                <ProductImageUpload 
                  formData={formData}
                  handleChange={handleChange}
                />
                <ProductStatus 
                  formData={formData}
                  handleChange={handleChange}
                />
              </div>
            </div>

            <ProductFormActions submitting={submitting} mode="edit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;

