// 개인스펙 관련 데이터를 화면 표시용/저장용으로 변환하는 공용 함수 모음.
// MyPage.jsx(읽기 전용 표시)와 MyPageRegistration.jsx(작성/수정 폼)에서 함께 사용합니다.

// 자원봉사는 백엔드에 '기관' 전용 필드가 없어서 등록 시 설명 앞에 "[기관명] 설명"
// 형태로 합쳐서 저장합니다. 화면에 보여줄 때는 다시 분리해서 사용합니다.
export const parseVolunteerDescription = (description) => {
  if (!description) return { agency: '', desc: '' };
  const match = description.match(/^\[(.+?)\]\s*([\s\S]*)$/);
  if (match) return { agency: match[1], desc: match[2] };
  return { agency: '', desc: description };
};

// 자원봉사 저장 시 '기관' + '설명'을 백엔드 description 한 필드로 합칩니다.
export const buildVolunteerDescription = (agency, desc) => {
  const trimmedAgency = (agency || '').trim();
  const trimmedDesc = (desc || '').trim();
  return trimmedAgency ? `[${trimmedAgency}] ${trimmedDesc}`.trim() : trimmedDesc;
};
