import React, { useState } from 'react';
import styles from './MyPage.module.css';
import Header from '../../components/Header/Header';
import bannerImg from '../../assets/mypage_banner.svg';

export default function MyPage() {
  // 나의 평점평균 상태 관리
  const [gpa, setGpa] = useState({
    grade1: '',
    grade2: '',
    grade3: '',
    grade4: '',
    total: ''
  });

  // 나의 개인스펙 상태 관리
  const [specs, setSpecs] = useState({
    cert: '',
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
            <div className={styles.avatarWrapper}>
              {/* 유저 아바타 아이콘 */}
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" color="#fff" style={{ opacity: 0.8, marginBottom: '-10px' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <button className={styles.cameraBtn}>
                {/* 카메라 아이콘 */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>

            <h2 className={styles.userName}>000</h2>
            <p className={styles.userDept}>ICT 디자인 학부</p>
            
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
            {/* 우측 문서 일러스트 (SVG로 임시 구현) */}
            <img src={bannerImg} alt="배너 일러스트" className={styles.bannerIllustration} />
          </div>

          {/* 나의 평점평균 섹션 */}
          <div>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>나의 평점평균</h3>
              <button className={styles.writeBtn}>
                {/* 연필 아이콘 */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                작성하기
              </button>
            </div>
            <p className={styles.sectionDesc}>*종합정보시스템 &gt; 학적 &gt; 학적조회 &gt; 성적사항</p>

            <div className={styles.gpaContainer}>
              {[
                { label: '1학년', name: 'grade1', placeholder: '1학년 평점평균을 입력해주세요.' },
                { label: '2학년', name: 'grade2', placeholder: '2학년 평점평균을 입력해주세요.' },
                { label: '3학년', name: 'grade3', placeholder: '3학년 평점평균을 입력해주세요.' },
                { label: '4학년', name: 'grade4', placeholder: '4학년 평점평균을 입력해주세요.' },
              ].map((item) => (
                <div key={item.name} className={styles.inputRow}>
                  <div className={styles.gradePill}>{item.label}</div>
                  <input 
                    type="text" 
                    name={item.name}
                    value={gpa[item.name]}
                    onChange={handleGpaChange}
                    placeholder={item.placeholder}
                    className={styles.underlineInput}
                  />
                </div>
              ))}
              
              <div className={styles.divider}></div>

              <div className={styles.inputRow}>
                <div className={`${styles.gradePill} ${styles.totalPill}`}>전체평균</div>
                <input 
                  type="text" 
                  name="total"
                  value={gpa.total}
                  onChange={handleGpaChange}
                  placeholder="전체 평점평균을 입력해주세요."
                  className={`${styles.underlineInput} ${styles.totalInput}`}
                />
              </div>
            </div>
          </div>

          {/* 나의 개인스펙 섹션 */}
          <div>
            <h3 className={styles.sectionTitle}>나의 개인스펙</h3>
            <p className={styles.sectionDesc}>*언제든 수정 가능합니다.</p>

            <div className={styles.specContainer}>
              
              {/* 자격증 */}
              <div>
                <div className={styles.specItemHeader}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <h4 className={styles.specItemTitle}>자격증</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <input 
                    type="text" name="cert" value={specs.cert} onChange={handleSpecChange}
                    placeholder="예 ) GTQ 1급 / 2024.5.6"
                    className={styles.specInput}
                  />
                </div>
              </div>

              {/* 수상경력 */}
              <div>
                <div className={styles.specItemHeader}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <h4 className={styles.specItemTitle}>수상경력</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <input 
                    type="text" name="award1" value={specs.award1} onChange={handleSpecChange}
                    placeholder="예 ) KOBACO 공익광고 공모전 / 대상"
                    className={styles.specInput}
                  />
                  <input 
                    type="text" name="award2" value={specs.award2} onChange={handleSpecChange}
                    placeholder="예 ) 사회문제를 창의적인 광고 아이디어와 시각적 표현으로 해결하는 공익광고 공모전에 참가하여 기획부터 디자인까지 전 과정을 수행함."
                    className={styles.specInput}
                  />
                </div>
              </div>

              {/* 자원봉사 */}
              <div>
                <div className={styles.specItemHeader}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <h4 className={styles.specItemTitle}>자원봉사</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <input 
                    type="text" name="volunteer1" value={specs.volunteer1} onChange={handleSpecChange}
                    placeholder="예 ) 김장 나눔 봉사 / 한성대학교 사회봉사센터 / 8시간"
                    className={styles.specInput}
                  />
                  <input 
                    type="text" name="volunteer2" value={specs.volunteer2} onChange={handleSpecChange}
                    placeholder="예 ) 지역사회의 취약계층을 위해 김장 김치를 직접 담그고 포장 및 배부를 지원한 봉사활동."
                    className={styles.specInput}
                  />
                </div>
              </div>

              {/* 기타활동 */}
              <div>
                <div className={styles.specItemHeader}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <h4 className={styles.specItemTitle}>기타활동</h4>
                </div>
                <div className={styles.specInputWrapper}>
                  <input 
                    type="text" name="etc" value={specs.etc} onChange={handleSpecChange}
                    placeholder="예 ) 멋쟁이사자처럼 대학 / IT 동아리 / 팀 프로젝트를 통해 서비스 기획 및 개발 경험."
                    className={styles.specInput}
                  />
                </div>
              </div>

            </div>
          </div>
          
        </section>
      </main>
    </div>
  );
}