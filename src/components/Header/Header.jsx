import React from 'react';
import styles from './Header.module.css';

import HSTEPLogo from '../../assets/HSTEP_logo.svg';
import searchIcon from '../../assets/header_search.svg';
import menuBarIcon from '../../assets/header_menuBar.svg';

// activeMenu prop을 받아 어떤 메뉴에 파란 불을 켤지 결정합니다.
export default function Header({ activeMenu }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        
        <img src={HSTEPLogo} alt="HSTEP 로고" className={styles.logoImage} />
        
        <nav className={styles.nav}>
          <span className={`${styles.navItem} ${activeMenu === 'main' ? styles.navItemActive : ''}`}>메인홈</span>
          <span className={`${styles.navItem} ${activeMenu === 'roadmap' ? styles.navItemActive : ''}`}>나의 로드맵</span>
          <span className={`${styles.navItem} ${activeMenu === 'recommend' ? styles.navItemActive : ''}`}>공고 추천</span>
          <span className={`${styles.navItem} ${activeMenu === 'chat' ? styles.navItemActive : ''}`}>AI채팅</span>
          <span className={`${styles.navItem} ${activeMenu === 'mypage' ? styles.navItemActive : ''}`}>마이페이지</span>
          <span className={`${styles.navItem} ${activeMenu === 'inquiry' ? styles.navItemActive : ''}`}>문의</span>
        </nav>

        <div className={styles.headerIcons}>
          {/* 검색 아이콘 */}
          <img src={searchIcon} alt="검색" className={styles.actionIcon} />
          {/* 메뉴 아이콘 */}
          <img src={menuBarIcon} alt="메뉴" className={styles.actionIcon} />
        </div>
      </div>
    </header>
  );
}