/**
 * 音声認識、発話スピードの測定
 */

let recognition;            //音声認識用
let speechText = "";        //発話内容
let speed = 0;              //発話スピード
let speechTimer = 0;        //発話時間(秒)
let wordTimmerID = "";      //発話内容の記録用ID
let listening = false;      //true:音声認識をする
let isCount = false;        //true:発話中
let speechSpeedAverage = 0; //平均速度
let speechSpeed = 0;        //現在の速度
let speechSpeedMax = 0;     //最高速度
let speechSpeedMin = 9999;  //最低速度
let totalSpeechSpeed = [];  //合計速度

/**
 * 音声認識の設定
 */
 window.addEventListener("DOMContentLoaded", () => { 
    
    //音声認識(SpeechRecognition)のチェック
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition 
    if (typeof SpeechRecognition === "undefined") { 
        alert("音声認識非対応です");

    } 
    else { 
        //音声認識の設定
        recognition = new SpeechRecognition(); 
        recognition.lang = 'ja-JP'; 
        recognition.continuous = true; 
        recognition.interimResults = true; 

        //音声認識された時
        const onResult = event => { 
            //記録ボタンが押されていない場合は処理終了
            if (!listening) return;

            //初期化
            statusMessage.innerHTML = ""; 
            speechText = "";
            console.log(event.results);

            //音声認識結果を取得
            res = event.results[event.results.length-1];

            //発話を開始したタイミングの場合
            if (isCount == false && !res.isFinal) {
                //発話時間の測定を開始
                startTimmer();
            }

            //音声認識された文章を保持
            speechText = res[0].transcript;

            //発話が終了した場合
            if (res.isFinal) { 

                //発話時間の測定を終了
                stopTimmer();

                //平均速度表示
                setAverageSpeed();
                showAverageSpeed(speechSpeedAverage);

                //ステータス表示
                showStatus(averageSpeed);

                //音声の記録（DBへ登録）
                var data = new Object();
                data.speechText  = speechText;  //会話内容
                data.speechSpeed = speechSpeed; //会話速度
                data.speechTimer = speechTimer; //会話時間
                sendVoiceRecordData(data);

            } 
        };
        recognition.addEventListener("result", onResult); 

        //音声認識が開始した時
        recognition.onstart = () => {
            listening = true;
        }

        //音声認識が終了した時
        recognition.onend = () => {
            //音声認識を再スタート
            recognition.start(); 
        }

    } 
});

/**
 * 音声認識の開始
 */
function startRecognition() {
    listening = true;
    recognition.start(); 
}

/**
 * 音声認識の終了
 */
function stopRecognition() {
    listening = false;
    recognition.stop();
} 

/**
 * Timmerイベント処理
 */
function countTimmer() {
    speechTimer += 0.1;
    showNowSpeedMater();
}

/**
 * 現在の速度を表示する
 */
function showNowSpeedMater() {
    //10文字以上の時にスピード測定
    if  (speechText.length > 10) {
        //1分当たりの発話速度を取得
        //= 現在の文字数/現在の発話時間(秒) * 60 
        speechSpeed = ((speechText.length/speechTimer) * 60).toFixed(0);
        console.log("speed:" + speechText.length + "," + speechTimer );
    }
    else {
        speechSpeed = 0;
    }

    //速度表示
    setSpeedMater(speechSpeed);
}

/**
 * 平均速度の計算
 */
 function setAverageSpeed() {
    //確定した会話速度を登録
    speechSpeed = Number(speechSpeed);
    totalSpeechSpeed.push(speechSpeed);

    //最高速度チェック
    if (speechSpeedMax < speechSpeed) {
        speechSpeedMax = speechSpeed;
    }

    //最低速度チェック
    if (speechSpeedMin > speechSpeed) {
        speechSpeedMin = speechSpeed;
    }
    
    //平均を算出(配列の中を合計)
    let sumSpeechSpeed = totalSpeechSpeed.reduce(function (acc, cur) {
        return acc + cur;
    });
    speechSpeedAverage = sumSpeechSpeed / totalSpeechSpeed.length;

    console.log("平均：" + speechSpeedAverage);
}



// 音声認識の再実行
function speechCheker() {
    if (!listening) {
        recognition.start(); 
    }
    setInterval('speechCheker()',1000); 
}

// 繰り返し処理の開始
function startTimmer() {
    isCount = true;
    speechTimer = 0;   // カウンタのリセット
    wordTimmerID = setInterval('countTimmer()',100);   // タイマーをセット(100ms間隔)
}

 // 繰り返し処理の中止
function stopTimmer() {
    isCount = false;
    clearInterval(wordTimmerID);   // タイマーのクリア
}

