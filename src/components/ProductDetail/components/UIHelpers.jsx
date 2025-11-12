// UI 헬퍼 컴포넌트들

// 섹션 타이틀
export const SectionTitle = ({ children }) => (
  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem', color: '#444' }}>{children}</h4>
);

// 상세/가이드/리뷰 탭 버튼
export const TabButton = ({ active, label }) => (
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

// 상품 속성을 표시하는 행
export const InfoRow = ({ label, children, alignTop, minHeight }) => (
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

// 색상/사이즈 선택용 칩
export const OptionChip = ({ active, label, onClick }) => (
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

