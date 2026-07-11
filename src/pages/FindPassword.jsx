import { useState } from 'react';
import styles from './Login.module.css'; // 기존 로그인 CSS를 재사용합니다.

function FindPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('비밀번호 찾기 요청 이메일:', email);
    // TODO: API로 이메일 전송하여 비밀번호 재설정 링크 발송하기
    alert('입력하신 이메일로 비밀번호 재설정 링크가 발송되었습니다.');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>HSTEP</h1>
        <p className={styles.subtitle}>비밀번호 재설정</p>
      </div>

      <div className={styles.bubbleContainer} style={{ alignItems: 'center', marginBottom: '30px' }}>
        <div className={styles.bubble}>
          가입 시 등록한 이메일 주소를 입력해 주세요.
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <span className={styles.icon}>✉️</span>
          <div className={styles.divider}></div>
          <input
            type="email"
            placeholder="이메일을 입력하세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.loginButton} style={{ backgroundColor: '#144574' }}>
          재설정 메일 발송
        </button>

        <div className={styles.linkCenter} style={{ marginTop: '30px' }}>
          <span 
            className={styles.linkText} 
            onClick={onBackToLogin}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            로그인 화면으로 돌아가기
          </span>
        </div>
      </form>
    </div>
  );
}

export default FindPassword;