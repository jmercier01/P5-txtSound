
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
// let pg;
let cBack;


var seeds = 500;

function preload() {
  // myFont = loadFont('Oswald-Regular.ttf');
  myFont = loadFont('ASSET/FONTS/AbrilFatface-Regular.ttf');
  xml = loadXML('ASSET/COLORS/noirblanc-Duo2.xml');
  // sound = loadSound('ASSET/MP3/urban.mp3');
  img = loadImage('ASSET/IMG/sufjan.png');
//   sound = loadSound('../_MP3/Absynthe-Minded-MyHeroicsPartOne.mp3');
//   sound = loadSound('../_MP3/AndrogynousMind.mp3');
//   sound = loadSound('../_MP3/Baltimore.mp3');
  sound = loadSound('../_MP3/Fujiya&Miyagi-Flashback.mp3');
}


let capturer = new CCapture( { 
  format: 'jpg', 
  name: 'open_simplex_noise_loop',
} );

function setup() {
    couleurs = xml.getChildren('color');
    // pg = createGraphics(1200, 400);

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
    noiseMax = 1.7;
    totalFrames = 2000;
    scaleZ = .2;
    // pasBo = random(0.01,0.1);
    pasBo = 0.1;
    // pasBo = random(0.1,0.2);
    posLight = 1;
    spd = 0.005;
    rotX = 0.02;
    rotY = 0.7;
    rotZ = -0.6;
    // rotFixX = random(TWO_PI);
    // rotFixY = random(TWO_PI);
    // rotFixZ = random(TWO_PI);
    rotFixX = 0;
    rotFixY = 0;
    rotFixZ = 0;
    valShearX = 0;
    valShearY = 0;
    // posx = random(-2000,2000);
    // posy = random(-2000,2000);
    posx=-1000;
    posy=-1000;
    
    
    // size = random(10,20);
    size = 1;
    canvas = createCanvas(1200, 1200, WEBGL).canvas;
    // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
    setAttributes('antialias', true);
    // background(colorier(round(random(4))));
    cBack = colorier(0);
    background(cBack);
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
    // background(0);
    counter++;
    textAlign(CENTER, CENTER);
    textFont(myFont);
    // let spectrum = fft.analyze();
    level = amplitude.getLevel()*25;
    
    // pg.textFont(myFont);
    // pg.background(0);
    // pg.textAlign(CENTER,CENTER);
    // pg.textSize(400);
    // pg.fill(colorier(3),50);
    
    // pg.text('SUFJAN',0,0);
    // pg.textSize(150);
    // pg.fill(colorier(2),50);
    // pg.text('STEVENS',0,0);

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
    // background(255);
    noStroke();
    let uoff,voff;
    let angle = map(percent, 0, 1, 0, TWO_PI);
    uoff = map(sin(angle), -1, 1, 0, 1);
    voff = map(cos(angle), -1, 1, 0, 1);
    phi = phi + (TAU/diffPhi);
    // let rad = map(cos(angle),-1,1,0,percent*width*0.7);
    // let rad = map(cos(angle),-1,1,0,width/2);
    let rad = map(sin(angle),-1,1,-width/2,width/2);
    // let rad = width/4;
    let cr0 = map(noise.noise2D(uoff, voff), -1, 1,0,PI);
    
    push();
    let a = ease(linearstep(percent,.1,.05),8);
    let a2 = ease(linearstep(percent,.33,0.66),8);
    let a3 = ease(linearstep(percent,.66,.9),8);
    
    // //Timeline2
    let b = ease(linearstep(percent,0.1,.9),8);
    let b2 = ease(linearstep(percent,.33,.66),8);
    let b3 = ease(linearstep(percent,0.1,0.9),8);
    
    // //Timeline3
    let c = ease(linearstep(percent,0,1),8);
    
  
    // translate(b2*posx/2,b2*posy/2,0);
    let pos = map(sin(angle),-1,1,-300,300);
    translate(pos,0,0);
    rotateX(b2);
    // rotateZ(TAU/4*a3);
    // rotateY(-TAU/4*b2);
    // console.log(a);
    // rotateZ(-angle);
    // rotateX(angle*2);
    push();
    // translate(posx,posy,0);
    
    if(angle != 0){
      rotateX(angle*(rotX+rotFixX)+cr0);
      rotateY(angle*(rotY+rotFixY)+cr0);
      rotateZ(angle*(rotZ+rotFixZ)+cr0);
    } else {
      rotateX(rotFixX+rotX+cr0);
      rotateY(rotFixY+rotY+cr0);
      rotateZ(rotFixZ+rotZ+cr0);
    }

    // fill(255);
    // colorTxt = colorier(0);
    
    for (let a = 0; a < TWO_PI; a += TAU/10) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        
        let cr = map(noise.noise4D(xoff, yoff, uoff, voff), -1, 1,0,rad*1.5);
        
        //Lissajous
        let x = sin(a*freqX  + radians(phi))*cos(a*modFreqX)*cr;
        let y = sin(a*freqY  + radians(phi))*cos(a*modFreqY + phi)*cr;
        let z = sin(a*freqZ  + radians(phi))*cos(a*modFreqZ)*cr; 

        shearX(valShearX);
        shearY(valShearY);

        push();
        let valCol, valSize; 
        if(a<TWO_PI/2){
          valCol = map(a,0,TWO_PI,180,255);
          valSize = map(a,0,TWO_PI,1,2);
          scaleZ=0.4;
        } else{
          valCol = map(a,0,TWO_PI,255,180);
          valSize = map(a,0,TWO_PI,10,5);
        }
        
        specularMaterial(valCol);

        // console.log(level);
        translate(x,y,z);
        let d = 1;
        if(level<1){
        } else{
            if(level<4){
                // box(valSize*10+b2,4,10);
                
            } else{
                // box(valSize*100+b2,4,10);
                push();
                translate(x/10,y/10,z/10);
                box(valSize*20+b2,4,10);
                pop();
            }
        }
        if(level>12){changeVals();}
        
        box(valSize*10+b2,4,10);
        // box(100,100,100);
        
        
        pop();
        
      
        xoff += increment;
        yoff += increment;
    }
  pop();
//   posx+=1;
//   posy+=1;
  pop();
  // posx += sin(frameCount*0.01)*10;
  // posy += cos(frameCount*0.01)*10;
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
  if (key === 'ù') {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  }
  if (key === 'v') {
    changeVals();
    }
  if (key === 'o') {
    valShearX = 0.12;
    }
  if (key === 'l') {
    valShearX = 0;
    }
  if (key === 'm') {
    valShearY = 0.12;
    }
  if (key === 'k') {
    valShearX = 0;
    }

}

function changeVals(){
    freqX = random(10);
    freqY = random(10);
    freqZ = random(10);
    modFreqX =  random(10);
    modFreqY = random(10);
    modFreqZ = random(10);
    pasBo = random(0.1,0.2);
    rotX *= -1;
    rotZ = random(-1,1);
}
// functions inspired by Makio135 (js to P5.js)
function linearstep(t,begin,end){
    return constrain((t-begin)/(end-begin),0,1);
  }
  function linearstepUpDown(t, upBegin, upEnd, downBegin, downEnd){
     return linearstep(t, upBegin, upEnd) - linearstep(t, downBegin, downEnd)
  }
  function ease(p,g){
    if(!g){
      return 3*p*p-2*p*p*p;
    } else {
      if(p<0.5){
        return 0.5*pow(2*p,g);
      } else{
        return 1-0.5*pow(2*(1-p),g);
      }
    }
  }