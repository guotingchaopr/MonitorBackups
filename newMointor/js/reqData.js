jQuery(document).ready(function(){
    var totalPoints = 8,   //曲线图总点数
        serverIp = 'https://csmonitor.alipay.com', //线上请求IP地址
        //serverIp = 'http://csmonitor-1.inc.alipay.net', //开发机请求IP地址
        //serverIp = 'http://10.63.68.10',
        CURVEPOINTS = 7,
        deferTime = 60,
        curveRefreshTime = 60 * 60, //曲线图更新时间
        refreshTime = 5;   //数据更新时间

    var random=function(t1,t2,t3){//t1为下限，t2为上限，t3为需要保留的小数位
        function isNum(n){
            return /^\d+$/.test(n);
        }
        if(!t1 || (! isNum(t1)) ){t1=0;}
        if(!t2 || (! isNum(t2)) ){t2=1;}
        if(!t3 || (! isNum(t3)) ){t3=0;}
        t3 = t3>15?15:t3; // 小数位不能大于15位
        var ra = Math.random() * (t2-t1)+t1,du=Math.pow(10,t3);
        ra = Math.round(ra * du)/du;

        return ra;
    }

    //response返回数据处理
    // @return array
    function dataPro(data){
        var result = [], value;
        if(!data || !data.length) return false;
        for(var i = 0, l = data.length - 1; i < l; i++){
            for(var value in data[i].qualifyMap){
                value = data[i].qualifyMap[value] - 0;
            }
            result.push(value);
        }
        return result;
    }

    //水柱动画控制函数
    // @ele 水柱元素
    // @value
    // @maxValue 水柱元素的最大业务值
    function waterSpoutFunc(ele, value, maxValue){
        if(waterSpoutFunc.arguments.length != 3) return;
        var rate = value / maxValue,
            maxHeight = 170,
            adjustHeight = 20,  //图形优雅调整高度
            fixHeight = 75,    //超過此高度，文字位置不想對底部不變
            minHeight = 60,
            height = maxHeight * rate;

        if(rate > 1){
            $(ele).css('height', maxHeight+'px').css('lineHeight', maxHeight+(maxHeight-fixHeight)+'px').text(value);
        }else{
            if(height < minHeight){
                $(ele).text(value).css('height', minHeight+'px').css('lineHeight', minHeight+adjustHeight+'px');
            }else{
                if(height > fixHeight)
                    $(ele).css('height', height+'px').css('lineHeight', height+(height-fixHeight)+'px').text(value);
                else
                    $(ele).css('height', height+'px').css('lineHeight', height+adjustHeight+'px').text(value);

            }
        }
    }


    //热线在线漏斗canvas部分调用
    var rx = new RxPickUpQuantity(),
        zx = new ZxPickUpQuantity();

    //创建接起量部分
    function createValueFunnel(){
        var codes = [
            'MD_RGFW_REXIAN_RENGONG_VISITOR_RESPONSE_DAY',
            'MD_RGFW_REXIAN_ZIYING_DAPAN_VISITOR_RESPONSE_DAY',
            'MD_RGFW_REXIAN_WAIBAO_DAY',
            'MD_RGFW_ZAIXIAN_RENGONG_DAY',
            'MD_CLIVECENTER_WB_DAY',
            'MD_CLIVECENTER_G_06_DAY',
            'MD_CLIVECENTER_YUN_DAY',
            'MD_RGFW_REXIAN_ZIYING_ZJ_VISITOR_INFLOW_DAY',
            'MD_CLIVECENTER_G_07_DAY',
            'MD_CLIVECENTER_G_27_DAY'
        ],
        qualify = [
            'VISITOR_RESPONSE',
            'VISITOR_RESPONSE_SELF',
            'callReady',
            'VISITOR_RESPONSE',
            'VISITOR_RESPONSE',
            'VISITOR_RESPONSE',
            'VISITOR_RESPONSE',
            'VISITOR_INFLOW_TRANSFER',
            'VISITOR_INFLOW',
            'VISITOR_INFLOW'
        ];

        jQuery.getJSON(serverIp + '/admin/getDataByMddCodeProxy.json?codes=' + codes.join(',') + '&qualify=' + qualify.join(',') + '&time=' + deferTime * 1000 + '&callback=?', function(data) {
            var result = dataPro(data);
            updateCallRate('接起量', result[0], result[3], result[7], result[8], result[9]);
            rx.init('rx_canvas', result[0], result[1], result[2]);
            zx.init('zx_canvas', result[3], result[4], result[5], result[6]);
        });
    }

    //人工接起量数据更新函数
    function updateCallRate(t, v1, v2, v3, v4, v5){
        $('.rx_name').removeClass('name-moveFromLeft').addClass('name-moveToLeft');
        $('.zx_name').removeClass('name-moveFromLeft').addClass('name-moveToLeft');
        setTimeout(function(){
            $('.rx_name').text('热线'+t).removeClass('name-moveToLeft').addClass('name-moveFromLeft');
            $('.zx_name').text('热线'+t).removeClass('name-moveToLeft').addClass('name-moveFromLeft');
        }, 700);

        $('.rx_value').text(v1);
        $('.zx_value').text(v2);
        $('.zy_value').text(v3);
        $('.zc_value').text(v4);
        $('.yzj_value').text(v5);
    }

    //人工接通率进度图更新函数
    function updateRateProcess(ele, v){
        var c = Math.ceil(v / 0.2);

        jQuery(ele + ' li').css('backgroundImage', 'url("images/process2.png")');
        for(var i = 1; i <= c; i++){
            jQuery(ele + ' .process' + i).css('backgroundImage', 'url("images/process1.png")');
        }
    }

    //创建接通率部分
    function createRateFunnel(){
        var codes = [
            'MD_RGFW_REXIAN_RENGONG_CONNECTION_RATE_DAY',
            'MD_RGFW_REXIAN_ZIYING_DAPAN_CONNECTION_RATE_SELF_DAY',
            'MD_RGFW_REXIAN_WAIBAO_CONNECTION_RATE_DAY',
            'MD_RGFW_ZAIXIAN_RENGONG_CONNECTION_RATE_DAY',
            'MD_CLIVECENTER_WB_CONNECTION_RATE_DAY',
            'MD_CLIVECENTER_G_06_RATE_DAY',
            'MD_CLIVECENTER_YUN_CONNECTION_RATE_DAY',
            'MD_RGFW_REXIAN_ZIYING_DAPAN_CONNECTION_RATE_DAY',
            'MD_CLIVECENTER_G_07_RATE_DAY',
            'MD_CLIVECENTER_G_27_RATE_DAY'
        ],
        qualify = [
            'CONNECTION_RATE',
            'CONNECTION_RATE_SELF',
            'CONNECTION_RATE',
            'CONNECTION_RATE',
            'CONNECTION_RATE',
            'CONNECTION_RATE',
            'CONNECTION_RATE',
            'CONNECTION_RATE',
            'CONNECTION_RATE',
            'CONNECTION_RATE'
        ];

        jQuery.getJSON(serverIp + '/admin/getDataByMddCodeProxy.json?codes=' + codes.join(',') + '&qualify=' + qualify.join(',') + '&time=' + deferTime * 1000 + '&callback=?', function(data) {
            var result = dataPro(data);
            updateCallRate('接通率', tranPercent(result[0],0) + '%', tranPercent(result[3],0) + '%', tranPercent(result[7],0) + '%', tranPercent(result[8],0) + '%', tranPercent(result[9],0) + '%');
            updateRateProcess('.zy_process', result[7]);
            updateRateProcess('.zc_process', result[8]);
            updateRateProcess('.yzj_process', result[9]);
            rx.init('rx_canvas', null, tranPercent(result[1],0), tranPercent(result[2],0));
            zx.init('zx_canvas', null, tranPercent(result[4],0), tranPercent(result[5],0), tranPercent(result[6],0));
        });
    }

    //漏斗实现数据更新
    createValueFunnel();
    setTimeout(function(){
        createRateFunnel();
    }, refreshTime * 1000);
    setInterval(function(){
        createValueFunnel();
        setTimeout(function(){
            createRateFunnel();
        }, refreshTime * 1000);
    }, refreshTime * 1000 * 2);


    //水柱图控制函数
    function dataNormalUpdate(isFirst){
        var codes = [
            'MD_DAPAN_SELFSERVICE_DAY',
            'MD_DAPAN_REGONG_SERVICE_DAY',
            'MD_DAPAN_REGONG_RESPONSE_DAY',
            'MD_RGFW_REXIAN_RENGONG_VISITOR_INFLOW_DAY',
            'MD_RGFW_ZAIXIAN_RENGONG_DAY',
            'MD_CSIVR_ALIPAY_IN_DAY',
            'MD_PCHALL_DAY',
            'MD_CSCHANNEL_REQ_TERMINAL',
            'MD_CSCHANNEL_REQ_TERMINAL',
            'MD_WSHALL_DAY'
        ],
            qualify = [
            'VISITOR_INFLOW',
            'VISITOR_INFLOW',
            'VISITOR_RESPONSE',
            'VISITOR_INFLOW',
            'VISITOR_INFLOW',
            'ENTRANCE',
            'VISITOR_INFLOW',
            'PC',
            'WS',
            'VISITOR_INFLOW'
        ];

        jQuery.getJSON(serverIp + '/admin/getDataByMddCodeProxy.json?codes=' + codes.join(',') + '&qualify=' + qualify.join(',') + '&time=' + deferTime * 1000 + '&callback=?', function(data) {
            var result = dataPro(data);

            jQuery('.self_service_value').text(result[0]);
            jQuery('.total_callin_value').text(result[1]);
            jQuery('.total_callsuccess_value').text(result[2]);
            waterSpoutFunc('.rx_callin .fill_block', result[3], 150000);
            waterSpoutFunc('.zx_callin .fill_block', result[4], 150000);
            waterSpoutFunc('.zfb_callin .fill_block', result[5], 1500000);
            waterSpoutFunc('.pcdt_callin .fill_block', result[6], 1500000);
            waterSpoutFunc('.pcxb_callin .fill_block', result[7], 1500000);
            waterSpoutFunc('.wxxb_callin .fill_block', result[8], 1500000);
            waterSpoutFunc('.wxdt_callin .fill_block', result[9], 1500000);

            if(isFirst){
                //河流图调用
                DtSetStream.render([130, 98, 90, 130, 86, 129, 102], [{
                    data: 500,
                    maxData: 600
                }, {
                    data: 1000,
                    maxData: 8000
                }, {
                    data: 1000,
                    maxData: 8000
                }, {
                    data: 400,
                    maxData: 800
                }, {
                    data: 4000,
                    maxData: 8000
                }]);
            } else {
                //河流图数据更新
                DtSetStream.update([150, 88, 100, 100, 70, 110, 112], [{
                    data: 300,
                    maxData: 600
                }, {
                    data: 5000,
                    maxData: 8000
                }, {
                    data: 3000,
                    maxData: 8000
                }, {
                    data: 200,
                    maxData: 800
                }, {
                    data: 5000,
                    maxData: 8000
                }]);
            }
        });
    }

    dataNormalUpdate(true);
    setInterval(function(){
        dataNormalUpdate();
    }, refreshTime * 1000);

    /* 曲线图首次请求和计算 */
    function curveFirstRequest(){
        var rxcallin = [],
            zxcallin = [],
            currentTime = 0,
            delayTime = 0,
            rxcallRate = [],
            zxcallRate = [];

        var codes = [
            'MD_RGFW_REXIAN_RENGONG_VISITOR_INFLOW_DAY',
            'MD_RGFW_ZAIXIAN_RENGONG_DAY',
            'MD_RGFW_REXIAN_RENGONG_VISITOR_RESPONSE_DAY',
            'MD_RGFW_ZAIXIAN_RENGONG_DAY'
        ],
            qualify = [
            'VISITOR_INFLOW',
            'VISITOR_INFLOW',
            'VISITOR_RESPONSE',
            'VISITOR_RESPONSE'
        ];

        for(var i = CURVEPOINTS; i >= 0; i--){
            delayTime = i * 60 * 60 * 1000 + deferTime * 1000;
            (function(i){
                jQuery.getJSON(serverIp + '/admin/getDataByMddCodeProxy.json?codes=' + codes.join(',') + '&qualify=' + qualify.join(',') + '&time=' + delayTime + '&callback=?', function(data) {
                    var result = dataPro(data);
                    rxcallin[CURVEPOINTS - i] = result[0];
                    zxcallin[CURVEPOINTS - i] = result[1];
                    rxcallRate[CURVEPOINTS - i] = result[2];
                    zxcallRate[CURVEPOINTS - i] = result[3];
                    if(i == 0)
                        currentTime = !!data[4] && !!data[4].time ? data[4].time : (new Date()).getTime();
                });
            })(i);
        }

        var curveIntervalId = setInterval(function(){
            var r = true;
            for(var i = CURVEPOINTS; i >= 0; i--){
                if(rxcallin[i] === undefined)
                    r = false;
            }
            if(r){
                clearInterval(curveIntervalId);
                var rx_values = calculateCurvePoint(rxcallin),
                    zx_values = calculateCurvePoint(zxcallin),
                    rx_rates = calculateRatePoint(rx_values, calculateCurvePoint(rxcallRate)),
                    zx_rates = calculateRatePoint(zx_values, calculateCurvePoint(zxcallRate));

                alterCurveValue('r', timeQuantum(currentTime), rx_values[CURVEPOINTS-1], tranPercent(rx_rates[CURVEPOINTS-1], 0)+'%');
                alterCurveValue('z', timeQuantum(currentTime), zx_values[CURVEPOINTS-1], tranPercent(zx_rates[CURVEPOINTS-1], 0)+'%');
                //调用曲线图
                createCurve('rx_callin_container', rx_values, rx_rates);
                createCurve('zx_callin_container', zx_values, zx_rates);
            }
        }, 500);

        setInterval(function(){
            jQuery.getJSON(serverIp + '/admin/getDataByMddCodeProxy.json?codes=' + codes.join(',') + '&qualify=' + qualify.join(',') + '&time=' + deferTime * 1000 + '&callback=?', function(data) {
                var result = dataPro(data);
                rxcallin.push(result[0]);rxcallin.shift();
                zxcallin.push(result[1]);zxcallin.shift();
                rxcallRate.push(result[2]);rxcallRate.shift();
                zxcallRate.push(result[3]);zxcallRate.shift();

                var rx_values = calculateCurvePoint(rxcallin),
                    zx_values = calculateCurvePoint(zxcallin),
                    rx_rates = calculateRatePoint(rx_values, calculateCurvePoint(rxcallRate)),
                    zx_rates = calculateRatePoint(zx_values, calculateCurvePoint(zxcallRate));

                currentTime = !!data[4] && !!data[4].time ? data[4].time : (new Date()).getTime();

                createCurve('rx_callin_container', rx_values, rx_rates);
                createCurve('zx_callin_container', zx_values, zx_rates);
                alterCurveValue('r', timeQuantum(currentTime), rx_values[CURVEPOINTS-1], tranPercent(rx_rates[CURVEPOINTS-1], 0)+'%');
                alterCurveValue('z', timeQuantum(currentTime), zx_values[CURVEPOINTS-1], tranPercent(zx_rates[CURVEPOINTS-1], 0)+'%');
            });
        }, curveRefreshTime * 1000);
    }

    //计算曲线图时间段呼入量的差值
    function calculateCurvePoint(arr){
        var result = [];
        for(var i = 0, l = arr.length; i < l - 1; i++){
            result.push(arr[i + 1] - arr[i]);
        }
        return result;
    }

    //计算曲线图时间段接通率的值
    function calculateRatePoint(callin, suc){
        var result = [];
        for(var i = 0, l = callin.length; i < l; i++){
            if(callin[i] != 0)
                result.push(suc[i] / callin[i]);
            else
                result.push(0);
        }
        return result;
    }

    //百分数转换
    function tranPercent(num, digit){
        var v = Math.pow(10, parseInt(digit));
        return Math.floor(num * (100 * v))/v;
    }

    //返回时间段函数（9:22-10:22）
    function timeQuantum(t){
        var st = new Date(t - curveRefreshTime * 1000),
            et = new Date(t - 0),
            ss = st.getMinutes(),
            es = et.getMinutes();
        return st.getHours() + ':' + (ss >= 10 ? ss : '0' + ss) + '-' + et.getHours() + ':' + (es >= 10 ? es : '0' + es);
    }

    //修改曲线图的显示值
    function alterCurveValue(wh, t, v, r){
        $('.' + wh + 'x_time').text(t);
        $('.' + wh + 'x_callin_value').text(v);
        $('.' + wh + 'x_callrate_value').text(r);
    }

    curveFirstRequest();

});
