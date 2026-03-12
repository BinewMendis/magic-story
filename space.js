const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;

const ctx = canvas.getContext("2d");

canvas.width = 1800;
canvas.height = 800;

const stars = [];

const STAR_COUNT = 120;

for(let i=0;i<STAR_COUNT;i++){

stars.push({
x: Math.random()*canvas.width,
y: Math.random()*canvas.height,
speed: Math.random()*0.3+0.1,
size: Math.random()*2
})

}

function drawStars(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";

stars.forEach(star=>{

star.y += star.speed;

if(star.y > canvas.height){
star.y = 0;
star.x = Math.random()*canvas.width;
}

ctx.beginPath();
ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
ctx.fill();

});

}

function animate(){

drawStars();

requestAnimationFrame(animate);

}

animate();

setInterval(()=>{

const x = Math.random()*canvas.width;
const y = Math.random()*canvas.height/2;

let length = 0;

function shoot(){

ctx.strokeStyle="white";
ctx.beginPath();
ctx.moveTo(x,y);
ctx.lineTo(x+length,y+length/2);
ctx.stroke();

length += 8;

if(length < 200){
requestAnimationFrame(shoot);
}

}

shoot();

},5000);