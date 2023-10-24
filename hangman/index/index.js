// checkbox not repeated
let correctAnswer = '';
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          checkboxes.forEach(otherCheckbox => {
              if (otherCheckbox !== this && otherCheckbox.name === this.name) {
                  otherCheckbox.checked = false;
              }
          });
      });
  });

  //game start
  const start_btn = document.getElementById("start_btn");
  start_btn.addEventListener("click", function(e) {
      e.preventDefault();
      const selectedTopics = Array.from(document.querySelectorAll('input[name="TOPICS"]:checked')).map(checkbox => checkbox.value);
      const selectedDifficulties = Array.from(document.querySelectorAll('input[name="DIFFICULTIES"]:checked')).map(checkbox => checkbox.value);
      const gameBoard = document.querySelector('.GameBoard');

      var list = [];
      var url = `http://localhost:5000/${selectedTopics}?Difficulties=${selectedDifficulties}`;
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              if (Array.isArray(data)) {
                  list = data;
              } else {
                  console.error('Response data is not an array.');
              }
          })
          .catch(error => {
              console.error('Error:', error);
          })
          .finally(() => {
              if (list.length > 0) {
                  const randomIndex = Math.floor(Math.random() * list.length);
                  const randomWord = list[randomIndex].name;
                  correctAnswer = list[randomIndex].name;
                
                  if (randomWord) {
                      const wordsDiv = document.querySelector('.words');
                      const wordChars = randomWord.split('').map(char => {
                          if (char === ' ') {
                              return '<div class="word-space">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                          }
                          return `<div class="word-char"><span>${char}</span></div>`;
                      });
                      wordsDiv.innerHTML = wordChars.join('');
                      gameBoard.style.visibility = "visible";
                  }
              }
          });     
  });
});

//POPUP 
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const restartBtn = document.getElementById("restart-btn");

function showPopup(message) {
  popupMessage.innerHTML = message + '<br>The correct answer was: ' + correctAnswer;
  popup.style.display = "flex";
}
restartBtn.addEventListener("click", function () {
  location.reload();
});

//game      
let correctGuesses = 0;
let incorrectGuesses = 0;
const maxIncorrectGuesses = 9;
const guessedLetters = [];
let gameStarted = false;
const start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click", function (e) {
  e.preventDefault();
  if (!gameStarted) {
      gameStarted = true;
  }
});

const alphabetButtons = document.querySelectorAll('.letter');
alphabetButtons.forEach(button => {
  button.addEventListener('click', function () {
      if (!gameStarted) {
          return; 
      }
      const letter = this.textContent.toLowerCase(); 
      const wordChars = Array.from(document.querySelectorAll('.word-char span'));

      if (guessedLetters.includes(letter)) {
          return; 
      }
      let found = false;
      wordChars.forEach(char => {
          if (char.textContent.toLowerCase() === letter) { 
              char.style.visibility = 'visible';
              correctGuesses++;
              found = true;
          }
      });
      const hangmanImages = ["../image/1.jpg", "../image/2.jpg", "../image/3.jpg", "../image/4.jpg", "../image/5.jpg", "../image/6.jpg","../image/7.jpg","../image/8.jpg","../image/9.jpg"];
      if (found) {
          guessedLetters.push(letter);
      } else {
          incorrectGuesses++;
          if (incorrectGuesses <= 9) {
              document.getElementById("hangman-display").src = hangmanImages[incorrectGuesses-1];
          } else {
              showPopup('Hangman game failed. You lost.');
          }
      }
      if (wordChars.filter(char => char.textContent.trim().toLowerCase() !== '' && char.style.visibility === 'visible').length === wordChars.length) {
          showPopup('Congratulations! You won the game.');
      } 
  });
});
