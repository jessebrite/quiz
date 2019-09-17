'use strict';

// const quiz = [
//   { name: 'Superman',realName: 'Clark Kent' },
//   { name: 'Wonder Woman',realName: 'Diana Prince' },
//   { name: 'Green Arrow', realName: 'Oliver Queen' },
//   { name: 'Batman', realName: 'Bruce Wayne' },
//   { name: 'Spiderman', realName: 'Peter Parker' },
//   { name: 'Hulk', realName: 'Bruce Banner' },
//   { name: 'Cyclops', realName: 'Scott Summers' },
//   { name: 'Aquaman', realName: 'Arthur Curry' },
//   { name: 'Flash', realName: 'Barry Allen' },
// ];


const textURL = 'http://numbersapi.com/random';
const proxy_url = "https://cors-anywhere.herokuapp.com/";
const url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/questions.json';
 const request = new Request('https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/questions.json', {
        method: 'GET',
        mode: 'no-cors',
        redirect: 'follow',
        cache: 'no-cache'
      });

fetch(proxy_url + url)
.then(res =>  res.json() )
.then(quiz => {
  view.start.addEventListener('click', () => game.start(quiz.questions), false);
  view.response.addEventListener('click', (event) => game.check(event), false);
});

function random(a, b = 1) {
  // if only 1 argument is provided, we need to swap the
  // values of a and b
  if (b === 1) {
    [a,b] = [b,a];
  }
  return Math.floor((b - a + 1) * Math.random() + a);
}

function shuffle(array) {
  for (let i = array.length; i; i--) {
    let j = random(i) - 1;
    [array[i - 1], array[j]] = [array[j], array[i - 1]];
  }
}

const view = {
  score: document.querySelector('#score strong'),
  question: document.querySelector('[data-question]'),
  result: document.getElementById('result'),
  info: document.getElementById('info'),
  response: document.getElementById('response'),
  start: document.getElementById('start'),
  timer: document.querySelector('#timer strong'),

  // Loops through the attributes and assings the necessary content
  render(target, content, attributes) {
    for (const key in attributes) {
      target.setAttribute(key, attributes[key]);
    }
    return target.innerHTML = content;
  },

  show(element) {
    element.style.display = 'block';
  },

  hide(element) {
    element.style.display = 'none';
  },

  setup() {
    this.show(this.question);
    this.show(this.response);
    this.show(this.result);
    this.hide(this.start);
    this.render(this.score, game.score);
    this.render(this.result, '');
    this.render(this.info, '');
  },

  buttons(array) {
    return array.map(value =>
      `<button>${value}</button>`).join('');
  },

  tearDown() {
    this.hide(this.question);
    this.hide(this.response);
    this.show(this.start);
  }
};

const game = {
  start(quiz) {
    console.log('start() invoked');
    this.questions = [...quiz];
    this.score = 0;
    view.setup();
    this.ask();
    this.secondsRemaining = 20;
    this.timer = setInterval(this.countdown, 1000);
  },

  ask(name) {
    console.log('ask() invoked')
    if (this.questions.length > 2) {
      shuffle(this.questions);
      this.question = this.questions.shift();
      const options = [
        this.questions[0].realName, this.questions[1].realName,
        this.question.realName
        ];
      shuffle(options);
      const question = `<strong>What is ${this.question.name}'s real name?</strong>`;
      view.render(view.question, question);
      view.render(view.response, view.buttons(options));
    } else {
      this.gameOver();
    }
  },

  check(event) {
    console.log('check() invoked');
    const response = event.target.textContent;
    const answer = this.question.realName;
    if (response === answer) {
      this.score++;
      view.render(view.result, 'Correct', {'class':'correct'});
      view.render(view.score, this.score);
    } else {
      view.render(view.result, `Wrong! the correct answer was ${answer}`,
        {'class' : 'wrong'});
    }
    this.ask();
  },

  gameOver() {
    console.log('gameOver() invoked');
    view.show(view.start);
    view.render(view.info, `Game Over. you scored <b>${this.score}</b> point${this.score !== 1 ? 's' : ''}`);
    view.tearDown();
    clearInterval(this.timer);
  },

  countdown() {
    game.secondsRemaining--;
    view.render(view.timer, game.secondsRemaining);
    if(game.secondsRemaining < 1) {
      game.gameOver();
    }
  }
}
