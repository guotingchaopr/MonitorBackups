(function (global) {
	var _window = global,
		url = "http://10.63.68.20/admin/getDataByMddCodeProxy.json";


	//时间
	var getTime = function () {
			var time = new Date().getTime() - 120 * 1000;;
			console.log(time);
			return time;
		}
		/***	字段坐标配置		****/
	var field_config = {
		selfSearchVal: { //自助搜索
			x: 375,
			y: 470
		},
		onlineSelfVal: { //在线自助
			x: 580,
			y: 630
		},
		pcOnlineVal: {
			x: 730,
			y: 355
		},
		onlineServerVal: {
			x: 740,
			y: 120
		},
		wireless2onlineVal: {
			x: 979,
			y: 468
		},
		wirelessServerVal: {
			x: 1230,
			y: 260
		},
		hotServerVal: {
			x: 1528,
			y: 150
		}
	};



	/*** 底部参数坐标配置	****/
	var node_configs = {
		//节点部分配置
		serverLobby: {
			x: 140,
			y: 555
		},
		pc: {
			x: 490,
			y: 360
		},
		onlineServer: {
			x: 770,
			y: 550
		},
		wireless: {
			x: 1020,
			y: 360
		},
		countServer: {
			x: 1210,
			y: 140
		},
		hotServer: {
			x: 1350,
			y: 550
		},
		95188: {
			x: 1670,
			y: 360
		}, //节点部分结束
		knowLedge: {
			x: 120,
			y: 705
		},
		xiaoBaoCount: { // 小宝机器人汇总
			x: 380,
			y: 695
		},
		xiaoBaoAccurate: {
			x: 430,
			y: 740
		},
		xiaoBaoRecommend: {
			x: 430,
			y: 795
		},
		xiaoBaoSearch: {
			x: 430,
			y: 860
		},
		selfTurnArtificial: { //自助转人工服务
			x: 605,
			y: 840
		},
		artificialeService: { //人工客服汇总
			x: 820,
			y: 695,
			mdd_code: 'MD_CLIVECENTER_G_RGFW_ZAIXIAN_DAY',
			qualify: 'VISITOR_RESPONSE'
		},
		selfSupportOnline: { //自营在线
			x: 870,
			y: 765,
			mdd_code: 'MD_CLIVECENTER_G_RGFW_ZAIXIAN_ZIYING_DAY',
			qualify: 'VISITOR_RESPONSE'
		},
		cloudService: { //云客服
			x: 870,
			y: 840,
			mdd_code: 'MD_CLIVECENTER_G_RGFW_ZAIXIAN_ZHILIAN_YUNKEFU_DAY',
			qualify: 'VISITOR_RESPONSE'
		},
		epibolyOnline: { //外包在线
			x: 870,
			y: 920,
			mdd_code: 'MD_CLIVECENTER_G_29_DAY',
			qualify: 'VISITOR_RESPONSE'
		},
		supportInflow: { //支持线的流入量
			x: 1005,
			y: 865,
			mdd_code: 'MD_CLIVECENTER_G_07_DAY',
			qualify: 'VISITOR_RESPONSE'
		},
		ivr_Count: { //IVR汇总
			x: 1200,
			y: 705
		},
		hotLineTurnSelf : {  // 热线转自营
			x: 1400,
			y: 700
		},
		hotLineTurnAritficial : {  // 热线转人工
			x: 1400,
			y: 890
		},
		selfSupport: { //自营
			x: 1660,
			y: 740,
			mdd_code: 'MD_RGFW_REXIAN_ZIYING_DAPAN_VISITOR_RESPONSE_DAY',
			qualify: 'VISITOR_RESPONSE_SELF'
		},
		huaFan: { // 华泛
			x: 1660,
			y: 795,
			mdd_code: 'MD_RGFW_REXIAN_WAIBAO_HUAFAN_DAY',
			qualify: 'callReady'
		},
		taiYing: { // 太盈
			x: 1660,
			y: 845,
			mdd_code: 'MD_RGFW_REXIAN_WAIBAO_TAIYIN_DAY',
			qualify: 'callReady'
		},
		wanSheng: { // 万声
			x: 1660,
			y: 890,
			mdd_code: 'MD_RGFW_REXIAN_WAIBAO_WANSHENG_DAY',
			qualify: 'callReady'
		},
		huaTuo: { // 华拓
			x: 1660,
			y: 940,
			mdd_code: 'MD_RGFW_REXIAN_WAIBAO_HUATUO_DAY',
			qualify: 'callReady'
		},
		epibloyTrunSelfSelf: { //外包转自营
			x: 1795,
			y: 710,
			mdd_code: 'MD_RGFW_REXIAN_ZIYING_FROMBPO_ZJ_VISITOR_INFLOW_DAY',
			qualify: 'SERVER_TRANSFER_OUT'
		},
		artificialSum: {  //人工客服汇总
			x: 1620,
			y: 695,
			mdd_code: 'MD_RGFW_REXIAN_DAPAN_VISITOR_RESPONSE_DAY',
			qualify: 'VISITOR_RESPONSE'
		}
	}

	var elements = [],
		codes = [],
		qulifys = [];
	_window.onload = function () {
		//createElement(node_configs);
		for (var node in node_configs) {
			var mdd_code = node_configs[node].mdd_code,
				qualify = node_configs[node].qualify;
			if (mdd_code) {
				codes.push(mdd_code);
			}
			if (qualify) {
				qulifys.push(qualify);
			}
		}
		createElement(node_configs);
		fillValues();
		setInterval(fillValues, 5 * 1000);
	}

	var fillValues = function () {
		$.getJSON(url + "?codes=" + codes + "&qualify=" + qulifys + "&time=" + getTime() + "&callback=?", function (json) {
			for (var data in json) {
				for (var index in elements) {
					var key = elements[index];
					elem = document.getElementById(key);
					if (node_configs[key].mdd_code && node_configs[key].mdd_code == json[data].mddCode) {
						elem.innerText = json[data].qualifyMap[elem.name];
						console.log("名称： " + json[data].mddCode  + " 值 ：" + json[data].qualifyMap[elem.name]);
					}
					delete elem;
				}
			}
		});
	}



	var createElement = function (configs) {
		var element_Fragment = document.createDocumentFragment(); //统一缓存
		for (var node in configs) {
			var element = document.createElement("p");
			element.id = node;
			element.name = configs[node].qualify;
			element.style.position = "absolute";
			element.style.color = "yellow";
			element.style.fontSize = "28px";
			element.style.left = configs[node].x + "px";
			element.style.top = configs[node].y + "px";
			element.innerText = "接入中";
			element_Fragment.appendChild(element);
			elements.push(node);
		}
		document.body.appendChild(element_Fragment);
		delete element_Fragment;
	}

})(window);
