const resultEl = document.querySelector('#calc-result');
const expressionEl = document.querySelector('#calc-expression');
let display = '0';
let firstOperand = null;
let pendingOperator = null;
let waitingForOperand = false;

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Math.abs(value) < 1e12 ? Number(value.toFixed(9)) : value;
  return String(rounded);
}

function render() {
  resultEl.textContent = display;
}

function inputDigit(digit) {
  if (display === 'Error' || waitingForOperand) {
    display = digit;
    waitingForOperand = false;
  } else if (display.replace('-', '').replace('.', '').length < 15) {
    display = display === '0' ? digit : display + digit;
  }
  render();
}

function inputDecimal() {
  if (display === 'Error' || waitingForOperand) {
    display = '0.';
    waitingForOperand = false;
  } else if (!display.includes('.')) {
    display += '.';
  }
  render();
}

function calculate() {
  if (pendingOperator === null || waitingForOperand || firstOperand === null) return;
  const secondOperand = Number(display);
  let result;
  switch (pendingOperator) {
    case '+': result = firstOperand + secondOperand; break;
    case '−': result = firstOperand - secondOperand; break;
    case '×': result = firstOperand * secondOperand; break;
    case '÷': result = secondOperand === 0 ? NaN : firstOperand / secondOperand; break;
    default: return;
  }
  expressionEl.textContent = `${formatNumber(firstOperand)} ${pendingOperator} ${formatNumber(secondOperand)} =`;
  display = formatNumber(result);
  firstOperand = null;
  pendingOperator = null;
  waitingForOperand = true;
  render();
}

function chooseOperator(operator) {
  if (display === 'Error') return;
  if (pendingOperator && !waitingForOperand) calculate();
  firstOperand = Number(display);
  pendingOperator = operator;
  expressionEl.textContent = `${formatNumber(firstOperand)} ${operator}`;
  waitingForOperand = true;
}

function clear() {
  display = '0';
  firstOperand = null;
  pendingOperator = null;
  waitingForOperand = false;
  expressionEl.textContent = '';
  render();
}

function backspace() {
  if (waitingForOperand || display === 'Error') return;
  display = display.length <= 1 || (display.length === 2 && display.startsWith('-')) ? '0' : display.slice(0, -1);
  render();
}

function handleAction(action) {
  if (action === 'clear') clear();
  if (action === 'backspace') backspace();
  if (action === 'decimal') inputDecimal();
  if (action === 'equals') calculate();
  if (action === 'percent' && display !== 'Error') {
    display = formatNumber(Number(display) / 100);
    render();
  }
}

document.querySelector('#calc-keys').addEventListener('click', (event) => {
  const key = event.target.closest('button');
  if (!key) return;
  if (key.dataset.digit !== undefined) inputDigit(key.dataset.digit);
  else if (key.dataset.operator) chooseOperator(key.dataset.operator);
  else if (key.dataset.action) handleAction(key.dataset.action);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
  else if (event.key === '.') inputDecimal();
  else if (event.key === '+') chooseOperator('+');
  else if (event.key === '-') chooseOperator('−');
  else if (event.key === '*') chooseOperator('×');
  else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
  else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); calculate(); }
  else if (event.key === 'Backspace') backspace();
  else if (event.key === 'Escape') clear();
  else if (event.key === '%') handleAction('percent');
});
