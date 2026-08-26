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
  getAccessToken,
  getChatMessages,
  getChatRooms,
  getMyMember,
  getProfileCompleteness,
  sendChatMessage,
  startChatRoom,
} from '../../services/hstepApi.js';

const PROMPT_ROWS = [
  ['내 트랙 취업 분석', '추천 직무', '추천 자격증'],
  ['추천 공모전', '평균평점 경쟁력', '토익 필요없는 회사'],
];

const UNSUPPORTED_RESPONSE = '죄송해요.\n현재 해당 상담은 지원하지 않는 기능이에요.\n현재는 취업, 진로, 공고, 자격증, 로드맵 관련 상담을 이용하실 수 있어요!';

function getScenario(query) {
  if (query === '추천 직무' || query === '토익 필요없는 회사') return 'RECOMMENDED_JOB';
  if (PROMPT_ROWS.flat().includes(query)) return 'TRACK_CAREER_ANALYSIS';
  if (/트랙|취업|진로|공고|자격증|로드맵|평점|토익|직무/.test(query)) return 'TRACK_CAREER_ANALYSIS';
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
      if (!getAccessToken()) {
        if (!cancelled) setProfileLoading(false);
        return;
      }

      try {
        const completeness = await getProfileCompleteness();
        if (cancelled) return;

        setIsRegistered(Boolean(completeness?.completed));

        const [memberResult, roomsResult] = await Promise.allSettled([
          getMyMember(),
          getChatRooms(),
        ]);
        if (cancelled) return;

        const member = memberResult.status === 'fulfilled' ? memberResult.value : null;
        const rooms = roomsResult.status === 'fulfilled' ? roomsResult.value : [];
        const nextName = member?.name || '000';

        setUserName(nextName);
        setMessages(completeness?.completed ? [{ sender: 'bot', text: buildWelcomeMessage(nextName) }] : []);
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
          setIsRegistered(false);
          setMessages([]);
          return;
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
    if (!item.remote || isSending) return;

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
