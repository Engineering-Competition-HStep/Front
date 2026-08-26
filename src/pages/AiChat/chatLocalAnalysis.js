export const LOCAL_ANALYSIS_PROMPTS = [
  '추천 자격증',
  '추천 공모전',
  '평균평점 경쟁력',
  '토익 필요없는 회사',
];

const CERTIFICATE_RULES = [
  {
    keywords: ['디자인', '그래픽', '영상', '애니메이션', 'VMD', '인테리어', '패션', '미술', '콘텐츠'],
    items: [
      ['컴퓨터그래픽스운용기능사', '그래픽 제작 기초와 실무 도구 활용 역량을 함께 보여주기 좋아요.'],
      ['GTQ·GTQi', '포토샵·일러스트레이터 활용 능력을 빠르게 증명할 수 있어요.'],
      ['Adobe Certified Professional', 'Adobe 도구 기반 포트폴리오를 준비한다면 실무 도구 숙련도를 보완해줘요.'],
    ],
  },
  {
    keywords: ['소프트웨어', '웹공학', '빅데이터', 'AI', '정보시스템', '데이터', '지능시스템', '가상현실'],
    items: [
      ['정보처리기사', '개발·정보시스템 전반의 기본 지식을 체계적으로 정리하기 좋아요.'],
      ['SQLD', '데이터 조회와 모델링 기초를 증명해 개발·데이터 직무 모두에 활용할 수 있어요.'],
      ['ADsP', '데이터 분석 절차와 기초 통계 이해를 보완할 수 있어요.'],
    ],
  },
  {
    keywords: ['보안', '네트워크'],
    items: [
      ['정보보안기사', '보안 기술과 관리 체계를 폭넓게 학습할 수 있어요.'],
      ['네트워크관리사 2급', '네트워크 구성과 운영 기초를 보여주기 좋아요.'],
      ['SQLD', '보안 로그와 데이터 분석 업무에 필요한 SQL 기초를 보완해줘요.'],
    ],
  },
  {
    keywords: ['경영', '비즈니스', '무역', '경제', '금융', '회계', '마케팅', '벤처'],
    items: [
      ['컴퓨터활용능력 1급', '데이터 정리와 사무 자동화 역량을 보여주는 범용 자격이에요.'],
      ['전산회계 1급', '재무·회계 기초가 필요한 경영 직무 준비에 도움이 돼요.'],
      ['유통관리사 2급', '마케팅·유통·상품기획 직무의 산업 이해를 보완할 수 있어요.'],
    ],
  },
  {
    keywords: ['행정', '정책', '법', '도시', '교통'],
    items: [
      ['컴퓨터활용능력 1급', '행정 자료 정리와 데이터 처리 역량을 보여주기 좋아요.'],
      ['한국사능력검정시험', '공공 분야 준비 시 기본 소양을 보완할 수 있어요.'],
      ['사회조사분석사 2급', '정책 조사와 설문·통계 분석 역량을 연결하기 좋아요.'],
    ],
  },
  {
    keywords: ['부동산'],
    items: [
      ['공인중개사', '부동산 법규와 중개 실무의 기본 체계를 학습할 수 있어요.'],
      ['투자자산운용사', '부동산 금융·투자 분야까지 진로를 넓힐 때 도움이 돼요.'],
      ['컴퓨터활용능력 1급', '시장 자료와 사업성 데이터를 정리하는 실무 역량을 보완해줘요.'],
    ],
  },
  {
    keywords: ['기계', '전자', '반도체', '로봇', '제조', '모빌리티', '산업공학'],
    items: [
      ['일반기계기사', '기계 설계·생산 직무의 전공 기초를 체계적으로 확인할 수 있어요.'],
      ['전자기사', '회로와 전자 시스템 관련 직무를 준비할 때 활용할 수 있어요.'],
      ['품질경영기사', '제조·품질·산업공학 직무와 연결하기 좋아요.'],
    ],
  },
];

const COMPETITION_RULES = [
  {
    keywords: ['디자인', '그래픽', '영상', '애니메이션', 'VMD', '인테리어', '패션', '미술'],
    items: ['UX/UI 개선 제안 공모전', '브랜드·패키지 디자인 공모전', '영상·모션그래픽 콘텐츠 공모전'],
  },
  {
    keywords: ['소프트웨어', '웹공학', '빅데이터', 'AI', '정보시스템', '데이터', '보안', '가상현실'],
    items: ['공공데이터 활용 경진대회', '서비스 개발 해커톤', '데이터 분석·AI 모델링 경진대회'],
  },
  {
    keywords: ['경영', '비즈니스', '무역', '경제', '금융', '회계', '마케팅', '벤처'],
    items: ['마케팅·브랜드 전략 공모전', '창업 아이디어 경진대회', '기업 문제 해결형 케이스 대회'],
  },
  {
    keywords: ['인문', '문화', '언어', '역사', '교육', '문학', '다문화'],
    items: ['문화콘텐츠 기획 공모전', '스토리텔링·아카이빙 공모전', '지역문화 문제 해결 프로젝트'],
  },
  {
    keywords: ['행정', '정책', '법', '도시', '교통', '부동산'],
    items: ['정책 제안 공모전', '도시·지역 문제 해결 아이디어톤', '공공데이터 기반 사회문제 분석 대회'],
  },
  {
    keywords: ['기계', '전자', '반도체', '로봇', '제조', '모빌리티', '산업공학'],
    items: ['캡스톤디자인 경진대회', '스마트제조·로봇 아이디어톤', '산학협력 설계 프로젝트'],
  },
];

const FALLBACK_CERTIFICATES = [
  ['컴퓨터활용능력 1급', '대부분의 직무에서 활용되는 데이터 정리·사무 역량을 보완해줘요.'],
  ['SQLD', '데이터를 다루는 직무가 늘고 있어 기초 SQL 역량을 정리하기 좋아요.'],
  ['한국사능력검정시험', '공공 분야를 함께 고려할 때 기본 소양을 보완할 수 있어요.'],
];

const FALLBACK_COMPETITIONS = [
  '교내 캡스톤디자인·프로젝트 경진대회',
  '관심 직무 기반 문제 해결 아이디어톤',
  '공공데이터 활용 프로젝트',
];

const CAREER_PAGES = [
  ['카카오', '테크·서비스비즈·디자인 직군', 'https://careers.kakao.com/jobs'],
  ['당근', '개발·프로덕트·디자인·비즈니스 직군', 'https://about.daangn.com/jobs/'],
  ['네이버', '기술·서비스·디자인·경영지원 직군', 'https://recruit.navercorp.com/rcrt/list.do'],
  ['토스', '개발·데이터·제품·디자인·비즈니스 직군', 'https://toss.im/career/jobs'],
];

function cleanText(value) {
  return String(value ?? '').trim();
}

function trackText(profile) {
  return (profile.trackNames || []).map(cleanText).filter(Boolean).join(' · ');
}

function matchingItems(rules, profile) {
  const tracks = trackText(profile);
  const matched = rules.filter((rule) => rule.keywords.some((keyword) => tracks.includes(keyword)));
  return matched.flatMap((rule) => rule.items);
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    const name = Array.isArray(item) ? item[0] : item;
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function gradeRows(profile) {
  const rows = (profile.gpas || [])
    .map((row) => ({ grade: Number(row.grade), gpa: Number(row.gpa) }))
    .filter((row) => Number.isFinite(row.grade) && Number.isFinite(row.gpa));

  if (rows.length > 0) return rows.sort((a, b) => a.grade - b.grade);

  const overall = Number(profile.overallGpa);
  return Number.isFinite(overall) ? [{ grade: null, gpa: overall }] : [];
}

function averageGpa(profile) {
  const rows = gradeRows(profile);
  if (rows.length === 0) return null;
  return rows.reduce((sum, row) => sum + row.gpa, 0) / rows.length;
}

function profileHeading(profile) {
  const name = cleanText(profile.name) || '000';
  const tracks = trackText(profile) || '등록된 트랙';
  return `${name} 학우님의 ${tracks} 기준으로 분석했어요.`;
}

function certificateResponse(profile) {
  const existing = new Set((profile.certificates || []).map((item) => cleanText(item.certificateName).toLowerCase()));
  const candidates = uniqueByName([
    ...matchingItems(CERTIFICATE_RULES, profile),
    ...FALLBACK_CERTIFICATES,
  ]).filter(([name]) => !existing.has(name.toLowerCase())).slice(0, 3);

  const ownedText = existing.size > 0
    ? `현재 등록된 자격증 ${existing.size}개는 추천 목록에서 제외했어요.`
    : '현재 등록된 자격증이 없어 입문 난이도와 직무 활용도를 우선했어요.';
  const list = candidates.map(([name, why], index) => `${index + 1}. ${name}\n   ${why}`).join('\n');

  return `${profileHeading(profile)}\n\n${ownedText}\n\n${list}\n\n자격증만으로 취업 경쟁력이 결정되지는 않아요. 목표 직무의 실제 공고에서 우대 자격을 확인하고, 포트폴리오나 프로젝트와 함께 준비해보세요.`;
}

function competitionResponse(profile) {
  const candidates = uniqueByName([
    ...matchingItems(COMPETITION_RULES, profile),
    ...FALLBACK_COMPETITIONS,
  ]).slice(0, 3);
  const awardCount = (profile.awards || []).length;
  const intro = awardCount > 0
    ? `등록된 수상경력 ${awardCount}개와 겹치지 않는 활동 유형을 우선 확인해보세요.`
    : '등록된 수상경력이 없어 결과물과 협업 경험을 동시에 만들 수 있는 유형을 골랐어요.';
  const list = candidates.map((name, index) => `${index + 1}. ${name}`).join('\n');

  return `${profileHeading(profile)}\n\n${intro}\n\n${list}\n\n프론트에는 실시간 공모전 일정 API가 없어서 특정 대회의 모집 여부와 마감일은 확정할 수 없어요. 한성대학교 비교과 시스템, 씽굿, 캠퍼스픽 등에서 위 키워드로 최신 모집 공고를 확인해주세요.`;
}

function gpaResponse(profile) {
  const rows = gradeRows(profile);
  const average = averageGpa(profile);
  if (average === null) {
    return `${profileHeading(profile)}\n\n등록된 학점이 없어 평균평점 경쟁력을 계산할 수 없어요. 마이페이지에 학년별 학점을 입력하면 구간별 강점과 보완점을 바로 안내해드릴게요.`;
  }

  let evaluation;
  let advice;
  if (average >= 4.0) {
    evaluation = '학업 성취도가 매우 높은 구간이에요.';
    advice = '학점 유지와 함께 프로젝트·인턴·포트폴리오처럼 직무 증거를 늘리는 데 집중해보세요.';
  } else if (average >= 3.5) {
    evaluation = '학업 성취도가 양호하고 여러 지원 기회를 검토하기 좋은 구간이에요.';
    advice = '학점만 더 올리기보다 목표 직무와 연결되는 프로젝트·자격증·공모전 한두 가지를 보완하면 좋아요.';
  } else if (average >= 3.0) {
    evaluation = '지원 가능한 공고가 충분하지만 일부 학점 기준이 있는 전형은 공고별 확인이 필요한 구간이에요.';
    advice = '전공 핵심 과목 성적과 프로젝트 결과물을 함께 강조하고, 남은 학기에서 완만한 상승세를 만들어보세요.';
  } else {
    evaluation = '학점만으로 강점을 만들기보다는 직무 역량을 보여주는 다른 증거가 특히 중요한 구간이에요.';
    advice = '재수강 가능 과목을 점검하면서 포트폴리오·프로젝트·자격증으로 직무 적합성을 함께 보여주세요.';
  }

  const rowText = rows.length > 1
    ? rows.map((row) => `${row.grade}학년 ${row.gpa.toFixed(2)}`).join(' · ')
    : `전체 평균 ${average.toFixed(2)}`;

  return `${profileHeading(profile)}\n\n• 입력 학점: ${rowText}\n• 단순 평균: ${average.toFixed(2)} / 4.5\n\n${evaluation}\n${advice}\n\n이 평가는 입력된 학점의 구간만 해석한 참고 정보예요. 기업·직무마다 평가 기준이 다르므로 합격 가능성이나 실제 경쟁률을 의미하지는 않아요.`;
}

function noToeicResponse(profile) {
  const list = CAREER_PAGES.map(([company, roles, url], index) => (
    `${index + 1}. ${company} — ${roles}\n   ${url}`
  )).join('\n');

  return `${profileHeading(profile)}\n\n‘토익이 필요 없는 회사’를 회사 전체 기준으로 단정할 수는 없어요. 같은 회사도 직무와 공고에 따라 영어 요건이 달라집니다. 아래 공식 채용 페이지에서 개발·디자인·제품·서비스 직군의 필수 요건을 먼저 확인해보세요.\n\n${list}\n\n지원 전 체크할 것\n• 필수 자격에 TOEIC·TOEFL·OPIc 등 점수가 명시돼 있는지\n• 영어가 필수가 아니라 우대사항인지\n• 포트폴리오·과제·코딩테스트 등 다른 역량 평가가 있는지\n\n공고에 어학 점수가 없더라도 업무상 영어 사용 여부는 면접에서 별도로 확인하는 것이 안전해요.`;
}

export function resolveLocalAnalysisPrompt(query) {
  const normalized = cleanText(query).replace(/\s+/g, ' ');
  if (normalized === '추천 자격증' || /자격증.*(추천|뭐|무엇|따)/.test(normalized)) return '추천 자격증';
  if (normalized === '추천 공모전' || /공모전.*(추천|뭐|무엇|나가)/.test(normalized)) return '추천 공모전';
  if (normalized === '평균평점 경쟁력' || /(평점|학점).*(경쟁력|평가|어때|수준)/.test(normalized)) return '평균평점 경쟁력';
  if (normalized === '토익 필요없는 회사' || /(토익|어학).*(필요.?없|안.?보|회사|기업)/.test(normalized)) return '토익 필요없는 회사';
  return null;
}

export function buildLocalAnalysis(prompt, profile = {}) {
  switch (prompt) {
    case '추천 자격증':
      return certificateResponse(profile);
    case '추천 공모전':
      return competitionResponse(profile);
    case '평균평점 경쟁력':
      return gpaResponse(profile);
    case '토익 필요없는 회사':
      return noToeicResponse(profile);
    default:
      return null;
  }
}
