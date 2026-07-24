import React, { useState } from 'react';
import './ExternalJobsMore.scss';
import Footer from '../../components/Footer/Footer.jsx';

// 북마크 이미지
import icon_bookmark_off from '../../assets/externaljobs_bookmark_off.svg';
import icon_bookmark_on from '../../assets/externaljobs_bookmark_on.svg';

// 리스트 및 버튼 SVG 아이콘
import externaljobsmore_calendar from '../../assets/externaljobsmore_calendar.svg';
import externaljobsmore_corporation from '../../assets/externaljobsmore_corporation.svg';
import externaljobsmore_people from '../../assets/externaljobsmore_people.svg';
import externaljobsmore_reset from '../../assets/externaljobsmore_reset.svg';

// 상단 배너 전용 SVG 에셋 import
import externaljobsmore_header_logo from '../../assets/externaljobsmore_header_logo.svg';
import externaljobsmore__logo from '../../assets/externaljobsmore__logo.svg'; 
import externaljobsmore_bar from '../../assets/externaljobsmore_bar.svg'; 
import externaljobsmore_bubble1 from '../../assets/externaljobsmore_bubble1.svg';
import externaljobsmore_bubble2 from '../../assets/externaljobsmore_bubble2.svg';
import externaljobsmore_bubble3 from '../../assets/externaljobsmore_bubble3.svg';
import externaljobsmore_bubble4 from '../../assets/externaljobsmore_bubble4.svg';

// 메인 페이지 상단 네비게이션용 아이콘
import notice_logo from '../../assets/notice_logo.svg';
import notice_search from '../../assets/notice_search.svg';
import notice_menu from '../../assets/notice_menu.svg';

const initialJobs = [
  {
    id: 1,
    company: '토스',
    track: ['IT공학 트랙'],
    title: '2026년도 3차 정규직 직원 모집',
    desc: '유지보수 | 정보보안 | 빅데이터 | 솔루션 | 클라우드 외',
    date: '2026년 7월 17일 00:00 - 2026년 7월 27일 23:59',
    daysLeft: 9,
    companyType: '대기업',
    experience: '경력',
    isBookmarked: false,
  },
  {
    id: 2,
    company: '구글',
    track: ['IT공학 트랙', '경영 트랙'],
    title: '2026 하반기 체험형 인턴십',
    desc: '정보보안 운영 | 채용운영 | IT 헬프데스크',
    date: '2026년 7월 17일 00:00 - 2026년 7월 26일 23:59',
    daysLeft: 8,
    companyType: '대기업',
    experience: '인턴',
    isBookmarked: true,
  },
  {
    id: 3,
    company: '넷플릭스',
    track: ['경영 트랙', '인문사회 트랙'],
    title: '각 부문별 신입/경력사원 채용',
    desc: '재무 | 통합구매 | 법무 | 영업 | 통합구매',
    date: '2026년 7월 18일 00:00 - 2026년 7월 25일 23:59',
    daysLeft: 6,
    companyType: '대기업',
    experience: '신입/경력',
    isBookmarked: true,
  },
  {
    id: 4,
    company: '애플',
    track: ['영상/애니메이션 디자인트랙', '미디어 디자인트랙'],
    title: '[소이미디어] 웹툰 PD 신입/경력 채용',
    desc: '제작관리 | 작가 | PD/AD/FD | 교열 | 만화/웹툰 외',
    date: '2026년 8월 1일 00:00 - 2026년 8월 28일 23:59',
    daysLeft: 12,
    companyType: '대기업',
    experience: '신입/경력',
    isBookmarked: false,
  },
  {
    id: 5,
    company: 'CJ 제일제당',
    track: ['IT공학 트랙', '경영 트랙'],
    title: '2026하반기 체험형(계리/AI) 인턴 채용',
    desc: '[계리]Pricing Assistant | [AI]AI Assistant',
    date: '2026년 8월 1일 00:00 - 2026년 8월 28일 23:59',
    daysLeft: 5,
    companyType: '대기업',
    experience: '인턴',
    isBookmarked: false,
  }
];

function ExternalJobsMore({ onNavigate }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleBookmark = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const handleSyncJobs = () => {
    if (isSyncing) return;
    setIsSyncing(true);

    setTimeout(() => {
      setJobs([...initialJobs]); 
      setIsSyncing(false);
      alert('필터와 공고 목록이 전체 재설정되었습니다.');
    }, 600);
  };

  return (
    <div className="external-jobs-more-page">
      {/* 상단 네비게이션 바 */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px', 
        backgroundColor: 'transparent',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        boxSizing: 'border-box'
      }}>
        <div 
          onClick={() => onNavigate && onNavigate('main')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '150px' }}
        >
          <img 
            src={notice_logo} 
            alt="HSTEP 로고" 
            style={{ height: '24px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} 
          />
        </div>
        
        {/* 💡 네비게이션 메뉴: '메인홈'에 흰색 밑줄 및 굵은 글씨 효과 적용 완료! */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '15px' }}>
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('main'); }} 
            style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #ffffff', paddingBottom: '4px' }}
          >
            메인홈
          </a>
          <a href="#roadmap" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>나의 로드맵</a>
          <a href="#jobs" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>공고 추천</a>
          <a href="#ai-chat" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>AI채팅</a>
          <a href="#mypage" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('mypage'); }} style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>마이페이지</a>
          <a href="#contact" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>문의</a>
        </nav>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '150px', justifyContent: 'flex-end' }}>
          <img src={notice_search} alt="검색" style={{ cursor: 'pointer', width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          <img src={notice_menu} alt="메뉴" style={{ cursor: 'pointer', width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
        </div>
      </header>

      {/* 상단 배너 */}
      <section className="jobs-banner">
        <div className="banner-content">
          <p className="breadcrumb">
            <span>메인홈</span> <span className="arrow">{'>'}</span> <span>외부 취업 공고</span>
          </p>
          <div className="title-row">
            <img src={externaljobsmore_header_logo} alt="외부 취업 공고 로고" className="header-logo-icon" />
            <h2>외부 취업 공고</h2>
          </div>
          <p className="subtitle">로그인을 하면 더 구체적으로 공고를 보여드릴 수 있어요!</p>
        </div>

        <div className="banner-decorations">
          <img src={externaljobsmore_bubble1} alt="" className="bubble bubble-1" />
          <img src={externaljobsmore_bubble2} alt="" className="bubble bubble-2" />
          <img src={externaljobsmore_bubble3} alt="" className="bubble bubble-3" />
          <img src={externaljobsmore_bubble4} alt="" className="bubble bubble-4" />
          <img src={externaljobsmore_bar} alt="" className="bottom-bar" />
          <img src={externaljobsmore__logo} alt="거대 일러스트 로고" className="main-illustration" />
        </div>
      </section>

      {/* 필터 영역 */}
      <section className="filter-section">
        <div className="filter-container">
          <div className="custom-select">
            <select className="filter-dropdown"><option>트랙</option></select>
            <span className="arrow-down">▼</span>
          </div>
          <div className="custom-select">
            <select className="filter-dropdown"><option>직무</option></select>
            <span className="arrow-down">▼</span>
          </div>
          <div className="custom-select">
            <select className="filter-dropdown"><option>기업형태</option></select>
            <span className="arrow-down">▼</span>
          </div>
          <div className="custom-select">
            <select className="filter-dropdown"><option>채용형태</option></select>
            <span className="arrow-down">▼</span>
          </div>
          
          <button 
            className={`sync-btn ${isSyncing ? 'loading' : ''}`} 
            onClick={handleSyncJobs}
            disabled={isSyncing}
          >
            <span className="sync-icon"><img src={externaljobsmore_reset} alt="초기화" /></span>
            <span className="btn-text">전체 재설정</span>
          </button>
        </div>
      </section>

      {/* 공고 리스트 영역 */}
      <section className="jobs-list-section">
        <div className="list-header">
          <p>공고 <strong>{jobs.length}</strong>건 {isSyncing && <span className="syncing-text"> (최신 데이터 불러오는 중...)</span>}</p>
        </div>

        <div className="jobs-list">
          {jobs.map((job) => {
            const badgeColor = job.daysLeft <= 7 ? 'red' : 'blue';

            return (
              <div className="job-card" key={job.id}>
                <div className="logo-wrapper">
                  <div className="logo-circle">{job.company[0]}</div>
                </div>
                
                <div className="info-wrapper">
                  <p className="company-name">{job.company}</p>
                  <div className="track-tags">
                    {job.track.map((t, idx) => <span key={idx} className="track-tag">{t}</span>)}
                  </div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-desc">{job.desc}</p>
                  <p className="job-date">
                    <span className="calendar-icon"><img src={externaljobsmore_calendar} alt="달력" /></span> {job.date} 
                    <span className="divider">|</span> 
                    <span className={`d-day ${badgeColor}`}>{job.daysLeft}일 남음</span>
                  </p>
                </div>

                <div className="right-wrapper">
                  <button className="bookmark-btn" onClick={() => toggleBookmark(job.id)}>
                    <img 
                      src={job.isBookmarked ? icon_bookmark_on : icon_bookmark_off} 
                      alt="북마크" 
                    />
                  </button>
                  
                  <div className="meta-tags">
                    <span><img src={externaljobsmore_corporation} alt="기업형태" className="meta-icon" /> {job.companyType}</span>
                    <span><img src={externaljobsmore_people} alt="채용형태" className="meta-icon" /> {job.experience}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="footer-full-width">
        <Footer />
      </div>
    </div>
  );
}

export default ExternalJobsMore;