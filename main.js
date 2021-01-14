let ball= document.querySelector("#ball");                     // Podstawowe zmienne
let container = document.getElementsByClassName("container")[0];
let holes = [];
let gameStart=false;
let score = 0;
let speedX = 0, speedY = 0;
let posX = 20, posY = 20;
window.addEventListener('deviceorientation', zmianaPolozenia)
let highScoreList = document.createElement('ul');               // Dodanie Highscore
highScoreList.innerText="Highscores:"
highScoreList.className="highScoreList";
container.appendChild(highScoreList);
let highscores = [];
refreshHighScore();

function start(){                                               //Inicjacja startu
    gameStart=true;
    spawnHoles();                       // Tworzenie dołków
    moveBall();                      // poruszanie kulką
    console.log("game Started!")
    document.getElementById("start").hidden=true;
    counter = document.createElement('span');               // Dodanie licznika punktów   
    counter.classList.add("counter");
    counter.innerHTML="Score: "+score;
    container.appendChild(counter);
}
function restart(){                                 // funkcja restartu gry 
    gameStart=true;
    for(i=container.childElementCount;i>0;i--){     // usunięcie starych dołków
        if(container.childNodes[i].nodeName=="DIV"){
            if(container.childNodes[i].id!=="ball"){
                container.removeChild(container.childNodes[i])
            }
        }
    }
    score = 0;
    counter.innerHTML="Score: "+score;          // reset punktów
    holes=[];
    posX = 20, posY = 20;
    spawnHoles();                   //tworzenie dołków
    moveBall();                  // poruszanie kulką
    console.log("game Started!")
    document.getElementById("restart").hidden=true;
}

function zmianaPolozenia(e){            // Funkcja napędu kulki z żyroskopu
    console.log(e);
    speedX=e.gamma/45
    speedY=e.beta/45
}
function moveBall(){                 // funkcja poruszania kulki
    
    if(posX+speedX<window.innerWidth-50 && posX+speedX>0){  // ograniczenia kulki
        posX+=speedX;
        ball.style.left=posX+'px';        
    }
    if(posY+speedY<window.innerHeight-50 && posY+speedY>0){
        posY+=speedY;
        ball.style.top=posY+'px';        
    }
                                                    //Sprawdzanie kolizji z dziurami
    for(i=0;i<holes.length;i++) {
        if(posY<Math.floor(holes[i].style.top.slice(0,-2))+50&&posY>holes[i].style.top.slice(0,-2)){
            if(posX>holes[i].style.left.slice(0,-2)&&posX<Math.floor(holes[i].style.left.slice(0,-2))+50){
                if(holes[i].classList.contains("correctHole")){
                    holes[i].classList.remove("correctHole");
                    holes.forEach(e=>{if(e.classList.contains("visitHole")){
                        e.classList.remove("visitHole");
                        e.classList.add("hole");
                    }})
                    holes[i].classList.add("visitHole");
                    score++
                    counter.innerHTML="Score: "+score;
                    randomGoodHole(i);
                }
                else if(holes[i].classList.contains("hole")){     // koniec gry
                gameStart=false;
                let yourScore = window.prompt("Uzyskałeś "+score+" punktów! Podaj swój nick.");
                highscores.push([score,yourScore]);
                refreshHighScore()
                document.getElementById("restart").hidden=false;
            }
        }
        console.log("MOOOOOOVE"+i);
    }
    };
    if(gameStart==true){
        window.requestAnimationFrame(moveBall)
    }
}
function spawnHoles(){                                  //Dodanie dziur w zależności od rozmiaru ekranu
    for(i=2;i<(window.innerWidth/100);i++){
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left=100*i+Math.random()*75-95+'px';
        hole.style.top=Math.random()*(window.innerHeight-95)/2+'px';
        holes.push(hole);
        container.appendChild(hole);
    }
    for(i=2;i<(window.innerWidth/100);i++){
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left=100*i+Math.random()*75-95+'px';
        hole.style.top=Math.random()*(window.innerHeight)/2+window.innerHeight/2-100+'px';
        holes.push(hole);
        container.appendChild(hole);
    }
    checkHoles();
    randomGoodHole(1);
}
function checkHoles(){                                      //Lepsze rozmieszczenie dziur
    for(i=0;i<holes.length-1;i++){                          // (Pozbycie się wiekszości dziur syjamskich)
        for(j=i+1;j<holes.length;j++){
            if(holes[j].style.left.slice(0,-2)>holes[i].style.left.slice(0,-2)+75
            &&holes[j].style.top.slice(0,-2)>holes[i].style.top.slice(0,-2)+75){
                holes[j].style.top=holes[j].style.top.slice(0,-2)+50+'px';
                holes[j].style.left=holes[j].style.left.slice(0,-2)+50+'px';
            }
        }
    }
}
function randomGoodHole(i){                                 // Dodanie dobrej dziury
    let goodHole = Math.floor(Math.random()*holes.length);
    if(goodHole ==i&&i<holes.length){i++;}                  // uniknięcie pojawienia się dobrej dziury w tym samym miejscu
    else{i--;}
    holes[goodHole].classList.remove("hole");
    holes[goodHole].classList.add("correctHole")

}                                                           // odświeżenie listy highscore
function refreshHighScore(){
    highscores.sort(sortScores);
    highscores.length=9;
    while (highScoreList.childNodes[1]) {
        highScoreList.removeChild(highScoreList.childNodes[1]);
    }
    highscores.forEach(e=>{                                 // Dodanie na nowo highscorow
        let scoreList = document.createElement('li');
        scoreList.innerText=e[0]+" "+e[1];
        highScoreList.appendChild(scoreList);
        
    })
}
function sortScores(a, b) {                                 // Sortowanie highscorow.
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}