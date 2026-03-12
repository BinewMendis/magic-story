(function(){

const canvas = document.getElementById("threeCanvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
2000
);

const renderer = new THREE.WebGLRenderer({
canvas,
alpha:true,
antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

camera.position.z = 140;

/* ---------------- GLOBALS ---------------- */

let particles;
let positions;
let targets=[];

const COUNT = 7000;

let mouse = {x:0,y:0};

let tapStage = 0;
let zoomTarget = 140;

let warpStars;
let galaxyStars;

/* ---------------- MOUSE PARALLAX ---------------- */

document.addEventListener("mousemove",(e)=>{

mouse.x=(e.clientX/window.innerWidth-0.5)*20;
mouse.y=(e.clientY/window.innerHeight-0.5)*20;

});

console.log("particles.js loaded");

/* ---------------- GALAXY ---------------- */

function createGalaxy(){

const starGeo = new THREE.BufferGeometry();

const starPos = new Float32Array(3000*3);

for(let i=0;i<3000*3;i++){
starPos[i]=(Math.random()-0.5)*1500;
}

starGeo.setAttribute(
"position",
new THREE.BufferAttribute(starPos,3)
);

const starMat = new THREE.PointsMaterial({
size:1.2,
color:0x8888ff
});

galaxyStars = new THREE.Points(starGeo,starMat);
scene.add(galaxyStars);
}

/* ---------------- WARP STARS (MARVEL ZOOM) ---------------- */

function createWarpStars(){

const geo = new THREE.BufferGeometry();
const starPos = new Float32Array(900*3);

for(let i=0;i<900;i++){

starPos[i*3] = (Math.random()-0.5)*800;
starPos[i*3+1] = (Math.random()-0.5)*800;
starPos[i*3+2] = -Math.random()*3500;

}

geo.setAttribute("position",new THREE.BufferAttribute(starPos,3));

const mat = new THREE.PointsMaterial({
size:0.8,
color:0xcccccc
});

warpStars = new THREE.Points(geo,mat);
scene.add(warpStars);

}

/* ---------------- PARTICLES ---------------- */

function createParticles(){

const geo = new THREE.BufferGeometry();

positions = new Float32Array(COUNT*3);

for(let i=0;i<COUNT*3;i++){
positions[i]=(Math.random()-0.5)*400;
}

geo.setAttribute(
"position",
new THREE.BufferAttribute(positions,3)
);

const mat = new THREE.PointsMaterial({
size:3.6,
color:0xcccccc
});

particles = new THREE.Points(geo,mat);
scene.add(particles);

}

function textShape(text){

const textCanvas = document.createElement("canvas");
const ctx = textCanvas.getContext("2d");

fadeStars(0.05);

textCanvas.width = 1600;
textCanvas.height = 900;

ctx.clearRect(0,0,textCanvas.width,textCanvas.height);

ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

/* split text into lines */

const lines = text.split("\n");

/* base font size */

let fontSize = 200;

if(text.length > 8) fontSize = 140;
if(text.length > 12) fontSize = 110;
if(text.length > 18) fontSize = 80;

/* mobile adjustment */

if(window.innerWidth < 600){
fontSize *= 0.6;
}

/* thinner font */

ctx.font = "300 " + fontSize + "px Helvetica";

/* make sure text fits width */

const maxWidth = textCanvas.width * 0.75;

while(Math.max(...lines.map(l => ctx.measureText(l).width)) > maxWidth){

fontSize -= 5;
ctx.font = "300 " + fontSize + "px Helvetica";

}

/* vertical spacing */

const lineHeight = fontSize * 1.5;
const startY = textCanvas.height/2 - (lines.length-1)*lineHeight/2;

/* draw text */

lines.forEach((line,i)=>{
ctx.fillText(line,textCanvas.width/2,startY + i*lineHeight);
});

const data = ctx.getImageData(0,0,textCanvas.width,textCanvas.height);

targets = [];

/* particle sampling */

let step = 6;

if(text.length < 10) step = 5;   // important for "is..."
if(text.length > 12) step = 6;
if(text.length > 18) step = 7;

/* read pixels */

for(let y=0;y<textCanvas.height;y+=step){
for(let x=0;x<textCanvas.width;x+=step){

const index = (y * textCanvas.width + x) * 4;

if(data.data[index+3] > 150){

const posX = (x - textCanvas.width/2) * 0.25;
const posY = (textCanvas.height/2 - y) * 0.25;

targets.push(posX,posY,0);

}

}
}

/* send extra particles far away */

while(targets.length < COUNT*3){

targets.push(
(Math.random()-0.5)*2000,
(Math.random()-0.5)*2000,
(Math.random()-0.5)*2000
);

}

}

/* ---------------- HEART ---------------- */

function heartShape(){

targets=[];

for(let i=0;i<COUNT;i++){

const t=Math.random()*Math.PI*2;

const x=16*Math.pow(Math.sin(t),3);
const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);

targets.push(x*3.5,y*3.5,0);

}

}

/* ---------------- EXPLOSION ---------------- */

function explode(){

targets=[];

for(let i=0;i<COUNT;i++){

targets.push(
(Math.random()-0.5)*500,
(Math.random()-0.5)*500,
(Math.random()-0.5)*500
);

}

}

function fadeStars(targetOpacity){

const stars = [warpStars, galaxyStars];

stars.forEach(star => {

if(!star) return;

const material = star.material;

let opacity = material.opacity ?? 1;

const fade = () => {

opacity += (targetOpacity - opacity) * 0.05;

material.opacity = opacity;
material.transparent = true;

if(Math.abs(opacity - targetOpacity) > 0.01){
requestAnimationFrame(fade);
}

};

fade();

});

}

function pauseWarp(duration = 3000){

if(!warpStars) return;

warpStars.visible = false;

setTimeout(()=>{

warpStars.visible = true;

}, duration);

}

/* ---------------- SHOOTING STAR ---------------- */

function shootingStar(){

const geo = new THREE.BufferGeometry();

const star = new Float32Array([
-250,120,0,
-230,110,0
]);

geo.setAttribute("position",new THREE.BufferAttribute(star,3));

const mat = new THREE.LineBasicMaterial({color:0xcccccc});

const line = new THREE.Line(geo,mat);
scene.add(line);

let progress = 0;

function animateStar(){

progress += 6;

line.position.x += progress;
line.position.y -= progress*0.5;

if(progress<200){
requestAnimationFrame(animateStar);
}else{
scene.remove(line);
}

}

animateStar();

}

/* ---------------- TAP STORY ---------------- */

let tapLocked = false;

function handleTap(){

if(tapLocked) return;

tapLocked = true;

setTimeout(()=>{
tapLocked = false;
},800);

tapStage++;

if(tapStage===1){

zoomTarget=90;
pauseWarp();
shootingStar();

particles.material.size = 1.8;   // thinner

textShape("my\ncrush...");

}

else if(tapStage===2){

zoomTarget=60;
pauseWarp();

particles.material.size = 2.4;   // thinner

textShape("my crush\nis...");

}

else if(tapStage===3){

explode();

setTimeout(()=>{
continueReveal();
},1800);

}

}

/* ---------------- PARTICLE MOVE ---------------- */

function animateParticles(){

const arr = particles.geometry.attributes.position.array;

const len = Math.min(arr.length, targets.length);

for(let i=0;i<len;i+=3){

arr[i]+= (targets[i]-arr[i])*0.05;
arr[i+1]+= (targets[i+1]-arr[i+1])*0.05;
arr[i+2]+= (targets[i+2]-arr[i+2])*0.05;

}

particles.geometry.attributes.position.needsUpdate=true;

}

/* ---------------- WARP EFFECT ---------------- */

function animateWarp(){

if(!warpStars) return;

const arr = warpStars.geometry.attributes.position.array;

for(let i=2;i<arr.length;i+=3){

arr[i]+=10;

if(arr[i]>200){
arr[i]=-2000;
}

}

warpStars.geometry.attributes.position.needsUpdate=true;

}

/* ---------------- MAIN LOOP ---------------- */

function animate(){

requestAnimationFrame(animate);

camera.position.x += (mouse.x-camera.position.x)*0.02;
camera.position.y += (-mouse.y-camera.position.y)*0.02;

camera.position.z += (zoomTarget-camera.position.z)*0.04;

if(targets.length>0){
animateParticles();
}

animateWarp();

renderer.render(scene,camera);

}

/* ---------------- FINAL REVEAL ---------------- */

function continueReveal(){

zoomTarget = 120;

fadeStars(0.15);

setTimeout(()=>{
pauseWarp();
textShape("SENURI");
},400);

setTimeout(()=>{
explode();
},3500);

setTimeout(()=>{
pauseWarp();
heartShape();
},5500);

setTimeout(()=>{
pauseWarp();
textShape("I\nLOVE YOU");
},8500);

setTimeout(()=>{
fadeStars(1);
},12000);

}

/* ---------------- START ---------------- */

window.startParticles = ()=>{

createGalaxy();
createWarpStars();
createParticles();

animate();

textShape("Tap anywhere");

document.addEventListener("click",handleTap);
document.addEventListener("touchstart",handleTap);

}

/* ---------------- RESIZE ---------------- */

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});
})();