
/* config var */
const record = 1;
let playing=1;
let counter = 0;
const increment = 130;
let percent;
let canvas;
var gui, gui2;
var posLight;
let posx, posy;
let level;
// let pg;
let cBack;

let particules=[];
let attractor;
const ofw=10,ofh=10,ofz=10;



function preload() {
  myFont = loadFont('ASSET/FONTS/AbrilFatface-Regular.ttf');
  xml = loadXML('ASSET/COLORS/noirblanc-Duo4.xml');
  sound = loadSound('../_MP3/SufjanStevens-IWalked.mp3');
}


let capturer = new CCapture( { 
    format: 'png',
    quality: 99,
    name: 'LOOP',
} );

function setup() {
    couleurs = xml.getChildren('color');
    // pg = createGraphics(1200, 400);

    // noiseMax = 0;
    totalFrames = 700;
    posLight = 1;
    spd = 0.03;
    canvas = createCanvas(600, 600, WEBGL).canvas;
    // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
    if (record) capturer.start();
    // background(colorier(round(random(4))));
    
    cBack = colorier(0);
    background(cBack);
    // noise = new OpenSimplexNoise();

    // amplitude = new p5.Amplitude();
    // sound.play();

    
    button = createButton('PAUSE');
    button.mousePressed(bt);
    buttonClean = createButton('RESET');
    buttonClean.mousePressed(btClean);

    
    stw=width/ofw;
    sth=height/ofh;
    stz=600/ofz;

    // translate(-width/2+(stw/2),-height/2+(sth/2),stz/2);
    for(i=0;i<ofw;i++){
      for(j=0;j<ofh;j++){
        for(k=0;k<ofz;k++){
            let posi = createVector(i*stw,j*sth,k*stz-300);
            let particule = new Particule(posi);
            particules.push(particule);
        //   push();      
        //   translate(i*stw,j*sth,k*stz-300);
        //   box(0.9*sth,0.9*sth,0.9*stz);
        //   pop();
        }
      }
    }

    // console.log(particules.length);
}


function draw() {
    background(0);
    let percent = float(counter % totalFrames) / totalFrames;
    render(percent);
    if (record && counter < totalFrames) {
        capturer.capture(canvas);
    } else if (record) {
        capturer.stop();
        capturer.save();
        noLoop();
    }
  counter++;
}


function render(percent) {
    // console.log(percent);
    noStroke();
    let angle = map(percent, 0, 1, 0, TAU);
    for(i=0;i<couleurs.length;i++){
        // let lightPosx = sin(counter*spd+((TWO_PI/couleurs.length)*i));
        // let lightPosy = cos(counter*spd+((TWO_PI/couleurs.length)*i));
        let lightPosx = sin(angle+((TWO_PI/couleurs.length)*i));
        let lightPosy = cos(angle+((TWO_PI/couleurs.length)*i));
        let r = couleurs[i].getNum('r');
        let g = couleurs[i].getNum('g');
        let b = couleurs[i].getNum('b');
        directionalLight(color(r,g,b),lightPosx,lightPosy,posLight*lightPosx);    
    }
    
    scale(0.3);
    rotateX(angle);
    rotateZ(angle);

    push();
    translate(-width/2+(stw/2),-height/2+(sth/2),stz/2);

    pop();

    translate(-width/2+(stw/2),-height/2+(sth/2),stz/2);
    
    for(let i=0; i<particules.length;i++){
        particules[i].update();
        particules[i].display(angle);
    }
}

class Particule{
    constructor(pos){
        this.position = pos.copy();
        this.velocity = createVector(0,0,0);
        this.acceleration = createVector(0,0,0);
        this.mass = 1;
        this.r=int(random(100));

    }
    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
      }
    update(){
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.velocity.limit(.7);

    }
    display(angle){
        push();
        translate(this.position.x,this.position.y,this.position.z);
        let t = cos(angle*3+this.r);
        box(t*sth,t*sth,t*stz);
        pop();
    }
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