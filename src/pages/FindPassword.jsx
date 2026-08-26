import { useState } from 'react';
import styles from './FindPassword.module.css';

const API_BASE_URL = 'http://localhost:8080';
// 비밀번호 규칙: 백엔드(AuthDto.ResetPasswordReq)와 동일하게 영문+숫자 포함 8~64자
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

function FindPassword({ onBackToLogin }) {

  // 폼 입력값 상태 관리
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  // 비밀번호 형식 확인 (영문+숫자 포함 8~64자, 백엔드 규칙과 동일)
  const isPasswordError = newPassword.length > 0 && !PASSWORD_PATTERN.test(newPassword);

  // 제출 상태 및 에러 문구
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 팝업창(성공 안내) 표시 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFormValid =
    studentId.trim().length > 0 &&
    email.trim().length > 0 &&
    PASSWORD_PATTERN.test(newPassword) &&
    newPassword === newPasswordConfirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!isFormValid) {
      if (newPassword !== newPasswordConfirm) {
        setSubmitError('새 비밀번호가 일치하지 않습니다.');
      } else {
        setSubmitError('입력값을 다시 확인해주세요.');
      }
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/reset`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentId.trim(),
          email: email.trim(),
          newPassword,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        setSubmitError(result.message || '비밀번호 변경에 실패했습니다. 입력값을 다시 확인해주세요.');
      }
    } catch (error) {
      console.error('비밀번호 변경 API 통신 에러:', error);
      setSubmitError('서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>비밀번호 변경</h1>
        <p className={styles.subtitle}>학번과 학교이메일을 확인한 뒤 새 비밀번호로 바꿔드릴게요.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="아이디(학번)를 입력해주세요."
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className={styles.input}
            required
          />
        </div>

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

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="새 비밀번호를 입력해주세요. (영문, 숫자 포함 8~64자)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        {isPasswordError && (
          <span style={{ color: 'red', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
            비밀번호는 영문과 숫자를 포함해 8~64자로 작성해주세요.
          </span>
        )}

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="새 비밀번호를 다시 한 번 입력해주세요."
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        {newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm && (
          <span style={{ color: 'red', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
            비밀번호가 일치하지 않습니다.
          </span>
        )}

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? '변경 중...' : '비밀번호 변경'}
        </button>

        {submitError && (
          <span style={{ color: 'red', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
            {submitError}
          </span>
        )}

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
            <p className={styles.modalText}>비밀번호가 변경되었습니다.</p>
            <p className={styles.modalText}>새 비밀번호로 다시 로그인해주세요.</p>

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
