import React, { useState, useEffect } from "react";
import "./MainPage.scss"; 
import { getAccessToken, getLatestNotices, getMyRoadmaps } from '../../services/hstepApi.js';

// 기존 아이콘 및 배경 이미지
import Home_logo from "../../assets/Home_logo.svg";
import Home_header from "../../assets/Home_header.svg";
import Home_header_image from "../../assets/Home_header_image.svg";
import Home_search from "../../assets/Home_search.svg";
import Home_mypage from "../../assets/Home_mypage.svg";
import HSTEP_logo from "../../assets/HSTEP_logo.svg";
import Home_roadmap from "../../assets/Home_roadmap.svg";
import Home_notice from "../../assets/Home_notice.svg";
import Home_rectangle from "../../assets/Home_rectangle.svg";

// 로드맵 인력 양성 유형 아이콘
import Home_work from "../../assets/Home_work.svg";

// 상단 메뉴바, 하단 푸터 컴포넌트
import Footer from '../../components/Footer/Footer.jsx';

// 공지사항 로고 및 아이콘
import notice_logo from "../../assets/notice_logo.svg";
import notice_search from "../../assets/notice_search.svg";
import notice_menu from "../../assets/notice_menu.svg";

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

function transformServerRoadmaps(roadmaps) {
  if (!Array.isArray(roadmaps) || roadmaps.length === 0) return null;

  return roadmaps.reduce((catalog, roadmap) => {
    const items = Array.isArray(roadmap.items) ? roadmap.items : [];
    const categories = [...new Set(
      [...items]
        .sort((a, b) => (a.itemOrder || 0) - (b.itemOrder || 0))
        .map((item) => item.category)
        .filter(Boolean)
    )].slice(0, 4);

    while (categories.length < 4) categories.push(`추천 역량 ${categories.length + 1}`);

    const grades = {};
    [1, 2, 3, 4].forEach((grade) => {
      grades[`${grade}학년`] = makeGradeColumns(categories.map((category) => {
        const itemFor = (semester) => items.find((item) => (
          item.grade === grade
          && item.semester === semester
          && item.category === category
        ));
        const row1Item = itemFor(1);
        const row2Item = itemFor(2);
        const toCourse = (item) => item ? {
          type: item.levelLabel || item.level || '추천',
          title: item.title,
        } : null;

        return { row2: toCourse(row2Item), row1: toCourse(row1Item) };
      }));
    });

    catalog[roadmap.trackName] = {
      roles: roadmap.title || `${roadmap.trackName} 추천 로드맵`,
      categories: categories.map((name, index) => ({ name, isHighlight: index === categories.length - 1 })),
      grades,
    };
    return catalog;
  }, {});
}

function MainPage({ 
  onNavigate,
  onNavigateToMyPage, 
  onNavigateToNotice, 
  onNavigateToAiChat 
}) {
  const [track, setTrack] = useState("미디어디자인 트랙");
  const [selectedGrade, setSelectedGrade] = useState("4학년");
  
  const [serverNotices, setServerNotices] = useState([]);
  const [serverRoadmapData, setServerRoadmapData] = useState(null);

  // ✨ 1~4학년 데이터: 컬럼별 row2(2학기) / row1(1학기) 고정 슬롯 구조
  const fallbackRoadmapData = {
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

  const roadmapData = serverRoadmapData || fallbackRoadmapData;
  const roadmapTracks = Object.keys(roadmapData);
  const currentRoadmap = roadmapData[track] || roadmapData[roadmapTracks[0]];

  useEffect(() => {
    if (!getAccessToken()) return;

    let cancelled = false;
    Promise.allSettled([getMyRoadmaps(), getLatestNotices(4)]).then(([roadmapsResult, noticesResult]) => {
      if (cancelled) return;

      if (roadmapsResult.status === 'fulfilled') {
        const transformed = transformServerRoadmaps(roadmapsResult.value);
        if (transformed && Object.keys(transformed).length > 0) {
          setServerRoadmapData(transformed);
          setTrack((current) => transformed[current] ? current : Object.keys(transformed)[0]);
        }
      }

      if (noticesResult.status === 'fulfilled' && Array.isArray(noticesResult.value) && noticesResult.value.length > 0) {
        setServerNotices(noticesResult.value);
      }
    });

    return () => { cancelled = true; };
  }, []);

  const handleMenuNavigation = (menu) => {
    if (menu === 'aichat' || menu === 'ai-chat') {
      onNavigateToAiChat ? onNavigateToAiChat() : onNavigate && onNavigate('aichat');
    } else if (menu === 'mypage') {
      onNavigateToMyPage ? onNavigateToMyPage() : onNavigate && onNavigate('mypage');
    } else if (menu === 'notice') {
      onNavigateToNotice ? onNavigateToNotice() : onNavigate && onNavigate('notice');
    } else {
      onNavigate && onNavigate(menu);
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
              {roadmapTracks.map((trackName) => (
                <button
                  key={trackName}
                  type="button"
                  className={`tab-btn ${track === trackName ? "active" : ""}`}
                  onClick={() => setTrack(trackName)}
                >
                  {trackName}
                </button>
              ))}
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
