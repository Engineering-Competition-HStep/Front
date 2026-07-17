import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header.jsx';
import styles from './MyPageRegistration.module.css';
import bannerImg from '../../assets/mypage_banner.svg';
import mySpecsIcon from '../../assets/mypage_mySpecs.svg';

export default function MyPageRegistration() {
  // 현재 진행 중인 스텝 (1: 학점, 2: 개인스펙)
  const [currentStep, setCurrentStep] = useState(1);

  // 스크롤 위치 추적 변수
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  // 드래그할 때마다 어느 스텝에 있는지 검사
  useEffect(() => {
    const handleScroll = () => {
      if (!step2Ref.current) return;
      // 화면 중앙 선을 기준으로 2단계 영역이 올라왔는지 확인
      const step2Top = step2Ref.current.getBoundingClientRect().top;
      if (step2Top < window.innerHeight / 2) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스텝 클릭 시 해당 영역으로 이동
  const scrollToStep = (step) => {
    if (step === 1 && step1Ref.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && step2Ref.current) {
      const y = step2Ref.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header activeMenu="mypage" />
      
      <main className={styles.mainLayout}>
        
        {/* === 왼쪽 사이드바 (스텝 표시기) === */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarSub}>마이페이지</p>
          <h1 className={styles.sidebarTitle}>My Page</h1>
          
          <div className={styles.stepWrapper}>
            <div 
              className={`${styles.stepNode} ${currentStep === 1 ? styles.active : ''}`}
              onClick={() => scrollToStep(1)}
            >
              <div className={styles.dot}></div>
              <div className={styles.stepText}>
                <span className={styles.stepLabel}>STEP 1</span>
                <span className={styles.stepName}>학점</span>
              </div>
            </div>
            
            <div 
              className={`${styles.stepNode} ${currentStep === 2 ? styles.active : ''}`}
              onClick={() => scrollToStep(2)}
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
          
          {/* 상단 안내 배너 */}
          <div className={styles.bannerContainer}>
            <h4 className={styles.bannerMainTitle}>마이페이지 정보 등록 안내</h4>
            <div className={styles.infoBanner}>
              <p className={styles.bannerText}>
                <strong>학점 및 개인 스펙</strong>을 <strong>정확하게</strong> 입력해주세요.<br/>
                입력한 정보는 <strong>AI 취업 분석과 맞춤형 로드맵 생성에 활용</strong>됩니다.<br/>
                교내·외 활동, 수상경력, 자격증 등은 <strong>실제 경럼을 기준</strong>으로 작성해주세요.<br/>
                등록한 정보는 언제든지 <strong>수정 및 추가</strong>할 수 있습니다.
              </p>
              <img src={bannerImg} alt="배너 일러스트" className={styles.bannerIllustration} />
            </div>
          </div>

          {/* === 01. 평점평균 섹션 === */}
          <section ref={step1Ref} className={styles.gpaSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.stepTitle}>
                01<br/><span className={styles.stepTitleText}>학점평균을 알려주세요.</span>
              </h2>
              <p className={styles.stepDesc}>*종합정보시스템 &gt; 학적 &gt; 학적조회 &gt; 성적사항</p>
            </div>
            
            <div className={styles.gpaContainer}>
              <div className={styles.gpaRow}>
                <div className={styles.gradePill}>1학년</div>
                <div className={styles.inputWrapper}>
                  <input type="text" placeholder="1학년 평점평균을 입력해주세요." className={styles.centerInput} />
                </div>
              </div>
              <div className={styles.gpaRow}>
                <div className={styles.gradePill}>2학년</div>
                <div className={styles.inputWrapper}>
                  <input type="text" placeholder="2학년 평점평균을 입력해주세요." className={styles.centerInput} />
                </div>
              </div>
              <div className={styles.gpaRow}>
                <div className={styles.gradePill}>3학년</div>
                <div className={styles.inputWrapper}>
                  <input type="text" placeholder="3학년 평점평균을 입력해주세요." className={styles.centerInput} />
                </div>
              </div>
              {/* 4학년 아래는 여백(H70)이 더 넓습니다 */}
              <div className={`${styles.gpaRow} ${styles.mb70}`}>
                <div className={styles.gradePill}>4학년</div>
                <div className={styles.inputWrapper}>
                  <input type="text" placeholder="4학년 평점평균을 입력해주세요." className={styles.centerInput} />
                </div>
              </div>
              
              <div className={styles.gpaRow}>
                <div className={`${styles.gradePill} ${styles.totalPill}`}>전체평균</div>
                <div className={`${styles.inputWrapper} ${styles.totalInputWrapper}`}>
                  <input type="text" placeholder="전체 학점평균을 입력해주세요." className={`${styles.centerInput}`} />
                </div>
              </div>
            </div>
          </section>

          {/* === 02. 개인스펙 섹션 === */}
          <section ref={step2Ref} className={styles.specSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.stepTitle}>
                02<br/><span className={styles.stepTitleText}>개인스펙을 알려주세요.</span>
              </h2>
              <p className={styles.stepDesc}>*언제든 수정 가능합니다.</p>
            </div>

            <div className={styles.specList}>
              {/* 자격증 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>자격증</h3>
                </div>
                <div className={styles.specContent}>
                  <p className={`${styles.specSubTitle} ${styles.mb30}`}>- 자격증 명 / 발급년도</p>
                  <div className={styles.inputWrapper}>
                    <input placeholder="예 ) GTQ 1급 / 2024.5.6" className={styles.centerInput} />
                  </div>
                  <div className={styles.addText}>+ 추가하기</div>
                </div>
              </div>

              {/* 수상경력 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>수상경력</h3>
                </div>
                <div className={styles.specContent}>
                  <p className={`${styles.specSubTitle} ${styles.mb50}`}>- 참여대회 명 / 등수 or 상 이름</p>
                  <div className={styles.inputWrapper}>
                    <input placeholder="예 ) KOBACO 공익광고 공모전 / 대상" className={styles.centerInput} />
                  </div>
                  <div className={`${styles.addText} ${styles.mb20}`}>+ 추가하기</div>
                  
                  <p className={`${styles.specSubTitle} ${styles.mb30}`}>- 간단설명</p>
                  <div className={styles.inputWrapper}>
                    <input placeholder="예 ) 사회문제를 창의적인 광고 아이디어와 시각적 표현으로 해결하는..." className={styles.centerInput} />
                  </div>
                  <div className={styles.addText}>+ 추가하기</div>
                </div>
              </div>

              {/* 자원봉사 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>자원봉사</h3>
                </div>
                <div className={styles.specContent}>
                  <p className={`${styles.specSubTitle} ${styles.mb50}`}>- 봉사 명 / 기관 / 봉사 시간</p>
                  <div className={styles.inputWrapper}>
                    <input placeholder="예 ) 김장 나눔 봉사 / 한성대학교 사회봉사센터 / 8시간" className={styles.centerInput} />
                  </div>
                  <div className={`${styles.addText} ${styles.mb20}`}>+ 추가하기</div>
                  
                  <p className={`${styles.specSubTitle} ${styles.mb30}`}>- 간단설명</p>
                  <div className={styles.inputWrapper}>
                    <input placeholder="예 ) 지역사회의 취약계층을 위해 김장 김치를 직접 담그고..." className={styles.centerInput} />
                  </div>
                  <div className={styles.addText}>+ 추가하기</div>
                </div>
              </div>

              {/* 기타활동 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>기타활동</h3>
                </div>
                <div className={styles.specContent}>
                  <p className={`${styles.specSubTitle} ${styles.mb50}`}>- 이수상 활동, 부트캠프, 인턴, 동아리, 외부 교육, 프로젝트성 활동 등</p>
                  <div className={styles.inputWrapper}>
                    <input placeholder="예 ) 멋쟁이사자처럼 대학 / IT 동아리 / 팀 프로젝트를 통해 서비스 기획 및 개발 경험." className={styles.centerInput} />
                  </div>
                  <div className={styles.addText}>+ 추가하기</div>
                </div>
              </div>
            </div>
          </section>

          {/* 하단 저장 버튼 */}
          <div className={styles.saveBtnWrapper}>
            <button className={styles.saveButton}>저장하기</button>
          </div>

        </div>
      </main>
    </div>
  );
}