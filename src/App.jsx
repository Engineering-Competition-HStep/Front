import React, { useState } from 'react';
import Login from './pages/Login.jsx'; // 확장자 .jsx를 명시하는 것이 좋습니다.
import FindPassword from './pages/FindPassword.jsx'; // 새로 만든 비밀번호 찾기 페이지를 불러옵니다.
import Signup from './pages/Signup.jsx';
import './index.css';

function App() {
  // 현재 화면 상태를 관리합니다. 기본값은 'login' 입니다.
  const [currentView, setCurrentView] = useState('login'); 

  // 현재 뷰 상태에 따라 다른 컴포넌트를 보여주는 함수입니다.
  const renderView = () => {
    switch (currentView) {
      case 'login':
        // 로그인 화면일 때, "비밀번호 찾기" 화면으로 넘어가는 함수를 props로 내려줍니다.
        return (
          <Login 
            onNavigateToFindPassword={() => setCurrentView('findPassword')} 
            onNavigateToSignup={() => setCurrentView('signup')} 
          />
        );
      
      case 'findPassword':
        // 비밀번호 찾기 화면일 때, 다시 "로그인" 화면으로 돌아오는 함수를 props로 내려줍니다.
        return <FindPassword onBackToLogin={() => setCurrentView('login')} />;
      
      case 'signup':
        return <Signup onBackToLogin={ () => setCurrentView('login') } />

      default:
        // 알 수 없는 상태일 경우 안전하게 로그인 화면을 보여줍니다.
        return (
          <Login 
            onNavigateToFindPassword={() => setCurrentView('findPassword')} 
            onNavigateToSignup={() => setCurrentView('signup')} 
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