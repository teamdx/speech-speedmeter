/**
 * 音声認識、発話スピードの測定
 */

const API_CALL_INTERVAL　= 5; //APIをコールする文字数感覚

let recognition;            //音声認識用
let speechText = "";        //発話内容(ひらがな)
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
let sumSpeechSpeed = 0;     //平均速度の合計 
//let speechKanjiText = "";   //発話内容（漢字）
//let tempText = "";          //発話内容（ひらがなスペース付）

let beforeSpeechLength = 0;

/**
 * 音声認識の設定
 */
 window.addEventListener("DOMContentLoaded",  () => { 
    
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
        //非同期関数として宣言(async)) 2021/8/27 saito
        const onResult = async event => { 
            //記録ボタンが押されていない場合は処理終了
            if (!listening) return;

            //初期化
            //statusMessage.innerHTML = ""; //ステータスを残しておく2021/9/7 saito
            speechText = "";
            //speechKanjiText= "";
            //tempText ="";
            //console.log(event.results);

            //音声認識結果を取得
            res = event.results[event.results.length-1];

            //発話を開始したタイミングの場合
            if (isCount == false && !res.isFinal) {
                //発話時間の測定を開始
                startTimmer();
            }

            // //音声認識された文章を保持(議事録出力はしないけど漢字用復活)　2021/9/4 sagara　            
            // speechKanjiText = res[0].transcript;
            // //同期処理に変更(await) 2021/8/27 saito
            // //変数名変更 2021/9/4 sagara
            // tempText = await transformation(res[0].transcript);
            // //ひらがな化テキストは単語をスペースで区切るのでスペース削除 2021/9/4 sagara
            // speechText = tempText.replace(/\s+/g, "");
            // console.log("漢字："+speechKanjiText);
            // console.log("ひらがな："+speechText);
     
            let transText = res[0].transcript;
            let isFinal = res.isFinal;

            //前回よりAPI_CALL_INTERVAL文字増えていた or 終了したタイミングで測定
            let nowSpeechLength = transText.length;
            if (nowSpeechLength - beforeSpeechLength > API_CALL_INTERVAL　|| isFinal) {
                console.log("now:before = " + nowSpeechLength + ":" + beforeSpeechLength);
                //ひらがなAPI呼び出し
                transformation(transText).then(
                    response => {
                        //ひらがな化テキストは単語をスペースで区切るのでスペース削除 2021/9/4 sagara
                        //let speechText = response.replace(/\s+/g, "");
                        let speechText = response;

                        //現在のテキストからスピード測定
                        showNowSpeedMater(speechText);

                        //現在のスピードでステータス表示 2021/9/6 saito
                        showStatus(speechSpeed);

                        //会話が終了した時
                        if (isFinal) {
                            console.log(nowTime() + " (発話終了)");

                            //発話時間の測定を終了
                            stopTimmer();

                            //平均速度表示
                            setAverageSpeed();
                            showAverageSpeed(speechSpeedAverage);

                            //ステータス表示
                            //画面からでなく、setAverageSpeed()にて生成した平均値を使用するよう変更 2021/9/10 sagara
                            //showStatus(averageSpeed);
                            showStatus(speechSpeedAverage);

                            //発話文字数をリセット
                            beforeSpeechLength = 0;

                        }
                        else {
                            //今回の発話文字数を保持
                            beforeSpeechLength = nowSpeechLength;
                        }
                    }
                )

            }

            

            //現在のスピードでステータス表示 2021/9/6 saito
            //showStatus(speechSpeed);

            // //発話が終了した場合
            // if (res.isFinal) { 

            //     //発話時間の測定を終了
            //     stopTimmer();

            //     //平均速度表示
            //     setAverageSpeed();
            //     showAverageSpeed(speechSpeedAverage);

            //     //ステータス表示
            //     showStatus(averageSpeed);

            //     //音声の記録（DBへ登録）
            //     var data = new Object();
            //     data.speechText  = speechKanjiText;  //会話内容（漢字を送るよう変更）2021/9/4 sagara
            //     data.speechSpeed = speechSpeed; //会話速度
            //     data.speechTimer = speechTimer; //会話時間
            //     sendVoiceRecordData(data);

            // } 
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
 * 音声認識の終了処理（1文が終わったと判断した時）
 * @param {*} speechSpeed 
 * @param {*} speechTimer 
 */
function speechFinal(speechSpeed, speechTimer) {
    //発話時間の測定を終了
    stopTimmer();

    //平均速度表示
    setAverageSpeed();
    showAverageSpeed(speechSpeedAverage);

    //ステータス表示
    showStatus(averageSpeed);


}

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
//    showNowSpeedMater();  //タイミング変更 2021/9/6 saito
}

/**
 * 現在の速度を表示する
 */
function showNowSpeedMater(speechText) {

    // 計測タイミング修正 2021/9/7 saito
    // 15文字以上かつ3秒経過後にスピード測定（30→15文字に変更）2021/9/10 sagara
    // if  (speechText.length > 30) {
    if (speechTimer >= 3 && speechText.length > 15) {
        //1分当たりの発話速度を取得
        //= 現在の文字数/現在の発話時間(秒) * 60 
        speechSpeed = ((speechText.length/speechTimer) * 60).toFixed(0);
        //console.log("speed:" + speechText.length + "," + speechTimer );
        console.log("speechText.length:" + speechText.length + ",speechTimer:" + speechTimer + ",speechSpeed:" + speechSpeed  );
    }
    else {
        speechSpeed = 0;
    }

    //console.log("文字数：" +speechText.length)
    //console.log("スピード：" + speechSpeed);
    //速度表示
    setSpeedMater(speechSpeed);
}

/**
 * 平均速度の計算
 */
 function setAverageSpeed() {
    //確定した会話速度を登録
    speechSpeed = Number(speechSpeed);

    //1秒以上の場合
    if (speechSpeed > 0) {
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
        //let sumSpeechSpeed = totalSpeechSpeed.reduce(function (acc, cur) {
        sumSpeechSpeed = totalSpeechSpeed.reduce(function (acc, cur) {
            return acc + cur;
        });
        speechSpeedAverage = sumSpeechSpeed / totalSpeechSpeed.length;
    }


    console.log("平均：" + speechSpeedAverage + " = " + sumSpeechSpeed + "/" + totalSpeechSpeed.length);
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
