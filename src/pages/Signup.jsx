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

const TRACK_MAP = {
  'BIGDATA': 1,
  'WEB': 2,
  'MOBILE': 3
};

// [임시 데이터] 백엔드 트랙 조회 API가 생기기 전까지 사용할 임시 목록
const MOCK_TRACKS = [
  { id: 'BIGDATA', name: '빅데이터트랙' },
  { id: 'WEB', name: '웹공학트랙' },
  { id: 'MOBILE', name: '모바일소프트웨어트랙' },
];

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
  // 비밀번호 입력수 확인하는 변수
  const isPasswordError = password.length > 0 && (password.length < 8 || password.length > 12);
  const [grade, setGrade] = useState('1'); // 기본값 1학년
  const [track1, setTrack1] = useState('');
  const [track2, setTrack2] = useState('');

  // 이메일 상태
  const [email, setEmail] = useState('');
  // 이메일 중복/형식 검사를 통과했는지 기억하는 상태
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 에러 문구 표시 여부 관리 상태 변수
  const [showSubmitError, setShowSubmitError] = useState(false);

  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    // TODO: 나중에 백엔드 API(GET /api/tracks)가 생기면 여기서 fetch
    setTrackList(MOCK_TRACKS);
  }, []);

  const isStep1Valid = 
    name.trim().length > 0 &&
    studentId.trim().length > 0 &&
    password.length >= 8 && password.length <= 12 &&
    password === passwordConfirm &&
    track1 !== '' &&
    track2 !== '';

    // 이메일 인증(확인) 버튼을 눌렀을 때 실행되는 함수
  const verifyEmail = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      // 1. 백엔드 API 호출: 이메일 검사 (GET 요청)
      const response = await fetch(`http://localhost:8080/api/auth/check/email?email=${email}`);
      const result = await response.json();

      if (response.ok) {
        alert('사용 가능한 이메일입니다!');
        setIsEmailVerified(true); // 통과
      } else {
        alert(`사용 불가: ${result.message || '형식이 잘못된 이메일입니다.'}`);
        setIsEmailVerified(false); // 탈락
      }
    } catch (error) {
      console.error('이메일 검사 에러:', error);
    }
  };

  // 폼 제출(다음으로 버튼 클릭) 시 실행될 함수
  const handleNextStep = async (e) => {
    e.preventDefault();
    
    // 1단계 -> 2단계
    if (currentStep === 1) {
      if (!isStep1Valid) {
        setShowSubmitError(true);
        return; 
      }

      // 학번 중복 및 형식 검사 API 호출!
      try {
        const response = await fetch(`http://localhost:8080/api/auth/check/student-number?userId=${studentId}`);
        const result = await response.json();

        if (response.ok) {
          // 학번 검사 통과 시에만 2단계로 넘어감
          setShowSubmitError(false);
          setCurrentStep(2);
        } else {
          alert(`학번 확인 실패: ${result.message || '이미 가입된 학번이거나 형식이 잘못되었습니다.'}`);
        }
      } catch (error) {
        console.error('학번 검사 에러:', error);
        alert('서버와 통신할 수 없습니다.');
      }
    } 

    // [2단계 -> 3단계] 최종 회원가입
    else if (currentStep === 2) {
      // 이메일 검사를 통과했는지 확인
      if (!isEmailVerified) {
        alert('이메일 [인증하기] 버튼을 눌러 확인을 먼저 진행해주세요.');
        return;
      }

      const trackIds = [];
      if (track1) trackIds.push(TRACK_MAP[track1]);
      if (track2 && track1 !== track2) trackIds.push(TRACK_MAP[track2]);

      const signupData = {
        userId: studentId, 
        email: email,
        password: password,
        name: name,
        grade: parseInt(grade, 10),
        trackIds: trackIds
      };

      try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        });

        const result = await response.json();

        if (response.ok) {
          setCurrentStep(3); // 가입 성공 3단계로 이동
        } else {
          alert(`가입 실패: ${result.message || '입력 정보를 확인해주세요.'}`);
        }
      } catch (error) {
        console.error('회원가입 에러:', error);
        alert('서버와 통신할 수 없습니다.');
      }
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
          <form onSubmit={handleNextStep} className={styles.formWrapper}> 

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
              onChange={(e) => setStudentId(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호<span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="8~12자로 만들어주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${isPasswordError ? styles.inputError : ''}`}
              minLength={8}
              maxLength={12}
            />

            {password && (password.length < 8 || password.length > 12) && (
              <span style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '100%', left: '0', marginTop: '4px' }}>비밀번호는 8~12자로 작성해주세요.</span>
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

          {/* 소속 트랙 선택 (셀렉트 박스) */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              소속 트랙<span className={styles.required}>*</span>
            </label>
            <select 
              className={styles.selectInput}
              value={track1}
              onChange={(e) => setTrack1(e.target.value)}
            >
              {/* 추후 트랙 테이블 연동 */}
              <option value="" disabled>1트랙</option>
              {trackList.map((track) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
            
            <select 
              className={styles.selectInput}
              value={track2}
              onChange={(e) => setTrack2(e.target.value)}
            >
              <option value="" disabled>2트랙</option>
              {trackList.map((track) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
          </div>

          <button type="button" onClick={onBackToLogin} className={styles.goBackButton}>
            <img src={backIcon} alt="뒤로가기" className={styles.backIconImg} /> 
            이전으로
          </button>

          <button 
            type="submit" 
            className={`${styles.submitButton} ${isStep1Valid ? styles.submitButtonActive : ''}`}
          >
            다음으로
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
          <form onSubmit={handleNextStep} className={styles.formWrapper}>
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
                  onChange={(e) => {setEmail(e.target.value); setIsEmailVerified(false);} }
                  className={styles.emailInput}
                />
                {/* 메일 인증 API 아직 미구현 */}
                <button 
                  type="button" 
                  className={styles.verifyButton}
                  onClick={verifyEmail}
                  style={{ backgroundColor: isEmailVerified ? '#0356C8' : '' }}
                >
                  {isEmailVerified ? '인증완료' : '인증하기'}
                </button>
              </div>
            </div>

              <button type="button" onClick={() => setCurrentStep(1)} className={styles.goBackButton}>
                <img src={backIcon} alt="뒤로가기" className={styles.backIconImg} /> 
                이전으로
              </button>

            <button type="submit" className={`${styles.submitButton} ${isEmailVerified ? styles.submitButtonActive : ''}`}>
              다음으로
            </button>
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
              className={`${styles.submitButton} ${styles.submitButtonActive}`} 
              onClick={onBackToLogin}>
              HSTEP 시작하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Signup;