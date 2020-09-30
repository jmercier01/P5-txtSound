function preload() {
  myFont = loadFont('ASSET/FONTS/futura-pt.ttf');
  xml = loadXML('ASSET/COLORS/duotone.xml');
  sound = loadSound('../_MP3/FWF-Feet.mp3');
  // sound = loadSound('ASSET/MP3/AndrogynousMind.mp3');
  // sound = loadSound('ASSET/MP3/FujiyaMiyagiAnkleInjuries.mp3');
  // sound = loadSound('ASSET/MP3/LetItHappen.mp3');
  // sound = loadSound('ASSET/MP3/WinnersBlues.mp3');
  // sound = loadSound('ASSET/MP3/SY-StarfieldRoad.mp3');
  // sound = loadSound('ASSET/MP3/vivaldi-ete.mp3');
  // sound = loadSound('ASSET/MP3/TokyoEye.mp3');
}

/* config var */
let playing=1;
let hideGui=10;
let coefLevel=12;
let colStrok = 2;

//var for noise
const increment = 130;

//var for Lissajous
var pasBo, freqX, freqY, freqZ, scaleZ, modFreqX,modFreqY,modFreqZ, noiseMax, totalFrames, spd, rotX, rotY, rotZ, rotFxX, rotFixY,rotFixZ, valShearX,valShearY;
let bo = 1; 
let startPhi=0;
let phi= 0;
let endPhi;
let diffPhi;

//var for CCapture
let counter = 0;
let canvas;
let percent;
const record = 0;
let capturer = new CCapture( { 
  format: 'jpg', 
  name: 'open_simplex_noise_loop',
} );

//var GUI
var gui, gui2;

// Lights
var posLight;

//var Sounds
let level;

//var for Central
let posx, posy;
let backCol;
let borderx, bordery, changeScreen;

//Var Interface
let pg;
let myTxt = "- POSTER COLLECTION - generative algorithm by pizza-punk.com - POSTER COLLECTION";

function setup() {
  couleurs = xml.getChildren('color');
  initAll();  

  canvas = createCanvas(578, 819, WEBGL).canvas;
  setAttributes('antialias', true);
  backCol = colorier(0);
  background(backCol);
  noise = new OpenSimplexNoise();
  changeVals();
  makeGui();
  initBeat();
  
  if (record) capturer.start();
}


function draw() {
  // backCol.setAlpha(10);
  // background(backCol);
  
    counter++;
    colorize();
    
    level = amplitude.getLevel()*coefLevel;
	
    endPhi = startPhi+totalFrames*bo;
    diffPhi = endPhi-startPhi;
    percent = float(counter % totalFrames) / totalFrames;
    render(percent);
    if (record && counter<totalFrames*11) {
        capturer.capture(canvas);
    }
    else if (record) {
        capturer.stop();
        capturer.save();
        noLoop();
    }
}

function render(percent) {
    noStroke();
    let uoff,voff;
    let angle = map(percent, 0, 1, 0, TWO_PI);
    uoff = map(sin(angle), -1, 1, 0, 1);
    voff = map(cos(angle), -1, 1, 0, 1);
    phi = phi + (360/diffPhi);
    let rad = map(sin(angle),-1,1,-width,width);
    let cr0 = map(noise.noise2D(uoff, voff), -1, 1,-PI,PI);
    
    push();
    fill(0);
    translate(0,0,50);
    plane(500,500);
    pop();
    
    push();
    //Central Move
    posy-=.5;
    posx=sin(frameCount*0.007)*70;
    
    scale(scaleZ); 
    translate(posx,posy,0);
    let angleM = atan2(mouseY-posy,mouseX-posx);
    rotateZ(angleM);

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
      
      let cr = map(noise.noise4D(xoff, yoff, uoff, voff), -1, 1,-rad,rad);
      
      //Lissajous
      let x = sin(a*freqX)*cos(a*modFreqX)*cr;
      let y = sin(a*freqY)*cos(a*modFreqY)*cr;
      let z = sin(a*freqZ + radians(phi))*cos(a*modFreqZ)*cr; 
      // let x =  sin(a*freqX)*cos(a*modFreqX)*cr;
      // let y = frameCount;
      // let z = 0;//sin(a*freqX)*cos(a*modFreqX)*cr;

      push();
      let valCol, valSize; 
      if(a<TWO_PI/2){
        valCol = map(a,0,TWO_PI,180,255);
        valSize = map(a,0,TWO_PI,1,20);
      } else{
        valCol = map(a,0,TWO_PI,255,180);
        valSize = map(a,0,TWO_PI,10,2);
      }
      ambientMaterial(valCol);
        
      if(level>2){
        noFill();
      }
      let levMap = map(level,0,4,0,100);
      let strok = colorier(colStrok);
      strok.setAlpha(levMap);
      stroke(strok);
      ellipsoid(x*pow(percent,0.7),pow(valSize,1.8),40);
        pop();
      
        xoff += increment;
        yoff += increment*4;
    }
  
  pop();

  //Reach Limits bordes
  reachLimits();

  posx += movex;

 textH(-400);
 textH(400);
 textV(-280,PI/2);
 textV(-280,-PI/2);

 beat();
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
    background(backCol);
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
  
  if (keyCode === BACKSPACE) {
    clear();
    background(backCol);
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
  if (key === 'c') {
      changeScreen = 1;
  }
  if (key === '+') {
    valShearX += 0.1;
  }
  if (key === '=') {
    valShearX = 0;
  }
}

function makeGui(){
    gui = createGui('Shapes');
    // sliderRange(0, 20, 1);
    // gui.addGlobals('freqX');
    // sliderRange(0, 20, 1);
    // gui.addGlobals('freqY');
    // sliderRange(0, 20, 1);
    // gui.addGlobals('freqZ');
    // sliderRange(0, 20, 1);
    // gui.addGlobals('modFreqX');
    // sliderRange(0, 20, 1);
    // gui.addGlobals('modFreqY');
    // sliderRange(0, 20, 1);
    // gui.addGlobals('modFreqZ');
    sliderRange(-TWO_PI,TWO_PI, 0.1);
    gui.addGlobals('rotFixX');
    sliderRange(-TWO_PI,TWO_PI, 0.1);
    gui.addGlobals('rotFixY');
    sliderRange(-TWO_PI,TWO_PI, 0.1);
    gui.addGlobals('rotFixZ');
    sliderRange(-TWO_PI,TWO_PI,0.1);
    // gui.addGlobals('rotX');
    // sliderRange(-TWO_PI,TWO_PI,0.1);
    // gui.addGlobals('rotY');
    // sliderRange(-TWO_PI,TWO_PI,0.1);
    // gui.addGlobals('rotZ');
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
    if (hideGui==1){
      gui.hide();
      gui2.hide();
      gui3.hide();
      gui4.hide();
    }
}
function changeVals(){
    freqX = random(10);
    freqY = random(10);
    freqZ = random(10);
    modFreqX =  random(10);
    modFreqY = random(10);
    modFreqZ = random(10);
    // pasBo = random(0.1,0.2);
    initRotation();
    // rotZ = random(PI/4);
    // rotX = random(PI/4);
    // rotX *= -1;
    // rotY *= -1;
    // rotZ *= -1;
}

function textH(y){
    push();
    translate(0,y,0);
    fill(255);
    textFont(myFont);
    textSize(10);
    
    text(myTxt,-270,0);
    stroke(255);
    line(100, 0, 260,0);
    pop();
}
function textV(x,ro){
    push();
    rotateZ(ro);
    translate(0,x,0);
    fill(255);
    textFont(myFont);
    textSize(10);
    textAlign(LEFT, CENTER);
    text(myTxt,-390,0);
    stroke(255);
    line(0, 0, height/3,0);
    pop();
}
function beat(){
  push();
  translate(250,360,0);
  pg.clear();
  pg.background(backCol);
  // pg.text(round(level*10),0,15);
  rectMode(CENTER,BOTTOM);
  pg.rect(0,20,10,-level*5);
  image(pg, 0,0);
  pop();
}
function initLissajous(){
  //init Lissajous
  freqX = random(10);
  freqY = random(10);
  freqZ = random(10);
  modFreqX =  random(10);
  modFreqY = random(10);
  modFreqZ = random(10);
  noiseMax = 2;
  totalFrames = 930;//round(random(800,1600));
  pasBo = random(0.4,0.6);
  valShearX = 0;
  valShearY = 0;
}
function initRotation(){
  //init Rotation
  rotX = random(PI); //0.02;
  rotY = random(PI);//0.7;
  rotZ = random(PI); 
  rotFixX = random(PI);
  rotFixY = random(PI);
  rotFixZ = random(PI);
}
function initAll(){
  initLissajous();
  initRotation();

  //init Lights
  posLight = 1;
  spd = 0.009;
  
  //init Central
  borderx = width*2;
  bordery = height*2;
  changeScreen = 0;
  posx=0;
  posy=bordery;
  movex = 2, movey = 2;
  scaleZ = 1;
  
  //init Sounds
  level=0;
  amplitude = new p5.Amplitude();
  sound.play();

  
}

function initBeat(){
  pg = createGraphics(10, 20);
  pg.background(backCol);
  pg.fill(255);
  pg.noStroke();
  pg.textFont(myFont);
}
function colorize(){
  posLight = sin(frameCount*.01)*3;
    for(i=0;i<couleurs.length;i++){
        let lightPosx = sin(counter*spd+((TWO_PI/couleurs.length)*i));
        let lightPosy = cos(counter*spd+((TWO_PI/couleurs.length)*i));
        let r = couleurs[i].getNum('r');
        let g = couleurs[i].getNum('g');
        let b = couleurs[i].getNum('b');
        directionalLight(color(r,g,b),lightPosx,lightPosy,posLight*lightPosx);   
    }
    ambientMaterial(255);
}
function reachLimits(){
  if(posx < -borderx){
    // movex *= -2;
    posx = borderx;
  }
  if(posx > borderx){
    // movex *= -1;
    posx = -borderx;
    if(changeScreen==1){
      clear();
      background(backCol);
      changeScreen = 0;
    }
    changeVals();
  }
  if(posy > bordery){
    // movey *= -1;
    posy = -bordery;
    changeVals();
    
  }
  if(posy <= -bordery){
    // movey *= -2;
    posy = bordery;
    changeVals(); 
    if(changeScreen==1){
        clear();
        background(backCol);
        changeScreen = 0;
    }
  }
}