//SDS
//this is a geoguessr style game with many many features

//Bertin Li

//Making maps on https://map-degen.vercel.app/
//Converting them to coords at https://education.openguessr.com/tools/map-converter
//I used leaflet maps which somehow had everything I needed like getting corrdinates from where I clicked, and adding markers and many more
//the Leaflet website was incredibly easy to follow aswell https://leafletjs.com/examples.html

//I started my project a while ago during the arrays project and it has come a long way since then


//set up p5 party
let shared;

//give each player their unique ID
myId = crypto.randomUUID();
sessionStorage.setItem("partyPlayerId", myId);

console.log(myId);

//sounds
const PITCH_RANGE = 0.1;
let SFXVolume = 1.5;

let numberRacking;
let terribleGuess;
let goodGuessSound;
let clickSound;
let timeWarning;

//musics
let musicVolume = 0.4;

let chillMusic1;
let chillMusic2;
let chillMusic3;
let chillMusic4;
let chillMusic5;
let chillMusic6;

let intenseMusic;

function preload() {
  //load sound
  numberRacking = loadSound("number_racking.mp3");
  terribleGuess = loadSound("terrible_guess.mp3");
  goodGuessSound = loadSound("good_guess.mp3");
  clickSound = loadSound("click_sound.mp3");
  timeWarning = loadSound("has_guessed.mp3");

  chillMusic1 = loadSound("chill_music1.mp3");
  chillMusic2 = loadSound("chill_music2.mp3");
  chillMusic3 = loadSound("chill_music3.mp3");
  chillMusic4 = loadSound("chill_music4.mp3");
  chillMusic5 = loadSound("chill_music5.mp3");
  chillMusic6 = loadSound("chill_music6.mp3");

  intenseMusic = loadSound("intense_music.mp3");

  partyConnect(
    "wss://demoserver.p5party.org",
    "country_guessr"
  );

  shared = partyLoadShared("shared", {
    transfers: {},
    players: {},

    //variables for the normal party
    normalMap: "none",
    normalGuessed: false,
    normalRound: "ongoing",
    normalTimeMax: 61,
    normalMapChanged: false,
    normalRoundNumber: 0,
    normalPartyEnded: false,
    normalClickedPositions: {},
    normalStarted: false,
    normalPlayers: {},

    //variables for the blitz party
    blitzMap: "none",
    blitzGuessed: false,
    blitzRound: "ongoing",
    blitzTimeMax: timeAfterFirstGuess,
    blitzMapChanged: false,
    blitzRoundNumber: 0,
    blitzPartyEnded: false,
    blitzClickedPositions: {},
    blitzStarted: false,
    blitzPlayers: {},

    //variables for the NMPZ party
    NMPZMap: "none",
    NMPZGuessed: false,
    NMPZRound: "ongoing",
    NMPZTimeMax: 61,
    NMPZMapChanged: false,
    NMPZRoundNumber: 0,
    NMPZPartyEnded: false,
    NMPZClickedPositions: {},
    NMPZStarted: false,
    NMPZPlayers: {},

    //variables for the blink party
    blinkMap: "none",
    blinkGuessed: false,
    blinkRound: "ongoing",
    blinkTimeMax: 61,
    blinkMapChanged: false,
    blinkRoundNumber: 0,
    blinkPartyEnded: false,
    blinkClickedPositions: {},
    blinkStarted: false,
    blinkPlayers: {},

    //variables for the blur party
    blurMap: "none",
    blurGuessed: false,
    blurRound: "ongoing",
    blurTimeMax: 61,
    blurMapChanged: false,
    blurRoundNumber: 0,
    blurPartyEnded: false,
    blurClickedPositions: {},
    blurStarted: false,
    blurPlayers: {},
  });
}

let street;
let map;
let mapID;

//let stats
let totalGuesses = 0;
let totalGreen = 0;
let totalPurple = 0;
let totalGold = 0;

//ranks and images
let Rank = "coal";
let nextBestSet = 2500;
let nextBestBlitz = 0;
let nextBestNMPZ = 0;
let nextBestBlink = 0;
let nextBestBlur = 0;
let nextMaxStreak = 0;

//rank sields
let shieldSize = 80;
let rankIcon;

let allPins = "allPins.png";
let allPinsDisplay;

let allShields = "allShields.png";
let allShieldsDisplay;

let coalS = "coalShield.png";
let bronzeS = "bronzeShield.png";
let silverS = "silverShield.png";
let goldS = "goldShield.png";
let diamondS = "diamondShield.png";
let obsidianS = "obsidianShield.png";
let slimeS = "slimeShield.png";
let interS = "interShield.png";

let currentShield = coalS;

let coalP = "coalPin.png";
let bronzeP = "bronzePin.png";
let silverP = "silverPin.png";
let goldP = "goldPin.png";
let diamondP = "diamondPin.png";
let obsidianP = "obsidianPin.png";
let slimeP = "slimePin.png";
let interP = "interdimensionalPin.png";

let currentPin = coalP;

//markers
let answermarker;
let marker;
let greenAnswer = "green_marker.png";
let yellowAnswer = "bolt_answer.png";
let purpleanswer = "NMPZ_answer.png";
let whiteanswer = "Blink_answer.png";
let blackanswer = "Blur_answer.png";

let answerIcon = L.icon({
  iconUrl: greenAnswer,

  iconSize: [28, 40], //size of the icon
  iconAnchor: [14, 39], //point of the icon which will correspond to marker's location
});

let blitzAnswer = L.icon({
  iconUrl: yellowAnswer,

  iconSize: [60, 75], //size of the icon
  iconAnchor: [27, 53], //point of the icon which will correspond to marker's location
});

let NMPZAnswer = L.icon({
  iconUrl: purpleanswer,

  iconSize: [50, 62], //size of the icon
  iconAnchor: [25, 52], //point of the icon which will correspond to marker's location
});

let blinkAnswer = L.icon({
  iconUrl: whiteanswer,

  iconSize: [55, 65], //size of the icon
  iconAnchor: [27.2, 54], //point of the icon which will correspond to marker's location
});

let blurAnswer = L.icon({
  iconUrl: blackanswer,

  iconSize: [55, 83], //size of the icon
  iconAnchor: [27.5, 63], //point of the icon which will correspond to marker's location
});

let currentAnswerIcon = answerIcon;

//images
let imageOriginSize = 0.8;

let fourK;
let fourKOpac = 0;
let fourKMuilt = 1;

let fourHalfK;
let fourHalfKOpac = 0;
let fourHalfKMuilt = 1;

let plus5;
let plus5Opac = 0;
let plus5Muilt = 1;

let plus10;
let plus10Opac = 0;
let plus10Muilt = 1;

//transition var
let timeoutRun = 2500;
let delay = 50;
let rep = 0;
let increment = 0.025;
let sizeInc = 0.001;
let maxSizeDelay = 5;
let changeDelay = 25;

//game variables
let displayAns;

let afterViewing = false;

let mapClose = false;

let timeShorten = 0;

let onPhone = false;
let phoneWidth;

let zoomCoords = {};

let timeShort = false;
let onLastSetGuess = false;
let measurement;
let displayAmount;
const STARTING_GROWTH_TIME = 1;
let displayPointGrowth = 5;
let displayPoints = 0;
let prevWidth;
let prevHeight;
let refreshactive = true;
let buttonsHidden = true;
let viewingNMPZ = false;
let gridStreak = 0;
let gridMaxStreak = 0;
let gridAnswerMarker;
let gridMode = false;
let gridShown = false;
let viewing = false;
let allowGuess = true;
let allowConf = true;
let timeAfterFirstGuess = 11;
let calcLocation;
let mapShowing = true;
let winStreak = 0;
let worldMapSize = 14916862;
let points;

let bestSet = 0;
let bestBlitz = 0;
let bestNMPZ = 0;
let bestBlink = 0;
let bestBlur = 0;

let randomNames = [
  "Rank_Slimer",
  "Duck_Lamper",
  "Spike_Poker",
  "Pin_Dropper",
  "Wall_Sitter",
  "Card_Player",
  "Dice_Roller",
  "Cube_Turner",
  "Car_Washer",
  "Rat_Jogger",
  "Bug_Hopper",
  "Cup_Driver",
  "Mud_Slider",
  "Cat_Poker",
  "Log_Roller",
  "Car_Turner",
  "Pen_Dropper",
  "Box_Tapper",
  "Dog_Sitter",
  "Sun_Chaser",
  "Hat_Lifter",
  "Pig_Skipper",
  "Bat_Swinger",
  "Map_Folder",
  "Fan_Spinner",
  "Rock_Tosser",
  "Bag_Holder",
  "Boot_Kicker",
  "Fish_Caller",
  "Ball_Pusher",
  "Mug_Washer",
  "Duck_Turner",
  "Book_Rider",
  "Door_Puller",
  "Leaf_Cutter",
  "Snow_Hiker",
  "Fork_Lifter",
  "Sock_Throw",
  "Tree_Hugger"
];

//map variables
let hintMode = false;
let zoomOutAfterGuess = false;
let zoomOutPadding = 7.5;
let hintDiv = 0.333;
let hintRadius = 15;

let ultraDis = 61049; 
let superDis = 333052;
let correctDis = 1000000;
let wrongDis = 6000000;
let answerLine;
let answerPadding = 50;
let mapOriginalHeight = 300;
let mapOriginalWidth = 400;
let newHeight = 450;
let newWidth = 600;
let mapBottom = 20;
let mapRight = 75;
let enlarged = false;

let totalDistance;
let endScreen = false;
let clickedPoint;
let lastAnswer;
let randomlocation;
let currentLocations = [];
let newlat;
let newlng;

//banner
let bannerHeight = 70;
let banner;
let bannerText;
let currentBannerColor = "rgb(177, 255, 151)";

let bannerGreen = "rgb(112, 255, 64)";
let bannerRed = "rgb(255, 88, 88)";
let bannerPurple = "rgb(192, 83, 255)";
let bannerOrange = "rgb(250, 221, 91)";


let textsize;
let textSizeScreenDividor = 75;

//drop down country picker
let mapOptions;
let opttextsize;
let opttextsizeDivisor = 70;
let optionsX = 20;
let optionsY = 15;
let optxwidth;
let optyheight = bannerHeight / 2;
let optxwidthDivisor = 25;

let switching = true;

//UI Buttons
let confirmButton;
let hideMapButton;
let startSetButton;
let setTypeDropDown;
let showRankButton;
let joinButton;
let startPartyButton;
let partyHintButton;
let showGridButton;
let showGridDropDown;
let heatMapDropDown;
let heatMapType;
let Labels;
let DataShowButton;
let gridModeButton;
let loadData;
let uploadData;
let dataType;
let hintButton;
let nameType;
let hideUnderButton;
let refreshButton;
let gridShapeDropdown;
let XButton;
let autoMapCloseButton;

//set variables
let blitzTime = 10;

let setLocations = [];
let setClickedPoints = [];
let setActive = false;
let curretnRoundNumber = 0;
let maxRounds = 5;
let totalSetPoints = 0;
let setMarkers = [];
let setLineColors = [];

let timeRestriction = 60;
let timeLeft;
let nextInterval;
let time = 0;

//black cover
let cover;
let covering = false;

//red vignette effect
let redCover;

//black cover
let NMPZCover;
let NMPZCoverB;
let NMPZCoverL;
let NMPZCoverR;

//blur cover
let blurCover;
let blurCovering = false;
let blurAmount = 25;

//blink cover
let blink = false;
let blinkTime = 0;
let blinkCountdown;
let blinkMax = 3;
let visibleTime = 0.5;
let decreaseAmount = 0.1;

//show next rank info
let showingRankInfo = false;
let showRankScreen;

//show grid screen
let showGrid = false;
let showGridScreen;

let griddedMap;
let gridMapID;

//data transfer
let dataShow = false;
let dataTransScreen;

let transferCode = "";

//settings
let settingsScreen;
let showSettingsButton;
let showingSettings = false;

//p5 party local variables
let partyPoints = 0;
let inParty = false;
let currentParty;
let lockedIn = false;
let highestGuess = 0;

let maxPartyRoundNumber = 5;

let displayMarkers = [];
let preChangeClickedLength;
let waitingLobby = false;
let lobbyJoined = false;
let pinsShown = false;

let joinIn = false;
let ended = false;

let hintcircle;

//wipes the player from everything
function removePlayerFromLists() {
  delete shared.players[myId];

  delete shared.normalPlayers[myId];
  delete shared.blitzPlayers[myId];
  delete shared.NMPZPlayers[myId];
  delete shared.blinkPlayers[myId];
  delete shared.blurPlayers[myId];

  delete shared.normalClickedPositions[myId];
  delete shared.blitzClickedPositions[myId];
  delete shared.NMPZClickedPositions[myId];
  delete shared.blinkClickedPositions[myId];
  delete shared.blurClickedPositions[myId];
}

//when the player leaves
window.addEventListener("beforeunload", removePlayerFromLists);

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") {
    if (!afterViewing) {
      location.reload();
    }
    else {
      afterViewing = false;
    }
  }
  else {
    removePlayerFromLists();
  }
});


function setup() {
  noCanvas();

  //add to the players list
  shared.players[myId] = true;

  //make a new song play when one ends
  chillMusic1.onended(newSong);
  chillMusic2.onended(newSong);
  chillMusic3.onended(newSong);
  chillMusic4.onended(newSong);
  chillMusic5.onended(newSong);
  chillMusic6.onended(newSong);

  intenseMusic.onended(intenseMusicReplay);


  //set volumes
  chillMusic1.setVolume(musicVolume);
  chillMusic2.setVolume(musicVolume);
  chillMusic3.setVolume(musicVolume);
  chillMusic4.setVolume(musicVolume);
  chillMusic5.setVolume(musicVolume);
  chillMusic6.setVolume(musicVolume);

  intenseMusic.setVolume(musicVolume * 0.6);

  numberRacking.setVolume(SFXVolume);
  goodGuessSound.setVolume(SFXVolume);
  terribleGuess.setVolume(SFXVolume);
  clickSound.setVolume(SFXVolume);
  timeWarning.setVolume(SFXVolume * 0.7);

  newSong();

  //play this sound for all buttons excluding the confirm button
  document.addEventListener("click", function(e) {
    let clickedButton = e.target.closest("button");

    if (clickedButton && clickedButton !== confirmButton.elt) {
      randomPitch();
    }
  });

  //add maps to a list
  setupMap();

  //give each party a map
  setPartyMap();

  rankIcon = createImg(currentShield, "rank display");
  rankIcon.size(shieldSize, shieldSize);
  rankIcon.style("z-index", "2");
  rankIcon.style("opacity", "2");

  allPinsDisplay = createImg(allPins, "all the pins");
  allPinsDisplay.style("z-index", "21");
  allPinsDisplay.style("z-index", "-1");
  allPinsDisplay.style("opacity", "0");

  allShieldsDisplay = createImg(allShields, "all the Shields");
  allShieldsDisplay.style("z-index", "21");
  allShieldsDisplay.style("z-index", "-1");
  allShieldsDisplay.style("opacity", "0");

  //leaflet map
  map = L.map("map").setView([0, 0], 1);

  //all English Tile Layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 1,
    noWrap: true,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);


  mapID = select("#map");

  //marker placement
  marker = L.marker([0, 0]).addTo(map);

  //when the map is clicked
  function onMapClick(e) {

    if (!lockedIn) {
      randomPitch();
    }

    let wrapped = map.wrapLatLng(e.latlng);

    let lat = wrapped.lat;
    let lng = wrapped.lng;
    //what runs normally 
    if (!gridMode) {

      //when screen is clicked then move the marker to the clicked location and set the clicked coords
      if (endScreen === false && !lockedIn && !(inParty && timeLeft <= 0)) {
        marker.setLatLng([lat, lng]);
        
        clickedPoint = {
          lat: lat,
          lng: lng,
        };
      }
      if (inParty && timeLeft >= 1) {
        if (currentParty === "normal") {
          shared.normalClickedPositions[myId] = {
            lat: clickedPoint.lat,
            lng: clickedPoint.lng,
            Pin: currentPin,
            points: partyPoints,
            hintMode: hintMode,
            name: nameType.value()
          };
        }
        else if (currentParty === "blitz") {
          shared.blitzClickedPositions[myId] = {
            lat: clickedPoint.lat,
            lng: clickedPoint.lng,
            Pin: currentPin,
            points: partyPoints,
            hintMode: hintMode,
            name: nameType.value()
          };
        }
        else if (currentParty === "NMPZ") {
          shared.NMPZClickedPositions[myId] = {
            lat: clickedPoint.lat,
            lng: clickedPoint.lng,
            Pin: currentPin,
            points: partyPoints,
            hintMode: hintMode,
            name: nameType.value()
          };
        }
        else if (currentParty === "blink") {
          shared.blinkClickedPositions[myId] = {
            lat: clickedPoint.lat,
            lng: clickedPoint.lng,
            Pin: currentPin,
            points: partyPoints,
            hintMode: hintMode,
            name: nameType.value()
          };
        }
        else if (currentParty === "blur") {
          shared.blurClickedPositions[myId] = {
            lat: clickedPoint.lat,
            lng: clickedPoint.lng,
            Pin: currentPin,
            points: partyPoints,
            hintMode: hintMode,
            name: nameType.value()
          };
        }
      }
    }


    //runs while grid mode is on
    else {
      gridModeClick(lat, lng);
    }
  }

  //gridded map
  griddedMap = L.map("griddedmap").setView([0, 0], 1);

  //from leaflet
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(griddedMap);

  //set points when normal map is clicked
  clickedPoint = {
    lat: 0,
    lng: 0,
  };

  gridMapID = select("#griddedmap");

  gridMapID.hide();

  addGrid();

  map.on('click', onMapClick);

  //create top banner
  textsize = (windowWidth + windowHeight) / textSizeScreenDividor;

  //default text
  bannerText = "Best Set: " + bestSet.toLocaleString();

  banner = createDiv(bannerText);
  banner.style("background", "rgb(154, 255, 120)");
  banner.style("color", "white");
  banner.style("z-index", "20");

  banner.style("display", "flex");
  banner.style("padding-right", "2vw");
  banner.style("justify-content", "flex-end");
  banner.style("align-items", "center");

  banner.style("color", "rgb(0, 0, 0)");
  banner.style("font-weight", "bold");

  banner.style("border-bottom", "4px solid black");
  banner.style("box-sizing", "border-box");

  //pick random location
  randomlocation = random(currentLocations);
  newlat = randomlocation.lat;
  newlng = randomlocation.lng;

  //add the part that is going to have the street view on it
  street = createElement("iframe");
  street.attribute("allowfullscreen", "");
  street.style("border", "0");
  street.position(0, 0);
  street.size(windowWidth, windowHeight);

  //button to confirm
  confirmButton = createButton("Confirm Guess");
  confirmButton.size(60, 50);
  confirmButton.style("position", "absolute");
  confirmButton.style("z-index", "14");
  confirmButton.style("background-color", "rgb(255, 242, 62)");

  confirmButton.mousePressed(confirmed);

  //button to X out of the current open tab
  XButton = createButton("X");
  XButton.size(40, 40);
  XButton.style("position", "absolute");
  XButton.style("z-index", "25");
  XButton.style("background-color", "rgb(255, 62, 62)");
  XButton.style("font-size", "20px");

  XButton.mousePressed(closeAll);

  //button to hide map
  hideMapButton = createButton("Toggle Map");
  hideMapButton.size(60, 50);
  hideMapButton.style("position", "absolute");
  hideMapButton.style("z-index", "12");

  hideMapButton.mousePressed(hideMap);

  //auto map close button
  autoMapCloseButton = createButton("Auto Map Close");
  autoMapCloseButton.size(100, 50);
  autoMapCloseButton.style("position", "absolute");
  autoMapCloseButton.style("z-index", "-1");
  autoMapCloseButton.style("background-color", "red");

  autoMapCloseButton.mousePressed(toggleMapClose);

  //button to toggle hint mode
  hintButton = createButton("Hint Mode");
  hintButton.size(shieldSize, 20);
  hintButton.style("position", "absolute");
  hintButton.style("z-index", "-1");
  hintButton.style("background-color", "red");

  hintButton.mousePressed(toggleHint);

  //button to refresh the page creating the issulsion you are returning
  refreshButton = createButton("Refresh Map");
  refreshButton.size(60, 50);
  refreshButton.style("position", "absolute");
  refreshButton.style("z-index", "12");

  refreshButton.mousePressed(refreshStreet);

  //button to start a set
  startSetButton = createButton("Start Set");
  startSetButton.size(80, 30);
  startSetButton.style("position", "absolute");
  startSetButton.style("z-index", "21");

  startSetButton.mousePressed(startSet);

  //button to enter the waiting lobby
  joinButton = createButton("Join Party");
  joinButton.size(80, 30);
  joinButton.style("position", "absolute");
  joinButton.style("z-index", "21");

  joinButton.mousePressed(joinWait);

  //button to start a party
  startPartyButton = createButton("Start Party");
  startPartyButton.size(100, 30);
  startPartyButton.style("position", "absolute");
  startPartyButton.style("z-index", "-1");

  startPartyButton.mousePressed(joiningCheck);

  //button to turn on hint mode for party
  partyHintButton = createButton("Hint Mode");
  partyHintButton.size(100, 30);
  partyHintButton.style("position", "absolute");
  partyHintButton.style("z-index", "-1");
  partyHintButton.style("background-color", "red");

  partyHintButton.mousePressed(toggleHint);

  //dropdown menu to select set type
  setTypeDropDown = createSelect();
  setTypeDropDown.size(160, 20);
  setTypeDropDown.style("z-index", "21");
  setTypeDropDown.option("Normal", "normal");
  setTypeDropDown.option("Blitz", "blitz");
  setTypeDropDown.option("NMPZ", "NMPZ");
  setTypeDropDown.option("Blink", "blink");
  setTypeDropDown.option("Blur", "blur");


  //dropdown menu to select what type of info you want to see
  showGridDropDown = createSelect();
  showGridDropDown.size(80, 30);
  showGridDropDown.style("z-index", "-1");
  showGridDropDown.option("Total", "total");
  showGridDropDown.option("Grid", "grid");

  //dropdown menu to select what shape your grid mode select will be
  gridShapeDropdown = createSelect();
  gridShapeDropdown.size(80, 30);
  gridShapeDropdown.style("z-index", "-1");
  gridShapeDropdown.option("3X3", "3X3");
  gridShapeDropdown.option("Spread", "spread");
  gridShapeDropdown.option("Focus", "focus");
  gridShapeDropdown.option("Cross", "cross");
  

  gridShapeDropdown.changed(gridShapeChanged);

  //dropdown menu to select what type of heat map you want to see
  heatMapDropDown = createSelect();
  heatMapDropDown.size(80, 30);
  heatMapDropDown.style("z-index", "-1");
  heatMapDropDown.option("None", "none");
  heatMapDropDown.option("Correct", "correct");
  heatMapDropDown.option("% Correct", "percent");
  heatMapDropDown.option("Distance", "distance");
  heatMapDropDown.option("Answer", "answer");
  heatMapDropDown.option("Guessed", "guessed");

  heatMapDropDown.changed(findHeatValues);

  //type in the comparison value for your heat map
  heatMapType = createInput();
  heatMapType.size(75, 24);
  heatMapType.style("z-index", "-1");
  heatMapType.value("1");

  heatMapType.changed(findHeatValues);

  //type in the name that you want
  nameType = createInput();
  nameType.style("z-index", "2");
  nameType.value(randomNames[Math.floor(Math.random() * randomNames.length)]);
  nameType.style("font-size", "12px");
  nameType.style("text-align", "center");

  nameType.changed(nameCheck);

  //button to upload data to saved data
  uploadData = createButton("Upload");
  uploadData.size(80, 30);
  uploadData.style("position", "absolute");
  uploadData.style("z-index", "-1");

  uploadData.mousePressed(dataUpload);

  //button to start a party
  loadData = createButton("Load");
  loadData.size(80, 30);
  loadData.style("position", "absolute");
  loadData.style("z-index", "-1");

  loadData.mousePressed(dataLoad);

  //used to write the keycode for data trans
  dataType = createInput();
  dataType.size(75, 24);
  dataType.style("z-index", "-1");
  dataType.value("Slimed");

  //create labels
  Labels = createDiv();
  Labels.size(240, 20);
  Labels.style("background", "rgb(154, 255, 120)");
  Labels.style("z-index", "-1");
  Labels.style("opacity", "0");

  Labels.style("display", "flex");
  Labels.style("justify-content", "center");
  Labels.style("align-items", "center");
  Labels.style("font-weight", "bold");

  Labels.style("color", "black");

  //button to start a set
  showRankButton = createButton("Rank Info");
  showRankButton.size(shieldSize, 20);
  showRankButton.style("position", "absolute");
  showRankButton.style("z-index", "-1");

  showRankButton.mousePressed(showRank);

  //button to who the grid screen a set
  showGridButton = createButton("Stats");
  showGridButton.size(shieldSize, 20);
  showGridButton.style("position", "absolute");
  showGridButton.style("z-index", "-1");

  showGridButton.mousePressed(displayGrid);

  //button to open the datat transfer screen
  DataShowButton = createButton("Data Fuse");
  DataShowButton.size(shieldSize, 20);
  DataShowButton.style("position", "absolute");
  DataShowButton.style("z-index", "-1");

  DataShowButton.mousePressed(ShowDataScreen);

  //button to open the settings screen
  showSettingsButton = createButton("Settings");
  showSettingsButton.size(shieldSize, 20);
  showSettingsButton.style("position", "absolute");
  showSettingsButton.style("z-index", "-1");

  showSettingsButton.mousePressed(showSettings);

  //button to enter grid guessing mode
  gridModeButton = createButton("Grid Mode");
  gridModeButton.size(shieldSize, 20);
  gridModeButton.style("position", "absolute");
  gridModeButton.style("z-index", "-1");
  gridModeButton.style("background-color", "red");

  gridModeButton.mousePressed(enterGridMode);

  //button to hide all of the buttons under the shield
  hideUnderButton = createButton("Show");
  hideUnderButton.size(shieldSize, 20);
  hideUnderButton.style("position", "absolute");
  hideUnderButton.style("z-index", "2");

  hideUnderButton.mousePressed(hideUnderShield);

  hideUnderButton.mousePressed(() => {
    randomPitch();
    hideUnderShield();
  });


  //create cover
  cover = createDiv();
  cover.style("background", "rgb(0, 0, 0)");
  cover.style("z-index", "-1");

  cover.style("display", "flex");
  cover.style("flex-direction", "column");
  cover.style("justify-content", "center");
  cover.style("align-items", "center");
  cover.style("font-weight", "bold");

  cover.style("text-align", "center");
  cover.style("font-size", "35px");
  cover.style("color", "white");
  
  //red vignette effect
  redCover = createDiv();
  redCover.position(0, bannerHeight);
  redCover.size(windowWidth, windowHeight - bannerHeight);
  redCover.style("pointer-events", "none");
  redCover.style("z-index", "1");
  redCover.style("opacity", "0");
  redCover.style("transition", "opacity 0.3s");
  
  redCover.style(
    "background",
    "radial-gradient(circle, rgba(255,0,0,0) 45%, rgba(255, 0, 0, 0.2) 80%, rgba(255, 0, 0, 0.26) 100%)"
  );

  //create the data transfer screem
  dataTransScreen = createDiv();
  dataTransScreen.style("background", "rgb(154, 255, 120)");
  dataTransScreen.style("z-index", "-1");
  dataTransScreen.style("opacity", "0");

  dataTransScreen.style("display", "flex");
  dataTransScreen.style("justify-content", "center");
  dataTransScreen.style("align-items", "flex-start");
  dataTransScreen.style("font-weight", "bold");

  dataTransScreen.style("text-align", "center");
  dataTransScreen.style("color", "black");
  dataTransScreen.style("border-radius", "12px");
  dataTransScreen.style("border", "4px solid black");

  //create settings background
  settingsScreen = createDiv();
  settingsScreen.style("background", "rgb(154, 255, 120)");
  settingsScreen.style("z-index", "-1");
  settingsScreen.style("opacity", "0");

  settingsScreen.style("display", "flex");
  settingsScreen.style("justify-content", "center");
  settingsScreen.style("align-items", "flex-start");
  settingsScreen.style("font-weight", "bold");

  settingsScreen.style("text-align", "center");
  settingsScreen.style("color", "black");
  settingsScreen.style("border-radius", "12px");
  settingsScreen.style("border", "4px solid black");

  //create blur effect
  blurCover = createDiv();
  blurCover.style("background", "rgba(255, 255, 255, 0)");
  blurCover.style("backdrop-filter", `blur(${blurAmount}px)`);
  blurCover.style("-webkit-backdrop-filter", `blur(${blurAmount}px)`);
  blurCover.style("z-index", "1");
  blurCover.style("pointer-events", "none");

  //create NMPZ Covers
  NMPZCover = createDiv();
  NMPZCover.style("background", "rgba(255, 255, 255, 0)");
  NMPZCover.style("z-index", "1");

  NMPZCoverB = createDiv();
  NMPZCoverB.style("background", "rgba(255, 255, 255, 0)");
  NMPZCoverB.style("z-index", "1");

  NMPZCoverL = createDiv();
  NMPZCoverL.style("background", "rgba(255, 255, 255, 0)");
  NMPZCoverL.style("z-index", "1");

  NMPZCoverR = createDiv();
  NMPZCoverR.style("background", "rgba(255, 255, 255, 0)");
  NMPZCoverR.style("z-index", "1");

  //create rank info
  showRankScreen = createDiv();
  showRankScreen.style("background", "rgb(154, 255, 120)");
  showRankScreen.style("z-index", "-1");
  showRankScreen.style("opacity", "0");

  showRankScreen.style("justify-content", "left");
  showRankScreen.style("align-items", "center");
  showRankScreen.style("font-weight", "bold");

  showRankScreen.style("color", "black");
  showRankScreen.style("border-radius", "12px");
  showRankScreen.style("border", "4px solid black");

  //create grid info
  showGridScreen = createDiv();
  showGridScreen.style("background", "rgb(154, 255, 120)");
  showGridScreen.style("z-index", "-1");
  showGridScreen.style("opacity", "0");

  showGridScreen.style("justify-content", "left");
  showGridScreen.style("align-items", "center");
  showGridScreen.style("font-weight", "bold");

  showGridScreen.style("color", "black");
  showGridScreen.style("border-radius", "12px");
  showGridScreen.style("border", "4px solid black");

  //images
  fourK = createImg("4K.png", "4K");
  fourK.style("z-index", "21");
  fourK.style("transform", "translate(-50%, -50%)");
  fourK.style("pointer-events", "none");

  fourHalfK = createImg("4.8K.png", "4.8K");
  fourHalfK.style("z-index", "21");
  fourHalfK.style("transform", "translate(-50%, -50%)");
  fourHalfK.style("pointer-events", "none");

  plus5 = createImg("+5.png", "+5");
  plus5.style("z-index", "21");
  plus5.style("transform", "translate(-50%, -50%)");
  plus5.style("pointer-events", "none");

  plus10 = createImg("+10.png", "+10");
  plus10.style("z-index", "21");
  plus10.style("transform", "translate(-50%, -50%)");
  plus10.style("pointer-events", "none");


  //load info

  //load best sets
  if (localStorage.getItem("BestSet") !== null) {
    bestSet = Number(localStorage.getItem("BestSet"));
  }
  if (localStorage.getItem("BestBlitz") !== null) {
    bestBlitz = Number(localStorage.getItem("BestBlitz"));
  }
  if (localStorage.getItem("BestNMPZ") !== null) {
    bestNMPZ = Number(localStorage.getItem("BestNMPZ"));
  }
  if (localStorage.getItem("BestBlink") !== null) {
    bestBlink = Number(localStorage.getItem("BestBlink"));
  }
  if (localStorage.getItem("BestBlur") !== null) {
    bestBlur = Number(localStorage.getItem("BestBlur"));
  }

  if (localStorage.getItem("streak") !== null) {
    gridStreak = Number(localStorage.getItem("streak"));
  }
  if (localStorage.getItem("maxstreak") !== null) {
    gridMaxStreak = Number(localStorage.getItem("maxstreak"));
  }

  //load saved stats
  if (localStorage.getItem("totalguesses") !== null) {
    totalGuesses = Number(localStorage.getItem("totalguesses"));
  }
  if (localStorage.getItem("totalgreen") !== null) {
    totalGreen = Number(localStorage.getItem("totalgreen"));
  }
  if (localStorage.getItem("totalpurple") !== null) {
    totalPurple = Number(localStorage.getItem("totalpurple"));
  }
  if (localStorage.getItem("totalgold") !== null) {
    totalGold = Number(localStorage.getItem("totalgold"));
  }

  //load others
  if (localStorage.getItem("name") !== null) {
    nameType.value(localStorage.getItem("name"));
  }

  changeMapSize();

  resetMapSize();
}

function draw() {
  nextmap();
  fixsizes();
  bannerTextChange();
  timeDrain();
  lockStartJoin();
  NMPZ();
  activateBlur();
  covertoggle();
  blinkToggle();
  rankModify();
  forceLeaveEnd();
  checkPartyEnded();
  partyTimeChange();
  displayOthers();
  togglePartyButton();
  joinParty();
  lockMap();
  bannerColChange();
  gridTextChange();
  labelConfigure();
  showButtonLock();
  dataInfo();
  setButtonText();
  lockStartParty();
  addPointParty();
  ensureIDCount();
  changeCoverTextSize();
  fixMapSizes();
  changeJoinWaitTest();
  toggleConfirm();
  showGridDrop();
  resetGuessStatus();
  allHaveGuessed();
}

//for testing purposes
function crAns() {
  displayAns = L.marker([randomlocation.lat, randomlocation.lng]).addTo(map);
}

function toggleMapClose() {
  mapClose = !mapClose;
  if (mapClose) {
    autoMapCloseButton.style("background-color", "green");
  }
  else {
    autoMapCloseButton.style("background-color", "red");
  }
}

function showSettings() {
  if (!showingSettings) {
    settingsScreen.style("z-index", "20");
    settingsScreen.style("opacity", "1");

    autoMapCloseButton.style("z-index", "25");

    showingSettings = true;
  }
  else {
    closeSettings();
  }
}

function closeSettings() {
  //close the settings screen
  settingsScreen.style("z-index", "-1");
  settingsScreen.style("opacity", "0");

  autoMapCloseButton.style("z-index", "-1");
  
  showingSettings = false;
}

function closeData() {
  //close data screen
  dataTransScreen.style("z-index", "-1");
  dataTransScreen.style("opacity", "0");
  
  uploadData.style("z-index", "-1");
  uploadData.style("opacity", "0");
  
  loadData.style("z-index", "-1");
  loadData.style("opacity", "0");
  
  dataType.style("z-index", "-1");
  dataType.style("opacity", "0");
  
  dataShow = false;
}

//closes out of the current open screen
function closeAll() {
  closeRank();
  closegrid();
  closeData();
  closeSettings();
}

//shortens the time when all players of the parpty has guessed
function allHaveGuessed() {
  if (inParty && !endScreen && timeLeft >= timeShorten) {
    if (currentParty === "normal") {

      //checks if all the players have guessed
      if (Object.values(shared.normalPlayers).every(value => value === false)) {
        time = millis();
        timeLeft = timeShorten;
      }
    }

    else if (currentParty === "blitz") {

      //checks if all the players have guessed
      if (Object.values(shared.blitzPlayers).every(value => value === false)) {
        time = millis();
        timeLeft = timeShorten;
      }
    }

    else if (currentParty === "NMPZ") {

      //checks if all the players have guessed
      if (Object.values(shared.NMPZPlayers).every(value => value === false)) {
        time = millis();
        timeLeft = timeShorten;
      }
    }

    else if (currentParty === "blink") {

      //checks if all the players have guessed
      if (Object.values(shared.blinkPlayers).every(value => value === false)) {
        time = millis();
        timeLeft = timeShorten;
      }
    }

    else if (currentParty === "blur") {

      //checks if all the players have guessed
      if (Object.values(shared.blurPlayers).every(value => value === false)) {
        time = millis();
        timeLeft = timeShorten;
      }
    }
  }
}

//reset guess status for parties
function resetGuessStatus() {
  //reset the players status to true when the next party round starts
  if (inParty && endScreen) {
    setTimeout(() => {
      if (currentParty === "normal" && !shared.normalPlayers[myId]) {
        shared.normalPlayers[myId] = true;
      }
      else if (currentParty === "blitz" && !shared.blitzPlayers[myId]) {
        shared.blitzPlayers[myId] = true;
      }
      else if (currentParty === "NMPZ" && !shared.NMPZPlayers[myId]) {
        shared.NMPZPlayers[myId] = true;
      }
      else if (currentParty === "blink" && !shared.blinkPlayers[myId]) {
        shared.blinkPlayers[myId] = true;
      }
      else if (currentParty === "blur" && !shared.blurPlayers[myId]) {
        shared.blurPlayers[myId] = true;
      }
    }, 100);
  }
}

function windowResized() {
  resetMapSize();
}

//makes the map go back to its size after the endscreen
function resetMapSize() {
  if (!endScreen) {
    phoneWidth = windowWidth;
    
    //reset map for pc
    if (windowWidth + windowHeight > 2000 || windowWidth > windowHeight) {
      onPhone = false;
      mapID.style("bottom", "20px");
      mapID.style("right", "75px");
      mapID.style("width", "400px");
      confirmButton.position(windowWidth - 67, windowHeight - 250);
      hideMapButton.position(windowWidth - 67, windowHeight - 310);
      refreshButton.position(windowWidth - 67, windowHeight - 110);
      confirmButton.size(60, 50);
    }
    //reset map for phone
    else {
      onPhone = true;
      mapID.style("bottom", "50px");
      mapID.style("right", "0px");
      mapID.style("width", `${phoneWidth}px`);
      confirmButton.position(0, windowHeight - 50);
      hideMapButton.position(windowWidth - 60, windowHeight - 50);
      refreshButton.position(windowWidth - 120, windowHeight - 50);
      confirmButton.size(windowWidth - 120, 50);
    }
  }
}

//sets a random pitch to the sound effect then plays it
function randomPitch() {
  let randomPitch = Math.random() * (2 * PITCH_RANGE) + (1 - PITCH_RANGE);
  clickSound.rate(randomPitch);
  clickSound.play();
}

function stopAllMusic() {
  chillMusic1.stop();
  chillMusic2.stop();
  chillMusic3.stop();
  chillMusic4.stop();
  chillMusic5.stop();
  chillMusic6.stop();
}

//replay the music if the player still has not guessed yet
function intenseMusicReplay() {
  if (timeShort) {
    intenseMusic.play();
  }
}

function soundUpdate() {
  chillMusic1.setVolume(musicVolume);
  chillMusic2.setVolume(musicVolume);
  chillMusic3.setVolume(musicVolume);
  chillMusic4.setVolume(musicVolume);
  chillMusic5.setVolume(musicVolume);
  chillMusic6.setVolume(musicVolume);

  numberRacking.setVolume(SFXVolume);
  goodGuessSound.setVolume(SFXVolume);
  terribleGuess.setVolume(SFXVolume);
}

//chooses a random song when one ends
function newSong() {
  if (!timeShort || endScreen) {
    let randomNum = Math.floor(random(1, 7));
  
    if (randomNum === 1) {
      chillMusic1.play();
    }
    else if (randomNum === 2) {
      chillMusic2.play();
    }
    else if (randomNum === 3) {
      chillMusic3.play();
    }
    else if (randomNum === 4) {
      chillMusic4.play();
    }
    else if (randomNum === 5) {
      chillMusic5.play();
    }
    else if (randomNum === 6) {
      chillMusic6.play();
    }
  }
}

function gridShapeChanged() {
  gridModeShape = gridShapeDropdown.value();
  for (let item of gridModeSquares) {
    item.remove();
  }
  resetSelect();
}

//show and hide the grid drop down button
function showGridDrop() {
  if (gridMode) {
    gridShapeDropdown.style("z-index", "21");
  }
  else {
    gridShapeDropdown.style("z-index", "-1");
  }
}

//these functions are used to show the anumation for getting a good guess
function show4K() {
  rep = 0;
  //runs every 25 miliseconds and changes size values and opacity
  setTimeout(() => {
    fourKMuilt = imageOriginSize;
  
    let changeOpac = setInterval(() => {
      fourKMuilt += sizeInc;

      rep += 1;
      if (rep < 1 / increment + maxSizeDelay) {
        fourKOpac += increment;
      }
      else {
        fourKOpac -= increment;
      }
    }, changeDelay);
  
    setTimeout(() => {
      fourKOpac = 0;
      fourKMuilt = imageOriginSize;
      clearInterval(changeOpac);
    }, timeoutRun);
  }, delay);
}

function show48K() {
  rep = 0;

  setTimeout(() => {
    fourHalfKMuilt = imageOriginSize;
  
    let changeOpac = setInterval(() => {
      fourHalfKMuilt += sizeInc;

      rep += 1;
      if (rep < 1 / increment + maxSizeDelay) {
        fourHalfKOpac += increment;
      }
      else {
        fourHalfKOpac -= increment;
      }
    }, changeDelay);
  
    setTimeout(() => {
      fourHalfKOpac = 0;
      fourHalfKMuilt = imageOriginSize;
      clearInterval(changeOpac);
    }, timeoutRun);
  }, delay);
}

function showPlus5() {
  rep = 0;

  setTimeout(() => {
    plus5Muilt = imageOriginSize;
  
    let changeOpac = setInterval(() => {
      plus5Muilt += sizeInc;

      rep += 1;
      if (rep < 1 / increment + maxSizeDelay) {
        plus5Opac += increment;
      }
      else {
        plus5Opac -= increment;
      }
    }, changeDelay);
  
    setTimeout(() => {
      plus5Opac = 0;
      plus5Muilt = imageOriginSize;
      clearInterval(changeOpac);
    }, timeoutRun);
  }, delay);
}

function showPlus10() {
  rep = 0;

  setTimeout(() => {
    plus10Muilt = imageOriginSize;
  
    let changeOpac = setInterval(() => {
      plus10Muilt += sizeInc;

      rep += 1;
      if (rep < 1 / increment + maxSizeDelay) {
        plus10Opac += increment;
      }
      else {
        plus10Opac -= increment;
      }
    }, changeDelay);
  
    setTimeout(() => {
      plus10Opac = 0;
      plus10Muilt = imageOriginSize;
      clearInterval(changeOpac);
    }, timeoutRun);
  }, delay);
}

function grow() {
  let pointgrowth = points / 18;

  if (displayPoints < points) {

    displayPoints += round(pointgrowth - (displayPoints / points * pointgrowth - pointgrowth * 0.1));

    if (displayPoints > points) {
      displayPoints = points;
    }

    displayPointGrowth = STARTING_GROWTH_TIME + displayPoints / points * STARTING_GROWTH_TIME * 25;

    setTimeout(grow, displayPointGrowth);
  }
}

function incrementDisplayPoints() {
  displayPoints = 0;
  grow();
}

function toggleConfirm() {
  if (lockedIn && !endScreen && inParty) {
    confirmButton.attribute("disabled", "");
  }
  else {
    confirmButton.removeAttribute("disabled");
  }
}

function changeJoinWaitTest() {
  if (setActive) {
    joinButton.html("End Set");
  }
  else if (!inParty) {
    joinButton.html("Join Party");
  }
  else {
    joinButton.html("Leave");
  }
}

//when the window sizes change then make the map adjust
function fixMapSizes() {
  if (prevWidth !== windowWidth || prevHeight !== windowHeight) {
    map.invalidateSize();
    // griddedMap.invalidateSize();
  }
  prevWidth = windowWidth;
  prevHeight = windowHeight;
  
}

//change the size of the text so that the counter in blink mode is easier to see
function changeCoverTextSize() {
  if (blink) {
    cover.style("font-size", "50px");
  }
  else {
    cover.style("font-size", "35px");
  }
}

//makes sure that the player is accounted for when they are in the party
function ensureIDCount() {
  shared.players[myId] = true;

  if (inParty && waitingLobby) {
    if (currentParty === "normal") {
      shared.normalPlayers[myId] = true;
    }
    else if (currentParty === "blitz") {
      shared.blitzPlayers[myId] = true;
    }
    else if (currentParty === "NMPZ") {
      shared.NMPZPlayers[myId] = true;
    }
    else if (currentParty === "blink") {
      shared.blinkPlayers[myId] = true;
    }
    else if (currentParty === "blur") {
      shared.blurPlayers[myId] = true;
    }
  }
}

function refreshStreet() {
  if (refreshactive) {
    refreshactive = false;
    setTimeout(() => {
      refreshactive = true;
    }, 2000);
    street.attribute(
      "src",
      `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
    );
  }
}

//make sure their name has a good length
function nameCheck() {
  if (nameType.value().length <= 1 || nameType.value().length >= 15) {
    nameType.value(randomNames[Math.floor(Math.random() * randomNames.length)]);
  }
  saveProgress();
}

//hide all the buttons under the shield and move the hide button
function hideUnderShield() {
  buttonsHidden = !buttonsHidden;

  if (buttonsHidden) {
    hideUnderButton.html("Show");
    showRankButton.style("z-index", "-1");
    showGridButton.style("z-index", "-1");
    DataShowButton.style("z-index", "-1");
    gridModeButton.style("z-index", "-1");
    showSettingsButton.style("z-index", "-1");
    hintButton.style("z-index", "-1");
  }
  else {
    hideUnderButton.html("Hide");
    showRankButton.style("z-index", "2");
    showGridButton.style("z-index", "2");
    DataShowButton.style("z-index", "2");
    gridModeButton.style("z-index", "2");
    showSettingsButton.style("z-index", "2");
    hintButton.style("z-index", "2");
  }
}

//takes all the extra markers off of the map
function clearMap() {
  map.eachLayer(function(layer) {
    if (!(layer instanceof L.TileLayer) && layer !== marker) {
      map.removeLayer(layer);
    }
  });
}

function addPointParty() {
  if (inParty && !waitingLobby) {
    if (currentParty === "normal" && !(myId in shared.normalClickedPositions)) {
      shared.normalClickedPositions[myId] = {
        lat: clickedPoint.lat,
        lng: clickedPoint.lng,
        Pin: currentPin,
        points: partyPoints,
        hintMode: hintMode,
        name: nameType.value()
      };
    }
    else if (currentParty === "blitz" && !(myId in shared.blitzClickedPositions)) {
      shared.blitzClickedPositions[myId] = {
        lat: clickedPoint.lat,
        lng: clickedPoint.lng,
        Pin: currentPin,
        points: partyPoints,
        hintMode: hintMode,
        name: nameType.value()
      };
    }
    else if (currentParty === "NMPZ" && !(myId in shared.NMPZClickedPositions)) {
      shared.NMPZClickedPositions[myId] = {
        lat: clickedPoint.lat,
        lng: clickedPoint.lng,
        Pin: currentPin,
        points: partyPoints,
        hintMode: hintMode,
        name: nameType.value()
      };
    }
    else if (currentParty === "blink" && !(myId in shared.blinkClickedPositions)) {
      shared.blinkClickedPositions[myId] = {
        lat: clickedPoint.lat,
        lng: clickedPoint.lng,
        Pin: currentPin,
        points: partyPoints,
        hintMode: hintMode,
        name: nameType.value()
      };
    }
    else if (currentParty === "blur" && !(myId in shared.blurClickedPositions)) {
      shared.blurClickedPositions[myId] = {
        lat: clickedPoint.lat,
        lng: clickedPoint.lng,
        Pin: currentPin,
        points: partyPoints,
        hintMode: hintMode,
        name: nameType.value()
      };
    }
  }
}

//make sure the answer party pin matches the gamemode
function setPartyAnswerPins() {
  if (currentParty === "normal") {
    currentAnswerIcon = answerIcon;
  }
  else if (currentParty === "blitz") {
    currentAnswerIcon = blitzAnswer;
  }
  else if (currentParty === "NMPZ") {
    currentAnswerIcon = NMPZAnswer;
  }
  else if (currentParty === "blink") {
    currentAnswerIcon = blinkAnswer;
  }
  else if (currentParty === "blur") {
    currentAnswerIcon = blurAnswer;
  }
}

function closeHint() {
  //turn off hint mode
  if (hintMode) {
    toggleHint();
  }
}

function setButtonText() {
  if (setActive) {
    startSetButton.html("Reset Set");
  }
  else {
    startSetButton.html("Start Set");
  }
}

function toggleHint() {
  hintMode = !hintMode;

  if (hintMode) {
    //change to green
    if (!inParty) {
      hintButton.style("background-color", "green");
    }
    else {
      partyHintButton.style("background-color", "green");
    }

    //create the hint circle
    hintcircle = L.circle([0, 0], {
      color: 'rgb(94, 255, 0)',
      opacity: 0.5,
      fillColor: 'rgb(94, 255, 0)',
      fillOpacity: 0.2,
      //lat to meters conversion
      radius: hintRadius * 111139
    }).addTo(map);
  }
  else {
    //make red
    if (!inParty) {
      hintButton.style("background-color", "red");
    }
    else {
      partyHintButton.style("background-color", "red");
    }
    
    hintcircle.remove();
  }

  if (!inParty) {
    mapChange();
  }
}

function resetGridView() {
  //set the grids view
  griddedMap.setView([0, 0], 2);
  currentgrid = "none";

  //make the highlighted square disappear
  if (selectSquare !== undefined) {
    selectSquare.remove();
  }

  //remove all guesses that had been there before
  for (let item of shownPastGuesses) {
    item.remove();
  }
  shownPastGuesses = [];

}

function dataInfo() {
  dataTransScreen.html(
    "Data Transfer" + "<br>" +
    "<br>" +
    "Move data from 2 different devices or browser (Browser -> Browser)" + "<br>" +
    "!!! The device which uploads the data will be reverted to a new account !!!" + "<br>" +
    "!!! receiving account will have data replaced !!!" + "<br>" +
    "!!! NEVER CLOSE WINDOW DURING PROCESS !!!" + "<br>" +
    "<br>" +
    "1: If you are in the account that has the data, choose a code and type it in" + "<br>" +
    "2: Press UPLOAD and if it worked then your code will appear at the bottom" + "<br>" +
    "3: Go onto the device you want to recieve the data, type in the code and press LOAD" + "<br>" +
    "<br>" +
    "<br>" +
    "<br>" +
    `Code: ${transferCode}`
  );
}

//conditions when some buttons need to be disabled
function showButtonLock() {
  nameType.removeAttribute("disabled");
  if (viewing || setActive || inParty) {
    showGridButton.attribute("disabled", "");
    showRankButton.attribute("disabled", "");
    DataShowButton.attribute("disabled", "");
    nameType.attribute("disabled", "");
  }
  else if (dataShow) {
    showGridButton.attribute("disabled", "");
    showRankButton.attribute("disabled", "");
  }
  else if (showingRankInfo) {
    showGridButton.attribute("disabled", "");
    DataShowButton.attribute("disabled", "");
  }
  else if (showGrid) {
    showRankButton.attribute("disabled", "");
    DataShowButton.attribute("disabled", "");
  }
  else {
    showGridButton.removeAttribute("disabled");
    showRankButton.removeAttribute("disabled");
    DataShowButton.removeAttribute("disabled");
  }
}

//change what the label says based on situation
function labelConfigure() {
  if (dataShow || showGrid) {
    Labels.style("z-index", "20");
    Labels.style("opacity", "1");

    if (dataShow) {
      Labels.html("> Load < > Upload < > Code <");
    }
    else if (showGrid) {
      Labels.html("> Stats < > Heat Map < > Value <");
    }
  }
  else {
    Labels.style("z-index", "-1");
    Labels.style("opacity", "0");
  }
}

function dataUpload() {
  //stop if the code is empty or if a code already exists
  if (dataType.value() !== "") {
    if (dataType.value().toLowerCase() in shared.transfers) {
      return;
    }

    shared.transfers[dataType.value().toLowerCase()] = {
      //best sets
      bestSet: bestSet,
      bestBlitz: bestBlitz,
      bestNMPZ: bestNMPZ,
      bestBlink: bestBlink,
      bestBlur: bestBlur,

      //streak values
      gridStreak: gridStreak,
      gridMaxStreak: gridMaxStreak,

      //global stats
      totalGuesses: totalGuesses,
      totalGreen: totalGreen,
      totalPurple: totalPurple,
      totalGold: totalGold,

      //the map grid
      mapGrid: structuredClone(mapGrid)
    };

    transferCode = dataType.value();
    dataType.value("");

    //reset values
    bestSet = 0;
    bestBlitz = 0;
    bestNMPZ = 0;
    bestBlink = 0;

    totalGuesses = 0;
    totalGreen = 0;
    totalPurple = 0;
    totalGold = 0;

    resetGridView();
    //reset the grid
    mapGrid = [];
    saveProgress();
    localStorage.removeItem("savedMap");

    addGrid();
  }
}

function dataLoad() {
  //if the code is found then load the data
  if (dataType.value().toLowerCase() in shared.transfers) {

    //load sets if it the score is higher than your current set
    if (bestSet <= shared.transfers[dataType.value().toLowerCase()].bestSet) {
      bestSet = shared.transfers[dataType.value().toLowerCase()].bestSet;
    }

    if (bestBlitz <= shared.transfers[dataType.value().toLowerCase()].bestBlitz) {
      bestBlitz = shared.transfers[dataType.value().toLowerCase()].bestBlitz;
    }

    if (bestNMPZ <= shared.transfers[dataType.value().toLowerCase()].bestNMPZ) {
      bestNMPZ = shared.transfers[dataType.value().toLowerCase()].bestNMPZ;
    }

    if (bestBlink <= shared.transfers[dataType.value().toLowerCase()].bestBlink) {
      bestBlink = shared.transfers[dataType.value().toLowerCase()].bestBlink;
    }

    if (bestBlur <= shared.transfers[dataType.value().toLowerCase()].bestBlur) {
      bestBlur = shared.transfers[dataType.value().toLowerCase()].bestBlur;
    }

    //load the streak values if they are higher
    if (gridMaxStreak <= shared.transfers[dataType.value().toLowerCase()].gridMaxStreak) {
      gridMaxStreak = shared.transfers[dataType.value().toLowerCase()].gridMaxStreak;
    }

    if (gridStreak <= shared.transfers[dataType.value().toLowerCase()].gridStreak) {
      gridStreak = shared.transfers[dataType.value().toLowerCase()].gridStreak;
    }

    //load total stats
    totalGuesses = shared.transfers[dataType.value().toLowerCase()].totalGuesses;
    totalGreen = shared.transfers[dataType.value().toLowerCase()].totalGreen;
    totalPurple = shared.transfers[dataType.value().toLowerCase()].totalPurple;
    totalGold = shared.transfers[dataType.value().toLowerCase()].totalGold;

    //load the map grid
    mapGrid = shared.transfers[dataType.value().toLowerCase()].mapGrid;

    delete shared.transfers[dataType.value().toLowerCase()];

    dataType.value("");

    saveProgress();
  }
}

function ShowDataScreen() {
  if (!dataShow) {
    dataTransScreen.style("z-index", "20");
    dataTransScreen.style("opacity", "1");

    uploadData.style("z-index", "20");
    uploadData.style("opacity", "1");

    loadData.style("z-index", "20");
    loadData.style("opacity", "1");

    dataType.style("z-index", "20");
    dataType.style("opacity", "1");

    dataShow = true;
  }
  else {
    closeData();
  }
}

function gridTextChange() {
//update the text of each grid and player total stats
  if (showGridDropDown.value() === "grid") {
    if (currentgrid && currentgrid !== "none") {

      let displayDis = "none";

      //change the distance to text form
      if (currentgrid.averageDistance >= 1000) {
        displayDis = round(currentgrid.averageDistance / 1000).toLocaleString() + "km";
      }
      else if (currentgrid.answerAmount === 0) {
        displayDis = "none";
      }
      else {
        displayDis = round(currentgrid.averageDistance).toLocaleString() + "m";
      }

      showGridScreen.html(
        "Grid Stats" + "<br>" +
      "Been Answer: " + currentgrid.answerAmount + "<br>" +
      "Correct: " + currentgrid.correctAmount + "<br>" +
      "Missed: " + currentgrid.wrongAmount + "<br>" +

      "Guessed: " + currentgrid.guessedAmount + "<br>" +
      "Avg Distance: " + displayDis + "<br>" +
      "Correct %: " + currentgrid.correctPercent
      );
    }
    else {
      showGridScreen.html(
        "No Grid Selected"
      );
    }
  }

  //show total stats
  else {

    //convert to percentages
    let missPercent = round((totalGuesses - (totalGreen + totalPurple + totalGold)) / totalGuesses * 100);
    let greenPercent = round(totalGreen / totalGuesses * 100);
    let purplePercent = round(totalPurple / totalGuesses * 100);
    let goldPercent = round(totalGold / totalGuesses * 100);


    showGridScreen.html(
      "Total Stats" + "<br>" +
    "Guesses: " + totalGuesses + "<br>" +
    "Rank: " + rank + "<br>" +
    "1000km +: " + missPercent + "%" + "<br>" +
    "1000km - 250km: " + greenPercent + "%" + "<br>" +
    "250km - 50km: " + purplePercent + "%" + "<br>" +
    "50km - 0km: " + goldPercent + "%"
    );
  }
}

//changes the color of the banner based on the conditions
//wil be red when time is running low and matches color of the answer line
function bannerColChange() {
  if (timeLeft >= 0 && timeLeft < timeAfterFirstGuess && !endScreen && (setActive || inParty)) {
    banner.style("background", "rgb(206, 29, 29)");
  }
  else if (endScreen) {
    banner.style("background", currentBannerColor);
  }
  else {
    banner.style("background", "rgb(154, 255, 120)");
  }
}

//make sure that the map is open during parties and closed during viewing mode
function lockMap() {
  if (lockedIn || viewing || waitingLobby) {
    hideMapButton.attribute("disabled", "");
  }
  else {
    hideMapButton.removeAttribute("disabled");
  }
}

//show and hide the start party button
function togglePartyButton() {
  if (waitingLobby) {
    startPartyButton.style("z-index", "25");
    partyHintButton.style("z-index", "25");
  }
  else {
    startPartyButton.style("z-index", "-1");
    partyHintButton.style("z-index", "-1");
  }
}

//display the other players markers in the same party
function displayOthers() {
  if (inParty && !waitingLobby && endScreen) {
    //goes through each saved location and places them on the map

    //for normal mode
    if (setTypeDropDown.value() === "normal" && shared.normalRound === "over" && !pinsShown) {
      pinsShown = true;
      showAllMarks(shared.normalClickedPositions, shared.normalMap);
    }

    //for blitz mode
    else if (setTypeDropDown.value() === "blitz" && shared.blitzRound === "over" && !pinsShown) {
      pinsShown = true;
      showAllMarks(shared.blitzClickedPositions, shared.blitzMap);
    }

    //for NMPZ mode
    else if (setTypeDropDown.value() === "NMPZ" && shared.NMPZRound === "over" && !pinsShown) {
      pinsShown = true;
      showAllMarks(shared.NMPZClickedPositions, shared.NMPZMap);
    }

    //for blink mode
    else if (setTypeDropDown.value() === "blink" && shared.blinkRound === "over" && !pinsShown) {
      pinsShown = true;
      showAllMarks(shared.blinkClickedPositions, shared.blinkMap);
    }

    //for blur mode
    else if (setTypeDropDown.value() === "blur" && shared.blurRound === "over" && !pinsShown) {
      pinsShown = true;
      showAllMarks(shared.blurClickedPositions, shared.blurMap);
    }
  }
}

//shows all the other players markers
function showAllMarks(marks, mapcoords) {

  //clear all markers
  for (let item of displayMarkers) {
    map.removeLayer(item);
  }
  displayMarkers = [];

  //go through each marker and show it with stats
  for (let info of Object.values(marks)) {

    //calculate distance so that line color can be changed
    let point1 = L.latLng(mapcoords.lat, mapcoords.lng);
    let point2 = L.latLng(info.lat, info.lng);

    let distance = point1.distanceTo(point2);

    //calculate points to add to the display
    let addPoints = Math.round(5000 * Math.exp(-10 * distance / worldMapSize));

    if (addPoints > highestGuess) {
      highestGuess = addPoints;
    }

    let lineCol = "black";
    if (distance <= ultraDis) {
      lineCol = "orange";
    }
    else if (distance <= superDis) {
      lineCol = "purple";
    }
    else if (distance <= correctDis) {
      lineCol = "green";
    }
    else if (distance >= wrongDis) {
      lineCol = "red";
    }

    //used to show the marks of other players
    let muiltIcon = L.icon({
      iconUrl: info.Pin,

      iconSize: [40, 40],
      iconAnchor: [20, 37],
    });

    let muiltMarker = L.marker([info.lat, info.lng], {icon: muiltIcon}).addTo(map);
    let muiltAnswerLine = L.polyline(
      [[info.lat, info.lng], [mapcoords.lat, mapcoords.lng]],
      {
        color: lineCol,
        opacity: 0.7
      }
    ).addTo(map);

    displayMarkers.push(muiltMarker);
    displayMarkers.push(muiltAnswerLine);

    let HintCol = "red";
    let hintText = "Off";
    if (info.hintMode) {
      hintText = "On";
      HintCol = "green";
    }

    //this part displays how well that player did
    muiltMarker.bindPopup(`
      <b>${info.name}</b><br>
      Total Points: ${info.points + addPoints}<br>
      <div style="color: ${lineCol};">Distance: ${round(distance / 1000).toLocaleString()}km</div>
      <div style="color: ${HintCol};">Hint Mode: ${hintText}</div>
      `, {

      offset: [0, -32],
      autoClose: false,
      closeOnClick: false,
      className: "muiltPopup"
    }).openPopup();
  }

  if (highestGuess >= 4800) {
    show48K();
  }
  else if (highestGuess >= 4000) {
    show4K();
  }
}

//will kick everyone out of a party when all rounds are up and reset local varibales
function checkPartyEnded() {
  if (inParty && !waitingLobby) {

    //normal mode
    if (currentParty === "normal" && shared.normalPartyEnded) {
      resetLocals();
      delete shared.normalPlayers[myId];
      mapChange();
    }

    //blitz mode
    else if (currentParty === "blitz" && shared.blitzPartyEnded) {
      resetLocals();
      delete shared.blitzPlayers[myId];
      mapChange();
    }

    //NMPZ mode
    else if (currentParty === "NMPZ" && shared.NMPZPartyEnded) {
      resetLocals();
      delete shared.NMPZPlayers[myId];
      mapChange();
    }

    //blink mode
    else if (currentParty === "blink" && shared.blinkPartyEnded) {
      resetLocals();
      delete shared.blinkPlayers[myId];
      mapChange();
    }

    //blur mode
    else if (currentParty === "blur" && shared.blurPartyEnded) {
      resetLocals();
      delete shared.blurPlayers[myId];
      mapChange();
    }
  }
}

//repetitive code
function resetLocals() {
  //local resets

  pinsShown = false;
  partyPoints = 0;
  currentAnswerIcon = answerIcon;
  currentParty = "none";
  hintMode = false;
  partyHintButton.style("background-color", "red");
  cover.html("");
  ended = false;
  joinIn = false;
  inParty = false;
  currentParty = "none";
  setActive = false;
  waitingLobby = false;
  lobbyJoined = false;
  lockedIn = false;
  endScreen = false;
  covering = false;
  timeLeft = 0;
  preChangeClickedLength = 0;

  for (let item of displayMarkers) {
    item.remove();
  }
  displayMarkers = [];

  resetMapSize();


  mapID.size(mapOriginalWidth, mapOriginalHeight);
  map.invalidateSize();
  map.setView([0, 0], 1);

  marker.setLatLng([0, 0]);
  clickedPoint = { lat: 0, lng: 0 };

  clearMap();
}

// if someone has guessed then change everyone's time
function partyTimeChange() {
  if (inParty) {
    //normal mode
    if (currentParty === "normal" && shared.normalGuessed) {
      if (timeLeft > timeAfterFirstGuess) {
        timeLeft = timeAfterFirstGuess;
        time = millis();
      }
    }
    //blitz mode
    else if (currentParty === "blitz" && shared.blitzGuessed) {
      if (timeLeft > timeAfterFirstGuess) {
        timeLeft = timeAfterFirstGuess;
        time = millis();
      }
    }
    //NMPZ mode
    else if (currentParty === "NMPZ" && shared.NMPZGuessed) {
      if (timeLeft > timeAfterFirstGuess) {
        timeLeft = timeAfterFirstGuess;
        time = millis();
      }
    }
    //blink mode
    else if (currentParty === "blink" && shared.blinkGuessed) {
      if (timeLeft > timeAfterFirstGuess) {
        timeLeft = timeAfterFirstGuess;
        time = millis();
      }
    }
    //blur mode
    else if (currentParty === "blur" && shared.blurGuessed) {
      if (timeLeft > timeAfterFirstGuess) {
        timeLeft = timeAfterFirstGuess;
        time = millis();
      }
    }
  }
}

//force everyone in party to leave endscreen
function forceLeaveEnd() {
  if (inParty && endScreen) {

    //normal mode
    if (currentParty === "normal" && shared.normalRound === "ongoing") {
      confirmed();
    }

    //blitz mode
    else if (currentParty === "blitz" && shared.blitzRound === "ongoing") {
      confirmed();
    }

    //NMPZ mode
    else if (currentParty === "NMPZ" && shared.NMPZRound === "ongoing") {
      confirmed();
    }

    //blink mode
    else if (currentParty === "blink" && shared.blinkRound === "ongoing") {
      confirmed();
    }

    //blur mode
    else if (currentParty === "blur" && shared.blurRound === "ongoing") {
      confirmed();
    }
  }
}

//at the start will choose a map for each party
function setPartyMap() {
  if (shared.normalMap === "none") {
    shared.normalMap = random(currentLocations);
    shared.normalRoundNumber = 1;
  }

  if (shared.blitzMap === "none") {
    shared.blitzMap = random(currentLocations);
    shared.blitzRoundNumber = 1;
  }

  if (shared.NMPZMap === "none") {
    shared.NMPZMap = random(currentLocations);
    shared.NMPZRoundNumber = 1;
  }

  if (shared.blinkMap === "none") {
    shared.blinkMap = random(currentLocations);
    shared.blinkRoundNumber = 1;
  }

  if (shared.blurMap === "none") {
    shared.blurMap = random(currentLocations);
    shared.blurRoundNumber = 1;
  }
}

//disables the button to start a party if it is ongoing
function lockStartParty() {
  //normal
  if (setTypeDropDown.value() === "normal" && (shared.normalStarted || Object.keys(shared.normalPlayers).length === 1)) {
    startPartyButton.attribute("disabled", "");
  }

  //blitz
  else if (setTypeDropDown.value() === "blitz" && (shared.blitzStarted || Object.keys(shared.blitzPlayers).length === 1)) {
    startPartyButton.attribute("disabled", "");
  }

  //NMPZ
  else if (setTypeDropDown.value() === "NMPZ" && (shared.NMPZStarted || Object.keys(shared.NMPZPlayers).length === 1)) {
    startPartyButton.attribute("disabled", "");
  }

  //blink
  else if (setTypeDropDown.value() === "blink" && (shared.blinkStarted || Object.keys(shared.blinkPlayers).length === 1)) {
    startPartyButton.attribute("disabled", "");
  }

  //blur
  else if (setTypeDropDown.value() === "blur" && (shared.blurStarted || Object.keys(shared.blurPlayers).length === 1)) {
    startPartyButton.attribute("disabled", "");
  }

  //disable the button
  else {
    startPartyButton.removeAttribute("disabled");
  }
}

//this runs when players first press join party
//will send them to the waiting lobby of the chosen party

//also leaves the party if currently in party
//leaves set if currently in set
function joinWait() {

  //leave the set
  if (setActive) {
    setActive = false;
    curretnRoundNumber = 1;
    totalSetPoints = 0;
    setLocations = [];
    setClickedPoints = [];
    setLineColors = [];
    covering = false;
    redCover.style("opacity", "0");

    //configure sounds when the player leaves a set
    if (timeShort) {
      timeShort = false;
      newSong();
    }
    intenseMusic.stop();
    timeShort = false;

    mapChange();
  }

  //join a party waiting room
  else if (!inParty) {

    closeHint();

    //close the map
    if (mapShowing) {
      hideMap();
    }

    ended = false;
    joinIn = false;

    inParty = true;
    waitingLobby = true;
    covering = true;

    if (setTypeDropDown.value() === "normal") {
      if (Object.keys(shared.normalPlayers).length === 0) {
        shared.normalClickedPositions = {};

        shared.normalGuessed = false;
        shared.normalRoundNumber = 1;
        shared.normalStarted = false;
        shared.normalPartyEnded = true;
      }
      shared.normalPlayers[myId] = true;
      currentParty = "normal";
    }
    else if (setTypeDropDown.value() === "blitz") {
      if (Object.keys(shared.blitzPlayers).length === 0) {
        shared.blitzClickedPositions = {};

        shared.blitzGuessed = false;
        shared.blitzRoundNumber = 1;
        shared.blitzStarted = false;
        shared.blitzPartyEnded = true;
      }
      shared.blitzPlayers[myId] = true;
      currentParty = "blitz";
    }
    else if (setTypeDropDown.value() === "NMPZ") {
      if (Object.keys(shared.NMPZPlayers).length === 0) {
        shared.NMPZClickedPositions = {};

        shared.NMPZGuessed = false;
        shared.NMPZRoundNumber = 1;
        shared.NMPZStarted = false;
        shared.NMPZPartyEnded = true;
      }
      shared.NMPZPlayers[myId] = true;
      currentParty = "NMPZ";
    }
    else if (setTypeDropDown.value() === "blink") {
      if (Object.keys(shared.blinkPlayers).length === 0) {
        shared.blinkClickedPositions = {};

        shared.blinkGuessed = false;
        shared.blinkRoundNumber = 1;
        shared.blinkStarted = false;
        shared.blinkPartyEnded = true;
      }
      shared.blinkPlayers[myId] = true;
      currentParty = "blink";
    }
    else if (setTypeDropDown.value() === "blur") {
      if (Object.keys(shared.blurPlayers).length === 0) {
        shared.blurClickedPositions = {};

        shared.blurGuessed = false;
        shared.blurRoundNumber = 1;
        shared.blurStarted = false;
        shared.blurPartyEnded = true;
      }
      shared.blurPlayers[myId] = true;
      currentParty = "blur";
    }
  }

  //make them leave the current party
  else {
    //configure sounds when the player leaves a party
    if (timeShort) {
      newSong();
    }
    intenseMusic.stop();
    timeShort = false;

    resetLocals();
    removePlayerFromLists();
    mapChange();
  }
}

//runs when the start party button is pressed and will lead to all players in the waiting lobby to join
function joiningCheck() {

  if (setTypeDropDown.value() === "normal") {
    shared.normalRound = "ongoing";
    shared.normalStarted = true;
  }
  else if (setTypeDropDown.value() === "blitz") {
    shared.blitzRound = "ongoing";
    shared.blitzStarted = true;
  }
  else if (setTypeDropDown.value() === "NMPZ") {
    shared.NMPZRound = "ongoing";
    shared.NMPZStarted = true;
  }
  else if (setTypeDropDown.value() === "blink") {
    shared.blinkRound = "ongoing";
    shared.blinkStarted = true;
  }
  else if (setTypeDropDown.value() === "blur") {
    shared.blurRound = "ongoing";
    shared.blurStarted = true;
  }
}

//checks if the conditions are met and places the player into a party
function joinParty() {

  //if it is green then it means that it is active or easy
  //red means not active or difficult
  let lightGreen = "rgb(114, 245, 81)";
  let lightRed = "rgb(255, 101, 101)";
  let lightOrange = "rgb(238, 199, 69)";

  let playerCol = lightRed;


  if (!lobbyJoined && inParty) {
    //normal mode
    if (setTypeDropDown.value() === "normal") {

      if (Object.keys(shared.normalPlayers).length >= 2) {
        playerCol = lightGreen;
      }

      if (shared.normalStarted) {
        cover.html(`
          waiting... <br>
          <br>
          Players: ${Object.keys(shared.normalPlayers).length}<br>
          Round: ${shared.normalRoundNumber}<br>
          Guess: ${shared.normalRound}
          `);
      }
      else {
        cover.html(`
          Normal Mode <br>
          <div style="color: ${lightGreen};">Difficulty: 3/10</div>
          <br>
          <div style="color: ${playerCol};">Players: ${Object.keys(shared.normalPlayers).length}</div>
        `);
      }

      //just a check to make the player stay in the lobby until the next round starts
      if (shared.normalRound === "over") {
        ended = true;
      }

      if (ended && shared.normalRound === "ongoing") {
        joinIn = true;
      }

      //let the first player to start the round
      if (!shared.normalStarted) {
        ended = true;
        joinIn = true;
      }

      //this is what happens when they join the part
      if (shared.normalStarted && currentParty === "normal" && joinIn) {

        partyJoin();
  
        setPartyMap();
        if (shared.normalPartyEnded) {
          shared.normalPartyEnded = false;
          timeLeft = 0;
        }
  
        //set variables
        lobbyJoined = true;
        waitingLobby = false;
        covering = false;

        partyChange(shared.normalMap, "normal");
      }
    }

    //blitz mode
    else if (setTypeDropDown.value() === "blitz") {

      if (Object.keys(shared.blitzPlayers).length >= 2) {
        playerCol = lightGreen;
      }

      if (shared.blitzStarted) {
        cover.html(`
          waiting... <br>
          <br>
          Players: ${Object.keys(shared.blitzPlayers).length}<br>
          Round: ${shared.blitzRoundNumber}<br>
          Guess: ${shared.blitzRound}
        `);
      }
      else {
        cover.html(`
          Blitz Mode <br>
          <div style="color: ${lightOrange};">Difficulty: 5/10</div>
          <br>
          <div style="color: ${playerCol};">Players: ${Object.keys(shared.blitzPlayers).length}</div>
        `);
      }

      //just a check to make the player stay in the lobby until the next round starts
      if (shared.blitzRound === "over") {
        ended = true;
      }

      if (ended && shared.blitzRound === "ongoing") {
        joinIn = true;
      }

      //let the first player to start the round
      if (!shared.blitzStarted) {
        ended = true;
        joinIn = true;
      }

      //this is what happens when they join the part
      if (shared.blitzStarted && currentParty === "blitz" && joinIn) {

        partyJoin();
  
        setPartyMap();
        if (shared.blitzPartyEnded) {
          shared.blitzPartyEnded = false;
          timeLeft = 0;
        }
        
        //set variables
        lobbyJoined = true;
        waitingLobby = false;
        covering = false;

        partyChange(shared.blitzMap, "blitz");
      }
    }

    //NMPZ mode
    else if (setTypeDropDown.value() === "NMPZ") {

      if (Object.keys(shared.NMPZPlayers).length >= 2) {
        playerCol = lightGreen;
      }

      if (shared.NMPZStarted) {
        cover.html(`
          waiting... <br>
          <br>
          Players: ${Object.keys(shared.NMPZPlayers).length}<br>
          Round: ${shared.NMPZRoundNumber}<br>
          Guess: ${shared.NMPZRound}
        `);
      }
      else {
        cover.html(`
          NMPZ Mode <br>
          <div style="color: ${lightOrange};">Difficulty: 7/10</div>
          <br>
          <div style="color: ${playerCol};">Players: ${Object.keys(shared.NMPZPlayers).length}</div>
        `);
      }

      //just a check to make the player stay in the lobby until the next round starts
      if (shared.NMPZRound === "over") {
        ended = true;
      }

      if (ended && shared.NMPZRound === "ongoing") {
        joinIn = true;
      }

      //let the first player to start the round
      if (!shared.NMPZStarted) {
        ended = true;
        joinIn = true;
      }

      //this is what happens when they join the part
      if (shared.NMPZStarted && currentParty === "NMPZ" && joinIn) {

        partyJoin();
  
        setPartyMap();
        if (shared.NMPZPartyEnded) {
          shared.NMPZPartyEnded = false;
          timeLeft = 0;
        }
        
        //set variables
        lobbyJoined = true;
        waitingLobby = false;
        covering = false;

        partyChange(shared.NMPZMap, "NMPZ");
      }
    }

    //blink mode
    else if (setTypeDropDown.value() === "blink") {

      if (Object.keys(shared.blinkPlayers).length >= 2) {
        playerCol = lightGreen;
      }

      if (shared.blinkStarted) {
        cover.html(`
          waiting... <br>
          <br>
          Players: ${Object.keys(shared.blinkPlayers).length}<br>
          Round: ${shared.blinkRoundNumber}<br>
          Guess: ${shared.blinkRound}
        `);
      }
      else {
        cover.html(`
          Blink Mode <br>
          <div style="color: ${lightRed};">Difficulty: 8/10</div>
          <br>
          <div style="color: ${playerCol};">Players: ${Object.keys(shared.blinkPlayers).length}</div>
        `);
      }

      //just a check to make the player stay in the lobby until the next round starts
      if (shared.blinkRound === "over") {
        ended = true;
      }

      if (ended && shared.blinkRound === "ongoing") {
        joinIn = true;
      }

      //let the first player to start the round
      if (!shared.blinkStarted) {
        ended = true;
        joinIn = true;
      }

      //this is what happens when they join the part
      if (shared.blinkStarted && currentParty === "blink" && joinIn) {

        partyJoin();
  
        setPartyMap();
        if (shared.blinkPartyEnded) {
          shared.blinkPartyEnded = false;
          timeLeft = 0;
        }
  
        //set variables
        lobbyJoined = true;
        waitingLobby = false;
        covering = false;

        partyChange(shared.blinkMap, "blink");
      }
    }

    //blur mode
    else if (setTypeDropDown.value() === "blur") {

      if (Object.keys(shared.blurPlayers).length >= 2) {
        playerCol = lightGreen;
      }

      if (shared.blurStarted) {
        cover.html(`
          waiting... <br>
          <br>
          Players: ${Object.keys(shared.blurPlayers).length}<br>
          Round: ${shared.blurRoundNumber}<br>
          Guess: ${shared.blurRound}
        `);
      }
      else {
        cover.html(`
          Blur Mode <br>
          <div style="color: ${lightRed};">Difficulty: 9/10</div>
          <br>
          <div style="color: ${playerCol};">Players: ${Object.keys(shared.blurPlayers).length}</div>
        `);
      }

      //just a check to make the player stay in the lobby until the next round starts
      if (shared.blurRound === "over") {
        ended = true;
      }

      if (ended && shared.blurRound === "ongoing") {
        joinIn = true;
      }

      //let the first player to start the round
      if (!shared.blurStarted) {
        ended = true;
        joinIn = true;
      }

      //this is what happens when they join the part
      if (shared.blurStarted && currentParty === "blur" && joinIn) {

        partyJoin();
        closeHint();
  
        setPartyMap();
        if (shared.blurPartyEnded) {
          shared.blurPartyEnded = false;
          timeLeft = 0;
        }
  
        //set variables
        lobbyJoined = true;
        waitingLobby = false;
        covering = false;

        partyChange(shared.blurMap, "blur");
      }
    }
  }
}

//repetitive code
function partyJoin() {
  //reset the 2 variables
  ended = false;
  joinIn = false;

  //make sure the map is opened
  if (!mapShowing) {
    hideMap();
  }
}

//generates a new place for the party street view
function partyChange(place, type) {
  newlat = place.lat;
  newlng = place.lng;
  
  street.attribute(
    "src",
    `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
  );

  //add the basic time if it hasn't already been added
  if (type === "normal") {
    timeLeft = shared.normalTimeMax;
  }
  else if (type === "blitz") {
    timeLeft = shared.blitzTimeMax;
  }
  else if (type === "NMPZ") {
    timeLeft = shared.NMPZTimeMax;
  }
  else if (type === "blink") {
    timeLeft = shared.blinkTimeMax;

    //blink might not be working
    runBlink();
  }
  else if (type === "blur") {
    timeLeft = shared.blurTimeMax;
  }

  marker.setLatLng([0, 0]);
  clickedPoint = {
    lat: 0,
    lng: 0,
  };

  //if hint mode is on then show the hint
  if (hintMode) {
    //this keeps the guess inside of the circle as it generates an angle in radians
    //and then finds how much of each lat and lng have to be shifted
    let angle = Math.random() * Math.PI * 2;
    let distance = Math.sqrt(Math.random()) * hintRadius;

    let randHintLat = newlat + Math.cos(angle) * distance;
    let randHintLng = newlng + Math.sin(angle) * distance;

    hintcircle.setLatLng([randHintLat, randHintLng]);
  }
}

//I wanted the player to not be able to join parties or sets or change the dropdown value when they are in either one
function lockStartJoin() {
  if (inParty || setActive || endScreen || viewing || gridMode) {
    setTypeDropDown.attribute("disabled", "");
    hintButton.attribute("disabled", "");
    gridModeButton.attribute("disabled", "");

    if (gridMode) {
      gridModeButton.removeAttribute("disabled");
    }

    //keep the reset option open while a set is active
    if (!setActive || endScreen) {
      startSetButton.attribute("disabled", "");
      joinButton.attribute("disabled", "");
    }
    else if (setActive && !endScreen) {
      startSetButton.removeAttribute("disabled");
      joinButton.removeAttribute("disabled");
    }

    if (!setActive) {
      //keep the reset option open while a set is active
      if (!inParty || endScreen) {
        joinButton.attribute("disabled", "");
      }
      else if (inParty && !endScreen) {
        joinButton.removeAttribute("disabled");
      }
    }
  }
  else {
    joinButton.removeAttribute("disabled");
    startSetButton.removeAttribute("disabled");
    setTypeDropDown.removeAttribute("disabled");
    hintButton.removeAttribute("disabled");
    gridModeButton.removeAttribute("disabled");
  }
}


//this changes the ranks based on how the players best scores are
function rankModify() {
  if (bestSet >= 22500 && bestBlitz >= 21500 && bestNMPZ >= 21000 && bestBlink >= 20000 && bestBlur >= 15000 && gridMaxStreak >= 50) {
    rank = "Inter-Dimensional";
    currentPin = interP;
    currentShield = interS;

    nextBestSet = "22500";
    nextBestBlitz = "21500";
    nextBestNMPZ = "21000";
    nextBestBlink = "20000";
    nextBestBlur = "15000";
    nextMaxStreak = "50";
  }
  else if (bestSet >= 20000 && bestBlitz >= 19000 && bestNMPZ >= 18000 && bestBlink >= 17000 && bestBlur >= 10000 && gridMaxStreak >= 25) {
    rank = "Slime";
    currentPin = slimeP;
    currentShield = slimeS;

    nextBestSet = "22500";
    nextBestBlitz = "21500";
    nextBestNMPZ = "21000";
    nextBestBlink = "20000";
    nextBestBlur = "15000";
    nextMaxStreak = "50";
  }
  else if (bestSet >= 17500 && bestBlitz >= 15000 && bestNMPZ >= 12500 && gridMaxStreak >= 10) {
    rank = "Obsidian";
    currentPin = obsidianP;
    currentShield = obsidianS;

    nextBestSet = "20000";
    nextBestBlitz = "19000";
    nextBestNMPZ = "18000";
    nextBestBlink = "17000";
    nextBestBlur = "10000";
    nextMaxStreak = "25";
  }
  else if (bestSet >= 12500 && bestBlitz >= 10000 && bestNMPZ >= 7500 && gridMaxStreak >= 5) {
    rank = "Diamond";
    currentPin = diamondP;
    currentShield = diamondS;

    nextBestSet = "17500";
    nextBestBlitz = "15000";
    nextBestNMPZ = "12500";
    nextBestBlink = "0";
    nextBestBlur = "0";
    nextMaxStreak = "10";
  }
  else if (bestSet >= 7500 && bestBlitz >= 5000 && gridMaxStreak >= 1) {
    rank = "Gold";
    currentPin = goldP;
    currentShield = goldS;

    nextBestSet = "12500";
    nextBestBlitz = "10000";
    nextBestNMPZ = "7500";
    nextBestBlink = "0";
    nextBestBlur = "0";
    nextMaxStreak = "5";
  }
  else if (bestSet >= 5000) {
    rank = "Silver";
    currentPin = silverP;
    currentShield = silverS;

    nextBestSet = "7500";
    nextBestBlitz = "5000";
    nextBestNMPZ = "0";
    nextBestBlink = "0";
    nextBestBlur = "0";
    nextMaxStreak = "1";
  }
  else if (bestSet >= 2500) {
    rank = "Bronze";
    currentPin = bronzeP;
    currentShield = bronzeS;

    nextBestSet = "5000";
    nextBestBlitz = "0";
    nextBestNMPZ = "0";
    nextBestBlink = "0";
    nextBestBlur = "0";
    nextMaxStreak = "0";
  }
  else {
    rank = "Coal";

    currentPin = coalP;
    currentShield = coalS;
  }

  //change the color of each line depending on if they met the req
  let normCol = "red";
  let blitzCol = "red";
  let NMPZCol = "red";
  let blinkCol = "red";
  let blurCol = "red";

  let gridMaxCol = "red";

  if (bestSet >= nextBestSet) {
    normCol = "green";
  }
  if (bestBlitz >= nextBestBlitz) {
    blitzCol = "green";
  }
  if (bestNMPZ >= nextBestNMPZ) {
    NMPZCol = "green";
  }
  if (bestBlink >= nextBestBlink) {
    blinkCol = "green";
  }
  if (bestBlur >= nextBestBlur) {
    blurCol = "green";
  }
  if (gridMaxStreak >= nextMaxStreak) {
    gridMaxCol = "green";
  }

  //change rank info screen so they know the req
  showRankScreen.html(
    `<span style="font-size:${windowWidth / 30}px;">Requirements</span><br>` +
    `<span style="color:black;"></span><br>` +

    `<span style="color:${normCol};">${"Normal: " + bestSet + "/" + nextBestSet}</span><br>` +
    `<span style="color:${blitzCol};">${"Blitz: " + bestBlitz + "/" + nextBestBlitz}</span><br>` +
    `<span style="color:${NMPZCol};">${"NMPZ: " + bestNMPZ + "/" + nextBestNMPZ}</span><br>` +
    `<span style="color:${blinkCol};">${"Blink: " + bestBlink + "/" + nextBestBlink}</span><br>` +
    `<span style="color:${blurCol};">${"Blur: " + bestBlur + "/" + nextBestBlur}</span><br>` + 
    `<span style="color:${gridMaxCol};">${"Grid Streak: " + gridMaxStreak + "/" + nextMaxStreak}</span>`
  );


  //used for the skin of you rown icon
  markerIcon = L.icon({
    iconUrl: currentPin,

    iconSize: [40, 40],
    iconAnchor: [20, 37],
  });

  marker.setIcon(markerIcon);

  rankIcon.attribute("src", currentShield);
}

//this is used to hide and how the cover
function covertoggle() {
  if (covering) {
    cover.style("z-index", "1");
  }
  else {
    cover.style("z-index", "-1");
  }
}


//runs a countdown then uncovers for visible time and then covers again
//for the blink gamemode
function blinkToggle() {
  if (blink) {
    if (Date.now() - blinkTime > 100) {
      blinkTime = Date.now();
      blinkCountdown -= decreaseAmount;

      //show text in 2 decimal places
      cover.html((blinkCountdown - visibleTime + decreaseAmount).toFixed(1));
      if (blinkCountdown < visibleTime) {
        covering = false;
        cover.html("");
        if (blinkCountdown < 0) {
          blink = false;
          covering = true;
        }
      }
    }
  }
}


//converts each location into a lat and lng and a country although my game developed to not even use the country part
function addmap(map, country) {
  for (let location of map) {
    currentLocations.push(
      {
        lat: location[0],
        lng: location[1],
        cnt: country,
      }
    );
  }
}

let xButOffset = 15;

function fixsizes() {
  zoomCoords = {
    top: windowHeight - 61,
    bottom: 27,
    left: windowWidth - 52,
    right: 17
  };

  autoMapCloseButton.position(windowWidth / 2, windowHeight / 2);

  //move the close button based on what is openned
  if (showingRankInfo) {
    XButton.style("z-index", "25");
    XButton.position(windowWidth / 4 - xButOffset, windowHeight / 2 - windowWidth / 8 - xButOffset);
  }
  else if (dataShow || showGrid || showingSettings) {
    XButton.style("z-index", "25");
    XButton.position(windowWidth / 6.5 - xButOffset, windowHeight / 2.25 - windowWidth / 8 - xButOffset);
  }
  else {
    XButton.style("z-index", "-1");
  }

  street.size(windowWidth, windowHeight);

  optxwidth = (windowWidth + windowHeight) / optxwidthDivisor;

  banner.position(0, 0);
  banner.size(windowWidth, bannerHeight);

  cover.size(windowWidth, windowHeight);
  cover.position(0,0);

  blurCover.size(windowWidth, windowHeight);
  blurCover.position(0,0);

  NMPZCover.size(windowWidth, zoomCoords.top);
  NMPZCover.position(0,0);

  NMPZCoverB.size(windowWidth, zoomCoords.bottom);
  NMPZCoverB.position(0, windowHeight - zoomCoords.bottom);

  NMPZCoverL.size(windowWidth - 52, windowHeight);
  NMPZCoverL.position(0, 0);

  NMPZCoverR.size(zoomCoords.right, windowHeight);
  NMPZCoverR.position(windowWidth - zoomCoords.right, 0);

  let imageRef = windowHeight;
  if (windowHeight >= windowWidth) {
    imageRef = windowWidth;
  }
  imageRef = imageRef - imageRef * 0.2;

  fourK.style("opacity", `${fourKOpac}`);
  fourK.size(imageRef * fourKMuilt, imageRef * fourKMuilt);
  fourK.position(windowWidth / 2, windowHeight / 1.9);

  fourHalfK.style("opacity", `${fourHalfKOpac}`);
  fourHalfK.size(imageRef * fourHalfKMuilt, imageRef * fourHalfKMuilt);
  fourHalfK.position(windowWidth / 2, windowHeight / 1.9);

  plus5.style("opacity", `${plus5Opac}`);
  plus5.size(imageRef * plus5Muilt, imageRef * plus5Muilt);
  plus5.position(windowWidth / 2, windowHeight / 1.9);

  plus10.style("opacity", `${plus10Opac}`);
  plus10.size(imageRef * plus10Muilt, imageRef * plus10Muilt);
  plus10.position(windowWidth / 2, windowHeight / 1.9);

  //create a mask hole infront of the compass during blur mode
  let holeX = windowWidth - 34;
  let holeY = windowHeight - 161;
  let holeRadius = 24;

  //cut a hole in blur mode so that they can see the compass
  blurCover.style("mask-image", `radial-gradient(circle ${holeRadius}px at ${holeX}px ${holeY}px, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 1}px)`);
  blurCover.style("-webkit-mask-image", `radial-gradient(circle ${holeRadius}px at ${holeX}px ${holeY}px, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 1}px)`);
  blurCover.style("mask-repeat", "no-repeat");
  blurCover.style("-webkit-mask-repeat", "no-repeat");

  textsize = (windowWidth + windowHeight) / textSizeScreenDividor;
  banner.style("font-size", `${textsize}px`);


  startSetButton.position(10, 10);
  joinButton.position(90, 10);

  setTypeDropDown.position(10, 40);

  rankIcon.position(10, bannerHeight + 10);

  nameType.size(72, 20);

  let underShieldX = 9;

  //buttons under the shield
  nameType.position(underShieldX, bannerHeight + shieldSize + 5);
  showRankButton.position(underShieldX, bannerHeight + shieldSize + 35);
  showGridButton.position(underShieldX, bannerHeight + shieldSize + 60);
  DataShowButton.position(underShieldX, bannerHeight + shieldSize + 85);
  gridModeButton.position(underShieldX, bannerHeight + shieldSize + 110);
  hintButton.position(underShieldX, bannerHeight + shieldSize + 135);
  showSettingsButton.position(underShieldX, bannerHeight + shieldSize + 160);

  if (buttonsHidden) {
    hideUnderButton.position(underShieldX, bannerHeight + shieldSize + 35);
  }
  else {
    hideUnderButton.position(underShieldX, bannerHeight + shieldSize + 185);
  }

  //change sizes of the rank info in relation to the screensizes
  showRankScreen.size(windowWidth / 2, windowWidth / 3.75);
  showRankScreen.position(windowWidth / 4, windowHeight / 2 - windowWidth / 8);
  showRankScreen.style("font-size", windowWidth / 40 + "px");
  showRankScreen.style("padding-left", windowWidth / 40 + "px");
  showRankScreen.style("padding-top", windowWidth / 50 + "px");

  showGridScreen.size(windowWidth / 1.5, windowWidth / 3.25);
  showGridScreen.position(windowWidth / 6.5, windowHeight / 2.25 - windowWidth / 8);
  showGridScreen.style("font-size", windowWidth / 69 + "px");
  showGridScreen.style("padding-left", windowWidth / 40 + "px");
  showGridScreen.style("padding-top", windowWidth / 60 + "px");
  showGridDropDown.position(175, 30);
  gridShapeDropdown.position(175, 30);
  heatMapDropDown.position(255, 30);

  redCover.size(windowWidth, windowHeight - bannerHeight);


  if (dataShow || showGrid) {
    heatMapType.position(335, 30);
    Labels.position(175, 10);
    dataType.position(335, 30);

    uploadData.position(255, 30);
    loadData.position(175, 30);
  }
  else {
    heatMapType.position(0, 30);
    Labels.position(0, 10);
    dataType.position(0, 30);

    uploadData.position(0, 30);
    loadData.position(0, 30);
  }

  let gridMapH = windowWidth / 3.2;
  let gridmapW = windowWidth / 2.25;

  gridMapID.position(windowWidth / 1.19 - gridmapW, windowHeight / 2.17 - windowWidth / 8);
  gridMapID.size(gridmapW, gridMapH);

  dataTransScreen.size(windowWidth / 1.5, windowWidth / 3.25);
  dataTransScreen.position(windowWidth / 6.5, windowHeight / 2.25 - windowWidth / 8);
  dataTransScreen.style("font-size", windowWidth / 69 + "px");
  dataTransScreen.style("padding-left", windowWidth / 40 + "px");
  dataTransScreen.style("padding-top", windowWidth / 60 + "px");

  settingsScreen.size(windowWidth / 1.5, windowWidth / 3.25);
  settingsScreen.position(windowWidth / 6.5, windowHeight / 2.25 - windowWidth / 8);
  settingsScreen.style("font-size", windowWidth / 69 + "px");
  settingsScreen.style("padding-left", windowWidth / 40 + "px");
  settingsScreen.style("padding-top", windowWidth / 60 + "px");

  griddedMap.invalidateSize();

  let showRankPosY = windowHeight / 2 - windowWidth / 8;

  //change the sizes of the rank displays
  allPinsDisplay.position(windowWidth / 1.95, windowHeight / 1.97);
  allPinsDisplay.size(windowWidth / 4, windowWidth / 6);

  allShieldsDisplay.position(windowWidth / 1.95, showRankPosY + windowHeight / 100);
  allShieldsDisplay.size(windowWidth / 4, windowWidth / 6);

  //always have start party button and the hint button in the middle of the screen
  startPartyButton.position(windowWidth / 2 - 40, windowHeight / 1.2);
  partyHintButton.position(windowWidth / 2 - 40, windowHeight / 1.2 + 50);
  
}

//shows the grids
function displayGrid() {
  if (!showGrid) {
    showGridScreen.style("z-index", "20");
    showGridScreen.style("opacity", "1");
    gridMapID.show();
    showGridDropDown.style("z-index", "21");
    showGridDropDown.style("opacity", "1");
    heatMapDropDown.style("z-index", "21");
    heatMapDropDown.style("opacity", "1");
    heatMapType.style("z-index", "21");
    heatMapType.style("opacity", "1");
    showGrid = true;
  }
  else {
    closegrid();
  }
}

function closegrid() {
  resetGridView();
  showGridScreen.style("z-index", "-1");
  showGridScreen.style("opacity", "0");
  gridMapID.hide();
  showGridDropDown.style("z-index", "-1");
  showGridDropDown.style("opacity", "0");
  heatMapDropDown.style("z-index", "-1");
  heatMapDropDown.style("opacity", "0");
  heatMapType.style("z-index", "-1");
  heatMapType.style("opacity", "0");
  showGrid = false;
}

//shows the info for rank up
function showRank() {
  if (!showingRankInfo) {
    showRankScreen.style("z-index", "20");
    showRankScreen.style("opacity", "1");

    allPinsDisplay.style("z-index", "21");
    allPinsDisplay.style("opacity", "1");

    allShieldsDisplay.style("z-index", "21");
    allShieldsDisplay.style("opacity", "1");
    showingRankInfo = true;
  }
  else {
    closeRank();
  }
}

function closeRank() {
  showRankScreen.style("z-index", "-1");
  showRankScreen.style("opacity", "0");

  allPinsDisplay.style("z-index", "-1");
  allPinsDisplay.style("opacity", "0");

  allShieldsDisplay.style("z-index", "-1");
  allShieldsDisplay.style("opacity", "0");

  showingRankInfo = false;
}

//changes what the banner at the top says
function bannerTextChange() {
  if (gridMode) {
    banner.html("Streak: " + gridStreak + " | Max: " + gridMaxStreak);
  }
  else if (!endScreen) {
    if (setActive) {
      banner.html("Round: " + curretnRoundNumber + "/" + maxRounds + " | Time Left: " + timeLeft);
    }
    else if (gridMode) {
      banner.html("Streak: " + gridStreak + " | Max: " + gridMaxStreak);
    }
    else if (inParty) {

      //change text for normal mode
      if (setTypeDropDown.value() === "normal") {
        banner.html("Round: " + shared.normalRoundNumber + "/" + maxPartyRoundNumber + " | Time Left: " + timeLeft);
      }

      //change text for blitz mode
      else if (setTypeDropDown.value() === "blitz") {
        banner.html("Round: " + shared.blitzRoundNumber + "/" + maxPartyRoundNumber + " | Time Left: " + timeLeft);
      }

      //change text for NMPZ mode
      else if (setTypeDropDown.value() === "NMPZ") {
        banner.html("Round: " + shared.NMPZRoundNumber + "/" + maxPartyRoundNumber + " | Time Left: " + timeLeft);
      }

      //change text for blink mode
      else if (setTypeDropDown.value() === "blink") {
        banner.html("Round: " + shared.blinkRoundNumber + "/" + maxPartyRoundNumber + " | Time Left: " + timeLeft);
      }

      //change text for blur mode
      else if (setTypeDropDown.value() === "blur") {
        banner.html("Round: " + shared.blurRoundNumber + "/" + maxPartyRoundNumber + " | Time Left: " + timeLeft);
      }
    }
    else if (viewing) {
      banner.html("Viewing Mode");
    }
    else {
      banner.html(`Players Online: ${Object.keys(shared.players).length}`);
    }
  }
  else if (onLastSetGuess) {
    banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + displayPoints + " | Round Overall: " + totalSetPoints);
  }
  else {
    banner.html("Distance: " + round(displayAmount).toLocaleString() + measurement + " | Points: " + displayPoints);
  }
}

//makes the time go down during a party or a set
function timeDrain() {
  if (!endScreen && !waitingLobby) {
    if ((setActive || inParty) && timeLeft >= 0 && Date.now() - time > 1000) {
      time = Date.now();
      if (timeLeft === timeAfterFirstGuess) {
        timeShort = true;
        stopAllMusic();

        timeWarning.play();
        intenseMusic.play();

        //show the red cover
        redCover.style("opacity", "1");
      }
      timeLeft -= 1;
    }

    //ran out of time
    if (timeLeft < 0) {
      timeLeft = 0;

      //if time ends and you are in a party
      //be forced to confirm the guess and set the state
      if (inParty) {

        //normal
        if (currentParty === "normal" && shared.normalRound === "ongoing") {
          shared.normalRound = "over";
        }
        //blitz
        else if (currentParty === "blitz" && shared.blitzRound === "ongoing") {
          shared.blitzRound = "over";
        }
        //NMPZ
        else if (currentParty === "NMPZ" && shared.NMPZRound === "ongoing") {
          shared.NMPZRound = "over";
        }
        //blink
        else if (currentParty === "blink" && shared.blinkRound === "ongoing") {
          shared.blinkRound = "over";
        }
        //blur
        else if (currentParty === "blur" && shared.blurRound === "ongoing") {
          shared.blurRound = "over";
        }

        //force map open
        if (!mapShowing) {
          hideMap();
        }

        confirmed();
      }

      else {
        //hide screen after timeout
        covering = true;
      }
    }
  }
}

//starts a set
function startSet() {

  //this runs to start a set
  if (!setActive) {
    setActive = true;
    curretnRoundNumber = 1;

    //do not allow hint mode on NMPZ, Blitz, or Blink
    if (hintMode && (setTypeDropDown.value() === "blitz" || setTypeDropDown.value() === "NMPZ" || setTypeDropDown.value() === "blink")) {
      toggleHint();
    }
    mapChange();
  }

  //this runs when you need to reset a set
  else {
    curretnRoundNumber = 1;
    totalSetPoints = 0;
    setLocations = [];
    setMarkers = [];
    setClickedPoints = [];
    setLineColors = [];
    mapChange();
  }
}

//space bar
function keyPressed() {
  if (key === " ") {
    confirmed();
  }
  // if (key === "h") {
  //   crAns();
  // }
}


function hideMap() {
  if (mapShowing === true) {
    mapID.hide();
    mapShowing = false;
  }
  else {
    mapID.show();
    mapShowing = true;
    map.invalidateSize();
  }
}

function nextmap() {
  if (switching) {

    if (!viewing) {
      randomlocation = random(currentLocations);
      newlat = randomlocation.lat;
      newlng = randomlocation.lng;
      if (hintMode) {

        //this keeps the guess inside of the circle as it generates an angle in radians
        //and then finds how much of each lat and lng have to be shifted
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.sqrt(Math.random()) * hintRadius;

        let randHintLat = randomlocation.lat + Math.cos(angle) * distance;
        let randHintLng = randomlocation.lng + Math.sin(angle) * distance;

        hintcircle.setLatLng([randHintLat, randHintLng]);
      }
    }
    
    street.attribute(
      "src",
      `https://www.google.com/maps?q=&layer=c&cbll=${newlat},${newlng}&cbp=11,0,0,0,0&output=svembed`
    );

    //change the condition based on the type of guess that they had while viewing
    if (viewingNMPZ) {
      NMPZCover.style("z-index", "1");
      NMPZCoverB.style("z-index", "1");
      NMPZCoverL.style("z-index", "1");
      NMPZCoverR.style("z-index", "1");
    }
    switching = false;
  }
}

//put all the maps from the locations script into a table
function setupMap() {
  currentLocations = [];
  for (let country of allCountries) {
    addmap(country[1], country[0]);
  }
}

//this handles submitting guesses and leaving the end screen after a guess
//also displaying all the marks and setting values
function confirmed() {
  //exit the viewing mode
  if (viewing) {
    viewing = false;

    //reset all the conditions that were set
    NMPZCover.style("z-index", "-1");
    NMPZCoverB.style("z-index", "-1");
    NMPZCoverL.style("z-index", "-1");
    NMPZCoverR.style("z-index", "-1");
    covering = false;
    blurCover.style("z-index", "-1");
    blink = false;

    mapID.show();
    mapChange();
    return;
  }

  if (mapShowing && !waitingLobby) {
    //if you are in a party
    if (inParty) {
      if (!endScreen) {
        if (allowConf) {

          //normal mode
          if (currentParty === "normal") {
            //if in normal party and round is ongoing
            if (shared.normalRound === "ongoing" && timeLeft >= 0) {

              //make the marks show for other players when you put in a guess
              if (!lockedIn) {
                shared.normalClickedPositions[myId] = {
                  lat: clickedPoint.lat,
                  lng: clickedPoint.lng,
                  Pin: currentPin,
                  points: partyPoints,
                  hintMode: hintMode,
                  name: nameType.value()
                };

                //after the player has guessed in a party then set their id to false
                shared.normalPlayers[myId] = false;
              }

              //if someone has guessed then trigger the time limit

              //normal
              if (shared.normalGuessed === false && timeLeft > timeAfterFirstGuess) {
                shared.normalGuessed = true;
              }
              lockedIn = true;
            }
            //going into the end of a normal party round
            else {
  
              lockedIn = true;
  
              //set party variables
              shared.normalRound = "over";
              shared.normalMapChanged = false;
  
              afterGuess();
            }
          }


          //blitz mode
          else if (currentParty === "blitz") {
            //if in blitz party and round is ongoing
            if (shared.blitzRound === "ongoing" && timeLeft >= 0) {

              //make the marks show for other players when you put in a guess
              if (!lockedIn) {
                shared.blitzClickedPositions[myId] = {
                  lat: clickedPoint.lat,
                  lng: clickedPoint.lng,
                  Pin: currentPin,
                  points: partyPoints,
                  hintMode: hintMode,
                  name: nameType.value()
                };

                shared.blitzPlayers[myId] = false;
              }

              //if someone has guessed then trigger the time limit

              //blitz
              if (shared.blitzGuessed === false && timeLeft > timeAfterFirstGuess) {
                shared.blitzGuessed = true;
              }
              lockedIn = true;
            }
            //going into the end of a party round
            else {
  
              lockedIn = true;
  
              //set party variables
              shared.blitzMapChanged = false;
              shared.blitzRound = "over";
  
              afterGuess();
            }
          }

          //NMPZ mode
          else if (currentParty === "NMPZ") {
            //if in NMPZ party and round is ongoing
            if (shared.NMPZRound === "ongoing" && timeLeft >= 0) {

              //make the marks show for other players when you put in a guess
              if (!lockedIn) {
                shared.NMPZClickedPositions[myId] = {
                  lat: clickedPoint.lat,
                  lng: clickedPoint.lng,
                  Pin: currentPin,
                  points: partyPoints,
                  hintMode: hintMode,
                  name: nameType.value()
                };

                shared.NMPZPlayers[myId] = false;
              }

              //if someone has guessed then trigger the time limit

              //NMPZ
              if (shared.NMPZGuessed === false && timeLeft > timeAfterFirstGuess) {
                shared.NMPZGuessed = true;
              }
              lockedIn = true;
            }
            //going into the end of a party round
            else {
  
              lockedIn = true;
  
              //set party variables
              shared.NMPZMapChanged = false;
              shared.NMPZRound = "over";
  
              afterGuess();
            }
          }

          //blink mode
          else if (currentParty === "blink") {
            //if in blink party and round is ongoing
            if (shared.blinkRound === "ongoing" && timeLeft >= 0) {

              //make the marks show for other players when you put in a guess
              if (!lockedIn) {
                shared.blinkClickedPositions[myId] = {
                  lat: clickedPoint.lat,
                  lng: clickedPoint.lng,
                  Pin: currentPin,
                  points: partyPoints,
                  hintMode: hintMode,
                  name: nameType.value()
                };

                shared.blinkPlayers[myId] = false;
              }

              //if someone has guessed then trigger the time limit

              //blink
              if (shared.blinkGuessed === false && timeLeft > timeAfterFirstGuess) {
                shared.blinkGuessed = true;
              }
              lockedIn = true;
            }
            //going into the end of a party round
            else {
  
              lockedIn = true;
  
              //set party variables
              shared.blinkMapChanged = false;
              shared.blinkRound = "over";
  
              afterGuess();
            }
          }

          //blur mode
          else if (currentParty === "blur") {
            //if in blur party and round is ongoing
            if (shared.blurRound === "ongoing" && timeLeft >= 0) {

              //make the marks show for other players when you put in a guess
              if (!lockedIn) {
                shared.blurClickedPositions[myId] = {
                  lat: clickedPoint.lat,
                  lng: clickedPoint.lng,
                  Pin: currentPin,
                  points: partyPoints,
                  hintMode: hintMode,
                  name: nameType.value()
                };

                shared.blurPlayers[myId] = false;
              }

              //if someone has guessed then trigger the time limit

              //blur
              if (shared.blurGuessed === false && timeLeft > timeAfterFirstGuess) {
                shared.blurGuessed = true;
              }
              lockedIn = true;
            }
            //going into the end of a party round
            else {
  
              lockedIn = true;
  
              //set party variables
              shared.blurMapChanged = false;
              shared.blurRound = "over";
  
              afterGuess();
            }
          }
        }
      }
      //escape the end screen when inside of a party
      else {
        if (endScreen === true && allowGuess) {
          for (let item of displayMarkers) {
            item.remove();
          }
          preChangeClickedLength = 0;
          displayMarkers = [];
          lockedIn = false;
          
          //normal mode

          if (currentParty === "normal") {
            shared.normalClickedPositions = {};

            if (!shared.normalMapChanged) {
              shared.normalMapChanged = true;
              shared.normalMap = random(currentLocations);
              shared.normalRoundNumber += 1;
            }

            //end the party
            if (shared.normalRoundNumber > maxPartyRoundNumber) {
              shared.normalGuessed = false;
              shared.normalRoundNumber = 1;
              shared.normalStarted = false;
              shared.normalPartyEnded = true;
            }
            else {
              shared.normalGuessed = false;
              shared.normalRound = "ongoing";
              partyChange(shared.normalMap, "normal");
            }
          }

          //blitz mode

          else if (currentParty === "blitz") {
            shared.blitzClickedPositions = {};

            if (!shared.blitzMapChanged) {
              shared.blitzMapChanged = true;
              shared.blitzMap = random(currentLocations);
              shared.blitzRoundNumber += 1;
            }

            //end the party
            if (shared.blitzRoundNumber > maxPartyRoundNumber) {
              shared.blitzGuessed = false;
              shared.blitzRoundNumber = 1;
              shared.blitzStarted = false;
              shared.blitzPartyEnded = true;
            }
            else {
              shared.blitzGuessed = false;
              shared.blitzRound = "ongoing";
              partyChange(shared.blitzMap, "blitz");
            }
          }

          //NMPZ mode

          else if (currentParty === "NMPZ") {
            shared.NMPZClickedPositions = {};

            if (!shared.NMPZMapChanged) {
              shared.NMPZMapChanged = true;
              shared.NMPZMap = random(currentLocations);
              shared.NMPZRoundNumber += 1;
            }

            //end the party
            if (shared.NMPZRoundNumber > maxPartyRoundNumber) {
              shared.NMPZGuessed = false;
              shared.NMPZRoundNumber = 1;
              shared.NMPZStarted = false;
              shared.NMPZPartyEnded = true;
            }
            else {
              shared.NMPZGuessed = false;
              shared.NMPZRound = "ongoing";
              partyChange(shared.NMPZMap, "NMPZ");
            }
          }

          //blink mode

          else if (currentParty === "blink") {
            shared.blinkClickedPositions = {};

            if (!shared.blinkMapChanged) {
              shared.blinkMapChanged = true;
              shared.blinkMap = random(currentLocations);
              shared.blinkRoundNumber += 1;
            }

            //end the party
            if (shared.blinkRoundNumber > maxPartyRoundNumber) {
              shared.blinkGuessed = false;
              shared.blinkRoundNumber = 1;
              shared.blinkStarted = false;
              shared.blinkPartyEnded = true;
            }
            else {
              shared.blinkGuessed = false;
              shared.blinkRound = "ongoing";
              partyChange(shared.blinkMap, "blink");
            }
          }

          //blur mode

          else if (currentParty === "blur") {
            shared.blurClickedPositions = {};

            if (!shared.blurMapChanged) {
              shared.blurMapChanged = true;
              shared.blurMap = random(currentLocations);
              shared.blurRoundNumber += 1;
            }

            //end the party
            if (shared.blurRoundNumber > maxPartyRoundNumber) {
              shared.blurGuessed = false;
              shared.blurRoundNumber = 1;
              shared.blurStarted = false;
              shared.blurPartyEnded = true;
            }
            else {
              shared.blurGuessed = false;
              shared.blurRound = "ongoing";
              partyChange(shared.blurMap, "blur");
            }
          }

          pinsShown = false;
          leaveMap();
        }
      }
    }

    //what normally runs when you are not in a party
    else {
      if (!endScreen) {
        if (allowConf) {
          afterGuess();
        }
      }
      else if (endScreen === true && allowGuess) {
        mapChange();
        leaveMap();
      }
    }
  }
}

//makes you leave the endscreen and removes markers also reverts map back
function leaveMap() {

  //make so that they cannot spam rounds
  allowConf = false;
  setTimeout(() => {
    allowConf = true;
  }, 1500);

  if (onLastSetGuess) {
    onLastSetGuess = false;
    totalSetPoints = 0;
  }

  endScreen = false;

  for (let item of displayMarkers) {
    item.remove();
  }
  displayMarkers = [];
  preChangeClickedLength = 0;


  answermarker.remove();
  if (!gridMode) {
    answerLine.remove();
  }
  
  map.setView([0, 0], 1);

  //change map size back to original
  enlarged = false;
  resetMapSize();
  mapID.size(mapOriginalWidth, mapOriginalHeight);
  map.invalidateSize();
  map.setView([0, 0], 1);

  for (let item of setMarkers) {
    item.remove();
  }

  for (let item of gridModeSquares) {
    item.remove();
  }

  if (gridMode) {
    resetSelect();
  }

  if (mapClose) {
    hideMap();
  }
}


//runs after the player has guessed
function afterGuess() {
  endScreen = true;

  if (displayAns !== undefined) {
    displayAns.remove();
  }

  //hide red cover
  redCover.style("opacity", "0");

  //configure sounds when the guess has ended
  if (timeShort) {
    newSong();
  }
  intenseMusic.stop();
  timeShort = false;
  
  
  highestGuess = 0;

  //fill screen with map
  mapID.style("bottom", "0px");
  mapID.style("right", "0px");
  mapID.size(windowWidth, windowHeight - bannerHeight);
  map.invalidateSize();

  currentAnswerIcon = answerIcon;

  if (inParty) {
    setPartyAnswerPins();
  }

  currentBannerColor = "rgb(177, 255, 151)";

  //make so that they cannot spam rounds
  allowGuess = false;
  setTimeout(() => {
    allowGuess = true;
  }, 2000);

  covering = false;
  calcLocation = randomlocation;

  //run if the grid mode is off
  if (!gridMode) {
    //determine location for calculations
    if (!inParty) {
      calcLocation = randomlocation;
    }

    //sets the calculation to the party they are in
    else {
      if (currentParty === "normal") {
        calcLocation = shared.normalMap;
      }
      else if (currentParty === "blitz") {
        calcLocation = shared.blitzMap;
      }
      else if (currentParty === "NMPZ") {
        calcLocation = shared.NMPZMap;
      }
      else if (currentParty === "blink") {
        calcLocation = shared.blinkMap;
      }
      else if (currentParty === "blur") {
        calcLocation = shared.blurMap;
      }
    }
  
    //find meters
    
    let point1 = L.latLng(calcLocation.lat, calcLocation.lng);
    let point2 = L.latLng(clickedPoint.lat, clickedPoint.lng);
  
    totalDistance = point1.distanceTo(point2);
  
    //add stats
    totalGuesses += 1;
  
    //determine which color stat to add
    if (totalDistance <= ultraDis) {
      totalGold += 1;
    }
    else if (totalDistance <= superDis) {
      totalPurple += 1;
    }
    else if (totalDistance <= correctDis) {
      totalGreen += 1;
    }
  
    //add grid stats
    addGridStats(clickedPoint, calcLocation, totalDistance);

    //do the heat calculations
    findHeatValues();
  
    //if hintmode is on then make it harder to earn points by shrinking the map size
    let mapSize = worldMapSize;
    if (hintMode && !inParty) {
      mapSize = worldMapSize * hintDiv;
    }
  
    //exponential points
    //got this equation from geoguessr
    points = Math.round(5000 * Math.exp(-10 * totalDistance / mapSize));

    if (points >= 4000) {
      goodGuessSound.play();
    }
    if (points >= 1000) {
      numberRacking.play();
    }
    else {
      terribleGuess.play();
    }

    //show the animation after a good guess
    if (points >= 4800) {
      show48K();
    }
    else if (points >= 4000) {
      show4K();
    }


    if (inParty) {
      partyPoints += points;
    }

    incrementDisplayPoints();
  
    //set distance text
    measurement = "m";
    displayAmount = totalDistance;
    if (totalDistance > 1000) {
      measurement = "km";
      displayAmount = displayAmount / 1000;
    }
  
    //if this is during a set
    if (setActive) {

      //have the right answer pin depending on game mode
      if (setTypeDropDown.value() === "blitz") {
        currentAnswerIcon = blitzAnswer;
      }
      else if (setTypeDropDown.value() === "NMPZ") {
        currentAnswerIcon = NMPZAnswer;
      }
      else if (setTypeDropDown.value() === "blink") {
        currentAnswerIcon = blinkAnswer;
      }
      else if (setTypeDropDown.value() === "blur") {
        currentAnswerIcon = blurAnswer;
      }


      //add points
      totalSetPoints += points;

      if (curretnRoundNumber < maxRounds) {
        curretnRoundNumber += 1;
        setLocations.push([calcLocation.lat, calcLocation.lng]);
        setClickedPoints.push([clickedPoint.lat, clickedPoint.lng]);
  
        //save line colors
        let lineCol = "black";
        if (totalDistance <= ultraDis) {
          lineCol = "orange";
          currentBannerColor = bannerOrange;
        }
        else if (totalDistance <= superDis) {
          lineCol = "purple";
          currentBannerColor = bannerPurple;
        }
        else if (totalDistance <= correctDis) {
          lineCol = "green";
          currentBannerColor = bannerGreen;
        }
        else if (totalDistance >= wrongDis) {
          lineCol = "red";
          currentBannerColor = bannerRed;
        }
  
        setLineColors.push(lineCol);
      }

      //end set and reset all variables
      else {
        onLastSetGuess = true;

        //show the previous guesses, the idea is that the final guess will be shown normally so all 5 guesses will be shown
        for (i = 0; i < maxRounds - 1; i++) {
          let setAnswerMarker = L.marker([setLocations[i][0], setLocations[i][1]], {icon: currentAnswerIcon}).addTo(map);
          let setClickedMarker = L.marker([setClickedPoints[i][0], setClickedPoints[i][1]], {icon: markerIcon}).addTo(map);
          let setAnswerLine = L.polyline([[setLocations[i][0], setLocations[i][1]],[setClickedPoints[i][0], setClickedPoints[i][1]]], {
            color: setLineColors[i],
            opacity: 0.7
          }).addTo(map);
  
          setMarkers.push(setAnswerMarker);
          setMarkers.push(setClickedMarker);
          setMarkers.push(setAnswerLine);
        }
        
        if (setTypeDropDown.value() === "normal") {
          if (bestSet < totalSetPoints) {
            bestSet = totalSetPoints;
          }
        }
        else if (setTypeDropDown.value() === "blitz") {
          if (bestBlitz < totalSetPoints) {
            bestBlitz = totalSetPoints;
          }
        }
        else if (setTypeDropDown.value() === "NMPZ") {
          if (bestNMPZ < totalSetPoints) {
            bestNMPZ = totalSetPoints;
          }
        }
        else if (setTypeDropDown.value() === "blink") {
          if (bestBlink < totalSetPoints) {
            bestBlink = totalSetPoints;
          }
        }
        else if (setTypeDropDown.value() === "blur") {
          if (bestBlur < totalSetPoints) {
            bestBlur = totalSetPoints;
          }
        }
  
        setActive = false;
        curretnRoundNumber = 1;
        setLocations = [];
        setClickedPoints = [];
        setLineColors = [];
      }
    }
  
    //set line colors
    let lineCol = "black";
    if (totalDistance <= ultraDis) {
      lineCol = "orange";
      currentBannerColor = bannerOrange;
    }
    else if (totalDistance <= superDis) {
      lineCol = "purple";
      currentBannerColor = bannerPurple;
    }
    else if (totalDistance <= correctDis) {
      lineCol = "green";
      currentBannerColor = bannerGreen;
    }
    else if (totalDistance >= wrongDis) {
      lineCol = "red";
      currentBannerColor = bannerRed;
    }
  
    //show a line from the clicked point to the answer
    answerLine = L.polyline([[calcLocation.lat, calcLocation.lng],[clickedPoint.lat, clickedPoint.lng]], {
      color: lineCol,
      opacity: 0.7
    }).addTo(map);
  
    adjustAfterGuess();
  }

  answermarker = L.marker([calcLocation.lat, calcLocation.lng], {icon: currentAnswerIcon}).addTo(map);

  //show user the answer in street view on another window
  answermarker.on("click", function () {
    if (!inParty) {
      afterViewing = true;
      window.open(`https://www.google.com/maps?q=&layer=c&cbll=${calcLocation.lat},${calcLocation.lng}&cbp=11,0,0,0,0&output=svembed`, '_blank');
    }
  });

  if (gridMode) {
    gridModeSquareColChange();
  }
}

function adjustAfterGuess() {
  //set the bounds to both the points as 2 corners
  let bounds = L.latLngBounds(
    [calcLocation.lat, calcLocation.lng],
    [clickedPoint.lat, clickedPoint.lng]
  );
  
  //leaflit feautre to make the map fit 2 coordinates 
  map.fitBounds(bounds, {padding: [answerPadding, answerPadding]});
}

//prevents the street view from being clicked
function NMPZ() {
  if (setActive && (setTypeDropDown.value() === "NMPZ" || setTypeDropDown.value() === "blink") || inParty && !waitingLobby && (currentParty === "NMPZ" || currentParty === "blink")) {
    NMPZCover.style("z-index", "1");
    NMPZCoverB.style("z-index", "1");
    NMPZCoverL.style("z-index", "1");
    NMPZCoverR.style("z-index", "1");
  }
  else if (!viewing) {
    NMPZCover.style("z-index", "-1");
    NMPZCoverB.style("z-index", "-1");
    NMPZCoverL.style("z-index", "-1");
    NMPZCoverR.style("z-index", "-1");
  }
}


//blur if in blur party or set
function activateBlur() {
  if (setActive && setTypeDropDown.value() === "blur" || inParty && !waitingLobby && currentParty === "blur") {
    blurCover.style("z-index", "1");
  }
  else if (!viewing) {
    blurCover.style("z-index", "-1");
  }
}

function changeMapSize() {
  //make sure they are not on phone
  mapID.mouseOver(() => {
    if (windowWidth + windowHeight > 2000 && !enlarged && !endScreen) {
      mapID.size(newWidth, newHeight);
      map.invalidateSize();
      enlarged = true;
    }
  });

  mapID.mouseOut(() => {
    if (windowWidth + windowHeight > 2000 && enlarged && !endScreen) {
      mapID.size(mapOriginalWidth, mapOriginalHeight);
      map.invalidateSize();
      enlarged = false;
    }
  });
}

function mapChange() {
  switching = true;
  saveProgress();
  marker.setLatLng([0, 0]);
  clickedPoint = {
    lat: 0,
    lng: 0,
  };
  if (setActive) {
    timeLeft = timeRestriction + 1;
    if (setTypeDropDown.value() === "blitz") {
      timeLeft = blitzTime + 1;
    }
  }
  if (setActive && setTypeDropDown.value() === "blink") {
    runBlink();
  }
}

function runBlink() {
  blink = true;

  //have to plus 1 because one second gets removed instantly
  blinkCountdown = blinkMax + visibleTime;
  covering = true;
  cover.html(blinkCountdown);
}


//storage
function saveProgress() {
  //set bests
  localStorage.setItem("BestSet", bestSet);
  localStorage.setItem("BestBlitz", bestBlitz);
  localStorage.setItem("BestNMPZ", bestNMPZ);
  localStorage.setItem("BestBlink", bestBlink);
  localStorage.setItem("BestBlur", bestBlur);

  localStorage.setItem("streak", gridStreak);
  localStorage.setItem("maxstreak", gridMaxStreak);


  //stats
  localStorage.setItem("totalguesses", totalGuesses);
  localStorage.setItem("totalgreen", totalGreen);
  localStorage.setItem("totalpurple", totalPurple);
  localStorage.setItem("totalgold", totalGold);
  localStorage.setItem("savedMap", JSON.stringify(mapGrid));

  //other
  localStorage.setItem("name", nameType.value());
}


//this is what I am making for my grid assignment
//the basic idea is that the map will be divided into many grids to serve many purposes
// - players can see how much the 2d map is stretched (places like Greenland look massive but are not actually)
// - stats will be saved to each grid showing players their best and worst areas
// - has a heat map so that players can see 


//grid system for map
const GRID_LENGTH = 15;
const GRID_MODE_LENGTH = 10;

let cols;
let rows;
let gridOpacity = 0.5;
let gridWeight = 1;
let mapGrid = [];
let gridModeLines = [];
let basicGridInfo = {
  answerAmount: 0,
  correctAmount: 0,
  wrongAmount: 0,

  guessedAmount: 0,
  averageDistance: 0,
  correctPercent: 0,

  pastGuesses: []
};

let currentgrid;
let currentGridX;
let currentGridY;

let selectSquare;
let gridModeSquare;
let gridModeSquares = [];
let shownPastGuesses = [];

let gridModeShape = "3X3";

let HEAT_SQUARE_OPAC = 0.5;
let SELECT_SQUARE_OPAC = 0.7;
let CENTERY = 9;
let CENTERX = 17;

//heat map stats
let greenSquares = [];
let midSquares = [];
let redSquares = [];



//create a new grid if the player does not have one already used for holding info
function addGrid() {
  if (localStorage.getItem("savedMap") === null) {

    //lng
    rows = 360 / GRID_LENGTH;

    //lat
    cols = 180 / GRID_LENGTH;

    for (let c = 0; c < cols; c++) {
      mapGrid.push([]);
      for (let r = 0; r < rows; r++) {
        mapGrid[c].push(structuredClone(basicGridInfo));
      }
    }
  }
  else {
    mapGrid = JSON.parse(localStorage.getItem("savedMap"));
  }

  //create the grid pattern on the map, I mad all values in the for loop positive so it is easier to create the grid
  //latitidue is 180 tall
  for (let lat = 0; lat <= 180; lat += GRID_LENGTH) {
    let gridLine = L.polyline(
      [[lat - 90, -180], [lat - 90, 180]],
      {
        color: "black",
        opacity: gridOpacity,
        weight: gridWeight
      }
    ).addTo(griddedMap);
  }

  //longitude is 360 long
  for (let lng = 0; lng <= 360; lng += GRID_LENGTH) {
    let gridLine = L.polyline(
      [[-90, lng - 180], [90, lng - 180]],
      {
        color: "black",
        opacity: gridOpacity,
        weight: gridWeight
      }
    ).addTo(griddedMap);
  }

  //function to determine the current grid
  function onGridMapClick(e) {
    if (selectSquare !== undefined) {
      selectSquare.remove();
    }

    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    let currentCol = Math.floor((lat + 90) / GRID_LENGTH);
    let currentRow = Math.floor((lng + 180) / GRID_LENGTH);

    currentgrid = mapGrid[currentCol][currentRow];

    //if the player presses outside of the gridded map
    if (currentgrid === undefined) {
      currentgrid = "none";
    }

    //create a select square
    selectSquare = L.polygon([
      [currentCol * GRID_LENGTH - 90, currentRow * GRID_LENGTH - 180],
      [currentCol * GRID_LENGTH - 90, (currentRow + 1) * GRID_LENGTH - 180],
      [(currentCol + 1) * GRID_LENGTH - 90, (currentRow + 1) * GRID_LENGTH - 180],
      [(currentCol + 1) * GRID_LENGTH - 90, currentRow * GRID_LENGTH - 180]
    ], {
      color: "rgb(187, 196, 74)",
      weight: 1,
      opacity: 1,

      fillColor: "yellow",
      fillOpacity: 0.3
    }).addTo(griddedMap);

    //remove all guesses that had been there before
    for (let item of shownPastGuesses) {
      item.remove();
    }
    shownPastGuesses = [];

    //show all guesses that were in that grid
    for (let info of currentgrid.pastGuesses) {
      //display the icon based on the set that was played
      let showIcon = answerIcon;
      if (info.roundType === "blitz") {
        showIcon = blitzAnswer;
      }
      else if (info.roundType === "NMPZ") {
        showIcon = NMPZAnswer;
      }
      else if (info.roundType === "blink") {
        showIcon = blinkAnswer;
      }
      else if (info.roundType === "blur") {
        showIcon = blurAnswer;
      }


      //create all the guesses that have been in the selected grid
      let gridAnswerMark = L.marker([info.answerLat, info.answerLng], {icon: showIcon}).addTo(griddedMap);
      let gridClickedMark = L.marker([info.clickedLat, info.clickedLng], {icon: markerIcon}).addTo(griddedMap);
      let gridAnswerLine = L.polyline([[info.clickedLat, info.clickedLng],[info.answerLat, info.answerLng]], {
        color: info.lineColor,
        opacity: 0.7
      }).addTo(griddedMap);

      //when clicked show the viewer what that location looked like
      //basically entering a replay
      gridAnswerMark.on("click", function () {
        viewing = true;
        resetGridView();

        //apply the NMPZ effect
        if (info.roundType === "NMPZ" || info.roundType === "blink") {
          viewingNMPZ = true;
        }
        else {
          viewingNMPZ = false;
        }

        //apply the blur effect
        if (info.roundType === "blur") {
          blurCover.style("z-index", "1");
        }
        //apply the blink effect
        else if (info.roundType === "blink") {
          runBlink();
        }

        //hide the map grid page
        showGridScreen.style("z-index", "-1");
        showGridScreen.style("opacity", "0");
        gridMapID.hide();
        showGridDropDown.style("z-index", "-1");
        showGridDropDown.style("opacity", "0");
        heatMapDropDown.style("z-index", "-1");
        heatMapDropDown.style("opacity", "0");
        heatMapType.style("z-index", "-1");
        heatMapType.style("opacity", "0");
        Labels.style("z-index", "-1");
        Labels.style("opacity", "0");
        showGrid = false;

        //make sure the player cannot access map
        mapID.hide();
        hideMapButton.attribute("disabled", "");

        //show the previous location
        newlat = info.answerLat;
        newlng = info.answerLng;
        switching = true;

      });

      //place all marks in list for later removal
      shownPastGuesses.push(gridAnswerMark);
      shownPastGuesses.push(gridClickedMark);
      shownPastGuesses.push(gridAnswerLine);
    }
  }

  griddedMap.on("click", onGridMapClick);
}

//sees what grid the player is clicking on the normal map
function gridModeClick(lat, lng) {
  if (!endScreen) {
    for (let item of gridModeSquares) {
      item.remove();
    }

    //set globals
    currentGridY = Math.floor((lat + 90) / GRID_MODE_LENGTH);
    currentGridX = Math.floor((lng + 180) / GRID_MODE_LENGTH);

    create3X3();
  }
}

//called after a guess to upload all the stats to the grid
function addGridStats(clicked, answer, totaldis) {

  //find which grid the answer is in
  let ansLat = answer.lat;
  let ansLng = answer.lng;

  let answerCol = Math.floor((ansLat + 90) / GRID_LENGTH);
  let answerRow = Math.floor((ansLng + 180) / GRID_LENGTH);

  //find whcih grid the guess was in
  let clickLat = clicked.lat;
  let clickLng = clicked.lng;

  let clickedCol = Math.floor((clickLat + 90) / GRID_LENGTH);
  let clickedRow = Math.floor((clickLng + 180) / GRID_LENGTH);

  let type = "none";

  //add the type of guess that they were in
  if (setActive) {
    type = setTypeDropDown.value();
  }

  //add to the amount of times the answer has been in that grid
  mapGrid[answerCol][answerRow].answerAmount += 1;

  //add if the player guessed in the same grid as answer
  if (clickedCol === answerCol && clickedRow === answerRow) {
    mapGrid[answerCol][answerRow].correctAmount += 1;
  }
  //add if player gets wrong
  else {
    mapGrid[answerCol][answerRow].wrongAmount += 1;
  }

  //add to the amount of times the player has guessed this grid
  mapGrid[clickedCol][clickedRow].guessedAmount += 1;

  //find the average distance of all guesses when the answer was this grid
  let guessAmount = mapGrid[answerCol][answerRow].answerAmount;
  if (guessAmount === 1) {
    mapGrid[answerCol][answerRow].averageDistance = totaldis;
  }
  else {
    mapGrid[answerCol][answerRow].averageDistance = ((guessAmount - 1) * mapGrid[answerCol][answerRow].averageDistance + totaldis) / guessAmount;
  }

  //find the percent of getting the grid correct
  mapGrid[answerCol][answerRow].correctPercent = round(mapGrid[answerCol][answerRow].correctAmount / guessAmount * 100);

  //save the guess to the grid

  //find what color the line will be
  let lineCol = "black";
  if (totaldis <= ultraDis) {
    lineCol = "orange";
  }
  else if (totaldis <= superDis) {
    lineCol = "purple";
  }
  else if (totaldis <= correctDis) {
    lineCol = "green";
  }
  else if (totaldis >= wrongDis) {
    lineCol = "red";
  }

  //push all data to the grid
  mapGrid[answerCol][answerRow].pastGuesses.push({
    roundType: type,
    clickedLat: clickLat,
    clickedLng: clickLng,
    answerLat: ansLat,
    answerLng: ansLng,
    lineColor: lineCol
  });

}

//get values for the heat map
function findHeatValues() {
  //remove all squares and reset the array
  for (let item of greenSquares) {
    item.remove();
  }
  greenSquares = [];

  for (let item of midSquares) {
    item.remove();
  }
  midSquares = [];

  for (let item of redSquares) {
    item.remove();
  }
  redSquares = [];
  
  if (heatMapType.value() !== "") {

    //only run if the typed in value contains a number
    if (!Number.isNaN(Number(heatMapType.value()))) {
      //go through each grid
      for (let col = 0; col < mapGrid.length;  col++) {
        for (let row = 0; row < mapGrid[col].length; row++) {
          let checkGrid = mapGrid[col][row];

          //if the "correct" heat map is selected
          if (heatMapDropDown.value() === "correct") {
            //make green squares if the pass req
            if (checkGrid.correctAmount > heatMapType.value()) {
              addGreen(col, row);
            }

            //this is for creating red squares
            else if (checkGrid.correctAmount < heatMapType.value()) {
              addRed(col, row);
            }

            //if the value equals
            else {
              addOrange(col, row);
            }
          }

          //if the "answer" heat map is selected
          else if (heatMapDropDown.value() === "answer") {
            //make green squares if the pass req
            if (checkGrid.answerAmount > heatMapType.value()) {
              addGreen(col, row);
            }
        
            //this is for creating red squares
            else if (checkGrid.answerAmount < heatMapType.value()) {
              addRed(col, row);
            }

            //if the value equals
            else {
              addOrange(col, row);
            }
          }

          //if the "guessed" heat map is selected
          else if (heatMapDropDown.value() === "guessed") {
            //make green squares if the pass req
            if (checkGrid.guessedAmount > heatMapType.value()) {
              addGreen(col, row);
            }

            //this is for creating red squares
            else if (checkGrid.guessedAmount < heatMapType.value()) {
              addRed(col, row);
            }

            //if the value equals
            else {
              addOrange(col, row);
            }
          }

          //if the "percent" heat map is selected
          else if (heatMapDropDown.value() === "percent") {
            //make green squares if the pass req
            if (checkGrid.correctAmount / checkGrid.answerAmount * 100 > heatMapType.value()) {
              addGreen(col, row);
            }

            //this is for creating red squares
            else if (checkGrid.correctAmount / checkGrid.answerAmount * 100 < heatMapType.value() || checkGrid.correctAmount === 0) {
              addRed(col, row);
            }

            //if the value equals
            else {
              addOrange(col, row);
            }
          }

          //if the "distance" heat map is selected
          //dividing the values by 1000 to simulate km
          else if (heatMapDropDown.value() === "distance") {
            //make green squares if it passes the requirement and there has been a guess on the grid
            if (checkGrid.averageDistance / 1000 < heatMapType.value() && checkGrid.answerAmount >= 1) {
              addGreen(col, row);
            }

            //this is for creating red squares
            else if (checkGrid.averageDistance / 1000 > heatMapType.value() || checkGrid.answerAmount === 0) {
              addRed(col, row);
            }

            //if the value equals
            else {
              addOrange(col, row);
            }
          }
        }
      }
    }
  }
}

//create a heat map green square
function addGreen(col, row) {
  //add the heat maps
  rightSquare = L.polygon([
    [col * GRID_LENGTH - 90, row * GRID_LENGTH - 180],
    [col * GRID_LENGTH - 90, (row + 1) * GRID_LENGTH - 180],
    [(col + 1) * GRID_LENGTH - 90, (row + 1) * GRID_LENGTH - 180],
    [(col + 1) * GRID_LENGTH - 90, row * GRID_LENGTH - 180]
  ], 
  {
    color: "rgb(54, 202, 98)",
    weight: 1,
    opacity: 1,

    fillColor: "green",
    fillOpacity: HEAT_SQUARE_OPAC
  }).addTo(griddedMap);

  greenSquares.push(rightSquare);
}

//create a heat map orange square
function addOrange(col, row) {
  //add the heat maps
  midSquare = L.polygon([
    [col * GRID_LENGTH - 90, row * GRID_LENGTH - 180],
    [col * GRID_LENGTH - 90, (row + 1) * GRID_LENGTH - 180],
    [(col + 1) * GRID_LENGTH - 90, (row + 1) * GRID_LENGTH - 180],
    [(col + 1) * GRID_LENGTH - 90, row * GRID_LENGTH - 180]
  ], 
  {
    color: "rgb(189, 151, 80)",
    weight: 1,
    opacity: 1,

    fillColor: "rgb(202, 145, 38)",
    fillOpacity: HEAT_SQUARE_OPAC
  }).addTo(griddedMap);

  midSquares.push(midSquare);
}

//create a heat map red square
function addRed(col, row) {
  //add the heat maps
  wrongSquare = L.polygon([
    [col * GRID_LENGTH - 90, row * GRID_LENGTH - 180],
    [col * GRID_LENGTH - 90, (row + 1) * GRID_LENGTH - 180],
    [(col + 1) * GRID_LENGTH - 90, (row + 1) * GRID_LENGTH - 180],
    [(col + 1) * GRID_LENGTH - 90, row * GRID_LENGTH - 180]
  ], 
  {
    color: "rgb(255, 131, 131)",
    weight: 1,
    opacity: 1,

    fillColor: "rgb(255, 131, 131)",
    fillOpacity: HEAT_SQUARE_OPAC
  }).addTo(griddedMap);

  redSquares.push(wrongSquare);
}

//create the grid for grid mode on the normal map
function enterGridMode() {
  gridMode = !gridMode;

  //run if the grid mode is turned on
  if (gridMode) {
    //turn off hint mode if it is on
    if (hintMode) {
      toggleHint();
    }

    mapChange();
    //create the grid pattern on the map, I mad all values in the for loop positive so it is easier to create the grid
    //latitidue is 180 tall
    for (let lat = 0; lat <= 180; lat += GRID_MODE_LENGTH) {
      let gridModeLine = L.polyline(
        [[lat - 90, -180], [lat - 90, 180]],
        {
          color: "black",
          opacity: gridOpacity,
          weight: gridWeight
        }
      ).addTo(map);
      gridModeLines.push(gridModeLine);
    }

    //longitude is 360 long
    for (let lng = 0; lng <= 360; lng += GRID_MODE_LENGTH) {
      let gridModeLine = L.polyline(
        [[-90, lng - 180], [90, lng - 180]],
        {
          color: "black",
          opacity: gridOpacity,
          weight: gridWeight
        }
      ).addTo(map);
      gridModeLines.push(gridModeLine);
    }

    gridModeButton.style("background-color", "green");

    resetSelect();
  }

  //grid mode is turned off
  else {
    //remove the grid from the map
    for (let item of gridModeSquares) {
      item.remove();
    }
    mapChange();
    for (let item of gridModeLines) {
      item.remove();
    }

    gridModeButton.style("background-color", "red");
  }
}

//change the color of the square after a guess based on how they did
function gridModeSquareColChange() {
  map.setView([randomlocation.lat, randomlocation.lng], 4);

  let answerY = Math.floor((randomlocation.lat + 90) / GRID_MODE_LENGTH);
  let answerX = Math.floor((randomlocation.lng + 180) / GRID_MODE_LENGTH);

  //if the guess is in the middle square
  if (currentGridX === answerX && currentGridY === answerY && gridModeShape !== "spread") {
    for (let item of gridModeSquares) {
      item.setStyle({
        color: "green",
        fillColor: "green"
      });
    }

    //double points if focus mode is enables
    if (gridModeShape === "focus") {
      gridStreak += 10;
      goodGuessSound.play();
      showPlus10();
    }
    else {
      gridStreak += 5;
      goodGuessSound.play();
      showPlus5();
    }

    if (gridStreak > gridMaxStreak) {
      gridMaxStreak = gridStreak;
    }
  }

  //if the guess is in the surrounding squares in the spread shape
  else if (
    (currentGridX - 1 <= answerX && currentGridX + 1 >= answerX && currentGridY - 1 <= answerY && currentGridY + 1 >= answerY 
    || (currentGridX === answerX && currentGridY === answerY + 2
    || currentGridX === answerX && currentGridY === answerY - 2
    || currentGridX === answerX - 2 && currentGridY === answerY
    || currentGridX === answerX + 2 && currentGridY === answerY))
    && gridModeShape === "spread") {

    for (let item of gridModeSquares) {
      item.setStyle({
        color: "orange",
        fillColor: "orange"
      });
    }

    gridStreak += 1;

    if (gridStreak > gridMaxStreak) {
      gridMaxStreak = gridStreak;
    }
    goodGuessSound.play();
  }

  //if the guess is in the surrounding squares for 3 by 3 mode
  else if (currentGridX - 1 <= answerX && currentGridX + 1 >= answerX && currentGridY - 1 <= answerY && currentGridY + 1 >= answerY && gridModeShape === "3X3") {
    for (let item of gridModeSquares) {
      item.setStyle({
        color: "orange",
        fillColor: "orange"
      });
    }


    gridStreak += 1;

    if (gridStreak > gridMaxStreak) {
      gridMaxStreak = gridStreak;
    }
    goodGuessSound.play();
  }


  //if the guess is in the surrounding squares for cross mode
  else if ((currentGridX === answerX && currentGridY - 2 <= answerY && currentGridY + 2 >= answerY || 
    currentGridY === answerY && currentGridX - 2 <= answerX && currentGridX + 2 >= answerX) && gridModeShape === "cross") {
    for (let item of gridModeSquares) {
      item.setStyle({
        color: "orange",
        fillColor: "orange"
      });
    }

    gridStreak += 1;

    if (gridStreak > gridMaxStreak) {
      gridMaxStreak = gridStreak;
    }
    goodGuessSound.play();
  }

  //if the guess was missed
  else {
    terribleGuess.play();
    for (let item of gridModeSquares) {
      item.setStyle({
        color: "red",
        fillColor: "red"
      });
    }

    if (gridStreak > gridMaxStreak) {
      gridMaxStreak = gridStreak;
    }

    gridStreak = 0;
  }
}

//this resets the select square in grid mode
function resetSelect() {

  //move the selected square into the center of the map
  currentGridY = CENTERY;
  currentGridX = CENTERX;

  create3X3();
}


//creates the shapes of the grid guess based on its made
//makes the middle square a darker yellow for most modes
function create3X3() {
  //create surrounding squares
  //make a 3 by 3 pattern
  if (gridModeShape === "3X3" || gridModeShape === "spread") {
    let spreadInc = 1;

    if (gridModeShape === "spread") {
      spreadInc = 2;
    }

    for (let x = -spreadInc; x <= spreadInc; x++) {
      for (let y = -spreadInc; y <= spreadInc; y++) {

        //remove the squares that should not be in the diamond shape
        if (!(y === -2 && x !== 0) && !(y === 2 && x !== 0) && !(y !== 0 && x === -2) && !(y !== 0 && x === 2)) {
          let fillCol = "rgb(249, 255, 158)";
          let fillopac = 0.4;
          if (x === 0 && y === 0 && gridModeShape !== "spread") {
            fillCol = "yellow";
            fillopac = SELECT_SQUARE_OPAC;
          }
    
          let placeY = y;
          let placeX = x;
    
          if (currentGridY + y >= 0 && currentGridY + y < 180 / GRID_MODE_LENGTH) {
            if (currentGridX + x >= 0 && currentGridX + x < 360 / GRID_MODE_LENGTH) {
    
              //create a select square
              let surroundSquare = L.polygon([
                [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180],
                [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
                [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
                [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180]
              ], {
                color: "rgb(184, 181, 52)",
                weight: 1,
                opacity: 1,
            
                fillColor: fillCol,
                fillOpacity: fillopac
              }).addTo(map);
    
              gridModeSquares.push(surroundSquare);
            }
          }
        }
      }
    }
  }

  //make a cross Pattern
  if (gridModeShape === "cross") {
    for (let y = -2; y <= 2; y++) {
      let fillCol = "rgb(249, 255, 158)";
      let fillopac = 0.4;
      if (y === 0) {
        fillCol = "yellow";
        fillopac = SELECT_SQUARE_OPAC;
      }

      let placeY = y;
      let placeX = 0;

      if (currentGridY + y >= 0 && currentGridY + y < 180 / GRID_MODE_LENGTH) {
        //create a select square
        let surroundSquare = L.polygon([
          [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180],
          [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
          [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
          [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180]
        ], {
          color: "rgb(184, 181, 52)",
          weight: 1,
          opacity: 1,
      
          fillColor: fillCol,
          fillOpacity: fillopac
        }).addTo(map);

        gridModeSquares.push(surroundSquare);
      }
    }

    for (let x = -2; x <= 2; x++) {
      let fillCol = "rgb(249, 255, 158)";
      let fillopac = 0.4;
      if (x === 0) {
        fillCol = "yellow";
        fillopac = SELECT_SQUARE_OPAC;
      }
      else {
        let placeY = 0;
        let placeX = x;

        if (currentGridX + x >= 0 && currentGridX + x < 360 / GRID_MODE_LENGTH) {

          //create a select square
          let surroundSquare = L.polygon([
            [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180],
            [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
            [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
            [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180]
          ], {
            color: "rgb(184, 181, 52)",
            weight: 1,
            opacity: 1,
        
            fillColor: fillCol,
            fillOpacity: fillopac
          }).addTo(map);

          gridModeSquares.push(surroundSquare);
        }
      }
    }
  }

  //only create the one square for focus mode
  else if (gridModeShape === "focus") {

    let placeX = 0;
    let placeY = 0;

    let fillCol = "yellow";
    let fillopac = SELECT_SQUARE_OPAC;

    //create a select square
    let surroundSquare = L.polygon([
      [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180],
      [(currentGridY + placeY) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
      [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX + 1) * GRID_MODE_LENGTH - 180],
      [(currentGridY + placeY + 1) * GRID_MODE_LENGTH - 90, (currentGridX + placeX) * GRID_MODE_LENGTH - 180]
    ], {
      color: "rgb(184, 181, 52)",
      weight: 1,
      opacity: 1,
  
      fillColor: fillCol,
      fillOpacity: fillopac
    }).addTo(map);

    gridModeSquares.push(surroundSquare);
  }
}