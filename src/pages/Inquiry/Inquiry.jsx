import React, { useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import styles from './Inquiry.module.css';

// 개인정보 동의 라디오 아이콘
import checkIcon from '../../assets/Inquiry_checkIcon.svg';
import checkIconActive from '../../assets/Inquiry_checkIcon_activate.svg';

export default function Inquiry({ onNavigate }) {
  // 입력 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: '',
    details: '',
    consent: false,
  });

  // 상태 업데이트 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'details') {
      if (value === '') {
        e.target.style.height = '60px'; 
      } else {
        e.target.style.height = '1px'; 
        e.target.style.height = `${e.target.scrollHeight}px`; 
      }
    }
  };


  // 폼 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(" 문의하기 데이터:", formData);
    // 제출 후 메인홈으로 이동
    if(onNavigate) onNavigate('main');
  };

  // 모든 필수값이 입력되었는지 확인 (버튼 활성화용)
  const isFormValid = 
    formData.name && 
    formData.phone && 
    formData.email && 
    formData.type && 
    formData.details && 
    formData.consent;

  return (
    <div className={styles.pageContainer}>
      <Header activeMenu="inquiry" onMenuClick={(menu) => onNavigate && onNavigate(menu)} />

      <main className={styles.mainContent}>
        
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>문의하기</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.formArea}>
          
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>이름(Name)</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력해 주세요." 
                className={styles.input} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>휴대폰 번호(Phone Number)</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="-없이 입력해 주세요." 
                className={styles.input} 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>이메일(School email)</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="학교 이메일을 입력해 주세요." 
                className={styles.input} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>문의유형</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`${styles.select} ${formData.type ? styles.selected : ''}`}
              >
                <option value="" disabled hidden>문의 유형을 선택해 주세요.</option>
                <option value="service">서비스 이용 문의</option>
                <option value="error">오류/버그 신고</option>
                <option value="proposal">제휴/제안</option>
                <option value="etc">기타</option>
              </select>
            </div>
          </div>

          <div className={styles.detailsGroup}>
            <label className={styles.label}>문의 내용(Inquiry Details)</label>
            <textarea 
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="문의하실 내용을 입력해 주세요.&#13;&#10;문의 내용을 구체적으로 입력해 주시면 정확한 답변에 도움이 됩니다." 
              className={styles.textarea}
              maxLength={500}
            />
            {/* 글자 수 표시 */}
            <div className={styles.charCount}>
              <strong>{formData.details.length}</strong> / 500자
            </div>
          </div>

          <div className={styles.consentGroup}>
            <label className={styles.label}>개인정보 수집 및 이용 동의 (Required)</label>
            <p className={styles.consentDesc}>
              문의 답변을 위해 이름과 연락처를 수집합니다. 동의한 경우에만 문의를 접수할 수 있습니다.<br/>
              <span style={{ color: '#849CB2' }}>
                To respond to your inquiry, we collect your name and contact information.<br/>
                Your inquiry can only be submitted after your consent.
              </span>
            </p>
            
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className={styles.hiddenCheckbox} 
              />
              <img 
                src={formData.consent ? checkIconActive : checkIcon} 
                alt="체크 아이콘" 
                className={styles.checkIconImg} 
              />
              개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>

          <div className={styles.submitWrapper}>
            <button 
              type="submit" 
              className={`${styles.submitBtn} ${isFormValid ? styles.active : ''}`}
              disabled={!isFormValid}
            >
              문의글 전송하기
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}