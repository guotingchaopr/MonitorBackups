/* 热线漏斗canvas部分 */
function RxPickUpQuantity(){}

RxPickUpQuantity.prototype = {
    data: {
        dataHeight: 0,
        zyWidth: 0,
        wbWidth: 0
    },
    config: {
        //值范围配置
        pickUpMaxValue: 140000,
        rxzyMaxValue: 130000,
        rxwbMaxValue: 130000,

        items: 2,
        levelHeight: 70,    //水平矩形高度（值块）
        levelMaxWidth: 340,     //水平矩形最大宽度（值块）
        canvasHeight: 170,     //canvas高度
        intervalLineWidth: 2,   //漏斗之间间隔线宽度
        funnelColor: 'rgba(42, 88, 101, 0.8)',  //漏斗顏色
        funnelWidth: 100,   //漏斗宽度
        horizontalWidth: 12,    //连接竖柱宽度
        horizontalColor: '#57c8da'
    },
    init: function(ele, pickUpValue, zyv, wbv){     //@ pickUpValue 后台传入的
        var c = this.config,
            d = this.data;
        var pickUpHeight = (pickUpValue / c.pickUpMaxValue) * c.canvasHeight,
            zyWidth = (zyv / c.rxzyMaxValue) * c.levelMaxWidth,
            wbWidth = (wbv / c.rxwbMaxValue) * c.levelMaxWidth;

        pickUpHeight = pickUpHeight > c.canvasHeight ? c.canvasHeight : pickUpHeight;
        zyWidth = zyWidth > c.levelMaxWidth ? c.levelMaxWidth : zyWidth;
        wbWidth = wbWidth > c.levelMaxWidth ? c.levelMaxWidth : wbWidth;//大于最大值取最大值

        d.dataHeight = pickUpValue ? pickUpHeight : d.dataHeight;
        d.zyWidth = pickUpValue ? zyWidth : d.zyWidth;
        d.wbWidth = pickUpValue ? wbWidth : d.wbWidth;

        this.ele = document.getElementById(ele);
        this.eleContext = this.ele.getContext('2d');
        var context = this.eleContext;

        context.font="32px Aldrich";
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.drawHorizontal(context, c.canvasHeight, d.dataHeight);
        this.drawRx(context, c.canvasHeight, d.dataHeight, c.items, c.horizontalWidth, c.funnelWidth, c.canvasHeight, c.levelHeight, c.intervalLineWidth);
        this.drawRxLevel(context, c.canvasHeight, d.zyWidth, d.wbWidth, c.items, c.horizontalWidth, c.funnelWidth, c.canvasHeight, c.levelHeight, c.intervalLineWidth, zyv, wbv, pickUpValue);

    },
    drawHorizontal: function(ec, th, h){
        var hw = this.config.horizontalWidth;
        ec.fillStyle = this.config.horizontalColor;
        ec.beginPath();
        ec.fillRect(0, th - h, hw, h);
        ec.closePath();
        ec.fill();
    },
    drawRx: function(ec, th, h, items, hw, fw, lm, lh, iw){
        ec.fillStyle = this.config.funnelColor;
        ec.beginPath();
        ec.moveTo(hw + 1, th - h - 1);
        ec.lineTo(hw + fw, lm - items * lh - (items - 1) * iw);
        ec.lineTo(hw + fw, lm - items * lh - (items - 1) * iw + lh);
        ec.lineTo(hw + 1, th - h / 2 - iw / 2);

        ec.moveTo(hw + 1, th - h / 2 + iw / 2);
        ec.lineTo(hw + fw, th - lh);
        ec.lineTo(hw + fw, th);
        ec.lineTo(hw + 1, th);
        ec.closePath();
        //ec.stroke();
        ec.fill();
    },
    drawRxLevel: function(ec, th, zyw, wbw, items, hw, fw, lm, lh, iw, zyValue, wbValue, pickUpValue){
        var zyLen = ((pickUpValue ? zyValue : zyValue + '%') + '').length,
            wbLen = ((pickUpValue ? wbValue : wbValue + '%') + '').length,
            d = this.data,
            zyActual = zyw > (zyLen * 22 + 22) ? zyw : zyLen * 22 + 22,
            wbActual = wbw > (wbLen * 22 + 22) ? wbw : wbLen * 22 + 22;

        d.zyWidth = pickUpValue ? zyActual : d.zyWidth;
        d.wbWidth = pickUpValue ? wbActual : d.wbWidth;

        ec.fillStyle = this.config.horizontalColor;
        ec.beginPath();
        ec.fillRect(hw + fw, lm - items * lh - (items - 1) * iw, d.zyWidth, lh);
        ec.fillRect(hw + fw, th - lh, d.wbWidth, lh);

        ec.font = "32px Aldrich";
        ec.fillStyle = '#000';
        ec.fillText(pickUpValue ? zyValue : zyValue + '%', hw + fw + d.zyWidth - zyLen * 22 - 12, lm - items * lh - (items - 1) * iw + 48);
        ec.fillText(pickUpValue ? wbValue : wbValue + '%', hw + fw + d.wbWidth - wbLen * 22 - 12, th - lh + 48);
        ec.closePath();
        //ec.stroke();
        ec.fill();
    }
};

/* 在线漏斗canvas部分 */
function ZxPickUpQuantity(){}

ZxPickUpQuantity.prototype = {
    data: {
        dataHeight: 0,
        wbWidth: 0,
        aqWidth: 0,
        yzxWidth: 0
    },
    config: {
        //值范围配置
        pickUpMaxValue: 150000,
        zxwbMaxValue: 140000,
        zxaqMaxValue: 110000,
        zxyzxMaxValue: 120000,

        items: 3,
        levelHeight: 70,    //水平矩形高度（值块）
        levelMaxWidth: 340,     //水平矩形最大宽度（值块）
        canvasHeight: 215,     //canvas高度
        intervalLineWidth: 2,   //漏斗之间间隔线宽度
        funnelColor: 'rgba(42, 88, 101, 0.8)',  //漏斗顏色
        funnelWidth: 100,   //漏斗宽度
        horizontalWidth: 12,    //连接竖柱宽度
        horizontalBottom: 35,   //连接竖柱离云在线底边的垂直高度
        horizontalColor: '#57c8da'
    },
    init: function(ele, pickUpValue, wbv, aqv, yzxv){     //@ pickUpValue 后台传入的
        var c = this.config,
            d = this.data;
        var pickUpHeight = (pickUpValue / c.pickUpMaxValue) * (c.canvasHeight - c.horizontalBottom),
            wbWidth = (wbv / c.zxwbMaxValue) * c.levelMaxWidth,
            aqWidth = (aqv / c.zxaqMaxValue) * c.levelMaxWidth,
            yzxWidth = (yzxv / c.zxyzxMaxValue) * c.levelMaxWidth;

        pickUpHeight = pickUpHeight > (c.canvasHeight - c.horizontalBottom) ? (c.canvasHeight - c.horizontalBottom) : pickUpHeight;
        wbWidth = wbWidth > c.levelMaxWidth ? c.levelMaxWidth : wbWidth;//大于最大值取最大值
        aqWidth = aqWidth > c.levelMaxWidth ? c.levelMaxWidth : aqWidth;
        yzxWidth = yzxWidth > c.levelMaxWidth ? c.levelMaxWidth : yzxWidth;

        d.dataHeight = pickUpValue ? pickUpHeight : d.dataHeight;
        d.wbWidth = pickUpValue ? wbWidth : d.wbWidth;
        d.aqWidth = pickUpValue ? aqWidth : d.aqWidth;
        d.yzxWidth = pickUpValue ? yzxWidth : d.yzxWidth;

        this.ele = document.getElementById(ele);
        this.eleContext = this.ele.getContext('2d');
        var context = this.eleContext;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.drawHorizontal(context, c.canvasHeight, d.dataHeight, c.horizontalBottom);
        this.drawZx(context, c.canvasHeight, d.dataHeight, c.items, c.horizontalWidth, c.funnelWidth, c.canvasHeight, c.levelHeight, c.intervalLineWidth, c.horizontalBottom);
        this.drawZxLevel(context, c.canvasHeight, d.wbWidth, d.aqWidth, d.yzxWidth, c.items, c.horizontalWidth, c.funnelWidth, c.canvasHeight, c.levelHeight, c.intervalLineWidth, wbv, aqv, yzxv, pickUpValue);

    },
    drawHorizontal: function(ec, th, h, hb){
        var hw = this.config.horizontalWidth;
        ec.fillStyle = this.config.horizontalColor;
        ec.beginPath();
        ec.fillRect(0, th - h - hb, hw, h);
        ec.closePath();
        ec.fill();
    },

    /* 描绘在线的漏斗图形 */
    // @th canvas总高
    // @h  连接竖柱高度
    // @hw 连接竖柱宽度
    // @fw 漏斗宽度
    // @lm 水平柱图最大宽度
    // @lh 水平柱图高度
    // @iw 水平柱图之间的间隔高度
    // @hb 连接竖柱离云在线底边的垂直高度
    drawZx: function(ec, th, h, items, hw, fw, lm, lh, iw, hb){
        ec.fillStyle = this.config.funnelColor;
        ec.beginPath();
        ec.moveTo(hw + 1, th - h - hb - 1);
        ec.lineTo(hw + fw, 0);
        ec.lineTo(hw + fw, lh);
        ec.lineTo(hw + 1, th - hb - (h - iw * (items - 1)) / items * 2 - iw * 2);

        ec.moveTo(hw + 1, th - hb - (h - iw * (items - 1)) / items * 2 - iw * 2 + iw);
        ec.lineTo(hw + fw, lh + iw);
        ec.lineTo(hw + fw, lh * 2 + iw);
        ec.lineTo(hw + 1, th - hb - (h - iw * (items - 1)) / items - iw);

        ec.moveTo(hw + 1, th - hb - (h - iw * (items - 1)) / items);
        ec.lineTo(hw + fw, lh * 2 + iw * 2);
        ec.lineTo(hw + fw, lh * 3 + iw * 2);
        ec.lineTo(hw + 1, th - hb);

        ec.closePath();
        //ec.stroke();
        ec.fill();
    },
    drawZxLevel: function(ec, th, wbw, aqw, yzxw, items, hw, fw, lm, lh, iw, wbValue, aqValue, yzxValue, pickUpValue){
        var wbLen = ((pickUpValue ? wbValue : wbValue + '%') + '').length,
            aqLen = ((pickUpValue ? aqValue : aqValue + '%') + '').length,
            yzxLen = ((pickUpValue ? yzxValue : yzxValue + '%') + '').length,
            d = this.data,
            wbActual = wbw > (wbLen * 22 + 22) ? wbw : wbLen * 22 + 22,
            aqActual = aqw > (aqLen * 22 + 22) ? aqw : aqLen * 22 + 22,
            yzxActual = yzxw > (yzxLen * 22 + 22) ? yzxw : yzxLen * 22 + 22;

        d.wbWidth = pickUpValue ? wbActual : d.wbWidth;
        d.aqWidth = pickUpValue ? aqActual : d.aqWidth;
        d.yzxWidth = pickUpValue ? yzxActual : d.yzxWidth;

        ec.fillStyle = this.config.horizontalColor;
        ec.beginPath();
        ec.fillRect(hw + fw, 0, d.wbWidth, lh);
        ec.fillRect(hw + fw, lh + iw, d.aqWidth, lh);
        ec.fillRect(hw + fw, (lh + iw) * 2, d.yzxWidth, lh);

        ec.font = "32px Aldrich";
        ec.fillStyle = '#000';
        ec.fillText(pickUpValue ? wbValue : wbValue + '%', hw + fw + d.wbWidth - wbLen * 22 - 12, 48);
        ec.fillText(pickUpValue ? aqValue : aqValue + '%', hw + fw + d.aqWidth - aqLen * 22 - 12, lh + iw + 48);
        ec.fillText(pickUpValue ? yzxValue : yzxValue + '%', hw + fw + d.yzxWidth - yzxLen * 22 - 12, (lh + iw) * 2 + 48);
        ec.closePath();
        //ec.stroke();
        ec.fill();
    }
};
