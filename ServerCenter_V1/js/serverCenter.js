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
	var ServerCenter = function (id) {
		var sc = new scenter();
		return sc.init(id);
	}

	var scenter = function () {};
	scenter.prototype = {
		canvas: null,
		color_1: "#eccc6a",
		color_2: "#d2a825",
		yMargin: 85,
		xMargin: 65,
		columnWidth: 140,
		columnSpace: 600,
		width: 0,
		height: 0,
		init: function (id) {
			this.container = document.getElementById(id);
			this.width = this.container.clientWidth;
			this.height = this.container.clientHeight;
			var canvas_container = document.createElement("canvas");
			canvas_container.globalCompositeOperation = 'source-atop';
			canvas_container.id = id + "_canvas";
			canvas_container.width = this.width;
			canvas_container.height = this.height;
			this.canvas = canvas_container.getContext("2d");
			this.container.appendChild(canvas_container);
			return this;
		},
		drawX: function () {
			var canvas = this.canvas;
			for (var i = 0; i < 6; i++) {
				canvas.strokeStyle = "rgba(186, 160, 129, 0.74)";
				canvas.beginPath();
				canvas.moveTo(10, this.height - this.yMargin * i - 10);
				canvas.lineTo(this.width, this.height - this.yMargin * i - 10);
				canvas.closePath();
				canvas.stroke();
			}
		},
		drawY: function (values) {
			var canvas = this.canvas,
				area_space = 100;
			canvas.font = "50px 微软雅黑";
			for (var i = 0; i < values.length; i++) {
				var value = values[i];
				var column_1 = value[0] * 4.25,
					column_2 = value[1] * 4.25;
				var space = column_2 > 0 ? 50 : 180;
					columnWidth = column_2 > 0 ? this.columnWidth : this.columnWidth + 50;
				if (column_1 > 0) {
					canvas.fillStyle = this.color_1;
					canvas.beginPath();
					canvas.fillRect(this.columnSpace * i + space, this.height - column_1 - 10, columnWidth, column_1);
					canvas.fill();
					canvas.closePath();
					canvas.fillStyle = "white";
					canvas.fillText(value[0] + "%", this.columnSpace * i + space, this.height - column_1 - 15);
				}
				if (column_2 > 0) {
					canvas.fillStyle = this.color_2;
					canvas.beginPath();
					canvas.fillRect(this.columnSpace * i + columnWidth * 2, this.height - column_2 - 10, columnWidth, column_2);
					canvas.closePath();
					canvas.fill();
					canvas.fillStyle = "white";
					canvas.fillText(value[1] + "%", this.columnSpace * i + columnWidth * 2, this.height - column_2 - 15);
				}
			}
		},
		reDraw: function (values) {
			this.canvas.clearRect(0, 0, this.width, this.height);
			this.drawX();
			this.drawY(values);
		}
	}
	window.serverCenter = ServerCenter;
})(window);
