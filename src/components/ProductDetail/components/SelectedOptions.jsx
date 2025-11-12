import { SectionTitle } from './UIHelpers';

const SelectedOptions = ({
  selectedOptions,
  hasSizeOptions,
  unitPrice,
  isMobile,
  selectionReady,
  isDuplicateSelection,
  onAddSelection,
  onIncrementQuantity,
  onDecrementQuantity,
  onSetQuantity,
  onRemoveSelection,
  totalQuantity,
  totalPrice
}) => {
  const hasSelections = selectedOptions.length > 0;

  return (
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
            onClick={onAddSelection}
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
                      onClick={() => onDecrementQuantity(option.key)}
                      style={{ padding: '0.55rem 0.95rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={option.quantity}
                      onChange={(e) => onSetQuantity(option.key, e.target.value)}
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
                      onClick={() => onIncrementQuantity(option.key)}
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
                  onClick={() => onRemoveSelection(option.key)}
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
  );
};

export default SelectedOptions;

