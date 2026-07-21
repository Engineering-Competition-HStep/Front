import { useState } from 'react';
import styles from './FindPassword.module.css';

function FindPassword({ onBackToLogin }) {

  // 폼 입력값 상태 관리
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  // 팝업창 표시 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // DB 유저 정보 상태
  const [foundUser, setFoundUser] = useState({ name: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: 원래는 백엔드 API에 studentId와 email을 보내서 확인하는 로직
    console.log('비밀번호 찾기 요청:', { studentId, email });

    // 테스트: 백엔드에서 데이터를 성공적으로 받아왔다고 가정
    setFoundUser({
      name: '홍길동', 
      password: 'abcdef'
    });

    // 팝업창 띄움
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>비밀번호 찾기</h1>
        <p className={styles.subtitle}>비밀번호를 잊으셨나요? HSTEP이 도와드릴게요.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="아이디(학번) 입력해주세요."
            // value와 onChange는 새로 만들 학번 상태(State)와 연결합니다.
            className={styles.input}
            required
          />
        </div>

        {/* 이메일 입력창 수정 */}
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="학교이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          확인
        </button>

        <div className={styles.linkCenter}>
          <span className={styles.linkText} onClick={onBackToLogin}>
            로그인하기
          </span>
        </div>
      </form>

      {/* 팝업창 영역 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p className={styles.modalText}>{foundUser.name}님의 기존 비밀번호는</p>
            <p className={styles.modalPassword}>{foundUser.password}</p>
            <p className={styles.modalText}>입니다.</p>

            <button className={styles.modalLoginButton} onClick={onBackToLogin}>
              로그인하러 가기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default FindPassword;