import React from 'react';
import styles from './Header.module.css';

import HSTEPLogo from '../../assets/HSTEP_logo.svg';

// activeMenu prop을 받아 어떤 메뉴에 파란 불을 켤지 결정합니다.
export default function Header({ activeMenu }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        
        {/* ✨ 텍스트 대신 HSTEP 로고 이미지 사용 */}
        <img src={HSTEPLogo} alt="HSTEP 로고" className={styles.logoImage} />
        
        <nav className={styles.nav}>
          <span className={`${styles.navItem} ${activeMenu === 'main' ? styles.navItemActive : ''}`}>메인홈</span>
          <span className={`${styles.navItem} ${activeMenu === 'roadmap' ? styles.navItemActive : ''}`}>나의 로드맵</span>
          <span className={`${styles.navItem} ${activeMenu === 'recommend' ? styles.navItemActive : ''}`}>공고 추천</span>
          <span className={`${styles.navItem} ${activeMenu === 'chat' ? styles.navItemActive : ''}`}>AI채팅</span>
          {/* 마이페이지일 경우 파란불 켜짐 */}
          <span className={`${styles.navItem} ${activeMenu === 'mypage' ? styles.navItemActive : ''}`}>마이페이지</span>
          <span className={`${styles.navItem} ${activeMenu === 'inquiry' ? styles.navItemActive : ''}`}>문의</span>
        </nav>

        <div className={styles.headerIcons}>
          {/* 검색 아이콘 */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {/* 햄버거 메뉴 아이콘 */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
      </div>
    </header>
  );
}