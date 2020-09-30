const record = 0;
let counter = 0, percent, totalFrames = 100; //For CCapture
let playing = 1;
let fontUse;
let xml, couleurs, rcol; // For colors
let pg;
let vScale = 3;
let xoff = 0, yoff = 0;
let vectors = [];
let tiles = 400;
let widthz = 1200;
let tileSize = widthz/tiles;
// let count = 0, line = 0;

function preload(){
  fontUse = loadFont('ASSET/FONTS/Oswald-Regular.ttf');
  xml = loadXML('ASSET/COLORS/fresh.xml');
}
function setup() {
    createCanvas(widthz, widthz/2);
    couleurs = xml.getChildren('color');
    pixelDensity(1);
    background(parseColors(couleurs[0]));
    // fill(parseColors(couleurs[2]));
    // textSize(200);
    // text('HELLO',0,height/2);
  
    pg = createGraphics(width, height); 
    pg.fill(200);
    pg.textFont(fontUse);
    pg.textSize(300);
    pg.textAlign(CENTER,CENTER);
    pg.text("X",pg.width/2,pg.height/2);
    // pg.loadPixels();
    //   loadPixels();
    
    
    // translate(tileSize/2,tileSize/2);
    
    // for (let x = 0; x < tiles; x++) {
    //     for (let y = 0; y < tiles; y++) {
    //         let c = pg.get(int(x*tileSize),int(y*tileSize));
    //         if(c[0]==200){
    //             // let size = map(brightness(c),0,255,2,tileSize);    
    //             // ellipse(x*tileSize, y*tileSize, size, size);
    //             vectors[count] = createVector(x, y);
    //             count++;
    //         }
    //     }      
    // }
    
    // console.log(vectors);
}

function draw() {
    background(30,0);
    pg.loadPixels();

    // fill(255);
    // textSize(30);
    // textAlign(LEFT);
    // text(frameCount,100,40);

    // translate(tileSize/2,tileSize/2);
    noStroke();
    let xalea = round(random(width));
    let yalea = round(random(height));
    let c = pg.get(xalea,yalea);
    if(c[0]==200){
        fill(255,0,0);
    } else {fill(0,0,255);}
    rect(xalea,yalea,10,10);


    // for(let i = 0; i < vectors.length; i++){
    //     rect(vectors[i].x*tileSize,vectors[i].y*tileSize,2,2);
    // }

}



//   pg.loadPixels();
//   loadPixels();
//   let c2 = parseColors(couleurs[4]);
//   // fill(c2);
//   for(let y=0; y< pg.height; y+=3){
    
//     for(let x=0; x< pg.width; x+=3  ){
//       let index = (pg.width + x + 1 + y * pg.width) * 4;
//       let r = pg.pixels[index + 0];
//       let g = pg.pixels[index + 1];
//       let b = pg.pixels[index + 2];
      
//       let bright = (r + g + b) / 3;
//       if(bright >127){
//         noStroke();
//         fill(c2);
//         rectMode(CENTER);
        
//         ellipse(x * vScale +300, y * vScale, random(20), random(10));
//         yoff = yoff+0.0001;
//       } 
//     }
//   }
  
function keyPressed() {
  if (key == ' ') {
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

function parseColors(c){
  let r = c.getNum('r');
  let g = c.getNum('g');
  let b = c.getNum('b');
  return color(r,g,b);
}