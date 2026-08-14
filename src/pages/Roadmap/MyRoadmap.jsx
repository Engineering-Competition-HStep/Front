import React, { useEffect, useState } from 'react';
import './MyRoadmap.scss';

import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import myRoadMap_icon from '../../assets/myRoadMap_icon.svg';
import Home_work from '../../assets/Home_work.svg';

const API_BASE_URL = 'http://localhost:8080';

// TODO(백엔드 연동)
// - GET /api/ai-roadmaps/eligibility            : 로드맵 이용 가능 여부(학점/스펙 등록 여부) 확인
//   -> available이 false면 "등록 전" 화면(기본값), true면 "등록 후" 화면을 보여주면 됩니다.
// - GET /api/ai-roadmaps/me                     : 로드맵 보드(카테고리별 항목) 데이터
// - POST /api/ai-roadmaps/chat                  : AI Roadmap Chat 대화
// - GET /api/tracks                             : 트랙 변경 시뮬레이션 드롭다운 (Signup.jsx와 동일 방식)
// - GET /api/ai-roadmaps/jobs/recommendations   : AI 추천 분야 / HSTEP가 추천하는 직무 / 하단 순위별 카드

const ROADMAP_CATEGORIES = ['공모전', '프로젝트', '자격증', '인턴·대외활동'];

// --- 로드맵 보드(트랙 탭 + 좌측 학년 사이드바 + 인력 양성 유형 배너 + 우측 4열 과목 카드) ---
// MainPage.jsx의 "Roadmap" 섹션(.roadmap-panel) 구조를 그대로 가져와서 MyRoadmap 전용 데이터로 채운 버전입니다.
// 등록 전(비어있는 미리보기)/등록 후(실제 데이터) 화면에서 동일한 <RoadmapCourseBoard>로 함께 씁니다.
// TODO(백엔드 연동): 실제로는 학년별 취득 예정 스펙/활동이 GET /api/ai-roadmaps/me 응답으로 내려와야 합니다.
const ROADMAP_GRADES = ['취준생', '4학년', '3학년', '2학년', '1학년'];
const ROADMAP_BOARD_ROLES = '부동산 UX 디자이너    |    부동산 플랫폼 서비스 기획자';

// 카테고리별로 "어느 학년의 몇 학기 슬롯에 놓일지"를 지정해두면,
// 아래 getBoardColumn()이 학년 선택에 맞춰 2학기(row2)/1학기(row1) 카드를 채워줍니다.
const ROADMAP_BOARD_ITEMS = {
  공모전: [
    { grade: '4학년', slot: 'row1', type: '수상', title: '교내 공모전 진출' },
  ],
  프로젝트: [
    { grade: '4학년', slot: 'row2', type: '심화', title: '부동산 플랫폼 UX 프로젝트' },
    { grade: '3학년', slot: 'row1', type: '심화', title: '카페 리뉴얼 기획 프로젝트' },
    { grade: '2학년', slot: 'row1', type: '핵심', title: '공간 브랜딩 프로젝트' },
  ],
  자격증: [
    { grade: '3학년', slot: 'row2', type: '자격', title: 'GTQ 1급' },
  ],
  '진로·대외활동': [
    { grade: '4학년', slot: 'row1', type: '대외활동', title: '부동산 종합 관제조 개선' },
  ],
};

// 카테고리 + 선택된 학년 -> { row2, row1 } 고정 슬롯으로 변환
function getBoardColumn(category, grade) {
  const entries = ROADMAP_BOARD_ITEMS[category] || [];
  const row2 = entries.find((entry) => entry.grade === grade && entry.slot === 'row2') || null;
  const row1 = entries.find((entry) => entry.grade === grade && entry.slot === 'row1') || null;
  return { row2, row1 };
}

// 등록 전 화면의 로드맵 보드 미리보기용: 아직 등록된 데이터가 없으니 모든 슬롯을 빈 상태로 반환
function getEmptyBoardColumn() {
  return { row2: null, row1: null };
}

// MainPage.jsx의 .roadmap-panel(트랙 탭 + 파란 학년 사이드바 + 인력 양성 유형 배너 + 4열 과목 카드)을
// 그대로 재사용하기 위한 컴포넌트. 등록 전(빈 미리보기)/등록 후(실제 데이터) 화면에서 데이터만 다르게 넣어서 함께 씁니다.
function RoadmapCourseBoard({
  trackTabs,
  activeTrack,
  onTrackChange,
  grades,
  activeGrade,
  onGradeChange,
  roles,
  categories,
  getColumn,
  showTrackTabs = true,
  isRegistered = false,
  memberName = '000',
  onNavigate,
}) {
  return (
    <>
      {showTrackTabs && (
        <div className="roadmapTabs">
          {trackTabs.map((trackName) => (
            <button
              key={trackName}
              type="button"
              className={`roadmapTabBtn ${activeTrack === trackName ? 'roadmapTabBtnActive' : ''}`}
              onClick={() => onTrackChange(trackName)}
            >
              {trackName}
            </button>
          ))}
        </div>
      )}

      <div className="roadmapPanel">
        <div className="roadmapMainBoard">
          {/* 좌측 파란색 학년 사이드바 */}
          <div className="gradeSidebarWrap">
            <div className="gradeSidebar">
              {grades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  className={`gradeBtn ${activeGrade === grade ? 'gradeBtnActive' : ''}`}
                  onClick={() => onGradeChange(grade)}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="roadmapContent">
            {/* 인력 양성 유형 배너 */}
            <div className="roleBanner">
              <span className="roleBadge">
                <img src={Home_work} alt="" className="roleBadgeIcon" />
                AI 추천 분야
              </span>
              <span className="roleText">{roles}</span>
            </div>

            {!isRegistered ? (
            // [미등록 상태] isRegistered가 false일 때 보여줄 중앙 안내 화면
            <div className="emptyStateWrap">
              <p className="emptyMessage">
                나의 로드맵과 트랙 변경 시뮬레이션을 이용하려면<br />
                마이페이지에서 <span className="highlight">학점과 개인 스펙을 먼저 등록</span>해주세요.
              </p>
              
              <p className="emptySubMessage">
                {/* memberName 상태가 비어있을 경우를 대비해 '회원'이라는 기본값을 설정합니다. */}
                등록이 완료되면 {memberName || '회원'}님의 최적의 취업 로드맵을 제공할게요.
              </p>
              
              <button
                className="gotoMyPageBtn"
                onClick={() => onNavigate && onNavigate('mypageRegistration')}
              >
                마이페이지에서 정보 등록하러 가기 &rarr;
              </button>
            </div>
          ) : (
            // [등록 상태] isRegistered가 true일 때 보여줄 기존 로드맵/시뮬레이션 화면
            <div className="roadmapContent">
              {/* 우측 4열 과목/활동 카드 (2학기/1학기 고정 슬롯) */}
              <div className="columnsGrid">
                {categories.map((category) => {
                  const col = getColumn(category, activeGrade);
                  return (
                    <div key={category} className="roadmapColumn">
                      <div className="cardRows">
                        <div className="cardRowSlot">
                          {col.row2 && (
                            <div className="courseCard">
                              <div className="cardHeader">
                                <span className="semester">2학기</span>
                                <span className="divider">|</span>
                                <span className="type">{col.row2.type}</span>
                              </div>
                              <h4 className="courseTitle">{col.row2.title}</h4>
                            </div>
                          )}
                        </div>
                        <div className="cardRowSlot">
                          {col.row1 && (
                            <div className="courseCard">
                              <div className="cardHeader">
                                <span className="semester">1학기</span>
                                <span className="divider">|</span>
                                <span className="type">{col.row1.type}</span>
                              </div>
                              <h4 className="courseTitle">{col.row1.title}</h4>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`bottomBadge ${(col.row2 || col.row1) ? 'bottomBadgeActive' : ''}`}>
                        {category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

            
          </div>
        </div>
      </div>
    </>
  );
}

const RECOMMENDED_JOBS = [
  { rank: 1, name: '부동산 UX 디자이너' },
  { rank: 2, name: '부동산 플랫폼 서비스 기획자' },
  { rank: 3, name: '부동산 디자이너' },
];

const BOTTOM_RANK_CARDS = [
  { rank: 1, track: '부동산 마케팅 트랙', tags: ['특화 UX 프로젝트', '부동산 플랫폼 UX 프로젝트'] },
  { rank: 2, track: '부동산 브랜딩 트랙', tags: ['공간 브랜딩 프로젝트', '부동산 콘텐츠 기획'] },
  { rank: 3, track: '부동산 디자인 트랙', tags: ['부동산 종합 관제조 개선', '부동산 디자인 관제조 개선'] },
];

function MyRoadmap({ onNavigate, memberName: memberNameProp }) {
  // 로그인한 사용자 이름: 부모가 직접 내려주면 그 값을 쓰고,
  // 아니면 로그인 시 저장해둔 accessToken으로 GET /api/members/me를 호출해서 채운다.
  const [memberName, setMemberName] = useState(memberNameProp || '000');
  // 사용자가 선택한 1트랙/2트랙 id (GET /api/members/me의 trackIds)
  const [memberTrackIds, setMemberTrackIds] = useState([]);
  // trackId -> trackName 매핑용, DB의 트랙 전체 목록 (Signup.jsx와 동일한 GET /api/tracks)
  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    if (memberNameProp) {
      setMemberName(memberNameProp);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const controller = new AbortController();

    const fetchMe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/members/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const result = await response.json();

        if (response.ok) {
          const data = result.data || result;
          if (data.name) setMemberName(data.name);
          setMemberTrackIds(data.trackIds || []);
        } else {
          console.error('로그인 사용자 정보 조회 실패:', result.message);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('로그인 사용자 정보 조회 API 통신 에러:', error);
        }
      }
    };

    fetchMe();

    return () => {
      controller.abort();
    };
  }, [memberNameProp]);

  // 트랙 id -> 트랙명 변환에 쓸 전체 트랙 목록 (인증 불필요, Signup.jsx와 동일 방식)
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tracks`);
        const result = await response.json();
        if (response.ok) {
          setTrackList(result.data || []);
        } else {
          console.error('트랙 목록 조회 실패:', result.message);
        }
      } catch (error) {
        console.error('트랙 목록 조회 API 통신 에러:', error);
      }
    };

    fetchTracks();
  }, []);

  // 사용자가 등록한 1트랙/2트랙 이름 (DB 값을 그대로 반영)
  const currentTrackNames = memberTrackIds
    .map((id) => trackList.find((track) => track.trackId === id)?.trackName)
    .filter(Boolean);

  // TODO: 실제로는 GET /api/ai-roadmaps/eligibility 결과(available)로 결정해야 합니다.
  // 지금은 기본 화면(=등록 전 화면)이 먼저 보여야 하므로 false로 고정해뒀습니다.
  const [isRegistered, setIsRegistered] = useState(false);

  // 로드맵 보드(등록 후 화면)에서 선택된 트랙 탭 / 학년
  const [boardTrack, setBoardTrack] = useState(currentTrackNames[0] || '트랙 미등록');
  const [boardGrade, setBoardGrade] = useState(ROADMAP_GRADES[0]);
  // 사용자가 등록한 트랙 이름이 나중에(비동기로) 채워지면 탭 기본값도 맞춰준다
  useEffect(() => {
    if (currentTrackNames.length > 0 && boardTrack === '트랙 미등록') {
      setBoardTrack(currentTrackNames[0]);
    }
  }, [currentTrackNames, boardTrack]);
  const boardTrackTabs = currentTrackNames.length > 0 ? currentTrackNames : ['트랙 미등록'];

  // 트랙 변경 시뮬레이션 선택값 (트랙은 Signup.jsx와 동일하게 백엔드 trackId를 값으로 사용)
  const [simTrack1, setSimTrack1] = useState('');
  const [simTrack2, setSimTrack2] = useState('');
  const [simGrade, setSimGrade] = useState('');
  const [simInterestJob, setSimInterestJob] = useState('');
  // 1트랙을 바꿔서 2트랙과 같아지면, 2트랙 선택을 초기화해서 항상 서로 다른 트랙만 선택되게 함
  const handleSimTrack1Change = (value) => {
    setSimTrack1(value);
    if (value !== '' && value === simTrack2) setSimTrack2('');
  };
  const isSimReady = isRegistered
    ? simTrack1 !== '' && simTrack2 !== '' && simTrack1 !== simTrack2 && simGrade !== '' && simInterestJob !== ''
    : simTrack1 !== '' && simTrack2 !== '' && simTrack1 !== simTrack2 && simGrade !== '';

  // AI Roadmap Chat 입력값 (아직 실제 전송은 안 함, TODO: POST /api/ai-roadmaps/chat 연동)
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="myRoadmap">
      <Header activeMenu="roadmap" onMenuClick={onNavigate} />

      <main className="myRoadmapMain">
        {/* --- 히어로: My Roadmap 소개 --- */}
        <section className="hero">
          <div className="heroText">
            <p className="eyebrow">나의 로드맵</p>
            <h1>My Roadmap</h1>
            <p className="subtitle">
              HSTEP가 {memberName}님의 정보를 분석하여 최적의 진로를 추천해드립니다.
            </p>

            <div className="currentTracks">
              {currentTrackNames.length > 0 ? (
                currentTrackNames.map((trackName) => (
                  <span key={trackName} className="trackTag">{trackName}</span>
                ))
              ) : (
                <span className="trackTag">등록된 트랙 없음</span>
              )}
            </div>
          </div>

          <div className="heroImage">
            <img src={myRoadMap_icon} alt="나의 로드맵 일러스트" />
          </div>
        </section>

        {!isRegistered ? (
          <>
            {/* --- 등록 전 기본 화면 --- */}
            <section className="registerCard">

              {/* 나의 로드맵 미리보기: MainPage.jsx의 .roadmap-panel(트랙 탭+학년 사이드바+과목 카드) 구조를 재사용.
                  아직 학점/스펙을 등록하지 않았으니 카드 슬롯은 전부 빈 상태로 보여줌 */}
              <div className="registerCardInner">
                <RoadmapCourseBoard
                  trackTabs={boardTrackTabs}
                  activeTrack={boardTrack}
                  onTrackChange={setBoardTrack}
                  grades={ROADMAP_GRADES}
                  activeGrade={boardGrade}
                  onGradeChange={setBoardGrade}
                  roles="추후 AI가 추천해줌..?"
                  categories={ROADMAP_CATEGORIES}
                  getColumn={getEmptyBoardColumn}
                  showTrackTabs={false}
                  isRegistered={isRegistered}
                  memberName={memberName}
                  onNavigate={onNavigate}
                />
              </div>
            </section>
          </>
        ) : (
          <>
            {/* --- 등록 후 화면 --- */}
            <section className="roadmapBoard">
              <span className="currentGoalBadge">부동산 브랜딩 코디네이터</span>

              <RoadmapCourseBoard
                trackTabs={boardTrackTabs}
                activeTrack={boardTrack}
                onTrackChange={setBoardTrack}
                grades={ROADMAP_GRADES}
                activeGrade={boardGrade}
                onGradeChange={setBoardGrade}
                roles={ROADMAP_BOARD_ROLES}
                categories={ROADMAP_CATEGORIES}
                getColumn={getBoardColumn}
                isRegistered={isRegistered}
              />
            </section>

            <section className="aiChatSection">
              <h2>AI Roadmap Chat</h2>
              <p className="subtitle">궁금한 것들을 로드맵 챗봇에게 물어보세요</p>

              <div className="chatBubbleRow">
                <span className="chatAvatar" aria-hidden="true">🤖</span>
                <div className="chatBubble">
                  안녕하세요! {memberName}님, HSTEP AI 챗봇이에요. 궁금하신 점을 언제든지 편하게 물어보세요.
                </div>
              </div>

              <button type="button" className="chatSuggestButton">
                나에게 어울리는 트랙 추천받기
              </button>

              <div className="chatInputRow">
                <input
                  type="text"
                  className="chatInput"
                  placeholder="궁금한 점을 입력하세요"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="button" className="chatSendButton" aria-label="전송">➤</button>
              </div>
            </section>
          </>
        )}

        {/* --- 트랙 변경 시뮬레이션 (등록 전/후 공통, 필드 개수만 다름) --- */}
        <section className="simulation">
          <p className="eyebrow">트랙 변경 시뮬레이션</p>
          <h2>Track Change Simulation</h2>
          {isRegistered && (
            <p className="subtitle">관심있는 트랙을 선택해서 결과를 시뮬레이션해보세요</p>
          )}

          <div className={`simulationForm ${isRegistered ? 'simulationFormGrid' : ''}`}>
            <select
              className="simSelect"
              value={simTrack1}
              onChange={(e) => handleSimTrack1Change(e.target.value)}
            >
              <option value="" disabled>1트랙</option>
              {trackList.map((track) => (
                <option key={track.trackId} value={track.trackId}>
                  {track.trackName}
                </option>
              ))}
            </select>

            <select
              className="simSelect"
              value={simTrack2}
              onChange={(e) => setSimTrack2(e.target.value)}
            >
              <option value="" disabled>2트랙</option>
              {trackList.map((track) => (
                <option
                  key={track.trackId}
                  value={track.trackId}
                  disabled={String(track.trackId) === simTrack1}
                >
                  {track.trackName}
                </option>
              ))}
            </select>

            <select className={`simSelect ${!isRegistered ? 'simSelectGrade' : ''}`} value={simGrade} onChange={(e) => setSimGrade(e.target.value)}>
              <option value="" disabled>학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
            </select>

            {isRegistered && (
              <select className="simSelect" value={simInterestJob} onChange={(e) => setSimInterestJob(e.target.value)}>
                <option value="" disabled>관심 직무</option>
              </select>
            )}
          </div>

          {simTrack1 !== '' && simTrack1 === simTrack2 && (
            <p className="simulationError">1트랙과 2트랙은 서로 다르게 선택해주세요.</p>
          )}

          <button
            type="button"
            className={`simulationButton ${isSimReady ? 'simulationButtonActive' : ''}`}
            disabled={!isSimReady}
          >
            변경 결과
          </button>
        </section>

        {isRegistered && (
          <>
            {/* --- HSTEP가 추천하는 직무 --- */}
            <section className="recommendedJobs">
              <h2><span className="hMark">H</span>STEP가 추천 하는 직무</h2>
              <p className="subtitle">회원님의 트랙과 스펙을 분석해서 추천 직무를 알려드립니다</p>

              <div className="jobRankRow">
                {RECOMMENDED_JOBS.map((job) => (
                  <span key={job.rank} className={`jobRankPill ${job.rank === 1 ? 'jobRankPillActive' : ''}`}>
                    {job.rank}순위 {job.name}
                  </span>
                ))}
              </div>
            </section>

            {/* --- CTA 배너 --- */}
            <button
              type="button"
              className="ctaBanner"
              onClick={() => onNavigate && onNavigate('mypageRegistration')}
            >
              {memberName}님의 맞춤 로드맵, 지금 바로 만나보세요
            </button>

            {/* --- 순위별 추천 트랙 상세 --- */}
            <section className="bottomGrid">
              {BOTTOM_RANK_CARDS.map((card) => (
                <div key={card.rank} className="bottomRankCard">
                  <span className={`bottomRankBadge ${card.rank === 1 ? 'bottomRankBadgeActive' : ''}`}>
                    {card.rank}위칸 · {card.track}
                  </span>
                  <div className="bottomRankTags">
                    {card.tags.map((tag) => (
                      <span key={tag} className="bottomRankTag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyRoadmap;
