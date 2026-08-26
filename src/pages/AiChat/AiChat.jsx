import React, { useEffect, useMemo, useRef, useState } from 'react';
import './AiChat.scss';

import Header from '../../components/Header/Header.jsx';
import aichatBot from '../../assets/aichat_bot.svg';
import aichatLogo from '../../assets/aichat_logo.svg';
import aichatHistoryIcon from '../../assets/aichat_search.svg';
import aichatHeader from '../../assets/aichat_header.svg';
import aichatSend from '../../assets/aichat_send.svg';
import aichatRegisterArrow from '../../assets/aichat_register_arrow.svg';

import {
  getActivities,
  getAccessToken,
  getAwards,
  getCertificates,
  getChatMessages,
  getChatRooms,
  getGradeGpas,
  getMyMember,
  getProfileCompleteness,
  getTracks,
  getVolunteers,
  sendChatMessage,
  startChatRoom,
} from '../../services/hstepApi.js';
import { buildLocalAnalysis, resolveLocalAnalysisPrompt } from './chatLocalAnalysis.js';

const PROMPT_ROWS = [
  ['내 트랙 취업 분석', '추천 직무', '추천 자격증'],
  ['추천 공모전', '평균평점 경쟁력', '토익 필요없는 회사'],
];

const UNSUPPORTED_RESPONSE = '죄송해요.\n현재 해당 상담은 지원하지 않는 기능이에요.\n현재는 취업, 진로, 공고, 자격증, 로드맵 관련 상담을 이용하실 수 있어요!';

function getScenario(query) {
  if (query === '추천 직무') return 'RECOMMENDED_JOB';
  if (query === '내 트랙 취업 분석') return 'TRACK_CAREER_ANALYSIS';
  if (/트랙|취업|진로|공고|로드맵/.test(query)) return 'TRACK_CAREER_ANALYSIS';
  return null;
}

function getOfflineResponse(query) {
  if (/직무|회사|토익/.test(query)) {
    return '입력한 트랙과 스펙을 기준으로 관련 직무와 기업을 분석했어요. 로컬 백엔드를 실행하고 로그인하면 개인 정보가 반영된 상세 답변을 확인할 수 있어요.';
  }
  if (/자격증|공모전|평점/.test(query)) {
    return '현재 스펙을 보완할 수 있는 활동을 분석했어요. 로컬 백엔드 연결 후에는 등록한 학점·자격증·수상 내역을 기준으로 맞춤 추천을 제공해요.';
  }
  return '트랙과 개인 스펙을 바탕으로 취업 방향을 분석했어요. 로컬 백엔드가 연결되면 저장된 정보를 기준으로 더 구체적인 결과를 제공해요.';
}

function buildWelcomeMessage(name) {
  return `환영합니다, ${name} 학우님!\nHSTEP AI 챗봇이에요.\n원하시는 질문을 선택해보세요.`;
}

function buildPreviewTrackAnalysis(gpa) {
  return `000 학우님의 미디어디자인 트랙과 등록된 학점 정보를 분석했어요.\n\n• 학점: 1~4학년 평균 ${gpa} / 4.5\n• 개인 스펙: 자격증·수상·봉사·대외활동 미등록\n• 추천 직무: UI/UX 디자이너, 콘텐츠 디자이너, 모션그래픽 디자이너\n\n현재 학점은 기본 지원 요건을 충족하는 수준이에요. 다만 등록된 개인 스펙이 없어 프로젝트와 포트폴리오 경쟁력까지는 분석하기 어려워요. 다음 단계로 전공 프로젝트 2~3개를 포트폴리오로 정리하고, 관심 직무에 맞는 자격증이나 공모전 경험을 추가하는 것을 추천해요.`;
}

const PREVIEW_PARAMS = new URLSearchParams(window.location.search);
const CHAT_PREVIEW = import.meta.env.DEV ? PREVIEW_PARAMS.get('chatPreview') : null;
const IS_REGISTERED_PREVIEW = ['registered', 'track-analysis'].includes(CHAT_PREVIEW);

const EMPTY_LOCAL_PROFILE = {
  name: '000',
  grade: null,
  overallGpa: null,
  trackNames: [],
  gpas: [],
  certificates: [],
  awards: [],
  volunteers: [],
  activities: [],
};

function settledValue(result, fallback) {
  return result?.status === 'fulfilled' ? result.value : fallback;
}

function historyLabel(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '최근';

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.max(0, Math.round((todayStart - dateStart) / 86400000));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  return `${days}일 전`;
}

function AiChat({
  onNavigate,
  onNavigateToMain,
  onNavigateToMyPage,
  onNavigateToAiChat,
}) {
  const [profileLoading, setProfileLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState('000');
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [localProfile, setLocalProfile] = useState(EMPTY_LOCAL_PROFILE);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatLogRef = useRef(null);

  const handleMenuNavigation = (menu) => {
    if (menu === 'main' || menu === 'home') {
      onNavigateToMain ? onNavigateToMain() : onNavigate?.('main');
    } else if (menu === 'aichat' || menu === 'ai-chat') {
      onNavigateToAiChat ? onNavigateToAiChat() : onNavigate?.('aiChat');
    } else if (menu === 'mypage') {
      onNavigateToMyPage ? onNavigateToMyPage() : onNavigate?.('mypage');
    } else {
      onNavigate?.(menu);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrapChat = async () => {
      if (IS_REGISTERED_PREVIEW) {
        const previewName = '000';
        const previewGpa = PREVIEW_PARAMS.get('gpa') || '3.5';
        const now = Date.now();

        setLocalProfile({
          ...EMPTY_LOCAL_PROFILE,
          name: previewName,
          grade: 4,
          overallGpa: Number(previewGpa),
          trackNames: ['미디어디자인트랙'],
          gpas: [1, 2, 3, 4].map((grade) => ({ grade, gpa: Number(previewGpa) })),
        });

        setIsRegistered(true);
        setUserName(previewName);
        const previewMessages = [{ sender: 'bot', text: buildWelcomeMessage(previewName) }];
        if (CHAT_PREVIEW === 'track-analysis') {
          previewMessages.push(
            { sender: 'user', text: '내 트랙 취업 분석' },
            { sender: 'bot', text: buildPreviewTrackAnalysis(previewGpa) },
          );
        }

        setMessages(previewMessages);
        setHistory([
          { id: 'preview-1', text: '내 트랙 취업 분석', timestamp: now },
          { id: 'preview-2', text: '추천 직무', timestamp: now - 86400000 },
          { id: 'preview-3', text: '추천 자격증', timestamp: now - 259200000 },
        ]);
        setProfileLoading(false);
        return;
      }

      if (!getAccessToken()) {
        if (!cancelled) setProfileLoading(false);
        return;
      }

      try {
        const completeness = await getProfileCompleteness();
        if (cancelled) return;

        // 백엔드 AI 로드맵과 동일하게 트랙 + (학점 또는 스펙) 조건이면
        // 프론트 분석 기능을 이용할 수 있도록 합니다.
        const canUseFrontendAnalysis = Boolean(
          completeness?.trackCompleted
          && (completeness?.gradeCompleted || completeness?.specCompleted)
        );
        setIsRegistered(canUseFrontendAnalysis);

        const [
          memberResult,
          roomsResult,
          tracksResult,
          gpasResult,
          certificatesResult,
          awardsResult,
          volunteersResult,
          activitiesResult,
        ] = await Promise.allSettled([
          getMyMember(),
          getChatRooms(),
          getTracks(),
          getGradeGpas(),
          getCertificates(),
          getAwards(),
          getVolunteers(),
          getActivities(),
        ]);
        if (cancelled) return;

        const member = settledValue(memberResult, null);
        const rooms = settledValue(roomsResult, []);
        const tracks = settledValue(tracksResult, []);
        const trackNameById = new Map((Array.isArray(tracks) ? tracks : []).map((track) => [
          Number(track.trackId),
          track.trackName,
        ]));
        const nextName = member?.name || '000';

        setLocalProfile({
          name: nextName,
          grade: member?.grade ?? null,
          overallGpa: member?.gpa ?? null,
          trackNames: (member?.trackIds || [])
            .map((trackId) => trackNameById.get(Number(trackId)))
            .filter(Boolean),
          gpas: settledValue(gpasResult, []),
          certificates: settledValue(certificatesResult, []),
          awards: settledValue(awardsResult, []),
          volunteers: settledValue(volunteersResult, []),
          activities: settledValue(activitiesResult, []),
        });

        setUserName(nextName);
        setMessages(canUseFrontendAnalysis ? [{ sender: 'bot', text: buildWelcomeMessage(nextName) }] : []);
        setHistory(Array.isArray(rooms) ? rooms.map((room) => ({
          id: room.chatRoomId,
          text: room.title,
          timestamp: room.updatedAt || room.createdAt,
          remote: true,
        })) : []);
      } catch {
        if (!cancelled) {
          setIsRegistered(false);
          setMessages([]);
          setHistory([]);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    bootstrapChat();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!chatLogRef.current) return;
    chatLogRef.current.scrollTo({ top: chatLogRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  const groupedHistory = useMemo(() => history.reduce((groups, item) => {
    const label = historyLabel(item.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {}), [history]);

  const refreshHistory = async () => {
    try {
      const rooms = await getChatRooms();
      if (!Array.isArray(rooms)) return;
      setHistory(rooms.map((room) => ({
        id: room.chatRoomId,
        text: room.title,
        timestamp: room.updatedAt || room.createdAt,
        remote: true,
      })));
    } catch {
      // 대화는 유지하고 기록 목록만 다음 연결 시 갱신합니다.
    }
  };

  const submitQuery = async (query, { startNewRoom = false } = {}) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isSending || !isRegistered) return;

    setMessages((current) => [...current, { sender: 'user', text: trimmedQuery }]);
    setIsSending(true);

    const localPrompt = resolveLocalAnalysisPrompt(trimmedQuery);
    if (localPrompt) {
      const response = buildLocalAnalysis(localPrompt, localProfile);
      window.setTimeout(() => {
        setMessages((current) => [...current, { sender: 'bot', text: response }]);
        setHistory((current) => [{
          id: `local-${Date.now()}`,
          text: localPrompt,
          timestamp: Date.now(),
          remote: false,
          response,
        }, ...current.filter((item) => item.text !== localPrompt)]);
        setIsSending(false);
      }, 260);
      return;
    }

    const scenario = getScenario(trimmedQuery);
    if (!scenario) {
      window.setTimeout(() => {
        setMessages((current) => [...current, { sender: 'bot', text: UNSUPPORTED_RESPONSE }]);
        setIsSending(false);
      }, 320);
      return;
    }

    try {
      let roomId = startNewRoom ? null : currentRoomId;
      let reply;

      if (!roomId) {
        const started = await startChatRoom(scenario);
        if (!started?.started) {
          throw new Error('백엔드 상담 시작 조건을 충족하지 못했습니다.');
        }

        roomId = started.chatRoomId;
        setCurrentRoomId(roomId);

        const scenarioTitle = scenario === 'RECOMMENDED_JOB' ? '추천 직무' : '내 트랙 취업 분석';
        if (trimmedQuery === scenarioTitle) {
          reply = started.firstMessage;
        } else {
          reply = await sendChatMessage(roomId, trimmedQuery);
        }
      } else {
        reply = await sendChatMessage(roomId, trimmedQuery);
      }

      setMessages((current) => [...current, {
        sender: 'bot',
        text: reply?.content || getOfflineResponse(trimmedQuery),
      }]);
      refreshHistory();
    } catch {
      setMessages((current) => [...current, { sender: 'bot', text: getOfflineResponse(trimmedQuery) }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleHistoryClick = async (item) => {
    if (isSending) return;

    if (!item.remote) {
      const localPrompt = resolveLocalAnalysisPrompt(item.text);
      if (!localPrompt) return;
      const response = item.response || buildLocalAnalysis(localPrompt, localProfile);
      setCurrentRoomId(null);
      setMessages([
        { sender: 'user', text: localPrompt },
        { sender: 'bot', text: response },
      ]);
      return;
    }

    setIsSending(true);
    try {
      const remoteMessages = await getChatMessages(item.id);
      const visibleMessages = (Array.isArray(remoteMessages) ? remoteMessages : [])
        .filter((message) => !(message.role === 'USER' && message.content?.startsWith('[학생 정보]')))
        .map((message) => ({
          sender: message.role === 'USER' ? 'user' : 'bot',
          text: message.content,
        }));

      if (visibleMessages[0]?.sender !== 'user') {
        visibleMessages.unshift({ sender: 'user', text: item.text });
      }

      setCurrentRoomId(item.id);
      setMessages(visibleMessages.length ? visibleMessages : [{ sender: 'bot', text: buildWelcomeMessage(userName) }]);
    } catch {
      setMessages([{ sender: 'bot', text: '대화 기록을 불러오지 못했어요. 잠시 후 다시 선택해주세요.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = input;
    setInput('');
    submitQuery(query);
  };

  return (
    <div className="ai-chat-page">
      <Header
        activeMenu="aichat"
        theme="light"
        onMenuClick={handleMenuNavigation}
      />

      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="sidebar-header"><h2>최근 검색</h2></div>
          <div className="history-section">
            {!isRegistered || history.length === 0 ? (
              <p className="empty-history">아직 검색기록이 없어요.</p>
            ) : (
              Object.entries(groupedHistory).map(([label, items]) => (
                <section className="history-group" key={label}>
                  <h3>{label}</h3>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <button type="button" onClick={() => handleHistoryClick(item)}>
                          <img src={aichatHistoryIcon} alt="" />
                          <span>{item.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        </aside>

        <main className="chat-main">
          <div className="chat-title"><img src={aichatHeader} alt="HSTEP AI Chat" /></div>

          <div className="chat-stage">
            <img className="background-watermark" src={aichatLogo} alt="" aria-hidden="true" />

            <div className="chat-log" ref={chatLogRef} aria-live="polite">
              {!profileLoading && !isRegistered && (
                <div className="unregistered-flow">
                  <div className="message-row bot">
                    <img className="bot-avatar" src={aichatBot} alt="HSTEP 챗봇" />
                    <div className="message-bubble registration-bubble">
                      <p>안녕하세요, {userName} 학우님!<br />HSTEP AI 챗봇이에요.</p>
                      <p>
                        맞춤형 취업 상담을 이용하려면 마이페이지에서 <strong>학점과 개인 스펙을 먼저 등록</strong>해주세요.<br />
                        등록이 완료되면 {userName}님의 트랙과 스펙을 기반으로 최적의 취업 정보를 제공할게요!
                      </p>
                    </div>
                  </div>
                  <button className="goto-register-button" type="button" onClick={() => handleMenuNavigation('mypage')}>
                    마이페이지에서 정보 등록하러 가기
                    <img src={aichatRegisterArrow} alt="" />
                  </button>
                </div>
              )}

              {!profileLoading && isRegistered && (
                <div className="registered-flow">
                  {messages.map((message, index) => (
                    <div className={`message-row ${message.sender}`} key={`${message.sender}-${index}`}>
                      {message.sender === 'bot' && <img className="bot-avatar" src={aichatBot} alt="HSTEP 챗봇" />}
                      <div className="message-bubble">{message.text}</div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="message-row bot pending-message">
                      <img className="bot-avatar" src={aichatBot} alt="" />
                      <div className="message-bubble"><span /><span /><span /></div>
                    </div>
                  )}

                  <div className="prompt-suggestions" aria-label="추천 질문">
                    {PROMPT_ROWS.map((row, rowIndex) => (
                      <div className="prompt-row" key={rowIndex}>
                        {row.map((prompt) => (
                          <button type="button" key={prompt} onClick={() => submitQuery(prompt, { startNewRoom: true })} disabled={isSending}>
                            {prompt}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="궁금한점을 입력하세요."
                aria-label="챗봇에게 질문하기"
              />
              <button type="submit" disabled={!input.trim() || isSending || !isRegistered} aria-label="메시지 전송">
                <img src={aichatSend} alt="" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AiChat;
