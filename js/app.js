//Array list that holds all the cards
let cardList=['fa fa-diamond','fa fa-diamond','fa fa-paper-plane-o','fa fa-paper-plane-o','fa fa-anchor','fa fa-anchor',
'fa fa-bolt','fa fa-bolt','fa fa-cube','fa fa-cube',
'fa fa-bicycle','fa fa-bicycle','fa fa-leaf','fa fa-leaf','fa fa-bomb','fa fa-bomb'];

// Variable declarations
let openCards=[];
let moves=0;
let matchCard=0; 
let firstClick= true;
const cardClick= document.querySelector('.deck');

// Function to generate cards
function init() {
    for(let i = 0; i < cardList.length; i++) {
        const newCard = document.createElement("li");
        newCard.classList.add("card","cards");
        newCard.innerHTML = `<i class="${cardList[i]}"></i>`;
        cardClick.appendChild(newCard);
    }
}
init();

// Function to shuffle deck of cards 
function shuffleCards(){
    const allCards = document.querySelectorAll('.cards');
    const cardArray= [...allCards]
    const shuffledCards= shuffle(cardArray);
    for ( const shuffledCard of shuffledCards){
        cardClick.appendChild(shuffledCard);
    }
}
shuffleCards();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array){
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
} 

// Sets up event listener for a  card using event delegation
cardClick.addEventListener('click', function (event) {
    //  event target is the clicked item
    const clicked = event.target;

    /* Conditions to ensure :
     * only 2 cards can be clicked at once
     * user can't click on an already matched card and try to rematch with current card
     */
    if (clicked.classList.contains('card') && !clicked.classList.contains('match')  && openCards.length<2 && !openCards.includes(clicked)){
        if(firstClick){
            startTimer();
            firstClick= false;
        }
        // puts card clicked in opencards array then adds  classes show and open
        pushCard(clicked);
        showCard(clicked);

        //checks if cards matched
        if (openCards.length === 2){
            checkCardMatch(clicked);
            moveCounter();
        }
    } 
});

// Function to add classes 'show and open' 
function showCard(card){
    card.classList.add('show','open');
}

// Function to store card clicked in array
function pushCard(card){
    openCards.push(card);
}

// Function to removes classes 'show and open'
function hideCard(card){
    card.classList.remove('show','open');
}

// Function to add class 'fails'(styled in css)
function shakeCard(card){
    card.classList.add('fails');

}

// Function to remove class 'fails'
function removeShake(card){
    card.classList.remove('fails')
}

// Function to check if card matches
function checkCardMatch() {
    if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className){
        openCards[0].classList.add('match');
        openCards[1].classList.add('match');
        openCards=[];

        //if all cards match,game is over,modal appears
        setTimeout(gameOver,600);
    }
    else {
        setTimeout(function(){
            shakeCard(openCards[0]);
            shakeCard(openCards[1]);
        }, 400);
        
       setTimeout(function(){ 
            hideCard(openCards[0]);
            hideCard(openCards[1]);
            removeShake(openCards[0]);
            removeShake(openCards[1]);
            openCards=[];
        },1000);
    }  
}

// Adds  moves
const getMoves= document.querySelector('.moves');
function moveCounter(){
    moves++;
    getMoves.textContent= moves;
    //sets the rating
    starRating();
}

// Checks if the game is over
function gameOver(){
    matchCard += 1;
    if(matchCard=== 8){
        stopTimer();
        modalValues();
        showModal();
    } 
}

// Restart button,resets moves to default
const refreshBtn= document.querySelector('.restart');
refreshBtn.addEventListener('click',function(){
    moves=0;
    getMoves.innerHTML=moves;

});

// To determine the star rating
const getStar= document.querySelector('.stars');
const star = `<li><i class="fa fa-star"></i></li>`;
getStar.innerHTML = star + star + star;
function starRating(){
    if (moves<17){
        getStar.innerHTML= star+ star+ star;
    }
    else if (moves<27){
        getStar.innerHTML= star + star;
    }
    else{
        getStar.innerHTML= star;
    }
}

// Timer
let timer=0;
let totalSeconds=0;
let minutes=0;
let seconds=0;
const getTimer = document.querySelector(".timer");
getTimer.textContent = `${minutes}:0${seconds}`;

// function to start timer
function startTimer(){
    timer= setInterval( function (){
        totalSeconds++;
        minutes = parseInt(totalSeconds / 60, 10);
        seconds = parseInt(totalSeconds % 60, 10);
        if (seconds < 10) {
            getTimer.textContent = `${minutes}:0${seconds}`;// updates to new value
        } 
        else {
            getTimer.textContent = `${minutes}:${seconds}`; // updates to new value
        }
    },1000)
}

// Function to clear timer
function stopTimer() {
    clearInterval(timer);
}

/* Shows the modal after game won
*/
const getModal= document.querySelector('.modal');

// close button event listener
const closeBtn= document.querySelector('.close');
closeBtn.addEventListener('click',closeModal);

// replay button event listener
const replayBtn= document.querySelector('.replay-Btn');
replayBtn.addEventListener('click',replayGame);

// Function to reset all values to default
function replayGame(){
    resetGame();
    closeModal();
    matchCard= 0;
   
}

// restart button listener
const restartBtn= document.querySelector('.restart');
restartBtn.addEventListener('click',replayGame);

function resetGame(){
    // resets matched card
    matchCard = 0;
    
    // empties openCard array
    openCards=0;
    openCards=[];

    // Reset moves
    moves = 0;
    getMoves.textContent= moves;

    // Resets the star rating
    getStar.innerHTML = star + star + star;

    // Resets the timer
    stopTimer();
    firstClick = true;
    totalSeconds = 0;
    minutes=0;
    seconds=0;
    getTimer.textContent = `${minutes}:0${seconds}`;

    // Shuffles cards
    shuffleCards();
    
    //delete all cards
    cardClick.innerHTML = "";
    init(); // create new cards
}

// Function to show modal
function showModal() {
    getModal.style.display='block';
}

// close the modal box
function closeModal() {
    getModal.style.display='none';

}

//function to get current moves,stars and time and update to modal box
function modalValues(){
    const getModalTime=document.querySelector('.modal-time');
    const getModalMoves=document.querySelector('.modal-moves');
    const getModalStar= document.querySelector('.modal-rating') ;

    // sets value to timervalue declared earlier
    getModalTime.textContent= ` You completed the game in ${getTimer.textContent}s`;
    getModalMoves.textContent= ` Your moves: ${moves}`;
    getModalStar.innerHTML= ` With a star rating of: ${getStar.innerHTML}`; 
}

