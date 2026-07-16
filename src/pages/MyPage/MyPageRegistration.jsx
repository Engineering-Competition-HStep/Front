import React, { useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import styles from './MyPageRegistration.module.css';
import bannerImg from '../../assets/mypage_banner.svg';

export default function MyPageRegistration() {
  // 현재 진행 중인 스텝 (1: 학점, 2: 개인스펙)
  const [currentStep, setCurrentStep] = useState(1);

  // 스텝 이동 함수
  const handleNextStep = () => setCurrentStep(2);
  const handlePrevStep = () => setCurrentStep(1);

  return (
    <div className={styles.pageContainer}>
      <Header activeMenu="mypage" />
      
      <main className={styles.mainLayout}>
        
        {/* === 왼쪽 사이드바 (스텝 표시기) === */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarSub}>마이페이지</p>
          <h1 className={styles.sidebarTitle}>My Page</h1>
          
          <div className={styles.stepWrapper}>
            {/* 1단계 아이템 */}
            <div 
              className={`${styles.stepNode} ${currentStep === 1 ? styles.active : ''}`}
              onClick={handlePrevStep}
            >
              <div className={styles.dot}></div>
              <div className={styles.stepText}>
                <span className={styles.stepLabel}>STEP 1</span>
                <span className={styles.stepName}>학점</span>
              </div>
            </div>
            
            {/* 2단계 아이템 */}
            <div 
              className={`${styles.stepNode} ${currentStep === 2 ? styles.active : ''}`}
              onClick={handleNextStep}
            >
              <div className={styles.dot}></div>
              <div className={styles.stepText}>
                <span className={styles.stepLabel}>STEP 2</span>
                <span className={styles.stepName}>개인스펙</span>
              </div>
            </div>
          </div>
        </aside>

        {/* === 오른쪽 메인 컨텐츠 영역 === */}
        <div className={styles.contentArea}>
          
          {/* 상단 안내 배너 (모든 스텝에서 공통으로 보임) */}
          <div className={styles.infoBanner}>
            <h4 className={styles.bannerTitle}>마이페이지 정보 등록 안내</h4>
            <p className={styles.bannerText}>
              학점 및 스펙을 정확하게 등록해야 <strong>전용 로드맵</strong>과 <strong>AI채팅</strong>을 사용할 수 있습니다.<br/>
              교내외 활동, 수상경력, 자격증 등은 실제 경험을 기준으로 작성해주세요.<br/>
              등록된 정보는 언제든지 수정 및 추가할 수 있습니다.
            </p>
            <img src={bannerImg} alt="배너 일러스트" className={styles.bannerIllustration} />
          </div>

          {/* === 조건부 렌더링: currentStep 값에 따라 다른 화면 보여주기 === */}
          {currentStep === 1 && (
             <section>
               <h2 style={{ color: '#0084FF', fontSize: '24px', marginBottom: '10px' }}>01<br/><span style={{color: '#222'}}>평점평균을 알려주세요.</span></h2>
               <p style={{ color: '#888', fontSize: '13px' }}>*종합정보시스템 &gt; 학적 &gt; 학적조회 &gt; 성적사항</p>
               
               {/* TODO: 여기에 1~4학년 학점 입력 폼 코드를 넣을 예정입니다. */}
               <div style={{ height: '300px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', borderRadius: '8px' }}>
                 [학점 입력 폼 들어갈 자리]
               </div>

               <div className={styles.bottomButtonContainer}>
                 <button onClick={handleNextStep} className={`${styles.actionButton} ${styles.gray}`}>
                   저장하고 다음으로
                 </button>
               </div>
             </section>
          )}

          {currentStep === 2 && (
             <section>
               <h2 style={{ color: '#0084FF', fontSize: '24px', marginBottom: '10px' }}>02<br/><span style={{color: '#222'}}>개인스펙을 알려주세요.</span></h2>
               <p style={{ color: '#888', fontSize: '13px' }}>*언제든 수정 가능합니다.</p>
               
               {/* TODO: 여기에 자격증, 수상경력 등 스펙 입력 폼 코드를 넣을 예정입니다. */}
               <div style={{ height: '300px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', borderRadius: '8px' }}>
                 [개인스펙 입력 폼 들어갈 자리]
               </div>

               <div className={styles.bottomButtonContainer}>
                 <button className={styles.actionButton}>
                   완료 및 저장하기
                 </button>
               </div>
             </section>
          )}

        </div>
      </main>
    </div>
  );
}