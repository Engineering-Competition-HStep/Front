import { useState } from 'react';
import HSTEPLogo from '../assets/HSTEP_logo.svg';

function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // 백엔드와 통신하여 로그인 처리를 하는 로직이 들어갈 자리입니다.
    console.log('로그인 시도:', { studentId, password });
  };

  return (
    <div style={styles.container}>
      <div style={styles.topLogo}>
        <img src={HSTEPLogo} alt="HSTEP 로고" style={styles.logoImage} />
      </div>
      {/* 상단 텍스트 말풍선 영역 */}
      <div style={styles.bubbleContainer}>
        <div style={styles.bubble}>내 분야는 어떤걸 하지?</div>
        <div style={styles.bubble}>어떤 활동이 나한테 도움이 되려나?</div>
        <div style={styles.bubble}>내 트랙으로는 어디 회사를 갈 수가 있는거지?</div>
      </div>

      {/* 로고 및 타이틀 영역 */}
      <div style={styles.header}>
        <h1 style={styles.title}>HSTEP</h1>
        <p style={styles.subtitle}>한성대생을 위한 취업 사이트, HSTEP와 함께하세요.</p>
      </div>

      {/* 로그인 입력 폼 영역 */}
      <form onSubmit={handleLogin} style={styles.form}>
        {/* 학번 입력칸 */}
        <div style={styles.inputGroup}>
          <span style={styles.icon}>👤</span>
          <input
            type="text"
            placeholder="학번을 입력하세요."
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 비밀번호 입력칸 */}
        <div style={styles.inputGroup}>
          <span style={styles.icon}>🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <span 
            style={styles.eyeIcon} 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '🙈'}
          </span>
        </div>

        {/* 보조 링크 (비밀번호 찾기) */}
        <div style={styles.linkLeft}>
          <a href="#" style={styles.linkText}>학번/비밀번호를 잊으셨나요?</a>
        </div>

        {/* 로그인 버튼 */}
        <button type="submit" style={styles.loginButton}>
          로그인
        </button>

        {/* 보조 링크 (회원가입) */}
        <div style={styles.linkCenter}>
          <span style={styles.plainText}>HSTEP가 처음이신가요? </span>
          <a href="#" style={styles.linkText}>회원가입 하러가기</a>
        </div>
      </form>
    </div>
  );
}

// 화면을 구성하는 CSS 스타일 객체 모음
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f4f9ff, #e6f0fa)', // 배경 그라데이션
    fontFamily: 'sans-serif',
    position: 'relative',
  },
  topLogo: {
    position: 'absolute',
    top: '30px',
    left: '30px',
  },
  logoImage: {
    height: '24px',
    width: 'auto',
  },
  bubbleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: '20px',
    gap: '10px',
  },
  bubble: {
    backgroundColor: '#ffffff',
    padding: '10px 20px',
    borderRadius: '20px',
    color: '#888',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    color: '#1a498b',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#007bff',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '15px',
    padding: '10px 15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  icon: {
    marginRight: '10px',
    color: '#666',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '5px',
  },
  eyeIcon: {
    cursor: 'pointer',
    color: '#888',
  },
  linkLeft: {
    textAlign: 'left',
    marginBottom: '30px',
  },
  linkCenter: {
    textAlign: 'center',
    marginTop: '20px',
  },
  linkText: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '14px',
  },
  plainText: {
    color: '#888',
    fontSize: '14px',
  },
  loginButton: {
    backgroundColor: '#a0a0a0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};

export default Login;