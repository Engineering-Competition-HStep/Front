import React, { useMemo, useRef, useState } from 'react';
import './ExternalJobsMore.scss';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import calendarIcon from '../../assets/externaljobsmore_calendar.svg';
import corporationIcon from '../../assets/externaljobsmore_corporation.svg';
import peopleIcon from '../../assets/externaljobsmore_people.svg';
import resetIcon from '../../assets/externaljobsmore_reset.svg';
import heroTitleIcon from '../../assets/externaljobsmore_header_logo.svg';
import heroIllustration from '../../assets/externaljobsmore__logo.svg';
import heroBar from '../../assets/externaljobsmore_bar.svg';
import bubble1 from '../../assets/externaljobsmore_bubble1.svg';
import bubble2 from '../../assets/externaljobsmore_bubble2.svg';
import bubble3 from '../../assets/externaljobsmore_bubble3.svg';
import bubble4 from '../../assets/externaljobsmore_bubble4.svg';

import tossLogo from '../../assets/job-logos/toss.png';
import googleLogo from '../../assets/job-logos/google.png';
import netflixLogo from '../../assets/job-logos/netflix.png';
import appleLogo from '../../assets/job-logos/apple.svg';
import cjLogo from '../../assets/job-logos/cj.png';
import naverLogo from '../../assets/job-logos/naver.png';
import teamSpartaLogo from '../../assets/job-logos/team-sparta.png';
import audiLogo from '../../assets/job-logos/audi.png';
import starbucksLogo from '../../assets/job-logos/starbucks.png';

const JOBS_UPDATED_AT = '2026.08.26';
const JOBS_TOTAL_COUNT = 6147;
const LAST_PAGE = 147;

// 채용공고 API를 사용할 수 없어 Figma 시안의 기업 목록을 화면에 직접 구성합니다.
// 일정이 바뀌어도 오래된 상세 페이지로 연결되지 않도록 각 기업의 공식 채용 페이지를 사용합니다.
const CURRENT_JOBS = [
  {
    id: 'toss',
    company: '토스',
    logo: tossLogo,
    track: ['IT공학 트랙'],
    field: 'IT·개발',
    title: '토스팀 채용 포지션 확인',
    desc: '개발 | 데이터 | 디자인 | 제품 | 비즈니스 직군',
    dateLabel: '2026.08.26 기준 · 공식 채용 페이지에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://toss.im/career/jobs',
  },
  {
    id: 'google',
    company: '구글',
    logo: googleLogo,
    track: ['IT공학 트랙', '경영 트랙'],
    field: 'IT·개발',
    title: 'Google Seoul 채용 포지션',
    desc: 'Software Engineering | Google Cloud | Sales | Marketing 외',
    dateLabel: '2026.08.26 기준 · 서울 채용 결과에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://www.google.com/about/careers/applications/jobs/results/?location=Seoul%2C%20South%20Korea',
  },
  {
    id: 'netflix',
    company: '넷플릭스',
    logo: netflixLogo,
    track: ['경영 트랙', '인문사회 트랙'],
    field: '콘텐츠·미디어',
    title: 'Netflix Seoul 채용 포지션',
    desc: 'Content | Production | Marketing | Business Operations 외',
    dateLabel: '2026.08.26 기준 · 서울 채용 페이지에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직',
    experience: '경력',
    statusLabel: '공식 일정 확인',
    url: 'https://jobs.netflix.com/search?q=&location=Seoul%2C%20South%20Korea',
  },
  {
    id: 'apple',
    company: '애플',
    logo: appleLogo,
    track: ['영상·애니메이션 디자인트랙', '미디어 디자인트랙'],
    field: '디자인',
    title: 'Apple Korea 채용 포지션',
    desc: 'Design | Software | Operations | Retail | Marketing 외',
    dateLabel: '2026.08.26 기준 · 대한민국 채용 페이지에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://jobs.apple.com/ko-kr/search?location=south-korea-KORC',
  },
  {
    id: 'cj',
    company: 'CJ그룹',
    logo: cjLogo,
    track: ['IT공학 트랙', '경영 트랙'],
    field: '경영·사업',
    title: 'CJ그룹 진행 중인 채용공고',
    desc: '식품 | 물류 | 미디어 | IT | 리테일 직군 외',
    dateLabel: '2026.08.26 기준 · 공식 채용 페이지에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://recruit.cj.net/recruit/ko/main/main/main.fo?lang_cd=kor',
  },
  {
    id: 'naver',
    company: '네이버',
    logo: naverLogo,
    track: ['시각 디자인트랙', '미디어 디자인트랙', 'IT공학 트랙'],
    field: 'IT·개발',
    title: '[NAVER] 진행 중인 채용공고',
    desc: 'Tech | Service & Business | Design | Corporate 외',
    dateLabel: '2026.08.26 기준 · 공고별 접수기간은 공식 페이지에서 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://recruit.navercorp.com/rcrt/list.do',
  },
  {
    id: 'team-sparta',
    company: '팀스파르타',
    logo: teamSpartaLogo,
    track: ['IT공학 트랙', '경영 트랙'],
    field: '교육·IT',
    title: '팀스파르타 채용 중인 포지션',
    desc: '개발 | 디자인 | 교육 기획·운영 | 콘텐츠 | 인턴 외',
    dateLabel: '2026.08.26 기준 · 포지션별 일정은 공식 페이지에서 확인',
    companyType: '중견기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://career.spartaclub.kr/ko/careers',
  },
  {
    id: 'audi',
    company: '아우디',
    logo: audiLogo,
    track: ['경영 트랙', 'IT공학 트랙'],
    field: '자동차·모빌리티',
    title: '아우디코리아 채용정보',
    desc: 'Sales | Marketing | Customer Experience | Technical 외',
    dateLabel: '2026.08.26 기준 · 공식 채용 페이지에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://www.vwgk.co.kr/career/recruitment',
  },
  {
    id: 'starbucks',
    company: '스타벅스',
    logo: starbucksLogo,
    track: ['경영 트랙', '서비스 트랙'],
    field: '서비스·리테일',
    title: '스타벅스코리아 채용정보',
    desc: '바리스타 | 매장 운영 | 지원 직군 | 경력 채용 외',
    dateLabel: '2026.08.26 기준 · 공식 채용 페이지에서 최신 일정 확인',
    companyType: '대기업',
    employmentType: '정규직 외',
    experience: '신입·경력',
    statusLabel: '공식 일정 확인',
    url: 'https://job.shinsegae.com/recruit_info/notice/notice01_list.jsp?isSearch=Y&tabKey0=F',
  },
];

const FILTER_DEFAULTS = {
  track: '',
  field: '',
  companyType: '',
  employmentType: '',
};

function getDeadline(endDate) {
  if (!endDate) return { label: '공식 일정 확인', tone: 'normal' };
  const todayInKorea = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const endDateOnly = endDate.slice(0, 10);
  const difference = new Date(`${endDateOnly}T00:00:00+09:00`).getTime()
    - new Date(`${todayInKorea}T00:00:00+09:00`).getTime();
  const daysLeft = Math.round(difference / (1000 * 60 * 60 * 24));

  if (difference < 0) return { label: '마감', tone: 'closed' };
  if (daysLeft === 0) return { label: '오늘 마감', tone: 'urgent' };
  return {
    label: `${daysLeft}일 남음`,
    tone: daysLeft <= 7 ? 'urgent' : 'normal',
  };
}

function ExternalJobsMore({ onNavigate }) {
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [currentPage, setCurrentPage] = useState(1);
  const listSectionRef = useRef(null);

  const visibleJobs = useMemo(() => CURRENT_JOBS.filter((job) => (
    (!filters.track || job.track.includes(filters.track))
    && (!filters.field || job.field === filters.field)
    && (!filters.companyType || job.companyType === filters.companyType)
    && (!filters.employmentType || job.employmentType === filters.employmentType)
  )), [filters]);

  const trackOptions = [...new Set(CURRENT_JOBS.flatMap((job) => job.track))];
  const fieldOptions = [...new Set(CURRENT_JOBS.map((job) => job.field))];
  const companyOptions = [...new Set(CURRENT_JOBS.map((job) => job.companyType))];
  const employmentOptions = [...new Set(CURRENT_JOBS.map((job) => job.employmentType))];

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(FILTER_DEFAULTS);
    setCurrentPage(1);
  };

  const changePage = (page) => {
    setCurrentPage(Math.max(1, Math.min(LAST_PAGE, page)));
    listSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="external-jobs-more-page">
      <Header
        activeMenu="main"
        theme="blue"
        onMenuClick={(menu) => onNavigate && onNavigate(menu)}
      />

      <main>
        <section className="jobs-banner">
          <div className="banner-content">
            <p className="breadcrumb">
              <span>메인홈</span><span aria-hidden="true">›</span><span>외부 취업 공고</span>
            </p>
            <div className="title-row">
              <img src={heroTitleIcon} alt="" className="header-logo-icon" />
              <h1>외부 취업 공고</h1>
            </div>
            <p className="subtitle">로그인을 하면 더 구체적으로 공고를 보여드릴 수 있어요!</p>
          </div>

          <div className="banner-decorations" aria-hidden="true">
            <img src={bubble1} alt="" className="bubble bubble-1" />
            <img src={bubble2} alt="" className="bubble bubble-2" />
            <img src={bubble3} alt="" className="bubble bubble-3" />
            <img src={bubble4} alt="" className="bubble bubble-4" />
            <img src={heroBar} alt="" className="bottom-bar" />
            <img src={heroIllustration} alt="" className="main-illustration" />
          </div>
        </section>

        <section className="filter-section" aria-label="채용 공고 필터">
          <div className="filter-container">
            <label className="filter-control">
              <span className="sr-only">트랙</span>
              <select value={filters.track} onChange={(event) => updateFilter('track', event.target.value)}>
                <option value="">트랙</option>
                {trackOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <span className="select-arrow" aria-hidden="true" />
            </label>

            <label className="filter-control">
              <span className="sr-only">직무</span>
              <select value={filters.field} onChange={(event) => updateFilter('field', event.target.value)}>
                <option value="">직무</option>
                {fieldOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <span className="select-arrow" aria-hidden="true" />
            </label>

            <label className="filter-control">
              <span className="sr-only">기업형태</span>
              <select value={filters.companyType} onChange={(event) => updateFilter('companyType', event.target.value)}>
                <option value="">기업형태</option>
                {companyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <span className="select-arrow" aria-hidden="true" />
            </label>

            <label className="filter-control">
              <span className="sr-only">채용형태</span>
              <select value={filters.employmentType} onChange={(event) => updateFilter('employmentType', event.target.value)}>
                <option value="">채용형태</option>
                {employmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <span className="select-arrow" aria-hidden="true" />
            </label>

            <button className="reset-button" type="button" onClick={resetFilters}>
              <img src={resetIcon} alt="" />
              <span>전체 재설정</span>
            </button>
          </div>
        </section>

        <section className="jobs-list-section" aria-labelledby="jobs-count" ref={listSectionRef}>
          <div className="list-header">
            <p id="jobs-count">공고 <strong>{Object.values(filters).some(Boolean) ? visibleJobs.length : JOBS_TOTAL_COUNT}</strong>건</p>
            <p className="updated-at">{JOBS_UPDATED_AT} 기준 · 각 기업 공식 채용 페이지</p>
          </div>

          <div className="jobs-list">
            {visibleJobs.map((job) => {
              const deadline = getDeadline(job.endDate);

              return (
                <article className="job-card" key={job.id}>
                  <a className="job-primary-link" href={job.url} target="_blank" rel="noreferrer">
                    <div className="logo-wrapper" aria-hidden="true">
                      <img className="company-logo-image" src={job.logo} alt="" />
                    </div>

                    <div className="info-wrapper">
                      <p className="company-name">{job.company}</p>
                      <div className="track-tags">
                        {job.track.map((track) => <span key={track}>{track}</span>)}
                      </div>
                      <h2 className="job-title">{job.title}</h2>
                      <p className="job-desc">{job.desc}</p>
                      <p className="job-date">
                        <img src={calendarIcon} alt="" />
                        <span>{job.dateLabel}</span>
                        <span className="divider" aria-hidden="true">|</span>
                        <strong className={`deadline ${deadline.tone}`}>{deadline.label}</strong>
                      </p>
                    </div>
                  </a>

                  <div className="right-wrapper">
                    <div className="meta-tags">
                      <span><img src={corporationIcon} alt="" />{job.companyType}</span>
                      <span><img src={peopleIcon} alt="" />{job.experience}</span>
                    </div>

                    <a className="view-job-link" href={job.url} target="_blank" rel="noreferrer">
                      공고 보기<span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              );
            })}

            {visibleJobs.length === 0 && (
              <div className="empty-state">
                <strong>선택한 조건의 공고가 없어요.</strong>
                <p>필터를 다시 선택하거나 전체 재설정을 눌러주세요.</p>
              </div>
            )}
          </div>

          {visibleJobs.length > 0 && (
            <nav className="pagination" aria-label="공고 페이지">
              <button type="button" className="page-arrow" onClick={() => changePage(1)} aria-label="첫 페이지">«</button>
              <button type="button" className="page-arrow" onClick={() => changePage(currentPage - 1)} aria-label="이전 페이지">‹</button>
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <button
                  type="button"
                  key={page}
                  className={currentPage === page ? 'active' : ''}
                  aria-current={currentPage === page ? 'page' : undefined}
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}
              <span className="pagination-dots" aria-hidden="true">...</span>
              <button
                type="button"
                className={currentPage === LAST_PAGE ? 'active last-page' : 'last-page'}
                aria-current={currentPage === LAST_PAGE ? 'page' : undefined}
                onClick={() => changePage(LAST_PAGE)}
              >
                {LAST_PAGE}
              </button>
              <button type="button" className="page-arrow" onClick={() => changePage(currentPage + 1)} aria-label="다음 페이지">›</button>
              <button type="button" className="page-arrow" onClick={() => changePage(LAST_PAGE)} aria-label="마지막 페이지">»</button>
            </nav>
          )}
        </section>
      </main>

      <div className="footer-full-width">
        <Footer />
      </div>
    </div>
  );
}

export default ExternalJobsMore;
