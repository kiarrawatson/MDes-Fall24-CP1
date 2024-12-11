let letters = [];
let dragging = null;
let offsetX = 0, offsetY = 0;
let handPose;
let video;
let hands = [];
let margin = 25; // letter margin
let resetButton = { x: 0, y: 0, width: 150, height: 50 }; // reset button
let landingLineY = 150; // letter landing line
let landingLineLength = 300; // letter landing line

function setup() {
  createCanvas(640, 480);
  colorMode(HSB);

  // webcam video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose = ml5.handPose(video, modelReady);

  // Set up letters along the border
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let letterSize = 50;
  let spacing = 30; 
  let totalPerimeter = 2 * (width + height - 4 * margin);
  let step = totalPerimeter / alphabet.length;

  for (let i = 0; i < alphabet.length; i++) {
    let perimeterPos = i * step;

    let x, y;

    if (perimeterPos < width - 2 * margin) {
      x = margin + perimeterPos;
      y = margin;
    } else if (perimeterPos < width + height - 4 * margin) {
      x = width - margin;
      y = margin + (perimeterPos - (width - 2 * margin));
    } else if (perimeterPos < 2 * width + height - 6 * margin) {
      x = width - margin - (perimeterPos - (width + height - 4 * margin));
      y = height - margin;
    } else {
      x = margin;
      y = height - margin - (perimeterPos - (2 * width + height - 6 * margin));
    }

    letters.push({
      char: alphabet[i],
      x: x,
      y: y,
      size: letterSize,
    });
  }

  // reset button position
  resetButton.x = width / 2 - resetButton.width / 2;
  resetButton.y = height - resetButton.height - 100;
}

function modelReady() {
  console.log('Model Loaded!');
  detectHands();  // Start detecting hands once the model is ready
}

function detectHands() {
  handPose.detect(video, gotHands);
  // Keep detecting hands continuously
  requestAnimationFrame(detectHands);
}

function gotHands(results) {
  hands = results;
  
  // Check if the hand is wide open (i.e., fingers spread apart)
  if (hands.length > 0) {
    let hand = hands[0];
    let thumbTip = hand.keypoints[4]; // Thumb tip
    let indexTip = hand.keypoints[8]; // Index tip

    let distance = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);

    // Set a threshold for "open hand"
    if (distance > 100) { // You can adjust this threshold value
      dragging = null; // Stop dragging when the hand is open
    }
  }
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw hand tracking keypoints
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(255, 0, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }

  // Index finger movement (for both left and right hands)
  if (hands.length > 0) {
    let hand = hands[0];

    let leftIndexTip = hand.keypoints[8];  // Left index finger tip
    let rightIndexTip = hand.keypoints[12]; // Right index finger tip

    // Ensure both index fingers are detected
    if (leftIndexTip && rightIndexTip) {
      let leftX = leftIndexTip.x;
      let leftY = leftIndexTip.y;
      let rightX = rightIndexTip.x;
      let rightY = rightIndexTip.y;

      // Check if either finger is close enough to any letter to start dragging
      if (dragging) {
        // Move the letter with the midpoint of both index fingers
        let centerX = (leftX + rightX) / 2;
        let centerY = (leftY + rightY) / 2;

        // dragging
        dragging.x = constrain(centerX - offsetX, dragging.size / 2 + margin, width - dragging.size / 2 - margin);
        dragging.y = constrain(centerY - offsetY, dragging.size / 2 + margin, height - dragging.size / 2 - margin);
      } else {
        // dragging x letters
        for (let letter of letters) {
          let d1 = dist(leftX, leftY, letter.x, letter.y);
          let d2 = dist(rightX, rightY, letter.x, letter.y);

          // finger dragging
          if (d1 < letter.size / 2 || d2 < letter.size / 2) {
            dragging = letter;
            offsetX = (leftX + rightX) / 2 - letter.x;
            offsetY = (leftY + rightY) / 2 - letter.y;
            break;
          }
        }
      }
    }
  } else {
    // no hands
    dragging = null;
  }

  // draggable letters
  for (let letter of letters) {
    fill(0, 100, 100);
    stroke(255, 0, 0); 
    strokeWeight(5); 
    textSize(letter.size);
    textAlign(CENTER, CENTER);

    // draw letter
    text(letter.char, letter.x, letter.y);
  }

  // draw landing line
  stroke(0, 0, 100);
  strokeWeight(5);
  line(width / 2 - landingLineLength / 2, landingLineY, width / 2 + landingLineLength / 2, landingLineY);

  // draw reset
  fill(0, 0, 100);
  noStroke();
  rect(resetButton.x, resetButton.y, resetButton.width, resetButton.height, 10);

  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Reset", resetButton.x + resetButton.width / 2, resetButton.y + resetButton.height / 2);
}

// reset letter if pressed
function mousePressed() {
  if (
    mouseX > resetButton.x &&
    mouseX < resetButton.x + resetButton.width &&
    mouseY > resetButton.y &&
    mouseY < resetButton.y + resetButton.height
  ) {
    // reset letters
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letterSize = 50;
    let spacing = 30; // Space between letters
    let totalPerimeter = 2 * (width + height - 4 * margin);
    let step = totalPerimeter / alphabet.length;

    letters = [];

    for (let i = 0; i < alphabet.length; i++) {
      let perimeterPos = i * step;

      let x, y;

      if (perimeterPos < width - 2 * margin) {
        x = margin + perimeterPos;
        y = margin;
      } else if (perimeterPos < width + height - 4 * margin) {
        x = width - margin;
        y = margin + (perimeterPos - (width - 2 * margin));
      } else if (perimeterPos < 2 * width + height - 6 * margin) {
        x = width - margin - (perimeterPos - (width + height - 4 * margin));
        y = height - margin;
      } else {
        x = margin;
        y = height - margin - (perimeterPos - (2 * width + height - 6 * margin));
      }

      letters.push({
        char: alphabet[i],
        x: x,
        y: y,
        size: letterSize,
      });
    }
  }
}