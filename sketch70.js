
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
// let pg;


var seeds = 500;

function preload() {
  // myFont = loadFont('Oswald-Regular.ttf');
//   myFont = loadFont('ASSET/FONTS/AbrilFatface-Regular.ttf');
  xml = loadXML('ASSET/COLORS/red.xml');
  sound = loadSound('../_MP3/PINKFLOYDHAVEACIGAR.mp3');
}


let capturer = new CCapture( { 
  format: 'jpg', 
  name: 'open_simplex_noise_loop',
} );

function setup() {
    couleurs = xml.getChildren('color');
    // pg = createGraphics(1200, 400);
    movex = random(-2,2), movey = random(-2,2);
    freqX = random(10);
    freqY = random(10);
    freqZ = random(10);
    modFreqX =  random(10);
    modFreqY = random(10);
    modFreqZ = random(10);
    noiseMax = 0.7;
    totalFrames = 1400;
    scaleZ = 0.3;
    pasBo = random(0.4,0.6);
    posLight = 1;
    spd = 0.009;
    rotX = 0.02;
    rotY = 0.7;
    rotZ = -0.6;
    rotFixX = 0;
    rotFixY = 0;
    rotFixZ = 0;
    valShearX = 0;
    valShearY = 0;
    posx=random(-1000,1000);
    posy=random(-1000,1000);

    
    
    // size = random(10,20);
    size = 1;
    canvas = createCanvas(1200, 1200, WEBGL).canvas;
    // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
    setAttributes('antialias', true);
    // background(colorier(round(random(4))));
    background(0);
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
    let rad = map(sin(angle),-1,1,0,width);
    // let rad = width/4;
    let cr0 = map(noise.noise2D(uoff, voff), -1, 1,0,PI);
    
    push();

    translate(posx,posy,0);
    
    if(angle != 0){
      rotateX(angle*(rotX+rotFixX)+cr0);
      rotateY(angle*(rotY+rotFixY)+cr0);
      rotateZ(angle*(rotZ+rotFixZ)+cr0);
    } else {
      rotateX(rotFixX+rotX+cr0);
      rotateY(rotFixY+rotY+cr0);
      rotateZ(rotFixZ+rotZ+cr0);
    }

    
    for (let a = 0; a < TWO_PI; a += pasBo) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        
        let cr = map(noise.noise4D(xoff, yoff, uoff, voff), -1, 1,0,rad);
        
        //Lissajous
        let x = sin(a*freqX)*cos(a*modFreqX)*cr;
        let y = sin(a*freqY)*cos(a*modFreqY)*cr;
        let z = sin(a*freqZ + radians(phi))*cos(a*modFreqZ)*cr; 

        shearX(valShearX);
        shearY(valShearY);

        push();
        let valCol, valSize; 
        if(a<TWO_PI/2){
          valCol = map(a,0,TWO_PI,180,255);
          valSize = map(a,0,TWO_PI,1,2);
        } else{
          valCol = map(a,0,TWO_PI,255,180);
          valSize = map(a,0,TWO_PI,10,5);
        }
        
        specularMaterial(valCol);
        if(level<1){
          translate(0,0,z*1.2);
        } else{
          if(level<2){
            translate(x*-1.4,0,0);
          } else{
            translate(0,y*2,0);
          }
        }
        
        
        box(x*pow(percent,percent)*2,6*valSize,10);
        
        pop();
        
      
        xoff += increment;
        yoff += increment;
    }
  
  pop();


  if(posx < -2000){
    movex *= -1;
  }
  if(posx > 2000){
    movex *= -1;
  }
  if(posy > 2000){
    movey *= -1;
  }
  if(posy < -2000){
    movey *= -1;
  }
  posx += movex;
  posy += movey;
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
    background(0);
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
    valShearX += 0.6;
  } 
  if (keyCode === DOWN_ARROW) {
    valShearX = 0;
  }  
  if (keyCode === LEFT_ARROW) {
    valShearY += 0.2;
  } 
  if (keyCode === RIGHT_ARROW) {
    valShearY = 0;
  }  
  if (keyCode === BACKSPACE) {
    clear();
    background(0);
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
    gui.hide();
    gui2.hide();
    gui3.hide();
    gui4.hide();
}
function mouseClicked() {
    movex=mouseX;
    movey=mousey;
  }