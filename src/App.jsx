import React, { useState } from 'react';
import Login from './pages/Login.jsx'; 
import FindPassword from './pages/FindPassword.jsx'; 
import Signup from './pages/Signup.jsx';
// 💡 1. 불러오는 경로와 이름을 바꿔줍니다.
import MainPage from './pages/main/MainPage.jsx'; 
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); 

  const renderView = () => {
    switch (currentView) {
      case 'home':
        // 💡 2. 화면에 띄울 컴포넌트 이름도 MainPage로 바꿉니다.
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
        // 💡 3. 기본값도 바꿔줍니다.
        return <MainPage />; 
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default App;