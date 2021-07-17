/**
 * 議事録用の音声記録、議事録表示
 */

var sessionId = getUniqueCode(); //セッション番号を生成

// 音声記録の接続先URI
const url_voicerec = "https://voice-app.mybluemix.net/voicerec";

// レポート出力の接続先URI
const url_voiceend = "https://voice-app.mybluemix.net/voiceend";

// 議事録出力の接続先URI
const url_voiceout = "https://voice-app.mybluemix.net/voiceout";


/**
 * 音声データをデータベースへ記録
 * @param {記録するデータ} data 
 * @returns 
 */
async function sendVoiceRecordData(data) {

	// セッションIDを付与
	data.sessionId = sessionId;

	// 既定のオプションには * が付いています
	const response = await fetch(url_voicerec, {
		method: 'POST',             // *GET, POST, PUT, DELETE, etc.
		mode: 'no-cors',            // no-cors, *cors, same-origin
		cache: 'no-cache',          // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
		'Content-Type': 'application/json'
		// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow',            // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data)     // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
	})

	// レスポンス
	return ; 
}


/**
 * レポート出力処理
 */
 function outputReport() {
	let out = "* 終了レポート *\n";
	out += "全体平均速度:" + Number(speechSpeedAverage) + "文字/分\n";
	out += "最高速度:" + speechSpeedMax + "文字/分\n";
	out += "最低速度:" + speechSpeedMin + "文字/分\n";

	buttonEnd.href = url_voiceend + "?result=" + encodeURI(out);
}


/**
 * 議事録出力処理
 */
function outputVoiceRecord() {
	buttonOut.href = url_voiceout + "?sessionId=" + sessionId;
}

/**
 * 音声記録の初期設定
 */
 window.addEventListener("DOMContentLoaded", () => { 
	// var data = new Object();

	// data.message = 'メッセージの送信テストです';
	// data.sessionId = sessionId;
	// postData(data);


 });

/**
 * ハッシュコードの生成
 * @param {*} text 
 * @returns 
 */
 async function sha256(text){
    const uint8  = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
}

/**
 * ユニークコードの取得
 * @param {*} myStrong 
 * @returns 
 */
function getUniqueCode(myStrong){
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}
