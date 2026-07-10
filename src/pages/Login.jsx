import { useState } from 'react';
import HSTEPLogo from '../assets/HSTEP_logo.svg';
import profileIcon from '../assets/login_profile.svg';
import passwordIcon from '../assets/passwordIcon.svg';
import EyeIcon from '../assets/Eye.svg';
import EyeOffIcon from '../assets/Eye_off.svg';

import styles from './Login.module.css';

function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', { studentId, password });
  };

  return (
    // style 대신 className을 사용합니다.
    <div className={styles.container}>
      <div className={styles.topLogo}>
        <img src={HSTEPLogo} alt="HSTEP 로고" className={styles.logoImage} />
      </div>
      
      <div className={styles.bubbleContainer}>
        <div className={styles.bubble}>내 분야는 어떤걸 하지?</div>
        <div className={styles.bubble}>어떤 활동이 나한테 도움이 되려나?</div>
        <div className={styles.bubble}>내 트랙으로는 어디 회사를 갈 수가 있는거지?</div>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>HSTEP</h1>
        <p className={styles.subtitle}>한성대생을 위한 취업 사이트, HSTEP와 함께하세요.</p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <img src={profileIcon} alt='아이디 아이콘' className={styles.profileIcon} />
          <input
            type="text"
            placeholder="학번을 입력하세요."
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <img src={passwordIcon} alt='비밀번호 아이콘' className={styles.profileIcon} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <img 
            src={showPassword ? EyeIcon : EyeOffIcon} 
            alt="비밀번호 표시 전환" 
            className={styles.EyeIconImage} 
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className={styles.linkLeft}>
          <a href="#" className={styles.linkText}>학번/비밀번호를 잊으셨나요?</a>
        </div>

        <button type="submit" className={styles.loginButton}>
          로그인
        </button>

        <div className={styles.linkCenter}>
          <span className={styles.plainText}>HSTEP가 처음이신가요? </span>
          <a href="#" className={styles.linkText}>회원가입 하러가기</a>
        </div>
      </form>
    </div>
  );
}

export default Login;