let ALL_COLORS = [];
function createColors() {
  for (let r=0; r<256; r+=85) {
    for (let g=0; g<256; g+=85) {
      for (let b=0; b<256; b+=85) {
        ALL_COLORS.push( {"red":r, "green":g, "blue":b} );
      }
    }
  }
  ALL_COLORS.pop(); // remove white
}
createColors();

let gameContainer = document.getElementById("game");

let COLORS = [
  /*
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
  //*/
];

function initCOLORS() {
  COLORS.length = 0;
  let workArray = ALL_COLORS.slice();
  let pairs = document.querySelector("#selectSize").value;
  for (let count=0; count<pairs; count++) {
    let ran = Math.floor(Math.random() * workArray.length);
    const obj = workArray[ran];
    COLORS.push(`rgb(${obj["red"]},${obj["green"]},${obj["blue"]})`);
    COLORS.push(`rgb(${obj["red"]},${obj["green"]},${obj["blue"]})`);
    workArray.splice(ran,1);
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors; // = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  dimensions = factors(parseInt(document.querySelector("#selectSize").value)*2);
  gameContainer.innerHTML = "";
  /*
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
  //*/
  //*
  const newTable = document.createElement("table");
  let colorIndex = 0;
  for (let r = 0; r < dimensions.low; r++) {
    const newRow = document.createElement("tr");
    for (let c = 0; c < dimensions.high; c++) {
      const newCell = document.createElement("td");
      newCell.classList.add(colorArray[colorIndex]);
      colorIndex++;
      newCell.addEventListener("click", handleCardClick);
      newCell.setAttribute("style", "height:50px;");
      newRow.append(newCell);
    }
    newTable.append(newRow);
  }
  gameContainer.append(newTable);
  //*/
}

// TODO: Implement this function!
let score = 0;
let matched = 0;
let card = null;
let clickable = true;
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  if (!clickable) {
    return;
  }
  clickable = false;
  score = parseInt(document.querySelector("#score").innerText) + 1;
  document.querySelector("#score").innerText = score.toString();
  console.log("you just clicked", event.target);
  if (event.target === card) {
    console.log("Already selected");
    clickable = true;
  }
  else if (event.target.style.backgroundColor != "") {
    console.log("Already matched");
    clickable = true;
  }
  else if (card === null) {
    event.target.style.backgroundColor = event.target.classList[0];
    card = event.target;
    console.log("First selection");
    clickable = true;
  }
  else if (event.target.classList[0] === card.style.backgroundColor.split(" ").join("")) {
    event.target.style.backgroundColor = event.target.classList[0];
    card = null;
    console.log("MATCH!");
    matched += 2;
    if (matched === shuffledColors.length) {
      const restart = document.querySelector("#btnRestart");
      restart.style.display = "inline-block"
      return;
    }
    clickable = true;
  }
  else {
    event.target.style.backgroundColor = event.target.classList[0];
    setTimeout(function (c){
      c.style.backgroundColor = "";
      card.style.backgroundColor = "";
      card = null;
      clickable = true;
    }, 1000, event.target);
    console.log("No match");
  }
}

// when the DOM loads
//createDivsForColors(shuffledColors);

const start = document.querySelector("#btnStart");
start.addEventListener("click", function () {
  let pairs = parseInt(document.querySelector("#selectSize").value);
  if (isNaN(pairs) || (pairs < 1) || (pairs > 50)) {
    alert("Invalid pairs (1-50)");
    return;
  }
  document.querySelector("#size").innerText = pairs.toString();
  const title = document.querySelector("#title");
  title.style.display = "none"
  const board = document.querySelector("#board");
  board.style.display = "block"
  initCOLORS();
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
});
const restart = document.querySelector("#btnRestart");
restart.addEventListener("click", function () {
  const btn = document.querySelector("#btnRestart");
  btn.style.display = "none"
  initCOLORS();
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  document.querySelector("#score").innerText = "0";
  score = 0;
  matched = 0;
  card = null;
  clickable = true;
});

function factors(num) {
  let low = 2;
  let high = num / 2;
  let temp = low;
  while (temp < high) {
    temp = temp + 1;
    if (num%temp === 0) {
      low = temp;
      high = num / low;
    }
  }
  return ({"low":low, "high":high});
}
