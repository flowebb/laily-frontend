const SignupForm = ({ formData, agreements, error, loading, handleChange, handleSubmit, handleViewContent }) => {
  return (
    <>
      <h1 style={{ marginTop: 0, marginBottom: '2rem', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
        회원정보 입력
      </h1>

      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}
          >
            * 이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}
          >
            * 이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}
          >
            * 비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
            (영문 대소문자/숫자/특수문자를 혼용하여 2종류 10~16자 또는 3종류 8~16자)
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="passwordConfirm"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}
          >
            * 비밀번호 확인
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 만 14세 이상 체크박스 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left' }}>
            <input
              type="checkbox"
              name="age14"
              checked={agreements.age14}
              onChange={handleChange}
              style={{ marginRight: '0.5rem', marginTop: '0.2rem' }}
            />
            <div>
              <span style={{ fontSize: '0.9rem' }}>만 14세 이상입니다. (필수)</span>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666', lineHeight: '1.5', textAlign: 'left' }}>
                14세 미만 아동의 경우 법정대리인 동의가 필요하며, 고객센터로 문의해주시기 바랍니다. 최소한의 정보만 수집하여 회원가입을 간편하게 진행할 수 있도록 하고 있습니다.
              </p>
            </div>
          </label>
        </div>

        {/* 전체동의 체크박스 */}
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="agreeAll"
              checked={agreements.agreeAll}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>전체동의</span>
          </label>
        </div>

        {/* 이용약관 체크박스 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
            <input
              type="checkbox"
              name="terms"
              checked={agreements.terms}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            <span style={{ fontSize: '0.9rem', marginRight: '0.5rem' }}>[필수] 이용약관</span>
            <button
              type="button"
              onClick={() => handleViewContent('이용약관')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              내용보기
            </button>
          </label>
        </div>

        {/* 개인정보 수집 및 이용 안내 체크박스 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="privacy"
              checked={agreements.privacy}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            <span style={{ fontSize: '0.9rem', marginRight: '0.5rem' }}>[필수] 개인정보 수집 및 이용 안내</span>
            <button
              type="button"
              onClick={() => handleViewContent('개인정보 수집 및 이용 안내')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              내용보기
            </button>
          </label>
        </div>

        {/* 마케팅 수신동의 체크박스 */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="marketing"
              checked={agreements.marketing}
              onChange={handleChange}
              style={{ marginRight: '0.5rem', marginTop: '0.2rem' }}
            />
            <div style={{ width: '100%' }}>
              <span style={{ fontSize: '0.9rem', display: 'block', textAlign: 'left' }}>[선택] 마케팅 수신동의 (이메일 SMS, 카카오톡 등 앱Push알림)</span>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666', lineHeight: '1.5', textAlign: 'left' }}>
                회사의 서비스 정보, 홍보(마케팅 활동), 쿠프등의 이벤트 행사 및 프로모션 정보를 보내드립니다. 동의를 거부하더라도 서비스 이용은 가능하나, 동의하지 않는 경우 마케팅 활용과 관련된 혜택의 제한이 있을 수 있습니다. 마케팅 수집동의를 해주셔야 경품당첨과 쿠폰 지급시 안내메세지가 발송됩니다. 단, 상품 구매 정보는 수신, 이용 동의 여부와 관계없이 발송됩니다.
              </p>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '가입 중...' : '회원 가입하기'}
        </button>
      </form>
    </>
  );
};

export default SignupForm;

