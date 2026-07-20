import React, { useState } from "react";
import "./NoticePage.scss";
// 메인페이지의 레이아웃 스타일 가져오기
import "../Main/MainPage.scss"; 

// 필요한 이미지 에셋 불러오기
import Notice_icon from "../../assets/Home_notice.svg"; 
import notice_logo from "../../assets/notice_logo.svg";
import notice_search from "../../assets/notice_search.svg";
import notice_menu from "../../assets/notice_menu.svg";
import notice_menu_search from "../../assets/notice_menu_search.svg";

// 더미 데이터 (백엔드에서 받아올 데이터 형태)
const noticeList = [
  { id: 1, department: "총무인사팀", title: "[한성대학교] 2026학년도 하반기 직원(경력직) 채용공고", date: "2026-07-08", views: 470 },
  { id: 2, department: "총무인사팀", title: "[한성대학교] 2026학년도 하반기 직원(경력직) 채용공고", date: "2026-07-08", views: 470 },
  { id: 3, department: "RISE사업추진센터", title: "[채용] RISE사업단 임시직 채용 공고", date: "2026-07-06", views: 469 },
  { id: 4, department: "스마트융합교육센터", title: "[채용] 한성대학교 스마트융합교육센터 행정조교 모집", date: "2026-07-06", views: 469 },
  { id: 5, department: "IT인프라팀", title: "[채용] IT인프라팀 상상관 행사공간 담당 야간 조교 모집 공고", date: "2026-07-06", views: 469 },
  { id: 6, department: "학사운영팀", title: "2026학년도 2학기 교차 전부(과) 선발 안내 (7.13~7.17)", date: "2026-07-06", views: 469 },
  { id: 7, department: "학생복지팀", title: "[양식] 국가고시합격자장학금 신청안내 - 국가전문자격시험 합격생", date: "2026-07-06", views: 469 },
  { id: 8, department: "진로취업지원팀", title: "[온라인 취업 멘토링 서비스] 슬기로운 취준생활, 코멘토로 지금 시작!", date: "2026-07-06", views: 469 },
  { id: 9, department: "진로취업지원팀", title: "[기업정보 플랫폼 이용 안내] 취업 전 기업 리얼후기, 잡플래닛에서...", date: "2026-07-06", views: 469 },
  { id: 10, department: "학생성공센터", title: "[학생성공센터] HSP 리뉴얼 사이트 오픈에 따른 참가신청 방법 변...", date: "2026-07-06", views: 469 },
  { id: 11, department: "학생복지팀", title: "[양식] 학술문화예술장학금 신청안내", date: "2026-07-06", views: 469 },
  { id: 12, department: "학사운영팀", title: "[양식] 국가근로장학금 출근부 미입력 사유서 양식 안내", date: "2026-07-06", views: 469 },
];

function NoticePage({ onNavigateToMain, onNavigateToMyPage }) {
  const [searchInput, setSearchInput] = useState("");

  // 💡 검색어가 바뀔 때마다 실시간으로 필터링 처리 (비어있으면 전체 리스트 자동 복구!)
  const filteredNotices = searchInput.trim() === "" 
    ? noticeList 
    : noticeList.filter(
        (notice) =>
          notice.title.includes(searchInput) || notice.department.includes(searchInput)
      );

  // 검색 버튼 클릭 함수 (현재는 실시간으로 반영되지만 버튼 클릭 시에도 정상 작동하도록 유지)
  const handleSearch = () => {
    // 이미 실시간으로 반영되므로 추가 로직 불필요
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="hstep">
      
      {/* 상단 바 영역 */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px', 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaea', 
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        boxSizing: 'border-box'
      }}>
        {/* 로고 영역 */}
        <div 
          onClick={() => onNavigateToMain && onNavigateToMain()} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '150px' }}
        >
          <img 
            src={notice_logo} 
            alt="HSTEP 로고" 
            style={{ height: '24px', width: 'auto', display: 'block' }} 
          />
        </div>
        
        {/* 중앙 메뉴 영역 */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '15px' }}>
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); onNavigateToMain && onNavigateToMain(); }}
            style={{ color: '#4d7ff0', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #4d7ff0', paddingBottom: '4px' }}
          >
            메인홈
          </a>
          <a href="#roadmap" style={{ color: '#333333', textDecoration: 'none' }}>나의 로드맵</a>
          <a href="#jobs" style={{ color: '#333333', textDecoration: 'none' }}>공고 추천</a>
          <a href="#ai-chat" style={{ color: '#333333', textDecoration: 'none' }}>AI채팅</a>
          <a 
            href="#mypage" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateToMyPage && onNavigateToMyPage();
            }}
            style={{ color: '#333333', textDecoration: 'none' }}
          >
            마이페이지
          </a>
          <a href="#contact" style={{ color: '#333333', textDecoration: 'none' }}>문의</a>
        </nav>

        {/* 우측 아이콘 영역 */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '150px', justifyContent: 'flex-end' }}>
          <img src={notice_search} alt="검색" style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
          <img src={notice_menu} alt="메뉴" style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
        </div>
      </header>

      {/* 중앙 공지사항 컨텐츠 영역 */}
      <main className="notice-page">
        <div className="container">
          
          {/* 브레드크럼(경로) */}
          <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#666', marginBottom: '12px' }}>
            <span 
              onClick={() => onNavigateToMain && onNavigateToMain()} 
              style={{ fontWeight: '500', color: '#666', cursor: 'pointer' }}
            >
              메인홈
            </span>
            <span style={{ margin: '0 6px', color: '#ccc' }}>〉</span>
            <span>한성대 공지사항</span>
          </div>

          <div className="notice-header">
            <div className="title-area">
              <img src={Notice_icon} alt="공지사항 아이콘" className="title-icon" />
              <h2>한성대 공지사항</h2>
            </div>
            
            {/* 검색 박스 영역 */}
            <div className="search-box">
              <input 
                type="text" 
                placeholder="공지사항 검색" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} // 글자를 지우는 순간 즉시 전체 리스트 복구!
                onKeyDown={handleKeyDown}
              />
              <button type="button" onClick={handleSearch}>
                <img src={notice_menu_search} alt="검색" style={{ width: '28px', height: '28px' }} />
              </button>
            </div>
          </div>

          <ul className="notice-list">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((item) => (
                <li key={item.id} className="notice-item">
                  <div className={`badge ${item.id <= 4 ? "new" : ""}`}>
                    {item.department}
                  </div>
                  <div className={`title ${item.id <= 4 ? "highlight" : ""}`}>
                    {item.title}
                  </div>
                  <div className="date">{item.date}</div>
                  <div className="views">조회{item.views}</div>
                </li>
              ))
            ) : (
              <li style={{ padding: '50px 0', textAlign: 'center', color: '#999' }}>
                검색된 공지사항이 없습니다.
              </li>
            )}
          </ul>

          <div className="pagination">
            <button className="arrow">«</button>
            <button className="arrow">‹</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <button className="page-num">4</button>
            <button className="page-num">5</button>
            <button className="page-num">6</button>
            <span className="dots">...</span>
            <button className="page-num">147</button>
            <button className="arrow">›</button>
            <button className="arrow">»</button>
          </div>
        </div>
      </main>

      {/* 하단 푸터 영역 */}
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
    </div>
  );
}

export default NoticePage;