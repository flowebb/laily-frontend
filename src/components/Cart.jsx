// Cart.jsx
// 장바구니 페이지 메인 컴포넌트
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { MAX_WIDTH } from '../constants/layout';
import CartHeader from './cart/CartHeader';
import CartTableHeader from './cart/CartTableHeader';
import CartItem from './cart/CartItem';
import CartPolicy from './cart/CartPolicy';
import CartSummary from './cart/CartSummary';
import CartActions from './cart/CartActions';
import CartEmpty from './cart/CartEmpty';

const Cart = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 장바구니 데이터 가져오기
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCartItems(data.cart || []);
            // 모든 아이템 선택
            const allIds = new Set((data.cart || []).map(item => item._id));
            setSelectedItems(allIds);
          }
        }
      } catch (error) {
        console.error('장바구니 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    // 장바구니 업데이트 이벤트 리스너
    const handleCartUpdated = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  // 수량 업데이트
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 장바구니 다시 가져오기
          const cartResponse = await fetch('http://localhost:5000/api/cart', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            if (cartData.success) {
              setCartItems(cartData.cart || []);
              window.dispatchEvent(new Event('cartUpdated'));
            }
          }
        }
      }
    } catch (error) {
      console.error('수량 업데이트 실패:', error);
      alert('수량 업데이트 중 오류가 발생했습니다.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // 아이템 삭제
  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems(prev => prev.filter(item => item._id !== itemId));
          setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    } catch (error) {
      console.error('아이템 삭제 실패:', error);
      alert('아이템 삭제 중 오류가 발생했습니다.');
    }
  };

  // 전체 선택/해제
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(cartItems.map(item => item._id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  // 개별 선택/해제
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  // 선택된 아이템 삭제
  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedItems.size}개의 상품을 삭제하시겠습니까?`)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const promises = Array.from(selectedItems).map(itemId =>
        fetch(`http://localhost:5000/api/cart/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      );

      await Promise.all(promises);
      setCartItems(prev => prev.filter(item => !selectedItems.has(item._id)));
      setSelectedItems(new Set());
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('선택 아이템 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 장바구니 비우기
  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    if (!confirm('장바구니를 모두 비우시겠습니까?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems([]);
          setSelectedItems(new Set());
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    } catch (error) {
      console.error('장바구니 비우기 실패:', error);
      alert('장바구니 비우기 중 오류가 발생했습니다.');
    }
  };

  // 옵션 변경
  const handleOptionChange = async (itemId, newOptions) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // 현재 아이템 찾기
    const currentItem = cartItems.find(item => item._id === itemId);
    if (!currentItem) return;

    const productId = currentItem.productId._id || currentItem.productId;
    const currentQuantity = currentItem.quantity;

    try {
      // 기존 아이템 삭제
      const deleteResponse = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        throw new Error('기존 아이템 삭제 실패');
      }

      // 새로운 옵션으로 아이템 추가
      const addResponse = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          color: newOptions.color || '',
          size: newOptions.size || '',
          quantity: currentQuantity,
        }),
      });

      if (addResponse.ok) {
        const data = await addResponse.json();
        if (data.success) {
          // 장바구니 다시 가져오기
          const cartResponse = await fetch('http://localhost:5000/api/cart', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            if (cartData.success) {
              setCartItems(cartData.cart || []);
              // 선택 상태 유지 (새 아이템 ID로 업데이트)
              const newItemId = data.cartItem?._id;
              if (newItemId) {
                setSelectedItems(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(itemId);
                  newSet.add(newItemId);
                  return newSet;
                });
              } else {
                setSelectedItems(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(itemId);
                  return newSet;
                });
              }
              window.dispatchEvent(new Event('cartUpdated'));
              alert('옵션이 변경되었습니다.');
            }
          }
        } else {
          throw new Error(data.error || '옵션 변경 실패');
        }
      } else {
        const errorData = await addResponse.json();
        throw new Error(errorData.error || '옵션 변경 실패');
      }
    } catch (error) {
      console.error('옵션 변경 실패:', error);
      alert(error.message || '옵션 변경 중 오류가 발생했습니다.');
      // 실패 시 장바구니 다시 가져오기
      const cartResponse = await fetch('http://localhost:5000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        if (cartData.success) {
          setCartItems(cartData.cart || []);
        }
      }
    }
  };

  // 선택된 아이템들의 총 금액 계산
  const selectedItemsList = cartItems.filter(item => selectedItems.has(item._id));
  const totalAmount = selectedItemsList.reduce((sum, item) => sum + item.totalPrice, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Navbar />
        <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <p>장바구니를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto', padding: isMobile ? '2rem 1rem' : '4rem 2rem' }}>
        <CartHeader isMobile={isMobile} />

        {cartItems.length === 0 ? (
          <CartEmpty isMobile={isMobile} />
        ) : (
          <>
            <CartTableHeader
              isMobile={isMobile}
              onSelectAll={handleSelectAll}
              allSelected={selectedItems.size === cartItems.length && cartItems.length > 0}
            />

            {/* 상품 목록 */}
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                isMobile={isMobile}
                isSelected={selectedItems.has(item._id)}
                onSelect={handleSelectItem}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                onOptionChange={(newOptions) => handleOptionChange(item._id, newOptions)}
                isUpdating={updatingItems.has(item._id)}
              />
            ))}

            <CartPolicy isMobile={isMobile} />
            <CartSummary totalAmount={totalAmount} isMobile={isMobile} />
            <CartActions
              selectedCount={selectedItems.size}
              onRemoveSelected={handleRemoveSelected}
              onClearCart={handleClearCart}
              isMobile={isMobile}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
