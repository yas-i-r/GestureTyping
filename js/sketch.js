// ジェスチャーの種類
// 1️⃣(one_samples),2️⃣(two_samples), 3️⃣(three_samples), 
// 4️⃣(four_samples), 5️⃣(five_samples), 👍(good_samples), 
// 🤟(aloha_samples),✊(zero_samples)
function getCode(left_gesture, right_gesture) {

//追加
  left_gesture = left_gesture.replace(/-/g, '_');
  right_gesture = right_gesture.replace(/-/g, '_');

  let code_array = {
    "zero_samples": 0,
    "one_samples": 1,
    "two_samples": 2,
    "three_samples": 3,
    "four_samples": 4,

    "five_samples": 5,
    "good_samples": 6,
    "aloha_samples": 7,

  }
  let left_code = code_array[left_gesture];
  let right_code = code_array[right_gesture];
  // left_codeとright_codeを文字として結合
  let code = String(left_code) + String(right_code);
  return code;
}

function getCharacter(code) {
  const codeToChar = {
    "00": "a", "01": "b", "02": "c", "03": "d", "04": "e",
    "10": "f", "11": "g", "12": "h", "13": "i", "77": "j",
    "20": "k", "21": "l", "22": "m", "23": "n", "24": "o",
    "30": "p", "31": "q", "32": "r", "33": "s", "34": "t",
    "40": "u", "41": "v", "42": "w", "43": "x", "44": "y",
    "07": "z", "17": " ", "27": "backspace"
  };
  return codeToChar[code] || "";
}

//the       → 34 12 04
// quick     → 31 40 13 02 20
// brown     → 01 32 24 42 23
// fox       → 10 24 43
// jumps     → 77 40 22 30 33
// over      → 24 41 04 32
// the       → 34 12 04
// lazy      → 21 00 07 44
// dog       → 03 24 11


// 入力サンプル文章 
let sample_texts = [
  "the quick brown fox jumps over the lazy dog",
];

// ゲームの状態を管理する変数
// notready: ゲーム開始前 （カメラ起動前）
// ready: ゲーム開始前（カメラ起動後）
// playing: ゲーム中
// finished: ゲーム終了後
// ready, playing, finished
let game_mode = {
  now: "notready",
  previous: "notready",
};

let game_start_time = 0;
let gestures_results;
let cam = null;
let p5canvas = null;

function setup() {
  p5canvas = createCanvas(320, 240);
  p5canvas.parent('#canvas');

//追加部分
let lastChar = "";
let lastCharTime = millis();
let sameCharCount = 0; // 同じ文字が何回連続したか

gotGestures = function (results) {
  gestures_results = results;

  if (results.gestures.length == 2) {
    if (game_mode.now == "ready" && game_mode.previous == "notready") {
      game_mode.previous = game_mode.now;
      game_mode.now = "playing";
      document.querySelector('input').value = "";
      game_start_time = millis();
    }
    let left_gesture;
    let right_gesture;
    if (results.handednesses[0][0].categoryName == "Left") {
      left_gesture = results.gestures[0][0].categoryName;
      right_gesture = results.gestures[1][0].categoryName;
    } else {
      left_gesture = results.gestures[1][0].categoryName;
      right_gesture = results.gestures[0][0].categoryName;
    }
    let code = getCode(left_gesture, right_gesture);
    let c = getCharacter(code);

    let now = millis();
    if (c === lastChar) {
      // 同じ文字の場合は通常より長い待機時間（2000ms）
      if (now - lastCharTime > 2000) {
        typeChar(c);
        lastCharTime = now;
      }
  //   } else {
  //   // 文字が変わった場合：即座にlastCharを更新し、typeCharも呼ぶ
  //   lastChar = c;
  //   lastCharTime = now;
  //   sameCharCount = 0;
  //   if (c !== "") {
  //     typeChar(c);
  //   }
  // }


  } else {
  // 文字が変わった場合
  if (now - lastCharTime > 500) { // ← この数字をいじる
    lastChar = c;
    lastCharTime = now;
    sameCharCount = 0;
    if (c !== "") {
      typeChar(c);
    }
  }
}
    }
}



  // // When gestures are found, the following function is called. The detection results are stored in results.
  // let lastChar = "";
  // let lastCharTime = millis();

  // gotGestures = function (results) {
  //   gestures_results = results;

  //   if (results.gestures.length == 2) {
  //     if (game_mode.now == "ready" && game_mode.previous == "notready") {
  //       // ゲーム開始前の状態から、カメラが起動した後の状態に変化した場合
  //       game_mode.previous = game_mode.now;
  //       game_mode.now = "playing";
  //       document.querySelector('input').value = ""; // 入力欄をクリア
  //       game_start_time = millis(); // ゲーム開始時間を記録
  //     }
  //     let left_gesture;
  //     let right_gesture;
  //     //if (results.handedness[0][0].categoryName == "Left") {
  //     if (results.handednesses[0][0].categoryName == "Left") {
  //       left_gesture = results.gestures[0][0].categoryName;
  //       right_gesture = results.gestures[1][0].categoryName;
  //     } else {
  //       left_gesture = results.gestures[1][0].categoryName;
  //       right_gesture = results.gestures[0][0].categoryName;
  //     }
  //     let code = getCode(left_gesture, right_gesture);
  //     let c = getCharacter(code);

  //     let now = millis();
  //     if (c === lastChar) {
  //       if (now - lastCharTime > 200) {
  //         // 200ms以上cが同じ値である場合の処理
  //         typeChar(c);
  //         lastCharTime = now;
  //       }
  //     } else {
  //       lastChar = c;
  //       lastCharTime = now;
  //     }
  //   }

  // }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ここから下は課題制作にあたって編集してはいけません。
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// 入力欄に文字を追加する場合は必ずこの関数を使用してください。
function typeChar(c) {
  if (c === "") {
    console.warn("Empty character received, ignoring.");
    return;
  }
  // inputにフォーカスする
  document.querySelector('input').focus();
  // 入力欄に文字を追加または削除する関数
  const input = document.querySelector('input');
  if (c === "backspace") {
    input.value = input.value.slice(0, -1);
  } else {
    input.value += c;
  }

  let inputValue = input.value;
  // #messageのinnerTextを色付けして表示
  const messageElem = document.querySelector('#message');
  const target = messageElem.innerText;
  let matchLen = 0;
  for (let i = 0; i < Math.min(inputValue.length, target.length); i++) {
    if (inputValue[i] === target[i]) {
      matchLen++;
    } else {
      break;
    }
  }
  const matched = target.slice(0, matchLen);
  const unmatched = target.slice(matchLen);
  console.log(`Matched: ${matched}, Unmatched: ${unmatched}`);
  messageElem.innerHTML =
    `<span style="background-color:lightgreen">${matched}</span><span style="background-color:transparent">${unmatched}</span>`;




  // もしvalueの値がsample_texts[0]と同じになったら、[0]を削除して、次のサンプル文章に移行する。配列長が0になったらゲームを終了する
  if (document.querySelector('input').value == sample_texts[0]) {
    sample_texts.shift(); // 最初の要素を削除
    console.log(sample_texts.length);
    if (sample_texts.length == 0) {
      // サンプル文章がなくなったらゲーム終了
      game_mode.previous = game_mode.now;
      game_mode.now = "finished";
      document.querySelector('input').value = "";
      const elapsedSec = ((millis() - game_start_time) / 1000).toFixed(2);
      document.querySelector('#message').innerText = `Finished: ${elapsedSec} sec`;
    } else {
      // 次のサンプル文章に移行
      document.querySelector('input').value = "";
      document.querySelector('#message').innerText = sample_texts[0];
    }
  }

}


function startWebcam() {
  // If the function setCameraStreamToMediaPipe is defined in the window object, the camera stream is set to MediaPipe.
  if (window.setCameraStreamToMediaPipe) {
    cam = createCapture(VIDEO);
    cam.hide();
    cam.elt.onloadedmetadata = function () {
      window.setCameraStreamToMediaPipe(cam.elt);
    }
    p5canvas.style('width', '100%');
    p5canvas.style('height', 'auto');
  }

  if (game_mode.now == "notready") {
    game_mode.previous = game_mode.now;
    game_mode.now = "ready";
    document.querySelector('#message').innerText = sample_texts[0];
    game_start_time = millis();
  }
}


function draw() {
  background(127);
  if (cam) {
    image(cam, 0, 0, width, height);
  }
  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
  if (gestures_results) {
    if (gestures_results.landmarks) {
      for (const landmarks of gestures_results.landmarks) {
        for (let landmark of landmarks) {
          noStroke();
          fill(100, 150, 210);
          circle(landmark.x * width, landmark.y * height, 10);
        }
      }
    }

    // ジェスチャーの結果を表示する
    for (let i = 0; i < gestures_results.gestures.length; i++) {
      noStroke();
      fill(255, 0, 0);
      textSize(10);
      let name = gestures_results.gestures[i][0].categoryName;
      let score = gestures_results.gestures[i][0].score;
      let right_or_left = gestures_results.handednesses[i][0].hand;
      let pos = {
        x: gestures_results.landmarks[i][0].x * width,
        y: gestures_results.landmarks[i][0].y * height,
      };
      textSize(20);
      fill(0);
      textAlign(CENTER, CENTER);
      text(name, pos.x, pos.y);
    }
  }

  if (game_mode.now == "notready") {
    // 文字の後ろを白で塗りつぶす
    let msg = "Press the start button to begin";
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = height / 2;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }
  else if (game_mode.now == "ready") {
    let msg = "Waiting for gestures to start";
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = height / 2;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }
  else if (game_mode.now == "playing") {
    // ゲーム中のメッセージ
    let elapsedSec = ((millis() - game_start_time) / 1000).toFixed(2);
    let msg = `${elapsedSec} [s]`;
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = th;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }
  else if (game_mode.now == "finished") {
    // ゲーム終了後のメッセージ
    let msg = "Game finished!";
    textSize(18);
    let tw = textWidth(msg) + 20;
    let th = 32;
    let tx = width / 2;
    let ty = height / 2;
    rectMode(CENTER);
    fill(255, 100);
    noStroke();
    rect(tx, ty, tw, th, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    text(msg, tx, ty);
  }

}


