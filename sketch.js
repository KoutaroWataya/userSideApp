const heightBuffer = 20;
const widthBuffer = 15;
const sheetUrl =
  "https://script.google.com/macros/s/AKfycbz2pO03671_dETB9HAGQw1QVJaKZ7nxPFjYGHiWk3vRBA4BTy5uvIyuYuUu6HmfCBkh/exec?";

//var dObj; // = new Date();

let henkou;

let groupNameField;
let groupName;
let userNameField;
let userName;

var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
var is_recognition_activated;

let soundButton = [];
let buttonName = ["😄", "😭", "😡", "👏", "🍻"];

let soundButtonPressedFlag = false;
let mousePressedTime = 0;
let flameCount = 0;
let col = [];
let nowPressedButtonNumber = -1;

//p2pあたりの変数
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
  col[1] = color("#aad5ff");
  col[2] = color("#2b95ff");
  col[3] = color("#0055aa");
  col[4] = color(105, 105, 105);

  let connnect;

  myRec.onEnd = endSpeech;

  // 随時音声入力をテキスト化する際に呼び出される関数を登録
  //myRec.onResult = parseResult;

  // 連続した音声認識は行わない．プログラム内で適時音声認識のstopとstartを制御する
  myRec.continuous = false; // no continuous recognition

  // 読み上げている最中の認識途中の文字列も利用する場合
  myRec.interimResults = false; // allow partial recognition (faster, less accurate)

  // プログラム制御用変数（true: 音声認識利用中を示す）
  is_recognition_activated = false;

  // 認識言語は日本語
  myRec.rec.lang = "ja";

  //let SpeechRecOnOffButton = createButton("ON");
  let SpeechRecOnOffButton = createButton("OFF");
  //SpeechRecOnOffButton.style("background", "#00ff00");
  SpeechRecOnOffButton.style("background", "#808080");
  SpeechRecOnOffButton.position(670 + widthBuffer, 12 + heightBuffer);
  // start/stop のDOMボタンを押したときに音声認識切り替えを行う
  SpeechRecOnOffButton.mouseClicked(toggleSpeechRecognition);

  groupNameField = createInput("");
  groupNameField.position(150 + widthBuffer, 10 + heightBuffer);
  userNameField = createInput("");
  userNameField.position(150 + widthBuffer, 40 + heightBuffer);

  /*let testButton = createButton("test");
  testButton.mouseClicked(sendTest);*/

  for (i = 0; i < 4; i++) {
    //let buttonName = "音" + i;
    soundButton[i] = createButton(buttonName[i]);
    soundButton[i].style("font-size", "30px");
    soundButton[i].position(25 + 200 * i + widthBuffer, 70 + heightBuffer);
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

  /* soundButton[4].mousePressed(function () {
    soundButtonPressedFlag = true;
    nowPressedButtonNumber = 4;
  });

  soundButton[4].mouseReleased(function () {
    button_MouseReleased(4);
  });*/

  //p2pあたりの処理
  peer = new Peer();
  peer.on("open", () => {
    console.log(peer.id);
  });

  connect = createButton("connect");
  connect.position(320, 30);
  connect.mousePressed(connectOn);

  myRec.start(); // 認識スタート
}

function draw() {
  //dObj = new Date();
  let connectionStatus = "未接続";

  background(255);
  strokeWeight(5);
  stroke(22, 22, 102);
  rect(3, 3, 760, 150, 30);
  strokeWeight(1);

  stroke(0);
  textSize(18);
  text("グループID", 30 + widthBuffer, 20 + heightBuffer);
  groupName = groupNameField.value();
  if (ison == true) {
    connectionStatus = "接続確立";
  }
  text("接続状況:" + connectionStatus, 400 + widthBuffer, 20 + heightBuffer);
  text("ニックネーム", 20 + widthBuffer, 50 + heightBuffer);
  userName = userNameField.value();
  text("マイク", 600 + widthBuffer, 20 + heightBuffer);

  countMousePressedTime();

  // text(mousePressedTime, 0 + widthBuffer, 80 + heightBuffer);
}

function countMousePressedTime() {
  if (soundButtonPressedFlag) {
    flameCount++;
    mousePressedTime = flameCount / 60;
    if (mousePressedTime < 1) {
      soundButton[nowPressedButtonNumber].style("background-color", col[1]);
    }
    if (1 <= mousePressedTime && mousePressedTime < 2) {
      soundButton[nowPressedButtonNumber].style("background-color", col[2]);
    } else if (2 <= mousePressedTime && mousePressedTime < 3) {
      soundButton[nowPressedButtonNumber].style("background-color", col[3]);
    } else if (3 <= mousePressedTime) {
      soundButton[nowPressedButtonNumber].style("background-color", col[4]);
      soundButton[nowPressedButtonNumber].style("color", "#FFFFFF");
      soundButton[nowPressedButtonNumber].style("font-size", "15px");
      soundButton[nowPressedButtonNumber].html("キャンセル");
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

  let dObj = new Date();
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
  // 認識ステータスを反転させる（trueならfalse，falseならtrue）
  is_recognition_activated = !is_recognition_activated;

  // 音声認識アクティベート
  if (is_recognition_activated == true) {
    myRec.rec.lang = "ja"; // 日本語認識
    myRec.start(); // 認識スタート
    this.style("background", "#00ff00");
    this.html("ON"); //ボタンの表示をstopにする
  }
  // 音声認識を停止させる
  else {
    // 音声認識をとめる
    myRec.stop();
    this.style("background", "#808080");
    // ボタンの表示をstartにする
    this.html("OFF");
  }
}

function endSpeech() {
  // 音声認識アクティベート中なら
  if (is_recognition_activated == true) {
    // 認識文字列に何も入っていなければ（タイムアウトでendSpeechになった場合）
    if (!myRec.resultValue) {
      myRec.start(); // start engine
      return;
    }

    // 認識文字列になんか入ってれば
    if (myRec.resultString.length > 0) {
      const kanjiText = myRec.resultString;

      perform("hiragana", kanjiText)
        .then((_response) => {
          const response = _response;

          return response.json();
        })
        .then((resJson) => {
          let rowText = resJson.converted;

          //ひらがな化APIからうまく返ってこなかったら漢字のままの文章をrowTextに入れる
          if (rowText == undefined) {
            rowText = kanjiText;
          }

          const sendText = rowText.split(" ").join("");
          let dObj = new Date();
          let str = getTimeStr(dObj);

          if (groupName == "") {
            groupName = "noNameGroup";
          }
          if (userName == "") {
            userName = "noNameUser";
          }

          //console.log(str);

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
  var endpoint = "https://labs.goo.ne.jp/api/hiragana"; // ①
  payload = {
    app_id: "9f270db13f202167a4dcfd58fe19b53aa726c1611c1c2810e813a4541b9f072e", // ②
    sentence: sentence, // ③
    output_type: output_type, // ④
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
  let kanjiText = "充電　されない";

  perform("hiragana", kanjiText)
    .then((_response) => {
      const response = _response;
      return response.json();
    })
    .then((resJson) => {
      let rowText = resJson.converted;
      //ひらがな化APIからうまく返ってこなかったら漢字のままの文章をrowTextに入れる
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
    console.log("通信確率");
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
