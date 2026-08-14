import React, { useState, useEffect } from 'react';
import styles from './MyPage.module.css';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer.jsx';

import bannerImg from '../../assets/mypage_banner.svg';
import mySpecsIcon from '../../assets/mypage_mySpecs.svg';
import writeIcon from '../../assets/mypage_writeIcon.svg';
import userProfileIcon from '../../assets/mypage_user_profile.svg';
import { parseVolunteerDescription } from '../../utils/profileFormat';

const API_BASE_URL = 'http://localhost:8080';

// App.jsx에서 내려줄 수 있는 모든 이동 관련 props를 안전하게 다 받도록 확대
export default function MyPage({
  onNavigate,
  onNavigateToMain,
  onNavigateToNotice,
  onNavigateToExternalJobs,
  onNavigateToAiChat
}) {
  // 로그인한 사용자 정보 (학번/학년/전체평균 등)
  const [memberInfo, setMemberInfo] = useState(null);

  // 학년별 평점 목록, 개인스펙 4종 목록 - DB에서 그대로 불러와 읽기 전용으로 보여줍니다.
  const [gradeGpaList, setGradeGpaList] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [awards, setAwards] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activities, setActivities] = useState([]);

  // trackId -> trackName 매핑용, DB의 트랙 전체 목록 (로그인 없이도 조회 가능한 공개 API)
  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/tracks`, { signal: controller.signal })
      .then((res) => res.json().then((result) => ({ ok: res.ok, result })))
      .then(({ ok, result }) => {
        if (ok) setTrackList(result.data || []);
        else console.error('트랙 목록 조회 실패:', result.message);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('트랙 목록 조회 API 통신 에러:', error);
      });

    return () => controller.abort();
  }, []);

  // 로그인한 사용자의 학점/개인스펙을 DB에서 불러옵니다.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const meResponse = await fetch(`${API_BASE_URL}/api/members/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const meResult = await meResponse.json();

        if (!meResponse.ok) {
          console.error('회원 정보 조회 실패:', meResult.message);
          return;
        }

        const me = meResult.data || meResult;
        setMemberInfo(me);

        const qs = `userId=${encodeURIComponent(me.userId)}`;
        const authHeaders = { Authorization: `Bearer ${token}` };

        const [gpaRes, certRes, awardRes, volRes, actRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/profile/grade-gpa?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/certificates?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/awards?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/volunteers?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/activities?${qs}`, { headers: authHeaders, signal: controller.signal }),
        ]);

        if (gpaRes.ok) setGradeGpaList(await gpaRes.json());
        if (certRes.ok) setCertificates(await certRes.json());
        if (awardRes.ok) setAwards(await awardRes.json());
        if (volRes.ok) setVolunteers(await volRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('마이페이지 정보 불러오기 실패:', error);
        }
      }
    };

    loadProfile();
    return () => controller.abort();
  }, []);

  const userGrade = memberInfo?.grade ?? null;

  // 회원의 trackIds(최대 2개)를 실제 트랙명으로 변환 (1트랙/2트랙)
  const myTrackNames = (memberInfo?.trackIds || [])
    .map((trackId) => trackList.find((t) => t.trackId === trackId)?.trackName)
    .filter(Boolean);

  // 트랙 수정
  const [isEditingTracks, setIsEditingTracks] = useState(false);
  const [editTrack1, setEditTrack1] = useState('');
  const [editTrack2, setEditTrack2] = useState('');
  const [isSavingTracks, setIsSavingTracks] = useState(false);

  const openTrackEditor = () => {
    const [t1, t2] = memberInfo?.trackIds || [];
    setEditTrack1(t1 != null ? String(t1) : '');
    setEditTrack2(t2 != null ? String(t2) : '');
    setIsEditingTracks(true);
  };

  // 1트랙을 바꿨는데 2트랙과 같아지면, 2트랙 선택을 초기화
  const handleEditTrack1Change = (value) => {
    setEditTrack1(value);
    if (value !== '' && value === editTrack2) setEditTrack2('');
  };

  const isTrackEditValid = editTrack1 !== '' && editTrack2 !== '' && editTrack1 !== editTrack2;

  const handleSaveTracks = async () => {
    if (!isTrackEditValid || isSavingTracks) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    setIsSavingTracks(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackIds: [Number(editTrack1), Number(editTrack2)] }),
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.message || '트랙 수정에 실패했습니다.');
        return;
      }

      setMemberInfo(result.data || result);
      setIsEditingTracks(false);
    } catch (error) {
      console.error('트랙 수정 API 통신 에러:', error);
      alert('트랙 수정 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setIsSavingTracks(false);
    }
  };

  // 학점 하나라도 있거나, 개인스펙 4종 중 하나라도 있으면 '등록된 사용자' 화면으로 취급합니다.
  const hasGradeData = gradeGpaList.length > 0 || memberInfo?.gpa != null;
  const hasAnyData =
    hasGradeData ||
    certificates.length > 0 ||
    awards.length > 0 ||
    volunteers.length > 0 ||
    activities.length > 0;

  // 어떤 방식의 메뉴 클릭이 들어와도 안전하게 이동시키는 통합 핸들러 함수 추가
  const handleMenuNavigation = (menu) => {
    if (menu === 'main' || menu === 'home') {
      onNavigateToMain ? onNavigateToMain() : onNavigate && onNavigate('main');
    } else if (menu === 'jobs' || menu === 'externalJobs') {
      onNavigateToExternalJobs ? onNavigateToExternalJobs() : onNavigate && onNavigate('externalJobs');
    } else if (menu === 'aichat' || menu === 'ai-chat') {
      onNavigateToAiChat ? onNavigateToAiChat() : onNavigate && onNavigate('aichat');
    } else if (menu === 'notice') {
      onNavigateToNotice ? onNavigateToNotice() : onNavigate && onNavigate('notice');
    } else {
      onNavigate && onNavigate(menu);
    }
  };

  const renderSpecValue = (value, placeholder, isHighlight = false) => {
    if (value) {
      // 값이 있을 때: 실제 데이터 표시
      return (
        <div
          className={styles.specInput}
          style={{
            textAlign: 'left',
            color: isHighlight ? '#0356C8' : '#1A1A1A',
            fontWeight: isHighlight ? 'bold' : 'normal'
          }}
        >
          {value}
        </div>
      );
    }
    if (hasAnyData) {
      // 내 데이터가 있을 때
      return <div className={styles.specInput} style={{ textAlign: 'left' }}>{' '}</div>;
    }
    // 초기 상태
    return <div className={styles.specInput} style={{ textAlign: 'left', color: '#aaa' }}>{placeholder}</div>;
  };

  return (
    <div className={styles.pageContainer}>

      {/* 상단 메뉴바 컴포넌트 */}
      {/* 통합 핸들러를 연결하여 Header에서 AI채팅 등을 눌렀을 때 이동하도록 수정 */}
      <Header
        activeMenu="mypage"
        onMenuClick={(menu) => handleMenuNavigation(menu)}
      />

      {/* 메인 컨텐츠 영역 */}
      <main className={styles.mainContent}>

        {/* === 왼쪽 사이드바 (프로필) === */}
        <aside className={styles.sidebar}>
          <div className={styles.pageTitle}>
            <span>마이페이지</span>
            <h1>My Page</h1>
          </div>

          <div className={`${styles.profileCard} ${isEditingTracks ? styles.profileCardNoClip : ''}`}>
              {/* 유저 아바타 아이콘 */}
              <button
              className={styles.profileImgBtn}
              onClick={() => alert('프로필 사진 변경 기능..?')}
            >
              <img
                src={userProfileIcon}
                alt="유저 프로필"
                className={styles.profileImage}
              />
            </button>

            <h2 className={styles.userName}>{memberInfo?.name || '000'}</h2>

            <div className={styles.userTracks}>
              {myTrackNames.length > 0
                ? myTrackNames.map((name, idx) => (
                    <React.Fragment key={name}>
                      {idx > 0 && <br/>}
                      {name}
                    </React.Fragment>
                  ))
                : '등록된 트랙이 없어요.'}
            </div>

            <div className={styles.trackEditArea}>
              <button className={styles.trackEditToggle} onClick={openTrackEditor}>
                수정하기
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {isEditingTracks && (
                <>
                  {/* 팝오버 바깥을 클릭하면 닫히도록 하는 투명 오버레이 */}
                  <button
                    className={styles.trackPopoverBackdrop}
                    aria-label="닫기"
                    onClick={() => setIsEditingTracks(false)}
                  />
                  <div className={styles.trackPopover}>
                    <select
                      className={styles.trackPopoverSelect}
                      value={editTrack1}
                      onChange={(e) => handleEditTrack1Change(e.target.value)}
                    >
                      <option value="" disabled>1트랙</option>
                      {trackList.map((track) => (
                        <option key={track.trackId} value={track.trackId}>
                          {track.trackName}
                        </option>
                      ))}
                    </select>

                    <select
                      className={styles.trackPopoverSelect}
                      value={editTrack2}
                      onChange={(e) => setEditTrack2(e.target.value)}
                    >
                      <option value="" disabled>2트랙</option>
                      {trackList.map((track) => (
                        <option
                          key={track.trackId}
                          value={track.trackId}
                          disabled={String(track.trackId) === editTrack1}
                        >
                          {track.trackName}
                        </option>
                      ))}
                    </select>

                    {editTrack1 !== '' && editTrack1 === editTrack2 && (
                      <span className={styles.trackPopoverWarning}>1트랙과 2트랙은 서로 다르게 선택해주세요.</span>
                    )}

                    <button
                      className={styles.trackPopoverSaveBtn}
                      onClick={handleSaveTracks}
                      disabled={!isTrackEditValid || isSavingTracks}
                    >
                      {isSavingTracks ? '저장 중...' : '수정 완료'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              className={styles.bookmarkBtn}
              onClick={() => handleMenuNavigation('externalJobs')}
            >
              <div className={styles.bookmarkInner}>
                {/* 북마크 아이콘 */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" color="#555">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                찜한 기업 공고
              </div>
              {/* 화살표 아이콘 */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </aside>

        {/* === 오른쪽 메인 컨텐츠 === */}
        <section className={styles.contentArea}>

          {/* 상단 파란색 안내 배너 */}
          <div className={styles.infoBanner}>
            <p className={styles.bannerText}>
              <strong>학점 및 경력을 등록</strong>해야 <strong>전용 로드맵</strong>과 <strong>AI채팅</strong>을 사용할 수 있습니다.<br/>
              학교 내의 활동도 등록 가능하며,<br/>
              자신의 <strong>트랙에 맞는 스펙</strong>을 넣어야 AI가 정확하게 분석합니다.<br/>
              나의 트랙에 관련된 <strong>나만의 로드맵</strong>을 만들어보세요.
            </p>
            {/* 우측 문서 일러스트 */}
            <img src={bannerImg} alt="배너 일러스트" className={styles.bannerIllustration} />
          </div>

          {/* 나의 학점평균 섹션 */}
          <section className={styles.gpaSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>나의 학점평균</h3>
              <button className={styles.writeBtn} onClick={() => onNavigate && onNavigate('mypageRegistration')}>
                <img src={writeIcon} alt="수정 아이콘" className={styles.writeIcon} />
                {hasAnyData ? '수정하기' : '작성하기'}
              </button>
            </div>
            <p className={styles.sectionDesc}>*종합정보시스템 &gt; 학적 &gt; 학적조회 &gt; 성적사항</p>

            <div className={styles.gpaContainer}>
              {['1학년', '2학년', '3학년', '4학년'].map((label, idx) => {
                const gradeNum = idx + 1;
                const isLocked = userGrade != null && gradeNum > userGrade;
                const row = gradeGpaList.find((r) => r.grade === gradeNum);
                const value = row?.gpa != null ? String(row.gpa) : '';

                return (
                  <div key={label} className={styles.inputRow}>
                    <div className={styles.gradePill}>{label}</div>
                    <div
                      className={styles.underlineInput}
                      style={{ color: isLocked ? '#aaa' : value ? '#333' : '#aaa' }}
                    >
                      {isLocked ? '현재 학년보다 높아요.' : (value || `${label} 학점평균을 입력해주세요.`)}
                    </div>
                  </div>
                );
              })}

              <div className={styles.divider}></div>

              <div className={styles.inputRow}>
                <div className={`${styles.gradePill} ${styles.totalPill}`}>전체평균</div>
                <div
                  className={`${styles.underlineInput} ${styles.totalInput}`}
                  style={{ color: memberInfo?.gpa != null ? '#144574' : '#aaa' }}
                >
                  {memberInfo?.gpa != null ? String(memberInfo.gpa) : '전체 학점평균을 입력해주세요.'}
                </div>
              </div>
            </div>
          </section>

          {/* 나의 개인스펙 섹션 - 등록된 카테고리만 보여줍니다. */}
          <div>
            <h3 className={styles.sectionTitle}>나의 개인스펙</h3>
            <p className={styles.sectionDesc}>*언제든 수정 가능합니다.</p>

            <div className={styles.specContainer}>

              {/* 자격증 - 아무것도 등록 안 한 첫 화면에서는 안내용으로 보여주고, 다른 스펙은 있는데 이것만 없으면 숨깁니다. */}
              {(!hasAnyData || certificates.length > 0) && (
                <div>
                  <div className={styles.specItemHeader}>
                    <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                    <h4 className={styles.specItemTitle}>자격증</h4>
                  </div>
                  <div className={styles.specInputWrapper}>
                    {certificates.length > 0 ? (
                      certificates.map((item) => (
                        <div key={item.certificateId} style={{ display: 'flex', gap: '30px' }}>
                          <div style={{ flex: 1 }}>{renderSpecValue(item.certificateName, '예 ) GTQ 1급')}</div>
                          <div style={{ flex: 1 }}>{renderSpecValue(item.issuedYear, '예 ) 2024.5.6')}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) GTQ 1급')}</div>
                        <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) 2024.5.6')}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 수상경력 - 아무것도 등록 안 한 첫 화면에서는 안내용으로 보여주고, 다른 스펙은 있는데 이것만 없으면 숨깁니다. */}
              {(!hasAnyData || awards.length > 0) && (
                <div>
                  <div className={styles.specItemHeader}>
                    <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                    <h4 className={styles.specItemTitle}>수상경력</h4>
                  </div>
                  <div className={styles.specInputWrapper}>
                    {awards.length > 0 ? (
                      awards.map((item) => (
                        <React.Fragment key={item.awardId}>
                          <div style={{ display: 'flex', gap: '30px' }}>
                            <div style={{ flex: 1 }}>{renderSpecValue(item.competitionName, '예 ) KOBACO 공익광고 공모전', true)}</div>
                            <div style={{ flex: 1 }}>{renderSpecValue(item.awardName, '예 ) 대상', true)}</div>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <div style={{ flex: 1 }}>{renderSpecValue(item.description, '간단설명')}</div>
                          </div>
                        </React.Fragment>
                      ))
                    ) : (
                      <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) KOBACO 공익광고 공모전', true)}</div>
                        <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) 대상', true)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 자원봉사 - 아무것도 등록 안 한 첫 화면에서는 안내용으로 보여주고, 다른 스펙은 있는데 이것만 없으면 숨깁니다. */}
              {(!hasAnyData || volunteers.length > 0) && (
                <div>
                  <div className={styles.specItemHeader}>
                    <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                    <h4 className={styles.specItemTitle}>자원봉사</h4>
                  </div>
                  <div className={styles.specInputWrapper}>
                    {volunteers.length > 0 ? (
                      volunteers.map((item) => {
                        const { agency, desc } = parseVolunteerDescription(item.description);
                        return (
                          <React.Fragment key={item.volunteerId}>
                            <div style={{ display: 'flex', gap: '30px' }}>
                              <div style={{ flex: 1 }}>{renderSpecValue(item.volunteerName, '예 ) 김장 나눔 봉사')}</div>
                              <div style={{ flex: 1 }}>{renderSpecValue(item.volunteerHours ? `${item.volunteerHours}시간` : '', '예 ) 8시간')}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                              <div style={{ flex: 1 }}>{renderSpecValue(agency, '예 ) 한성대학교 사회봉사센터')}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                              <div style={{ flex: 1 }}>{renderSpecValue(desc, '간단설명')}</div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '30px' }}>
                          <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) 김장 나눔 봉사')}</div>
                          <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) 8시간')}</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) 한성대학교 사회봉사센터')}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 기타활동 - 아무것도 등록 안 한 첫 화면에서는 안내용으로 보여주고, 다른 스펙은 있는데 이것만 없으면 숨깁니다. */}
              {(!hasAnyData || activities.length > 0) && (
                <div>
                  <div className={styles.specItemHeader}>
                    <img src={mySpecsIcon} alt="스펙 아이콘" className={styles.specIcon} />
                    <h4 className={styles.specItemTitle}>기타활동</h4>
                  </div>
                  <div className={styles.specInputWrapper}>
                    {activities.length > 0 ? (
                      activities.map((item) => (
                        <div key={item.activityId} style={{ display: 'flex' }}>
                          <div style={{ flex: 1 }}>{renderSpecValue(item.description || item.activityName, '예 ) 멋쟁이사자처럼 대학 / IT 동아리 / 팀 프로젝트를 통해 서비스 기획 및 개발 경험.')}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>{renderSpecValue(null, '예 ) 멋쟁이사자처럼 대학 / IT 동아리 / 팀 프로젝트를 통해 서비스 기획 및 개발 경험.')}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
