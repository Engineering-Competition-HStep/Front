import React, { useState } from 'react';
import styles from './MyPage.module.css';
import Header from '../../components/Header/Header';
import bannerImg from '../../assets/mypage_banner.svg';
import mySpecsIcon from '../../assets/mypage_mySpecs.svg';
import writeIcon from '../../assets/mypage_writeIcon.svg';
import userProfileIcon from '../../assets/mypage_user_profile.svg';

export default function MyPage({ onNavigateToRegistration}) {
  // 나의 학점평균 상태 관리
  const [gpa, setGpa] = useState({
    grade1: '',
    grade2: '',
    grade3: '',
    grade4: '',
    total: ''
  });

  // 나의 개인스펙 상태 관리
  const [specs, setSpecs] = useState({
    cert: 'GTQ 1급 / 2024.5.6',
    award1: '',
    award2: '',
    volunteer1: '',
    volunteer2: '',
    etc: ''
  });

  const handleGpaChange = (e) => {
    const { name, value } = e.target;
    setGpa(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* 상단 메뉴바 컴포넌트 */}
      <Header activeMenu="mypage" />

      {/* 메인 컨텐츠 영역 */}
      <main className={styles.mainContent}>
        
        {/* === 왼쪽 사이드바 (프로필) === */}
        <aside className={styles.sidebar}>
          <div className={styles.pageTitle}>
            <span>마이페이지</span>
            <h1>My Page</h1>
          </div>

          <div className={styles.profileCard}>
              {/* 유저 아바타 아이콘 */}
              <button 
              className={styles.profileImgBtn} 
              onClick={() => alert('프로필 사진 변경 기능..?')}
            >
              <img 
                src={userProfileIcon} 
                alt="유저 프로필" 
                className={styles.profileImage} 
              />
            </button>

            <h2 className={styles.userName}>000</h2>
            
            <div className={styles.userTracks}>
              시각디자인 트랙<br/>
              미디어디자인 트랙
            </div>

            <button className={styles.bookmarkBtn}>
              <div className={styles.bookmarkInner}>
                {/* 북마크 아이콘 */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" color="#555">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                찜한 기업 공고
              </div>
              {/* 화살표 아이콘 */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </aside>

        {/* === 오른쪽 메인 컨텐츠 === */}
        <section className={styles.contentArea}>
          
          {/* 상단 파란색 안내 배너 */}
          <div className={styles.infoBanner}>
            <p className={styles.bannerText}>
              <strong>학점 및 경력을 등록</strong>해야 <strong>전용 로드맵</strong>과 <strong>AI채팅</strong>을 사용할 수 있습니다.<br/>
              학교 내의 활동도 등록 가능하며,<br/>
              자신의 <strong>트랙에 맞는 스펙</strong>을 넣어야 AI가 정확하게 분석합니다.<br/>
              나의 트랙에 관련된 <strong>나만의 로드맵</strong>을 만들어보세요.
            </p>
            {/* 우측 문서 일러스트 */}
            <img src={bannerImg} alt="배너 일러스트" className={styles.bannerIllustration} />
          </div>

          {/* 나의 학점평균 섹션 */}
          <section className={styles.gpaSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>나의 학점평균</h3>
              <button className={styles.writeBtn} onClick={onNavigateToRegistration}>
                <img src={writeIcon} alt="작성하기 아이콘" className={styles.writeIcon} />
                작성하기
              </button>
            </div>
            <p className={styles.sectionDesc}>*종합정보시스템 &gt; 학적 &gt; 학적조회 &gt; 성적사항</p>

            <div className={styles.gpaContainer}>
              {['1학년', '2학년', '3학년', '4학년'].map((label, idx) => {
                const name = `grade${idx + 1}`;
                return (
                  <div key={name} className={styles.inputRow}>
                    <div className={styles.gradePill}>{label}</div>
                    <div 
                      className={styles.underlineInput}
                      style={{ color: gpa[name] ? '#333' : '#aaa' }}
                    >
                      {gpa[name] || `${label} 학점평균을 입력해주세요.`}
                    </div>
                  </div>
                );
              })}
              
              <div className={styles.divider}></div>

              <div className={styles.inputRow}>
                <div className={`${styles.gradePill} ${styles.totalPill}`}>전체평균</div>
                <div 
                  className={`${styles.underlineInput} ${styles.totalInput}`}
                  style={{ color: gpa.total ? '#144574' : '#aaa' }}
                >
                  {gpa.total || '전체 학점평균을 입력해주세요.'}
                </div>
              </div>
            </div>
          </section>

          {/* 나의 개인스펙 섹션 */}
          <div>
            <h3 className={styles.sectionTitle}>나의 개인스펙</h3>
            <p className={styles.sectionDesc}>*언제든 수정 가능합니다.</p>

            <div className={styles.specContainer}>
              
              {/* 자격증 */}
              <div>
                <div className={styles.specItemHeader}>
                  <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                  <h4 className={styles.specItemTitle}>자격증</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <div className={styles.specInput} style={{ color: specs.cert ? '#333' : '#aaa' }}>
                    {specs.cert || '예 ) GTQ 1급 / 2024.5.6'}
                  </div>
                </div>
              </div>

              {/* 수상경력 */}
              <div>
                <div className={styles.specItemHeader}>
                  <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                  <h4 className={styles.specItemTitle}>수상경력</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <div className={styles.specInput} style={{ color: specs.award1 ? '#333' : '#aaa' }}>
                    {specs.award1 || '예 ) KOBACO 공익광고 공모전 / 대상'}
                  </div>
                  {/* ✨ 두 번째 줄도 값이 없을 땐 예시 문구를 보여주도록 복구합니다. */}
                  <div className={styles.specInput} style={{ color: specs.award2 ? '#333' : '#aaa' }}>
                    {specs.award2 || '예 ) 사회문제를 창의적인 광고 아이디어와 시각적 표현으로 해결하는 공익광고 공모전에 참가하여 기획부터 디자인까지 전 과정을 수행함.'}
                  </div>
                </div>
              </div>

              {/* 자원봉사 */}
              <div>
                <div className={styles.specItemHeader}>
                  <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                  <h4 className={styles.specItemTitle}>자원봉사</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <div className={styles.specInput} style={{ color: specs.volunteer1 ? '#333' : '#aaa' }}>
                    {specs.volunteer1 || '예 ) 김장 나눔 봉사 / 한성대학교 사회봉사센터 / 8시간'}
                  </div>
                  <div className={styles.specInput} style={{ color: specs.volunteer2 ? '#333' : '#aaa' }}>
                    {specs.volunteer2 || '예 ) 지역사회의 취약계층을 위해 김장 김치를 직접 담그고 포장 및 배부를 지원한 봉사활동.'}
                  </div>
                </div>
              </div>

              {/* 기타활동 */}
              <div>
                <div className={styles.specItemHeader}>
                  <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                  <h4 className={styles.specItemTitle}>기타활동</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <div className={styles.specInput} style={{ color: specs.etc ? '#333' : '#aaa' }}>
                    {specs.etc || '예 ) 멋쟁이사자처럼 대학 / IT 동아리 / 팀 프로젝트를 통해 서비스 기획 및 개발 경험.'}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </section>
      </main>
    </div>
  );
}