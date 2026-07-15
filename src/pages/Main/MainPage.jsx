import React, { useState } from "react";

import Home_logo from "../../assets/Home_logo.svg";
import Home_header from "../../assets/Home_header.svg";
import Home_header_image from "../../assets/Home_header_image.svg";
import HSTEP_logo from "../../assets/HSTEP_logo.svg";
import Home_advertise from "../../assets/Home_advertise.svg";
import Home_roadmap from "../../assets/Home_roadmap.svg";
import Home_notice from "../../assets/Home_notice.svg";
import Home_rectangle from "../../assets/Home_rectangle.svg";

const jobs = [
  ["한국청년기업가정신재단", "한국청년기업가정신재단", ["지식정보문화 트랙 추천"], "청년 직무 아카데미 교육생 모집", "~11월 24일 23:59"],
  ["아디다스", "adidas", ["정보시스템·AI 트랙 추천"], "[신입/경력] 각 부문 인재 채용", "~2월 9일 23:59"],
  ["토스", "toss", ["행정 트랙 추천"], "[신입/경력] 각 부문 인재 채용", "~7월 14일 23:59"],
  ["현대오토에버", "HYUNDAI\nAutoEver", ["사이버보안·AI 트랙 추천", "글로벌비즈니스 트랙 추천"], "9월 인재 모집", "~9월 2일 23:59"],
  ["CJ제일제당", "CJ제일제당", ["기업경영 트랙 추천"], "2026년 3분기 신입 및 경력사원 채용", "~8월 13일 23:59"],
];

const notices = [
  ["2026학년도 2학기 교육 안내 및 신입생 안내 (7.13~7.17)", "2026-07-06"],
  ["[해피투게더] 2026학년도 2학기 미래 직업기술 탐사 모집", "2026-06-29"],
  ["[학적] 국가고시 합격자 장학금 신청 안내", "2026-05-12"],
  ["온라인 취업 멘토링 서비스, 새로운 취업생활을 시작해 보세요.", "2026-05-07"],
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
      {action && <button className="more">{action} →</button>}
    </div>
  );
}

function MainPage() {
  const [track, setTrack] = useState("부동산 트랙");
  const realEstate = track === "부동산 트랙";

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

  return (
    <main className="hstep">
      <style>{`
        .hstep {
          --blue: #4d7ff0;
          --blue-dark: #3f73e4;
          --navy: #34435a;
          --surface-pull: 90px;
          --surface-offset: -90px;
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
        .outline-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 36px;
          padding: 0 12px;
          border: 1px solid rgba(255,255,255,.62);
          border-radius: 0;
          background: transparent;
          color: #fff;
          font-size: 12px;
        }
        .hero-art-img {
          position: absolute;
          z-index: 1;
          right: max(24px, calc((100% - 1476px) / 2));
          bottom: 0;
          width: min(43.333vw, 832px);
          min-width: 0;
          max-width: none;
          transform: none;
        }

        .spacing-160 { margin-top: 120px; }
        .section-title { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; }
        .title-row { display: flex; align-items: center; gap: 8px; }
        .section-icon { width: 30px; height: 30px; object-fit: contain; }
        .section-title h2 { margin: 0; color: #252d3a; font-size: 28px; font-weight: 700; line-height: 1.2; }
        .section-title p { margin: 9px 0 0; color: #5f718a; font-size: 15px; font-weight: 500; }
        .section-title p strong { color: #34435a; font-weight: 700; }
        .more { border: 0; background: none; color: #8792a1; font-size: 14px; }

        .roadmap-wrapper { position: relative; }
        .tabs { display: flex; gap: 24px; margin: 0; }
        .tab {
          padding: 10px 8px 8px;
          border: 0;
          border-bottom: 3px solid transparent;
          background: transparent;
          color: #999;
          font-size: 22px;
          font-weight: 700;
        }
        .tab.active { border-color: var(--blue); color: var(--blue); }

        /*
          회색 배경만 탭 쪽으로 90px 끌어올립니다.
          roadmap-box의 margin-top과 overlay의 padding은 그대로여서,
          내부 헤더·카드·라벨의 화면상 위치는 전혀 바뀌지 않습니다.
        */
        .roadmap-box {
          position: relative;
          isolation: isolate;
          width: 100%;
          margin-top: var(--surface-pull);
        }
        .roadmap-bg {
          position: absolute;
          z-index: 0;
          top: var(--surface-offset);
          left: 0;
          display: block;
          width: 100%;
          height: calc(100% + var(--surface-pull));
          object-fit: fill;
          pointer-events: none;
        }
        .roadmap-box-overlay { position: relative; z-index: 1; padding: 60px 0 100px; }
        .roadmap-headers,
        .roadmap-row { display: grid; grid-template-columns: 140px 1fr 1fr; gap: 40px; }
        .roadmap-headers { margin-bottom: 20px; }
        .roadmap-row { align-items: center; }
        .roadmap-label {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          border-radius: 9px;
          background: #5782eb;
          box-shadow: 0 6px 16px rgba(66, 133, 244, .28);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
        }
        .roadmap-label::after {
          position: absolute;
          top: 50%;
          right: -11px;
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: #5782eb;
          content: "";
          transform: translateY(-50%) rotate(45deg);
        }
        .column-title {
          padding: 9px;
          border-radius: 7px;
          background: #648bce;
          box-shadow: 0 5px 12px rgba(66, 133, 244, .18);
          color: #fff;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
        }
        .stack-group { display: flex; flex-direction: column; gap: 18px; }
        .roadmap-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 8px 18px;
          border: 1px solid #edf0f5;
          border-radius: 7px;
          background: #fff;
          box-shadow: 0 3px 8px rgba(30, 60, 110, .1);
          color: #34435a;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
        }
        .recommended { border: 2px solid var(--blue); color: var(--blue); }
        .recommended::before {
          position: absolute;
          top: -27px;
          left: 0;
          padding: 4px 12px;
          border-radius: 999px;
          background: #a8cbff;
          color: #fff;
          content: "가장 추천하는 트랙";
          font-size: 11px;
          font-weight: 500;
        }
        .roadmap-row + .roadmap-row { margin-top: 80px; }
        .roadmap-row > .stack-group:nth-child(2) .roadmap-card::after {
          position: absolute;
          top: 50%;
          right: -72px;
          width: 50px;
          border-top: 1px solid #8ba0be;
          content: "";
        }
        .roadmap-row > .stack-group:nth-child(2) .roadmap-card::before {
          position: absolute;
          z-index: 1;
          top: calc(50% - 7px);
          right: -73px;
          color: #8ba0be;
          content: "→";
          font-size: 14px;
        }
        .roadmap-row > .stack-group:nth-child(2) .recommended::before {
          top: -27px;
          right: auto;
          left: 0;
          content: "가장 추천하는 트랙";
        }

        .notice-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .notice { display: flex; flex-direction: column; min-height: 130px; padding: 20px 0; border-top: 1px solid #e0e4ea; color: #333; text-decoration: none; }
        .notice-title { display: -webkit-box; flex-grow: 1; margin: 0; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 15px; font-weight: 600; line-height: 1.5; }
        .notice:first-child .notice-title { color: var(--blue); }
        .notice-meta { display: flex; justify-content: space-between; margin-top: 20px; color: #999; font-size: 13px; }

        .jobs-wrapper { margin-bottom: 120px; }
        .job-strip { display: flex; gap: 20px; overflow-x: auto; padding: 0 0 20px; scrollbar-width: none; }
        .job-strip::-webkit-scrollbar { display: none; }
        .job-card { display: flex; flex: 0 0 250px; flex-direction: column; min-height: 230px; padding: 22px; border: 1px solid #f0f0f0; border-radius: 12px; background: #fbfbfb; }
        .logo { display: flex; align-items: center; height: 42px; color: #222; font-family: Arial, sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -.05em; white-space: pre-line; line-height: 1; }
        .company { margin: 20px 0 10px; color: #333; font-size: 15px; font-weight: 700; }
        .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
        .tag { padding: 4px 7px; border-radius: 4px; background: #e8f0fe; color: var(--blue); font-size: 11px; font-weight: 600; }
        .job-title { flex-grow: 1; margin: 0; color: #666; font-size: 13px; line-height: 1.4; }
        .deadline { display: flex; justify-content: space-between; margin-top: auto; color: #999; font-size: 12px; }

        .footer { padding: 55px 0; background: #f4f5f7; color: #7d858f; font-size: 13px; line-height: 1.6; }
        .footer-inner { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 35px; }
        .footer-cs, .footer-links { padding-right: 30px; border-right: 1px solid #e2e5e9; }
        .footer h3 { margin: 0 0 18px; color: #3f464e; font-size: 16px; }
        .footer .time { margin-bottom: 12px; color: #4e555d; font-size: 19px; }
        .footer ul { margin: 0 0 20px; padding-left: 16px; }
        .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-group button { padding: 8px 10px; border: 1px solid #d9dde2; border-radius: 4px; background: #fff; color: #5c6570; font-size: 11px; }
        .footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; color: #59616b; }
        .footer-legal p { margin: 0 0 7px; font-size: 12px; }
        .social { display: flex; gap: 8px; margin: 18px 0; }
        .social span { width: 28px; height: 28px; border-radius: 50%; background: #9299a1; }

        @media (max-width: 1000px) {
          .container, .hero-inner { width: min(1196px, calc(100% - 40px)); }
          .links { gap: 20px; }
          .roadmap-headers, .roadmap-row { grid-template-columns: 1fr 1fr; gap: 22px; }
          .roadmap-label { display: none; }
          .roadmap-row > .stack-group:nth-child(2) .roadmap-card::after,
          .roadmap-row > .stack-group:nth-child(2) .roadmap-card::before { display: none; }
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
          .roadmap-wrapper, .spacing-160 { margin-top: 75px; }
          .section-title { align-items: flex-start; margin-bottom: 25px; }
          .section-title h2 { font-size: 25px; }
          .section-title p { font-size: 14px; }
          .more { display: none; }
          .tabs { gap: 14px; }
          .tab { padding-inline: 4px; font-size: 18px; }
          .roadmap-box { --surface-pull: 55px; --surface-offset: -55px; margin-top: var(--surface-pull); }
          .roadmap-bg { top: var(--surface-offset); height: calc(100% + var(--surface-pull)); }
          .roadmap-box-overlay { padding: 42px 0 70px; }
          .roadmap-headers, .roadmap-row, .notice-grid { grid-template-columns: 1fr; }
          .roadmap-headers { margin-bottom: 16px; }
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

      <section className="roadmap-wrapper spacing-160" id="roadmap">
        <div className="container">
          <SectionTitle
            icon={Home_roadmap}
            title="Roadmap"
            description={<>한성대학교에 있는 <strong>부동산 트랙</strong>/<strong>지식정보문화 트랙</strong>의 기존 로드맵이에요.</>}
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

      <section className="container spacing-160" id="contact">
        <SectionTitle icon={Home_notice} title="한성대학교 공지사항" description="한성대학교의 일정 소식을 만나보세요." action="더보기" />
        <div className="notice-grid">
          {notices.map(([title, date]) => (
            <a className="notice" href="#notice" key={title}>
              <p className="notice-title">{title}</p>
              <div className="notice-meta"><span>{date}</span><span>→</span></div>
            </a>
          ))}
        </div>
      </section>

      <section className="container spacing-160 jobs-wrapper" id="jobs">
        <SectionTitle icon={Home_advertise} title="한눈에 취업 공고" description="나에게 맞는 다양한 취업 공고를 만나보세요." action="취업공고 더 보러가기" />
        <div className="job-strip">
          {jobs.map(([company, logo, tags, title, deadline]) => (
            <article className="job-card" key={company}>
              <div className="logo">{logo}</div>
              <h3 className="company">{company}</h3>
              <div className="tags">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
              <p className="job-title">{title}</p>
              <div className="deadline"><span>{deadline}</span><span>→</span></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-cs">
            <h3>고객센터</h3>
            <div className="time">1670-0000 09:00~18:00</div>
            <ul>
              <li>평일: 전체 문의 상담</li>
              <li>주말 및 공휴일: 긴급 문의만 상담</li>
              <li>일요일: 휴무</li>
            </ul>
            <div className="btn-group"><button>카카오 상담</button><button>이메일 문의</button></div>
          </div>
          <div className="footer-links">
            <span>회사소개</span><span>이용약관</span>
            <span>개인정보 처리방침</span><span>공지사항</span>
            <span>채용문의</span><span>제휴문의</span>
            <span>자주 묻는 질문</span><span>이메일 무단수집거부</span>
          </div>
          <div className="footer-legal">
            <p>한성대학교 HSTEP | 서울특별시 성북구 삼선교로16길 116</p>
            <p>contact@hstep.ac.kr | 사업자등록번호 000-00-00000</p>
            <p style={{ marginTop: 16 }}>HSTEP은 한성대학교 학생을 위한 진로 로드맵 및 취업 정보 지원 서비스입니다.</p>
            <div className="social"><span /><span /><span /><span /></div>
            <p>Copyright 2026. HSTEP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default MainPage;
