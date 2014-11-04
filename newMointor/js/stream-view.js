//兼容的requestAnimationFrame
(function () {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }

    //简单的工具集合
    var Util = {
        method: function (o, fns) {
            var p = o.prototype;
            for (var fn in fns) {
                if (fns.hasOwnProperty(fn)) {
                    o.prototype[fn] = fns[fn];
                }
            }
        },
        proxy: function (fn, context) {
            return function () {
                fn.apply(context, arguments);
            }
        },
        color2rgb: function (color, opacity) {
            var c = color.replace('#', '');
            c = c.split('');

            var p = opacity || 1;

            return 'rgba(' +
                (parseInt(c[0], 16) * 16 + parseInt(c[1], 16)) + ',' +
                (parseInt(c[2], 16) * 16 + parseInt(c[3], 16)) + ',' +
                (parseInt(c[4], 16) * 16 + parseInt(c[5], 16)) + ',' + p + ')';
        },
        addStyle: function (style, id) {
            $('<style id="' + (id || '') + '" type="text/css">' + style + '</style>').appendTo("head");
        }
    };

    /**
     * 画一个弧度
     *
     * @author yujiang
     * @date
     */
    function StreamArc(conf) {
        this.id = Math.floor(Math.random() * 4000) + Math.floor(Math.random() * 5000) + new Date().getTime();

        this.dotR = conf.dotR || 10;
        this.blur = conf.blur || 5;

        this.speed = conf.speed || 0.01;
        this.color = '#57c8da';

        //起始点（运动的小球的中心）
        this.cx = conf.cx || 0;
        this.cy = conf.cy || 0;

        //origin point
        this.regX = conf.regX || this.cx;
        this.regY = conf.regY || this.cy;

        //目标点
        this.targetX = conf.targetX || 0;
        this.targetY = conf.targetY || 0;
    }

    Util.method(StreamArc, {
        init: function () {

            this.r = Math.sqrt(((this.cx - this.regX) * (this.cx - this.regX)) + ((this.cy - this.regY) * (this.cy - this.regY)));

            this.width = this.r * 2 + 200;
            this.height = this.r * 2 + 200;

            //必须相等
            this.offsetX = this.regX - this.r;
            this.offsetY = this.regY - this.r;

            var path = ['M', this.cx - this.offsetX, this.cy - this.offsetY].join(' ');
            path += ['A', this.r, this.r, 0, 0, 1, this.targetX - this.offsetX, this.targetY - this.offsetY].join(' ');

            this.path = path;

        },
        update: function (o) {
            o.targetX ? this.targetX = o.targetX : 1;
            o.targetY ? this.targetY = o.targetY : 1;

            o.cx ? this.cx = o.cx : 1;
            o.cy ? this.cy = o.cy : 1;

            o.regX ? this.regX = o.regX : 1;
            o.regY ? this.regY = o.regY : 1;

            this.init();

            this.pathNode.animate({
                path: this.path
            }, 200);

            this.arcLen = this.pathNode.getTotalLength();

        },
        render: function () {

            this.init();

            this.node = $('<svg id="dt-stream-arc-' + this.id + '" class="dt-stream-arc" width="' + this.width + '" height="' + this.height + '"></svg>');
            this.node.css({
                position: 'absolute',
                top: this.offsetY + 'px',
                left: this.offsetX + 'px'
            });
            $(document.body).append(this.node);

            this.ctx = Snap(this.node[0]);

            //弧线
            this.pathNode = this.ctx.path(this.path);
            this.pathNode.attr({
                stroke: this.color,
                fill: "transparent"
            });

            var f = this.ctx.filter(Snap.filter.blur(this.blur, this.blur));

            //沿着弧线运动的圆
            this.dot = this.ctx.circle(this.cx - this.offsetX, this.cy - this.offsetY, this.dotR);
            this.dot.attr({
                fill: this.color,
                filter: f
            });

            this.moving();
        },
        moving: function () {
            var that = this;

            this.arcLen = that.pathNode.getTotalLength();

            var v = 0,
                point;
            (function tick() {
                requestAnimationFrame(function () {
                    v += that.speed;
                    if (v > 1) {
                        v = 0;
                    }
                    point = that.pathNode.getPointAtLength(v * that.arcLen);
                    that.dot.attr({
                        cx: point.x,
                        cy: point.y
                    });

                    tick();
                });
            })();
        }
    });
    //window.StreamArc = StreamArc;

    /**
     * 画一个圆
     *
     * @author yujiang
     * @date
     */
    function StreamCircle(conf) {

        this.id = Math.floor(Math.random() * 4000) + Math.floor(Math.random() * 5000) + new Date().getTime();

        this.maxR = conf.maxR || 150;
        this.minR = conf.minR || 20;

        this.isShowData = conf.isShowData === undefined ? true : conf.isShowData;

        this.maxData = conf.maxData || 20;
        this.data = conf.data || 0;

        this.cx = conf.cx || 0;
        this.cy = conf.cy || 0;

        this.color = conf.color || '#57c8da';

        this.blur = conf.blur || 20;
        this.opacity = conf.opacity || 0.6;

        if (conf.r) {
            this.maxR = conf.r;
            this.minR = 0;
            this.maxData = conf.r;
            this.data = conf.r;
        }

    }

    Util.method(StreamCircle, {
        _setR: function () {

            this.r = this.data / this.maxData * this.maxR;

            if (this.r < this.minR) {
                this.r = this.minR;
            }
        },
        render: function (node) {

            this._setR();

            this.root = node || $(document.body);

            this.circleRoot = $('<div class="dv-stream-circle"><div></div><p class="font-aldrich"></p></div>');
            this.circleRoot.css({
                'position': 'absolute',
                top: this.cy - this.r,
                left: this.cx - this.r,
                width: this.r * 2,
                height: this.r * 2
            });

            this.circleView = this.circleRoot.find('div');
            this.circleView.css({
                'background-color': this.color,
                'border-radius': this.r * 2,
                'box-shadow': '0 0 ' + this.blur + 'px ' + Util.color2rgb(this.color, this.opacity),
                width: this.r * 2,
                height: this.r * 2,
                top: 0,
                left: 0
            });

            this.root.append(this.circleRoot);
            this.textNode = this.circleRoot.find('p');
            this.textNode.css({
                position: 'absolute',
                lineHeight: '34px',
                fontSize: '34px',
                color: '#fd8a25',
                top: '50%',
                marginTop: '-12px',
                left: (this.r * 2 + 20) + 'px'
            }).html(this.isShowData ? this.data : '');

        },
        update: function (data) {
            if (data) {
                this.data = data;
            }
            this._setR();

            this.circleRoot.css({
                top: this.cy - this.r,
                left: this.cx - this.r,
                width: this.r * 2,
                height: this.r * 2
            });

            this.circleView.css({
                'border-radius': this.r * 2,
                width: this.r * 2,
                height: this.r * 2
            });
            this.textNode.css({
                left: (this.r * 2 + 20) + 'px'
            }).html(this.isShowData ? this.data : '');
        }
    });
    //window.StreamCircle = StreamCircle;

    /**
     * 只适用于单一场景的河流图
     *
     * @author yujiang
     * @date 2014-10-29
     */
    function StreamView(conf) {

        conf = conf || {};

        //这个地方固定了
        this.pageH = 2160;

        //update画图动画间隔
        this.duration = 200;

        //jquery自定义时间
        this.e = $({});

        //是否开启debug模式
        this.isDebug = conf.debug || false;

        this.id = Math.floor(Math.random() * 4000) + Math.floor(Math.random() * 5000) + new Date().getTime();

        //绘画的点
        this.points = conf.points || [];
        this.drawPos = [];

        this.color = conf.color || '#57c8da';
        this.opacity = conf.opacity || 0.1;
        this.speed = conf.speed || 5;

        //波纹动画间隔
        this.waveDuration = conf.waveDuration || 4000;
        //波浪的宽度和颜色
        this.waveWidth = conf.waveWidth || 300;
        this.waveColor = conf.waveColor || 'rgba(0,0,0,0.1)-rgba(255,255,255,0.4):98-rgba(255,255,255,1)';
        this.waveOpacity = conf.waveOpacity || 0.1;

        //需要显示圆
        if (conf.circle) {
            this.circle = conf.circle;
        }

        //初始化数据
        this._init();

    }

    //私有方法
    Util.method(StreamView, {
        //*************************
        // 由于情景规律不明显且适用场景单一
        // 所以这个地方是写死点的顺序
        //*************************
        _setPoints: function (points) {
            points ? this.points = points : 1;

            this.type = undefined;
            if (this.points.length == 2) {
                this.type = 1;
            } else if (this.points.length == 3) {
                this.type = 2;
            } else {
                return;
            }

            this.offsetX = this.points[0].x;
            this.offsetY = this.points[0].y - this.points[0].h;

            this.drawPos = [];

            //第一个点
            this.drawPos.push({
                x: this.points[0].x,
                y: this.points[0].y
            });
            this.drawPos.push({
                x: this.points[0].x,
                y: this.points[0].y - this.points[0].h
            });

            //第二个点
            this.drawPos.push({
                x: this.points[1].x,
                y: this.points[1].y - this.points[1].h
            });

            this.drawPos.push({
                x: this.points[1].x,
                y: this.points[1].y
            });

            //可能有三个点
            if (this.type == 2) {

                this.theMid = Math.floor(Math.abs(this.points[2].x - this.points[1].x) / 2.5);

                this.drawPos.push({
                    x: this.points[2].x,
                    y: this.points[2].y
                });
                this.drawPos.push({
                    x: this.points[2].x,
                    y: this.points[2].y - this.points[2].h
                });

                //拐弯的点
                //缓存
                var tp = {
                    x: this.points[0].x + this.theMid,
                    y: (this.drawPos[4].y - this.drawPos[1].y) / 2 + this.drawPos[1].y
                };
                this.drawPos.push(tp);

                //折线点
                this.drawPos.splice(2, 0, {
                    x: tp.x,
                    y: tp.y - this.points[0].h
                });
                this.drawPos.splice(5, 0, {
                    x: tp.x,
                    y: tp.y + this.points[0].h
                });
            }

            //处理drawPos，改成相对位置
            this.drawPos.map(Util.proxy(function (item) {
                item.x -= this.offsetX;
                item.y -= this.offsetY;
                return {
                    x: item.x,
                    y: item.y
                }
            }, this));

        },
        //设置容器区间的高度和宽度
        _setSize: function () {
            if (!this.type)  return;

            if (this.type == 1) {
                this.width = Math.abs(this.drawPos[1].x - this.drawPos[2].x);
                this.height = Math.abs(this.drawPos[1].y - this.drawPos[3].y) + 20;
            } else if (this.type == 2) {
                this.width = Math.abs(this.drawPos[1].x - this.drawPos[3].x);
                this.height = Math.abs(this.drawPos[1].y - this.drawPos[6].y) + 20;
            }

        },
        _init: function () {

            this._setPoints();
            this._setSize();

        },
        //设置绘画的路径
        _setPath: function () {
            var path = '';

            if (this.type == 1) {
                path += 'M' + this.drawPos[0].x + ' ' + this.drawPos[0].y;
                path += 'L' + this.drawPos[1].x + ' ' + this.drawPos[1].y;
                path += 'T' + this.drawPos[2].x + ' ' + this.drawPos[2].y;
                path += 'L' + this.drawPos[3].x + ' ' + this.drawPos[3].y;
                path += 'T' + this.drawPos[0].x + ' ' + this.drawPos[0].y;
                path += 'Z';

            } else if (this.type == 2) {
                path += 'M' + this.drawPos[0].x + ' ' + this.drawPos[0].y;

                path += 'L' + this.drawPos[1].x + ' ' + this.drawPos[1].y;
                path += 'Q' + this.drawPos[2].x + ' ' + this.drawPos[2].y + ' ' + this.drawPos[3].x + ' ' + this.drawPos[3].y;

                path += 'L' + this.drawPos[4].x + ' ' + this.drawPos[4].y;
                path += 'Q' + this.drawPos[5].x + ' ' + this.drawPos[5].y + ' ' + this.drawPos[6].x + ' ' + this.drawPos[6].y;

                path += 'L' + this.drawPos[7].x + ' ' + this.drawPos[7].y;
                path += 'Q' + (this.drawPos[8].x + 250) + ' ' + this.drawPos[8].y + ' ' + this.drawPos[0].x + ' ' + this.drawPos[0].y;

                path += 'Z';

            }
            this.path = path;
        },
        //绘画图形
        _draw: function () {

            if (!this.type) return;

            this._setPath();

            this.svgView = this.ctx.path(this.path);
            this.svgView.attr({
                'fill': this.color,
                'opacity': this.opacity
            });

            this._drawWave();

            this._drawWaveDot();

            this._drawCircle();

        },
        //绘画波
        _drawWave: function () {

            this.waveX = -this.waveWidth;

            this._g = this.ctx.gradient("l(0, 0, 1, 0)" + this.waveColor);
            this._p = this.ctx.path(this.path);
            this.waveView = this.ctx.rect(-this.waveWidth, 0, this.waveWidth, this.height);
            this.waveView.attr({
                'fill': this._g,
                'clip-path': this._p,
                'opacity': this.waveOpacity
            });
        },
        _updateWave: function () {
            this._p.attr({
                path: this.path
            });
            this.waveView.attr({
                width: this.waveWidth,
                height: this.height
            });
        },
        _setCircle: function (circle) {

            var x = this.width / 2,
                y,
                maxR;

            if (circle) {
                this.circle.data = circle.data || 0;
            }

            if (!this.circle) return;

            if (this.type == 1) {

                var tp = (this.drawPos[3].y - this.drawPos[0].y) / 2 + this.drawPos[0].y,
                    bp = (this.drawPos[2].y - this.drawPos[1].y) / 2 + this.drawPos[1].y;

                var midH = (bp - tp) / 2;

                maxR = Math.min(Math.abs(midH), Math.abs(this.drawPos[2].x - this.drawPos[1].x)) / 2;
                y = tp + midH;

            } else if (this.type == 2) {
                maxR = Math.min(this.width / 2 - this.theMid, Math.abs(this.drawPos[8].y - this.drawPos[2].y));
                y = (this.drawPos[5].y - this.drawPos[2].y) / 2 + this.drawPos[2].y;
            }

            this.circle.maxR = maxR;
            this.circle.cx = x;
            this.circle.cy = y;

        },
        _drawCircle: function () {

            this._setCircle();

            if (!this.circle) return;

            this.circleView = new StreamCircle(this.circle);
            this.circleView.render(this.node);

        },
        _updateCircle: function (circle) {

            this._setCircle(circle);

            if (!this.circle) return;

            this.circleView.maxR = this.circle.maxR;
            this.circleView.cx = this.circle.cx;
            this.circleView.cy = this.circle.cy;
            this.circleView.data = this.circle.data;

            this.circleView.update();
        },
        _debug: function () {
            if (!this.isDebug) return;
            if (this.debugNode) {
                this.debugNode.remove();
            }
            this.debugNode = this.ctx.g();
            for (var i = this.drawPos.length; i--;) {
                this.debugNode.add(this.ctx.circle(this.drawPos[i].x, this.drawPos[i].y, 5).attr('fill', 'red'));
            }

        },
        _setWaveDot: function () {

            if (!this.waveDot) {
                this.waveDot = {};
            }

            var tpath = '',
                bpath = '',
                tsp = {x: 0, y: 0},
                bsp = {x: 0, y: 0};

            if (this.type == 1) {
                tpath += 'M' + this.drawPos[1].x + ' ' + this.drawPos[1].y;
                tpath += 'L' + this.drawPos[2].x + ' ' + this.drawPos[2].y;

                bpath += 'M' + this.drawPos[0].x + ' ' + this.drawPos[0].y;
                bpath += 'L' + this.drawPos[3].x + ' ' + this.drawPos[3].y;

                tsp = {
                    x: this.drawPos[1].x,
                    y: this.drawPos[1].y
                };
                bsp = {
                    x: this.drawPos[0].x,
                    y: this.drawPos[0].y
                };

            } else if (this.type == 2) {
                tpath += 'M' + this.drawPos[1].x + ' ' + this.drawPos[1].y;
                tpath += 'Q' + this.drawPos[2].x + ' ' + this.drawPos[2].y + ' ' + this.drawPos[3].x + ' ' + this.drawPos[3].y;

                bpath += 'M' + this.drawPos[6].x + ' ' + this.drawPos[6].y;
                bpath += 'Q' + this.drawPos[5].x + ' ' + this.drawPos[5].y + ' ' + this.drawPos[4].x + ' ' + this.drawPos[4].y;
                tsp = {
                    x: this.drawPos[1].x,
                    y: this.drawPos[1].y
                };
                bsp = {
                    x: this.drawPos[6].x,
                    y: this.drawPos[6].y
                };
            }

            this.waveDot.tpath = tpath;
            this.waveDot.bpath = bpath;
            this.waveDot.tsp = tsp;
            this.waveDot.bsp = bsp;

        },
        _drawWaveDot: function () {
            this._setWaveDot();

            this.waveDot.tpathNode = this.ctx.path(this.waveDot.tpath).attr({
                fill: 'transparent'
            });
            this.waveDot.bpathNode = this.ctx.path(this.waveDot.bpath).attr({
                fill: 'transparent'
            });

            var f = this.ctx.filter(Snap.filter.blur(1, 1));

            this.waveDot.tNode = this.ctx.circle(this.waveDot.tsp.x, this.waveDot.tsp.y, 3).attr({
                fill: '#ffffff',
                filter: f,
                opacity: 0
            });
            this.waveDot.bNode = this.ctx.circle(this.waveDot.bsp.x, this.waveDot.bsp.y, 3).attr({
                fill: '#ffffff',
                filter: f,
                opacity: 0
            });

            this.waveDot.tLen = this.waveDot.tpathNode.getTotalLength();
            this.waveDot.bLen = this.waveDot.bpathNode.getTotalLength();

        },
        _moveWaveDot: function (v) {

            if (v >= 1 && !this.isSurpass) {
                this.isSurpass = true;
                this.waveDot.tNode.attr({
                    opacity: 0
                });
                this.waveDot.bNode.attr({
                    opacity: 0
                });
                return;
            }

            var tpoint,
                bpoint;

            tpoint = this.waveDot.tpathNode.getPointAtLength(v * this.waveDot.tLen);
            bpoint = this.waveDot.bpathNode.getPointAtLength(v * this.waveDot.bLen);

            this.waveDot.tNode.attr({
                cx: tpoint.x,
                cy: tpoint.y
            });
            this.waveDot.bNode.attr({
                cx: bpoint.x,
                cy: bpoint.y
            });

        },
        _updateWaveDot: function () {
            this._setWaveDot();

            this.waveDot.tpathNode.attr('path', this.waveDot.tpath);
            this.waveDot.bpathNode.attr('path', this.waveDot.bpath);

            this.waveDot.tLen = this.waveDot.tpathNode.getTotalLength();
            this.waveDot.bLen = this.waveDot.bpathNode.getTotalLength();
        }
    });

    //公共方法
    Util.method(StreamView, {

        render: function (root) {

            if (!this.type)  return;

            if (this.node) {
                return;
            }

            var html = '<div id="dv-stream-' + this.id + '" class="dv-stream" style="position:absolute;width:' + this.width + 'px;height:' + this.height + 'px">';
            html += '<svg id="dv-stream-svg-' + this.id + '" width="' + this.width + '" height="' + this.height + '"></svg>';
            html += '</div>';

            this.root = $(root || document.body);
            this.root.append(html);

            this.node = $('#dv-stream-' + this.id);
            this.svgNode = $('#dv-stream-svg-' + this.id);
            this.ctx = Snap('#dv-stream-svg-' + this.id);

            this._draw();

            this.node.css({
                left: this.offsetX,
                bottom: this.pageH - (this.offsetY + this.height)
            });

            this._debug();

        },
        update: function (o) {

            var that = this;

            if (o.points) {

                var point = {};
                o.points = o.points.map(function (p, index) {

                    point = {};

                    point.x = p.x != undefined ? p.x : that.points[index].x;
                    point.y = p.y != undefined ? p.y : that.points[index].y;
                    point.h = p.h != undefined ? p.h : that.points[index].h;

                    return point;
                });

                this._setPoints(o.points);
                this._setSize();
                this._setPath();

                this._updateWave();

                this._updateWaveDot();

                this.svgView.animate({
                    path: this.path
                }, this.duration);

                this.node.animate({'height': this.height}, this.duration);
                this.svgNode.animate({'height': this.height}, this.duration);

            }
            if (o.circle) {
                this._updateCircle(o.circle);
                this.e.trigger('update', {
                    cx: this.circleView.cx + this.offsetX,
                    cy: this.circleView.cy + this.offsetY
                });
            }

            this._debug();
        },
        anim: function () {
            var that = this;

            if (!that.waveView) return;

            that.waveView.attr('x', -that.waveWidth);

            that.isSurpass = false;
            that.waveDot.tNode.attr({
                opacity: 1
            });
            that.waveDot.bNode.attr({
                opacity: 1
            });

            Snap.animate(-that.waveWidth, that.width, function (val) {

                requestAnimationFrame(function () {
                    that.waveView.attr({
                        x: val
                    });
                    that._moveWaveDot((val + that.waveWidth) / that.width);
                })

            }, that.waveDuration, function () {
                that.e.trigger('anim-over');
            });

//            that.waveView.animate({
//                x: that.width
//            }, this.waveDuration, function() {
//                that.e.trigger('anim-over');
//            });
        },
        go: function (duration) {
            var that = this;
            this.anim(function () {
                that.anim.call(that);
            });
        }
    });

    //暴露到全局
    //window.StreamView = StreamView;

    //+++++++++++++++++++++++++++++++++++++++
    //+ 直接调用
    //+++++++++++++++++++++++++++++++++++++++
    var DtSetStream = {
        render: function (theH, theC) {

            //弧度运动的点
            var arc = new StreamArc({
                regX: 1245,
                regY: 1115,
                cx: 1674,
                cy: 866,
                targetX: 1440,
                targetY: 1582
            });
            arc.render();

            //高峰引流
            var circle1 = new StreamCircle({
                data: theC[1].data,
                maxData: theC[1].maxData,
                cx: 1670,
                cy: 862
            });
            circle1.render();

            //自助使用量第一个圆
            var circle2 = new StreamCircle({
                data: theC[2].data,
                maxData: theC[2].maxData,
                cx: 1438,
                cy: 1230
            });
            circle2.render();

            //自助使用量最后一个圆
            var circle3 = new StreamCircle({
                data: theC[4].data,
                maxData: theC[4].maxData,
                cx: 1438,
                cy: 1930
            });
            circle3.render();

            //+++++++++++++++++++++++++++++++++
            //+ 上部分河流图
            //+++++++++++++++++++++++++++++++++

            //支付宝河流
            var sAlipay = new StreamView({
                circle: {
                    data: theC[0].data,
                    maxData: theC[0].maxData
                },
                points: [
                    {
                        x: 925,
                        y: 912,
                        h: theH[0]
                    },
                    {
                        x: 1949,
                        y: 912,
                        h: theH[1]
                    }
                ]
            });
            sAlipay.render();

            //人工呼入-人工接起 支付宝
            var sAnswerAlipay = new StreamView({
                waveWidth: 100,
                waveDuration: 1000,
                points: [
                    {
                        x: 2609,
                        y: 914,
                        h: theH[1]
                    },
                    {
                        x: 2785,
                        y: 914,
                        h: theH[2]
                    }
                ]
            });
            sAnswerAlipay.render();

            //+++++++++++++++++++++++++++++++++
            //+ 下部分河流图
            //+++++++++++++++++++++++++++++++++

            //pc无线河流
            var sPcMobile = new StreamView({
                circle: {
                    data: theC[3].data,
                    maxData: theC[3].maxData
                },
                points: [
                    {
                        x: 926,
                        y: 1495,
                        h: theH[3]
                    },
                    {
                        x: 1949,
                        y: 1640,
                        h: theH[5]
                    },
                    {
                        x: 926,
                        y: 1789,
                        h: theH[4]
                    }
                ]
            });
            sPcMobile.render();

            sPcMobile.e.on('update', function (e, o) {
                arc.update({
                    targetX: o.cx,
                    targetY: o.cy
                });
            });

            //人工呼入-人工接起 pc 无线
            var sAnswerPcMobile = new StreamView({
                waveWidth: 100,
                waveDuration: 1000,
                points: [
                    {
                        x: 2609,
                        y: 1642,
                        h: theH[5]
                    },
                    {
                        x: 2785,
                        y: 1640,
                        h: theH[6]
                    }
                ]
            });
            sAnswerPcMobile.render();

            //+++++++++++++++++++++++++++++
            //+ 波纹动画
            //+++++++++++++++++++++++++++++
            sAlipay.e.on('anim-over', function () {
                sAnswerAlipay.anim();
            });
            sAnswerAlipay.e.on('anim-over', function () {
                sAlipay.anim();
            });
            sAlipay.anim();

            sPcMobile.e.on('anim-over', function () {
                sAnswerPcMobile.anim();
            });
            sAnswerPcMobile.e.on('anim-over', function () {
                sPcMobile.anim();
            });
            sPcMobile.anim();

            DtSetStream.update = function(theH, theC) {

                circle1.update(theC[1].data);
                circle2.update(theC[2].data);
                circle3.update(theC[4].data);

                sAlipay.update({
                    circle: {
                        data: theC[0].data
                    },
                    points: [{
                        h: theH[0]
                    }, {
                        h: theH[1]
                    }]
                });
                sAnswerAlipay.update({
                    points: [{
                        h: theH[1]
                    }, {
                        h: theH[2]
                    }]
                });

                sPcMobile.update({
                    circle: {
                        data: theC[3].data
                    },
                    points: [{
                        h: theH[3]
                    }, {
                        h: theH[5]
                    }, {
                        h: theH[4]
                    }]
                });
                sAnswerPcMobile.update({
                    points: [{
                        h: theH[5]
                    }, {
                        h: theH[6]
                    }]
                })
            }

        }
    };

    window.DtSetStream = DtSetStream;
})();

