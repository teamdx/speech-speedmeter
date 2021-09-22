/**
 * メイン処理
 */
let buttonRec;     //記録ボタン
let buttonEnd;     //終了ボタン
//let buttonOut;     //議事録出力ボタン
let statusMessage; //ステータス表示
let averageSpeed;  //平均速度表示
let debugMessage;  //デバッグ用


window.addEventListener("DOMContentLoaded", () => { 

	//画面項目の取得
	buttonRec = document.getElementById("buttonRec");         //記録ボタン
	buttonEnd = document.getElementById("buttonEnd");         //終了ボタン
	//buttonOut = document.getElementById("buttonOut");         //議事録出力ボタンコメント化 2021/9/4 sagara
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
		statusMessage.innerHTML = "音声の記録を開始しました。"
		startRecognition();
	});   

	//終了ボタン
	buttonEnd.addEventListener("click", () => { 
		statusMessage.innerHTML = "音声の記録を終了しました。";
		stopRecognition();
		//レポート出力
		outputReport();
	});             

	//議事録出力ボタン コメント化 2021/9/4 sagara
	//buttonOut.addEventListener("click", () => { 
	//	outputVoiceRecord();
	//});             

});



/**
 * ステータスを表示する
 */
 function showStatus(speed) {

	//現在のステータス表示を設定 2021/9/7 saito
    let message = statusMessage.innerHTML;

    //ステータスの判定
	//100文字以上に変更 2021/9/7 saito
    if (speed > 100 && speed < 330) {
        message = "話しにくい話題のようです。こちらから話題を転換してみませんか。または掘り下げてみませんか。";
    }
	//speed > 330 追加 2021/9/11 sagara
    else if (speed > 330 && speed <= 440) {
        message = "良い調子です。落ち着いて話ができています。";
    }
    else if (speed > 440){
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


function nowTime() {
	var today = new Date();
	month = today.getMonth() + 1 ;
	return month + "/"+ today.getDate() 
			+ " " +today.getHours() 
			+ ":" + ('0' +today.getMinutes()).slice(-2) 
			+ ":" + ('0' +today.getSeconds()).slice(-2)
			+ ":" + ('0' +today.getMilliseconds()).slice(-3);
}