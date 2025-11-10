// PromoBar.jsx
// 상단 홍보바를 렌더링하고 서버에서 문구를 가져오는 컴포넌트
// 여러 문구가 자동으로 순환하며 표시됩니다
import { useState, useEffect, useRef } from 'react';

const PromoBar = () => {
  const [promoText, setPromoText] = useState('10년의 감사, 단 10일간의 특별한 혜택');
  const [isActive, setIsActive] = useState(true);
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const loading = useRef(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPromoBar = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings/promo-bar');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            const { isActive: activeFlag, messages: storedMessages = [], currentValue, value } = data.settings;
            setIsActive(activeFlag !== false);
            
            // 활성화된 메시지만 필터링
            const activeMessages = storedMessages.filter((msg) => msg.isActive && msg.text && msg.text.trim());
            const fallbackText = currentValue || value ;
            
            if (activeMessages.length > 0) {
              setMessages(activeMessages);
              setCurrentIndex(0);
              setPromoText(activeMessages[0].text);
            } else {
              // 활성화된 메시지가 없으면 기본값 사용
              setMessages([{ text: fallbackText, isActive: true }]);
              setCurrentIndex(0);
              setPromoText(fallbackText);
            }
          }
        }
      } catch (error) {
        console.error('홍보바 설정 가져오기 오류:', error);
      } finally {
        loading.current = false;
      }
    };

    fetchPromoBar();
  }, []);

  // 자동 순환 로직
  useEffect(() => {
    if (!isActive || messages.length <= 1) {
      // 메시지가 1개 이하면 순환 불필요
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 3초마다 다음 메시지로 변경
    intervalRef.current = setInterval(() => {
      setFade(false); // 페이드 아웃
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % messages.length;
          setPromoText(messages[nextIndex].text);
          return nextIndex;
        });
        setFade(true); // 페이드 인
      }, 300); // 페이드 아웃 시간
    }, 3000); // 3초마다 변경

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [messages, isActive]);

  if (loading.current || !isActive) {
    return null;
  }

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#8B7355',
        color: '#fff',
        textAlign: 'center',
        padding: '0.75rem 1rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        letterSpacing: '0.05em',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {promoText}
      </div>
    </div>
  );
};

export default PromoBar;

