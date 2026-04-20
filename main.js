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
 * 히스토그램 데이터 및 렌더링 로직
 */
const frequencyData = [
  { number: 1, count: 200 }, { number: 2, count: 190 }, { number: 3, count: 202 },
  { number: 4, count: 194 }, { number: 5, count: 178 }, { number: 6, count: 197 },
  { number: 7, count: 200 }, { number: 8, count: 180 }, { number: 9, count: 158 },
  { number: 10, count: 189 }, { number: 11, count: 190 }, { number: 12, count: 204 },
  { number: 13, count: 202 }, { number: 14, count: 193 }, { number: 15, count: 192 },
  { number: 16, count: 195 }, { number: 17, count: 202 }, { number: 18, count: 191 },
  { number: 19, count: 189 }, { number: 20, count: 197 }, { number: 21, count: 190 },
  { number: 22, count: 162 }, { number: 23, count: 168 }, { number: 24, count: 197 },
  { number: 25, count: 174 }, { number: 26, count: 195 }, { number: 27, count: 211 },
  { number: 28, count: 179 }, { number: 29, count: 170 }, { number: 30, count: 188 },
  { number: 31, count: 198 }, { number: 32, count: 176 }, { number: 33, count: 204 },
  { number: 34, count: 205 }, { number: 35, count: 191 }, { number: 36, count: 186 },
  { number: 37, count: 197 }, { number: 38, count: 199 }, { number: 39, count: 191 },
  { number: 40, count: 194 }, { number: 41, count: 165 }, { number: 42, count: 179 },
  { number: 43, count: 198 }, { number: 44, count: 185 }, { number: 45, count: 195 }
];

function getBallColor(n) {
  if (n <= 10) return 'oklch(85% 0.15 80)';
  if (n <= 20) return 'oklch(65% 0.15 240)';
  if (n <= 30) return 'oklch(65% 0.15 30)';
  if (n <= 40) return 'oklch(65% 0 0)';
  return 'oklch(65% 0.15 140)';
}

function renderHistogram() {
  const histogram = document.getElementById('frequency-histogram');
  const tooltip = document.getElementById('histogram-tooltip');
  const hotContainer = document.getElementById('hot-numbers-container');
  const maxCount = Math.max(...frequencyData.map(d => d.count));
  
  histogram.innerHTML = '';
  
  // 히스토그램 바 렌더링
  frequencyData.forEach(data => {
    const container = document.createElement('div');
    container.className = 'bar-container';
    
    const bar = document.createElement('div');
    bar.className = 'bar';
    const heightPercentage = (data.count / maxCount) * 100;
    bar.style.height = `${heightPercentage}%`;
    bar.style.backgroundColor = getBallColor(data.number);
    
    bar.addEventListener('mouseenter', (e) => {
      tooltip.textContent = `번호 ${data.number}: ${data.count}회`;
      tooltip.classList.remove('hidden');
      
      const rect = bar.getBoundingClientRect();
      const parentRect = histogram.parentElement.getBoundingClientRect();
      
      tooltip.style.left = `${rect.left - parentRect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
      tooltip.style.top = `${rect.top - parentRect.top - 30}px`;
    });
    
    bar.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });
    
    container.appendChild(bar);
    histogram.appendChild(container);
  });

  // 가장 많이 나온 숫자(Hot Numbers) 추출 및 렌더링
  const sortedData = [...frequencyData].sort((a, b) => b.count - a.count);
  const topNumbers = [];
  const minCountToInclude = sortedData[5]?.count || 0;

  // 최소 6개를 포함하되, 동일한 빈도수가 있으면 더 포함
  for (let i = 0; i < sortedData.length; i++) {
    if (i < 6 || sortedData[i].count === minCountToInclude) {
      topNumbers.push(sortedData[i]);
    } else {
      break;
    }
  }

  hotContainer.innerHTML = '<div class="hot-label">가장 많이 나온 숫자 🔥</div>';
  topNumbers.forEach(data => {
    const item = document.createElement('div');
    item.className = 'hot-item';

    const ball = document.createElement('lotto-ball');
    ball.setAttribute('number', data.number);
    
    const count = document.createElement('span');
    count.className = 'hot-count';
    count.textContent = `${data.count}회`;

    item.appendChild(ball);
    item.appendChild(count);
    hotContainer.appendChild(item);
  });
}

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

// 초기 번호 생성 및 히스토그램 렌더링
updateDisplay();
renderHistogram();
