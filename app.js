$(function() {
  const wordCount = 10;
  let guessCount = 4;
  let password = '';

  let $start = $('#start');
  $start.on('click', () => {
    $('#start-screen').toggleClass('show');
    $('#start-screen').toggleClass('hide');
    $('#game-screen').toggleClass('show');
    $('#game-screen').toggleClass('hide');
    startGame();
  });

  function startGame() {
    // get random words and append them to the DOM
    let $wordList = $('#word-list');
    // 'words' variable is from words.js
    let randomWords = getRandomValues(words, wordCount); // eslint-disable-line no-undef
    randomWords.forEach(word => {
      $wordList.append(`<li>${word}</li>`);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    $wordList.on('click', updateGame);
  }

  function getRandomValues(array, numberOfVals) {
    return shuffle(array).slice(0, numberOfVals);
  }

  function shuffle(array) {
    let arrayCopy = [...array];
    // var arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      const idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      [arrayCopy[idx2], arrayCopy[idx1]] = [arrayCopy[idx1], arrayCopy[idx2]];
    }
    return arrayCopy;
  }

  function setGuessCount(newCount) {
    guessCount = newCount;
    $('#guesses-remaining').text(`Guesses remaining: ${guessCount}.`);
  }

  function updateGame(e) {
    if (e.target.tagName === 'LI' && !$(e.target).hasClass('disabled')) {
      // grab guessed word, check it against password, update view
      const guess = $(e.target).text();

      const similarityScore = compareWords(guess, password);
      $(e.target).addClass('disabled');
      $(e.target).text(`${guess} --> Matching Letters: ${similarityScore}`);
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        $('#winner').toggleClass('hide');
        $('#winner').toggleClass('show');
        this.removeEventListener('click', updateGame);
      } else if (guessCount === 0) {
        $('#loser').toggleClass('hide');
        $('#loser').toggleClass('show');
        this.removeEventListener('click', updateGame);
      }
    }
  }

  function compareWords(word1, word2) {
    if (word1.length !== word2.length) {
      throw 'Words must have the same length';
    }
    let count = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }
});
