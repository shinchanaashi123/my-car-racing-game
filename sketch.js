const speedDash=document.querySelector('.speedDash')
const scoreDash=document.querySelector('.scoreDash')
const lifeDash=document.querySelector('.lifeDash')
const container=document.querySelector('.container')
const btnStart=document.querySelector('.btnStart')
btnStart.addEventListener('click',startGame)
document.addEventListener('keydown',pressKeyOn)
document.addEventListener('keyup',pressKeyOff)
let animationGame
let gamePlay=false
let player
let keys={
    ArrowUp:false,
    ArrowDown:false,
    ArrowLeft:false,
    ArrowRight:false,
}
function startGame() {
    container.innerHTML=''
    btnStart.style.display="none"
    var div=document.createElement('div')
    div.setAttribute('class','playerCar')
    div.x=250
    div.y=500
    container.appendChild(div)
    gamePlay=true
    animationGame=requestAnimationFrame(playGame)
    player={
        ele:div,
        speed:0,
        lives:10,
        gameScore:0,
        carstoPass:10,
        score:0,
        roadwidth:250,
        gameEndCounter:0,
    }
    startBoard()
     setupBadGuys(10)
}
function setupBadGuys(num) {
    for (let x = 0; x < num; x++) {
        let temp='badGuy'+(x+1)
        let div=document.createElement('div')
        div.innerHTML=(x+1)
        div.setAttribute('class','baddy')
        div.setAttribute('id',temp)
        makeBad(div)
        container.appendChild(div)
    }
    
}
function randomColor() {
    function c(){
        let hex=Math.floor(Math.random()*256).toString(16)
        return('0'+String(hex)).substr(-2)
    }
    return '#'+c()+c()+c()
    
}
function makeBad(e) {
    let tempRoad=document.querySelector('.road')
    e.style.left=tempRoad.offsetLeft+Math.ceil(Math.random()*tempRoad.offsetWidth)-30+'px'
    e.speed=Math.ceil(Math.random()*17)+2
    e.style.backgroundColor=randomColor()
}
function startBoard() {
    for(let x=0;x<30;x++){
        let div=document.createElement('div')
        div.setAttribute('class','road')
        div.style.top=(x*50)+'px'
        div.style.width=player.roadwidth+'px'
        container.appendChild(div)
    }
}
function pressKeyOn(event) {
    event.preventDefault()
    keys[event.key]=true
}

function pressKeyOff(event) {
    event.preventDefault()
    keys[event.key]=false
}
function updateDash() {
    scoreDash.innerHTML=player.score
    lifeDash.innerHTML=player.lives
    speedDash.innerHTML=Math.round(player.speed*10)
}
function moveRoad() {
    let tempRoad=document.querySelectorAll('.road')
    let previousRoad=tempRoad[0].offsetLeft
    let previousWidth=tempRoad[0].offsetWidth
    const pSpeed=Math.floor(player.speed)
    for (let x = 0; x < tempRoad.length; x++) {
        let num = tempRoad[x].offsetTop+pSpeed;
        if (num>600) {
            num=num-650
            let mover=previousRoad+Math.floor(Math.random()*6)-3
            let roadwidth=(Math.floor(Math.random()*11)-5)+previousWidth
            if (roadWidth<200)roadWidth=200 
            if (roadWidth>400)roadWidth=400  
            if (mover<100)mover=100
            if (mover>600)mover=600
            tempRoad[x].style.left=mover+'px'
            tempRoad[x].style.width=roadWidth+'px'
            previousRoad=tempRoad[x].offsetLeft
            previousWidth=tempRoad[x].width
        }
        tempRoad[x].style.top=num+'px'
    }  
    return {'width':previousWidth,'left':previousRoad}  
}
function isCollid(a,b) {
    let aRect=a.getBoundingClientRect()
    let bRect=b.getBoundingClientRect()
    return !(
        (aRect.bottom<bRect.top)||
        (aRect.top>bRect.bottom)||
        (aRect.right<bRect.left)||
        (aRect.left>bRect.right)
    )
}
function moveBadGuys() {
    let tempBaddy=document.querySelectorAll('.baddy')
    for (let i = 0; i < tempBaddy.length; i++) {
    for (let ii = 0; ii < tempBaddy.length; ii++) {
    if (i!=ii&& isCollide(tempBaddy[i],tempBaddy[ii])) {
    tempBaddy[ii].style.top=(tempBaddy[ii].offsetTop+50)+'px' 
    tempBaddy[i].style.top=(tempBaddy[i].offsetTop-50)+'px' 
    tempBaddy[ii].style.left=(tempBaddy[ii].offsetLeft-50)+'px' 
    tempBaddy[i].style.left=(tempBaddy[i].offsetLeft+50)+'px' 
    }
        
    }
    let y=tempBaddy[i].offsetTop+player.speed-tempBaddy[i].speed
    if (y>2000||y<-2000) {
        if (y>2000) {
        player.score++
        if (player.score>player.carstoPass) {
            gameOverPlay()
        }
        }
        makeBad(tempBaddy[i])
    }
    else{
        tempBaddy[i].style.top=y+'px'
        let hitCar = isCollide(tempBaddy[i],player.ele)
        if (hitCar) {
            player.speed=0
            player.lives--
            if (player.lives<1) {
                player.gameEndCounter=1
            }
            makeBad(tempBuddy[i])
        }
    }
        
    }
}
function gameOverPlay() {
    let div=document.createElement('div')
    div.setAttribute('class','road')
    div.style.top='0px'
    div.style.width='250px'
    div.style.backgroundColor='red'
    div.innerHTML='FINISH'
    div.style.fontSize='3em'
    let div2=document.createElement('div')
    div2.setAttribute('class','road')
    div2.style.top='300px'
    div2.style.width='250px'
    div2.style.backgroundColor='red'
    div2.innerHTML='YOUWON'
    div2.style.fontSize='3em'
    container.appendChild(div)
    container.appendChild(div2)
    player.gameEndCounter=12
    player.speed=0
}
function playGame() {
    if (gamePlay) {
        updateDash()
        let roadPara=moveRoad()
        moveBadGuys()
    if (keys.ArrowUp) {
        if (player.ele.y>400) 
            player.ele.y-=1
            player.speed=player.speed<20?(player.speed+0.05):20
    }
            if (keys.ArrowDown) {
                if (player.ele.y<500) 
                    player.ele.y+=1
                    player.speed=player.speed>0?(player.speed-0.2):0
            }  
            if (keys.ArrowRight) {
                player.ele.x+=(player.speed/4)
            }  
            if (keys.ArrowLeft) {
                player.ele.x-=(player.speed/4)
            } 
            if ((player.ele.x+40)<roadPara.left||(player.ele.x)>(roadPara.left+roadPara.width)) {
            if (player.ele.y<500) 
             player.ele.y+=+1
             player.speed=player.speed>0?(player.speed-0.2):5 
            
            }   
            player.ele.style.top=player.ele.y+'px'  
            player.ele.style.left=player.ele.z+'px'  
    }
    animationGame=requestAnimationFrame(playGame)
    if (player.gameEndCounter>0) {
        player.gameEndCounter--
        player.y=(player.y)>60?player.y-30:60 
        if (player.gameEndCounter==0) {
            gamePlay=false
            if (player.lives<1) {
                let losediv=document.createElement('div')
    losediv.setAttribute('class','road')
    losediv.style.top='500px'
    losediv.style.width='250px'
    losediv.style.backgroundColor='red'
    losediv.innerHTML='YOULOSE'
    losediv.style.fontSize='3em'
    losediv.style.zIndex='120'
    container.appendChild(losediv)
            }
            cancelAnimationFrame(animationGame)
            btnStart.style.display='block'
        }
    }
    }
