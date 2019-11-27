const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables

// Vitesse sur X
vx = 10;
// Vitesse sur Y
vy = 0;
// pommeX
let pommeX = 0;
// pommeY
let pommeY = 0;
// Score
let score = 0;
// bugDirection
let bugDirection = false;
// StopGame
let stopGame = false;


let snake = [ {x:140, y:150}, {x:130, y:150}, {x:120, y:150}, {x:110, y:150} ]

function animation(){

    if(stopGame === true) {
        return;
    } else {

        setTimeout(function(){
            bugDirection = false;
            nettoieCanvas();
            dessinePomme();
            faireAvancerSerpent();
    
            dessineLeSerpent();
    
            // recursion
            animation();
    
        }, 100);
    }


}
animation();
creerPomme();

function nettoieCanvas(){
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.strokeRect(0,0,canvas.width, canvas.height);
}

function dessineLesMorceaux(morceau) {

    ctx.fillStyle = "#00fe14";
    ctx.strokeStyle = 'black';
    ctx.fillRect(morceau.x, morceau.y, 10, 10);
    ctx.strokeRect(morceau.x, morceau.y, 10, 10);

}
function dessineLeSerpent(){
    snake.forEach(morceau => {
        dessineLesMorceaux(morceau);
    })
}


function faireAvancerSerpent() {

    const head = {x: snake[0].x + vx, y: snake[0].y + vy};
    snake.unshift(head);

    if(finDuJeu()){
        snake.shift(head);
        recommencer();
        stopGame = true;
        return;
    }
    
    const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY;

    if(serpentMangePomme) {
        score += 10;
        document.getElementById('score').innerHTML = score;

        creerPomme();
    } else {
        snake.pop();
    }


}

dessineLeSerpent();

document.addEventListener('keydown', changerDirection);

function changerDirection(event) {
    // console.log(event);

    // eviter le bug
    if(bugDirection) return;
    bugDirection = true;

    const FLECHE_GAUCHE = 37;
    const FLECHE_DROITE = 39;
    const FLECHE_ENHAUT = 38;
    const FLECHE_ENBAS = 40;

    const direction = event.keyCode;

    const monter = vy === -10;
    const descendre = vy === 10;
    const adroite = vx === 10;
    const agauche = vx === -10;

    // Imaginons que l'on veuille aller à gauche (premier cas)
    // on appuie sur la touche gauche, donc direction === FLECHE_GAUCHE === true
    // puis on verifie que l'on est pas entrain d'aller à droite, pour eviter que le serpent se retourne sur lui-même
    // donc si on va à droite, "adroite === true", donc on écrit !adroite (inverse de adroite, donc false) pour empecher la condition && de s'executer.
    if(direction === FLECHE_GAUCHE && !adroite) { vx = -10; vy = 0; }
    if(direction === FLECHE_ENHAUT && !descendre) { vx = 0; vy = -10; }
    if(direction === FLECHE_DROITE && !agauche) { vx = 10; vy = 0; }
    if(direction === FLECHE_ENBAS && !monter) { vx = 0; vy = 10; }

    
}

function random(){

    return Math.round((Math.random() * 290) / 10) * 10;

}

function creerPomme(){

    pommeX = random();
    pommeY = random();
    // console.log(pommeX, pommeY);

    snake.forEach(function(part){

        const serpentSurPomme = part.x == pommeX && part.y == pommeY;

        if(serpentSurPomme) {
            creerPomme();
        }

    })
    
}

function dessinePomme(){

    ctx.fillStyle = 'red';
    ctx.strokeStyle = "darkred";
    ctx.beginPath();
    ctx.arc(pommeX + 5, pommeY + 5, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

}

function finDuJeu() {

    let snakeSansTete = snake.slice(1,-1);
    let mordu = false;
    snakeSansTete.forEach(morceau => {
        if(morceau.x === snake[0].x && morceau.y === snake[0].y){
            mordu = true;
        }
    })

    const toucheMurGauche = snake[0].x < -1;
    const toucheMurDroite = snake[0].x > canvas.width - 10;
    const toucheMurTop = snake[0].y < -1;
    const toucheMurBottom = snake[0].y > canvas.height - 10;

    let gameOver = false;

    if(mordu || toucheMurGauche || toucheMurDroite || toucheMurTop || toucheMurBottom) {
        gameOver = true;
    }
    

    return gameOver;
}

function recommencer(){
    const restart = document.getElementById('recommencer');
    restart.style.display = "block";

    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 32) {
            document.location.reload(true);
        }
    })

}