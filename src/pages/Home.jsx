import InputForm from '../components/InputForm';

function Home() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>한성대학교 취업 로드맵 AI</h1>
        <p>당신의 전공과 스펙을 입력하여 맞춤형 로드맵을 확인하세요.</p>
        <hr style={{ margin: '20px 0' }} />

      {/* 입력 폼 컴포넌트를 화면에 불러옵니다 */}
        <InputForm />
        </div>
    );
}

export default Home;