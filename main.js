/**
 * LottoBall Web Component
 * Displays a lottery ball with a number and appropriate color coding.
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
 * Main Application Logic
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

  // Clear container with exit animation
  const oldRows = ballContainer.querySelectorAll('.lotto-row');
  oldRows.forEach(row => row.classList.add('exit'));
  
  if (oldRows.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  ballContainer.innerHTML = '';
  
  const allSets = generateFiveSets();

  // Create rows and balls with staggered delays
  for (let rowIndex = 0; rowIndex < allSets.length; rowIndex++) {
    const numbers = allSets[rowIndex];
    const row = document.createElement('div');
    row.className = 'lotto-row';
    ballContainer.appendChild(row);

    for (let ballIndex = 0; ballIndex < numbers.length; ballIndex++) {
      const ball = document.createElement('lotto-ball');
      ball.setAttribute('number', numbers[ballIndex]);
      ball.className = 'gravity-drop';
      
      // Calculate delay: Row start delay + individual ball delay
      const delay = (rowIndex * 0.4) + (ballIndex * 0.1);
      ball.style.animationDelay = `${delay}s`;
      
      row.appendChild(ball);
    }

    // Add completed class after row is fully revealed
    setTimeout(() => {
      row.classList.add('completed');
    }, (rowIndex * 0.4 + 1.3) * 1000);
  }

  // Re-enable button after animation is mostly done
  setTimeout(() => {
    isGenerating = false;
    generateBtn.disabled = false;
  }, (4 * 0.4 + 5 * 0.1 + 0.8) * 1000);
}

generateBtn.addEventListener('click', updateDisplay);

// Initial generation
updateDisplay();
