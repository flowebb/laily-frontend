const ShippingAccordion = ({ 
  isOpen, 
  onToggle, 
  selectedOptions, 
  hasSizeOptions 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button
        type="button"
        onClick={onToggle}
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
          transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' 
        }}>
          ▲
        </span>
      </button>
      {isOpen && (
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
  );
};

export default ShippingAccordion;

