import { useState } from 'react';
import styles from './FindPassword.module.css';

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

      <div className={styles.bubbleContainer}>
        <div className={styles.instructionBubble}>
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

        <button type="submit" className={styles.submitButton}>
          재설정 메일 발송
        </button>

        <div className={styles.linkCenter}>
          <span 
            className={styles.linkText} 
            onClick={onBackToLogin}
          >
            로그인 화면으로 돌아가기
          </span>
        </div>
      </form>
    </div>
  );
}

export default FindPassword;