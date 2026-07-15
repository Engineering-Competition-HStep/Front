import React, { useState, useRef } from "react";

// 기존 아이콘 및 배경 이미지들
import Home_logo from "../../assets/Home_logo.svg";
import Home_header from "../../assets/Home_header.svg";
import Home_header_image from "../../assets/Home_header_image.svg";
import HSTEP_logo from "../../assets/HSTEP_logo.svg";
import Home_advertise from "../../assets/Home_advertise.svg";
import Home_roadmap from "../../assets/Home_roadmap.svg";
import Home_notice from "../../assets/Home_notice.svg";
import Home_rectangle from "../../assets/Home_rectangle.svg";

// 취업 공고 회사 로고 및 화살표 이미지들
import Home_gooksundang from "../../assets/Home_gooksundang.png";
import Home_adidas_logo from "../../assets/Home_adidas_logo.png";
import Home_toss_logo from "../../assets/Home_toss_logo.png";
import Home_hyndai_logo from "../../assets/Home_hyndai_logo.svg";
import Home_cj_logo from "../../assets/Home_cj_logo.png";
import Home_left from "../../assets/Home_left.png";
import Home_right from "../../assets/Home_right.png";

// 로드맵 화살표 이미지
import Home_line from "../../assets/Home_line.png";

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

function SectionTitle({ icon, title, description, action }) {
  return (
    <div className="section-title">
      <div>
        <div className="title-row">
          {icon && <img src={icon} alt="" className="section-icon" />}
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      {action && <button className="more">{action}</button>}
    </div>
  );
}

function MainPage() {
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
      <style>{`
        .hstep {
          --blue: #4d7ff0;
          --blue-dark: #3f73e4;
          --navy: #34435a;
          min-width: 320px;
          overflow-x: hidden;
          color: var(--navy);
          background: #fff;
          font-family: Pretendard, "Noto Sans KR", Arial, sans-serif;
          letter-spacing: -0.035em;
        }
        .hstep * { box-sizing: border-box; }
        .hstep button { font: inherit; cursor: pointer; }
        .container,
        .hero-inner {
          width: min(1196px, calc(100% - 48px));
          margin: 0 auto;
        }

        .nav {
          position: absolute;
          inset: 0 0 auto;
          z-index: 10;
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 20px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .brand { display: flex; align-items: center; }
        .brand img { width: 107px; height: 24px; filter: brightness(0) invert(1); }
        .links { display: flex; gap: 34px; margin: auto; }
        .links a {
          padding: 4px 0;
          color: #fff;
          font-size: 14px;
          font-weight: 400;
          text-decoration: none;
          opacity: .9;
        }
        .links a:first-child { border-bottom: 1px solid #fff; }
        .tools { display: flex; gap: 18px; color: #fff; font-size: 21px; line-height: 1; }

        .hero { position: relative; height: min(670px, 34.8958vw); min-height: 477px; overflow: hidden; background: #5683ef; }
        .hero-bg { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center center; }
        .hero-overlay { position: absolute; inset: 0; z-index: 1; }
        .hero-inner { position: relative; height: 100%; display: flex; align-items: center; }
        .hero-content { position: relative; z-index: 2; max-width: 52%; padding-top: 26px; }
        .welcome { margin: 0; color: #e8efff; font-size: 24px; font-weight: 400; line-height: 1.4; }
        .hero h1 { margin: 4px 0; color: #fff; font-size: 40px; font-weight: 300; line-height: 1.24; }
        .hero h1 strong { font-weight: 800; }
        .hero p.copy { margin: 12px 0 28px; color: #e8efff; font-size: 14px; font-weight: 300; }
        .outline-btn { display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 12px; border: 1px solid rgba(255,255,255,.62); border-radius: 0; background: transparent; color: #fff; font-size: 12px; }
        .hero-art-img { position: absolute; z-index: 1; right: max(24px, calc((100% - 1476px) / 2)); bottom: 0; width: min(43.333vw, 832px); min-width: 0; max-width: none; transform: none; }

        .spacing-160 { margin-top: 120px; }
        .section-title { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; }
        .title-row { display: flex; align-items: center; gap: 10px; }
        .section-icon { width: 36px; height: 36px; object-fit: contain; }
        .section-title h2 { margin: 0; color: #252d3a; font-size: 32px; font-weight: 700; line-height: 1.2; }
        .section-title p { margin: 9px 0 0; color: #5f718a; font-size: 16px; font-weight: 500; }
        .more { border: 0; background: none; color: #8792a1; font-size: 14px; }

        .jobs-section { margin-top: 120px; position: relative; width: 100vw; margin-left: calc(50% - 50vw); }
        .carousel-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .blur-edge { position: absolute; top: 0; bottom: 0; width: 150px; z-index: 5; pointer-events: none; }
        .blur-left { left: 0; background: linear-gradient(to right, rgba(255,255,255,1) 10%, rgba(255,255,255,0)); }
        .blur-right { right: 0; background: linear-gradient(to left, rgba(255,255,255,1) 10%, rgba(255,255,255,0)); }
        .nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: none; border: none; padding: 0; cursor: pointer; transition: transform 0.2s; pointer-events: auto; }
        .nav-arrow:hover { transform: translateY(-50%) scale(1.1); }
        .nav-arrow img { width: 44px; height: 44px; object-fit: contain; }
        .left-arrow { left: 24px; }
        .right-arrow { right: 24px; }
        
        .job-strip { 
          display: flex; 
          gap: 20px; 
          overflow-x: auto; 
          width: 100%;
          padding: 0 calc(50vw - 1196px / 2) 20px; 
          scrollbar-width: none; 
          scroll-behavior: smooth; 
        }
        .job-strip::-webkit-scrollbar { display: none; }
        .job-card { display: flex; flex: 0 0 260px; flex-direction: column; min-height: 230px; padding: 22px; border: 1px solid #f0f0f0; border-radius: 12px; background: #fff; }
        .logo { display: flex; align-items: center; height: 48px; margin-bottom: 12px; }
        .logo img { max-width: 140px; max-height: 100%; object-fit: contain; }
        .company { margin: 16px 0 10px; color: #333; font-size: 15px; font-weight: 700; }
        .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
        .tag { padding: 4px 7px; border-radius: 4px; background: #e8f0fe; color: var(--blue); font-size: 11px; font-weight: 600; }
        .job-title { flex-grow: 1; margin: 0; color: #666; font-size: 13px; line-height: 1.4; }
        .deadline { display: flex; justify-content: space-between; margin-top: auto; color: #999; font-size: 12px; }


        /* [조절 포인트] 로드맵 전체 위치: 값을 키울수록 회색 패널을 포함한 섹션 전체가 아래로 내려갑니다. */
        .roadmap-wrapper { position: relative; margin-top: 120px; }
        .tabs { display: flex; gap: 30px; margin-bottom: 24px; align-items: flex-end; padding-left: 5px; }
        

        /* 선택 탭은 부담스럽지 않도록 크기·굵기 변화만 작게 유지 */
        .tab { padding: 10px 4px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: #777; font-size: 18px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tab.active { border-color: var(--blue); color: var(--blue); font-size: 22px; font-weight: 600; padding-bottom: 8px; }


        /* 💡 2. 로드맵 배경 박스 오류 해결 (겹침, 잘림 현상 제거) */
        .roadmap-box {
          position: relative;
          isolation: isolate;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-top: 20px;
        }
        .roadmap-bg { 
          position: absolute; 
          z-index: 0; 
          top: 0; 
          left: 0; 
          display: block; 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          object-position: top left;
          pointer-events: none; 
          filter: drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.08)); 
        }
        
        /* Home_rectangle의 외부 그림자는 유지하고, 패널 안쪽에만 은은한 깊이감을 추가 */
        .roadmap-box::after {
          position: absolute;
          z-index: 1;
          inset: 0;
          pointer-events: none;
          content: "";
          box-shadow:
            inset 0 16px 28px rgba(65, 83, 118, 0.13),
            inset 0 -12px 24px rgba(65, 83, 118, 0.06);
          -webkit-mask: url('${Home_rectangle}') top left / cover no-repeat;
          mask: url('${Home_rectangle}') top left / cover no-repeat;
        }

        .roadmap-box-overlay { 
          position: relative; 
          z-index: 2; 
          padding: 160px 0 130px; 
        }
        
        .roadmap-headers,
        .roadmap-row { 
          display: grid; 
          grid-template-columns: 120px 300px 300px; 
          justify-content: center; 
          gap: 60px; 
        }


        /* [조절 포인트] 헤더 → 첫 카드 여백: 값을 키울수록 ‘추천 트랙/진로 분야’와 첫 카드가 더 멀어집니다. */
        .roadmap-headers { margin-bottom: 56px; }
        .roadmap-row { align-items: center; }
        

        /* 💡 3. 파란색 박스 높이 연장 (60px -> 100px) */
        .roadmap-label { 
          position: relative; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100px; 
          border-radius: 9px; 
          background: #5782eb; 
          box-shadow: 0 6px 16px rgba(66, 133, 244, 0.35);
          color: #fff; 
          font-size: 16px; 
          font-weight: 600; 
        }
        .roadmap-label::after { position: absolute; top: 50%; right: -11px; width: 22px; height: 22px; border-radius: 4px; background: #5782eb; content: ""; transform: translateY(-50%) rotate(45deg); }
        .column-title { padding: 9px; border-radius: 7px; background: #648bce; box-shadow: 0 5px 12px rgba(66, 133, 244, .18); color: #fff; text-align: center; font-size: 15px; font-weight: 600; }
        
        .stack-group { display: flex; flex-direction: column; gap: 18px; }
        
        .roadmap-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 8px 18px;
          border-radius: 7px;
          background: #fff;
          border: 1px solid #edf0f5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          color: #34435a;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
        }
        
        .recommended { border: 2px solid var(--blue); color: var(--blue); background: #fff; box-shadow: 0 6px 16px rgba(77, 127, 240, 0.15); }
        .recommended::before { position: absolute; top: -27px; left: 0; padding: 4px 12px; border-radius: 999px; background: #a8cbff; color: #fff; content: "가장 추천하는 트랙"; font-size: 11px; font-weight: 500; }
        
        .roadmap-row + .roadmap-row { margin-top: 80px; }
        
        .roadmap-row > .stack-group:nth-child(2) .roadmap-card::after {
          position: absolute;
          top: 50%;
          right: -45px;
          width: 30px;
          height: 12px;
          transform: translateY(-50%);
          background: url('${Home_line}') no-repeat center center;
          background-size: contain;
          content: "";
          border: none;
        }
        .roadmap-row > .stack-group:nth-child(2) .roadmap-card::before { display: none; }
        .roadmap-row > .stack-group:nth-child(2) .recommended::before { display: block; top: -27px; right: auto; left: 0; content: "가장 추천하는 트랙"; }

        .notices-wrapper { margin-top: 120px; margin-bottom: 200px; }
        .notice-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .notice { display: flex; flex-direction: column; min-height: 130px; padding: 20px 0; border-top: 1px solid #e0e4ea; color: #333; text-decoration: none; }
        .notice-title { display: -webkit-box; flex-grow: 1; margin: 0; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 15px; font-weight: 600; line-height: 1.5; }
        .notice:first-child .notice-title { color: var(--blue); }
        .notice-meta { display: flex; justify-content: space-between; margin-top: 20px; color: #999; font-size: 13px; }

        /* [조절 포인트] 푸터 세로 높이: 위·아래 값을 줄일수록 고객센터를 포함한 회색 푸터 전체가 낮아집니다. */
        .footer { padding: 26px 0; background: #f4f5f7; color: #7d858f; font-size: 13px; line-height: 1.4; }
        .footer-inner { display: grid; grid-template-columns: 0.65fr 1.05fr 1.7fr; gap: 35px; }
        .footer-cs, .footer-links { padding-right: 30px; border-right: 1px solid #e2e5e9; }
        .footer h3 { margin: 0 0 12px; color: #3f464e; font-size: 16px; }
        .footer .time { margin-bottom: 8px; color: #4e555d; font-size: 19px; }
        .footer ul { margin: 0 0 12px; padding-left: 16px; }
        .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-group button { padding: 8px 10px; border: 1px solid #d9dde2; border-radius: 4px; background: #fff; color: #5c6570; font-size: 11px; }
        /* [조절 포인트] 푸터 링크 행간: 값을 줄일수록 가운데 링크 영역과 푸터 전체 높이가 더 압축됩니다. */
        .footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; color: #59616b; }
        .footer-legal p { margin: 0 0 4px; font-size: 12px; }
        .social { display: flex; gap: 8px; margin: 10px 0; }
        .social span { width: 28px; height: 28px; border-radius: 50%; background: #9299a1; }

        @media (max-width: 1000px) {
          .container, .hero-inner { width: min(1196px, calc(100% - 40px)); }
          .links { gap: 20px; }
          .nav-arrow, .blur-edge { display: none; }
          .roadmap-headers, .roadmap-row { grid-template-columns: 1fr 1fr; gap: 22px; }
          .roadmap-label { display: none; }
          .roadmap-row > .stack-group:nth-child(2) .roadmap-card::after { display: none; }
          .notice-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-inner { grid-template-columns: 1fr; }
          .footer-cs, .footer-links { padding: 0 0 25px; border-right: 0; border-bottom: 1px solid #e2e5e9; }
        }
        @media (max-width: 640px) {
          .nav { height: 56px; padding: 0 16px; }
          .links { display: none; }
          .tools { margin-left: auto; }
          .hero { height: 430px; min-height: 0; }
          .hero-content { max-width: 100%; padding-top: 30px; }
          .hero h1 { font-size: 32px; }
          .hero-art-img { right: -8vw; width: 74vw; opacity: .7; }
          .jobs-section, .notices-wrapper { margin-top: 75px; }

          
          .roadmap-wrapper { margin-top: 60px; }
          .section-title { align-items: flex-start; margin-bottom: 25px; }
          .section-icon { width: 32px; height: 32px; }
          .section-title h2 { font-size: 29px; }
          .section-title p { font-size: 15px; }
          .more { display: none; }
          .tabs { gap: 14px; }
          .tab { padding-inline: 4px; font-size: 18px; }
          .roadmap-box { margin-top: 20px; }
          
          /* [조절 포인트 - 모바일] 로드맵 전체 위치 */
          .roadmap-box-overlay { padding: 120px 0 130px; }
          .roadmap-headers, .roadmap-row, .notice-grid { grid-template-columns: 1fr; }


          /* [조절 포인트 - 모바일] 헤더 → 첫 카드 여백 */
          .roadmap-headers { margin-bottom: 44px; }
          .roadmap-row + .roadmap-row { margin-top: 55px; }
          .notice-grid { gap: 0; }
          .footer-links { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="nav">
        <div className="brand"><img src={HSTEP_logo} alt="HSTEP" /></div>
        <nav className="links" aria-label="주 메뉴">
          <a href="#home">메인홈</a>
          <a href="#roadmap">나의 로드맵</a>
          <a href="#jobs">공고 추천</a>
          <a href="#ai-chat">AI채팅</a>
          <a href="#mypage">마이페이지</a>
          <a href="#contact">문의</a>
        </nav>
        <div className="tools" aria-label="도구"><span>⌕</span><span>☰</span></div>
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

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-cs">
            <h3>고객센터 〉</h3>
            <div className="time">1670-0876 09:00~18:00</div>
            <ul>
              <li>평일: 전체 문의 상담</li>
              <li>토요일, 공휴일: 오늘의집 직접배송 주문건 상담</li>
              <li>일요일: 휴무</li>
            </ul>
            <div className="btn-group">
              <button>카톡 상담(평일 09:00~18:00)</button>
              <button>이메일 문의</button>
            </div>
          </div>
          <div className="footer-links">
            <span>회사소개</span><span>회사소개</span>
            <span>회사소개</span><span>회사소개</span>
            <span>회사소개</span><span>파트너 개인정보 처리방침</span>
            <span>개인정보 처리방침</span><span>회사소개</span>
            <span>회사소개</span><span>회사소개</span>
            <span>회사소개</span><span>회사소개</span>
            <span>회사소개</span>
          </div>
          <div className="footer-legal">
            <p>(주)버킷플레이스 | 대표이사 이승재 | 서울 서초구 서초대로74길 4 삼성생명서초타워 25층, 27층</p>
            <p>contact@bucketplace.net | 사업자등록번호 119-86-91245 사업자정보확인</p>
            <p>통신판매업신고번호 제2018-서울서초-0580호</p>
            <p style={{ marginTop: 16 }}>고객님이 현금결제한 금액에 대해 우리은행과 채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다. 서비스가입사실확인</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0' }}>
              <div style={{ padding: '6px 12px', border: '1px solid #d9dde2', borderRadius: 4, fontSize: 11 }}>오늘의집 서비스 운영<br/>2024. 09. 08 ~ 2027. 09. 07</div>
            </div>
            <p style={{ fontSize: 11, color: '#999' }}>
              (주)버킷플레이스는 통신판매중개자로 거래 당사자가 아니므로, 판매자가 등록한 상품정보 및 거래 등에 대해 책임을 지지 않습니다. 단, (주)버킷플레이스가 판매자로 등록 판매한 상품은 판매자로서 책임을 부담합니다.
            </p>
            <div className="social"><span /><span /><span /><span /></div>
            <p>Copyright 2014. bucketplace, Co., Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default MainPage;
