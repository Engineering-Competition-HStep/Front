function InputForm() {
    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>스펙 정보 입력</h3>
        <p>여기에 학년, 전공, 희망 직무를 입력하는 칸이 추가될 예정입니다.</p>
        <button style={{ padding: '10px 15px', cursor: 'pointer' }}>
            로드맵 생성하기
        </button>
        </div>
    );
}

export default InputForm;