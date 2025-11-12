import ShippingAccordion from './ShippingAccordion';

const PurchaseButtons = ({
  hasSelections,
  addingToCart,
  onAddToCart,
  isShippingAccordionOpen,
  onToggleShippingAccordion,
  selectedOptions,
  hasSizeOptions
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {/* 실시간 당일발송 확인 아코디언 */}
      <ShippingAccordion
        isOpen={isShippingAccordionOpen}
        onToggle={onToggleShippingAccordion}
        selectedOptions={selectedOptions}
        hasSizeOptions={hasSizeOptions}
      />
      
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
          onClick={onAddToCart}
          disabled={!hasSelections || addingToCart}
          style={{
            flex: 1,
            padding: '1.05rem 0',
            borderRadius: '10px',
            border: '1px solid #1f1f1f',
            backgroundColor: '#fff',
            color: '#1f1f1f',
            fontSize: '1.05rem',
            cursor: hasSelections && !addingToCart ? 'pointer' : 'not-allowed',
            opacity: hasSelections && !addingToCart ? 1 : 0.5,
          }}
        >
          {addingToCart ? '추가 중...' : 'CART'}
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
  );
};

export default PurchaseButtons;

