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
        question: "1) Which is the smallest country in the world by area?",
        options:[ "Monaco", "Liechtenstein","San Marino", "Vatican City"],
        answer:'D',
        amt : 1000
    },
    {
        question: "2) What planet is known as the Red Planet?",
        options:["Earth","Mars","Venus","Jupiter"],
        answer:'B',
        amt: 2000
    },
    {
        question: "3) Which Indian cricketer is famous for his helicopter shot?",
        options:["Sachin Tendulkar","Virat Kohli","MS Dhoni","Rahul Dravid"],
        answer:'C' ,
        amt: 3000
    },
    {
        question: "4) What does the acronym Wi-Fi stand for?",
        options:["Wireless Fidelity","Wireless Frequency","Wide Fidelity","Wide Frequency"],
        answer:'A' ,
        amt: 5000
    },
    {
        question: "5) Which chromosome is primarily responsible for determining the sex of a child?",
        options:[" X chromosome from the mother","X chromosome from the father","Y chromosome from the mother","Y chromosome from the father"],
        answer:'D', 
        amt: 10000
    },
    {
        question: "6) Which city in India is known as the 'Diamond City'?",
        options:[ "Surat", "Jaipur","Mumbai", "Chennai"],
        answer:'A',
        amt : 20000
    },
    {
        question: "7) In Jainism, why do strict followers avoid bathing?",
        options:["To avoid disrupting their spiritual energy","To prevent harming microorganisms on their skin","To avoid contact with impurities","To reduce water usage in their rituals"],
        answer:'B',
        amt: 40000
    },
    {
        question: "8) Which technology company is famous for the 'Think Different' marketing campaign?",
        options:["Microsoft","IBM","Apple","Dell"],
        answer:'C' ,
        amt: 80000
    },
    {
        question: "9) What is the typical duration of the gestation period for an elephant?",
        options:["12 months","15 months","22 months","24 months"],
        answer:'C' ,
        amt: 160000
    },
    {
        question: "10) Which sport is known as 'The Beautiful Game'?",
        options:["Basketball","Tennis","Football","Cricket"],
        answer:'C', 
        amt: 320000
    },
    {
        question: "11) In which year did the Titanic sink?",
        options:["1910","1911","1912","1913"],
        answer:'C', 
        amt: 640000
    },
    {
        question: "12) Who is credited with introducing the modern examination system in education?",
        options:["Henry Fischel","Confucius","Socrates","Horace Mann"],
        answer:'A', 
        amt: 1250000
    },
    {
        question: "13) Who is known as the father of the World Wide Web?",
        options:["Steve Jobs","Tim Berners-Lee","Bill Gates","Larry Page"],
        answer:'B', 
        amt: 2500000
    },
    {
        question: "14) The two hands of a clock meet after how many minutes?",
        options:["60 minutes","64 4/13 minutes","65 5/11 minutes","66 6/9 minutes"],
        answer:'C', 
        amt: 5000000
    },
    {
        question: "15) Who was the first person to climb Mount Everest without supplemental oxygen?",
        options:["Tenzing Norgay","Sir Edmund Hillary","Reinhold Messner","Angrita Sherpa"],
        answer:'D', 
        amt: 10000000
    }


];

const extraQuestion = [
    {
        question: " What is the basic unit of heredity in living organisms?",
        options:[" Cell ", " DNA "," Gene "," Chromosome "],
        answer:'C', 
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
        prize = 10000000;
        
        ended();
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

