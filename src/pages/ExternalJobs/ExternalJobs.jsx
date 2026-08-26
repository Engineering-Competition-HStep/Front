import React, { useState } from 'react';
import './ExternalJobs.scss';
import Footer from '../../components/Footer/Footer.jsx';

import hero_img from '../../assets/externaljobs_logo.svg';
import hstep_text_logo from '../../assets/externaljobs_hstep_logo.svg';
import notice_logo from '../../assets/notice_logo.svg';
import notice_search from "../../assets/notice_search.svg";
import notice_menu from "../../assets/notice_menu.svg";
import tossLogo from '../../assets/job-logos/toss.png';
import gooksundangLogo from '../../assets/Home_gooksundang.png';
import starbucksLogo from '../../assets/job-logos/starbucks.png';
import teamSpartaLogo from '../../assets/job-logos/team-sparta.png';
import appleLogo from '../../assets/job-logos/apple.svg';
import naverLogo from '../../assets/job-logos/naver.png';

// 1. 가장 추천하는 공고 데이터 (기간, 연봉 데이터 추가)
const initialTopJobs = [
  {
    id: 1,
    matchRate: 94,
    company: '토스',
    role: 'UX/UI 디자이너',
    tags: ['시각디자인트랙', 'UI프로젝트 3개', '평균평점 3.82', 'Figma 가능'],
    logo: tossLogo,
    url: 'https://toss.im/career/jobs',
    period: '공식 채용 페이지에서 최신 일정 확인',
    salary: '4,500 ~ 5,000'
  },
  {
    id: 2,
    matchRate: 89,
    company: '국순당',
    role: '마케팅 디자이너',
    tags: ['시각디자인트랙', 'UI프로젝트 3개', '평균평점 3.82', 'Figma 가능'],
    logo: gooksundangLogo,
    url: 'https://www.ksdb.co.kr/recruit/recruit.asp',
    period: '공식 채용 페이지에서 최신 일정 확인',
    salary: '3,800 ~ 4,200'
  },
  {
    id: 3,
    matchRate: 87,
    company: '스타벅스',
    role: '모션그래픽 디자이너',
    tags: ['미디어디자인트랙', 'UI프로젝트 3개', '평균평점 3.82', 'Figma 가능'],
    logo: starbucksLogo,
    url: 'https://job.shinsegae.com/recruit_info/notice/notice01_list.jsp?isSearch=Y&tabKey0=F',
    period: '공식 채용 페이지에서 최신 일정 확인',
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
    logo: teamSpartaLogo,
    url: 'https://career.spartaclub.kr/ko/careers',
    period: '포지션별 채용 일정 확인',
    salary: '4,000 ~ 4,500'
  },
  {
    id: 5,
    matchRate: 73,
    company: '애플',
    role: '시각 디자이너',
    tags: ['시각디자인트랙', '평균평점 3.82'],
    logo: appleLogo,
    url: 'https://jobs.apple.com/ko-kr/search?location=south-korea-KORC',
    period: '대한민국 채용 페이지에서 최신 일정 확인',
    salary: '업계 최고 수준'
  },
  {
    id: 6,
    matchRate: 70,
    company: '네이버',
    role: '포토 디자이너',
    tags: ['시각디자인트랙', '일러스트 가능'],
    logo: naverLogo,
    url: 'https://recruit.navercorp.com/rcrt/list.do',
    period: '공고별 접수기간은 공식 페이지에서 확인',
    salary: '회사 내규에 따름'
  }
];

// 💡 [수정] 괄호 안에 onNavigateToAiChat props를 명시적으로 추가했습니다!
function ExternalJobs({ onNavigate, onNavigateToAiChat }) {
  // 현재 펼쳐진 카드의 ID를 저장하는 상태 (null이면 아무것도 안 펼쳐짐)
  const [expandedCardId, setExpandedCardId] = useState(null);

  // 공통 카드 렌더링 함수
  const renderJobCard = (job) => {
    const isExpanded = expandedCardId === job.id;

    return (
      <div className={`recommend-card ${isExpanded ? 'expanded' : ''}`} key={job.id}>
        <div className="card-header">
          <span className="match-rate">적합도 {job.matchRate}%</span>
        </div>
        
        <div className="card-body">
          <div className="company-logo">
            <img src={job.logo} alt={`${job.company} 로고`} />
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

            <a className="apply-btn" href={job.url} target="_blank" rel="noreferrer">채용공고 보러가기</a>
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
            {initialTopJobs.map(job => renderJobCard(job))}
          </div>
        </section>

        <section className="sub-hero-section">
          <h2 className="hero-title">그 외 추천하는 공고</h2>
          <p className="hero-subtitle">AI 분석 결과, 다음으로 적합한 기업들이에요.</p>
        </section>

        <section className="cards-section">
          <div className="cards-grid">
            {initialOtherJobs.map(job => renderJobCard(job))}
          </div>
        </section>

        <div className="more-btn-wrapper">
          <button
            className="more-btn"
            onClick={() => onNavigate && onNavigate('externalJobsMore')}
          >
            다른 공고도 보러 가기 →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ExternalJobs;
