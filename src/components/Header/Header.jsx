import React from 'react';
import styles from './Header.module.css';

import HSTEPLogo from '../../assets/HSTEP_logo.svg';
import searchIcon from '../../assets/header_search.svg';
import menuBarIcon from '../../assets/header_menuBar.svg';

export default function Header({ activeMenu, theme = 'light', onMenuClick }) {
  // 테마에 따라 CSS 클래스를 다르게 조립
  const headerClass = `${styles.header} ${theme === 'transparent' ? styles.themeTransparent : styles.themeLight}`;

  return (
    <header className={headerClass}>
      <div className={styles.headerInner}>
        
        <img 
          src={HSTEPLogo} 
          alt="HSTEP 로고" 
          className={styles.logoImage} 
          onClick={() => onMenuClick && onMenuClick('main')} 
        />
        
        <nav className={styles.nav}>
          <span 
            className={`${styles.navItem} ${activeMenu === 'main' ? styles.navItemActive : ''}`}
            onClick={() => onMenuClick && onMenuClick('main')}
          >
            메인홈
          </span>
          <span className={`${styles.navItem} ${activeMenu === 'roadmap' ? styles.navItemActive : ''}`}>나의 로드맵</span>
          <span className={`${styles.navItem} ${activeMenu === 'recommend' ? styles.navItemActive : ''}`}>공고 추천</span>
          <span className={`${styles.navItem} ${activeMenu === 'chat' ? styles.navItemActive : ''}`}>AI채팅</span>
          <span 
            className={`${styles.navItem} ${activeMenu === 'mypage' ? styles.navItemActive : ''}`}
            onClick={() => onMenuClick && onMenuClick('mypage')}
          >
            마이페이지
          </span>
          <span 
            className={`${styles.navItem} ${activeMenu === 'inquiry' ? styles.navItemActive : ''}`}
            onClick={() => onMenuClick && onMenuClick('inquiry')} // ✨ 이 줄을 추가합니다!
          >
            문의
          </span>
        </nav>

        <div className={styles.headerIcons}>
          <img src={searchIcon} alt="검색" className={styles.actionIcon} />
          <img src={menuBarIcon} alt="메뉴" className={styles.actionIcon} />
        </div>
      </div>
    </header>
  );
}