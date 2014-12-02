$(function () {

	var main_url = "https://csmonitor.alipay.com/admin/getServerTime.json";
	var url_95188 = "http://10.14.53.226:8888/sentiment/hotline.htm";
	var server_url = "https://csmonitor.alipay.com/admin/getDataByMddCodeProxy.json";

	/** 时间戳 ***/
	var date_Element = document.getElementById("dateElement"),
		time_Element = document.getElementById("timeElement");


	/***  主节点  ***/
	var mainNode = document.createElement("P"),
		mainNode_URV = 2000000, //主节点高度上限
		main_MddCODE = "MD_DAPAN_VISITOR_INFLOW_DAY",
		main_QULIFY  = "VISITOR_INFLOW",
		circleCanvas = document.getElementById("circleCanvas").getContext("2d");
	var beginPoint = 180; //主节点开始弧度
	var effects_Loop = 0; //大圈效果

	/***  服务配置   URV : 上限  FRV ：下限 ***/
	var server95188 = {
			URV: 600000,
			FRV: 1000,
			visualName: "c_95188"
		},
		serverPC = {
			URV: 600000,
			FRV: 1000,
			visualName: "pc",
			MDD_CODE: "MD_PC_VISITOR_INFLOW_DAY",
			QULIFY: "VISITOR_INFLOW"
		},
		serverWireless = {
			URV: 600000,
			FRV: 1000,
			visualName: "wireless",
			MDD_CODE: "MD_WS_VISITOR_INFLOW_DAY",
			QULIFY: "VISITOR_INFLOW"
		}




	/** 初始化 **/
	var init = function () {

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

		handleData(); //初始化调动一波
		pollDataForServer();

	}




	/** 主节点数据轮询 ***/
	var pollDataForMainNode = function (value) {
		/** 主要数据轮询 **/
		mainCircleProgress(value);
		$("#mainVal").text(value);
	}


	/** 主节点圆形进度动画 **/
	var mainCircleProgress = function (value) {
		var sigleNodeVal = mainNode_URV / 100 >> 0, //单节点值
			percent = value / sigleNodeVal >> 0; //当前百分比
		percent = percent >= 100 ? 99 : percent;

		//当前换算后节点
		var current_end_point = ((percent * 0.01) * 360 * Math.PI / beginPoint) - (beginPoint - 2) * Math.PI / beginPoint,
			current_action_point = (beginPoint + 2) * Math.PI / beginPoint;

		//console.log(sigleNodeVal + " : " + percent + " : " + current_end_point);


		//重绘
		circleCanvas.clearRect(0, 0, 420, 420);
		circleCanvas.beginPath();
		circleCanvas.arc(198, 200, 168, current_action_point, current_end_point, 0);
		circleCanvas.strokeStyle = "#57c8da";
		circleCanvas.lineWidth = "45";
		circleCanvas.stroke();
		circleCanvas.closePath();
		if (effects_Loop!=0)clearInterval(effects_Loop);
		if (percent < 98) circleProgressEffects(percent);
	}

	/*** 大圈特效 ***/
	var circleProgressEffects = function (value) {
		var tmp_value = value + 0.2;
		effects_Loop = setInterval(function () {
			if (tmp_value > value) {
				tmp_value = tmp_value - 0.2;
			} else {
				tmp_value = tmp_value + 0.2;
			}
			var current_end_point = ((tmp_value * 0.01) * 360 * Math.PI / beginPoint) - (beginPoint - 2) * Math.PI / beginPoint,
				current_action_point = (beginPoint + 2) * Math.PI / beginPoint;

			//特效重绘
			circleCanvas.clearRect(0, 0, 420, 420);
			circleCanvas.beginPath();
			circleCanvas.arc(198, 200, 168, current_action_point, current_end_point, 0);
			circleCanvas.strokeStyle = "#57c8da";
			circleCanvas.lineWidth = "45";
			circleCanvas.stroke();
			circleCanvas.closePath();
		}, 500);
	}

	/*** 服务数据轮询 ***/
	var pollDataForServer = function () {
		setInterval(function () {
			handleData();
		}, 5000);
	}

	/**
	   数据组装
	 **/
	var handleData = function () {
		var codes = [main_MddCODE,serverPC.MDD_CODE, serverWireless.MDD_CODE],
			qulifys = [main_QULIFY,serverPC.QULIFY, serverWireless.QULIFY];

		$.getJSON(url_95188 + "?callback=?", function (json) {
			monitorListener(server95188, json.total);
		});

		$.getJSON(server_url + "?codes=" + codes + "&qualify=" + qulifys + "&time=" + getTime() + "&callback=?", function (json) {
			pollDataForMainNode(json[0].qualifyMap.VISITOR_INFLOW);
			monitorListener(serverPC, json[1].qualifyMap.VISITOR_INFLOW);
			monitorListener(serverWireless, json[2].qualifyMap.VISITOR_INFLOW);
		});

		/** 时间轮询 **/
		$.getJSON(main_url + "?callback=?", function (json) {
			var time = util_formatDate(new Date(json));
			date_Element.innerText = time[0];
			time_Element.innerText = time[1];
		});
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
			$(currentElement).css("background", "url(images/" + (i + 1) + ".png)");
		}
	}

	/*** 时间戳转系统时间 ***/
	var util_formatDate = function (now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
		return (year + "/" + month + "/" + date + "|" + hour + ":" + minute).split("|");
	}

	init();


	function getTime(){
		var time = 60 * 1000;
		//console.log(time);
		return time;
	}
});
