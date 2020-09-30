let position, counter = 0;
let bool = 0, playing = 1;
let spd = 0.01;
let raCol, valRo;

function preload(){
    xml = loadXML('ASSET/COLORS/adgeofadz.xml');
}
function setup(){
    createCanvas(600, 600, WEBGL);
    couleurs = xml.getChildren('color');
    setAttributes('antialias', true);
    background(150);
    pixelDensity(1);
    position = createVector(0,0,0);
    raCol = round(random(couleurs.length-1));
    valRo = 0;
    
}
function draw(){    
    counter++;
    // background(150);
    let ro;
    if(bool==0){
        ro = 0.01;
    } else {
        ro = -0.01;
    }
    noStroke();
    lights();
    
    for(i=0;i<couleurs.length;i++){
        let lightPosx = sin(counter*spd+((TWO_PI/couleurs.length)*i));
        let lightPosy = cos(counter*spd+((TWO_PI/couleurs.length)*i));
        let r = couleurs[i].getNum('r');
        let g = couleurs[i].getNum('g');
        let b = couleurs[i].getNum('b');
        directionalLight(color(r,g,b),lightPosx,lightPosy,lightPosx);   
    }
    
    ambientMaterial(colorier(raCol));

    
    push();
    rotateZ(valRo);
    push();
    rotateY(frameCount*0.01);
    position.x+=1;
    translate(position.x,position.y,0); 
    box(3);
    pop();
    pop();
}

function mousePressed(){
    raCol = round(random(couleurs.length-1));
    
    position.x = mouseX - width/2;
    position.y = mouseY - height/2;
    if(bool==0){bool = 1} else {bool = 0;}

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
}
function colorier(n){
    let colori = n;
    return colorTxt = color(couleurs[colori].getNum('r'),couleurs[colori].getNum('g'),couleurs[colori].getNum('b'));
}
function keyTyped(){
    if (key === 'z') {
        valRo = -HALF_PI; 
    }
    if (key === 'q') {
        valRo = -PI;
    }
    if (key === 'd') { 
        valRo = TWO_PI;
    }
    if (key === 'x') { 
        valRo = HALF_PI;
    }
}