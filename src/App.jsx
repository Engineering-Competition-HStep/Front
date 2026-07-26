import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import FindPassword from './pages/FindPassword.jsx';
import Signup from './pages/Signup.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import MainPage from './pages/Main/MainPage.jsx';
import NoticePage from './pages/NoticePage/NoticePage';
import ExternalJobs from './pages/ExternalJobs/ExternalJobs.jsx';
import ExternalJobsMore from './pages/ExternalJobsMore/ExternalJobsMore.jsx';
import AiChat from './pages/AiChat/AiChat.jsx'; // 💡 1. AiChat 컴포넌트 import 추가
import MyPageRegistration from './pages/MyPage/MyPageRegistration.jsx';
import Inquiry from './pages/Inquiry/Inquiry.jsx';
import './index.css';

function App() {
  // 현재 화면 상태를 관리 기본값은 'login'
  //const [currentView, setCurrentView] = useState('login'); 

  //main먼저 볼려고 써둔 것.
  const [currentView, setCurrentView] = useState('main');

  // 마이페이지 등에서 호출하는 handleNavigate 함수
  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // 현재 뷰 상태에 따라 다른 컴포넌트를 보여주는 함수
  const renderView = () => {
    switch (currentView) {
      // login -> (비밀번호 찾기 / 회원가입 / 메인화면)
      case 'login':
        return (
          <Login 
            onNavigateToFindPassword={() => setCurrentView('findPassword')} 
            onNavigateToSignup={() => setCurrentView('signup')} 
            onLoginSuccess={() => setCurrentView('main')}
          />
        );
      
      case 'findPassword':
        // 비밀번호 찾기 -> login
        return <FindPassword onBackToLogin={() => setCurrentView('login')} />;
      
      case 'signup':
        // 회원가입 -> login
        return <Signup onBackToLogin={ () => setCurrentView('login') } />;

      case 'main':
      case 'home': //  'home'으로 요청이 와도 메인화면이 뜨도록 호환성 추가
        // 메인화면 상단 바에서 마이페이지와 공지사항으로 정상 이동하도록 수정
        return <MainPage 
          onNavigate={handleNavigate} // 통합 네비게이션 props 추가 (나의 로드맵, 문의 등 이동용)
          onNavigateToMyPage={() => setCurrentView('mypage')} 
          onNavigateToNotice={() => setCurrentView('notice')}
          onNavigateToExternalJobs={() => handleNavigate('externalJobs')}
          onNavigateToExternalJobsMore={() => handleNavigate('externalJobsMore')}
          onNavigateToAiChat={() => handleNavigate('aiChat')}
        />;

      case 'notice': 
        // 공지사항-> main
        //공지사항 페이지에서도 공고추천, AI채팅 등으로 자유롭게 이동하도록 props 추가!
        return <NoticePage 
          onNavigate={handleNavigate}
          onNavigateToMain={() => setCurrentView('main')}
          onNavigateToMyPage={() => setCurrentView('mypage')}
          onNavigateToExternalJobs={() => handleNavigate('externalJobs')}
          onNavigateToAiChat={() => handleNavigate('aiChat')}
        />;
      
      case 'mypage':
        return <MyPage onNavigate={handleNavigate} />;

      case 'externalJobs':
      case 'jobs': // Header.jsx에서 'jobs'로 요청해도 외부 취업 공고가 뜨도록 호환성 추가
      case 'recommend':
        // 외부 취업 공고 화면
        return <ExternalJobs onNavigate={handleNavigate} />;
      
      case 'externalJobsMore':
        return <ExternalJobsMore onNavigate={handleNavigate} />;
      
      case 'aiChat': // aiChat 뷰
      case 'aichat': // 소문자 'aichat'이나 'chat'으로 요청해도 AI채팅이 뜨도록 대소문자 방어!
      case 'chat':
        return <AiChat onNavigate={handleNavigate} />;
      
      case 'mypageRegistration':
        return <MyPageRegistration onNavigate={handleNavigate} />;

      case 'inquiry':
      case 'contact': // 'contact'로 요청이 와도 문의 페이지가 잘 뜨도록 호환성 추가
        return <Inquiry onNavigate={handleNavigate} />;
      
      default:
        // 기본값 로그인 화면
        return (
          <Login 
            onNavigateToFindPassword={() => setCurrentView('findPassword')} 
            onNavigateToSignup={() => setCurrentView('signup')} 
            onLoginSuccess={() => setCurrentView('main')}
          />
        );
    }
  };

  return (
    <div>
      {/* 화면을 결정하는 함수를 실행하여 결과를 렌더링합니다. */}
      {renderView()}
    </div>
  );
}

export default App;