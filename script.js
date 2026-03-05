const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const gallery = document.getElementById("gallery")
const paletteDiv = document.getElementById("palette")

const images = [
"images/foto1.jpg",
"images/foto2.jpg",
"images/foto3.jpg"
]

let palette=[]
let regionMap=[]
let selectedColor=null

images.forEach(src=>{
let img=document.createElement("img")
img.src=src
img.className="thumb"
img.onclick=()=>loadImage(src)
gallery.appendChild(img)
})

function loadImage(src){

let img=new Image()

img.onload=function(){

canvas.width=img.width
canvas.height=img.height

ctx.drawImage(img,0,0)

processImage()

}

img.src=src

}

function processImage(){

let imgData=ctx.getImageData(0,0,canvas.width,canvas.height)
let data=imgData.data

palette=[]
regionMap=[]

for(let i=0;i<data.length;i+=4){

let r=Math.round(data[i]/80)*80
let g=Math.round(data[i+1]/80)*80
let b=Math.round(data[i+2]/80)*80

let key=r+","+g+","+b

if(!palette.includes(key)){
palette.push(key)
}

data[i]=r
data[i+1]=g
data[i+2]=b

}

ctx.putImageData(imgData,0,0)

drawLineArt()
createPalette()
drawNumbers()

}

function drawLineArt(){

let imgData=ctx.getImageData(0,0,canvas.width,canvas.height)
let data=imgData.data

for(let y=1;y<canvas.height-1;y++){

for(let x=1;x<canvas.width-1;x++){

let i=(y*canvas.width+x)*4

let current=data[i]
let right=data[i+4]
let bottom=data[i+canvas.width*4]

if(Math.abs(current-right)>40 || Math.abs(current-bottom)>40){

data[i]=0
data[i+1]=0
data[i+2]=0

}else{

data[i]=255
data[i+1]=255
data[i+2]=255

}

}

}

ctx.putImageData(imgData,0,0)

}

function drawNumbers(){

ctx.fillStyle="black"
ctx.font="14px Arial"

for(let y=20;y<canvas.height;y+=40){

for(let x=20;x<canvas.width;x+=40){

let pixel=ctx.getImageData(x,y,1,1).data

let key=pixel[0]+","+pixel[1]+","+pixel[2]

let index=palette.indexOf(key)+1

if(index>0){
ctx.fillText(index,x,y)
}

}

}

}

function createPalette(){

paletteDiv.innerHTML=""

palette.forEach((c,i)=>{

let div=document.createElement("div")
div.className="color"

let rgb=c.split(",")

div.style.background=`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`

div.onclick=()=>selectedColor=i

paletteDiv.appendChild(div)

})

}

canvas.addEventListener("click",function(e){

if(selectedColor===null)return

const rect=canvas.getBoundingClientRect()

const x=Math.floor((e.clientX-rect.left)*canvas.width/rect.width)
const y=Math.floor((e.clientY-rect.top)*canvas.height/rect.height)

let pixel=ctx.getImageData(x,y,1,1).data

let key=pixel[0]+","+pixel[1]+","+pixel[2]

let index=palette.indexOf(key)

if(index===selectedColor){

ctx.fillStyle=`rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
ctx.beginPath()
ctx.arc(x,y,20,0,Math.PI*2)
ctx.fill()

}

})
