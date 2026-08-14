import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import styles from './MyPageRegistration.module.css';

import bannerImg from '../../assets/mypage_banner.svg';
import mySpecsIcon from '../../assets/mypage_mySpecs.svg';
import stepFocusIcon from '../../assets/mypageregistration_step_focus.svg';
import stepBasicIcon from '../../assets/mypageregistration_step_basic.svg';
import stepLineIcon from '../../assets/mypageregistration_step_line.svg';
import { parseVolunteerDescription, buildVolunteerDescription } from '../../utils/profileFormat';

const API_BASE_URL = 'http://localhost:8080';

const EMPTY_SPEC_ITEM = {
  certs: { id: null, name: '', date: '' },
  awards: { id: null, name: '', rank: '', desc: '' },
  volunteers: { id: null, name: '', time: '', agency: '', desc: '' },
  activities: { id: null, desc: '' },
};

const SPEC_ENDPOINT = {
  certs: 'certificates',
  awards: 'awards',
  volunteers: 'volunteers',
  activities: 'activities',
};

export default function MyPageRegistration({ onNavigate }) {
  // 현재 진행 중인 스텝 (1: 학점, 2: 개인스펙)
  const [currentStep, setCurrentStep] = useState(1);

  // 임시 학년 설정 변수
  const [userGrade, setUserGrade] = useState(3);

  // 로그인한 사용자의 학번
  const [userId, setUserId] = useState(null);

  // 저장 중 중복 클릭 방지용 상태
  const [isSaving, setIsSaving] = useState(false);

  // 학점 데이터를 관리하는 상태 변수
  const [gpaData, setGpaData] = useState({
    grade1: '',
    grade2: '',
    grade3: '',
    grade4: '',
    total: ''
  });

  const [gradeGpaIds, setGradeGpaIds] = useState({});

  // 개인 스펙 각 항목별 입력창의 개수와 내용을 관리하는 상태 변수
  const [specData, setSpecData] = useState({
    certs: [EMPTY_SPEC_ITEM.certs],
    awards: [EMPTY_SPEC_ITEM.awards],
    volunteers: [EMPTY_SPEC_ITEM.volunteers],
    activities: [EMPTY_SPEC_ITEM.activities]
  });

  const [deletedIds, setDeletedIds] = useState({ certs: [], awards: [], volunteers: [], activities: [] });

  // 로그인한 사용자의 기존 학점/개인스펙을 전부 불러와 폼에 미리 채움
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
        setUserId(me.userId);
        if (me.grade) setUserGrade(me.grade);

        const qs = `userId=${encodeURIComponent(me.userId)}`;
        const authHeaders = { Authorization: `Bearer ${token}` };

        const [gpaRes, certRes, awardRes, volRes, actRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/profile/grade-gpa?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/certificates?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/awards?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/volunteers?${qs}`, { headers: authHeaders, signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/profile/activities?${qs}`, { headers: authHeaders, signal: controller.signal }),
        ]);

        if (gpaRes.ok) {
          const gpaList = await gpaRes.json();
          const idMap = {};
          setGpaData((prev) => {
            const next = { ...prev, total: me.gpa != null ? String(me.gpa) : prev.total };
            gpaList.forEach((row) => {
              next[`grade${row.grade}`] = row.gpa != null ? String(row.gpa) : '';
              idMap[row.grade] = row.userGradeGpaId;
            });
            return next;
          });
          setGradeGpaIds(idMap);
        }

        if (certRes.ok) {
          const list = await certRes.json();
          if (list.length > 0) {
            setSpecData((prev) => ({
              ...prev,
              certs: list.map((c) => ({
                id: c.certificateId,
                name: c.certificateName || '',
                date: c.issuedYear != null ? String(c.issuedYear) : '',
              })),
            }));
          }
        }

        if (awardRes.ok) {
          const list = await awardRes.json();
          if (list.length > 0) {
            setSpecData((prev) => ({
              ...prev,
              awards: list.map((a) => ({
                id: a.awardId,
                name: a.competitionName || '',
                rank: a.awardName || '',
                desc: a.description || '',
              })),
            }));
          }
        }

        if (volRes.ok) {
          const list = await volRes.json();
          if (list.length > 0) {
            setSpecData((prev) => ({
              ...prev,
              volunteers: list.map((v) => {
                const { agency, desc } = parseVolunteerDescription(v.description);
                return {
                  id: v.volunteerId,
                  name: v.volunteerName || '',
                  time: v.volunteerHours != null ? `${v.volunteerHours}시간` : '',
                  agency,
                  desc,
                };
              }),
            }));
          }
        }

        if (actRes.ok) {
          const list = await actRes.json();
          if (list.length > 0) {
            setSpecData((prev) => ({
              ...prev,
              activities: list.map((a) => ({
                id: a.activityId,
                desc: a.description || a.activityName || '',
              })),
            }));
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('마이페이지 등록 정보 불러오기 실패:', error);
        }
      }
    };

    loadProfile();
    return () => controller.abort();
  }, []);

  // '+ 추가하기' 버튼을 누르면 해당 항목 배열에 새 빈 항목을 추가하는 함수
  const handleAddInput = (field) => {
    setSpecData((prev) => ({ ...prev, [field]: [...prev[field], EMPTY_SPEC_ITEM[field]] }));
  };

  // 텍스트 입력 처리 함수
  const handleInputChange = (field, index, subField, value) => {
    setSpecData((prev) => {
      const newArr = [...prev[field]];
      newArr[index] = { ...newArr[index], [subField]: value };
      return { ...prev, [field]: newArr };
    });
  };

  // '-' 삭제하기 버튼을 눌렀을 때 실행되는 함수
  const handleRemoveInput = (field, index) => {
    // 이미 DB에 저장돼 있던 항목이면(id 있음) 저장 시점에 삭제 요청을 보냄
    const removedId = specData[field][index]?.id;
    if (removedId) {
      setDeletedIds((prev) => ({ ...prev, [field]: [...prev[field], removedId] }));
    }

    setSpecData((prev) => {
      const arr = prev[field];

      // 1개만 남아있을 경우: 완전히 새 빈 항목으로 초기화
      if (arr.length === 1) {
        return { ...prev, [field]: [EMPTY_SPEC_ITEM[field]] };
      }
      // 2개 이상일 경우: 배열에서 제거
      const newArr = arr.filter((_, i) => i !== index);
      return { ...prev, [field]: newArr };
    });
  };

  // DB 통신 및 저장 로직
  const handleSave = async () => {
    if (isSaving) return;

    const token = localStorage.getItem('accessToken');
    if (!token || !userId) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      if (onNavigate) onNavigate('login');
      return;
    }

    setIsSaving(true);

    try {
      const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const qs = `userId=${encodeURIComponent(userId)}`;
      const requests = [];

      // 학점평균
      const gradeGpaRequests = [1, 2, 3, 4]
        .filter((n) => n <= userGrade && gpaData[`grade${n}`].trim() !== '')
        .map((n) => ({ grade: n, gpa: parseFloat(gpaData[`grade${n}`]) }))
        .filter((row) => !Number.isNaN(row.gpa));

      const gradeGpaResponses = [];

      if (gradeGpaRequests.length > 0) {
        gradeGpaResponses.push(
          await fetch(`${API_BASE_URL}/api/profile/grade-gpa/bulk?${qs}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify(gradeGpaRequests),
          })
        );
      } else if (gpaData.total.trim() !== '') {
        const totalGpa = parseFloat(gpaData.total);
        if (!Number.isNaN(totalGpa)) {
          gradeGpaResponses.push(
            await fetch(`${API_BASE_URL}/api/members/me`, {
              method: 'PATCH',
              headers: authHeaders,
              body: JSON.stringify({ gpa: totalGpa }),
            })
          );
        }
      }

      for (const n of [1, 2, 3, 4]) {
        const existingId = gradeGpaIds[n];
        const stillFilled = gpaData[`grade${n}`].trim() !== '';
        if (existingId && !stillFilled) {
          gradeGpaResponses.push(
            await fetch(`${API_BASE_URL}/api/profile/grade-gpa/${existingId}`, {
              method: 'DELETE',
              headers: authHeaders,
            })
          );
        }
      }

      const noGradeFilled = [1, 2, 3, 4].every((n) => gpaData[`grade${n}`].trim() === '');
      if (gradeGpaRequests.length === 0 && gpaData.total.trim() === '' && noGradeFilled) {
        gradeGpaResponses.push(
          await fetch(`${API_BASE_URL}/api/profile/grade-gpa/bulk?${qs}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify([]),
          })
        );
      }

      requests.push(...gradeGpaResponses);

      // 자격증 
      specData.certs.forEach((item) => {
        const name = item.name.trim();
        const yearMatch = item.date.match(/\d{4}/);
        const body = {
          certificateName: name,
          issuedYear: yearMatch ? Number(yearMatch[0]) : null,
        };
        if (item.id) {
          requests.push(
            name === ''
              ? fetch(`${API_BASE_URL}/api/profile/certificates/${item.id}`, { method: 'DELETE', headers: authHeaders })
              : fetch(`${API_BASE_URL}/api/profile/certificates/${item.id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(body) })
          );
        } else if (name !== '') {
          requests.push(fetch(`${API_BASE_URL}/api/profile/certificates?${qs}`, { method: 'POST', headers: authHeaders, body: JSON.stringify(body) }));
        }
      });

      // 수상경력
      specData.awards.forEach((item) => {
        const name = item.name.trim();
        const rankMatch = item.rank.match(/\d+/);
        const body = {
          competitionName: name,
          awardName: item.rank.trim() || name,
          awardRank: rankMatch ? Number(rankMatch[0]) : null,
          description: item.desc.trim(),
        };
        if (item.id) {
          requests.push(
            name === ''
              ? fetch(`${API_BASE_URL}/api/profile/awards/${item.id}`, { method: 'DELETE', headers: authHeaders })
              : fetch(`${API_BASE_URL}/api/profile/awards/${item.id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(body) })
          );
        } else if (name !== '') {
          requests.push(fetch(`${API_BASE_URL}/api/profile/awards?${qs}`, { method: 'POST', headers: authHeaders, body: JSON.stringify(body) }));
        }
      });

      // 자원봉사
      specData.volunteers.forEach((item) => {
        const name = item.name.trim();
        const hoursMatch = item.time.match(/\d+/);
        const body = {
          volunteerName: name,
          volunteerHours: hoursMatch ? Number(hoursMatch[0]) : 0,
          description: buildVolunteerDescription(item.agency, item.desc),
        };
        if (item.id) {
          requests.push(
            name === ''
              ? fetch(`${API_BASE_URL}/api/profile/volunteers/${item.id}`, { method: 'DELETE', headers: authHeaders })
              : fetch(`${API_BASE_URL}/api/profile/volunteers/${item.id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(body) })
          );
        } else if (name !== '') {
          requests.push(fetch(`${API_BASE_URL}/api/profile/volunteers?${qs}`, { method: 'POST', headers: authHeaders, body: JSON.stringify(body) }));
        }
      });

      // 기타활동
      specData.activities.forEach((item) => {
        const text = item.desc.trim();
        const body = {
          activityName: text.slice(0, 100),
          fieldKeyword: '',
          period: '',
          description: text.slice(0, 500),
        };
        if (item.id) {
          requests.push(
            text === ''
              ? fetch(`${API_BASE_URL}/api/profile/activities/${item.id}`, { method: 'DELETE', headers: authHeaders })
              : fetch(`${API_BASE_URL}/api/profile/activities/${item.id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(body) })
          );
        } else if (text !== '') {
          requests.push(fetch(`${API_BASE_URL}/api/profile/activities?${qs}`, { method: 'POST', headers: authHeaders, body: JSON.stringify(body) }));
        }
      });

      // '- 삭제하기'로 화면에서 미리 지워둔, 기존에 저장돼 있던 항목들 삭제
      Object.entries(deletedIds).forEach(([field, ids]) => {
        ids.forEach((id) => {
          requests.push(
            fetch(`${API_BASE_URL}/api/profile/${SPEC_ENDPOINT[field]}/${id}`, { method: 'DELETE', headers: authHeaders })
          );
        });
      });

      const responses = await Promise.all(requests);
      const failedResponses = responses.filter((res) => !res.ok);

      if (failedResponses.length > 0) {
        console.error('일부 항목 저장 실패:', failedResponses);
        alert('일부 정보 저장에 실패했습니다. 입력값을 확인한 뒤 다시 시도해주세요.');
        return;
      }

      setDeletedIds({ certs: [], awards: [], volunteers: [], activities: [] });
      alert('저장되었습니다!');
      // MyPage로 화면 전환
      if (onNavigate) {
        onNavigate('mypage');
      }
    } catch (error) {
      console.error('마이페이지 등록 저장 API 통신 에러:', error);
      alert('저장 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  // 스크롤 위치 추적 변수
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  // 드래그할 때마다 어느 스텝에 있는지 검사
  useEffect(() => {
    const handleScroll = () => {
      if (!step2Ref.current) return;
      // 화면 중앙 선을 기준으로 2단계 영역이 올라왔는지 확인
      const step2Top = step2Ref.current.getBoundingClientRect().top;
      if (step2Top < window.innerHeight / 2) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스텝 클릭 시 해당 영역으로 이동
  const scrollToStep = (step) => {
    if (step === 1 && step1Ref.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && step2Ref.current) {
      const y = step2Ref.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      <Header 
        activeMenu="mypage" 
        onMenuClick={(menu) => onNavigate(menu)}
      />
      
      <main className={styles.mainLayout}>
        
        {/* === 왼쪽 사이드바 (스텝 표시기) === */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarSub}>마이페이지</p>
          <h1 className={styles.sidebarTitle}>My Page</h1>
          
          <div className={styles.stepWrapper}>
            {/* STEP 1 */}
            <div 
              className={`${styles.stepNode} ${currentStep === 1 ? styles.active : ''}`}
              onClick={() => scrollToStep(1)}
            >
              <div className={styles.iconBox}>
                <img 
                  src={currentStep === 1 ? stepFocusIcon : stepBasicIcon} 
                  alt="스텝 아이콘" 
                  className={currentStep === 1 ? styles.focusIcon : styles.basicIcon} 
                />
              </div>
              
              <img src={stepLineIcon} alt="연결선" className={styles.stepLine} />

              <div className={styles.stepText}>
                <span className={styles.stepLabel}>STEP 1</span>
                <span className={styles.stepName}>학점</span>
              </div>
            </div>
            
            {/* STEP 2 */}
            <div 
              className={`${styles.stepNode} ${currentStep === 2 ? styles.active : ''}`}
              onClick={() => scrollToStep(2)}
            >
              <div className={styles.iconBox}>
                <img 
                  src={currentStep === 2 ? stepFocusIcon : stepBasicIcon} 
                  alt="스텝 아이콘" 
                  className={currentStep === 2 ? styles.focusIcon : styles.basicIcon} 
                />
              </div>

              <div className={styles.stepText}>
                <span className={styles.stepLabel}>STEP 2</span>
                <span className={styles.stepName}>개인스펙</span>
              </div>
            </div>
          </div>
        </aside>

        {/* === 오른쪽 메인 컨텐츠 영역 === */}
        <div className={styles.contentArea}>
          
          {/* 상단 안내 배너 */}
          <div className={styles.bannerContainer}>
            <h4 className={styles.bannerMainTitle}>마이페이지 정보 등록 안내</h4>
            <div className={styles.infoBanner}>
              <p className={styles.bannerText}>
                <strong>학점 및 개인 스펙</strong>을 <strong>정확하게</strong> 입력해주세요.<br/>
                입력한 정보는 <strong>AI 취업 분석과 맞춤형 로드맵 생성에 활용</strong>됩니다.<br/>
                교내·외 활동, 수상경력, 자격증 등은 <strong>실제 경럼을 기준</strong>으로 작성해주세요.<br/>
                등록한 정보는 언제든지 <strong>수정 및 추가</strong>할 수 있습니다.
              </p>
              <img src={bannerImg} alt="배너 일러스트" className={styles.bannerIllustration} />
            </div>
          </div>

          {/* === 01. 평점평균 섹션 === */}
          <section ref={step1Ref} className={styles.gpaSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.stepTitle}>
                01<br/><span className={styles.stepTitleText}>학점평균을 알려주세요.</span>
              </h2>
              <p className={styles.stepDesc}>*종합정보시스템 &gt; 학적 &gt; 학적조회 &gt; 성적사항</p>
            </div>
            
            <div className={styles.gpaContainer}>
              {[1, 2, 3, 4].map((gradeNum) => {
                // 현재 내 학년보다 높은 학년인지 판별합니다.
                const isLocked = gradeNum > userGrade;
                const stateKey = `grade${gradeNum}`; 

                return (
                  <div key={gradeNum} className={`${styles.gpaRow} ${gradeNum === 4 ? styles.mb70 : ''}`}>
                    <div className={styles.gradePill}>{gradeNum}학년</div>
                    <div className={styles.inputWrapper}>
                      <input 
                        type="text" 
                        value={gpaData[stateKey]}
                        onChange={(e) => setGpaData({ ...gpaData, [stateKey]: e.target.value })}
                        placeholder={isLocked ? "현재 학년보다 높아요." : `${gradeNum}학년 평점평균을 입력해주세요.`} 
                        className={styles.centerInput}
                        disabled={isLocked}
                      />
                    </div>
                  </div>
                );
              })}
              
              <div className={styles.gpaRow}>
                <div className={`${styles.gradePill} ${styles.totalPill}`}>전체평균</div>
                <div className={`${styles.inputWrapper} ${styles.totalInputWrapper}`}>
                  <input 
                    type="text" 
                    value={gpaData.total}
                    onChange={(e) => setGpaData({ ...gpaData, total: e.target.value })}
                    placeholder="전체 학점평균을 입력해주세요." 
                    className={`${styles.centerInput}`} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* === 02. 개인스펙 섹션 === */}
          <section ref={step2Ref} className={styles.specSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.stepTitle}>
                02<br/><span className={styles.stepTitleText}>개인스펙을 알려주세요.</span>
              </h2>
              <p className={styles.stepDesc}>*언제든 수정 가능합니다.</p>
            </div>

            <div className={styles.specList}>
              
              {/* 자격증 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>자격증</h3>
                </div>
                <div className={styles.specContent}>
                  <p className={`${styles.specSubTitle} ${styles.mb20}`}>• 자격증 명 / 발급년도</p>
                  {specData.certs.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: idx !== specData.certs.length - 1 ? '20px' : '0' }}>
                      <div className={styles.inputRow}>
                        <div className={styles.inputColHalf}>
                          <div className={styles.inputWrapper}>
                            <input value={item.name} onChange={(e) => handleInputChange('certs', idx, 'name', e.target.value)} placeholder="예 ) GTQ 1급" className={styles.leftInput} />
                          </div>
                        </div>
                        <div className={styles.inputColHalf}>
                          <div className={styles.inputWrapper}>
                            <input value={item.date} onChange={(e) => handleInputChange('certs', idx, 'date', e.target.value)} placeholder="예 ) 2024.5.6" className={styles.leftInput} />
                          </div>
                        </div>
                      </div>
                      {/* 삭제하기 버튼 */}
                      <div className={styles.addText} onClick={() => handleRemoveInput('certs', idx)}>- 삭제하기</div>
                    </div>
                  ))}
                  <div className={styles.addText} onClick={() => handleAddInput('certs')}>+ 추가하기</div>
                </div>
              </div>

              {/* 수상경력 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>수상경력</h3>
                </div>
                <div className={styles.specContent}>
                  {specData.awards.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: idx !== specData.awards.length - 1 ? '40px' : '0' }}>
                      <p className={`${styles.specSubTitle} ${styles.mb20}`}>• 참여대회 명 / 등수 or 상 이름</p>
                      <div className={styles.inputRow}>
                        <div className={styles.inputColHalf}>
                          <div className={styles.inputWrapper}>
                            <input value={item.name} onChange={(e) => handleInputChange('awards', idx, 'name', e.target.value)} placeholder="예 ) KOBACO 공익광고 공모전" className={styles.leftInput} />
                          </div>
                        </div>
                        <div className={styles.inputColHalf}>
                          <div className={styles.inputWrapper}>
                            <input value={item.rank} onChange={(e) => handleInputChange('awards', idx, 'rank', e.target.value)} placeholder="예 ) 대상" className={styles.leftInput} />
                          </div>
                        </div>
                      </div>
                      
                      <p className={`${styles.specSubTitle} ${styles.mb20}`}>• 간단설명</p>
                      <div className={styles.inputRow} style={{ marginBottom: '10px' }}>
                        <div className={styles.inputColFull}>
                          <div className={styles.inputWrapper}>
                            <textarea 
                              value={item.desc} 
                              onChange={(e) => {
                                handleInputChange('awards', idx, 'desc', e.target.value);
                                if (e.target.value === '') {
                                  e.target.style.height = '54px'; 
                                } else {
                                  e.target.style.height = '1px'; 
                                  e.target.style.height = `${e.target.scrollHeight}px`; 
                                }
                              }} 
                              rows={1} 
                              placeholder="예 ) 사회문제를 창의적인 광고 아이디어와 시각적 표현으로 해결하는&#13;&#10;공익광고 공모전에 참가하여 기획부터 디자인까지 전 과정을 수행함." 
                              className={styles.leftInput}
                              style={{ 
                                resize: 'none', 
                                overflow: 'hidden',
                                height: item.desc === '' ? '54px' : 'auto' 
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                      {/* 삭제하기 버튼 */}
                      <div className={styles.addText} onClick={() => handleRemoveInput('awards', idx)}>- 삭제하기</div>
                    </div>
                  ))}
                  <div className={styles.addText} onClick={() => handleAddInput('awards')}>+ 추가하기</div>
                </div>
              </div>

              {/* 자원봉사 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>자원봉사</h3>
                </div>
                <div className={styles.specContent}>
                  {specData.volunteers.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: idx !== specData.volunteers.length - 1 ? '40px' : '0' }}>
                      <p className={`${styles.specSubTitle} ${styles.mb20}`}>• 봉사 명 / 기관 / 봉사 시간</p>
                      <div className={styles.inputRow}>
                        <div className={styles.inputColHalf}>
                          <div className={styles.inputWrapper}>
                            <input value={item.name} onChange={(e) => handleInputChange('volunteers', idx, 'name', e.target.value)} placeholder="예 ) 김장 나눔 봉사" className={styles.leftInput} />
                          </div>
                        </div>
                        <div className={styles.inputColHalf}>
                          <div className={styles.inputWrapper}>
                            <input value={item.time} onChange={(e) => handleInputChange('volunteers', idx, 'time', e.target.value)} placeholder="예 ) 8시간" className={styles.leftInput} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputRow}>
                        <div className={styles.inputColFull}>
                          <div className={styles.inputWrapper}>
                            <input value={item.agency} onChange={(e) => handleInputChange('volunteers', idx, 'agency', e.target.value)} placeholder="예 ) 한성대학교 사회봉사센터" className={styles.leftInput} />
                          </div>
                        </div>
                      </div>
                      
                      <p className={`${styles.specSubTitle} ${styles.mb20}`}>• 간단설명</p>
                      <div className={styles.inputRow} style={{ marginBottom: '10px' }}>
                        <div className={styles.inputColFull}>
                          <div className={styles.inputWrapper}>
                            <textarea 
                              value={item.desc} 
                              onChange={(e) => {
                                handleInputChange('volunteers', idx, 'desc', e.target.value);
                                if (e.target.value === '') {
                                  e.target.style.height = '54px'; 
                                } else {
                                  e.target.style.height = '1px'; 
                                  e.target.style.height = `${e.target.scrollHeight}px`; 
                                }
                              }} 
                              rows={1}
                              placeholder="예 ) 지역사회의 취약계층을 위해 김장 김치를 직접 담그고&#13;&#10;포장 및 배부를 지원한 봉사활동." 
                              className={styles.leftInput}
                              style={{ 
                                resize: 'none', 
                                overflow: 'hidden',
                                height: item.desc === '' ? '54px' : 'auto'
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                      {/* 삭제하기 버튼 */}
                      <div className={styles.addText} onClick={() => handleRemoveInput('volunteers', idx)}>- 삭제하기</div>
                    </div>
                  ))}
                  <div className={styles.addText} onClick={() => handleAddInput('volunteers')}>+ 추가하기</div>
                </div>
              </div>

              {/* 기타활동 */}
              <div className={styles.specGroup}>
                <div className={styles.specHeader}>
                  <img src={mySpecsIcon} alt="아이콘" className={styles.specIcon} />
                  <h3>기타활동</h3>
                </div>
                <div className={styles.specContent}>
                  <p className={`${styles.specSubTitle} ${styles.mb20}`}>• 미수상 활동, 부트캠프, 인턴, 동아리, 외부 교육, 프로젝트성 활동 등</p>
                  {specData.activities.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: idx !== specData.activities.length - 1 ? '20px' : '0' }}>
                      <div className={styles.inputRow} style={{ marginBottom: '10px' }}>
                        <div className={styles.inputColFull}>
                          <div className={styles.inputWrapper}>
                            <input value={item.desc} onChange={(e) => handleInputChange('activities', idx, 'desc', e.target.value)} placeholder="예 ) 멋쟁이사자처럼 대학 / IT 동아리 / 팀 프로젝트를 통해 서비스 기획 및 개발 경험." className={styles.leftInput} />
                          </div>
                        </div>
                      </div>
                      {/* 삭제하기 버튼 */}
                      <div className={styles.addText} onClick={() => handleRemoveInput('activities', idx)}>- 삭제하기</div>
                    </div>
                  ))}
                  <div className={styles.addText} onClick={() => handleAddInput('activities')}>+ 추가하기</div>
                </div>
              </div>

            </div>
          </section>

          {/* 하단 저장 버튼 */}
          <div className={styles.saveBtnWrapper}>
            <button className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}