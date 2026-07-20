import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerCs}>
          <h3>고객센터 〉</h3>
          <div className={styles.time}>1670-0876 09:00~18:00</div>
          <ul>
            <li>평일: 전체 문의 상담</li>
            <li>토요일, 공휴일: 오늘의집 직접배송 주문건 상담</li>
            <li>일요일: 휴무</li>
          </ul>
          <div className={styles.btnGroup}>
            <button>카톡 상담(평일 09:00~18:00)</button>
            <button>이메일 문의</button>
          </div>
        </div>
        
        <div className={styles.footerLinks}>
          <span>회사소개</span><span>회사소개</span>
          <span>회사소개</span><span>회사소개</span>
          <span>회사소개</span><span>파트너 개인정보 처리방침</span>
          <span>개인정보 처리방침</span><span>회사소개</span>
          <span>회사소개</span><span>회사소개</span>
          <span>회사소개</span><span>회사소개</span>
          <span>회사소개</span>
        </div>
        
        <div className={styles.footerLegal}>
          <p>(주)버킷플레이스 | 대표이사 이승재 | 서울 서초구 서초대로74길 4 삼성생명서초타워 25층, 27층</p>
          <p>contact@bucketplace.net | 사업자등록번호 119-86-91245 사업자정보확인</p>
          <p>통신판매업신고번호 제2018-서울서초-0580호</p>
          <p style={{ marginTop: 16 }}>고객님이 현금결제한 금액에 대해 우리은행과 채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다. 서비스가입사실확인</p>
          <div className={styles.guaranteeBox}>
            <div className={styles.guaranteeLabel}>오늘의집 서비스 운영<br/>2024. 09. 08 ~ 2027. 09. 07</div>
          </div>
          <p className={styles.noticeText}>
            (주)버킷플레이스는 통신판매중개자로 거래 당사자가 아니므로, 판매자가 등록한 상품정보 및 거래 등에 대해 책임을 지지 않습니다. 단, (주)버킷플레이스가 판매자로 등록 판매한 상품은 판매자로서 책임을 부담합니다.
          </p>
          <div className={styles.social}>
            <span /><span /><span /><span />
          </div>
          <p>Copyright 2014. bucketplace, Co., Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}