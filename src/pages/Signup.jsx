import { useState, useEffect } from 'react';
// 새로 만든 전용 CSS 모듈을 불러옵니다.
import styles from './Signup.module.css';

import signupIcon from '../assets/signup_icon.svg';
import signupIconFocus from '../assets/signup_icon_focus.svg';
import mailIcon from '../assets/mail_certify_icon.svg';
import mailIconFocus from '../assets/mail_certify_icon_focus.svg';
import completeIcon from '../assets/signup_complete_icon.svg';
import completeIconFocus from '../assets/signup_complete_icon_focus.svg';
// 학년 선택 라디오 아이콘
import gradeIcon from '../assets/grade.svg';
import gradeChoiceIcon from '../assets/grade_choice.svg';
// 뒤로가기 화살표 아이콘
import backIcon from '../assets/back_button.svg';

const API_BASE_URL = 'http://localhost:8080';
// 비밀번호 규칙: 백엔드(AuthDto.SignupReq)와 동일하게 영문+숫자 포함 8~64자
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;
const HANSUNG_EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)*hansung\.ac\.kr$/;

function Signup({ onBackToLogin }) {
  const [currentStep, setCurrentStep] = useState(1) // 1: 회원가입, 2: 메일인증, 3: 완료
  const steps = [
    { id: 1, label: '회원가입', icon: signupIcon, iconFocus: signupIconFocus },
    { id: 2, label: '메일인증', icon: mailIcon, iconFocus: mailIconFocus },
    { id: 3, label: '가입완료', icon: completeIcon, iconFocus: completeIconFocus },
  ]
  // 사용자가 입력한 데이터를 담을 공간
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // 비밀번호 형식 확인 (영문+숫자 포함 8~64자, 백엔드 규칙과 동일)
  const isPasswordError = password.length > 0 && !PASSWORD_PATTERN.test(password);
  const [grade, setGrade] = useState('1'); // 기본값 1학년
  // 트랙은 백엔드 trackId(Long)를 값으로 사용
  const [track1, setTrack1] = useState('');
  const [track2, setTrack2] = useState('');

  // DB에서 불러온 트랙 목록
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [tracksError, setTracksError] = useState('');

  // 이메일 상태
  const [email, setEmail] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');

  // 학번 중복확인 상태
  const [studentIdChecking, setStudentIdChecking] = useState(false);
  const [studentIdError, setStudentIdError] = useState('');

  // 최종 회원가입 제출 상태
  const [submitting, setSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

  // 에러 문구 표시 여부 관리 상태 변수
  const [showSubmitError, setShowSubmitError] = useState(false);

  // 컴포넌트가 처음 뜰 때 DB의 track 테이블 목록을 그대로 받아온다
  useEffect(() => {
    const fetchTracks = async () => {
      setTracksLoading(true);
      setTracksError('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/tracks`);
        const result = await response.json();

        if (response.ok) {
          setTracks(result.data || []);
        } else {
          setTracksError('트랙 목록을 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('트랙 목록 조회 실패:', error);
        setTracksError('서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setTracksLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const isStep1Valid =
    name.trim().length > 0 &&
    studentId.trim().length > 0 &&
    PASSWORD_PATTERN.test(password) &&
    password === passwordConfirm &&
    track1 !== '' &&
    track2 !== '' &&
    track1 !== track2;

  // 학번 중복확인 (백엔드 GET /api/auth/check/student-number 호출)
  const checkStudentId = async () => {
    setStudentIdError('');
    setStudentIdChecking(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/check/student-number?userId=${encodeURIComponent(studentId.trim())}`
      );
      const result = await response.json();

      if (response.ok) {
        return true;
      }
      setStudentIdError(result.message || '이미 사용 중인 학번입니다.');
      return false;
    } catch (error) {
      console.error('학번 중복확인 실패:', error);
      setStudentIdError('서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return false;
    } finally {
      setStudentIdChecking(false);
    }
  };

  // 1단계 폼 제출(다음으로 버튼 클릭) 시 실행될 함수
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    // 입력창 모두 입력했는지 유효성 검사
    if (!isStep1Valid) {
      setShowSubmitError(true);
      return;
    }
    setShowSubmitError(false);

    const available = await checkStudentId();
    if (!available) return;

    setCurrentStep(2);
  };

  // 이메일 형식 확인 (실제 인증메일 발송 API가 아직 없어, 학교 이메일 형식 + 중복 여부만 확인합니다)
  const handleVerifyEmail = async () => {
    setEmailError('');
    setEmailVerified(false);

    if (!HANSUNG_EMAIL_PATTERN.test(email.trim())) {
      setEmailError('한성대학교 이메일(@hansung.ac.kr)만 사용할 수 있습니다.');
      return;
    }

    setEmailChecking(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/check/email?email=${encodeURIComponent(email.trim())}`
      );
      const result = await response.json();

      if (response.ok) {
        setEmailVerified(true);
      } else {
        setEmailError(result.message || '이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 중복확인 실패:', error);
      setEmailError('서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setEmailChecking(false);
    }
  };

  // 2단계 제출: 실제 회원가입 API 호출
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!emailVerified) {
      setEmailError('이메일 확인을 먼저 진행해주세요.');
      return;
    }

    const signupData = {
      userId: studentId.trim(),
      email: email.trim(),
      password,
      name: name.trim(),
      grade: Number(grade),
      trackIds: [Number(track1), Number(track2)],
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const result = await response.json();

      if (response.ok) {
        setCurrentStep(3);
      } else {
        setSignupError(result.message || '회원가입에 실패했습니다. 입력값을 다시 확인해주세요.');
      }
    } catch (error) {
      console.error('회원가입 API 통신 에러:', error);
      setSignupError('서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* --- 상단 타이틀 및 진행 단계 영역 --- */}
      <div className={styles.topSection}>
        <h1 className={styles.title}>
          {currentStep === 3 ? '회원가입이 완료되었어요!' : '회원가입'}
        </h1>
        <p className={styles.subtitle}>
          {/*  */}
          {currentStep === 3
            ? `${name || '000'}님 환영합니다. HSTEP에서 맞춤 취업전형을 확인해보세요.`
            : '학교에서 사용하는 본인의 학번/비밀번호를 사용해주세요.'}
        </p>

        {/* 진행 단계 아이콘 표시 */}
        <div className={styles.stepContainer}>
          {steps.map((step, index) => (
            <>
              <div key={step.id} className={styles.step}>
                <span className={styles.stepNumber} style={{ color: currentStep === step.id ? '#144574' : '#c0c0c0' }}>
                  0{step.id}
                </span>
                <div className={styles.stepIcon}>
                  {/* 현재 단계에 맞는 아이콘 표시 */}
                  <img src={currentStep === step.id ? step.iconFocus : step.icon} alt={step.label} />
                </div>
                <span className={styles.stepText} style={{ color: currentStep === step.id ? '#144574' : '#c0c0c0' }}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && <div className={styles.stepLine}></div>}
            </>
          ))}
        </div>
      </div>

      {/* --- 하단 입력 폼 영역 (곡선 배경) --- */}
      <div className={styles.formSection}>
        {/* 1단계: 회원가입 폼 */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className={styles.formWrapper}>

          {/* 이름 입력 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>이름<span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="예) 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* 아이디(학번) 입력 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디(학번)<span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="예) 1234567"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setStudentIdError('');
              }}
              className={styles.input}
            />
            {studentIdError && (
              <span style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '100%', left: '0', marginTop: '4px' }}>{studentIdError}</span>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호<span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="영문, 숫자를 포함해 8~64자로 만들어주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${isPasswordError ? styles.inputError : ''}`}
            />

            {isPasswordError && (
              <span style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '100%', left: '0', marginTop: '4px' }}>비밀번호는 영문과 숫자를 포함해 8~64자로 작성해주세요.</span>
            )}
          </div>

          {/* 비밀번호 재확인 입력 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호 재확인<span className={styles.required}>*</span></label>
            <input
              type="password"
              placeholder="비밀번호를 다시 한 번 더 작성해주세요."
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={styles.input}
            />
            {/* 비밀번호가 다를 때만 보여주는 경고 문구 추가 */}
            {password && passwordConfirm && password !== passwordConfirm && (
              <span style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '100%', left: '0', marginTop: '4px' }}>비밀번호가 일치하지 않습니다.</span>
            )}
          </div>

          {/* 학년 라디오 버튼 선택 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>학년<span className={styles.required}>*</span></label>
            <div className={styles.radioGroup}>
              {['1', '2', '3', '4'].map((g) => (
                <label key={g} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="grade"
                    value={g}
                    checked={grade === g}
                    onChange={(e) => setGrade(e.target.value)}
                    className={styles.hiddenRadio}
                  />
                  <img
                    src={grade === g ? gradeChoiceIcon : gradeIcon}
                    alt="선택 아이콘"
                    className={styles.customRadioIcon}
                  />
                  {g} 학년
                </label>
              ))}
            </div>
          </div>

          {/* 소속 트랙 선택 (셀렉트 박스, DB의 track 테이블에서 실시간으로 불러옴) */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              소속 트랙<span className={styles.required}>*</span>
            </label>
            <select
              className={styles.selectInput}
              value={track1}
              disabled={tracksLoading || !!tracksError}
              onChange={(e) => setTrack1(e.target.value)}
            >
              <option value="" disabled>
                {tracksLoading ? '트랙 목록 불러오는 중...' : '1트랙'}
              </option>
              {tracks.map((track) => (
                <option key={track.trackId} value={track.trackId}>
                  {track.trackName}
                </option>
              ))}
            </select>

            <select
              className={styles.selectInput}
              value={track2}
              disabled={tracksLoading || !!tracksError}
              onChange={(e) => setTrack2(e.target.value)}
            >
              <option value="" disabled>
                {tracksLoading ? '트랙 목록 불러오는 중...' : '2트랙'}
              </option>
              {tracks.map((track) => (
                <option
                  key={track.trackId}
                  value={track.trackId}
                  disabled={String(track.trackId) === track1}
                >
                  {track.trackName}
                </option>
              ))}
            </select>

            {tracksError && (
              <span style={{ color: 'red', fontSize: '12px' }}>{tracksError}</span>
            )}
            {track1 !== '' && track1 === track2 && (
              <span style={{ color: 'red', fontSize: '12px' }}>1트랙과 2트랙은 서로 다르게 선택해주세요.</span>
            )}
          </div>

          <button type="button" onClick={onBackToLogin} className={styles.goBackButton}>
            <img src={backIcon} alt="뒤로가기" className={styles.backIconImg} />
            이전으로
          </button>

          <button
            type="submit"
            className={`${styles.submitButton} ${isStep1Valid ? styles.submitButtonActive : ''}`}
            disabled={studentIdChecking}
          >
            {studentIdChecking ? '확인 중...' : '다음으로'}
          </button>

          {showSubmitError && !isStep1Valid && (
            <span className={styles.submitErrorMessage}>
              필수 항목 작성이 안되었습니다. 확인해주세요.
            </span>
          )}

        </form>
        )}

        {/* 2단계: 메일 인증 폼 */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className={styles.formWrapper}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                학교 인증<span className={styles.required}>*</span>
                <span className={styles.subLabel}>본인의 학교이메일을 작성해주세요.</span>
              </label>

              {/* 입력창과 버튼이 합쳐진 형태 */}
              <div className={styles.emailInputWrapper}>
                <input
                  type="email"
                  placeholder="예) abcd123@hansung.ac.kr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailVerified(false);
                    setEmailError('');
                  }}
                  className={styles.emailInput}
                />
                <button
                  type="button"
                  className={styles.verifyButton}
                  onClick={handleVerifyEmail}
                  disabled={emailChecking || email.trim().length === 0}
                >
                  {emailChecking ? '확인 중...' : emailVerified ? '확인 완료' : '이메일 확인'}
                </button>
              </div>
              {emailError && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{emailError}</span>
              )}
              {emailVerified && !emailError && (
                <span style={{ color: '#0084FF', fontSize: '12px', marginTop: '4px', display: 'block' }}>사용 가능한 학교 이메일입니다.</span>
              )}
            </div>

              <button type="button" onClick={() => setCurrentStep(1)} className={styles.goBackButton}>
                <img src={backIcon} alt="뒤로가기" className={styles.backIconImg} />
                이전으로
              </button>

            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? '가입 처리 중...' : '다음으로'}
            </button>

            {signupError && (
              <span className={styles.submitErrorMessage}>{signupError}</span>
            )}
          </form>
        )}

        {/* 3단계: 가입 완료 화면 */}
        {currentStep === 3 && (
          <div className={styles.formWrapper}>

            {/* 학번 및 이름 표시 박스 */}
            <div className={styles.infoBox}>
              <span className={styles.infoText}>{studentId || '1234567'}</span>
              <div className={styles.verticalDivider}></div>
              <span className={styles.infoText}>{name || '000'}</span>
            </div>

            {/* 메인 화면으로 넘어가는 버튼 */}
            <button
              type="button"
              className={styles.startButton}
              onClick={onBackToLogin}  // 추후에 메인페이지로 이동 구현
            >
              HSTEP 시작하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Signup;
