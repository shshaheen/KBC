let currentQuestion = 0;
let timer;
let tickSoundInterval;
let timeLeft;
const tickSound = document.getElementById('tick-sound');
let selectedAnswer = null; 
let isShieldActive = false; 
let prize=0
let safezone = [10000,320000,5000000,10000000]
let isfifty = false;
let isSwitchUsed = false;
let isExtraQuestion = false;
const questions=[
    {
        question: "What is the only continent without a desert?",
        options:[ "Europe", "Asia","Antarctica", "Australia"],
        answer:'C',
        amt : 1000
    },
    {
        question: "What is the only number that is spelled with the same number of letters as its value in English?",
        options:["Four","Three","Two","Five"],
        answer:'A',
        amt: 2000
    },
    {
        question: "In which year were the first modern Olympic Games held?",
        options:["1896","1900","1904","1912"],
        answer:'A' ,
        amt: 3000
    },
    {
        question: "Which ancient civilization is credited with the creation of the first known written language?",
        options:["Egyptians","Sumerians","Phoenicians","Harappans"],
        answer:'B' ,
        amt: 5000
    },
    {
        question: "Who wrote the epic poem 'Paradise Lost'",
        options:[" John Milton","William Blake","Geoffrey Chaucer","T.S. Eliot"],
        answer:'B', 
        amt: 10000
    },
    {
        question: "What is the only continent without a desert?",
        options:[ "Europe", "Asia","Antarctica", "Australia"],
        answer:'C',
        amt : 20000
    },
    {
        question: "What is the only number that is spelled with the same number of letters as its value in English?",
        options:["Four","Three","Two","Five"],
        answer:'A',
        amt: 40000
    },
    {
        question: "In which year were the first modern Olympic Games held?",
        options:["1896","1900","1904","1912"],
        answer:'A' ,
        amt: 80000
    },
    {
        question: "Which ancient civilization is credited with the creation of the first known written language?",
        options:["Egyptians","Sumerians","Phoenicians","Harappans"],
        answer:'B' ,
        amt: 160000
    },
    {
        question: "Who wrote the epic poem 'Paradise Lost'",
        options:[" John Milton","William Blake","Geoffrey Chaucer","T.S. Eliot"],
        answer:'B', 
        amt: 320000
    }

];

const extraQuestion = [
    {
        question: "Who wrote the epic poem 'IF'",
        options:[" John ", "Blake","Chaucer","T.S. Eliot"],
        answer:'B', 
    }
];

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElements = document.querySelectorAll('.option');
    const question = questions[currentQuestion];

    questionElement.innerText = question.question;
    optionsElements.forEach((element, index) => {
    
        element.innerText = `${String.fromCharCode(65 + index)}: ${question.options[index]}`;
        element.onclick = () => {
            selectedAnswer = String.fromCharCode(65 + index); // Store selected answer
            checkAnswer(selectedAnswer);
        };
    });
    document.getElementById('icon3').disabled = false;
    resetTimer();
    startTimer();
}

function resetTimer(){
    clearInterval(timer);
    stopTickSound();
    document.getElementById('timer').innerText=60;
}

function startTimer(){
    timeLeft = 60;
    document.getElementById('timer').innerText = timeLeft;
    playTickSound();
    timer = setInterval(tick,1000);
}

function tick() {
    timeLeft--;
    if (timeLeft >= 0) {
        document.getElementById('timer').innerText = timeLeft;

    }
    else{
        clearInterval(timer);
        stopTickSound();
        playFinalTickSound();
        document.getElementById('result').innerText = "Time Up!";
        document.getElementById('result').style.color = 'red';
        disableOptions();
        setTimeout(ended,1000);
    }
}

function playTickSound(){
    const tickSound = document.getElementById('tick-sound');
    tickSound.currentTime = 0;
    tickSound.play();
    tickSoundInterval = setInterval(()=>
    {
        tickSound.currentTime = 0;
        tickSound.play();

    },6000);

}

function playFinalTickSound() {
    const finalTickSound = document.getElementById('final-tick-sound');
    finalTickSound.currentTime = 0;
    finalTickSound.play();
}

function stopTickSound(){
    clearInterval(tickSoundInterval);
    const tickSound = document.getElementById('tick-sound');
    tickSound.pause();
    tickSound.currentTime = 0;
}

function playWrongSound() {
    const wrong = document.getElementById('wrong-sound');
    wrong.currentTime = 0;
    wrong.play();
}

function playCorrectSound() {
    const correct = document.getElementById('correct-sound');
    correct.currentTime = 0;
    correct.play();
}

function checkAnswer(selectedOption){
    console.log("Iam here");
    const resultElement = document.getElementById('result');
    clearInterval(timer);
    stopTickSound();
    if (isShieldActive) {
        resultElement.innerText = "Shield Active: Your answer will be accepted!";
        resultElement.style.color = 'blue'; 
        setTimeout(nextQuestion, 2000);
        isShieldActive = false; 
        document.getElementById('icon3').style.backgroundImage = "url('../static/photos/shield-disabled.png')";

        return; 
    }
    if(isExtraQuestion){
        if(selectedOption === extraQuestion[0].answer){
            resultElement.innerText = "Correct Answer!";
            resultElement.style.color = 'green';
            setTimeout(nextQuestion, 2000);
            }
            else{
                resultElement.innerText = "Wrong Answer!"+prize;
                resultElement.style.color = 'red';
                playWrongSound();
                setTimeout(ended,1000);
            }
            isExtraQuestion = false;
        }
        else{
            if(selectedOption === questions[currentQuestion].answer){
                resultElement.innerText = "Correct Answer!";
                resultElement.style.color = 'green';
                if (safezone.includes(questions[currentQuestion].amt)) {
                    prize = questions[currentQuestion].amt;
                }
                playCorrectSound();
                setTimeout(nextQuestion, 1500);
            }
            else{
                resultElement.innerText = "Wrong Answer!";
                resultElement.style.color = 'red';
                playWrongSound();
                setTimeout(ended,1000);
            }
        }
    disableOptions();
    // setTimeout(nextQuestion, 2000);
}


function update() {
    prize = questions[currentQuestion-1].amt;
    ended();
}

function ended() {
    console.log("Ended function called"); 
    
    console.log(prize);
    localStorage.setItem('quizPrize', prize);

    setTimeout(() => {
        if(prize != 0){
            window.location.href = 'cheque'; 

        }
        else{
            window.location.href = 'lose'; 

        }
    }, 1000);

}





function nextQuestion() {
    if(isfifty){
        first=document.getElementById("zero");
        second = document.getElementById("one");
        third = document.getElementById("two");
        fourth = document.getElementById("three");
        if(first.style.display == 'none'){
            first.style.display = 'inline-block';
        }
        if(second.style.display == 'none'){
            second.style.display = 'inline-block';
        }
        if(third.style.display == 'none'){
            third.style.display = 'inline-block';
        }
        if(fourth.style.display == 'none'){
            fourth.style.display = 'inline-block';
        }
        document.getElementById('icon1').style.backgroundImage = "url('../static/photos/50-50-disabled.png')";
        isfifty= false;
    }

    if(isSwitchUsed){
        document.getElementById('icon2').style.backgroundImage = "url('../static/photos/switchQ-disabled.png')";
        isSwitchUsed = false;

    }
    currentQuestion++;
    if(currentQuestion < questions.length){
        document.getElementById('result').innerText='';
        loadQuestion();

    }   
    else{
        document.getElementById('result').innerText = "Hurray, You have cleared all Quesions!!!";

    } 
}

function disableOptions() {
    const optionsElements = document.querySelectorAll(".option");
    optionsElements.forEach(element => {
        element.onclick = null;
    });
}

function shield() {

    if (isSwitchUsed || isfifty || isShieldActive) {
        displayMessage("You can only use each lifeline once per question.");

        return;
    }

    const resultElement = document.getElementById('result');
    isShieldActive = true; // Activate the shield
    if (isShieldActive) {
        resultElement.innerText = "Shield Activated! You can select an answer without penalty.";
        resultElement.style.color = 'orange'; // Indicate shield is active
        document.getElementById('icon3').disabled = true;
        document.getElementById('icon3').style.pointerEvents = 'none';
    } else {
        resultElement.innerText = "Shield is already active! You can use it only once.";
        resultElement.style.color = 'red';
    }
}


function getRandomNumbersExcludingCorrect(remove) {
    const possibleNumbers = [0, 1, 2, 3]; 
    possibleNumbers.splice(remove,1)
    const shuffled = possibleNumbers.sort(() => 0.5 - Math.random()); // Shuffle the array

    return shuffled.slice(0, 2); // Return the first 'count' elements
}

function displayMessage(msg, duration=2000) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = msg;
    messageElement.style.color = '#F9E400'; // Optional: Set the color of the message
    setTimeout(() => {
        messageElement.innerText = '';
    }, duration);
}

function fifty() {
    if (isfifty || isSwitchUsed || isShieldActive) {
        displayMessage("You can only use each lifeline once per question.");
        return;
    }

    isfifty=true;
    ind = (questions[currentQuestion].answer).charCodeAt(0)-65
    document.getElementById('icon1').style.pointerEvents = 'none';
    arr=getRandomNumbersExcludingCorrect(ind);

    for(const index in arr){
        if(arr[index] === 0){
            console.log("I can");
            const button = document.getElementById('zero');
            button.style.display = 'none'; // Hide the button
        }
        if(arr[index] === 1){
            console.log("I can");
            const button = document.getElementById('one');
            button.style.display = 'none'; // Hide the button
        }
        if(arr[index] === 2){
            console.log("I can");
            const button = document.getElementById('two');
            button.style.display = 'none'; // Hide the button
        }
        if(arr[index] === 3){
            console.log("I can");
            const button = document.getElementById('three');
            button.style.display = 'none'; // Hide the button
        }
    }

    document.getElementById('icon1').style.pointerEvents = 'none';
    
}

function switchQ(){
    if (isSwitchUsed || isfifty || isShieldActive) {
        displayMessage("You can only use each lifeline once per question.");

        return;
    }
    isSwitchUsed = true;
    if(isSwitchUsed && currentQuestion < questions.length){
        const questionElement = document.getElementById('question');
        const optionsElements = document.querySelectorAll('.option');
        const question = extraQuestion[0];

        questionElement.innerText = question.question;
        optionsElements.forEach((element,index) => {
            element.innerText = `${String.fromCharCode(65 + index)}:${question.options[index]}`;
            element.onclick = () => checkAnswer(String.fromCharCode(65 + index));
        });

        
        isExtraQuestion = true;
        document.getElementById('icon2').style.pointerEvents = 'none';
    }
}



window.onload = loadQuestion;

