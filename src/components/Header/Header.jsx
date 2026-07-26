import React from 'react';
import styles from './Header.module.css';

// AI채팅 페이지에서 사용하는 에셋 그대로 사용
import notice_logo from '../../assets/notice_logo.svg';
import notice_search from '../../assets/notice_search.svg';
import notice_menu from '../../assets/notice_menu.svg';

export default function Header({ activeMenu, theme = 'light', onMenuClick }) {
  const headerClass = `${styles.header} ${theme === 'transparent' ? styles.themeTransparent : styles.themeLight}`;

  return (
    <header className={headerClass}>
      {/* 로고 영역 */}
      <div 
        className={styles.logoArea}
        onClick={() => onMenuClick && onMenuClick('main')}
      >
        <img src={notice_logo} alt="HSTEP 로고" className={styles.logoImage} />
      </div>
      
      {/* 중앙 네비게이션: 선택된 메뉴는 무조건 styles.activeLink (파란색!) */}
      <nav className={styles.navMenu}>
        <a 
          href="#home"
          className={`${styles.navLink} ${activeMenu === 'main' || activeMenu === 'home' ? styles.activeLink : ''}`}
          onClick={(e) => { e.preventDefault(); onMenuClick && onMenuClick('main'); }}
        >
          메인홈
        </a>
        
        <a 
          href="#roadmap"
          className={`${styles.navLink} ${activeMenu === 'roadmap' ? styles.activeLink : ''}`}
          onClick={(e) => { e.preventDefault(); onMenuClick && onMenuClick('roadmap'); }}
        >
          나의 로드맵
        </a>
        
        <a 
          href="#jobs"
          className={`${styles.navLink} ${activeMenu === 'recommend' || activeMenu === 'jobs' || activeMenu === 'externalJobs' ? styles.activeLink : ''}`}
          onClick={(e) => { e.preventDefault(); onMenuClick && onMenuClick('externalJobs'); }}
        >
          공고 추천
        </a>
        
        <a 
          href="#ai-chat"
          className={`${styles.navLink} ${activeMenu === 'chat' || activeMenu === 'aichat' || activeMenu === 'ai-chat' ? styles.activeLink : ''}`}
          onClick={(e) => { e.preventDefault(); onMenuClick && onMenuClick('aichat'); }}
        >
          AI채팅
        </a>
        
        <a 
          href="#mypage"
          className={`${styles.navLink} ${activeMenu === 'mypage' ? styles.activeLink : ''}`}
          onClick={(e) => { e.preventDefault(); onMenuClick && onMenuClick('mypage'); }}
        >
          마이페이지
        </a>
        
        <a 
          href="#contact"
          className={`${styles.navLink} ${activeMenu === 'inquiry' || activeMenu === 'contact' ? styles.activeLink : ''}`}
          onClick={(e) => { e.preventDefault(); onMenuClick && onMenuClick('contact'); }}
        >
          문의
        </a>
      </nav>

      {/* 우측 아이콘 영역 */}
      <div className={styles.rightIcons}>
        <img src={notice_search} alt="검색" className={styles.icon} />
        <img src={notice_menu} alt="메뉴" className={styles.icon} />
      </div>
    </header>
  );
}