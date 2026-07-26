import React, { useState } from 'react';
import './ExternalJobs.scss';
import Footer from '../../components/Footer/Footer.jsx';

import hero_img from '../../assets/externaljobs_logo.svg';
import hstep_text_logo from '../../assets/externaljobs_hstep_logo.svg';
import notice_logo from '../../assets/notice_logo.svg';
import icon_bookmark_off from '../../assets/externaljobs_bookmark_off.svg';
import icon_bookmark_on from '../../assets/externaljobs_bookmark_on.svg';
import notice_search from "../../assets/notice_search.svg";
import notice_menu from "../../assets/notice_menu.svg";

// 1. 가장 추천하는 공고 데이터 (기간, 연봉 데이터 추가)
const initialTopJobs = [
  {
    id: 1,
    matchRate: 94,
    company: '토스',
    role: 'UX/UI 디자이너',
    tags: ['시각디자인트랙', 'UI프로젝트 3개', '평균평점 3.82', 'Figma 가능'],
    isBookmarked: false,
    logoText: 'Toss',
    logoColor: '#3182F6',
    period: '2026년 6월 30일 00:00\n~2026년 7월 13일 23:59',
    salary: '4,500 ~ 5,000'
  },
  {
    id: 2,
    matchRate: 89,
    company: '국순당',
    role: '마케팅 디자이너',
    tags: ['시각디자인트랙', 'UI프로젝트 3개', '평균평점 3.82', 'Figma 가능'],
    isBookmarked: false,
    logoText: '국순당',
    logoColor: '#000000',
    period: '2026년 7월 1일 00:00\n~2026년 7월 20일 23:59',
    salary: '3,800 ~ 4,200'
  },
  {
    id: 3,
    matchRate: 87,
    company: '스타벅스',
    role: '모션그래픽 디자이너',
    tags: ['미디어디자인트랙', 'UI프로젝트 3개', '평균평점 3.82', 'Figma 가능'],
    isBookmarked: true,
    logoText: '★',
    logoColor: '#00704A',
    period: '2026년 7월 5일 00:00\n~2026년 7월 25일 23:59',
    salary: '회사 내규에 따름'
  }
];

// 2. 그 외 추천하는 공고 데이터
const initialOtherJobs = [
  {
    id: 4,
    matchRate: 79,
    company: '팀스파르타',
    role: 'UX/UI 디자이너',
    tags: ['Figma 가능', 'UI프로젝트 3개'],
    isBookmarked: false,
    logoText: 'TEAM',
    logoColor: '#E8344E',
    period: '상시 채용',
    salary: '4,000 ~ 4,500'
  },
  {
    id: 5,
    matchRate: 73,
    company: '애플',
    role: '시각 디자이너',
    tags: ['시각디자인트랙', '평균평점 3.82'],
    isBookmarked: false,
    logoText: '',
    logoColor: '#000000',
    period: '2026년 7월 10일 00:00\n~2026년 7월 31일 23:59',
    salary: '업계 최고 수준'
  },
  {
    id: 6,
    matchRate: 70,
    company: '네이버',
    role: '포토 디자이너',
    tags: ['시각디자인트랙', '일러스트 가능'],
    isBookmarked: false,
    logoText: 'N',
    logoColor: '#03C75A',
    period: '2026년 7월 15일 00:00\n~2026년 8월 15일 23:59',
    salary: '회사 내규에 따름'
  }
];

// 💡 [수정] 괄호 안에 onNavigateToAiChat props를 명시적으로 추가했습니다!
function ExternalJobs({ onNavigate, onNavigateToAiChat }) {
  const [topJobs, setTopJobs] = useState(initialTopJobs);
  const [otherJobs, setOtherJobs] = useState(initialOtherJobs);
  
  // 현재 펼쳐진 카드의 ID를 저장하는 상태 (null이면 아무것도 안 펼쳐짐)
  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleTopBookmark = (id) => {
    setTopJobs(topJobs.map(job => 
      job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const toggleOtherBookmark = (id) => {
    setOtherJobs(otherJobs.map(job => 
      job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  // 공통 카드 렌더링 함수
  const renderJobCard = (job, toggleBookmarkFunc) => {
    const isExpanded = expandedCardId === job.id;

    return (
      <div className={`recommend-card ${isExpanded ? 'expanded' : ''}`} key={job.id}>
        <div className="card-header">
          <span className="match-rate">적합도 {job.matchRate}%</span>
          <button className="bookmark-btn" onClick={(e) => {
            e.stopPropagation(); // 북마크 누를 때 카드가 열리거나 닫히지 않도록 방지
            toggleBookmarkFunc(job.id);
          }}>
            <img src={job.isBookmarked ? icon_bookmark_on : icon_bookmark_off} alt="북마크" />
          </button>
        </div>
        
        <div className="card-body">
          <div className="company-logo" style={{ color: job.logoColor }}>
            {job.logoText}
          </div>
          <h3 className="company-name">{job.company}</h3>
          <p className="company-role">{job.role}</p>
        </div>

        <div className="card-tags">
          {job.tags.map((tag, idx) => (
            <span key={idx} className="tag-item">✔ {tag}</span>
          ))}
        </div>

        {/* 💡 펼쳐졌을 때 보이는 추가 정보 영역 */}
        {isExpanded ? (
          <div className="expanded-content">
            <a href="#ai-reason" className="ai-reason-link">AI 추천 이유 →</a>
            
            <div className="info-row">
              <span className="info-label">기간</span>
              <span className="info-value">{job.period}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">연봉</span>
              <span className="info-value">{job.salary}</span>
            </div>

            <button className="apply-btn">채용공고 보러가기</button>
            <button className="close-btn" onClick={() => setExpandedCardId(null)}>닫기</button>
          </div>
        ) : (
          <div className="card-footer">
            <button className="detail-btn" onClick={() => setExpandedCardId(job.id)}>+ 자세히보기</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="recommend-jobs-page">
      <header className="custom-header">
        <div className="logo-area" onClick={() => onNavigate && onNavigate('main')} style={{ cursor: 'pointer' }}>
          <img src={notice_logo} alt="HSTEP 로고" className="main-logo" />
        </div>
        
        <nav className="nav-menu">
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('main'); }}>메인홈</a>
          
          {/* 💡 [수정] 나의 로드맵 이동 누락 부분 안전하게 연결 */}
          <a href="#roadmap" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('roadmap'); }}>나의 로드맵</a>
          
          <a href="#jobs" className="active">공고 추천</a>
          
          {/* 💡 [핵심 수정] AI채팅 클릭 시 정상적으로 이동하도록 수정! */}
          <a 
            href="#ai-chat" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToAiChat) {
                onNavigateToAiChat();
              } else if (onNavigate) {
                onNavigate('aichat');
              }
            }}
          >
            AI채팅
          </a>
          
          <a href="#mypage" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('mypage'); }}>마이페이지</a>
          
          {/* [수정] 문의 페이지 이동 누락 부분 안전하게 연결 */}
          <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }}>문의</a>
        </nav>

        <div className="right-icons">
          <img src={notice_search} alt="검색" className="icon" />
          <img src={notice_menu} alt="메뉴" className="icon" />
        </div>
      </header>

      <div className="page-content">
        <section className="hero-section">
          <img src={hero_img} alt="추천 일러스트" className="hero-icon" />
          <h2 className="hero-title">
            <img src={hstep_text_logo} alt="HSTEP" className="inline-title-logo" /> 
            이 가장 추천하는 공고에요!
          </h2>
          <p className="hero-subtitle">AI 분석 결과, 가장 적합한 기업들이에요.</p>
        </section>

        <section className="cards-section">
          <div className="cards-grid">
            {topJobs.map(job => renderJobCard(job, toggleTopBookmark))}
          </div>
        </section>

        <section className="sub-hero-section">
          <h2 className="hero-title">그 외 추천하는 공고</h2>
          <p className="hero-subtitle">AI 분석 결과, 다음으로 적합한 기업들이에요.</p>
        </section>

        <section className="cards-section">
          <div className="cards-grid">
            {otherJobs.map(job => renderJobCard(job, toggleOtherBookmark))}
          </div>
        </section>

        <div className="more-btn-wrapper">
          <button className="more-btn">다른 공고도 보러 가기 →</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ExternalJobs;