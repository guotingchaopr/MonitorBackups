$(function () {

	var main_url = "https://csmonitor.alipay.com/admin/getServerTime.json";


	/** 时间戳 ***/
	var date_Element = document.getElementById("dateElement"),
		time_Element = document.getElementById("timeElement");


	/***  主节点  ***/
	var mainNode = document.createElement("P");




	/***  服务配置   URV : 上限  FRV ：下限 ***/
	var server95188 = {
			URV: 10000,
			FRV: 1000,
			visualName: "c_95188"
		},
		serverPC = {
			URV: 20000,
			FRV: 1000,
			visualName: "pc"
		},
		serverWireless = {
			URV: 20000,
			FRV: 1000,
			visualName: "wireless"
		}




	/** 初始化 **/
	var init = function () {

		//主节点
		pollDataForMainNode();

		//服务部分
		var server95188_Val = document.createElement("p"),
			serverPC_Val = document.createElement("p"),
			serverWireless_Val = document.createElement("p");

		server95188_Val.id = "server95188_Val";
		serverPC_Val.id = "serverPC_Val";
		serverWireless_Val.id = "serverWireless_Val";

		server95188_Val.innerText = "接入中";
		serverPC_Val.innerText = "接入中";
		serverWireless_Val.innerText = "接入中";

		server95188_Val.style.top = "780px";
		serverPC_Val.style.top = "1360px";
		serverWireless_Val.style.top = "1860px";

		document.getElementById('serverFlow_main').appendChild(server95188_Val);
		document.getElementById('serverFlow_main').appendChild(serverPC_Val);
		document.getElementById('serverFlow_main').appendChild(serverWireless_Val);
		pollDataForServer();

	}






	/** 主节点数据轮询 ***/
	var pollDataForMainNode = function () {

		/** 时间轮询 **/
		setInterval(function () {
			$.getJSON(main_url + "?callback=?", function (json) {
				var time = util_formatDate(new Date(json));
				date_Element.innerText = time[0];
				time_Element.innerText = time[1];
			});
				/** 主要数据轮询 **/
				$("#mainVal").text((Math.random() * 9999999 >> 0));
		}, 3000);
	}



	/*** 服务数据轮询 ***/
	var pollDataForServer = function () {
		setInterval(function () {
			monitorListener(server95188, (Math.random() * 10000 >> 0));
			monitorListener(serverPC, (Math.random() * 20000 >> 0));
			monitorListener(serverWireless, (Math.random() * 20000 >> 0));
		}, 1000);
	}



	/** 数据监听触发器 **/
	var monitorListener = function (obj, value) {
		var subsection = 0;
		if (obj === server95188) {
			subsection = compareValue(server95188.URV, value);
			server95188_Val.innerText = value;
		} else if (obj === serverPC) {
			subsection = compareValue(serverPC.URV, value);
			serverPC_Val.innerText = value;
		} else {
			subsection = compareValue(serverWireless.URV, value);
			serverWireless_Val.innerText = value;
		}
		visualControl(obj, subsection > 10 ? 10 : subsection);
	}


	/***
		数据比较
		explain： val1 上限值  val2 当前值  返回比较后的所占百分比 1-10
	***/
	var compareValue = function (val1, val2) {
		var sectionVal = val1 / 10;
		return ((val2 / sectionVal) >> 0) + 1;
	}


	/*** 视觉效果控制 ***/
	var visualControl = function (obj, rank) {
		var main_div = document.getElementById(obj.visualName),
			main_ul = main_div.getElementsByTagName("ul")[0];
		$(main_ul).children().css("background", "");
		for (var i = 0; i < rank; i++) {
			var currentElement = main_ul.children[i];
			$(currentElement).css("background", "url(img/" + (i + 1) + ".png)");
		}
	}

	/*** 时间戳转系统时间 ***/
	var util_formatDate = function(now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
		return (year + "/" + month + "/" + date + "|" + hour + ":" + minute).split("|");
	}

	init();
});
