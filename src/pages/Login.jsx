import { useState, useRef } from 'react';
import HSTEPLogo from '../assets/HSTEP_logo.svg';
// 기본 로그인 아이콘
import profileIcon from '../assets/login_profile.svg';
import passwordIcon from '../assets/passwordIcon.svg';
// 포커스 활성화 아이콘
import profileIconEdit from '../assets/login_profile_edit.svg';
import passwordIconEdit from '../assets/passwordIcon_edit.svg';
// 입력 완료 아이콘
import profileIconCompleted from '../assets/login_profile_completed.svg';
import passwordIconCompleted from '../assets/passwordIcon_completed.svg';
// 로그인 실패 아이콘
import profileIconError from '../assets/login_profile_error.svg';
import passwordIconError from '../assets/passwordIcon_error.svg';
// 비밀번호 표시 아이콘
import EyeIcon from '../assets/Eye.svg';
import EyeOffIcon from '../assets/Eye_off.svg';

import styles from './Login.module.css';

function Login( {onNavigateToFindPassword, onNavigateToSignup, onLoginSuccess} ) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 입력창 포커스 추적하는 상태
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPwFocused, setIsPwFocused] = useState(false);

  // 로그인 실패 상태 확인 변수
  const [hasError, setHasError] = useState(false);

  const passwordRef = useRef(null);

  // 학번, 비밀번호 입력창 텍스트 있는지 확인하는 변수
  const isFormValid = studentId.length > 0 && password.length > 0

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = {
        userId: studentId, 
        password: password
      };

      // 백엔드 서버로 POST 요청
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      // 로그인 성공 처리
      if (response.ok) {
        setHasError(false);
        const token = result.data ? result.data.accessToken : result.accessToken;
        
        // 브라우저의 출입증 보관
        if (token) {
          localStorage.setItem('accessToken', token); 
        }

        // 로그인 성공
        alert('로그인에 성공했습니다!');
        if (onLoginSuccess) {
          onLoginSuccess(); 
        }
        
      } else {
        // 로그인 실패 (비밀번호 틀림, 없는 학번 등)
        setHasError(true);
        console.error('로그인 거절 사유:', result.message);
      }
    } catch (error) {
      console.error('로그인 API 통신 에러:', error);
      setHasError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topLogo}>
        <img src={HSTEPLogo} alt="HSTEP 로고" className={styles.logoImage} />
      </div>
      
      <div className={styles.bubbleContainer}>
        <div className={`${styles.bubble} ${styles.bubble1}`}>내 분야는 어떤걸 하지?</div>
        <div className={`${styles.bubble} ${styles.bubble2}`}>어떤 활동이 나한테 도움이 되려나?</div>
        <div className={`${styles.bubble} ${styles.bubble3}`}>내 트랙으로는 어디 회사를 갈 수가 있는거지?</div>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>HSTEP</h1>
        <p className={styles.subtitle}>한성대생을 위한 취업 사이트, HSTEP와 함께하세요.</p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        {/* 학번 입력 블럭 */}
        <div className={`${styles.inputGroup} ${isIdFocused ? styles.inputGroupFocused : ''}`}>
          <img 
            src={
              hasError 
                ? profileIconError
                : isIdFocused 
                  ? profileIconEdit 
                  : (studentId.length > 0 ? profileIconCompleted : profileIcon)
            } 
            alt='아이디 아이콘' 
            className={styles.profileIcon} 
          />
          <div className={`${styles.verticalBar} ${isIdFocused ? styles.verticalBarActive : ''}`}></div>
          <input
            type="text"
            placeholder="학번을 입력하세요."
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setHasError(false); // 로그인 실패 이후 다시 입력 시 에러 아이콘 해제
            }}
            onFocus={() => setIsIdFocused(true)}
            onBlur={() => setIsIdFocused(false)}
            // 엔터 키 누를 때 비번 창으로 이동
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // 엔터 쳤을 때 로그인 되는 것을 막음
                passwordRef.current.focus(); // 비밀번호 창으로 커서를 이동
              }
            }}
            className={styles.input}
          />
        </div>

        {/* 비밀번호 입력 블럭 */}
        <div className={`${styles.inputGroup} ${isPwFocused ? styles.inputGroupFocused : ''}`}>
          <img 
            src={
              hasError 
                ? passwordIconError
                : isPwFocused 
                  ? passwordIconEdit 
                  : (password.length > 0 ? passwordIconCompleted : passwordIcon)
            } 
            alt='비밀번호 아이콘' 
            className={styles.profileIcon} 
          />
          <div className={`${styles.verticalBar} ${isPwFocused ? styles.verticalBarActive : ''}`}></div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setHasError(false); // 로그인 실패 후 다시 입력 시 에러 아이콘 해제
            }}
            onFocus={() => setIsPwFocused(true)}
            onBlur={() => setIsPwFocused(false)}
            ref={passwordRef}
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
          <span 
            className={styles.linkText} 
            onClick={onNavigateToFindPassword}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            비밀번호를 잊으셨나요?
          </span>
        </div>

        <button 
          type="submit" 
          className={`${styles.loginButton} ${isFormValid ? styles.loginButtonActive : ''}`}
          disabled={!isFormValid}
        >
          로그인
        </button>

        {hasError && (
          <p className={styles.errorMessage}>
            학번 or 비밀번호가 맞지 않습니다. 다시 확인해주세요.
          </p>)
        }

        <div className={styles.linkCenter}>
          <span className={styles.plainText}>HSTEP가 처음이신가요? </span>
          <span 
            className={styles.linkText} 
            onClick={onNavigateToSignup}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            회원가입 하러가기
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;