import React, { useState, useRef, useEffect } from "react";
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

// 로드맵 인력 양성 유형 아이콘
import Home_work from "../../assets/Home_work.svg";

// 취업 공고 회사 로고 및 화살표 이미지
import Home_gooksundang from "../../assets/Home_gooksundang.png";
import Home_adidas_logo from "../../assets/Home_adidas_logo.png";
import Home_toss_logo from "../../assets/Home_toss_logo.png";
import Home_hyndai_logo from "../../assets/Home_hyndai_logo.svg";
import Home_cj_logo from "../../assets/Home_cj_logo.png";
import Home_left from "../../assets/Home_left.png";
import Home_right from "../../assets/Home_right.png";

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

const GRADES = ["4학년", "3학년", "2학년", "1학년"];

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
      {action && <button className="more" onClick={onActionClick}>{action}</button>}
    </div>
  );
}

/*
  ✨ [핵심 수정]
  기존에는 학년별로 카드가 들어있는 컬럼 배열의 "순서"만 다르고 개수가 달라서,
  카드 블록을 세로 중앙 정렬(justify-content: center)하면 학년마다 카드가
  전혀 다른 높이에 떠 있는 것처럼 보였습니다.

  → 모든 컬럼에 "2학기 자리"와 "1학기 자리"를 항상 고정된 슬롯(row2 / row1)으로
  두고, 데이터가 없으면 그 자리를 빈 슬롯(같은 높이)으로 비워두는 방식으로 바꿔서
  1~4학년 어떤 화면에서도 카드 박스 위치/배치가 완전히 동일하게 나오도록 했습니다.
*/
function makeGradeColumns(cols) {
  // cols: 4개 컬럼, 각 컬럼은 { row2, row1 } 또는 null
  return [0, 1, 2, 3].map((i) => cols[i] || { row2: null, row1: null });
}

function MainPage({ 
  onNavigate,
  onNavigateToMyPage, 
  onNavigateToNotice, 
  onNavigateToExternalJobs, 
  onNavigateToExternalJobsMore, 
  onNavigateToAiChat 
}) {
  const [track, setTrack] = useState("미디어디자인 트랙");
  const [selectedGrade, setSelectedGrade] = useState("4학년");
  
  const scrollRef = useRef(null);
  const [serverNotices, setServerNotices] = useState([]);

  // ✨ 1~4학년 데이터: 컬럼별 row2(2학기) / row1(1학기) 고정 슬롯 구조
  const roadmapData = {
    "미디어디자인 트랙": {
      roles: "미디어커뮤니케이션 디자이너    |    영상광고 디자이너",
      categories: [
        { name: "창의적 디자인 발상", isHighlight: false },
        { name: "디자인 커뮤니케이션", isHighlight: false },
        { name: "디자인 비즈니스", isHighlight: false },
        { name: "실무 프로젝트 수행", isHighlight: true }
      ],
      grades: {
        "4학년": makeGradeColumns([
          null, // 1열: 창의적 디자인 발상
          null, // 2열: 디자인 커뮤니케이션
          null, // 3열: 디자인 비즈니스
          {     // 4열: 실무 프로젝트 수행
            row2: { type: "심화", title: "미디어디자인종합설계" },
            row1: { type: "심화", title: "미디어디자인프로젝트" }
          }
        ]),
        "3학년": makeGradeColumns([
          null,
          {     // 2열: 디자인 커뮤니케이션
            row2: { type: "활용", title: "커뮤니케이션그래픽디자인" },
            row1: { type: "활용", title: "모션그래픽" }
          },
          {     // 3열: 디자인 비즈니스
            row2: { type: "활용", title: "모바일인터페이스종합설계" },
            row1: null
          },
          {     // 4열: 실무 프로젝트 수행
            row2: null,
            row1: { type: "심화", title: "인포그래픽" }
          }
        ]),
        "2학년": makeGradeColumns([
          null,
          {     // 2열: 디자인 커뮤니케이션
            row2: { type: "핵심", title: "영상디자인" },
            row1: { type: "핵심", title: "디자인과 인간심리" }
          },
          {     // 3열: 디자인 비즈니스
            row2: { type: "핵심", title: "사용자경험 디자인" },
            row1: { type: "핵심", title: "AI와 HCI" }
          },
          null
        ]),
        "1학년": makeGradeColumns([
          {     // 1열: 창의적 디자인 발상
            row2: { type: "핵심", title: "기초미디어디자인" },
            row1: { type: "핵심", title: "기초미디어디자인" }
          },
          null,
          null,
          null
        ]),
      }
    },
    "지식정보문화 트랙": {
      roles: "콘텐츠 기획자    |    문화 데이터 분석가",
      categories: [
        { name: "기획 및 발상", isHighlight: false },
        { name: "콘텐츠 제작", isHighlight: false },
        { name: "데이터 분석", isHighlight: false },
        { name: "실무 프로젝트", isHighlight: true }
      ],
      grades: {
        "4학년": makeGradeColumns([null, null, null, null]),
        "3학년": makeGradeColumns([null, null, null, null]),
        "2학년": makeGradeColumns([null, null, null, null]),
        "1학년": makeGradeColumns([null, null, null, null]),
      }
    }
  };

  const currentRoadmap = roadmapData[track] || roadmapData["미디어디자인 트랙"];

  useEffect(() => {
    fetch('http://localhost:8080/api/notices/latest?size=4')
      .then((res) => {
        if (!res.ok) throw new Error(`서버 에러 상태 코드: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) setServerNotices(data);
      })
      .catch((err) => {
        console.error("최신 공지사항 불러오기 실패 (더미 데이터로 대체합니다):", err);
      });
  }, []);

  const handleMenuNavigation = (menu) => {
    if (menu === 'jobs' || menu === 'externalJobs') {
      onNavigateToExternalJobs ? onNavigateToExternalJobs() : onNavigate && onNavigate('externalJobs');
    } else if (menu === 'aichat' || menu === 'ai-chat') {
      onNavigateToAiChat ? onNavigateToAiChat() : onNavigate && onNavigate('aichat');
    } else if (menu === 'mypage') {
      onNavigateToMyPage ? onNavigateToMyPage() : onNavigate && onNavigate('mypage');
    } else if (menu === 'notice') {
      onNavigateToNotice ? onNavigateToNotice() : onNavigate && onNavigate('notice');
    } else {
      onNavigate && onNavigate(menu);
    }
  };

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
      {/* 상단 헤더 영역 */}
      <header style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', 
        backgroundColor: 'transparent', zIndex: 9999, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', boxSizing: 'border-box'
      }}>
        <div onClick={() => handleMenuNavigation('main')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '150px' }}>
          <img src={notice_logo} alt="HSTEP 로고" style={{ height: '24px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '15px' }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); handleMenuNavigation('main'); }} style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #ffffff', paddingBottom: '4px' }}>메인홈</a>
          <a href="#roadmap" onClick={(e) => { e.preventDefault(); handleMenuNavigation('roadmap'); }} style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>나의 로드맵</a>
          <a href="#jobs" onClick={(e) => { e.preventDefault(); handleMenuNavigation('externalJobs'); }} style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>공고 추천</a>
          <a href="#ai-chat" onClick={(e) => { e.preventDefault(); handleMenuNavigation('aichat'); }} style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>AI채팅</a>
          <a href="#mypage" onClick={(e) => { e.preventDefault(); handleMenuNavigation('mypage'); }} style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>마이페이지</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); handleMenuNavigation('contact'); }} style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>문의</a>
        </nav>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '150px', justifyContent: 'flex-end' }}>
          <img src={notice_search} alt="검색" style={{ cursor: 'pointer', width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          <img src={notice_menu} alt="메뉴" style={{ cursor: 'pointer', width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
        </div>
      </header>

      {/* 히어로 배너 영역 */}
      <section className="hero" id="home">
        <img src={Home_header} alt="" className="hero-bg" />
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="welcome">어서오세요 000님!</p>
              <h1><strong>HSTEP</strong>에서 함께 입사해봐요</h1>
              <p className="copy">나의 트랙에 맞춰진 전용 로드맵을 AI와 함께 상담하고, 고민해보아요</p>
              <button className="outline-btn" onClick={() => handleMenuNavigation('roadmap')}>나의 로드맵 만들러 가기 <span>→</span></button>
            </div>
          </div>
        </div>
        <img src={Home_header_image} alt="로드맵 일러스트" className="hero-art-img" />
      </section>

      {/* 외부 취업 공고 영역 */}
      <section className="jobs-section" id="jobs">
        <div className="container">
          <SectionTitle 
            icon={Home_advertise} 
            title="외부 취업 공고" 
            description="나에게 맞는 다양한 취업 공고를 만나보세요." 
            action="+ 취업공고 더 보러가기" 
            onActionClick={() => onNavigateToExternalJobsMore ? onNavigateToExternalJobsMore() : handleMenuNavigation('externalJobs')}
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
                <div className="logo"><img src={logoSrc} alt={`${company} 로고`} /></div>
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

      {/* 로드맵 영역 */}
      <section className="roadmap-wrapper" id="roadmap">
        <div className="container">
          <SectionTitle
            icon={Home_roadmap}
            title="Roadmap"
            description="한성대학교에 있는 부동산 트랙/지식정보문화 트랙의 기존 로드맵이에요."
          />
        </div>

        {/* 바깥 패널만 회색으로 두고 로드맵 자체에는 별도 회색 박스를 만들지 않음 */}
        <div className="roadmap-panel">
          <div className="container">
            <div className="roadmap-tabs">
              <button 
                type="button" 
                className={`tab-btn ${track === "미디어디자인 트랙" ? "active" : ""}`} 
                onClick={() => setTrack("미디어디자인 트랙")}
              >
                미디어디자인 트랙
              </button>
              <button 
                type="button" 
                className={`tab-btn ${track === "지식정보문화 트랙" ? "active" : ""}`} 
                onClick={() => setTrack("지식정보문화 트랙")}
              >
                지식정보문화 트랙
              </button>
            </div>

            <div className="roadmap-main-board">
              {/* 좌측 파란색 학년 바 */}
              <div className="grade-sidebar-wrap">
                <div className="grade-sidebar">
                  {GRADES.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      className={`grade-btn ${selectedGrade === grade ? "active" : ""}`}
                      onClick={() => setSelectedGrade(grade)}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div className="roadmap-content">
                {/* 역할 안내를 보드 안쪽 상단에 배치 */}
                <div className="role-banner">
                  <span className="role-badge">
                    <img src={Home_work} alt="" className="role-badge-icon" />
                    인력 양성 유형
                  </span>
                  <span className="role-text">{currentRoadmap.roles}</span>
                </div>

                {/* 우측 4열 과목 카드 영역 (2학기/1학기 고정 슬롯) */}
                <div className="columns-grid">
                  {currentRoadmap.categories.map((cat, colIdx) => {
                    const col = currentRoadmap.grades[selectedGrade][colIdx];
                    return (
                      <div className="roadmap-column" key={cat.name}>
                        <div className="card-rows">
                          <div className="card-row-slot">
                            {col.row2 && (
                              <div className="course-card">
                                <div className="card-header">
                                  <span className="semester">2학기</span>
                                  <span className="divider">|</span>
                                  <span className="type">{col.row2.type}</span>
                                </div>
                                <h4 className="course-title">{col.row2.title}</h4>
                              </div>
                            )}
                          </div>
                          <div className="card-row-slot">
                            {col.row1 && (
                              <div className="course-card">
                                <div className="card-header">
                                  <span className="semester">1학기</span>
                                  <span className="divider">|</span>
                                  <span className="type">{col.row1.type}</span>
                                </div>
                                <h4 className="course-title">{col.row1.title}</h4>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`bottom-badge ${(col.row2 || col.row1) ? "highlight" : ""}`}>
                          {cat.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 공지사항 영역 */}
      <section className="container notices-wrapper" id="contact">
        <SectionTitle 
          icon={Home_notice} 
          title="한성대 공지사항" 
          description="한성대학교의 일정들을 만나보세요." 
          action="+ 더보기" 
          onActionClick={() => handleMenuNavigation('notice')}
        />
        <div className="notice-grid">
          {serverNotices.length > 0 ? (
            serverNotices.map((item, index) => (
              <a className="notice" href={item.url || "#notice"} target="_blank" rel="noreferrer" key={item.id || index}>
                <p className="notice-title">{item.title}</p>
                <div className="notice-meta">
                  <span>{item.publishedAt || item.date || item.createdDate}</span>
                  <span>→</span>
                </div>
              </a>
            ))
          ) : (
            notices.map(([title, date], index) => (
              <a className="notice" href="#notice" key={index} onClick={(e) => { e.preventDefault(); handleMenuNavigation('notice'); }}>
                <p className="notice-title">{title}</p>
                <div className="notice-meta"><span>{date}</span><span>→</span></div>
              </a>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default MainPage;
