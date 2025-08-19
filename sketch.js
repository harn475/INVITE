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
let brushingStarted = false;
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
let bubbleTimer = 0;

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
  
    // Update dragging logic
    if (draggingPaste) {
      toothpasteX = mouseX + offsetX;
      toothpasteY = mouseY + offsetY;
    }
  
    if (draggingBrush && hasPaste) {
      toothbrushX = mouseX + brushOffsetX;
      toothbrushY = mouseY + brushOffsetY;
    }
  
    // Draw elements
    image(toothbrushImg, toothbrushX, toothbrushY, toothbrushW, toothbrushH);
  
    if (!hasPaste) {
      image(toothpasteImg, toothpasteX, toothpasteY, toothpasteW, toothpasteH);
    }
  
    for (let spot of dirtSpots) {
      if (!spot.cleaned) {
        image(dirtImg, spot.x - spot.r / 2, spot.y - spot.r / 2, spot.r, spot.r);
      }
    }
  
    // Paste-to-brush detection
    if (!hasPaste &&
        isHovering(toothbrushX, toothbrushY, toothbrushW, toothbrushH) &&
        isHovering(toothpasteX, toothpasteY, toothpasteW, toothpasteH)) {
      hasPaste = true;
    }
  
    // Brushing logic (check brush over dirt)
    if (hasPaste) {
      for (let spot of dirtSpots) {
        if (!spot.cleaned && dist(toothbrushX + toothbrushW / 2, toothbrushY + toothbrushH / 2, spot.x, spot.y) < spot.r / 2) {
          if (!spot.startTime) {
            spot.startTime = millis();
          } else if (millis() - spot.startTime >= brushingTime) {
            spot.cleaned = true;
            cleanedSpots++;
          }
        } else {
          spot.startTime = null;
        }
      }
    }
  
    // Trigger bubbles after cleaning all
    if (cleanedSpots === dirtSpots.length && !brushingBubbles) {
      brushingBubbles = true;
      bubbleTimer = millis();
    }
  
    if (brushingBubbles) {
      for (let i = 0; i < 30; i++) {
        let s = random(30, 80);
        let x = random(width);
        let y = random(height);
        image(bubblesImg, x, y, s, s);
      }
  
      if (millis() - bubbleTimer > 2000) {
        currentState = "nextScene"; // placeholder for what's next
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
    if (currentState === "brushing") {
      if (!hasPaste && isHovering(toothpasteX, toothpasteY, toothpasteW, toothpasteH)) {
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
    if (!hasPaste && isHovering(toothpasteX, toothpasteY, toothpasteW, toothpasteH)) {
      draggingPaste = true;
      offsetX = toothpasteX - mouseX;
      offsetY = toothpasteY - mouseY;
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
  cleanedSpots = 0;
  brushingBubbles = false;

  dirtSpots = [
    { x: width * 0.3, y: height * 0.4, r: 60, cleaned: false, startTime: null },
    { x: width * 0.5, y: height * 0.5, r: 70, cleaned: false, startTime: null },
    { x: width * 0.7, y: height * 0.45, r: 50, cleaned: false, startTime: null }
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
