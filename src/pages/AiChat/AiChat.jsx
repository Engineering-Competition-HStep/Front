import React, { useState, useEffect } from 'react';
import './AiChat.scss';

// 공통 로고 및 아이콘
import notice_logo from '../../assets/notice_logo.svg';
import notice_search from '../../assets/notice_search.svg';
import notice_menu from '../../assets/notice_menu.svg';

// 챗봇 전용 에셋
import aichat_bot from '../../assets/aichat_bot.svg';
import aichat_logo from '../../assets/aichat_logo.svg';
import aichat_search from '../../assets/aichat_search.svg';
import aichat_header from '../../assets/aichat_header.svg';

const promptRows = [
  ['내 트랙 취업 분석', '내 스펙 분석', '추천 직무', '추천 자격증'],
  ['추천 공모전', '평균평점 경쟁력', '토익 필요없는 회사']
];

const getSimulatedBotResponse = (query) => {
  if (query.includes('트랙') || query.includes('취업')) {
    return '000 학우님의 트랙(부동산/IT공학 등)을 분석한 결과, IT 서비스 기획 및 프론트엔드 개발 직무로의 진출이 가장 유리합니다! 최근 3개년 선배들의 취업 데이터 기준 합격률 85% 구간이에요.';
  } else if (query.includes('스펙') || query.includes('평점') || query.includes('경쟁력')) {
    return '현재 입력된 학점과 활동 내역을 종합한 결과, 실무 프로젝트 경험이 매우 돋보입니다! 다만 대기업 공채 지원을 위해서는 정보처리기사 자격증 취득을 추가로 추천드려요.';
  } else if (query.includes('직무') || query.includes('자격증') || query.includes('공모전')) {
    return '학우님의 트랙에 꼭 맞는 추천 자격증은 [SQLD], [ADsP], [정보처리기사] 입니다. 이번 방학 기간 동안 한성대 교내 빅데이터 공모전에 도전해보는 건 어떨까요?';
  } else if (query.includes('토익') || query.includes('회사') || query.includes('어학')) {
    return '최근 IT 및 Tech 계열 기업(카카오, 토스, 네이버 등)은 토익 점수 대신 코딩 테스트와 깃허브 포트폴리오를 100% 반영하는 추세입니다. 실무 프로젝트 역량에 집중해보세요!';
  } else {
    return `"${query}"에 대한 분석을 완료했습니다!\n한성대학교 AI 챗봇이 학우님의 성공적인 취업 로드맵을 위해 맞춤 기업 5곳을 뽑아두었어요. 마이페이지에서 상세 보고서를 확인해보세요.`;
  }
};

function AiChat({ onNavigate }) {
  const [isRegistered, setIsRegistered] = useState(true);
  const [input, setInput] = useState('');

  // 브라우저 로컬 스토리지 기반 최근 검색어 관리 (몇 일 전 자동 계산)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('hstep_aichat_history');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: '시각디자인 관련 취업 공고', timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 },
      { id: 2, text: 'IT 공과대학이 하면 좋을 공모전', timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { id: 3, text: '내 트랙 취업 분석', timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    ];
  });

  const [messages, setMessages] = useState([
    { sender: 'bot', text: '환영합니다, 000 학우님!\nHSTEP AI 챗봇이에요.\n등록된 스펙을 기반으로 취업을 도와드릴게요.' }
  ]);

  useEffect(() => {
    localStorage.setItem('hstep_aichat_history', JSON.stringify(history));
  }, [history]);

  const triggerChat = (userText) => {
    if (!userText.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);

    // 검색 시 현재 시간(timestamp)을 저장하여 몇 일 전인지 자동 계산되게 함
    const newHistoryItem = { id: Date.now(), text: userText, timestamp: Date.now() };
    setHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.text !== userText)]);

    setTimeout(() => {
      const botReply = getSimulatedBotResponse(userText);
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const handleChipClick = (text) => triggerChat(text);
  const handleSend = () => { triggerChat(input); setInput(''); };

  // 날짜 차이를 계산하여 '오늘', '어제', 'N일 전'으로 그룹화
  const getGroupedHistory = () => {
    const groups = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    history.forEach((item) => {
      const itemDate = new Date(item.timestamp);
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();
      const diffDays = Math.round((today - itemDay) / (1000 * 60 * 60 * 24));

      let label = diffDays === 0 ? '오늘' : diffDays === 1 ? '어제' : `${diffDays}일 전`;
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });
    return groups;
  };

  const groupedHistory = getGroupedHistory();

  return (
    <div className="ai-chat-page">
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px', 
        backgroundColor: 'transparent',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        boxSizing: 'border-box'
      }}>
        <div 
          onClick={() => onNavigate && onNavigate('main')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '150px' }}
        >
          <img src={notice_logo} alt="HSTEP 로고" style={{ height: '24px', width: 'auto', display: 'block' }} />
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', fontSize: '15px' }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('main'); }} style={{ color: '#333333', textDecoration: 'none', opacity: 0.9 }}>메인홈</a>
          <a href="#roadmap" style={{ color: '#333333', textDecoration: 'none', opacity: 0.9 }}>나의 로드맵</a>
          <a href="#jobs" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('externalJobs'); }} style={{ color: '#333333', textDecoration: 'none', opacity: 0.9 }}>공고 추천</a>
          <a 
            href="#ai-chat" 
            style={{ color: '#0084FF', fontWeight: '600', textDecoration: 'none', borderBottom: '2px solid #0084FF', paddingBottom: '4px' }}
          >
            AI채팅
          </a>
          <a href="#mypage" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('mypage'); }} style={{ color: '#333333', textDecoration: 'none', opacity: 0.9 }}>마이페이지</a>
          <a href="#contact" style={{ color: '#333333', textDecoration: 'none', opacity: 0.9 }}>문의</a>
        </nav>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '150px', justifyContent: 'flex-end' }}>
          <img src={notice_search} alt="검색" style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
          <img src={notice_menu} alt="메뉴" style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
        </div>
      </header>

      <div className="chat-layout">
        {/* 1. 좌측 사이드바 */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h3>최근 검색</h3>
          </div>
          
          <div className="history-section">
            {!isRegistered || history.length === 0 ? (
              <p className="empty-history">아직 검색기록이 없어요.</p>
            ) : (
              Object.entries(groupedHistory).map(([label, items]) => (
                <div key={label} className="history-group">
                  {/* 날짜 라벨 (이 밑으로 SCSS에서 선이 그어짐.) */}
                  <div className="date-label-wrapper">
                    <p className="date-label">{label}</p>
                  </div>
                  <ul className="history-list">
                    {items.map((item) => (
                      <li key={item.id} className="history-item" onClick={() => triggerChat(item.text)}>
                        <img src={aichat_search} alt="" className="search-icon" />
                        <span className="text">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* 2. 우측 메인 채팅 영역 */}
        <main className="chat-main">
          <div className="main-header">
            <div className="title-area">
              <img src={aichat_header} alt="HSTEP AI Chat" className="header-title-img" />
            </div>
            <button 
              className="dev-toggle-btn" 
              onClick={() => setIsRegistered(!isRegistered)}
              title="클릭하여 미등록/등록 화면을 전환해보세요!"
            >
              🔄 테스트: {isRegistered ? '스펙 등록됨 (2번)' : '스펙 미등록 (1번)'}
            </button>
          </div>

          <div className="chat-log">
            <div className="background-watermark">
              <img src={aichat_logo} alt="배경 로고" />
            </div>

            {!isRegistered ? (
              <div className="unregistered-flow">
                <div className="message-row bot">
                  <div className="bot-avatar-wrapper"><img src={aichat_bot} alt="챗봇" /></div>
                  <div className="message-bubble">
                    <p className="greet-text">안녕하세요, 000 학우님!<br />HSTEP AI 챗봇이에요.</p>
                    <p className="desc-text">
                      맞춤형 취업 상담을 이용하려면 마이페이지에서 <strong className="highlight-blue">학점과 개인 스펙을 먼저 등록</strong>해주세요.<br />
                      등록이 완료되면 000님의 트랙과 스펙을 기반으로 최적의 취업 정보를 제공할게요!
                    </p>
                  </div>
                </div>
                <div className="action-row">
                  <button className="goto-register-btn" onClick={() => onNavigate && onNavigate('mypageRegistration')}>
                    마이페이지에서 정보 등록하러 가기 <span>→</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="registered-flow">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="bot-avatar-wrapper"><img src={aichat_bot} alt="챗봇" /></div>
                    )}
                    <div className="message-bubble">{msg.text}</div>
                  </div>
                ))}

                <div className="prompt-suggestions">
                  {promptRows.map((row, rIdx) => (
                    <div key={rIdx} className="prompt-row">
                      {row.map((chip, cIdx) => (
                        <button key={cIdx} className="prompt-chip" onClick={() => handleChipClick(chip)}>
                          {chip}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="input-section">
            <div className="input-box">
              <input
                type="text"
                placeholder="궁금한점을 입력하세요."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn" onClick={handleSend} aria-label="메시지 전송">↑</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AiChat;