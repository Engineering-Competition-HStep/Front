import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import FindPassword from './pages/FindPassword.jsx';
import Signup from './pages/Signup.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import MainPage from './pages/Main/MainPage.jsx';
import MyPageRegistration from './pages/MyPage/MyPageRegistration.jsx';
import Inquiry from './pages/Inquiry/Inquiry.jsx';
import './index.css';

function App() {
  // 현재 화면 상태를 관리 기본값은 'login'
  const [currentView, setCurrentView] = useState('login'); 

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0); // 화면 이동 시 스크롤을 맨 위로 올려줍니다.
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
        return <MainPage onNavigate={handleNavigate} />;

      case 'mypage':
        return <MyPage onNavigate={handleNavigate} />;
      
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



/*import React, { useState } from 'react';
import Login from './pages/Login.jsx'; 
import FindPassword from './pages/FindPassword.jsx'; 
import Signup from './pages/Signup.jsx';
//  1. 불러오는 경로와 이름을 바꿔줍니다.
import MainPage from './pages/main/MainPage.jsx'; 
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); 

  const renderView = () => {
    switch (currentView) {
      case 'home':
        // 2. 화면에 띄울 컴포넌트 이름도 MainPage로 바꿉니다.
        return <MainPage />;

      case 'login':
        return (
          <Login 
            onNavigateToFindPassword={() => setCurrentView('findPassword')} 
            onNavigateToSignup={() => setCurrentView('signup')} 
          />
        );
      
      case 'findPassword':
        return <FindPassword onBackToLogin={() => setCurrentView('login')} />;
      
      case 'signup':
        return <Signup onBackToLogin={ () => setCurrentView('login') } />

      default:
        // 3. 기본값도 바꿔줍니다.
        return <MainPage />; 
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default App; */