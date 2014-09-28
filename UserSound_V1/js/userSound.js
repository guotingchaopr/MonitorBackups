/*code is far away from bug with the animal protecting
 *  ┏┓　　　┏┓
 *┏┛┻━━━┛┻┓
 *┃　　　　　　　┃
 *┃　　　━　　　┃
 *┃　┳┛　┗┳　┃
 *┃　　　　　　　┃
 *┃　　　┻　　　┃
 *┃　　　　　　　┃
 *┗━┓　　　┏━┛
 *　　┃　　　┃神兽保佑
 *　　┃　　　┃代码无BUG！视觉不变动！
 *　　┃　　　┗━━━┓
 *　　┃　　　　　　　┣┓
 *　　┃　　　　　　　┏┛
 *　　┗┓┓┏━┳┓┏┛
 *　　　┃┫┫　┃┫┫
 *　　　┗┻┛　┗┻┛
 *　coding by guotingchaopr@gmail.com
 */
-

(function (global) {
	var _window = global || window,
		animate_beart = 0,
		flag = true,
		heartBeatInterval = null,
		heart = document.getElementById("heart"),
		sync_url = "http://127.0.0.1/admin/getMddAllQfsProxy.json?mddCode=MD_CSSEARCH_WORD_COUNT_DAY_TOP100&callback=?&queryTime=" + (reqTime + reqCount*1000*pagesCount* intervalTime);
	var len4Words = [],
		len3Words = [],
		len2Words = [],
		len1Words = [],
		lenGreater4Words = [];


	window.onload = function () {
		heartBeatInterval = setInterval(heartBeat, 130);
		setTimeout(function(){
			syncOnlineData();
			setInterval(syncOnlineData, 1000*intervalTime*pagesCount);
		}, 1000*intervalTime*2);
	}


	// 同步线上关键词数据
	var syncOnlineData = function () {
		$.getJSON(sync_url, function (words) {
			for (var word in words) {
				word = word.split("-")[0];
				switch (word.length) {
				case 4:
					len4Words.push(word);
					break;
				case 3:
					len2Words.push(word);
					break
				case 2:
					len2Words.push(word);
					break
				case 1:
					len1Words.push(word);
					break;
				default:
					lenGreater4Words.push(word);
					break;
				}
			}
			//字符排序 3个字符往上移
			len2Words = len2Words.sort(function(n1,n2){
				 return n1.length > n2.length;
			});
			/*
				console.log(len4Words);
				console.log(len3Words);
				console.log(len2Words);
				console.log(len1Words);
				console.log(lenGreater4Words);
				console.log(words);
			*/
			var words2 = $("#heart p:not(.w4)"),
				words4 = $("#heart .w4");
			updateKeyWords(words2, 0);
			updateKeyWords4(words4, 0);
		});
	}

	var updateKeyWords = function (words2, index) {
		if (index >= words2.length) return;
		var elem = words2[index];
		$(elem).fadeOut(120, function () {
			updateKeyWords(words2, index + 1);
		}).text(len2Words[index]).fadeIn(180);
	}

	var updateKeyWords4 = function (words4, index) {
		if (index >= words4.length) return;
		var elem = words4[index];
		$(elem).fadeOut(120, function () {
			updateKeyWords4(words4, index + 1);
		}).text(len4Words[index]).fadeIn(180);
	}


	/** 关键字过滤 ***/
	var GFW = function () {
		return false || true;
	}

	var heartBeat = function () {
		if (animate_beart <= 3) {
			if (flag) {
				heart.style.transform = "scale(0.75)" ;
				flag = false;
			} else {
				heart.style.transform = "scale(1)";
				flag = true;
			}
		}
		animate_beart++;
		if (animate_beart == 4) {
			animate_beart = 0;
			clearInterval(heartBeatInterval);
			setTimeout(function () {
				heartBeatInterval = setInterval(heartBeat, 130);
			}, 650);
		}
	}

})(window);
