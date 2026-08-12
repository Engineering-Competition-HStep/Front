import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import FindPassword from './pages/FindPassword.jsx';
import Signup from './pages/Signup.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import MainPage from './pages/Main/MainPage.jsx';
import NoticePage from './pages/NoticePage/NoticePage';
import ExternalJobs from './pages/ExternalJobs/ExternalJobs.jsx';
import MyPageRegistration from './pages/MyPage/MyPageRegistration.jsx';
import Inquiry from './pages/Inquiry/Inquiry.jsx';
import './index.css';

function App() {
  // 현재 화면 상태를 관리 기본값은 'login'
  const [currentView, setCurrentView] = useState('login');

  //main먼저 볼려고 써둔 것.
  // const [currentView, setCurrentView] = useState('main');

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
        return <Signup onBackToLogin={ () => setCurrentView('login') } />

      case 'main':
        // 메인화면 상단 바에서 마이페이지와 공지사항으로 정상 이동하도록 수정
        return <MainPage 
          onNavigateToMyPage={() => setCurrentView('mypage')} 
          onNavigateToNotice={() => setCurrentView('notice')}
          onNavigateToExternalJobs={() => handleNavigate('externalJobs')}
          />;

      case 'notice': 
        // 공지사항-> main
        return <NoticePage 
          onNavigateToMain={() => setCurrentView('main')}
          onNavigateToMyPage={() => setCurrentView('mypage')}
        />;
      
      case 'mypage':
        return <MyPage onNavigate={handleNavigate} />;

      case 'externalJobs':
        // 외부 취업 공고 화면
        return <ExternalJobs onNavigate={handleNavigate} />;
      
      case 'mypageRegistration':
        return <MyPageRegistration onNavigate={handleNavigate} />;

      case 'inquiry':
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