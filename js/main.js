$(function () {
	var single_url = "http://10.63.68.13/admin/getMddAllQfsProxy.json",
		url = "http://10.63.68.13/admin/getDataByMddCodeProxy.json",
		mddCode_BAZX = "MD_RGFW_REXIAN_ZIYING_HZ_QZDY_ZL_CONNECTION_RATE_DAY", //报案专线
		mddCode_BAZX_QF = "CONNECTION_RATE_SELF", //报案专线qualifiers
		mddCode_RXJTL = "MD_RGFW_REXIAN_MBZT_CONNECTION_RATE_DAY", //热线接通率
		mddCode_RXJTL_QF = "CONNECTION_RATE", //热线接通率qualifiers
		mddCode_AQYWJTL = "MD_CLIVECENTER_G_06_RATE_DAY", //安全线接通率
		mddCode_AQYWJTL_QF = "CONNECTION_RATE", //安全线接通率qualifiers
		mddCode_RXFW = "MD_RGFW_MBZT_REXIAN_SERVICE_PROPORTION", //饼图热线服务
		mddCode_RXFW_QF = "SERVICE_PROPORTION", //饼图热线服务qualifiers
		mddCode_ZXFW = "MD_RGFW_MBZT_ZAIXIAN_SERVICE_PROPORTION", //饼图在线服务
		mddCode_ZXFW_QF = "SERVICE_PROPORTION", //饼图在线服务qualifiers
		mddCode_ZZFW = "MD_RGFW_MBZT_CSCHANNEL_SERVICE_PROPORTION", //饼图自助服务
		mddCode_ZZFW_QF = "SERVICE_PROPORTION", //饼图自助服务qualifiers
		mddCode_Target = "MD_RGFW_MBZT_VISITOR_RESPONSE_SUM", //目标量 翻牌 柱状图 TODO:待跟进
		mddCode_QF = "SERVICE_PROPORTION",
		delayTime =  60,//单位秒
		refreshTimes = 1000 * 60; //刷新时间
	var codes = mddCode_BAZX + "," + mddCode_RXJTL + "," + mddCode_AQYWJTL + "," +  mddCode_RXFW +"," + mddCode_ZXFW + "," +  mddCode_ZZFW + mddCode_Target,
		qualify = mddCode_BAZX_QF + "," + mddCode_RXJTL_QF + "," + mddCode_AQYWJTL_QF + "," + mddCode_RXFW_QF + "," + mddCode_ZXFW_QF + "," +  mddCode_ZZFW_QF + "," + mddCode_QF;
	window.t = new target("columPic", 300, 150, 50);

	var origVal, ts = [],
		origArr = [],
		arr = [];
	var h = parseInt($('.digit-top').height());
	var getTime = function () {
		return new Date().getTime() - ( delayTime * 1000);
	}

	function getTargetRate() {
		$.getJSON(url + "?codes=" + codes + "&qualify=" + qualify + "&time=" + getTime() + "&callback=?", function (json) {
			if(json[0])
			$(".serverValue").eq(0).text((json[0].qualifyMap[mddCode_BAZX_QF] * 100).toFixed(2) + "%");
			if(json[1])
			$(".serverValue").eq(1).text((json[1].qualifyMap[mddCode_RXJTL_QF] * 100).toFixed(2) + "%");
			if(json[2])
			$(".serverValue").eq(2).text((json[2].qualifyMap[mddCode_AQYWJTL_QF] * 100).toFixed(2) + "%");
			if(json[3] && json[4] && json[5])
			syncPieData(
				json[3].qualifyMap[mddCode_RXFW_QF],
				json[4].qualifyMap[mddCode_ZXFW_QF],
				json[5].qualifyMap[mddCode_ZZFW_QF]
			);
			if(json[6])
			t.drawYAxis(json[6].qualifyMap[mddCode_QF] * 1 / 10000);
		});

	}
	//目标翻牌
	var interId = setInterval(function () {
		$.getJSON(single_url + "?mddCode=" + mddCode_Target + "&qualifiers=" + mddCode_QF + "&queryTime=" + getTime() + "&callback=?", function (json) {
			for (var key in json) {
				dataHandler(json[key][1]);
				console.log(json[key][1]);
			}
		});
	}, 5000);
	getTargetRate();
	var getTargetRateInterval = setInterval(getTargetRate, refreshTimes);


	function down(e, mh, random) {
		var r = random,
			t;
		var v = parseInt($(e).css('marginTop')) - mh;

		if (v >= -h) {
			$(e).css('marginTop', v + 'px');
			t = setTimeout(function () {
				down(e, mh, r);
			}, 20);
		} else {
			ts.push(t);
			$(e).css('marginTop', 0).html(r);
		}
	}

	function dataHandler(data) {
		origArr = arr ? arr : [];
		arr = [];
		data = data + '';
		var len = data.length,
			tstr = '';

		if (len < 8) {

			for (var t = 0, n = 8 - len; t < n; t++) {
				tstr += '0';
			}
		}
		data = tstr + data;
		for (var i = 0; i <= 7; i++) {
			/*random = Math.floor(Math.random() * 10);
					random = i <= 2 ? 0 : random;*/
			arr.push(data[i]);
		}
		ts = [];
		for (var k = 0, l = ts.length; k < l; k++) {
			clearTimeout(ts[k]);
		}

		for (var j = 0; j < 8; j++) {
			if (origArr.join('') === arr.join('')) return;
			$('.digit-down')[j].innerHTML = arr[j];
			if (origArr[j] != arr[j])
				down($('.digit-top')[j], 3, arr[j]);
		}
	}



	Highcharts.setOptions({
		colors: ['#3B213B']
	});


	function syncPieData(hot,online,selfHelp) {
		//饼图
		$('#container').highcharts({
			chart: {
				backgroundColor: 'rgba(255, 255, 255, 0)',
				margin: [5, 5, 5, 5],
				spacingTop: 0,
				spacingBottom: 0,
				spacingLeft: 0,
				spacingRight: 0,
				type: 'pie'
			},

			tooltip: {
				enabled: false
			},

			title: {
				text: null
			},

			credits: {
				enabled: false
			},

			plotOptions: {
				pie: {
					allowPointSelect: false,
					borderWidth: 3,
					slicedOffset: 3, //块之间的位移距离
					innerSize: '15%',
					borderColor: '#375F98',
					dataLabels: {
						useHTML: true,
						enabled: true,
						color: '#FFFFFF',
						connectorWidth: 0, //label连接线
						distance: -135, //label连接线长度
						connectorColor: '#9EC4EA',
						formatter: function () {
							return '<span class="custom-label">' + this.point.name + '</span><br/><span class="custom-label">' + this.point.y + '% </span>';
						}
					}
				},
				series: {}
			},

			series: [{
				data: [
					{
						name: '热线服务',
						y: hot
                },
					{
						name: '在线服务',
						y: online

                },
					{
						name: '自助服务',
						y: selfHelp
                }
            ]
        }]
		});
	}
});
