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
 *　coding by guotingchaopr@gmail.com  &  cycle263@gmail.com
 */

(function (global) {
	var _window = global;

	var Targets = function (id, count, next, step) {
		var t = new target();
		return t.init(id, count, next, step);
	}

	var target = function () {};
	target.prototype = {
		repState:0,
		container: null,
		unitLabel: "万",
		targetValue: null, //目标值
		targetNextValue: 0, //第二目标
		targetStep: 5, //目标步长
		width: null,
		columWidth: 350,
		height: null,
		countAnimate: null,
		canvas: null,
		xMargin: 30,
		titleInterval: 0,
		reachImg:null,
		yMargin: 14,
		init: function (id, totalTarget, nextTarget, step) { //容器ID 总目标  第二目标 显示步长
			this.container = document.getElementById(id);
			$(".targetValues").text(totalTarget + "W");
			this.width = this.container.clientWidth;
			this.height = this.container.clientHeight;
			this.targetValue = totalTarget;
			this.targetNextValue = nextTarget;
			this.targetStep = step;
			var images = new Image();
			images.src="../images/reach.png";
			console.log(this.width + " : " + this.height);
			var canvas_container = document.createElement("canvas");
			canvas_container.globalCompositeOperation = 'source-atop';
			canvas_container.id = id + "_canvas";
			canvas_container.width = this.width;
			canvas_container.height = this.height;
			this.canvas = canvas_container.getContext("2d");
			this.container.appendChild(canvas_container);
			this.reachImg = images;
			this.reachImg.onload = function(){
				console.log("reachImage 已经组装好");
			}
			this.drawInit();
			return this;
		},
		drawInit: function () {
			this.drawTitle();
		},
		drawYAxis: function (val) { //绘制柱子
			var canvas = this.canvas;
			clearInterval(this.countAnimate);
			canvas.clearRect(0,0,this.width,this.height);
			this.drawTitle();
			var width = this.width,
				height = this.height,
				color_top = val * 2,
				yMargin = this.yMargin,
				columWidth = this.columWidth;

			var anchor = yMargin * 2,
				targetValue = this.targetValue;
			var spacing = (this.titleInterval / this.targetStep).toFixed(2);
			if (val != this.targetValue && val != this.targetNextValue)
				value = spacing * val;
			else
				value = spacing * val + this.yMargin / 2;
			if (val == 0) return;
			var tmp_color1 = "#f6cc4b",
				tmp_color2 = "#e4b935";
			var speed = 30;
			this.countAnimate = setInterval(function () {
				canvas.clearRect(width / 2 - (columWidth / 2), height - anchor, columWidth, height - anchor);
				if (val >= targetValue) {
					tmp_color1 = "#b92433";
					tmp_color2 = "#e22c3d";
				}
				canvas.fillStyle = tmp_color1;
				canvas.beginPath();
				canvas.fillRect(width / 2 - (columWidth / 2), height - value - yMargin / 2, columWidth, value);
				canvas.closePath();

				canvas.beginPath();
				canvas.fillStyle = tmp_color2;
				canvas.fillRect(width / 2 - (columWidth / 2), height - value - yMargin / 2, columWidth, value - anchor);
				canvas.closePath();

				speed -= Math.floor(speed * 0.28);
				anchor += speed; // + speed;

				if (anchor > value) {
					anchor = 0;
					speed = 30;
				}

			}, 40);
			if(val >= 300){
				var img = this.reachImg,
				imgWidth  = this.width,
				imgHeight = this.height - 210;
				img.id = "reachImg";
				img.style.top=15+"px";
				img.style.right=680+"px";
				img.style.position="absolute";
				img.style.width=imgWidth + "px";
				img.style.height=imgHeight + "px";
				document.body.appendChild(img);
				var reachInterval = setInterval(function(){
					if(imgWidth > 340){
						imgWidth =  imgWidth  - 35;
					}
					if(imgHeight > 140){
						imgHeight = imgHeight - 20;
					}
					if(imgWidth <= 340 && imgHeight <= 140){
							$(".targetValues")[0].style.color= "#5d4e3f";
							clearInterval(reachInterval);
					}else{
						img.style.width=imgWidth + "px";
						img.style.height=imgHeight + "px";
					}
				},35);

			}else{
				var reachImg = document.getElementById("reachImg");
				if(reachImg){
					document.body.removeChild(reachImg);
					$(".targetValues")[0].style.color= "white";
				}
			}
		},
		drawXAxis: function (xAxis, yAxis, color) { //绘制横轴
			var canvas = this.canvas;
			canvas.strokeStyle = color;
			canvas.beginPath();
			canvas.moveTo(this.xMargin + 150, yAxis - this.yMargin);
			canvas.lineTo(xAxis, yAxis - this.yMargin);

			canvas.closePath();
			canvas.stroke();
		},
		drawTitle: function () { //绘制相关标注信息
			var canvas = this.canvas;
			var eachLen = Math.round(this.targetValue / this.targetStep) + 1;
			this.titleInterval = Math.round(this.height / eachLen);
			for (var i = 0; i < eachLen; i++) {
				var tmp_val = (this.targetStep * i);
				var tmp_y = this.titleInterval * (eachLen - i),
					tmp_x = this.width;
				canvas.textAlign = "right";
				if (tmp_val == this.targetValue || tmp_val == this.targetNextValue) {
					var tmp_indicate = tmp_val == this.targetValue ? "2014年目标" : "2013年目标";
					canvas.fillStyle = "#fcc612";

					canvas.font = "80px 微软雅黑";
					canvas.fillText("·", this.width - 165, tmp_y - 5);
					canvas.fill();


					canvas.font = "30px 微软雅黑";
					canvas.fillText(tmp_indicate, this.width, tmp_y - 20);
					canvas.fill();

					canvas.fillStyle = "#fcc612";
					canvas.font = "45px 微软雅黑";
					this.drawXAxis(tmp_x, tmp_y, canvas.fillStyle);

				} else {

					canvas.fillStyle = "#6e483b";
					canvas.font = "35px 微软雅黑";
					this.drawXAxis(tmp_x - 150, tmp_y + 5, canvas.fillStyle);

				}
				canvas.beginPath();
				canvas.fillText(tmp_val + this.unitLabel, 150, tmp_y - 20);
				canvas.closePath();
				canvas.fill();
			}
		},
		ajax: function (mddCode) {
			var iframe = document.createElement('iframe');
			iframe.style.display = "none";
			iframe.src = this.repUrl + "?mddCode=" + mddCode + "&queryTime=" + "1407599982000"; //this.queryTime();
			if (iframe.attachEvent) {
				iframe.attachEvent('onload', this.processData);
			} else {
				iframe.onload = this.processData;
			}
			document.body.appendChild(iframe);
		},
		processData: function () {
			if (target.prototype.repState === 1) {
				var data = this.contentWindow.name; // 读取数据
				target.prototype.repState = 0;
				this.fillData(JSON.parse(data));
			} else if (target.prototype.repState === 0) {
				target.prototype.repState = 1;
				this.contentWindow.location = "../Target/proxy.html"; // 设置的代理文件
			}
		},
		queryTime: function () {
			return new Date().getTime();
		}

	}
	window.target = Targets;
})(window);
