/**
 * LottoBall 웹 컴포넌트
 * 번호와 적절한 색상 코딩을 사용하여 로또 공을 표시합니다.
 */
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['number'];
  }

  attributeChangedCallback() {
    this.render();
  }

  get number() {
    return parseInt(this.getAttribute('number')) || 0;
  }

  getBallColor() {
    const n = this.number;
    if (n <= 10) return 'var(--ball-yellow)';
    if (n <= 20) return 'var(--ball-blue)';
    if (n <= 30) return 'var(--ball-red)';
    if (n <= 40) return 'var(--ball-gray)';
    return 'var(--ball-green)';
  }

  render() {
    const color = this.getBallColor();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --size: 60px;
        }

        .ball {
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: clamp(1rem, 4vw, 1.5rem);
          box-shadow: 
            inset -4px -4px 10px rgba(0,0,0,0.2),
            inset 4px 4px 10px rgba(255,255,255,0.3),
            0 8px 16px rgba(0,0,0,0.1);
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }

        .ball::after {
          content: "";
          position: absolute;
          top: 10%;
          left: 15%;
          width: 70%;
          height: 30%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          border-radius: 50%;
        }
      </style>
      <div class="ball">
        ${this.number}
      </div>
    `;
  }
}

customElements.define('lotto-ball', LottoBall);

/**
 * 메인 애플리케이션 로직
 */
const ballContainer = document.getElementById('ball-container');
const generateBtn = document.getElementById('generate-btn');

function generateNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

function generateFiveSets() {
  const sets = [];
  for (let i = 0; i < 5; i++) {
    sets.push(generateNumbers());
  }
  return sets;
}

let isGenerating = false;

async function updateDisplay() {
  if (isGenerating) return;
  isGenerating = true;
  generateBtn.disabled = true;

  // 퇴장 애니메이션과 함께 컨테이너 비우기
  const oldRows = ballContainer.querySelectorAll('.lotto-row');
  oldRows.forEach(row => row.classList.add('exit'));
  
  if (oldRows.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  ballContainer.innerHTML = '';
  
  const allSets = generateFiveSets();

  // 지연 시간을 두어 행과 공 생성
  for (let rowIndex = 0; rowIndex < allSets.length; rowIndex++) {
    const numbers = allSets[rowIndex];
    const row = document.createElement('div');
    row.className = 'lotto-row';
    ballContainer.appendChild(row);

    for (let ballIndex = 0; ballIndex < numbers.length; ballIndex++) {
      const ball = document.createElement('lotto-ball');
      ball.setAttribute('number', numbers[ballIndex]);
      ball.className = 'gravity-drop';
      
      // 지연 시간 계산: 행 시작 지연 + 개별 공 지연
      const delay = (rowIndex * 0.4) + (ballIndex * 0.1);
      ball.style.animationDelay = `${delay}s`;
      
      row.appendChild(ball);
    }

    // 행이 완전히 나타난 후 완료 클래스 추가
    setTimeout(() => {
      row.classList.add('completed');
    }, (rowIndex * 0.4 + 1.3) * 1000);
  }

  // 애니메이션이 거의 끝나면 버튼 다시 활성화
  setTimeout(() => {
    isGenerating = false;
    generateBtn.disabled = false;
  }, (4 * 0.4 + 5 * 0.1 + 0.8) * 1000);
}

generateBtn.addEventListener('click', updateDisplay);

// 초기 번호 생성
updateDisplay();
