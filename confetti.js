const yes1=document.getElementById("yesBtn");
const yes2=document.getElementById("yesBtn2");

function confetti(){

for(let i=0;i<200;i++){

const div=document.createElement("div");

div.style.position="fixed";
div.style.width="8px";
div.style.height="8px";
div.style.background="hsl("+Math.random()*360+"deg,100%,50%)";

div.style.left=Math.random()*window.innerWidth+"px";
div.style.top="-10px";

document.body.appendChild(div);

const speed=Math.random()*5+2;

let y=0;

function fall(){

y+=speed;

div.style.top=y+"px";

if(y<window.innerHeight){
requestAnimationFrame(fall);
}

}

fall();

}

}

yes1.onclick=confetti;
yes2.onclick=confetti;