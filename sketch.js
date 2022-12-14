const heightBuffer = 20;
const widthBuffer = 15;
const sheetUrl =
  "https://script.google.com/macros/s/AKfycbz2pO03671_dETB9HAGQw1QVJaKZ7nxPFjYGHiWk3vRBA4BTy5uvIyuYuUu6HmfCBkh/exec?";

var dObj; // = new Date();

let henkou;

let groupNameField;
let groupName;
let userNameField;
let userName;

var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
var is_recognition_activated = false;

let soundButton = [];
let buttonName = ["ð", "ð­", "ð¡", "ð", "ð»"];

let soundButtonPressedFlag = false;
let mousePressedTime = 0;
let flameCount = 0;
let col = [];
let nowPressedButtonNumber = -1;

//p2pãããã®å¤æ°
var peer,
  thisid,
  conn,
  text,
  send,
  ison = false,
  lasttext = "";

function setup() {
  createCanvas(770, 160);

  col[0] = color(245, 245, 245);
  col[1] = color(70, 130, 180);
  col[2] = color(0, 0, 128);
  col[3] = color(105, 105, 105);

  let connnect;

  myRec.onEnd = endSpeech;

  // éæé³å£°å¥åããã­ã¹ãåããéã«å¼ã³åºãããé¢æ°ãç»é²
  //myRec.onResult = parseResult;

  // é£ç¶ããé³å£°èªè­ã¯è¡ããªãï¼ãã­ã°ã©ã åã§é©æé³å£°èªè­ã®stopã¨startãå¶å¾¡ãã
  myRec.continuous = false; // no continuous recognition

  // èª­ã¿ä¸ãã¦ããæä¸­ã®èªè­éä¸­ã®æå­åãå©ç¨ããå ´å
  myRec.interimResults = false; // allow partial recognition (faster, less accurate)

  // ãã­ã°ã©ã å¶å¾¡ç¨å¤æ°ï¼true: é³å£°èªè­å©ç¨ä¸­ãç¤ºãï¼
  is_recognition_activated = false;

  // èªè­è¨èªã¯æ¥æ¬èª
  myRec.rec.lang = "ja";

  let SpeechRecOnOffButton = createButton("OFF");
  SpeechRecOnOffButton.style("background", "#808080");
  SpeechRecOnOffButton.position(670 + widthBuffer, 12 + heightBuffer);
  // start/stop ã®DOMãã¿ã³ãæ¼ããã¨ãã«é³å£°èªè­åãæ¿ããè¡ã
  SpeechRecOnOffButton.mouseClicked(toggleSpeechRecognition);

  groupNameField = createInput("");
  groupNameField.position(150 + widthBuffer, 10 + heightBuffer);
  userNameField = createInput("");
  userNameField.position(150 + widthBuffer, 40 + heightBuffer);

  /*let testButton = createButton("test");
  testButton.mouseClicked(sendTest);*/

  for (i = 0; i < 5; i++) {
    //let buttonName = "é³" + i;
    soundButton[i] = createButton(buttonName[i]);
    soundButton[i].style("font-size", "30px");
    soundButton[i].position(25 + 150 * i + widthBuffer, 70 + heightBuffer);
    soundButton[i].size(100, 50);
    soundButton[i].style("background-color", col[0]);
  }

  soundButton[0].mousePressed(function () {
    soundButtonPressedFlag = true;
    nowPressedButtonNumber = 0;
  });

  soundButton[0].mouseReleased(function () {
    button_MouseReleased(0);
  });

  soundButton[1].mousePressed(function () {
    soundButtonPressedFlag = true;
    nowPressedButtonNumber = 1;
  });

  soundButton[1].mouseReleased(function () {
    button_MouseReleased(1);
  });

  soundButton[2].mousePressed(function () {
    soundButtonPressedFlag = true;
    nowPressedButtonNumber = 2;
  });

  soundButton[2].mouseReleased(function () {
    button_MouseReleased(2);
  });

  soundButton[3].mousePressed(function () {
    soundButtonPressedFlag = true;
    nowPressedButtonNumber = 3;
  });

  soundButton[3].mouseReleased(function () {
    button_MouseReleased(3);
  });

  soundButton[4].mousePressed(function () {
    soundButtonPressedFlag = true;
    nowPressedButtonNumber = 4;
  });

  soundButton[4].mouseReleased(function () {
    button_MouseReleased(4);
  });

  //p2pãããã®å¦ç
  peer = new Peer();
  peer.on("open", () => {
    console.log(peer.id);
  });

  connect = createButton("connect");
  connect.position(320, 30);
  connect.mousePressed(connectOn);
}

function draw() {
  //dObj = new Date();
  let connectionStatus = "æªæ¥ç¶";

  background(255);
  strokeWeight(5);
  stroke(22, 22, 102);
  rect(3, 3, 760, 150, 30);
  strokeWeight(1);

  stroke(0);
  textSize(18);
  text("ã°ã«ã¼ãID", 30 + widthBuffer, 20 + heightBuffer);
  groupName = groupNameField.value();
  if (ison == true) {
    connectionStatus = "æ¥ç¶ç¢ºç«";
  }
  text("æ¥ç¶ç¶æ³:" + connectionStatus, 400 + widthBuffer, 20 + heightBuffer);
  text("ããã¯ãã¼ã ", 20 + widthBuffer, 50 + heightBuffer);
  userName = userNameField.value();
  text("ãã¤ã¯", 600 + widthBuffer, 20 + heightBuffer);

  countMousePressedTime();

  // text(mousePressedTime, 0 + widthBuffer, 80 + heightBuffer);
}

function countMousePressedTime() {
  if (soundButtonPressedFlag) {
    flameCount++;
    mousePressedTime = flameCount / 60;
    if (1 <= mousePressedTime && mousePressedTime < 2) {
      soundButton[nowPressedButtonNumber].style("background-color", col[1]);
    } else if (2 <= mousePressedTime && mousePressedTime < 3) {
      soundButton[nowPressedButtonNumber].style("background-color", col[2]);
    } else if (3 <= mousePressedTime) {
      soundButton[nowPressedButtonNumber].style("background-color", col[3]);
      soundButton[nowPressedButtonNumber].style("color", "#FFFFFF");
      soundButton[nowPressedButtonNumber].style("font-size", "15px");
      soundButton[nowPressedButtonNumber].html("ã­ã£ã³ã»ã«");
    }
  } else {
    flameCount = 0;
    if (nowPressedButtonNumber != -1) {
      soundButton[nowPressedButtonNumber].style("background-color", col[0]);
    }
    nowPressedButtonNumber = -1;
    mousePressedTime = 0;
  }
}

function fetchButtonData(buttonNumber) {
  let buttonLevel;
  let selectedSoundNumber;

  if (mousePressedTime < 1) {
    buttonLevel = 0;
  } else if (1 <= mousePressedTime && mousePressedTime < 2) {
    buttonLevel = 1;
  } else if (2 <= mousePressedTime && mousePressedTime < 3) {
    buttonLevel = 2;
  } else {
    return;
  }

  selectedSoundNumber = buttonNumber + buttonLevel * 5;

  if (groupName == "") {
    groupName = "noNameGroup";
  }
  if (userName == "") {
    userName = "noNameUser";
  }

  dObj = new Date();
  let str = getTimeStr(dObj);

  fetch(
    sheetUrl +
      "&tag=0" +
      "&userSendDataTime=" +
      str +
      "&groupName=" +
      groupName +
      "&userName=" +
      userName +
      "&selectedSoundNumber=" +
      selectedSoundNumber
  );
}

function getTimeStr(dObj) {
  hours = dObj.getHours();
  minutes = dObj.getMinutes();
  seconds = dObj.getSeconds();
  miliSeconds = dObj.getMilliseconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  if (miliSeconds < 10) {
    miliSeconds = "00" + miliSeconds;
  } else if (miliSeconds < 100) {
    miliSeconds = "0" + miliSeconds;
  }
  var str = hours + ":" + minutes + ":" + seconds + ":" + miliSeconds;
  return str;
}

function toggleSpeechRecognition() {
  // èªè­ã¹ãã¼ã¿ã¹ãåè»¢ãããï¼trueãªãfalseï¼falseãªãtrueï¼
  is_recognition_activated = !is_recognition_activated;

  // é³å£°èªè­ã¢ã¯ãã£ãã¼ã
  if (is_recognition_activated == true) {
    myRec.rec.lang = "ja"; // æ¥æ¬èªèªè­
    myRec.start(); // èªè­ã¹ã¿ã¼ã
    this.style("background", "#00ff00");
    this.html("ON"); //ãã¿ã³ã®è¡¨ç¤ºãstopã«ãã
  }
  // é³å£°èªè­ãåæ­¢ããã
  else {
    // é³å£°èªè­ãã¨ãã
    myRec.stop();
    this.style("background", "#808080");
    // ãã¿ã³ã®è¡¨ç¤ºãstartã«ãã
    this.html("OFF");
  }
}

function endSpeech() {
  // é³å£°èªè­ã¢ã¯ãã£ãã¼ãä¸­ãªã
  if (is_recognition_activated == true) {
    // èªè­æå­åã«ä½ãå¥ã£ã¦ããªããã°ï¼ã¿ã¤ã ã¢ã¦ãã§endSpeechã«ãªã£ãå ´åï¼
    if (!myRec.resultValue) {
      myRec.start(); // start engine
      return;
    }

    // èªè­æå­åã«ãªããå¥ã£ã¦ãã°
    if (myRec.resultString.length > 0) {
      const kanjiText = myRec.resultString;

      perform("hiragana", kanjiText)
        .then((_response) => {
          const response = _response;

          return response.json();
        })
        .then((resJson) => {
          let rowText = resJson.converted;

          //ã²ãããªåAPIãããã¾ãè¿ã£ã¦ããªãã£ããæ¼¢å­ã®ã¾ã¾ã®æç« ãrowTextã«å¥ãã
          if (rowText == undefined) {
            rowText = kanjiText;
          }

          const sendText = rowText.split(" ").join("");
          dObj = new Date();
          let str = getTimeStr(dObj);

          if (groupName == "") {
            groupName = "noNameGroup";
          }
          if (userName == "") {
            userName = "noNameUser";
          }

          fetch(
            sheetUrl +
              "&tag=1" +
              "&userSendDataTime" +
              str +
              "&groupName=" +
              groupName +
              "&userName=" +
              userName +
              "&text=" +
              sendText +
              "&textCount=" +
              sendText.length
          );
        });

      myRec.resultString = "";
    }

    myRec.start(); // start engine
  }
}

var perform = function (output_type, sentence) {
  var endpoint = "https://labs.goo.ne.jp/api/hiragana"; // â 
  payload = {
    app_id: "9f270db13f202167a4dcfd58fe19b53aa726c1611c1c2810e813a4541b9f072e", // â¡
    sentence: sentence, // â¢
    output_type: output_type, // â£
  };

  let data = JSON.stringify(payload);

  var options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };

  return fetch(endpoint, options);
};

function sendTest() {
  dObj = new Date();
  let str = getTimeStr(dObj);

  //var XHR = new XMLHttpRequest();
  let kanjiText = "åé»ããããªã";

  perform("hiragana", kanjiText)
    .then((_response) => {
      const response = _response;
      return response.json();
    })
    .then((resJson) => {
      let rowText = resJson.converted;
      //ã²ãããªåAPIãããã¾ãè¿ã£ã¦ããªãã£ããæ¼¢å­ã®ã¾ã¾ã®æç« ãrowTextã«å¥ãã
      if (rowText == undefined) {
        rowText = kanjiText;
      }
      let text = rowText.split(" ").join("");

      if (groupName == "") {
        groupName = "noNameGroup";
      }
      if (userName == "") {
        userName = "noNameUser";
      }

      fetch(
        sheetUrl +
          "&tag=1" +
          "&userSendDataTime=" +
          str +
          "&groupName=" +
          groupName +
          "&userName=" +
          userName +
          "&text=" +
          text +
          "&textCount=" +
          text.length
      );
    });
}

function connectOn() {
  conn = peer.connect(groupNameField.value());
  // on open will be launch when you successfully connect to PeerServer
  conn.on("open", function () {
    // here you have conn.id
    console.log("éä¿¡ç¢ºç");
    conn.send("hello there");
    ison = true;
  });
}

function p2pSendButtonNumber(buttonNumber) {
  if (!peer) return;
  if (!ison) return;

  let buttonLevel;
  let selectedSoundNumber;

  if (mousePressedTime < 1) {
    buttonLevel = 0;
  } else if (1 <= mousePressedTime && mousePressedTime < 2) {
    buttonLevel = 1;
  } else if (2 <= mousePressedTime && mousePressedTime < 3) {
    buttonLevel = 2;
  } else {
    return;
  }

  selectedSoundNumber = buttonNumber + buttonLevel * 5;

  conn.send(selectedSoundNumber);
}

function button_MouseReleased(buttonNumber) {
  p2pSendButtonNumber(buttonNumber);
  fetchButtonData(buttonNumber);
  soundButton[buttonNumber].style("font-size", "30px");
  soundButton[buttonNumber].html(buttonName[buttonNumber]);
  soundButtonPressedFlag = false;
}
