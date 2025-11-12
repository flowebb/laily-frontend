import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_WIDTH } from '../../../constants/layout';
import ProductManagement from '../ProductManagement';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 전체 상품 목록 (카테고리별 개수 계산용)
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL', 'OUTER', 'TOP', 'BOTTOM', 'DRESS', 'ACC'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const categories = [
    { value: 'ALL', label: '전체' },
    { value: 'OUTER', label: 'OUTER' },
    { value: 'TOP', label: 'TOP' },
    { value: 'BOTTOM', label: 'BOTTOM' },
    { value: 'DRESS', label: 'DRESS' },
    { value: 'ACC', label: 'ACC' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 전체 상품 목록 가져오기 (카테고리별 개수 계산용)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();

        if (response.ok) {
          setAllProducts(data.products || []);
        }
      } catch (error) {
        console.error('전체 상품 목록 가져오기 중 오류:', error);
      }
    };

    fetchAllProducts();
  }, []);

  // 선택된 카테고리에 따라 상품 필터링
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = selectedCategory === 'ALL' 
          ? 'http://localhost:5000/api/products'
          : `http://localhost:5000/api/products?category=${selectedCategory}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
          // 카테고리 변경 시 첫 페이지로 리셋
          setCurrentPage(1);
        } else {
          console.error('상품 목록 가져오기 실패:', data.error);
        }
      } catch (error) {
        console.error('상품 목록 가져오기 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 카테고리별 상품 개수 계산
  const getCategoryCount = (category) => {
    if (category === 'ALL') {
      return allProducts.length;
    }
    return allProducts.filter(p => p.category === category).length;
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('정말 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('상품이 삭제되었습니다.');
        const deletedProduct = products.find(p => p._id === productId);
        setProducts(products.filter(p => p._id !== productId));
        // 전체 상품 목록에서도 삭제
        setAllProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        const data = await response.json();
        alert(data.error || '상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 삭제 중 오류:', error);
      alert('상품 삭제 중 오류가 발생했습니다.');
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
            상품 목록
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
            {selectedCategory === 'ALL' 
              ? `총 ${products.length}개의 상품이 등록되어 있습니다. (${startIndex + 1}-${Math.min(endIndex, products.length)} / ${products.length})`
              : `${categories.find(c => c.value === selectedCategory)?.label} 카테고리: ${products.length}개 (${startIndex + 1}-${Math.min(endIndex, products.length)} / ${products.length})`}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          style={{
            backgroundColor: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              overflowX: 'auto',
            }}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category.value;
              const count = getCategoryCount(category.value);
              
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  style={{
                    padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                    backgroundColor: isActive ? '#333' : '#f0f0f0',
                    color: isActive ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: isActive ? '600' : '500',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{category.label}</span>
                  <span
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : '#ccc',
                      color: isActive ? 'white' : '#666',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Table */}
        <div
          style={{
            backgroundColor: 'white',
            padding: isMobile ? '1.8rem' : '2.4rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
                등록된 상품이 없습니다.
              </p>
              <button
                onClick={() => navigate('/admin/products/new')}
                style={{
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                새 상품 등록하기
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      이미지
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      상품명
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      카테고리
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      가격
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      재고
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      상태
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => {
                    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
                    const statusLabels = {
                      'IN_STOCK': '판매중',
                      'OUT_OF_STOCK': '품절',
                      'COMING_SOON': '출시예정',
                      'DISCONTINUED': '판매중단'
                    };
                    const statusDisplay = product.status?.map(s => statusLabels[s] || s).join(', ') || '미설정';

                    return (
                      <tr key={product._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '1rem' }}>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              onClick={() => navigate(`/products/${product._id}`)}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <div
                              onClick={() => navigate(`/products/${product._id}`)}
                              style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                              }}
                            >
                              이미지 없음
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>
                              {product.name}
                            </p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#999' }}>
                              SKU: {product.sku}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                          {product.category || '-'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            {product.price?.discountedPrice ? (
                              <>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', textDecoration: 'line-through' }}>
                                  ₩{product.price.originalPrice?.toLocaleString()}
                                </p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>
                                  ₩{product.price.discountedPrice.toLocaleString()}
                                </p>
                              </>
                            ) : (
                              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>
                                ₩{product.price?.originalPrice?.toLocaleString() || '-'}
                              </p>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                          {totalStock}개
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              backgroundColor: '#e8f5e9',
                              color: '#2e7d32',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                            }}
                          >
                            {statusDisplay}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                              style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                              }}
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {products.length > itemsPerPage && (
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              {/* 이전 페이지 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: currentPage === 1 ? '#f0f0f0' : '#333',
                  color: currentPage === 1 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                이전
              </button>

              {/* 페이지 번호 버튼 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // 현재 페이지 주변 2개씩만 표시 (현재 페이지 포함 앞뒤 각 1개)
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!showPage) {
                  // 생략 표시
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} style={{ padding: '0.5rem', color: '#666' }}>
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: currentPage === page ? '#333' : 'white',
                      color: currentPage === page ? 'white' : '#333',
                      border: currentPage === page ? 'none' : '1px solid #e0e0e0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: currentPage === page ? '600' : '500',
                      minWidth: '40px',
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              {/* 다음 페이지 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#333',
                  color: currentPage === totalPages ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

