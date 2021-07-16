/**
 * スピードメーター
 */
var needle;
window.addEventListener("DOMContentLoaded", () => { 
	needle = new JustGage({
		id: "gauge",
		value: 450,
		min: 0,
		max: 600,
		title: "直近速度",
		label: "文字/分",
		pointer: true,

	  });

	  //初期値
	  setSpeedMater(0);	
});

/**
 * 直近速度表示
 * @param {直近速度} val 
 */
function setSpeedMater(val) {
	needle.refresh(val);
}	