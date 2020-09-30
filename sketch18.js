
/* config var */
const record = 0;
let playing=1;
let counter = 0;
const increment = 130;
let percent;
let bo = 1; 
let startPhi=0;
let phi= 0;
let endPhi;
let diffPhi;
var pasBo, freqX, freqY, freqZ, scaleZ, modFreqX,modFreqY,modFreqZ, noiseMax, totalFrames, spd, rotX, rotY, rotZ, size, rotFxX, rotFixY,rotFixZ, valShearX,valShearY;
let canvas;
let angleGen = 1;
let pan = 0.1;
var gui, gui2;
var posLight;
let raShear;
let posx, posy;
let level;
let txt1Col, txt2Col;
let movex, movey;
let limite = 600;
// let pg;
let position, velocity;
let radMax;
let valSize = 5;


var seeds = 500;

function preload() {
  xml = loadXML('ASSET/COLORS/ritual.xml');
  sound = loadSound('ASSET/MP3/Suspirium.mp3');
}


let capturer = new CCapture( { 
  format: 'jpg', 
  name: 'open_simplex_noise_loop',
} );

function setup() {
    couleurs = xml.getChildren('color');

    changeVals();
    noiseMax = 0.0;
    totalFrames = 1400;
    scaleZ = 1;
    // pasBo = random(0.4,0.6);
    pasBo = 0.25;
    posLight = 1;
    spd = 0.009;
    rotX = 0.08;
    rotY = -0.7;
    rotZ = 0.6;
    rotFixX = 0;
    rotFixY = 0;
    rotFixZ = 0;
    valShearX = 0;
    valShearY = 0;
    radMax = 30;

    position = createVector(random(-400,400),random(-400,400));
    velocity = createVector(random(-0.5,0.5),random(-0.5,0.5));
    
    // size = random(10,20);
    size = 1;
    canvas = createCanvas(1200, 1200, WEBGL).canvas;
    // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
    setAttributes('antialias', true);
    // background(colorier(round(random(4))));
    
    background(colorier(0));
    noise = new OpenSimplexNoise();

    makeGui();

    amplitude = new p5.Amplitude();
    sound.play();

    if (record) capturer.start();
    
    button = createButton('PAUSE');
    button.mousePressed(bt);
    buttonClean = createButton('RESET');
    buttonClean.mousePressed(btClean);

    txt1Col = colorier(round(random(4)));
    txt2Col = colorier(round(random(4)));   
}


function draw() {
    // background(colorier(1));
    counter++;
    textAlign(CENTER, CENTER);
    position.add(velocity);
    level = amplitude.getLevel()*10;
    

    for(i=0;i<couleurs.length;i++){
        let lightPosx = sin(counter*spd+((TWO_PI/couleurs.length)*i));
        let lightPosy = cos(counter*spd+((TWO_PI/couleurs.length)*i));
        let r = couleurs[i].getNum('r');
        let g = couleurs[i].getNum('g');
        let b = couleurs[i].getNum('b');
        directionalLight(color(r,g,b),lightPosx,lightPosy,posLight*lightPosx);   
    }
    
    ambientMaterial(255);
	
    endPhi = startPhi+totalFrames*bo;
    diffPhi = endPhi-startPhi;
    percent = float(counter % totalFrames) / totalFrames;
    scale(scaleZ);
    render(percent);
    

    if (record && counter<totalFrames*11) {
        capturer.capture(canvas);
    }
    else if (record) {
        capturer.stop();
        capturer.save();
        noLoop();
    }
    counter++;
    // console.log(level);
}

function render(percent) {
    noStroke();
    let uoff,voff;
    let angle = map(percent, 0, 1, 0, TWO_PI);
    uoff = map(sin(angle), -1, 1, 0, 1);
    voff = map(cos(angle), -1, 1, 0, 1);
    phi = phi + (360/diffPhi);
    // let rad = map(cos(angle),-1,1,0,percent*width*0.7);
    // let rad = map(cos(angle),-1,1,0,width/2);
    let rad = map(sin(angle),-1,1,0,radMax);
    // let rad = width/4;
    let cr0 = map(noise.noise2D(uoff, voff), -1, 1,0,PI);
    
    push();

    translate(position.x,position.y,0);
    
    if(angle != 0){
      rotateX(angle*(rotX+rotFixX)+cr0);
      rotateY(angle*(rotY+rotFixY)+cr0);
      rotateZ(angle*(rotZ+rotFixZ)+cr0);
    } else {
      rotateX(rotFixX+rotX+cr0);
      rotateY(rotFixY+rotY+cr0);
      rotateZ(rotFixZ+rotZ+cr0);
    }
    
    rotateX(-QUARTER_PI);
    rotateY(-QUARTER_PI);
    rotateZ(QUARTER_PI);
    
    for (let a = 0; a < TWO_PI; a += pasBo) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        
        let cr = map(noise.noise4D(xoff, yoff, uoff, voff), 0, 1,0,rad);
        
        //Lissajous
        let x = sin(a*freqX)*cos(a*modFreqX)*cr;
        let y = sin(a*freqY)*cos(a*modFreqY)*cr;
        let z = sin(a*freqZ + radians(phi))*sin(a*modFreqZ)*cr; 

        shearX(valShearX);
        shearY(valShearY);

        

        push();
        let valCol; 
        if(a<TWO_PI/2){
          valCol = map(a,0,TWO_PI,180,255);
        } else{
          valCol = map(a,0,TWO_PI,255,180);
        }
        
        specularMaterial(valCol);


        translate(0,x*valSize,y*valSize);

        // if(level>2.3){
        //     shearX(3);
        //     // translate(0,y,z);
        // } 
        // else{
        //     translate(0,y*2,z);
        // } 
        
        
        box(x*pow(percent,0.5)*0.4,6*valSize,10);
        // box(valSize*pow(percent,0.3)*1.5,valSize*3,valSize*3);
        // rotateX(angle);
        
        // cone(8, 10);
        
      
        xoff += increment;
        yoff += increment;
    }
  
    pop();
    edges();
  


// console.log('posy='+posy+'-'+'movey='+movey);
// posy += movey;
//   posx += sin(frameCount*0.01)*10;
//   posy += cos(frameCount*0.01)*10;
}

function colorier(n){
    let colori = n;
    return colorTxt = color(couleurs[colori].getNum('r'),couleurs[colori].getNum('g'),couleurs[colori].getNum('b'));
}


function bt(){
	if(playing==1){
		noLoop();
		playing = 0;
	} else {
		redraw();
		loop();
		playing = 1;
	}
}

function btClean(){
    clear();
    background(cBack);
}

function keyPressed() {
  if (keyCode === ENTER) {
    if(playing==1){
      noLoop();
      playing = 0;
    } else {
      redraw();
      loop();
      playing = 1;
    }
  }
  if (keyCode === UP_ARROW) {
    valShearX += 0.1;
  } 
  if (keyCode === DOWN_ARROW) {
    valShearX = 0;
  }  
  if (keyCode === LEFT_ARROW) {
    valShearY += 0.01;
  } 
  if (keyCode === RIGHT_ARROW) {
    valShearY = 0;
  }  
  if (keyCode === BACKSPACE) {
    clear();
    background(colorier(round(random(4))));
  } 
}
function keyTyped(){
  if (key === 's') {
      capturer.stop();
      capturer.save();
      noLoop();
  }
  if (key === 'm') {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  }
  if (key === 'v') {
      changeVals();
  }
}

function makeGui(){
    gui = createGui('Shapes');
    sliderRange(0, 20, 1);
    gui.addGlobals('freqX');
    sliderRange(0, 20, 1);
    gui.addGlobals('freqY');
    sliderRange(0, 20, 1);
    gui.addGlobals('freqZ');
    sliderRange(0, 20, 1);
    gui.addGlobals('modFreqX');
    sliderRange(0, 20, 1);
    gui.addGlobals('modFreqY');
    sliderRange(0, 20, 1);
    gui.addGlobals('modFreqZ');
    sliderRange(-TWO_PI,TWO_PI, 0.1);
    gui.addGlobals('rotFixX');
    sliderRange(-TWO_PI,TWO_PI, 0.1);
    gui.addGlobals('rotFixY');
    sliderRange(-TWO_PI,TWO_PI, 0.1);
    gui.addGlobals('rotFixZ');
    sliderRange(-TWO_PI,TWO_PI,0.1);
    gui.addGlobals('rotX');
    sliderRange(-TWO_PI,TWO_PI,0.1);
    gui.addGlobals('rotY');
    sliderRange(-TWO_PI,TWO_PI,0.1);
    gui.addGlobals('rotZ');
    sliderRange(0, 50, 1);
    gui.addGlobals('size');
    gui.setPosition(width + 120, 20);
    // sliderRange(0, 2, 0.1);
    // gui.addGlobals('valShear');
    
    gui2 = createGui('Speed');
    gui2.setPosition(width - 120, 20);
    sliderRange(50, 2000, 10);
    gui2.addGlobals('totalFrames');
    sliderRange(0.01, 5, 0.01);
    gui2.addGlobals('pasBo');
 
    gui3 = createGui('Scale');
    gui3.setPosition(width - 120, 220);
    sliderRange(0, 5, 0.1);
    gui3.addGlobals('scaleZ');
    
    gui4 = createGui('Light');
    gui4.setPosition(width - 120, 320);
    sliderRange(-5, 5, 0.1);
    gui4.addGlobals('posLight');
    sliderRange(0.001, 0.1, 0.001);
    gui4.addGlobals('spd');
    // gui.hide();
    // gui2.hide();
    // gui3.hide();
    // gui4.hide();
}
function changeVals(){
    freqX = round(random(10));
    freqY = freqX+1;
    freqZ = freqX+2;
    modFreqX =  round(random(10,20));
    modFreqY = modFreqX+1;
    modFreqZ = modFreqX+2;
    // pasBo = random(0.1,0.2);
    rotX *= -1;
    // radMax += random(-300,300);
    velocity = createVector(random(-0.5,0.5),random(-0.5,0.5));
}
function edges(){

    if(position.x < -limite){
        // movex *= -2;
        position.x = limite;
      }
      if(position.x > limite){
        // movex *= -1;
        position.x = -limite;
      }
      if(position.y > limite){
        // movey *= -1;
        position.y = -limite;
      }
      if(position.y < -limite){
        // movey *= -2;
        position.y = limite;
      }
}
function mousePressed() {
    position.x = mouseX - width/2;
    position.y = mouseY - height/2;
    radMax += random(-300,300);
    console.log(mouseX);
  }