let acceptImg, boomImg, declineImg, envelopeImg;
let fire1Img, inviteImg, mailboxImg, sparkleImg;
let decaydenceFont;

let tryagainImg;

let calendarImg;
let getreadyImg, sleepinImg;

let toothbrushImg, toothpasteImg, bubblesImg, dirtImg;

let currentState = "mailbox"; 

let imgToShow;
let imgX, imgY, imgW, imgH;

let acceptX, acceptY, acceptW, acceptH;
let declineX, declineY, declineW, declineH;

let tryAgainX, tryAgainY, tryAgainW, tryAgainH;

let getreadyX, getreadyY, getreadyW, getreadyH;
let sleepinX, sleepinY, sleepinW, sleepinH;

let shaking = false;

let sparkles = [];

let boomStartTime = 0;
let dramaticMessage = "";
const dramaticMessages = [
  "You have killed everyone you loved.",
  "The world ended, good job.",
  "I guess you hate fun.",
  "Bummer, you died.",
  "WRONG ANSWER BUDDY!"
];

// 🪥 Brushing scene vars
let hasPaste = false;
let toothpasteVisible = true;
let cleanedSpots = 0;
const brushingTime = 2000;
let dirtSpots = [];

let toothbrushX, toothbrushY, toothbrushW, toothbrushH;
let toothpasteX, toothpasteY, toothpasteW, toothpasteH;
let draggingPaste = false;
let offsetX = 0;
let offsetY = 0;
let draggingBrush = false;
let brushOffsetX = 0;
let brushOffsetY = 0;

let brushingBubbles = false;
let bubbleParticles = [];

//door variables
let allcleanImg, bestdayImg, chocoImg, cofImg, doorImg, girlImg, goImg;
let knockImg, knockpinkImg, knockblueImg, letsgoImg, yonoImg;

let goX, goY, goW, goH;

let knocking = false;
let knockStartTime = 0;
let knockIndex = 0; // alternate pink/blue

// new vars for girlScene
let girlX, girlY, girlW, girlH;
let letsgoX, letsgoY, letsgoW, letsgoH;
let yonoX, yonoY, yonoW, yonoH;

let floatCoffee = false;
let floatChoco = false;
let coffeeX, coffeeY, coffeeW, coffeeH;
let chocoX, chocoY, chocoW, chocoH;
let bestday = false;

let fineX, fineY, fineW, fineH;
let noX, noY, noW, noH;

let showThanks = false;



function preload() {
  acceptImg = loadImage('images/ACCEPT.png');
  boomImg = loadImage('images/BOOM.png');
  declineImg = loadImage('images/DECLINE.png');
  envelopeImg = loadImage('images/Envelope.png');
  fire1Img = loadImage('images/FIRE1.png');
  inviteImg = loadImage('images/Invite.png');
  mailboxImg = loadImage('images/mailbox.png');
  sparkleImg = loadImage('images/SPARKLE.png');
  tryagainImg = loadImage('images/TRYAGAIN.png');

  calendarImg = loadImage('images/CALENDAR.png');
  getreadyImg = loadImage('images/GETREADY.png');
  sleepinImg = loadImage('images/SLEEPIN.png');

  toothbrushImg = loadImage('images/TOOTHBRUSH.png');
  toothpasteImg = loadImage('images/TOOTHPASTE.png');
  bubblesImg = loadImage('images/BUBBLES.png');
  dirtImg = loadImage('images/DIRT.png');

  allcleanImg = loadImage('images/ALLCLEAN.png');
  bestdayImg = loadImage('images/BESTDAYEVER.png');
  chocoImg = loadImage('images/CHOCOLATE.png');
  cofImg = loadImage('images/COFFEE.png');
  doorImg = loadImage('images/DOOR.png');
  girlImg = loadImage('images/GIRL.png');
  goImg = loadImage('images/GO.png');
  knockImg = loadImage('images/KNOCKANIMATION.png');
  knockpinkImg = loadImage('images/KNOCKPINK.png');
  knockblueImg = loadImage('images/KNOCKBLUE.png');
  letsgoImg = loadImage('images/LETSGO.png');
  yonoImg = loadImage('images/YONO.png');

  fineImg = loadImage('images/FINEILLGO.png');
  noImg = loadImage('images/IMNOTGOING.png');

  decaydenceFont = loadFont('images/Decaydence.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateImageProps(mailboxImg);

  tryAgainW = tryagainImg.width * 0.3;
  tryAgainH = tryagainImg.height * 0.3;
  tryAgainX = (windowWidth - tryAgainW) / 2;
  tryAgainY = height - tryAgainH - 40;
}

function draw() {
  if (currentState === "boom") {
    background(0);
    image(boomImg, 0, 0, width, height);

    if (millis() - boomStartTime > 1000) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      textFont(decaydenceFont);
      text(dramaticMessage, width / 2, height - 100);

      if (millis() - boomStartTime > 3000) {
        image(tryagainImg, tryAgainX, tryAgainY, tryAgainW, tryAgainH);
      }
    }
    return;
  }

  if (currentState === "calendar") {
    if (shaking) {
      translate(random(-5, 5), random(-5, 5));
    }

    if (isHovering(sleepinX, sleepinY, sleepinW, sleepinH)) {
      background(255, 0, 0);
      drawFire();
      shaking = true;
    } else {
      shaking = false;
      background(220);
    }

    image(imgToShow, imgX, imgY, imgW, imgH);
    image(getreadyImg, getreadyX, getreadyY, getreadyW, getreadyH);
    image(sleepinImg, sleepinX, sleepinY, sleepinW, sleepinH);

    if (isHovering(getreadyX, getreadyY, getreadyW, getreadyH)) {
      spawnSparkles();
    }

    updateAndDrawSparkles();
    return;
  }

  if (currentState === "brushing") {
    background(240);
  
    // Update dragging
    if (draggingPaste && toothpasteVisible) {
      toothpasteX = mouseX + offsetX;
      toothpasteY = mouseY + offsetY;
    }
  
    if (draggingBrush) {
      toothbrushX = mouseX + brushOffsetX;
      toothbrushY = mouseY + brushOffsetY;
    }
  
    // Show instructions only while dirt remains
if (cleanedSpots < dirtSpots.length) {
  fill(0);
  textAlign(CENTER, TOP);
  textSize(32);
  text("Drag the toothpaste to the toothbrush and clean the gunk!", width / 2, 20);
}

    // Draw toothbrush
image(toothbrushImg, toothbrushX, toothbrushY, toothbrushW, toothbrushH);

// Draw toothpaste dab on toothbrush bristles
if (hasPaste) {
  let pasteW = toothbrushW * 0.7; // smaller than full brush
  let pasteH = toothbrushH * 0.7;
  let pasteX = toothbrushX + toothbrushW * -0.05; // near brush head
  let pasteY = toothbrushY - pasteH * 0.05;      // slightly above bristles
  image(toothpasteImg, pasteX, pasteY, pasteW, pasteH);
}

  
    // Draw toothpaste tube if still visible
    if (toothpasteVisible) {
      image(toothpasteImg, toothpasteX, toothpasteY, toothpasteW, toothpasteH);
    }
  
    // Draw dirt with fading opacity
for (let spot of dirtSpots) {
  if (!spot.cleaned) {
    tint(255, spot.opacity);
    image(dirtImg, spot.x - spot.r / 2, spot.y - spot.r / 2, spot.r, spot.r);
    noTint();
  }
}
  
    // Detect paste attaching
    if (toothpasteVisible &&
        isHovering(toothbrushX, toothbrushY, toothbrushW, toothbrushH) &&
        isHovering(toothpasteX, toothpasteY, toothpasteW, toothpasteH)) {
      hasPaste = true;
      toothpasteVisible = false;
    }
  
   // Brushing logic
if (hasPaste) {
  for (let spot of dirtSpots) {
    let touching = dist(toothbrushX + toothbrushW / 2, toothbrushY + toothbrushH / 2, spot.x, spot.y) < spot.r / 2;

    if (!spot.cleaned && touching) {
      spot.elapsed += deltaTime; // accumulate brushing time

      // Update opacity gradually
      let progress = constrain(spot.elapsed / brushingTime, 0, 1);
      spot.opacity = 255 * (1 - progress);

      if (progress >= 1) {
        spot.cleaned = true;
        cleanedSpots++;
      }
    }
  }
}

// Trigger bubbles once ALL dirt spots are cleaned
if (cleanedSpots === dirtSpots.length && !brushingBubbles) {
  brushingBubbles = true;

  // Spawn bubbles
  for (let i = 0; i < 80; i++) {
    bubbleParticles.push({
      x: random(width),
      y: height + random(50, 200),
      size: random(30, 80),
      speed: random(1, 3),
      opacity: 255,
      angle: random(TWO_PI),
      amplitude: random(10, 40),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.03, 0.03),
      scalePhase: random(TWO_PI)
    });
  }
}

  
    // Update & draw bubbles
if (brushingBubbles) {
  for (let i = bubbleParticles.length - 1; i >= 0; i--) {
    let b = bubbleParticles[i];
    b.y -= b.speed;
    b.angle += 0.05;
    let wobbleX = sin(b.angle) * b.amplitude;

    b.rotation += b.rotationSpeed;
    b.scalePhase += 0.05;
    let scaleFactor = 1 + 0.1 * sin(b.scalePhase);

    // 🌊 Option 3: fade slowly, but also remove when off screen
    b.opacity -= 0.3;

    push();
    translate(b.x + wobbleX, b.y);
    rotate(b.rotation);
    tint(255, b.opacity);
    image(bubblesImg, 0, 0, b.size * scaleFactor, b.size * scaleFactor);
    noTint();
    pop();

    // Remove if fully faded or floated off the top
    if (b.opacity <= 0 || b.y + b.size < 0) {
      bubbleParticles.splice(i, 1);
    }
  }

  if (bubbleParticles.length === 0) {
    currentState = "allclean";
  }
}

  
    return;
  }
  

  if (shaking) {
    translate(random(-5, 5), random(-5, 5));
    background(255, 0, 0, 50);
  } else {
    background(220);
  }

  if (imgToShow) {
    image(imgToShow, imgX, imgY, imgW, imgH);
  }

  if (currentState === "buttons") {
    image(acceptImg, acceptX, acceptY, acceptW, acceptH);
    image(declineImg, declineX, declineY, declineW, declineH);

    if (isHovering(acceptX, acceptY, acceptW, acceptH)) {
      spawnSparkles();
    }

    updateAndDrawSparkles();

    if (isHovering(declineX, declineY, declineW, declineH)) {
      drawFire();
      shaking = true;
    } else {
      shaking = false;
    }
  }
  if (currentState === "allclean") {
    background(240);
    let scale = 0.5;
    let acW = allcleanImg.width * scale;
    let acH = allcleanImg.height * scale;
    let acX = width / 2 - acW / 2;
    let acY = height / 3 - acH / 2;
    image(allcleanImg, acX, acY, acW, acH);
  
    // GO button
    goW = goImg.width * 0.25;
    goH = goImg.height * 0.25;
    goX = width / 2 - goW / 2;
    goY = acY + acH + 40;
    image(goImg, goX, goY, goW, goH);
    return;
  }
  if (currentState === "doorScene") {
    background(220);
  
    // Door centered
    let dW = doorImg.width * 0.6;
    let dH = doorImg.height * 0.6;
    let dX = width / 2 - dW / 2;
    let dY = height / 2 - dH / 2;
    image(doorImg, dX, dY, dW, dH);
  
    // Knock indicator above door (alternate pink/blue)
    let knockW = knockpinkImg.width * 0.25;
    let knockH = knockpinkImg.height * 0.25;
    let knockX = width / 2 - knockW / 2;
    let knockY = dY - knockH - 20;
  
    if (knockIndex % 2 === 0) {
      image(knockpinkImg, knockX, knockY, knockW, knockH);
    } else {
      image(knockblueImg, knockX, knockY, knockW, knockH);
    }
  
    // Knock animation (brief)
    if (knocking) {
      if (millis() - knockStartTime < 500) {
        let kW = knockImg.width * 0.3;
        let kH = knockImg.height * 0.3;
        let kX = width / 2 - kW / 2;
        let kY = dY + dH / 2 - kH / 2;
        image(knockImg, kX, kY, kW, kH);
      } else {
        knocking = false;
      }
    }
    return;
  }    
  if (currentState === "girlScene") {
    background(240);
  
    // Draw girl
    let gW = girlImg.width * 0.5;
    let gH = girlImg.height * 0.5;
    let gX = width/2 - gW/2;
    let gY = height/4;
    image(girlImg, gX, gY, gW, gH);
  
    // Buttons
    letsgoW = letsgoImg.width * 0.25;
    letsgoH = letsgoImg.height * 0.25;
    letsgoX = gX - letsgoW - 40;
    letsgoY = gY + gH + 40;
    image(letsgoImg, letsgoX, letsgoY, letsgoW, letsgoH);
  
    yonoW = yonoImg.width * 0.25;
    yonoH = yonoImg.height * 0.25;
    yonoX = gX + gW + 40;
    yonoY = gY + gH + 40;
    image(yonoImg, yonoX, yonoY, yonoW, yonoH);
  
    // Hover effects
    if (isHovering(letsgoX, letsgoY, letsgoW, letsgoH)) {
      spawnSparkles();
    }
    if (isHovering(yonoX, yonoY, yonoW, yonoH)) {
      drawFire();
      shaking = true;
    } else {
      shaking = false;
    }
  
    updateAndDrawSparkles();
    return;
  }
  
  if (currentState === "letsgoSeq") {
    background(240);
  
    // float coffee first
    if (floatCoffee) {
      image(cofImg, coffeeX, coffeeY, coffeeW, coffeeH);
      coffeeX += 2; // move across
      if (coffeeX > width) {
        floatCoffee = false;
        floatChoco = true;
        chocoX = -chocoW;
      }
    }
  
    // float chocolate next
    if (floatChoco) {
      image(chocoImg, chocoX, chocoY, chocoW, chocoH);
      chocoX += 2;
      if (chocoX > width) {
        floatChoco = false;
        bestday = true;
      }
    }
  
    // finally bestday
    if (bestday) {
      let bW = bestdayImg.width * 0.6;
      let bH = bestdayImg.height * 0.6;
      let bX = width/2 - bW/2;
      let bY = height/2 - bH/2;
      image(bestdayImg, bX, bY, bW, bH);
    }
  }
  if (bestday && !showThanks) {
    let bW = bestdayImg.width * 0.6;
    let bH = bestdayImg.height * 0.6;
    let bX = width/2 - bW/2;
    let bY = height/2 - bH/2;
    image(bestdayImg, bX, bY, bW, bH);
  
    // Fine I'll go button
    fineW = fineImg.width * 0.3;
    fineH = fineImg.height * 0.3;
    fineX = width/2 - fineW - 40;
    fineY = height - fineH - 80;
    image(fineImg, fineX, fineY, fineW, fineH);
  
    // I'm not going button
    noW = noImg.width * 0.3;
    noH = noImg.height * 0.3;
    noX = width/2 + 40;
    noY = height - noH - 80;
    image(noImg, noX, noY, noW, noH);
  }

  if (showThanks) {
    background(240);
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(0);
    text("THANKS FOR PLAYING", width/2, height/2 - 50);
  
    // Try Again button
    image(tryagainImg, width/2 - tryAgainW/2, height/2 + 50, tryAgainW, tryAgainH);
  }

      
}
function sendEmail(answer) {
  emailjs.send("service_jwmf1cu", {
    to_email: "hannah.emerlee@gmail.com",
    message: answer
  }).then(
    (response) => {
      console.log("SUCCESS!", response.status, response.text);
    },
    (err) => {
      console.log("FAILED...", err);
    }
  );
}

function mousePressed() {
  if (currentState === "boom") {
    if (millis() - boomStartTime > 3000 &&
        isHovering(tryAgainX, tryAgainY, tryAgainW, tryAgainH)) {
      currentState = "mailbox";
      updateImageProps(mailboxImg);
      sparkles = [];
      shaking = false;
    }
    return;
  }

  if (currentState === "buttons") {
    if (isHovering(acceptX, acceptY, acceptW, acceptH)) {
      currentState = "calendar";
      updateImageProps(calendarImg);
      setupCalendarButtons();
    }

    if (isHovering(declineX, declineY, declineW, declineH)) {
      currentState = "boom";
      boomStartTime = millis();
      dramaticMessage = random(dramaticMessages);
    }
    return;
  }

  if (currentState === "calendar") {
    if (isHovering(getreadyX, getreadyY, getreadyW, getreadyH)) {
      currentState = "brushing";
      setupBrushingScene();
      return;
    }

    if (isHovering(sleepinX, sleepinY, sleepinW, sleepinH)) {
      currentState = "boom";
      boomStartTime = millis();
      dramaticMessage = random(dramaticMessages);
    }
    return;
  }

  if (currentState === "brushing") {
    if (toothpasteVisible && isHovering(toothpasteX, toothpasteY, toothpasteW, toothpasteH)) {
      draggingPaste = true;
      offsetX = toothpasteX - mouseX;
      offsetY = toothpasteY - mouseY;
    }

    if (hasPaste && isHovering(toothbrushX, toothbrushY, toothbrushW, toothbrushH)) {
      draggingBrush = true;
      brushOffsetX = toothbrushX - mouseX;
      brushOffsetY = toothbrushY - mouseY;
    }
    return;
  }

  if (
    mouseX >= imgX && mouseX <= imgX + imgW &&
    mouseY >= imgY && mouseY <= imgY + imgH
  ) {
    if (currentState === "mailbox") {
      currentState = "envelope";
      updateImageProps(envelopeImg);
    } else if (currentState === "envelope") {
      currentState = "invite";
      updateImageProps(inviteImg);
    } else if (currentState === "invite") {
      currentState = "buttons";
      setupButtons();
    }
  }
  if (currentState === "allclean") {
    if (isHovering(goX, goY, goW, goH)) {
      currentState = "doorScene";
      knockIndex = 0;
      knocking = true;
      knockStartTime = millis();
    }
    return;
  }
  
  if (currentState === "doorScene") {
    knocking = true;
    knockStartTime = millis();
    knockIndex++;
  
    // after 3 knocks → go to girl scene
    if (knockIndex >= 3) {
      currentState = "girlScene";
    }
    return;
  }
  
  if (currentState === "girlScene") {
    if (isHovering(yonoX, yonoY, yonoW, yonoH)) {
      currentState = "boom";
      boomStartTime = millis();
      dramaticMessage = random(dramaticMessages);
    }
    if (isHovering(letsgoX, letsgoY, letsgoW, letsgoH)) {
      currentState = "letsgoSeq";
      floatCoffee = true;
      coffeeW = cofImg.width * 0.3;
      coffeeH = cofImg.height * 0.3;
      coffeeX = -coffeeW;
      coffeeY = height/2 - coffeeH;
      chocoW = chocoImg.width * 0.3;
      chocoH = chocoImg.height * 0.3;
      chocoY = height/2;
    }
    return;
  }

  if (bestday && !showThanks) {
    if (isHovering(fineX, fineY, fineW, fineH)) {
      sendEmail("Fine, I'll go!");
      showThanks = true;
    }
    if (isHovering(noX, noY, noW, noH)) {
      sendEmail("I'm not going.");
      showThanks = true;
    }
  }
  if (showThanks) {
    if (isHovering(width/2 - tryAgainW/2, height/2 + 50, tryAgainW, tryAgainH)) {
      currentState = "mailbox";
      updateImageProps(mailboxImg);
      showThanks = false;
      bestday = false;
    }
  }
  
}

function mouseReleased() {
  if (currentState === "brushing") {
    draggingPaste = false;
    draggingBrush = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  tryAgainW = tryagainImg.width * 0.3;
  tryAgainH = tryagainImg.height * 0.3;
  tryAgainX = (windowWidth - tryAgainW) / 2;
  tryAgainY = height - tryAgainH - 40;

  if (currentState === "mailbox") updateImageProps(mailboxImg);
  else if (currentState === "envelope") updateImageProps(envelopeImg);
  else if (currentState === "invite") updateImageProps(inviteImg);
  else if (currentState === "buttons") setupButtons();
  else if (currentState === "calendar") setupCalendarButtons();
}

function updateImageProps(img) {
  imgToShow = img;

  let maxWidth = windowWidth * 0.3;
  let scale = maxWidth / img.width;
  imgW = img.width * scale;
  imgH = img.height * scale;

  imgX = (windowWidth - imgW) / 2;
  imgY = (windowHeight - imgH) / 2;
}

function setupButtons() {
  updateImageProps(inviteImg);

  let buttonScale = 0.2;
  acceptW = acceptImg.width * buttonScale;
  acceptH = acceptImg.height * buttonScale;
  declineW = declineImg.width * buttonScale;
  declineH = declineImg.height * buttonScale;

  acceptX = imgX - acceptW - 30;
  acceptY = imgY + imgH / 2 - acceptH / 2;

  declineX = imgX + imgW + 30;
  declineY = imgY + imgH / 2 - declineH / 2;
}

function setupCalendarButtons() {
  updateImageProps(calendarImg);

  let buttonScale = 0.2;

  getreadyW = getreadyImg.width * buttonScale;
  getreadyH = getreadyImg.height * buttonScale;
  sleepinW = sleepinImg.width * buttonScale;
  sleepinH = sleepinImg.height * buttonScale;

  getreadyX = imgX - getreadyW - 30;
  getreadyY = imgY + imgH / 2 - getreadyH / 2;

  sleepinX = imgX + imgW + 30;
  sleepinY = imgY + imgH / 2 - sleepinH / 2;
}
function setupBrushingScene() {
  let scale = 0.25;

  toothbrushW = toothbrushImg.width * scale;
  toothbrushH = toothbrushImg.height * scale;
  toothbrushX = width / 2 - toothbrushW / 2;
  toothbrushY = height - toothbrushH - 50;

  toothpasteW = toothpasteImg.width * scale;
  toothpasteH = toothpasteImg.height * scale;
  toothpasteX = 100;
  toothpasteY = 100;

  hasPaste = false;
  toothpasteVisible = true;
  cleanedSpots = 0;
  brushingBubbles = false;
  bubbleParticles = [];

  dirtSpots = [
    { x: width * 0.3, y: height * 0.4, r: 60, cleaned: false, elapsed: 0, opacity: 255 },
    { x: width * 0.5, y: height * 0.5, r: 70, cleaned: false, elapsed: 0, opacity: 255 },
    { x: width * 0.7, y: height * 0.45, r: 50, cleaned: false, elapsed: 0, opacity: 255 }
  ];
}



function isHovering(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w &&
         mouseY >= y && mouseY <= y + h;
}

function spawnSparkles() {
  for (let i = 0; i < 2; i++) {
    sparkles.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      lifespan: 60,
      opacity: 255
    });
  }
}

function updateAndDrawSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    let s = sparkles[i];

    s.opacity -= 4;
    s.lifespan--;

    tint(255, s.opacity);
    image(sparkleImg, s.x, s.y, s.size, s.size);
    noTint();

    if (s.lifespan <= 0 || s.opacity <= 0) {
      sparkles.splice(i, 1);
    }
  }
}

function drawFire() {
  for (let i = 0; i < 10; i++) {
    let s = random(30, 100);
    let x = random(width);
    let y = random(height);
    image(fire1Img, x, y, s, s);
  }
}
