import React, { useState, useRef } from "react";
import "./MainPage.scss"; 

// 기존 아이콘 및 배경 이미지
import Home_logo from "../../assets/Home_logo.svg";
import Home_header from "../../assets/Home_header.svg";
import Home_header_image from "../../assets/Home_header_image.svg";
import Home_search from "../../assets/Home_search.svg";
import Home_mypage from "../../assets/Home_mypage.svg";
import HSTEP_logo from "../../assets/HSTEP_logo.svg";
import Home_advertise from "../../assets/Home_advertise.svg";
import Home_roadmap from "../../assets/Home_roadmap.svg";
import Home_notice from "../../assets/Home_notice.svg";
import Home_rectangle from "../../assets/Home_rectangle.svg";

// 취업 공고 회사 로고 및 화살표 이미지
import Home_gooksundang from "../../assets/Home_gooksundang.png";
import Home_adidas_logo from "../../assets/Home_adidas_logo.png";
import Home_toss_logo from "../../assets/Home_toss_logo.png";
import Home_hyndai_logo from "../../assets/Home_hyndai_logo.svg";
import Home_cj_logo from "../../assets/Home_cj_logo.png";
import Home_left from "../../assets/Home_left.png";
import Home_right from "../../assets/Home_right.png";

// 로드맵 화살표 이미지
import Home_line from "../../assets/Home_line.png";

// 상단 메뉴바, 하단 푸터 컴포넌트
import Footer from '../../components/Footer/Footer.jsx';

// 공지사항 로고 및 아이콘
import notice_logo from "../../assets/notice_logo.svg";
import notice_search from "../../assets/notice_search.svg";
import notice_menu from "../../assets/notice_menu.svg";

const jobs = [
  ["국순당", Home_gooksundang, ["지식정보문화트랙 추천"], "청년 직무 아카데미 교육생 모집", "~11월 24일 23:59"],
  ["아디다스", Home_adidas_logo, ["정보시스템/AI트랙 추천"], "[신입/경력] 각 부문 인재채용", "~2월 9일 23:59"],
  ["토스", Home_toss_logo, ["행정트랙 추천"], "[신입/경력] 각 부문 인재채용", "~7월 14일 23:59"],
  ["현대 오토에버", Home_hyndai_logo, ["사이버보안/AI트랙 추천", "글로벌비즈니스트랙 추천"], "9월 인재모집", "~9월 2일 23:59"],
  ["CJ 제일제당", Home_cj_logo, ["기업경영트랙 추천"], "2026년 3분기 신입 및 경력사원 채용", "~8월 13일 23:59"],
];

const notices = [
  ["2026학년도 2학기 교차 전부(과) 선발 안내 (7.13~7.17)", "2026-07-06"],
  ["[에피소드] 2026학년도 2학기 외부 임차기숙사 입사생 모집...", "2026-06-29"],
  ["[양식] 국가고시합격자장학금 신청안내 - 국가전문자격시험 합...", "2026-05-12"],
  ["[온라인 취업 멘토링 서비스] 슬기로운 취준생활, 코멘토로 지...", "2026-05-07"],
];

// onActionClick props가 적용된 SectionTitle 컴포넌트
function SectionTitle({ icon, title, description, action, onActionClick }) {
  return (
    <div className="section-title">
      <div>
        <div className="title-row">
          {icon && <img src={icon} alt="" className="section-icon" />}
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      {/* 전달받은 onActionClick을 버튼의 onClick에 연결 */}
      {action && <button className="more" onClick={onActionClick}>{action}</button>}
    </div>
  );
}

// App.jsx에서 onNavigateToMyPage, onNavigateToNotice를 정상적으로 받아옵니다.
function MainPage({ onNavigateToMyPage, onNavigateToNotice }) {

  const [track, setTrack] = useState("부동산 트랙");
  const realEstate = track === "부동산 트랙";
  
  const scrollRef = useRef(null);

  const recommended = realEstate
    ? ["스마트도시·교통계획 트랙", "기업경영 트랙", "회계·재무경영 트랙"]
    : ["문화콘텐츠기획 트랙", "디지털콘텐츠·가상현실 트랙", "미디어디자인 트랙"];

  const recommendedOut = realEstate
    ? ["인테리어디자인 트랙", "빅데이터 트랙"]
    : ["정보시스템 트랙", "빅데이터 트랙"];

  const careers = realEstate
    ? ["도시생전문가 / 도시환경전문가", "일반회사 / 금융회사", "일반회사 / 금융회사 / 회계사무소"]
    : ["문화콘텐츠 기업", "미디어·콘텐츠·가상현실 산업", "디자인·IT 기업"];

  const careersOut = realEstate
    ? ["부동산인테리어 / 건축회사", "부동산정보회사"]
    : ["공공기관 / 연구기관", "일반회사"];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="hstep">
      
      {/* 상단 헤더 영역 (공지사항 페이지와 동일한 구조로 상단바 네비게이션 적용) */}
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
        {/* 로고 영역 */}
        <div 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '150px' }}
        >
          <img 
            src={notice_logo} 
            alt="HSTEP 로고" 
            style={{ height: '24px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} 
          />
        </div>
        
        {/* 중앙 메뉴 영역 */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '15px' }}>
          <a 
            href="#home" 
            style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #ffffff', paddingBottom: '4px' }}
          >
            메인홈
          </a>
          <a href="#roadmap" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>나의 로드맵</a>
          <a href="#jobs" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>공고 추천</a>
          <a href="#ai-chat" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>AI채팅</a>
          
          {/* 마이페이지 클릭 시 App.jsx의 onNavigateToMyPage 함수가 실행되도록 연결 */}
          <a 
            href="#mypage" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateToMyPage && onNavigateToMyPage();
            }}
            style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}
          >
            마이페이지
          </a>
          <a href="#contact" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>문의</a>
        </nav>

        {/* 우측 아이콘 영역 */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '150px', justifyContent: 'flex-end' }}>
          <img src={notice_search} alt="검색" style={{ cursor: 'pointer', width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          <img src={notice_menu} alt="메뉴" style={{ cursor: 'pointer', width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
        </div>
      </header>

      <section className="hero" id="home">
        <img src={Home_header} alt="" className="hero-bg" />
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="welcome">어서오세요 000님!</p>
              <h1><strong>HSTEP</strong>에서 함께 입사해봐요</h1>
              <p className="copy">나의 트랙에 맞춰진 전용 로드맵을 AI와 함께 상담하고, 고민해보아요</p>
              <button className="outline-btn">나의 로드맵 만들러 가기 <span>→</span></button>
            </div>
          </div>
        </div>
        <img src={Home_header_image} alt="로드맵 일러스트" className="hero-art-img" />
      </section>

      <section className="jobs-section" id="jobs">
        <div className="container">
          <SectionTitle 
            icon={Home_advertise} 
            title="외부 취업 공고" 
            description="나에게 맞는 다양한 취업 공고를 만나보세요." 
            action="+ 취업공고 더 보러가기" 
          />
        </div>
        <div className="carousel-wrapper">
          <div className="blur-edge blur-left">
            <button className="nav-arrow left-arrow" onClick={() => scroll("left")} aria-label="이전 공고 보기">
              <img src={Home_left} alt="이전 화살표" />
            </button>
          </div>
          
          <div className="job-strip" ref={scrollRef}>
            {jobs.map(([company, logoSrc, tags, title, deadline]) => (
              <article className="job-card" key={company}>
                <div className="logo">
                  <img src={logoSrc} alt={`${company} 로고`} />
                </div>
                <h3 className="company">{company}</h3>
                <div className="tags">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <p className="job-title">{title}</p>
                <div className="deadline"><span>{deadline}</span><span>→</span></div>
              </article>
            ))}
          </div>

          <div className="blur-edge blur-right">
            <button className="nav-arrow right-arrow" onClick={() => scroll("right")} aria-label="다음 공고 보기">
              <img src={Home_right} alt="다음 화살표" />
            </button>
          </div>
        </div>
      </section>

      <section className="roadmap-wrapper" id="roadmap">
        <div className="container">
          <SectionTitle
            icon={Home_roadmap}
            title="Roadmap"
            description="한성대학교에 있는 부동산 트랙/지식정보문화 트랙의 기존 로드맵이에요."
          />
          <div className="tabs" role="tablist" aria-label="로드맵 트랙">
            <button type="button" role="tab" aria-selected={realEstate} className={`tab ${realEstate ? "active" : ""}`} onClick={() => setTrack("부동산 트랙")}>부동산 트랙</button>
            <button type="button" role="tab" aria-selected={!realEstate} className={`tab ${!realEstate ? "active" : ""}`} onClick={() => setTrack("지식정보문화 트랙")}>지식정보문화 트랙</button>
          </div>
        </div>

        <div className="roadmap-box">
          <img src={Home_rectangle} alt="" className="roadmap-bg" />
          <div className="roadmap-box-overlay">
            <div className="container">
              <div className="roadmap-headers">
                <div />
                <div className="column-title">추천 트랙</div>
                <div className="column-title">진로 분야</div>
              </div>

              <div className="roadmap-row">
                <div><div className="roadmap-label">단과대학 내</div></div>
                <div className="stack-group">
                  {recommended.map((item, index) => <div className={`roadmap-card ${index === 0 ? "recommended" : ""}`} key={item}>{item}</div>)}
                </div>
                <div className="stack-group">
                  {careers.map((item) => <div className="roadmap-card" key={item}>{item}</div>)}
                </div>
              </div>

              <div className="roadmap-row">
                <div><div className="roadmap-label">단과대학 외</div></div>
                <div className="stack-group">
                  {recommendedOut.map((item) => <div className="roadmap-card" key={item}>{item}</div>)}
                </div>
                <div className="stack-group">
                  {careersOut.map((item) => <div className="roadmap-card" key={item}>{item}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container notices-wrapper" id="contact">
        <SectionTitle 
          icon={Home_notice} 
          title="한성대 공지사항" 
          description="한성대학교의 일정들을 만나보세요." 
          action="+ 더보기" 
          onActionClick={() => onNavigateToNotice()} /* 💡 클릭 시 props 실행! */
        />
        <div className="notice-grid">
          {notices.map(([title, date]) => (
            <a className="notice" href="#notice" key={title}>
              <p className="notice-title">{title}</p>
              <div className="notice-meta"><span>{date}</span><span>→</span></div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default MainPage;