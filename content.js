let questions = Array.from(document.querySelectorAll('.question'));
questions.forEach(questionEl => {
  let button = document.createElement('button');
  button.innerText = 'AI 選擇';
  button.addEventListener('click', () => {
    let question = questionEl.innerText;
    let options = Array.from(questionEl.querySelectorAll('.option')).map(el => el.innerText);
    console.log("check1");
    chrome.runtime.sendMessage({question, options}, function(response) {
     
      let answer = response.answer;
      console.log("check2");
      let answerEl = Array.from(questionEl.querySelectorAll('.option')).find(el => el.innerText === answer);
      if (answerEl) {
        answerEl.click();
      }
    });
  });
  questionEl.appendChild(button);
  console.log("check33");
});