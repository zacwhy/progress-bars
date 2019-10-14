'use strict';

const mockData = {
  buttons: [10, 38, -13, -18],
  bars: [62, 45, 62],
  limit: 230
};

// const url = 'https://pb-api.herokuapp.com/bars';

Promise.resolve(mockData)
  // fetch(url).then(res => res.json())
  .then(loadProgressBars);

function loadProgressBars(data) {
  const root = document.getElementById('root');
  root.innerText = '';

  const section = document.createElement('section');
  section.classList.add('section');

  const progressBars = createProgressBars(data.limit, data.bars, data.buttons);
  section.appendChild(progressBars);

  root.appendChild(section);
}

function createProgressBars(limit, barValues, buttonAmounts) {
  const container = document.createElement('div');
  container.classList.add('container');

  const bars = barValues.map(value => createProgress(limit, value));

  const progressSelector = document.createElement('select');
  bars.forEach((_, i) => {
    const option = document.createElement('option');
    option.innerText = 'Progress ' + (i + 1);
    progressSelector.appendChild(option);
  });
  const selectContainer = document.createElement('div');
  selectContainer.appendChild(progressSelector);
  selectContainer.classList.add('select');
  container.appendChild(selectContainer);

  bars.forEach(bar => container.appendChild(bar.element));

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');
  buttonAmounts.forEach(amount => {
    const button = document.createElement('button');
    button.innerText = (amount > 0 ? '+' : '') + amount;
    button.onclick = () => {
      bars[progressSelector.selectedIndex].increase(amount);
    };
    button.classList.add('button');
    buttons.appendChild(button);
  });
  container.appendChild(buttons);

  return container;
}

function createProgress(maximumValue, initialValue) {
  let currentValue = initialValue;
  let intervalId = null;

  const container = document.createElement('div');
  container.classList.add('progress-container');

  const bar = document.createElement('div');
  bar.classList.add('progress-bar');
  container.appendChild(bar);

  const text = document.createElement('div');
  text.classList.add('progress-text');
  container.appendChild(text);

  update();

  return {
    element: container,
    increase
  };

  function increase(amount) {
    if (intervalId !== null) {
      // to keep it simple, do not increase if animation is still in progress
      return;
    }

    if (amount === 0) {
      return;
    }

    const newValue = Math.max(currentValue + amount, 0);
    animateBarChange(newValue);
  }

  function animateBarChange(newValue) {
    const originalValue = currentValue;
    intervalId = setInterval(frame, 10);

    function frame() {
      if (currentValue === newValue) {
        clearInterval(intervalId);
        intervalId = null;
      } else {
        currentValue += newValue > originalValue ? 1 : -1;
        update();
      }
    }
  }

  function update() {
    const percent = Math.round((currentValue / maximumValue) * 100);
    text.innerText = percent + '%';
    bar.style.width = Math.min(percent, 100) + '%';
    bar.classList.toggle('in', currentValue <= maximumValue);
    bar.classList.toggle('out', currentValue > maximumValue);
  }
}
