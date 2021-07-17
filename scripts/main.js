/**
 * メイン処理
 */
let buttonRec;     //記録ボタン
let buttonEnd;     //終了ボタン
let buttonOut;     //議事録出力ボタン
let statusMessage; //ステータス表示
let averageSpeed;  //平均速度表示
let debugMessage;  //デバッグ用


window.addEventListener("DOMContentLoaded", () => { 

	//画面項目の取得
	buttonRec = document.getElementById("buttonRec");         //記録ボタン
	buttonEnd = document.getElementById("buttonEnd");         //終了ボタン
	buttonOut = document.getElementById("buttonOut");         //議事録出力ボタン
	averageSpeed = document.getElementById("averageSpeed");   //平均速度
	statusMessage = document.getElementById("statusMessage"); //ステータス表示
	debugMessage = document.getElementById("debugMessage");   //デバッグ表示

	//初期化
	statusMessage.innerHTML = "";

	//------------------------
	// ボタンクリック処理
	//------------------------
	//記録ボタン
	buttonRec.addEventListener("click", () => { 
		statusMessage.innerHTML = "音声の記録を開始しました。";
		startRecognition();
	});   

	//終了ボタン
	buttonEnd.addEventListener("click", () => { 
		statusMessage.innerHTML = "音声の記録を終了しました。";
		stopRecognition();
		//レポート出力
		outputReport();
	});             

	//議事録出力ボタン
	buttonOut.addEventListener("click", () => { 
		outputVoiceRecord();
	});             

});



/**
 * ステータスを表示する
 */
 function showStatus(speed) {
    let message = "";

    //ステータスの判定
    if (speed < 330) {
        message = "話しにくい話題のようです。こちらから話題を転換してみませんか。または掘り下げてみませんか。";
    }
    else if (speed <= 440) {
        message = "良い調子です。落ち着いて話ができています。";
    }
    else {
        message = "緊張しているか盛り上がっているようです。ブレイクダウンできるような話題に転換してみてはいかがでしょうか。";
    }

    statusMessage.innerHTML = message;

}

/**
 * 平均速度を表示する
 */
 function showAverageSpeed(value) {
    //表示
    averageSpeed.innerHTML = value.toFixed(0);  
}

