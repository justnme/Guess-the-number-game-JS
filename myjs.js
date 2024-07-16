    const playerNameInput = document.getElementById('playerName');
    const minRangeInput = document.getElementById('minRange');
    const maxRangeInput = document.getElementById('maxRange');
    const attemptsInput = document.getElementById('attempts');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const guessInput = document.getElementById('guessInput');
    const guessField = document.getElementById('guess');
    const message = document.getElementById('message');
    const results = document.getElementById('results');
    const resultSortButtons = document.querySelectorAll('.sort-button');
    const resultList = document.getElementById('resultList');
    const retryLoseButton = document.getElementById('retryLose');
    const retryWinButton = document.getElementById('retryWin');
    const hintText = document.getElementById('hintText');
    
    let minRange;
    let maxRange;
    let maxAttempts;
    let targetNumber;
    let attempts;
    let playerName = "";
    
    const savedResults = [];
    
    function populateResults() {
        resultList.innerHTML = "";
        savedResults.forEach(resultItem => addResultToResultList(resultItem));
    }

    startButton.addEventListener('click', () => {
        playerName = playerNameInput.value || `anon${resultList.children.length + 1}`;
        minRange = parseInt(minRangeInput.value);
        maxRange = parseInt(maxRangeInput.value);
        maxAttempts = parseInt(attemptsInput.value) || Infinity;
        targetNumber = generateRandomNumber(minRange, maxRange);
        attempts = 0;
        
        startButton.style.display = 'none';
        stopButton.style.display = 'inline';
        guessInput.style.display = 'block';
        
        playerNameInput.disabled = true;
        minRangeInput.disabled = true;
        maxRangeInput.disabled = true;
        attemptsInput.disabled = true;
        loseScreen.style.display = 'none';
        winScreen.style.display = 'none';

        if (maxAttempts !== Infinity) {
            attemptsInput.value = maxAttempts - 1;
        }
    });
    
    stopButton.addEventListener('click', () => {
        resetGame();
    });
    
    retryLoseButton.addEventListener('click', () => {
        resetGame();
    });

    retryWinButton.addEventListener('click', () => {
        resetGame();
    });

    resultSortButtons.forEach(button => {
        
        button.addEventListener('click', () => {
            button.classList.add('active');
        
            sortResults(button.id);
        });
    });

    checkButton.addEventListener('click', () => {
        const playerGuess = parseInt(guessField.value);
        attempts++;
        let gameEnded = false;

        if (playerGuess === targetNumber) {
            endGame(true);
            gameEnded = true;
        } else if (playerGuess < targetNumber) {
            hintText.textContent = "Larger";
            hintText.style.display = 'block';
            setMessage(`The chosen number is larger`);
        } else {
            hintText.textContent = "Less";
            hintText.style.display = 'block';
            setMessage(`The chosen number is less`);
        }
        guessField.value = '';
        
        if (!gameEnded && attempts >= maxAttempts) {
            endGame(false);
        } 
        
        else if (maxAttempts !== Infinity) {
            attemptsInput.value = maxAttempts - attempts;
        }

    });

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setMessage(msg) {
        message.textContent = msg;
    }

    function endGame(isWinner) {
        const resultItem = {
            playerName: playerName,
            isWinner: isWinner,
            minRange: minRange,
            maxRange: maxRange,
            maxAttempts: maxAttempts,
            attempts: attempts,
            
            date: new Date().getTime(),
        };
        
        savedResults.push(resultItem);
        addResultToResultList(resultItem);
        
        let chosenLabel;
        if (isWinner) {
            winScreen.style.display = 'flex';
            chosenLabel = document.getElementById('WonChosenNumber');
        } else {
            loseScreen.style.display = 'flex';
            chosenLabel = document.getElementById('LostChosenNumber');
        }

        chosenLabel.textContent = `The chosen number was ${targetNumber}`;
        guessInput.style.display = 'none';
        results.style.display = 'block';
    }

    function addResultToResultList(resultItem) {
        const resultMessage = resultItem.isWinner ? 'You have won' : 'You have lost';
        const rangeMessage = `range of numbers (${resultItem.minRange} / ${resultItem.maxRange})`;
        const gameMessage = resultItem.maxAttempts === Infinity ? 'game (endless mode)' : `game (number of tries: ${resultItem.maxAttempts})`;
        const winMessage = resultItem.isWinner ? `Won (on the try number ${resultItem.attempts})` : '-';
        
        const resultElement = document.createElement("li");
        resultElement.innerHTML = `<strong>${resultItem.playerName}:</strong> ${resultMessage} : ${rangeMessage}, ${gameMessage}, ${winMessage}`;
        resultList.appendChild(resultElement);

        resultElement.setAttribute('data-date', resultItem.date);
        resultElement.setAttribute('data-games', getGamesCount(resultItem.playerName));
        resultElement.setAttribute('data-wins', resultItem.isWinner ? 1 : 0);
    }

    function sortResults(sortType) {
        const resultList = document.getElementById('resultList');
        const items = Array.from(resultList.children);
        
        switch (sortType) {
            case 'sortByDateButton':
                items.sort((a, b) => {
                    return b.getAttribute('data-date') - a.getAttribute('data-date');
                });
                break;
                
            case 'sortByGamesButton':
                items.sort((a, b) => {
                    return b.getAttribute('data-games') - a.getAttribute('data-games');
                });
                break;
                
            case 'sortByWinsButton':
                items.sort((a, b) => {
                    return b.getAttribute('data-wins') - a.getAttribute('data-wins');
                });
                break;
        }
        resultList.innerHTML = '';
        items.forEach(item => resultList.appendChild(item));
    }
    
    function resetGame() {
        startButton.style.display = 'inline';
        stopButton.style.display = 'none';
        guessInput.style.display = 'none';
        playerNameInput.disabled = false;
        minRangeInput.disabled = false;
        maxRangeInput.disabled = false;
        attemptsInput.disabled = false;
        loseScreen.style.display = 'none';
        winScreen.style.display = 'none';
        attemptsInput.value = "";
        message.textContent = "";
        hintText.style.display = 'none';
        guessField.value = "";
        populateResults();
    }

    function getGamesCount(playerName) {
        let count = 0;
        for (const result of savedResults) {
            if (result.playerName === playerName) {
                count++;
            }
        }
        return count;  
      }