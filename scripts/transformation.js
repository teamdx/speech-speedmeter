var transIndex = 0;

//ひらがなに変換
async function  transformation(transText) {

	//採番
	let localTransIndex = transIndex++;

	//ログ出力
	console.log(nowTime() + " start-" + localTransIndex + " "+ transText);

	//同期呼び出し 2021/8/27 saito
	let hiragana = await sendAjax(transText)

	//ログ出力
	console.log(nowTime() + " end-" + localTransIndex + " "+ hiragana.replace(/\s+/g, ""));
	
	//スペース除去 2021/9/10 sagara
	return hiragana.replace(/\s+/g, "");

	// .then(result=>{
	// 	console.log(nowTime() + " end "+ result);
	// });
	//return;
}
	  
//非同期関数として宣言(async)) 2021/8/27 saito
async function sendAjax(transText){
	// 送信データ.
	var data = {
		app_id: '0291b0da4cba2391cb4899011e1d7d730ffc7289af9ad76254fcb43c5a24e1a4',
		sentence: transText,
		output_type: "hiragana",
	  };

	// 送信できるように JSON encodeする.
	jsonEncoded = JSON.stringify(data);

	// // 送信
	// return $.ajax({
	//   type: "POST",
	//   url: "https://labs.goo.ne.jp/api/hiragana",
	//   contentType: "application/json",
	//   data: jsonEncoded,
	// });

	//fech関数呼び出しに変更 2021/8/27 saito
	let param = {
		method: "post",
		headers:{
			"Content-Type": "application/json; charset=utf-8"
  		},
		body: jsonEncoded
	}

	//同期処理呼び出し(await)) 2021/8/27 saito
	let response = await fetch("https://labs.goo.ne.jp/api/hiragana", param);
	let json = await response.json();

	//ひらがなを返却
	return json.converted;


}

