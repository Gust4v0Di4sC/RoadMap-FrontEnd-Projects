
let buttonQuestion = document.getElementById('button-question');
let answerText = document.getElementById('answer');


function handleClick(){
   answerText.innerHTML = `<div class="answer"> testetteste</div>`;
   answerText.classList.toggle('hidden');
}

buttonQuestion.addEventListener('click', handleClick);