import { useState } from 'react';
// 새로 만든 전용 CSS 모듈을 불러옵니다.
import styles from './Signup.module.css';

import signupIcon from '../assets/signup_icon.svg';
import signupIconFocus from '../assets/signup_icon_focus.svg';
import mailIcon from '../assets/mail_certify_icon.svg';
import mailIconFocus from '../assets/mail_certify_icon_focus.svg';
import completeIcon from '../assets/signup_complete_icon.svg';
import completeIconFocus from '../assets/signup_complete_icon_focus.svg';

function Signup({ onBackToLogin }) {
  const [currentStep, setCurrentStep] = useState(1) // 1: 회원가입, 2: 메일인증, 3: 완료
  const steps = [
    { id: 1, label: '회원가입', icon: signupIcon, iconFocus: signupIconFocus },
    { id: 2, label: '메일인증', icon: mailIcon, iconFocus: mailIconFocus },
    { id: 3, label: '가입완료', icon: completeIcon, iconFocus: completeIconFocus },
  ]
  // 사용자가 입력한 데이터를 담을 공간(상태)들입니다.
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [grade, setGrade] = useState('1'); // 기본값 1학년
  const [track1, setTrack1] = useState('');
  const [track2, setTrack2] = useState('');

  // 이메일 상태
  const [email, setEmail] = useState('');

  // 폼 제출(다음으로 버튼 클릭) 시 실행될 함수입니다.
  const handleNextStep = (e) => {
    e.preventDefault();
    console.log('다음 단계로 넘어갈 데이터:', { name, studentId, password, grade, track1, track2 });
    // TODO: 이메일 인증 단계 화면으로 넘어가거나 API 전송 로직을 작성합니다.
    if (currentStep < 3) setCurrentStep(currentStep + 1)
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
              // required
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
              // required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호<span className={styles.required}>*</span></label>
            <input
              type="password"
              placeholder="8~12자로 만들어주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              // required
              // minLength={8}
              // maxLength={12}
            />
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
              // required
            />
            {/* 비밀번호가 다를 때만 보여주는 경고 문구 추가 */}
            {password && passwordConfirm && password !== passwordConfirm && (
              <span style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>비밀번호가 일치하지 않습니다.</span>
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
                    className={styles.radioInput}
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
              <span className={styles.errorText}>이름에는 기호를 사용할 수 없습니다. (임시 안내문)</span>
            </label>
            <select 
              className={styles.selectInput}
              value={track1}
              onChange={(e) => setTrack1(e.target.value)}
              // required
            >
              {/* 추후 트랙 테이블 연동 */}
              <option value="" disabled>1트랙 선택</option>
              <option value="AI">AI 응용 트랙</option>
              <option value="WEB">웹 개발 트랙</option>
              <option value="GAME">게임 개발 트랙</option>
            </select>
            
            <select 
              className={styles.selectInput}
              value={track2}
              onChange={(e) => setTrack2(e.target.value)}
              // required
            >
              <option value="" disabled>2트랙 선택</option>
              <option value="AI">AI 응용 트랙</option>
              <option value="WEB">웹 개발 트랙</option>
              <option value="GAME">게임 개발 트랙</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            다음으로
          </button>
          
          {/* [임시] 로그인 화면으로 돌아가는 버튼 추가 */}
          <button type="button" onClick={onBackToLogin} className={styles.backButton}>
            로그인 화면으로 돌아가기
          </button>
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
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  /* required */
                />
                <button 
                  type="button" 
                  className={styles.verifyButton}
                  onClick={() => alert('인증 메일이 발송되었습니다. (데모)')}
                >
                  인증하기
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              다음으로
            </button>

            {/* 뒤로 가기 및 로그인 화면 복귀 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button type="button" onClick={() => setCurrentStep(1)} className={styles.backButton} style={{ marginTop: 0 }}>
                이전 단계로
              </button>
              <button type="button" onClick={onBackToLogin} className={styles.backButton} style={{ marginTop: 0 }}>
                로그인 화면으로
              </button>
            </div>
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