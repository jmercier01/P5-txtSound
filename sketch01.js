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
let cBack = '#0D0D0D';
let posx, posy;
let level;
let _text;


var seeds = 500;

function preload() {
  // myFont = loadFont('Oswald-Regular.ttf');
  myFont = loadFont('ASSET/FONTS/AbrilFatface-Regular.ttf');
  xml = loadXML('ASSET/COLORS/cavaletti.xml');
  sound = loadSound('../_MP3/SufjanStevens-IWalked.mp3');
}


let capturer = new CCapture( { 
  format: 'jpg', 
  name: 'open_simplex_noise_loop',
} );

function setup() {
    couleurs = xml.getChildren('color');


    freqX = random(10);
    freqY = random(10);
    freqZ = random(10);
    modFreqX =  random(10);
    modFreqY = random(10);
    modFreqZ = random(10);
    // freqX = 4;
    // freqY = 2;
    // freqZ = 2;
    // modFreqX = 0;
    // modFreqY = 0;
    // modFreqZ = 0;
    noiseMax = 0.7;
    totalFrames = 700;
    scaleZ = 0.3;
    // pasBo = random(0.01,0.1);
    pasBo = random(0.1,0.2);
    posLight = 1;
    spd = 0.009;
    rotX = 0;
    rotY = 0;
    rotZ = 0;
    rotFixX = 0;
    rotFixY = 0;
    rotFixZ = 0;
    valShearX = 0;
    valShearY = 0;
    posx = random(-width/2,width/2);
    posy = random(-height/2,height/2);
    
    // size = random(10,20);
    size = 1;
    canvas = createCanvas(1200, 1200, WEBGL).canvas;
    // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
    setAttributes('antialias', true);
    background(255);
    noise = new OpenSimplexNoise();

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

    amplitude = new p5.Amplitude();
    // sound.play();

    if (record) capturer.start();
    
    button = createButton('PAUSE');
    button.mousePressed(bt);
    buttonClean = createButton('RESET');
    buttonClean.mousePressed(btClean);

  _text = createGraphics(800, 800);
  
  _text.textFont(myFont);
  _text.textAlign(CENTER);
  _text.textSize(200);
  _text.fill(colorier(0));
  _text.text('STEVENS', width * 0.5, height * 0.5);
  _text.textSize(150);
  _text.fill(colorier(1));
  _text.text('STEVENS', width * 0.5, height * 0.5);
    
}


function draw() {
    // background(0);
    counter++;
    textAlign(CENTER, CENTER);
    // textFont(myFont);
    // let spectrum = fft.analyze();
    level = amplitude.getLevel();
    // console.log(level);


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
    let rad = map(sin(angle),-1,1,0,width*4);
    // let rad = width/4;
    let cr0 = map(noise.noise2D(uoff, voff), -1, 1,0,TWO_PI);

    // noiseMax = level;
    // scaleZ = level*2; 
    
    push();
    // textFont(myFont);
    // // textFont('Abril Fatface');
    // textAlign(CENTER,CENTER);
    // textSize(55);
    // let colorTxt = colorier(0);
    // fill(colorTxt);
    // text('STEVENS',0,0);
    // textSize(34);
    // colorTxt = colorier(1);
    // fill(colorTxt);
    // text('SUFJAN',0,0);
    push();
    translate(0,0,500);
    fill(0);
    texture(_text);
    plane(200,200);
    pop();


    // translate(0,0,rad/3);
    if(angle != 0){
      rotateX(angle*(rotX+rotFixX)+cr0);
      rotateY(angle*(rotY+rotFixY)+cr0);
      rotateZ(angle*(rotZ+rotFixZ)+cr0);
    } else {
      rotateX(rotFixX+rotX+cr0);
      rotateY(rotFixY+rotY+cr0);
      rotateZ(rotFixZ+rotZ+cr0);
    }
    
    scale(scaleZ);
    
    // fill(255);
    colorTxt = colorier(0);
    
    for (let a = 0; a < TWO_PI; a += pasBo) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        
        let cr = map(noise.noise4D(xoff, yoff, uoff, voff), -1, 1,0,rad);
        
        //Lissajous
        let x = sin(a*freqX)*cos(a*modFreqX)*cr;
        let y = sin(a*freqY)*cos(a*modFreqY)*cr;
        let z = sin(a*freqZ + radians(phi))*cos(a*modFreqZ)*cr; 

        //Normal oscillation
        // let angle1 = random(0, 2 * PI);
        // let rad_ = 90;
        // let x = rad_ + rad_ * cos(angle1);
        // let y = rad_ + rad_ * sin(angle1);
        // let z = rad_ + rad_ * -cos(angle1);
        shearX(valShearX);
        shearY(valShearY);

        push();
        let valCol, valSize; 
        if(a<TWO_PI/2){
          valCol = map(a,0,TWO_PI,180,255);
          valSize = map(a,0,TWO_PI,1,2);
        } else{
          valCol = map(a,0,TWO_PI,255,180);
          valSize = map(a,0,TWO_PI,2,1);
        }
        
        specularMaterial(valCol);
        translate(0,0,z);
        box(x*percent,3*valSize,10);
        // ellipse(10,30*valSize,20*valSize);
        pop();
        
      
        xoff += increment;
        yoff += increment;
    }
  pop();
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
    valShearX += 0.6;
  } 
  if (keyCode === DOWN_ARROW) {
    valShearX = 0;
  }  
  if (keyCode === LEFT_ARROW) {
    valShearY += 0.6;
  } 
  if (keyCode === RIGHT_ARROW) {
    valShearY = 0;
  }  
  if (keyCode === BACKSPACE) {
    clear();
    background(cBack);
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