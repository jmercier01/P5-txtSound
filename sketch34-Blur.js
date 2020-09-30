


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
let angleGen = 10;
let pan = 0.1;
var gui, gui2;
var posLight;
let raShear;
let posx, posy;
let level;
let txt1Col, txt2Col;
let movex, movey;
let borderx, bordery, changeScreen;
let backCol;
// let pg;


var seeds = 500;

function preload() {
  // myFont = loadFont('Oswald-Regular.ttf');
//   myFont = loadFont('ASSET/FONTS/AbrilFatface-Regular.ttf');
  xml = loadXML('ASSET/COLORS/fashion.xml');
  sound = loadSound('ASSET/MP3/blur-girls-and-boys.mp3');
//   sound = loadSound('ASSET/MP3/the-jimi-hendrix-experience_-_foxey-lady.mp3');
//   sound = loadSound('ASSET/MP3/TheKills-PullAU.mp3');
}


let capturer = new CCapture( { 
  format: 'jpg', 
  name: 'open_simplex_noise_loop',
} );

function setup() {
    couleurs = xml.getChildren('color');
    // pg = createGraphics(1200, 400);
    // movex = random(-2,2), movey = random(-2,2);
    movex = 2, movey = 0;
    movex = 0, movey = 0;
    freqX = random(10);
    freqY = random(10);
    freqZ = random(10);
    modFreqX =  random(10);
    modFreqY = random(10);
    modFreqZ = random(10);
    pasBo = random(0.01,1);
    changeVals();
    noiseMax = 0;
    totalFrames = 930;//round(random(800,1600));
    scaleZ = .5;
    pasBo = random(0.4,0.6);
    posLight = 1;
    spd = 0.009;
    rotX = random(0.7); //0.02;
    rotY = random(0.7);//0.7;
    rotZ = 0.6;
    rotFixX = 0;
    rotFixY = 0;
    rotFixZ = 0;
    valShearX = 0;
    valShearY = 0;
    //posx=-1700;
    borderx = 700;
    bordery = 10;
    changeScreen = 0;
    posx=-borderx;
    posy=0;
    // posy=0;

    
    
    // size = random(10,20);
   size = 1;
    canvas = createCanvas(960, 540, WEBGL).canvas;
    // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
    setAttributes('antialias', true);
    backCol = colorier(1);
    background(backCol);
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
    valShearX += .0005;
    if(valShearX >= .1){
      valShearX = 0;
    }
    textAlign(CENTER, CENTER);
    
    level = amplitude.getLevel()*40;
    // spd=sin(frameCount*0.5)*.0001;
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

    // posx += (frameCount*.01)*sin(frameCount*.1);
    // posx+=level*10;
    // posy = (frameCount*.001)*cos(frameCount*.1);
    posx+=level;
    posy=sin(frameCount*0.05)*50;
    // scaleZ = level*.1;
    scale(scaleZ); 
    translate(posx,posy,0);
    // rotateZ(-PI/4);

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
        // let x = sin(a*freqX)*cos(a*modFreqX)*cr;
        // let y = sin(a*freqY)*cos(a*modFreqY)*cr;
        // let z = sin(a*freqZ + radians(phi))*cos(a*modFreqZ)*cr; 
        let x = sin(a*freqX)*cos(a*modFreqX)*cr;
        let y = frameCount;
        let z = sin(a*freqX)*cos(a*modFreqX)*cr;

        shearX(valShearX);
        shearY(valShearY);

        push();
        let valCol, valSize; 
        if(a<TWO_PI/2){
          valCol = map(a,0,TWO_PI,180,255);
          valSize = map(a,0,TWO_PI,1,20);
        } else{
          valCol = map(a,0,TWO_PI,255,180);
          valSize = map(a,0,TWO_PI,10,2);
        }
        // specularMaterial(valCol);
        ambientMaterial(valCol);
        
        if(level>4){
            rotX = random(-.03,.03);
            rotY = random(-.3,.3);
            rotZ = random(-.003,.003);
            if(level >4.5){
              changeVals();
            }
        } else{
          
        }
        
        // else
        // {
        //   if(level<0.5){
        //     translate(0,0,z*1.2);
        //   }
        //    else{
        //     // translate(x*-8,0,0);
            
        //   }
        // }
        
        
        // ellipsoid(x*pow(percent,0.1),pow(valSize,0.8),10);
        push();
        rotateX(a);
        translate(0,50,0);
        // ellipsoid(x*pow(percent,0.8)*2,4*valSize,20);

        translate(0,x*pow(percent,0.8)*2,0);
        push();
        
        if(level>5){
            cone(10,30);
            push();
            rotate(-angle);
            translate(0,0,level*50);
            box(10);
            pop();
        } else{
            if(level>3){
                
                stroke(255,255,255,50);
                noFill();
                ellipse(0,0,40,40);
            }
            else{
                // noFill();
                // stroke(valCol);
                
                cone(10,50);
            }
        }
        
        
        
        pop();
        
        pop();
        pop();
        
      
        xoff += increment;
        yoff += increment;
    }
  
  pop();


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
  }
  if(posy > bordery){
    // movey *= -1;
    posy = -bordery;
  }
  if(posy < -bordery){
    // movey *= -2;
    posy = bordery;
  }

  posx += movex;
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
  if (keyCode === LEFT_ARROW) {
    valShearY += 0.01;
  } 
  if (keyCode === RIGHT_ARROW) {
    valShearY = 0;
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