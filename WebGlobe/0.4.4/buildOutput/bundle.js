/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Globe) {
	    "use strict";
	    (function () {
	        var canvas = document.getElementById("canvasId");
	        var globe = new Globe(canvas);
	        window.globe = globe;
	        window.kernel = Kernel;
	    })();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var REAL_EARTH_RADIUS = 6378137;
	    var EARTH_RADIUS = 500;
	    var SCALE_FACTOR = EARTH_RADIUS / REAL_EARTH_RADIUS;
	    var MAX_PROJECTED_COORD = Math.PI * EARTH_RADIUS;
	    var MAX_REAL_RESOLUTION = 156543.03392800014;
	    var MAX_RESOLUTION = MAX_REAL_RESOLUTION * SCALE_FACTOR;
	    var Kernel = (function () {
	        function Kernel() {
	        }
	        Kernel.gl = null;
	        Kernel.canvas = null;
	        Kernel.globe = null;
	        Kernel.idCounter = 0;
	        Kernel.version = "0.4.4";
	        Kernel.SCALE_FACTOR = SCALE_FACTOR;
	        Kernel.EARTH_RADIUS = EARTH_RADIUS;
	        Kernel.MAX_RESOLUTION = MAX_RESOLUTION;
	        Kernel.MAX_REAL_RESOLUTION = MAX_REAL_RESOLUTION;
	        Kernel.MAX_PROJECTED_COORD = MAX_PROJECTED_COORD;
	        Kernel.BASE_LEVEL = 6;
	        Kernel.MAX_LEVEL = 18;
	        Kernel.MIN_LEVEL = 2;
	        Kernel.proxy = "";
	        return Kernel;
	    }());
	    return Kernel;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(6), __webpack_require__(7), __webpack_require__(8), __webpack_require__(3), __webpack_require__(17), __webpack_require__(18), __webpack_require__(19), __webpack_require__(36), __webpack_require__(37), __webpack_require__(39)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Utils, LocationService_1, Renderer, Camera_1, Scene, ImageUtils, EventHandler, Google_1, Autonavi_1, Atmosphere, PoiLayer) {
	    "use strict";
	    var initLevel = Utils.isMobile() ? 11 : 3;
	    var Globe = (function () {
	        function Globe(canvas, level, lonlat) {
	            var _this = this;
	            if (level === void 0) { level = initLevel; }
	            if (lonlat === void 0) { lonlat = [116.3975, 39.9085]; }
	            this.canvas = canvas;
	            this.renderer = null;
	            this.scene = null;
	            this.camera = null;
	            this.tiledLayer = null;
	            this.labelLayer = null;
	            this.trafficLayer = null;
	            this.poiLayer = null;
	            this.debugStopRefreshTiles = false;
	            this.REFRESH_INTERVAL = 150;
	            this.lastRefreshTimestamp = -1;
	            this.lastRefreshCameraCore = null;
	            this.eventHandler = null;
	            this.allRefreshCount = 0;
	            this.realRefreshCount = 0;
	            this.beforeRenderCallbacks = [];
	            this.afterRenderCallbacks = [];
	            Kernel.globe = this;
	            Kernel.canvas = canvas;
	            this.renderer = new Renderer(canvas, this._onBeforeRender.bind(this), this._onAfterRender.bind(this));
	            this.scene = new Scene();
	            var radio = canvas.width / canvas.height;
	            this.camera = new Camera_1.default(30, radio, 1, Kernel.EARTH_RADIUS * 2, level, lonlat);
	            this.renderer.setScene(this.scene);
	            this.renderer.setCamera(this.camera);
	            this.labelLayer = new Autonavi_1.AutonaviLabelLayer();
	            this.scene.add(this.labelLayer);
	            var atmosphere = Atmosphere.getInstance();
	            this.scene.add(atmosphere);
	            this.poiLayer = PoiLayer.getInstance();
	            this.scene.add(this.poiLayer);
	            this.renderer.setIfAutoRefresh(true);
	            this.eventHandler = new EventHandler(canvas);
	            var tiledLayer = new Google_1.GoogleTiledLayer("Satellite");
	            this.setTiledLayer(tiledLayer);
	            Utils.subscribe('location', function (data) {
	                console.info(data);
	                _this.afterRenderCallbacks.push(function () {
	                    _this.showLocation(data);
	                });
	            });
	            LocationService_1.default.getRobustLocation();
	            LocationService_1.default.getLocation();
	        }
	        Globe.prototype.showLocation = function (locationData) {
	            var lon = locationData.lng;
	            var lat = locationData.lat;
	            this.eventHandler.moveLonLatToCanvas(lon, lat, this.canvas.width / 2, this.canvas.height / 2);
	            var accuracy = locationData.accuracy;
	            var level = 8;
	            if (accuracy <= 100) {
	                level = 16;
	            }
	            else if (accuracy <= 1000) {
	                level = 13;
	            }
	            else {
	                level = 11;
	            }
	            this.setLevel(level);
	        };
	        Globe.prototype.setTiledLayer = function (tiledLayer) {
	            ImageUtils.clear();
	            if (this.tiledLayer) {
	                var b = this.scene.remove(this.tiledLayer);
	                if (!b) {
	                    console.error("this.scene.remove(this.tiledLayer)失败");
	                }
	                this.scene.tiledLayer = null;
	            }
	            this.tiledLayer = tiledLayer;
	            this.scene.add(this.tiledLayer, true);
	            this.refresh(true);
	        };
	        Globe.prototype.showLabelLayer = function () {
	            if (this.labelLayer) {
	                this.labelLayer.visible = true;
	            }
	        };
	        Globe.prototype.hideLabelLayer = function () {
	            if (this.labelLayer) {
	                this.labelLayer.visible = false;
	            }
	        };
	        Globe.prototype.showTrafficLayer = function () {
	            if (this.trafficLayer) {
	                this.trafficLayer.visible = true;
	            }
	        };
	        Globe.prototype.hideTrafficLayer = function () {
	            if (this.trafficLayer) {
	                this.trafficLayer.visible = false;
	            }
	        };
	        Globe.prototype.getLevel = function () {
	            return this.camera.getLevel();
	        };
	        Globe.prototype.zoomIn = function () {
	            this.setLevel(this.getLevel() + 1);
	        };
	        Globe.prototype.setLevel = function (level) {
	            if (this.camera) {
	                this.camera.setLevel(level);
	            }
	        };
	        Globe.prototype.isAnimating = function () {
	            return this.camera.isAnimating();
	        };
	        Globe.prototype.animateToLevel = function (level, cb) {
	            if (!this.isAnimating()) {
	                if (level < Kernel.MIN_LEVEL) {
	                    level = Kernel.MIN_LEVEL;
	                }
	                if (level > Kernel.MAX_LEVEL) {
	                    level = Kernel.MAX_LEVEL;
	                }
	                if (level !== this.getLevel()) {
	                    this.camera.animateToLevel(level, cb);
	                }
	            }
	        };
	        Globe.prototype.animateOut = function (cb) {
	            this.animateToLevel(this.getLevel() - 1, cb);
	        };
	        Globe.prototype.animateIn = function (cb) {
	            this.animateToLevel(this.getLevel() + 1, cb);
	        };
	        Globe.prototype._onBeforeRender = function (renderer) {
	            this.refresh();
	        };
	        Globe.prototype._onAfterRender = function (render) {
	            this.afterRenderCallbacks.forEach(function (callback) { return callback(); });
	            this.afterRenderCallbacks = [];
	        };
	        Globe.prototype.logRefreshInfo = function () {
	            console.log(this.realRefreshCount, this.allRefreshCount, this.realRefreshCount / this.allRefreshCount);
	        };
	        Globe.prototype.refresh = function (force) {
	            if (force === void 0) { force = false; }
	            this.allRefreshCount++;
	            var timestamp = Date.now();
	            this.camera.update(force);
	            if (!this.tiledLayer || !this.scene || !this.camera) {
	                return;
	            }
	            if (this.debugStopRefreshTiles) {
	                return;
	            }
	            var newCameraCore = this.camera.getCameraCore();
	            var isNeedRefresh = false;
	            if (force) {
	                isNeedRefresh = true;
	            }
	            else {
	                if (newCameraCore.equals(this.lastRefreshCameraCore)) {
	                    isNeedRefresh = false;
	                }
	                else {
	                    isNeedRefresh = timestamp - this.lastRefreshTimestamp >= this.REFRESH_INTERVAL;
	                }
	            }
	            this.tiledLayer.updateSubLayerCount();
	            if (isNeedRefresh) {
	                this.realRefreshCount++;
	                this.lastRefreshTimestamp = timestamp;
	                this.lastRefreshCameraCore = newCameraCore;
	                this.tiledLayer.refresh();
	            }
	            this.tiledLayer.updateTileVisibility();
	            var a = !!(this.labelLayer && this.labelLayer.visible);
	            var b = !!(this.trafficLayer && this.trafficLayer.visible);
	            if (a || b) {
	                var lastLevelTileGrids = this.tiledLayer.getLastLevelVisibleTileGrids();
	                if (a) {
	                    this.labelLayer.updateTiles(this.getLevel(), lastLevelTileGrids);
	                }
	                if (b) {
	                    this.trafficLayer.updateTiles(this.getLevel(), lastLevelTileGrids);
	                }
	            }
	        };
	        Globe.prototype.getExtents = function (level) {
	            return this.tiledLayer.getExtents(level);
	        };
	        return Globe;
	    }());
	    return Globe;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, GraphicGroup) {
	    "use strict";
	    var Scene = (function (_super) {
	        __extends(Scene, _super);
	        function Scene() {
	            _super.apply(this, arguments);
	        }
	        return Scene;
	    }(GraphicGroup));
	    return Scene;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel) {
	    "use strict";
	    var GraphicGroup = (function () {
	        function GraphicGroup() {
	            this.visible = true;
	            this.id = ++Kernel.idCounter;
	            this.children = [];
	        }
	        GraphicGroup.prototype.add = function (g, first) {
	            if (first === void 0) { first = false; }
	            if (first) {
	                this.children.unshift(g);
	            }
	            else {
	                this.children.push(g);
	            }
	            g.parent = this;
	        };
	        GraphicGroup.prototype.remove = function (g) {
	            var result = false;
	            var findResult = this.findGraphicById(g.id);
	            if (findResult) {
	                g.destroy();
	                this.children.splice(findResult.index, 1);
	                g = null;
	                result = true;
	            }
	            return result;
	        };
	        GraphicGroup.prototype.clear = function () {
	            var i = 0, length = this.children.length, g = null;
	            for (; i < length; i++) {
	                g = this.children[i];
	                g.destroy();
	            }
	            this.children = [];
	        };
	        GraphicGroup.prototype.destroy = function () {
	            this.parent = null;
	            this.clear();
	        };
	        GraphicGroup.prototype.findGraphicById = function (graphicId) {
	            var i = 0, length = this.children.length, g = null;
	            for (; i < length; i++) {
	                g = this.children[i];
	                if (g.id === graphicId) {
	                    return {
	                        index: i,
	                        graphic: g
	                    };
	                }
	            }
	            return null;
	        };
	        GraphicGroup.prototype.shouldDraw = function () {
	            return this.visible && this.children.length > 0;
	        };
	        GraphicGroup.prototype.draw = function (camera) {
	            if (this.shouldDraw()) {
	                this.onDraw(camera);
	            }
	        };
	        GraphicGroup.prototype.onDraw = function (camera) {
	            this.children.forEach(function (g) {
	                if (g.shouldDraw(camera)) {
	                    g.draw(camera);
	                }
	            });
	        };
	        return GraphicGroup;
	    }());
	    return GraphicGroup;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel) {
	    "use strict";
	    var topic = {};
	    var Utils = (function () {
	        function Utils() {
	        }
	        Utils.isNumber = function (v) {
	            return typeof v === "number";
	        };
	        Utils.isInteger = function (v) {
	            var isInt = false;
	            var isNum = this.isNumber(v);
	            if (isNum) {
	                var numFloat = parseFloat(v);
	                var numInt = parseInt(v);
	                if (numFloat === numInt) {
	                    isInt = true;
	                }
	                else {
	                    isInt = false;
	                }
	            }
	            else {
	                isInt = false;
	            }
	            return isInt;
	        };
	        Utils.isPositive = function (v) {
	            return v > 0;
	        };
	        Utils.isNegative = function (v) {
	            return v < 0;
	        };
	        Utils.isNonNegative = function (v) {
	            return v >= 0;
	        };
	        Utils.isNonPositive = function (v) {
	            return v <= 0;
	        };
	        Utils.isPositiveInteger = function (v) {
	            return this.isPositive(v) && this.isInteger(v);
	        };
	        Utils.isNonNegativeInteger = function (v) {
	            return this.isNonNegative(v) && this.isInteger(v);
	        };
	        Utils.isArray = function (v) {
	            return Object.prototype.toString.call(v) === '[object Array]';
	        };
	        Utils.isFunction = function (v) {
	            return typeof v === 'function';
	        };
	        Utils.forEach = function (arr, func) {
	            return this.isFunction(arr.forEach) ? arr.forEach(func) : Array.prototype.forEach.call(arr, func);
	        };
	        Utils.filter = function (arr, func) {
	            return this.isFunction(arr.filter) ? arr.filter(func) : Array.prototype.filter.call(arr, func);
	        };
	        Utils.map = function (arr, func) {
	            return this.isFunction(arr.map) ? arr.map(func) : Array.prototype.map.call(arr, func);
	        };
	        Utils.some = function (arr, func) {
	            return this.isFunction(arr.some) ? arr.some(func) : Array.prototype.some.call(arr, func);
	        };
	        Utils.every = function (arr, func) {
	            return this.isFunction(arr.every) ? arr.every(func) : Array.prototype.every.call(arr, func);
	        };
	        Utils.filterRepeatArray = function (arr) {
	            var cloneArray = arr.map(function (item) {
	                return item;
	            });
	            var simplifyArray = [];
	            while (cloneArray.length > 0) {
	                var e = cloneArray[0];
	                var exist = simplifyArray.some(function (item) {
	                    return e.equals(item);
	                });
	                if (!exist) {
	                    simplifyArray.push(e);
	                }
	                cloneArray.splice(0, 1);
	            }
	            return simplifyArray;
	        };
	        Utils.jsonp = function (url, callback, callbackParameterName) {
	            if (callbackParameterName === void 0) { callbackParameterName = "cb"; }
	            var callbackName = "webglobe_callback_" + Math.random().toString().substring(2);
	            if (url.indexOf('?') < 0) {
	                url += '?';
	            }
	            else {
	                url += '&';
	            }
	            url += callbackParameterName + "=window." + callbackName;
	            var scriptElement = document.createElement("script");
	            scriptElement.setAttribute("src", url);
	            scriptElement.setAttribute("async", "true");
	            document.body.appendChild(scriptElement);
	            var canceled = false;
	            window[callbackName] = function (response) {
	                if (!canceled) {
	                    callback(response);
	                }
	                delete window[callbackName];
	                scriptElement.src = "";
	                if (scriptElement.parentNode) {
	                    scriptElement.parentNode.removeChild(scriptElement);
	                }
	            };
	            return function () {
	                canceled = true;
	            };
	        };
	        Utils.isMobile = function () {
	            return !!window.navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i);
	        };
	        Utils.wrapUrlWithProxy = function (url) {
	            if (Kernel.proxy) {
	                return Kernel.proxy + "?" + url;
	            }
	            return url;
	        };
	        Utils.subscribe = function (topicName, callback) {
	            if (!topic[topicName]) {
	                topic[topicName] = [];
	            }
	            topic[topicName].push(callback);
	        };
	        Utils.publish = function (topicName, data) {
	            var callbacks = topic[topicName];
	            if (callbacks && callbacks.length > 0) {
	                callbacks.forEach(function (callback) {
	                    callback(data);
	                });
	            }
	        };
	        return Utils;
	    }());
	    ;
	    return Utils;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Utils) {
	    "use strict";
	    var LocationData = (function () {
	        function LocationData() {
	        }
	        return LocationData;
	    }());
	    exports.LocationData = LocationData;
	    var targetOrigin = 'https://apis.map.qq.com';
	    var iframe = document.createElement("iframe");
	    var LocationService = (function () {
	        function LocationService() {
	        }
	        LocationService.init = function () {
	            window.addEventListener('message', function (event) {
	                var data = event.data;
	                if (data && data.module === 'geolocation') {
	                    Utils.publish('location', event.data);
	                }
	            }, false);
	            iframe.setAttribute("width", "0");
	            iframe.setAttribute("height", "0");
	            iframe.setAttribute("frameborder", "0");
	            iframe.setAttribute("scrolling", "no");
	            iframe.style.display = "none";
	            iframe.setAttribute("src", targetOrigin + "/tools/geolocation?key=YLZBZ-XDPKU-LWMV6-2WNPB-PL5W5-H6BGL&referer=WebGlobe");
	            document.body.appendChild(iframe);
	        };
	        LocationService.getLocation = function () {
	            iframe.contentWindow.postMessage('getLocation', targetOrigin);
	        };
	        LocationService.getRobustLocation = function () {
	            iframe.contentWindow.postMessage('getLocation.robust', targetOrigin);
	        };
	        LocationService.watchPosition = function () {
	            iframe.contentWindow.postMessage('watchPosition', targetOrigin);
	        };
	        LocationService.clearWatch = function () {
	            iframe.contentWindow.postMessage('clearWatch', targetOrigin);
	        };
	        return LocationService;
	    }());
	    LocationService.init();
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = LocationService;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel) {
	    "use strict";
	    var Renderer = (function () {
	        function Renderer(canvas, onBeforeRender, onAfterRender) {
	            this.canvas = canvas;
	            this.onBeforeRender = onBeforeRender;
	            this.onAfterRender = onAfterRender;
	            this.scene = null;
	            this.camera = null;
	            this.autoRefresh = false;
	            var gl;
	            function initWebGL(canvas) {
	                try {
	                    var contextList = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	                    for (var i = 0; i < contextList.length; i++) {
	                        gl = canvas.getContext(contextList[i], {
	                            antialias: true
	                        });
	                        if (gl) {
	                            Kernel.gl = gl;
	                            window.gl = gl;
	                            Kernel.canvas = canvas;
	                            break;
	                        }
	                    }
	                }
	                catch (e) { }
	            }
	            initWebGL(canvas);
	            if (!gl) {
	                console.debug("浏览器不支持WebGL或将WebGL禁用!");
	                return;
	            }
	            Kernel.gl.clear(Kernel.gl.COLOR_BUFFER_BIT | Kernel.gl.DEPTH_BUFFER_BIT);
	            gl.clearColor(0, 0, 0, 1);
	            gl.enable(gl.DEPTH_TEST);
	            gl.depthFunc(gl.LEQUAL);
	            gl.depthMask(true);
	            gl.enable(gl.CULL_FACE);
	            gl.frontFace(gl.CCW);
	            gl.cullFace(gl.BACK);
	        }
	        Renderer.prototype.render = function (scene, camera) {
	            var gl = Kernel.gl;
	            var canvas = Kernel.canvas;
	            gl.viewport(0, 0, canvas.width, canvas.height);
	            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	            gl.clearColor(0, 0, 0, 1);
	            camera.update();
	            if (this.onBeforeRender) {
	                this.onBeforeRender(this);
	            }
	            scene.draw(camera);
	            if (this.onAfterRender) {
	                this.onAfterRender(this);
	            }
	        };
	        Renderer.prototype.setScene = function (scene) {
	            this.scene = scene;
	        };
	        Renderer.prototype.setCamera = function (camera) {
	            this.camera = camera;
	        };
	        Renderer.prototype._tick = function () {
	            if (this.scene && this.camera) {
	                this.render(this.scene, this.camera);
	            }
	            if (this.autoRefresh) {
	                window.requestAnimationFrame(this._tick.bind(this));
	            }
	        };
	        Renderer.prototype.setIfAutoRefresh = function (auto) {
	            this.autoRefresh = auto;
	            if (this.autoRefresh) {
	                this._tick();
	            }
	        };
	        return Renderer;
	    }());
	    return Renderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(11), __webpack_require__(10), __webpack_require__(9), __webpack_require__(12), __webpack_require__(14), __webpack_require__(15), __webpack_require__(16)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Utils, MathUtils, Vertice, Vector, Line, TileGrid_1, Matrix, Object3D) {
	    "use strict";
	    var CameraCore = (function () {
	        function CameraCore(fov, aspect, near, far, floatLevel, matrix) {
	            this.fov = fov;
	            this.aspect = aspect;
	            this.near = near;
	            this.far = far;
	            this.floatLevel = floatLevel;
	            this.matrix = matrix;
	        }
	        CameraCore.prototype.getFov = function () {
	            return this.fov;
	        };
	        CameraCore.prototype.getAspect = function () {
	            return this.aspect;
	        };
	        CameraCore.prototype.getNear = function () {
	            return this.near;
	        };
	        CameraCore.prototype.getFar = function () {
	            return this.far;
	        };
	        CameraCore.prototype.getFloatLevel = function () {
	            return this.floatLevel;
	        };
	        CameraCore.prototype.getMatrix = function () {
	            return this.matrix;
	        };
	        CameraCore.prototype.equals = function (other) {
	            if (!other) {
	                return false;
	            }
	            return this.fov === other.getFov() &&
	                this.aspect === other.getAspect() &&
	                this.near === other.getNear() &&
	                this.far === other.getFar() &&
	                this.floatLevel === other.getFloatLevel() &&
	                this.matrix.equals(other.getMatrix());
	        };
	        return CameraCore;
	    }());
	    exports.CameraCore = CameraCore;
	    var realResolutionCache = {};
	    (function () {
	        for (var i = 0; i <= Kernel.MAX_LEVEL; i++) {
	            realResolutionCache[i] = Kernel.MAX_REAL_RESOLUTION / Math.pow(2, i);
	        }
	    })();
	    var Camera = (function (_super) {
	        __extends(Camera, _super);
	        function Camera(fov, aspect, near, far, level, lonlat) {
	            if (fov === void 0) { fov = 45; }
	            if (aspect === void 0) { aspect = 1; }
	            if (near === void 0) { near = 1; }
	            if (far === void 0) { far = 100; }
	            if (level === void 0) { level = 3; }
	            if (lonlat === void 0) { lonlat = [0, 0]; }
	            _super.call(this);
	            this.fov = fov;
	            this.aspect = aspect;
	            this.near = near;
	            this.far = far;
	            this.animationDuration = 200;
	            this.nearFactor = 0.6;
	            this.maxPitch = 40;
	            this.resolutionFactor1 = Math.pow(2, 0.3752950);
	            this.resolutionFactor2 = Math.pow(2, 1.3752950);
	            this.isZeroPitch = true;
	            this.level = -1;
	            this.floatLevel = -2;
	            this.lastFloatLevel = -3;
	            this.lastFov = -1;
	            this.lastAspect = -1;
	            this.lastNear = -1;
	            this.lastFar = -1;
	            this.lonlatsOfBoundary = null;
	            this.animating = false;
	            this.lonlatsOfBoundary = [];
	            this.initFov = this.fov;
	            this.lastMatrix = new Matrix();
	            this.lastMatrix.setUniqueValue(0);
	            this.projMatrix = new Matrix();
	            this._rawSetPerspectiveMatrix(this.fov, this.aspect, this.near, this.far);
	            this._initCameraPosition(level, lonlat[0], lonlat[1]);
	            this.update(true);
	        }
	        Camera.prototype.isEarthFullOverlapScreen = function () {
	            return this.lonlatsOfBoundary.length === 8;
	        };
	        Camera.prototype.getTileGridsOfBoundary = function (level, filterRepeat) {
	            var tileGridsOfBoundary = this.lonlatsOfBoundary.map(function (lonlat) {
	                return TileGrid_1.default.getTileGridByGeo(lonlat[0], lonlat[1], level);
	            });
	            return filterRepeat ? Utils.filterRepeatArray(tileGridsOfBoundary) : tileGridsOfBoundary;
	        };
	        Camera.prototype.toJson = function () {
	            function matrixToJson(mat) {
	                return mat ? mat.toJson() : null;
	            }
	            var json = {
	                matrix: matrixToJson(this.matrix),
	                isZeroPitch: this.isZeroPitch,
	                level: this.level,
	                floatLevel: this.floatLevel,
	                lastFloatLevel: this.lastFloatLevel,
	                lastMatrix: matrixToJson(this.lastMatrix),
	                lastFov: this.lastFov,
	                lastAspect: this.lastAspect,
	                lastNear: this.lastNear,
	                lastFar: this.lastFar,
	                viewMatrix: matrixToJson(this.viewMatrix),
	                projMatrix: matrixToJson(this.projMatrix),
	                projViewMatrix: matrixToJson(this.projViewMatrix),
	                matrixForDraw: matrixToJson(this.matrixForDraw),
	                viewMatrixForDraw: matrixToJson(this.viewMatrixForDraw),
	                projMatrixForDraw: matrixToJson(this.projMatrixForDraw),
	                projViewMatrixForDraw: matrixToJson(this.projViewMatrixForDraw),
	                animating: this.animating
	            };
	            return json;
	        };
	        Camera.prototype.toJsonString = function () {
	            return JSON.stringify(this.toJson());
	        };
	        Camera.prototype.fromJson = function (json) {
	            this.matrix = Matrix.fromJson(json.matrix);
	            this.isZeroPitch = json.isZeroPitch;
	            this.level = json.level;
	            this.floatLevel = json.floatLevel;
	            this.lastFloatLevel = json.lastFloatLevel;
	            this.lastMatrix = Matrix.fromJson(json.lastMatrix);
	            this.lastFov = json.lastFov;
	            this.lastAspect = json.lastAspect;
	            this.lastNear = json.lastNear;
	            this.lastFar = json.lastFar;
	            this.viewMatrix = Matrix.fromJson(json.viewMatrix);
	            this.projMatrix = Matrix.fromJson(json.projMatrix);
	            this.projViewMatrix = Matrix.fromJson(json.projViewMatrix);
	            this.matrixForDraw = Matrix.fromJson(json.matrixForDraw);
	            this.viewMatrixForDraw = Matrix.fromJson(json.viewMatrixForDraw);
	            this.projMatrixForDraw = Matrix.fromJson(json.projMatrixForDraw);
	            this.projViewMatrixForDraw = Matrix.fromJson(json.projViewMatrixForDraw);
	            this.animating = json.animating;
	            this.update(true);
	        };
	        Camera.prototype.fromJsonString = function (jsonStr) {
	            this.fromJson(JSON.parse(jsonStr));
	        };
	        Camera.prototype._setPerspectiveMatrix = function (fov, aspect, near, far) {
	            this._rawSetPerspectiveMatrix(fov, aspect, near, far);
	            this._updateFar();
	        };
	        Camera.prototype._rawSetPerspectiveMatrix = function (fov, aspect, near, far, projMatrix) {
	            if (projMatrix === void 0) { projMatrix = this.projMatrix; }
	            if (this.projMatrix === projMatrix) {
	                this.fov = fov;
	                this.aspect = aspect;
	                this.near = near;
	                this.far = far;
	            }
	            var mat = [
	                1, 0, 0, 0,
	                0, 1, 0, 0,
	                0, 0, 1, 0,
	                0, 0, 0, 1
	            ];
	            var halfFov = fov * Math.PI / 180 / 2;
	            var f = 1 / Math.tan(halfFov);
	            var nf = 1 / (near - far);
	            mat[0] = f / aspect;
	            mat[5] = f;
	            mat[10] = (far + near) * nf;
	            mat[11] = -1;
	            mat[14] = 2 * near * far * nf;
	            mat[15] = 0;
	            projMatrix.setElements(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5], mat[6], mat[7], mat[8], mat[9], mat[10], mat[11], mat[12], mat[13], mat[14], mat[15]);
	        };
	        Camera.prototype._setFov = function (fov) {
	            if (!(fov > 0)) {
	                throw "invalid fov:" + fov;
	            }
	            this._setPerspectiveMatrix(fov, this.aspect, this.near, this.far);
	        };
	        Camera.prototype.setAspect = function (aspect) {
	            if (!(aspect > 0)) {
	                throw "invalid aspect:" + aspect;
	            }
	            this._setPerspectiveMatrix(this.fov, aspect, this.near, this.far);
	            this.setLevel(this.level, true);
	        };
	        Camera.prototype._updateFar = function () {
	        };
	        Camera.prototype._getMinimalFar = function (cameraPosition) {
	            var distance2EarthOrigin = Vector.fromVertice(cameraPosition).getLength();
	            var far = Math.sqrt(distance2EarthOrigin * distance2EarthOrigin - Kernel.EARTH_RADIUS * Kernel.EARTH_RADIUS);
	            far *= 1.05;
	            return far;
	        };
	        Camera.prototype.update = function (force) {
	            if (force === void 0) { force = false; }
	            var shouldUpdate = this._updateCore(force);
	            if (shouldUpdate) {
	                this._updateTileGridsOfBoundary();
	            }
	            return shouldUpdate;
	        };
	        Camera.prototype._updateCore = function (force) {
	            if (force === void 0) { force = false; }
	            var shouldUpdate = force || this._isNeedUpdate();
	            if (shouldUpdate) {
	                this._normalUpdate();
	                this._updateProjViewMatrixForDraw();
	            }
	            this.lastFov = this.fov;
	            this.lastAspect = this.aspect;
	            this.lastNear = this.near;
	            this.lastFar = this.far;
	            this.lastFloatLevel = this.floatLevel;
	            this.lastMatrix.setMatrixByOther(this.matrix);
	            return shouldUpdate;
	        };
	        Camera.prototype._updateTileGridsOfBoundary = function () {
	            var _this = this;
	            var lonlatsOfBoundary = [];
	            var ndcs = [
	                [-1, 1],
	                [-1, 0],
	                [-1, -1],
	                [1, 1],
	                [1, 0],
	                [1, -1],
	                [0, 1],
	                [0, -1]
	            ];
	            ndcs.forEach(function (ndcXY) {
	                var lonlat = _this._getPickLonLatByNDC(ndcXY[0], ndcXY[1]);
	                if (lonlat && lonlat.length > 0) {
	                    lonlatsOfBoundary.push(lonlat);
	                }
	            });
	            this.lonlatsOfBoundary = lonlatsOfBoundary;
	        };
	        Camera.prototype.getCameraCore = function () {
	            return new CameraCore(this.fov, this.aspect, this.near, this.far, this.floatLevel, this.matrix.clone());
	        };
	        Camera.prototype._isNeedUpdate = function () {
	            return (this.fov !== this.lastFov) ||
	                (this.aspect !== this.lastAspect) ||
	                (this.near !== this.lastNear) ||
	                (this.far !== this.lastFar) ||
	                (this.floatLevel !== this.lastFloatLevel) ||
	                (!this.matrix.equals(this.lastMatrix));
	        };
	        Camera.prototype.getProjViewMatrixForDraw = function () {
	            return this.projViewMatrixForDraw;
	        };
	        Camera.prototype._normalUpdate = function () {
	            this.viewMatrix = this.matrix.getInverseMatrix();
	            this._updateFar();
	            this.projViewMatrix = this.projMatrix.multiplyMatrix(this.viewMatrix);
	        };
	        Camera.prototype._updateProjViewMatrixForDraw = function () {
	            this.matrixForDraw = this.matrix.clone();
	            var newFov = this._updatePositionAndFov(this.matrixForDraw);
	            var aspect = this.aspect;
	            var near = this.near;
	            var newPosition = this.matrixForDraw.getPosition();
	            var newFar = this.far;
	            this.projMatrixForDraw = new Matrix();
	            this._rawSetPerspectiveMatrix(newFov, aspect, near, newFar, this.projMatrixForDraw);
	            this.viewMatrixForDraw = this.matrixForDraw.getInverseMatrix();
	            this.projViewMatrixForDraw = this.projMatrixForDraw.multiplyMatrix(this.viewMatrixForDraw);
	        };
	        Camera.prototype._updatePositionAndFov = function (cameraMatrix) {
	            var currentLevel = this.animating ? this.floatLevel : this.level;
	            var safeLevel = this._getSafeThresholdLevelForNear();
	            if (currentLevel > safeLevel) {
	                this._updatePositionByLevel(safeLevel, cameraMatrix);
	                var deltaLevel = currentLevel - safeLevel;
	                var newFov = this._calculateFovByDeltaLevel(this.initFov, deltaLevel);
	                return newFov;
	            }
	            else {
	                this._updatePositionByLevel(currentLevel, cameraMatrix);
	                return this.initFov;
	            }
	        };
	        Camera.prototype._getSafeThresholdLevelForNear = function () {
	            var thresholdNear = this.near * this.nearFactor;
	            var result = this._calculateResolutionAndBestDisplayLevelByDistance2EarthSurface(thresholdNear);
	            var level = result[1];
	            return level;
	        };
	        Camera.prototype._calculateDeltaLevelByFov = function (oldFov, newFov) {
	            var radianOldFov = MathUtils.degreeToRadian(oldFov);
	            var halfRadianOldFov = radianOldFov / 2;
	            var tanOld = Math.tan(halfRadianOldFov);
	            var radianNewFov = MathUtils.degreeToRadian(newFov);
	            var halfRadianNewFov = radianNewFov / 2;
	            var tanNew = Math.tan(halfRadianNewFov);
	            var deltaLevel = MathUtils.log2(tanOld / tanNew);
	            return deltaLevel;
	        };
	        Camera.prototype._calculateFovByDeltaLevel = function (oldFov, deltaLevel) {
	            var radianOldFov = MathUtils.degreeToRadian(oldFov);
	            var halfRadianOldFov = radianOldFov / 2;
	            var tanOld = Math.tan(halfRadianOldFov);
	            var tanNew = tanOld / Math.pow(2, deltaLevel);
	            var halfRadianNewFov = Math.atan(tanNew);
	            var radianNewFov = halfRadianNewFov * 2;
	            var newFov = MathUtils.radianToDegree(radianNewFov);
	            return newFov;
	        };
	        Camera.prototype.measureXYResolutionAndBestDisplayLevel = function () {
	            var p = this.matrix.getPosition();
	            var dir = Vector.fromVertice(p);
	            var line = new Line(p, dir);
	            var pickResult1 = this._getPickCartesianCoordInEarthByLine(line);
	            var p1 = pickResult1[0];
	            var ndc1 = this._convertVerticeFromWorldToNDC(p1);
	            var canvasXY1 = MathUtils.convertPointFromNdcToCanvas(ndc1.x, ndc1.y);
	            var centerX = canvasXY1[0];
	            var centerY = canvasXY1[1];
	            var offsetPixel = 10;
	            var leftPickResult = this.getPickCartesianCoordInEarthByCanvas(centerX - offsetPixel, centerY);
	            var vLeft = Vector.fromVertice(leftPickResult[0]);
	            var rightPickResult = this.getPickCartesianCoordInEarthByCanvas(centerX + offsetPixel, centerY);
	            var vRight = Vector.fromVertice(rightPickResult[0]);
	            var α = Vector.getRadianOfTwoVectors(vLeft, vRight);
	            var resolutionX = α * Kernel.EARTH_RADIUS / (2 * offsetPixel) * this.resolutionFactor1;
	            var bestDisplayLevelFloatX = this._calculateLevelByResolution(resolutionX);
	            var topPickResult = this.getPickCartesianCoordInEarthByCanvas(centerX, centerY + offsetPixel);
	            var vTop = Vector.fromVertice(topPickResult[0]);
	            var bottomPickResult = this.getPickCartesianCoordInEarthByCanvas(centerX, centerY - offsetPixel);
	            var vBottom = Vector.fromVertice(bottomPickResult[0]);
	            var β = Vector.getRadianOfTwoVectors(vTop, vBottom);
	            var resolutionY = β * Kernel.EARTH_RADIUS / (2 * offsetPixel) * this.resolutionFactor1;
	            var bestDisplayLevelFloatY = this._calculateLevelByResolution(resolutionY);
	            return {
	                resolutionX: resolutionX,
	                bestDisplayLevelFloatX: bestDisplayLevelFloatX,
	                resolutionY: resolutionY,
	                bestDisplayLevelFloatY: bestDisplayLevelFloatY
	            };
	        };
	        Camera.prototype.calculateCurrentResolutionAndBestDisplayLevel = function () {
	            var distance2EarthOrigin = this.getDistance2EarthOrigin();
	            return this._calculateResolutionAndBestDisplayLevelByDistance2EarthOrigin(distance2EarthOrigin);
	        };
	        Camera.prototype._calculateResolutionAndBestDisplayLevelByDistance2EarthOrigin = function (distance2EarthOrigin) {
	            var α2 = MathUtils.degreeToRadian(this.fov / 2);
	            var α1 = Math.atan(2 / Kernel.canvas.height * Math.tan(α2));
	            var δ = Math.asin(distance2EarthOrigin * Math.sin(α1) / Kernel.EARTH_RADIUS);
	            var β = δ - α1;
	            var resolution = β * Kernel.EARTH_RADIUS * this.resolutionFactor2;
	            var bestDisplayLevelFloat = this._calculateLevelByResolution(resolution);
	            return [resolution, bestDisplayLevelFloat];
	        };
	        Camera.prototype._calculateResolutionAndBestDisplayLevelByDistance2EarthSurface = function (distance2EarthSurface) {
	            var distance2EarthOrigin = distance2EarthSurface + Kernel.EARTH_RADIUS;
	            return this._calculateResolutionAndBestDisplayLevelByDistance2EarthOrigin(distance2EarthOrigin);
	        };
	        Camera.prototype._calculateDistance2EarthSurfaceByBestDisplayLevel = function (level) {
	            return this._calculateDistance2EarthOriginByBestDisplayLevel(level) - Kernel.EARTH_RADIUS;
	        };
	        Camera.prototype._calculateDistance2EarthOriginByBestDisplayLevel = function (level) {
	            var resolution = this._calculateResolutionByLevel(level);
	            return this._calculateDistance2EarthOriginByResolution(resolution);
	        };
	        Camera.prototype._calculateDistance2EarthOriginByResolution = function (resolution) {
	            resolution /= this.resolutionFactor2;
	            var α2 = MathUtils.degreeToRadian(this.fov / 2);
	            var α1 = Math.atan(2 / Kernel.canvas.height * Math.tan(α2));
	            var β = resolution / Kernel.EARTH_RADIUS;
	            var δ = α1 + β;
	            var distance2EarthOrigin = Kernel.EARTH_RADIUS * Math.sin(δ) / Math.sin(α1);
	            return distance2EarthOrigin;
	        };
	        Camera.prototype._calculateLevelByResolution = function (resolution) {
	            var pow2value = Kernel.MAX_RESOLUTION / resolution;
	            var bestDisplayLevelFloat = MathUtils.log2(pow2value);
	            return bestDisplayLevelFloat;
	        };
	        Camera.prototype._calculateResolutionByLevel = function (level) {
	            return Kernel.MAX_RESOLUTION / Math.pow(2, level);
	        };
	        Camera.prototype.getResolutionInWorld = function () {
	            if (realResolutionCache.hasOwnProperty(this.level)) {
	                return realResolutionCache[this.level];
	            }
	            else {
	                return Kernel.MAX_REAL_RESOLUTION / Math.pow(2, this.level);
	            }
	        };
	        Camera.prototype.getLevel = function () {
	            return this.level;
	        };
	        Camera.prototype.setLevel = function (level, force) {
	            if (force === void 0) { force = false; }
	            if (!(Utils.isNonNegativeInteger(level))) {
	                throw "invalid level:" + level;
	            }
	            if (level < Kernel.MIN_LEVEL) {
	                level = Kernel.MIN_LEVEL;
	            }
	            if (level > Kernel.MAX_LEVEL) {
	                level = Kernel.MAX_LEVEL;
	            }
	            if (level !== this.level || force) {
	                var isLevelChanged = this._updatePositionByLevel(level, this.matrix);
	                this.level = level;
	                this.floatLevel = level;
	            }
	        };
	        Camera.prototype._initCameraPosition = function (level, lon, lat) {
	            var initDistanceToOrigin = this._calculateDistance2EarthOriginByBestDisplayLevel(level);
	            var initPosition = MathUtils.geographicToCartesianCoord(lon, lat, initDistanceToOrigin);
	            var origin = new Vertice(0, 0, 0);
	            var vector = this.getLightDirection().getOpposite();
	            vector.setLength(initDistanceToOrigin);
	            this._look(initPosition, origin);
	            this.setLevel(level);
	        };
	        Camera.prototype._updatePositionByLevel = function (level, cameraMatrix) {
	            var globe = Kernel.globe;
	            var intersects = this._getDirectionIntersectPointWithEarth(cameraMatrix);
	            if (intersects.length === 0) {
	                throw "no intersect";
	            }
	            var intersect = intersects[0];
	            var theoryDistance2Interscet = this._calculateDistance2EarthSurfaceByBestDisplayLevel(level);
	            var vector = cameraMatrix.getVectorZ();
	            vector.setLength(theoryDistance2Interscet);
	            var newCameraPosition = Vector.verticePlusVector(intersect, vector);
	            cameraMatrix.setPosition(newCameraPosition);
	        };
	        Camera.prototype.setDeltaPitch = function (deltaPitch) {
	            var currentPitch = this.getPitch();
	            var newPitch = currentPitch + deltaPitch;
	            if (newPitch > this.maxPitch) {
	                return;
	            }
	            if (newPitch < 0) {
	                newPitch = 0;
	            }
	            deltaPitch = newPitch - currentPitch;
	            if (deltaPitch === 0) {
	                return;
	            }
	            var intersects = this._getDirectionIntersectPointWithEarth(this.matrix);
	            if (intersects.length === 0) {
	                throw "no intersects";
	            }
	            var intersect = intersects[0];
	            var deltaRadian = MathUtils.degreeToRadian(deltaPitch);
	            var matrix = this.matrix.clone();
	            matrix.setPosition(intersect);
	            matrix.localRotateX(deltaRadian);
	            this._updatePositionByLevel(this.level, matrix);
	            this.isZeroPitch = newPitch === 0;
	            this.matrix = matrix;
	        };
	        Camera.prototype.getPitch = function () {
	            if (this.isZeroPitch) {
	                return 0;
	            }
	            var intersects = this._getDirectionIntersectPointWithEarth(this.matrix);
	            if (intersects.length === 0) {
	                throw "no intersects";
	            }
	            var intersect = intersects[0];
	            var vectorOrigin2Intersect = Vector.fromVertice(intersect);
	            var length1 = vectorOrigin2Intersect.getLength();
	            var vectorIntersect2Camera = Vector.verticeMinusVertice(this.getPosition(), intersect);
	            var length2 = vectorIntersect2Camera.getLength();
	            var cosθ = vectorOrigin2Intersect.dot(vectorIntersect2Camera) / (length1 * length2);
	            var radian = MathUtils.acosSafely(cosθ);
	            var crossVector = vectorOrigin2Intersect.cross(vectorIntersect2Camera);
	            var xAxisDirection = this.matrix.getVectorX();
	            if (crossVector.dot(xAxisDirection)) {
	                radian = Math.abs(radian);
	            }
	            else {
	                radian = -Math.abs(radian);
	            }
	            var pitch = MathUtils.radianToDegree(radian);
	            if (pitch >= 90) {
	                throw "Invalid pitch: " + pitch;
	            }
	            return pitch;
	        };
	        Camera.prototype.getPickCartesianCoordInEarthByCanvas = function (canvasX, canvasY) {
	            this._updateCore();
	            var matrix = this.matrix;
	            var viewMatrix = this.viewMatrix;
	            var projMatrix = this.projMatrix;
	            var projViewMatrix = this.projViewMatrix;
	            this.matrix = this.matrixForDraw;
	            this.viewMatrix = this.viewMatrixForDraw;
	            this.projMatrix = this.projMatrixForDraw;
	            this.projViewMatrix = this.projViewMatrixForDraw;
	            var pickDirection = this._getPickDirectionByCanvas(canvasX, canvasY);
	            var p = this.getPosition();
	            var line = new Line(p, pickDirection);
	            var result = this._getPickCartesianCoordInEarthByLine(line);
	            this.matrix = matrix;
	            this.viewMatrix = viewMatrix;
	            this.projMatrix = projMatrix;
	            this.projViewMatrix = projViewMatrix;
	            return result;
	        };
	        Camera.prototype.getLightDirection = function () {
	            var dirVertice = this.matrix.getVectorZ();
	            var direction = new Vector(-dirVertice.x, -dirVertice.y, -dirVertice.z);
	            direction.normalize();
	            return direction;
	        };
	        Camera.prototype.getDistance2EarthSurface = function () {
	            var position = this.getPosition();
	            var length2EarthSurface = Vector.fromVertice(position).getLength() - Kernel.EARTH_RADIUS;
	            return length2EarthSurface;
	        };
	        Camera.prototype.getDistance2EarthOrigin = function () {
	            var position = this.getPosition();
	            return Vector.fromVertice(position).getLength();
	        };
	        Camera.prototype.isAnimating = function () {
	            return this.animating;
	        };
	        Camera.prototype.animateToLevel = function (newLevel, cb) {
	            var _this = this;
	            if (this.isAnimating()) {
	                return;
	            }
	            if (!(Utils.isNonNegativeInteger(newLevel))) {
	                throw "invalid level:" + newLevel;
	            }
	            var newCameraMatrix = this.matrix.clone();
	            this._updatePositionByLevel(newLevel, newCameraMatrix);
	            var newPosition = newCameraMatrix.getPosition();
	            var oldPosition = this.getPosition();
	            var span = this.animationDuration;
	            var singleSpan = 1000 / 60;
	            var count = Math.floor(span / singleSpan);
	            var deltaX = (newPosition.x - oldPosition.x) / count;
	            var deltaY = (newPosition.y - oldPosition.y) / count;
	            var deltaZ = (newPosition.z - oldPosition.z) / count;
	            var deltaLevel = (newLevel - this.level) / count;
	            var start = -1;
	            this.floatLevel = this.level;
	            this.animating = true;
	            var callback = function (timestap) {
	                if (start < 0) {
	                    start = timestap;
	                }
	                var a = timestap - start;
	                if (a >= span) {
	                    _this.animating = false;
	                    _this.floatLevel = newLevel;
	                    _this.setLevel(newLevel);
	                    if (cb) {
	                        cb();
	                    }
	                }
	                else {
	                    _this.floatLevel += deltaLevel;
	                    var p = _this.getPosition();
	                    _this.setPosition(new Vertice(p.x + deltaX, p.y + deltaY, p.z + deltaZ));
	                    requestAnimationFrame(callback);
	                }
	            };
	            requestAnimationFrame(callback);
	        };
	        Camera.prototype._look = function (cameraPnt, targetPnt, upDirection) {
	            if (upDirection === void 0) { upDirection = new Vector(0, 1, 0); }
	            var cameraPntCopy = cameraPnt.clone();
	            var targetPntCopy = targetPnt.clone();
	            var up = upDirection.clone();
	            var zAxis = new Vector(cameraPntCopy.x - targetPntCopy.x, cameraPntCopy.y - targetPntCopy.y, cameraPntCopy.z - targetPntCopy.z);
	            zAxis.normalize();
	            var xAxis = up.cross(zAxis).normalize();
	            var yAxis = zAxis.cross(xAxis).normalize();
	            this.matrix.setVectorX(xAxis);
	            this.matrix.setVectorY(yAxis);
	            this.matrix.setVectorZ(zAxis);
	            this.matrix.setPosition(cameraPntCopy);
	            this.matrix.setLastRowDefault();
	            this._updateFar();
	        };
	        Camera.prototype._lookAt = function (targetPnt, upDirection) {
	            var targetPntCopy = targetPnt.clone();
	            var position = this.getPosition();
	            this._look(position, targetPntCopy, upDirection);
	        };
	        Camera.prototype._getPickDirectionByCanvas = function (canvasX, canvasY) {
	            var ndcXY = MathUtils.convertPointFromCanvasToNDC(canvasX, canvasY);
	            var pickDirection = this._getPickDirectionByNDC(ndcXY[0], ndcXY[1]);
	            return pickDirection;
	        };
	        Camera.prototype._getDirectionIntersectPointWithEarth = function (cameraMatrix) {
	            var dir = cameraMatrix.getVectorZ().getOpposite();
	            var p = cameraMatrix.getPosition();
	            var line = new Line(p, dir);
	            var result = this._getPickCartesianCoordInEarthByLine(line);
	            return result;
	        };
	        Camera.prototype._getPickDirectionByNDC = function (ndcX, ndcY) {
	            var verticeInNDC = new Vertice(ndcX, ndcY, 0.499);
	            var verticeInWorld = this._convertVerticeFromNdcToWorld(verticeInNDC);
	            var cameraPositon = this.getPosition();
	            var pickDirection = Vector.verticeMinusVertice(verticeInWorld, cameraPositon);
	            pickDirection.normalize();
	            return pickDirection;
	        };
	        Camera.prototype._getPickCartesianCoordInEarthByLine = function (line) {
	            var result = [];
	            var pickVertices = MathUtils.getLineIntersectPointWithEarth(line);
	            if (pickVertices.length === 0) {
	                result = [];
	            }
	            else if (pickVertices.length == 1) {
	                result = pickVertices;
	            }
	            else if (pickVertices.length == 2) {
	                var pickVerticeA = pickVertices[0];
	                var pickVerticeB = pickVertices[1];
	                var cameraVertice = this.getPosition();
	                var lengthA = MathUtils.getLengthFromVerticeToVertice(cameraVertice, pickVerticeA);
	                var lengthB = MathUtils.getLengthFromVerticeToVertice(cameraVertice, pickVerticeB);
	                result = lengthA <= lengthB ? [pickVerticeA, pickVerticeB] : [pickVerticeB, pickVerticeA];
	            }
	            return result;
	        };
	        Camera.prototype._getPickLonLatByNDC = function (ndcX, ndcY) {
	            var result = null;
	            var vertices = this._getPickCartesianCoordInEarthByNDC(ndcX, ndcY);
	            if (vertices.length > 0) {
	                result = MathUtils.cartesianCoordToGeographic(vertices[0]);
	            }
	            return result;
	        };
	        Camera.prototype._getPickCartesianCoordInEarthByNDC = function (ndcX, ndcY) {
	            var pickDirection = this._getPickDirectionByNDC(ndcX, ndcY);
	            var p = this.getPosition();
	            var line = new Line(p, pickDirection);
	            var result = this._getPickCartesianCoordInEarthByLine(line);
	            return result;
	        };
	        Camera.prototype._getPlanXOZ = function () {
	            var position = this.getPosition();
	            var direction = this.getLightDirection();
	            var plan = MathUtils.getCrossPlaneByLine(position, direction);
	            return plan;
	        };
	        Camera.prototype._convertVerticeFromWorldToNDC = function (verticeInWorld) {
	            var columnWorld = [verticeInWorld.x, verticeInWorld.y, verticeInWorld.z, 1];
	            var columnProject = this.projViewMatrix.multiplyColumn(columnWorld);
	            var w = columnProject[3];
	            var columnNDC = [];
	            columnNDC[0] = columnProject[0] / w;
	            columnNDC[1] = columnProject[1] / w;
	            columnNDC[2] = columnProject[2] / w;
	            columnNDC[3] = 1;
	            var verticeInNDC = new Vertice(columnNDC[0], columnNDC[1], columnNDC[2]);
	            return verticeInNDC;
	        };
	        Camera.prototype._convertVerticeFromNdcToWorld = function (verticeInNDC) {
	            var columnNDC = [verticeInNDC.x, verticeInNDC.y, verticeInNDC.z, 1];
	            var inverseProj = this.projMatrix.getInverseMatrix();
	            var columnCameraTemp = inverseProj.multiplyColumn(columnNDC);
	            var cameraX = columnCameraTemp[0] / columnCameraTemp[3];
	            var cameraY = columnCameraTemp[1] / columnCameraTemp[3];
	            var cameraZ = columnCameraTemp[2] / columnCameraTemp[3];
	            var cameraW = 1;
	            var columnCamera = [cameraX, cameraY, cameraZ, cameraW];
	            var columnWorld = this.matrix.multiplyColumn(columnCamera);
	            var verticeInWorld = new Vertice(columnWorld[0], columnWorld[1], columnWorld[2]);
	            return verticeInWorld;
	        };
	        Camera.prototype._convertVerticeFromCameraToWorld = function (verticeInCamera) {
	            var verticeInCameraCopy = verticeInCamera.clone();
	            var column = [verticeInCameraCopy.x, verticeInCameraCopy.y, verticeInCameraCopy.z, 1];
	            var column2 = this.matrix.multiplyColumn(column);
	            var verticeInWorld = new Vertice(column2[0], column2[1], column2[2]);
	            return verticeInWorld;
	        };
	        Camera.prototype._convertVectorFromCameraToWorld = function (vectorInCamera) {
	            var vectorInCameraCopy = vectorInCamera.clone();
	            var verticeInCamera = vectorInCameraCopy.getVertice();
	            var verticeInWorld = this._convertVerticeFromCameraToWorld(verticeInCamera);
	            var originInWorld = this.getPosition();
	            var vectorInWorld = Vector.verticeMinusVertice(verticeInWorld, originInWorld);
	            vectorInWorld.normalize();
	            return vectorInWorld;
	        };
	        Camera.prototype._isWorldVerticeVisibleInCanvas = function (verticeInWorld, options) {
	            if (options === void 0) { options = {}; }
	            var threshold = typeof options.threshold == "number" ? Math.abs(options.threshold) : 1;
	            var cameraP = this.getPosition();
	            var dir = Vector.verticeMinusVertice(verticeInWorld, cameraP);
	            var line = new Line(cameraP, dir);
	            var pickResult = this._getPickCartesianCoordInEarthByLine(line);
	            if (pickResult.length > 0) {
	                var pickVertice = pickResult[0];
	                var length2Vertice = MathUtils.getLengthFromVerticeToVertice(cameraP, verticeInWorld);
	                var length2Pick = MathUtils.getLengthFromVerticeToVertice(cameraP, pickVertice);
	                if (length2Vertice < length2Pick + 5) {
	                    if (!(options.verticeInNDC instanceof Vertice)) {
	                        options.verticeInNDC = this._convertVerticeFromWorldToNDC(verticeInWorld);
	                    }
	                    var result = options.verticeInNDC.x >= -1 && options.verticeInNDC.x <= 1 && options.verticeInNDC.y >= -threshold && options.verticeInNDC.y <= 1;
	                    return result;
	                }
	            }
	            return false;
	        };
	        Camera.prototype._isGeoVisibleInCanvas = function (lon, lat, options) {
	            var verticeInWorld = MathUtils.geographicToCartesianCoord(lon, lat);
	            var result = this._isWorldVerticeVisibleInCanvas(verticeInWorld, options);
	            return result;
	        };
	        Camera.prototype.getVisibleTilesByLevel = function (level, options) {
	            if (options === void 0) { options = {}; }
	            if (!(level >= 0)) {
	                throw "invalid level";
	            }
	            var result = [];
	            var LOOP_LIMIT = Math.min(10, Math.pow(2, level) - 1);
	            var mathOptions = {
	                maxSize: Math.pow(2, level)
	            };
	            function checkVisible(visibleInfo) {
	                if (visibleInfo.area >= 5000 && visibleInfo.clockwise) {
	                    if (visibleInfo.visibleCount >= 1) {
	                        return true;
	                    }
	                }
	                return false;
	            }
	            function handleRow(centerRow, centerColumn) {
	                var result = [];
	                var grid = new TileGrid_1.default(level, centerRow, centerColumn);
	                var visibleInfo = this._getTileVisibleInfo(grid.level, grid.row, grid.column, options);
	                var isRowCenterVisible = checkVisible(visibleInfo);
	                if (isRowCenterVisible) {
	                    grid.visibleInfo = visibleInfo;
	                    result.push(grid);
	                    var leftLoopTime = 0;
	                    var leftColumn = centerColumn;
	                    var visible;
	                    while (leftLoopTime < LOOP_LIMIT) {
	                        leftLoopTime++;
	                        grid = TileGrid_1.default.getTileGridByBrother(level, centerRow, leftColumn, TileGrid_1.TileGridPosition.LEFT, mathOptions);
	                        leftColumn = grid.column;
	                        visibleInfo = this._getTileVisibleInfo(grid.level, grid.row, grid.column, options);
	                        visible = checkVisible(visibleInfo);
	                        if (visible) {
	                            grid.visibleInfo = visibleInfo;
	                            result.push(grid);
	                        }
	                        else {
	                            break;
	                        }
	                    }
	                    var rightLoopTime = 0;
	                    var rightColumn = centerColumn;
	                    while (rightLoopTime < LOOP_LIMIT) {
	                        rightLoopTime++;
	                        grid = TileGrid_1.default.getTileGridByBrother(level, centerRow, rightColumn, TileGrid_1.TileGridPosition.RIGHT, mathOptions);
	                        rightColumn = grid.column;
	                        visibleInfo = this._getTileVisibleInfo(grid.level, grid.row, grid.column, options);
	                        visible = checkVisible(visibleInfo);
	                        if (visible) {
	                            grid.visibleInfo = visibleInfo;
	                            result.push(grid);
	                        }
	                        else {
	                            break;
	                        }
	                    }
	                }
	                return result;
	            }
	            var centerGrid = null;
	            var verticalCenterInfo = this._getVerticalVisibleCenterInfo();
	            if (TileGrid_1.default.isValidLatitude(verticalCenterInfo.lat)) {
	                centerGrid = TileGrid_1.default.getTileGridByGeo(verticalCenterInfo.lon, verticalCenterInfo.lat, level);
	            }
	            else {
	                centerGrid = new TileGrid_1.default(level, 0, 0);
	            }
	            var handleRowThis = handleRow.bind(this);
	            var rowResult = handleRowThis(centerGrid.row, centerGrid.column);
	            result = result.concat(rowResult);
	            var grid;
	            var bottomLoopTime = 0;
	            var bottomRow = centerGrid.row;
	            while (bottomLoopTime < LOOP_LIMIT) {
	                bottomLoopTime++;
	                grid = TileGrid_1.default.getTileGridByBrother(level, bottomRow, centerGrid.column, TileGrid_1.TileGridPosition.BOTTOM, mathOptions);
	                bottomRow = grid.row;
	                rowResult = handleRowThis(grid.row, grid.column);
	                if (rowResult.length > 0) {
	                    result = result.concat(rowResult);
	                }
	                else {
	                    break;
	                }
	            }
	            var topLoopTime = 0;
	            var topRow = centerGrid.row;
	            while (topLoopTime < LOOP_LIMIT) {
	                topLoopTime++;
	                grid = TileGrid_1.default.getTileGridByBrother(level, topRow, centerGrid.column, TileGrid_1.TileGridPosition.TOP, mathOptions);
	                topRow = grid.row;
	                rowResult = handleRowThis(grid.row, grid.column);
	                if (rowResult.length > 0) {
	                    result = result.concat(rowResult);
	                }
	                else {
	                    break;
	                }
	            }
	            return result;
	        };
	        Camera.prototype._getTileVisibleInfo = function (level, row, column, options) {
	            if (!(level >= 0)) {
	                throw "invalid level";
	            }
	            if (!(row >= 0)) {
	                throw "invalid row";
	            }
	            if (!(column >= 0)) {
	                throw "invalid column";
	            }
	            var threshold = typeof options.threshold == "number" ? Math.abs(options.threshold) : 1;
	            options.threshold = threshold;
	            var result = {
	                lb: {
	                    lon: null,
	                    lat: null,
	                    verticeInWorld: null,
	                    verticeInNDC: null,
	                    visible: false
	                },
	                lt: {
	                    lon: null,
	                    lat: null,
	                    verticeInWorld: null,
	                    verticeInNDC: null,
	                    visible: false
	                },
	                rt: {
	                    lon: null,
	                    lat: null,
	                    verticeInWorld: null,
	                    verticeInNDC: null,
	                    visible: false
	                },
	                rb: {
	                    lon: null,
	                    lat: null,
	                    verticeInWorld: null,
	                    verticeInNDC: null,
	                    visible: false
	                },
	                Egeo: null,
	                visibleCount: 0,
	                clockwise: false,
	                width: null,
	                height: null,
	                area: null
	            };
	            result.Egeo = MathUtils.getTileGeographicEnvelopByGrid(level, row, column);
	            var tileMinLon = result.Egeo.minLon;
	            var tileMaxLon = result.Egeo.maxLon;
	            var tileMinLat = result.Egeo.minLat;
	            var tileMaxLat = result.Egeo.maxLat;
	            result.lb.lon = tileMinLon;
	            result.lb.lat = tileMinLat;
	            result.lb.verticeInWorld = MathUtils.geographicToCartesianCoord(result.lb.lon, result.lb.lat);
	            result.lb.verticeInNDC = this._convertVerticeFromWorldToNDC(result.lb.verticeInWorld);
	            result.lb.visible = this._isWorldVerticeVisibleInCanvas(result.lb.verticeInWorld, {
	                verticeInNDC: result.lb.verticeInNDC,
	                threshold: threshold
	            });
	            if (result.lb.visible) {
	                result.visibleCount++;
	            }
	            result.lt.lon = tileMinLon;
	            result.lt.lat = tileMaxLat;
	            result.lt.verticeInWorld = MathUtils.geographicToCartesianCoord(result.lt.lon, result.lt.lat);
	            result.lt.verticeInNDC = this._convertVerticeFromWorldToNDC(result.lt.verticeInWorld);
	            result.lt.visible = this._isWorldVerticeVisibleInCanvas(result.lt.verticeInWorld, {
	                verticeInNDC: result.lt.verticeInNDC,
	                threshold: threshold
	            });
	            if (result.lt.visible) {
	                result.visibleCount++;
	            }
	            result.rt.lon = tileMaxLon;
	            result.rt.lat = tileMaxLat;
	            result.rt.verticeInWorld = MathUtils.geographicToCartesianCoord(result.rt.lon, result.rt.lat);
	            result.rt.verticeInNDC = this._convertVerticeFromWorldToNDC(result.rt.verticeInWorld);
	            result.rt.visible = this._isWorldVerticeVisibleInCanvas(result.rt.verticeInWorld, {
	                verticeInNDC: result.rt.verticeInNDC,
	                threshold: threshold
	            });
	            if (result.rt.visible) {
	                result.visibleCount++;
	            }
	            result.rb.lon = tileMaxLon;
	            result.rb.lat = tileMinLat;
	            result.rb.verticeInWorld = MathUtils.geographicToCartesianCoord(result.rb.lon, result.rb.lat);
	            result.rb.verticeInNDC = this._convertVerticeFromWorldToNDC(result.rb.verticeInWorld);
	            result.rb.visible = this._isWorldVerticeVisibleInCanvas(result.rb.verticeInWorld, {
	                verticeInNDC: result.rb.verticeInNDC,
	                threshold: threshold
	            });
	            if (result.rb.visible) {
	                result.visibleCount++;
	            }
	            var ndcs = [result.lb.verticeInNDC, result.lt.verticeInNDC, result.rt.verticeInNDC, result.rb.verticeInNDC];
	            var vector03 = Vector.verticeMinusVertice(ndcs[3], ndcs[0]);
	            vector03.z = 0;
	            var vector01 = Vector.verticeMinusVertice(ndcs[1], ndcs[0]);
	            vector01.z = 0;
	            var cross = vector03.cross(vector01);
	            result.clockwise = cross.z > 0;
	            var topWidth = Math.sqrt(Math.pow(ndcs[1].x - ndcs[2].x, 2) + Math.pow(ndcs[1].y - ndcs[2].y, 2)) * Kernel.canvas.width / 2;
	            var bottomWidth = Math.sqrt(Math.pow(ndcs[0].x - ndcs[3].x, 2) + Math.pow(ndcs[0].y - ndcs[3].y, 2)) * Kernel.canvas.width / 2;
	            result.width = Math.floor((topWidth + bottomWidth) / 2);
	            var leftHeight = Math.sqrt(Math.pow(ndcs[0].x - ndcs[1].x, 2) + Math.pow(ndcs[0].y - ndcs[1].y, 2)) * Kernel.canvas.height / 2;
	            var rightHeight = Math.sqrt(Math.pow(ndcs[2].x - ndcs[3].x, 2) + Math.pow(ndcs[2].y - ndcs[3].y, 2)) * Kernel.canvas.height / 2;
	            result.height = Math.floor((leftHeight + rightHeight) / 2);
	            result.area = result.width * result.height;
	            return result;
	        };
	        Camera.prototype._getVerticalVisibleCenterInfo = function () {
	            var result = {
	                ndcY: null,
	                pIntersect: null,
	                lon: null,
	                lat: null
	            };
	            var pickResults;
	            if (this.isZeroPitch) {
	                result.ndcY = 0;
	            }
	            else {
	                var count = 10;
	                var delta = 2.0 / count;
	                var topNdcY = 1;
	                var bottomNdcY = -1;
	                var ndcY;
	                for (ndcY = 1.0; ndcY >= -1.0; ndcY -= delta) {
	                    pickResults = this._getPickCartesianCoordInEarthByNDC(0, ndcY);
	                    if (pickResults.length > 0) {
	                        topNdcY = ndcY;
	                        break;
	                    }
	                }
	                for (ndcY = -1.0; ndcY <= 1.0; ndcY += delta) {
	                    pickResults = this._getPickCartesianCoordInEarthByNDC(0, ndcY);
	                    if (pickResults.length > 0) {
	                        bottomNdcY = ndcY;
	                        break;
	                    }
	                }
	                result.ndcY = (topNdcY + bottomNdcY) / 2;
	            }
	            pickResults = this._getPickCartesianCoordInEarthByNDC(0, result.ndcY);
	            result.pIntersect = pickResults[0];
	            var lonlat = MathUtils.cartesianCoordToGeographic(result.pIntersect);
	            result.lon = lonlat[0];
	            result.lat = lonlat[1];
	            return result;
	        };
	        return Camera;
	    }(Object3D));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Camera;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Vertice) {
	    "use strict";
	    var Vector = (function () {
	        function Vector(x, y, z) {
	            if (x === void 0) { x = 0; }
	            if (y === void 0) { y = 0; }
	            if (z === void 0) { z = 0; }
	            this.x = x;
	            this.y = y;
	            this.z = z;
	        }
	        Vector.fromVertice = function (vertice) {
	            return new Vector(vertice.x, vertice.y, vertice.z);
	        };
	        Vector.verticeMinusVertice = function (endVertice, startVertice) {
	            return new Vector(endVertice.x - startVertice.x, endVertice.y - startVertice.y, endVertice.z - startVertice.z);
	        };
	        Vector.verticePlusVector = function (vertice, vector) {
	            return new Vertice(vertice.x + vector.x, vertice.y + vector.y, vertice.z + vector.z);
	        };
	        Vector.getRadianOfTwoVectors = function (vector1, vector2) {
	            var v1 = vector1.clone().normalize();
	            var v2 = vector2.clone().normalize();
	            var dotValue = v1.dot(v2);
	            if (dotValue < -1) {
	                dotValue = -1;
	            }
	            if (dotValue > 1) {
	                dotValue = 1;
	            }
	            var radian = Math.acos(dotValue);
	            return radian;
	        };
	        Vector.prototype.getVertice = function () {
	            return new Vertice(this.x, this.y, this.z);
	        };
	        Vector.prototype.getArray = function () {
	            return [this.x, this.y, this.z];
	        };
	        Vector.prototype.clone = function () {
	            return new Vector(this.x, this.y, this.z);
	        };
	        Vector.prototype.getOpposite = function () {
	            return new Vector(-this.x, -this.y, -this.z);
	        };
	        Vector.prototype.getLength = function () {
	            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	        };
	        Vector.prototype.normalize = function () {
	            var length = this.getLength();
	            if (Math.abs(length) >= 0.000001) {
	                this.x /= length;
	                this.y /= length;
	                this.z /= length;
	            }
	            else {
	                this.x = 0;
	                this.y = 0;
	                this.z = 0;
	            }
	            return this;
	        };
	        Vector.prototype.setLength = function (length) {
	            this.normalize();
	            this.x *= length;
	            this.y *= length;
	            this.z *= length;
	            return this;
	        };
	        Vector.prototype.getRandomVerticalVector = function () {
	            var result;
	            var length = this.getLength();
	            if (length === 0) {
	                result = new Vector(0, 0, 0);
	            }
	            else {
	                var x2, y2, z2;
	                if (this.x !== 0) {
	                    y2 = 1;
	                    z2 = 0;
	                    x2 = -this.y / this.x;
	                }
	                else if (this.y !== 0) {
	                    z2 = 1;
	                    x2 = 0;
	                    y2 = -this.z / this.y;
	                }
	                else if (this.z !== 0) {
	                    x2 = 1;
	                    y2 = 0;
	                    z2 = -this.x / this.z;
	                }
	                result = new Vector(x2, y2, z2);
	                result.normalize();
	            }
	            return result;
	        };
	        Vector.prototype.cross = function (other) {
	            var x = this.y * other.z - this.z * other.y;
	            var y = this.z * other.x - this.x * other.z;
	            var z = this.x * other.y - this.y * other.x;
	            return new Vector(x, y, z);
	        };
	        Vector.prototype.dot = function (other) {
	            if (!(other instanceof Vector)) {
	                throw "invalid other";
	            }
	            return this.x * other.x + this.y * other.y + this.z * other.z;
	        };
	        return Vector;
	    }());
	    return Vector;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Vertice = (function () {
	        function Vertice(x, y, z) {
	            if (x === void 0) { x = 0; }
	            if (y === void 0) { y = 0; }
	            if (z === void 0) { z = 0; }
	            this.x = x;
	            this.y = y;
	            this.z = z;
	        }
	        Vertice.prototype.getArray = function () {
	            return [this.x, this.y, this.z];
	        };
	        Vertice.prototype.clone = function () {
	            return new Vertice(this.x, this.y, this.z);
	        };
	        Vertice.prototype.getOpposite = function () {
	            return new Vertice(-this.x, -this.y, -this.z);
	        };
	        return Vertice;
	    }());
	    return Vertice;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(10), __webpack_require__(9), __webpack_require__(12), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Utils, Vertice, Vector, Line, Plan) {
	    "use strict";
	    if (!Math.log2) {
	        Math.log2 = function (value) { return (Math.log(value) / Math.log(2)); };
	    }
	    var pow2Cache = {};
	    (function (cache) {
	        cache[0] = 1;
	        for (var i = 1; i <= 20; i++) {
	            cache[i] = cache[i - 1] << 1;
	            cache[-i] = 1 / cache[i];
	        }
	    })(pow2Cache);
	    var ONE_RADIAN_EQUAL_DEGREE = 57.29577951308232;
	    var ONE_DEGREE_EQUAL_RADIAN = 0.017453292519943295;
	    var MathUtils = (function () {
	        function MathUtils() {
	        }
	        MathUtils.getRealValueInWorld = function (virtualValue) {
	            return virtualValue / Kernel.SCALE_FACTOR;
	        };
	        MathUtils.pow2 = function (v) {
	            var s = v.toString();
	            if (pow2Cache.hasOwnProperty(s)) {
	                return pow2Cache[s];
	            }
	            else {
	                return Math.pow(2, v);
	            }
	        };
	        MathUtils.log2 = function (value) {
	            return Math.log2(value);
	        };
	        MathUtils.izZero = function (value) {
	            if (!Utils.isNumber(value)) {
	                throw "invalid value";
	            }
	            return Math.abs(value) < 0.000001;
	        };
	        MathUtils.isPowerOfTwo = function (value) {
	            return (value & (value - 1)) === 0 && value !== 0;
	        };
	        MathUtils.asinSafely = function (value) {
	            if (value > 1) {
	                value = 1;
	            }
	            if (value < -1) {
	                value = -1;
	            }
	            return Math.asin(value);
	        };
	        MathUtils.acosSafely = function (value) {
	            if (value > 1) {
	                value = 1;
	            }
	            if (value < -1) {
	                value = -1;
	            }
	            return Math.acos(value);
	        };
	        MathUtils.numerationSystemTo10 = function (numSys, strNum) {
	            var sum = 0;
	            for (var i = 0; i < strNum.length; i++) {
	                var level = strNum.length - 1 - i;
	                var key = parseInt(strNum[i]);
	                sum += key * Math.pow(numSys, level);
	            }
	            return sum;
	        };
	        MathUtils.numerationSystemFrom10 = function (numSys, num) {
	            return num.toString(numSys);
	        };
	        MathUtils.numerationSystemChange = function (numSysFrom, numSysTo, strNumFrom) {
	            var temp10 = this.numerationSystemTo10(numSysFrom, strNumFrom);
	            var strResult = this.numerationSystemFrom10(numSysTo, temp10);
	            return strResult;
	        };
	        MathUtils.getTriangleArea = function (v1, v2, v3) {
	            var v1Copy = v1.clone();
	            var v2Copy = v2.clone();
	            var v3Copy = v3.clone();
	            var direction = Vector.verticeMinusVertice(v3Copy, v2Copy);
	            var line = new Line(v2Copy, direction);
	            var h = this.getLengthFromVerticeToLine(v1Copy, line);
	            var w = this.getLengthFromVerticeToVertice(v2Copy, v3Copy);
	            var area = 0.5 * w * h;
	            return area;
	        };
	        MathUtils.getLengthFromVerticeToVertice = function (vertice1, vertice2) {
	            var vertice1Copy = vertice1.clone();
	            var vertice2Copy = vertice2.clone();
	            var length2 = Math.pow(vertice1Copy.x - vertice2Copy.x, 2) + Math.pow(vertice1Copy.y - vertice2Copy.y, 2) + Math.pow(vertice1Copy.z - vertice2Copy.z, 2);
	            var length = Math.sqrt(length2);
	            return length;
	        };
	        MathUtils.getLengthFromVerticeToLine = function (vertice, line) {
	            var verticeCopy = vertice.clone();
	            var lineCopy = line.clone();
	            var x0 = verticeCopy.x;
	            var y0 = verticeCopy.y;
	            var z0 = verticeCopy.z;
	            var verticeOnLine = lineCopy.vertice;
	            var x1 = verticeOnLine.x;
	            var y1 = verticeOnLine.y;
	            var z1 = verticeOnLine.z;
	            var lineVector = lineCopy.vector;
	            lineVector.normalize();
	            var a = lineVector.x;
	            var b = lineVector.y;
	            var c = lineVector.z;
	            var A = (y0 - y1) * c - b * (z0 - z1);
	            var B = (z0 - z1) * a - c * (x0 - x1);
	            var C = (x0 - x1) * b - a * (y0 - y1);
	            return Math.sqrt(A * A + B * B + C * C);
	        };
	        MathUtils.getLengthFromVerticeToPlan = function (vertice, plan) {
	            var verticeCopy = vertice.clone();
	            var planCopy = plan.clone();
	            var x = verticeCopy.x;
	            var y = verticeCopy.y;
	            var z = verticeCopy.z;
	            var A = planCopy.A;
	            var B = planCopy.B;
	            var C = planCopy.C;
	            var D = planCopy.D;
	            var numerator = Math.abs(A * x + B * y + C * z + D);
	            var denominator = Math.sqrt(A * A + B * B + C * C);
	            var length = numerator / denominator;
	            return length;
	        };
	        MathUtils.getVerticeVerticalIntersectPointWidthPlan = function (vertice, plan) {
	            var verticeCopy = vertice.clone();
	            var planCopy = plan.clone();
	            var x0 = verticeCopy.x;
	            var y0 = verticeCopy.y;
	            var z0 = verticeCopy.z;
	            var normalVector = new Vector(planCopy.A, planCopy.B, planCopy.C);
	            normalVector.normalize();
	            var a = normalVector.x;
	            var b = normalVector.y;
	            var c = normalVector.z;
	            var d = planCopy.D * a / planCopy.A;
	            var k = -(a * x0 + b * y0 + c * z0 + d);
	            var x = k * a + x0;
	            var y = k * b + y0;
	            var z = k * c + z0;
	            var intersectVertice = new Vertice(x, y, z);
	            return intersectVertice;
	        };
	        MathUtils.getIntersectPointByLineAdPlan = function (line, plan) {
	            var lineCopy = line.clone();
	            var planCopy = plan.clone();
	            lineCopy.vector.normalize();
	            var A = planCopy.A;
	            var B = planCopy.B;
	            var C = planCopy.C;
	            var D = planCopy.D;
	            var x0 = lineCopy.vertice.x;
	            var y0 = lineCopy.vertice.y;
	            var z0 = lineCopy.vertice.z;
	            var a = lineCopy.vector.x;
	            var b = lineCopy.vector.y;
	            var c = lineCopy.vector.z;
	            var k = -(A * x0 + B * y0 + C * z0 + D) / (A * a + B * b + C * c);
	            var x = k * a + x0;
	            var y = k * b + y0;
	            var z = k * c + z0;
	            var intersectVertice = new Vertice(x, y, z);
	            return intersectVertice;
	        };
	        MathUtils.getLineIntersectPointWithEarth = function (line) {
	            var result = [];
	            var lineCopy = line.clone();
	            var vertice = lineCopy.vertice;
	            var direction = lineCopy.vector;
	            direction.normalize();
	            var r = Kernel.EARTH_RADIUS;
	            var a = direction.x;
	            var b = direction.y;
	            var c = direction.z;
	            var x0 = vertice.x;
	            var y0 = vertice.y;
	            var z0 = vertice.z;
	            var a2 = a * a;
	            var b2 = b * b;
	            var c2 = c * c;
	            var r2 = r * r;
	            var ay0 = a * y0;
	            var az0 = a * z0;
	            var bx0 = b * x0;
	            var bz0 = b * z0;
	            var cx0 = c * x0;
	            var cy0 = c * y0;
	            var deltaA = ay0 * bx0 + az0 * cx0 + bz0 * cy0;
	            var deltaB = ay0 * ay0 + az0 * az0 + bx0 * bx0 + bz0 * bz0 + cx0 * cx0 + cy0 * cy0;
	            var deltaC = a2 + b2 + c2;
	            var delta = 8 * deltaA - 4 * deltaB + 4 * r2 * deltaC;
	            if (delta < 0) {
	                result = [];
	            }
	            else {
	                var t = a * x0 + b * y0 + c * z0;
	                var A = a2 + b2 + c2;
	                if (delta == 0) {
	                    var k = -t / A;
	                    var x = k * a + x0;
	                    var y = k * b + y0;
	                    var z = k * c + z0;
	                    var p = new Vertice(x, y, z);
	                    result.push(p);
	                }
	                else if (delta > 0) {
	                    var sqrtDelta = Math.sqrt(delta);
	                    var k1 = (-2 * t + sqrtDelta) / (2 * A);
	                    var x1 = k1 * a + x0;
	                    var y1 = k1 * b + y0;
	                    var z1 = k1 * c + z0;
	                    var p1 = new Vertice(x1, y1, z1);
	                    result.push(p1);
	                    var k2 = (-2 * t - sqrtDelta) / (2 * A);
	                    var x2 = k2 * a + x0;
	                    var y2 = k2 * b + y0;
	                    var z2 = k2 * c + z0;
	                    var p2 = new Vertice(x2, y2, z2);
	                    result.push(p2);
	                }
	            }
	            return result;
	        };
	        MathUtils.getCrossPlaneByLine = function (vertice, direction) {
	            var verticeCopy = vertice.clone();
	            var directionCopy = direction.clone();
	            directionCopy.normalize();
	            var a = directionCopy.x;
	            var b = directionCopy.y;
	            var c = directionCopy.z;
	            var x0 = verticeCopy.x;
	            var y0 = verticeCopy.y;
	            var z0 = verticeCopy.z;
	            var d = -(a * x0 + b * y0 + c * z0);
	            var plan = new Plan(a, b, c, d);
	            return plan;
	        };
	        MathUtils.convertPointFromCanvasToNDC = function (canvasX, canvasY) {
	            if (!(Utils.isNumber(canvasX))) {
	                throw "invalid canvasX";
	            }
	            if (!(Utils.isNumber(canvasY))) {
	                throw "invalid canvasY";
	            }
	            var ndcX = 2 * canvasX / Kernel.canvas.width - 1;
	            var ndcY = 1 - 2 * canvasY / Kernel.canvas.height;
	            return [ndcX, ndcY];
	        };
	        MathUtils.convertPointFromNdcToCanvas = function (ndcX, ndcY) {
	            if (!(Utils.isNumber(ndcX))) {
	                throw "invalid ndcX";
	            }
	            if (!(Utils.isNumber(ndcY))) {
	                throw "invalid ndcY";
	            }
	            var canvasX = (1 + ndcX) * Kernel.canvas.width / 2.0;
	            var canvasY = (1 - ndcY) * Kernel.canvas.height / 2.0;
	            return [canvasX, canvasY];
	        };
	        MathUtils.geographicToCartesianCoord = function (lon, lat, r) {
	            if (r === void 0) { r = Kernel.EARTH_RADIUS; }
	            if (!(lon >= -(180 + 0.001) && lon <= (180 + 0.001))) {
	                throw "invalid lon";
	            }
	            if (!(lat >= -(90 + 0.001) && lat <= (90 + 0.001))) {
	                throw "invalid lat";
	            }
	            var radianLon = this.degreeToRadian(lon);
	            var radianLat = this.degreeToRadian(lat);
	            var sin1 = Math.sin(radianLon);
	            var cos1 = Math.cos(radianLon);
	            var sin2 = Math.sin(radianLat);
	            var cos2 = Math.cos(radianLat);
	            var x = r * sin1 * cos2;
	            var y = r * sin2;
	            var z = r * cos1 * cos2;
	            return new Vertice(x, y, z);
	        };
	        MathUtils.cartesianCoordToGeographic = function (vertice) {
	            var verticeCopy = vertice.clone();
	            var x = verticeCopy.x;
	            var y = verticeCopy.y;
	            var z = verticeCopy.z;
	            var sin2 = y / Kernel.EARTH_RADIUS;
	            var radianLat = this.asinSafely(sin2);
	            var cos2 = Math.cos(radianLat);
	            var sin1 = x / (Kernel.EARTH_RADIUS * cos2);
	            if (sin1 > 1) {
	                sin1 = 1;
	            }
	            if (sin1 < -1) {
	                sin1 = -1;
	            }
	            var cos1 = z / (Kernel.EARTH_RADIUS * cos2);
	            if (cos1 > 1) {
	                cos1 = 1;
	            }
	            if (cos1 < -1) {
	                cos1 = -1;
	            }
	            var radianLog = this.asinSafely(sin1);
	            if (sin1 >= 0) {
	                if (cos1 >= 0) {
	                    radianLog = radianLog;
	                }
	                else {
	                    radianLog = Math.PI - radianLog;
	                }
	            }
	            else {
	                if (cos1 >= 0) {
	                    radianLog = radianLog;
	                }
	                else {
	                    radianLog = -radianLog - Math.PI;
	                }
	            }
	            var degreeLat = this.radianToDegree(radianLat);
	            var degreeLog = this.radianToDegree(radianLog);
	            return [degreeLog, degreeLat];
	        };
	        MathUtils.degreeToRadian = function (degree) {
	            return degree * ONE_DEGREE_EQUAL_RADIAN;
	        };
	        MathUtils.radianToDegree = function (radian) {
	            return radian * ONE_RADIAN_EQUAL_DEGREE;
	        };
	        MathUtils.webMercatorXToRadianLog = function (x) {
	            return x / Kernel.EARTH_RADIUS;
	        };
	        MathUtils.webMercatorXToDegreeLog = function (x) {
	            var radianLog = this.webMercatorXToRadianLog(x);
	            return this.radianToDegree(radianLog);
	        };
	        MathUtils.webMercatorYToRadianLat = function (y) {
	            if (!(Utils.isNumber(y))) {
	                throw "invalid y";
	            }
	            var a = y / Kernel.EARTH_RADIUS;
	            var b = Math.pow(Math.E, a);
	            var c = Math.atan(b);
	            var radianLat = 2 * c - Math.PI / 2;
	            return radianLat;
	        };
	        MathUtils.webMercatorYToDegreeLat = function (y) {
	            var radianLat = this.webMercatorYToRadianLat(y);
	            return this.radianToDegree(radianLat);
	        };
	        MathUtils.webMercatorToRadianGeographic = function (x, y) {
	            var radianLog = this.webMercatorXToRadianLog(x);
	            var radianLat = this.webMercatorYToRadianLat(y);
	            return [radianLog, radianLat];
	        };
	        MathUtils.webMercatorToDegreeGeographic = function (x, y) {
	            var degreeLog = this.webMercatorXToDegreeLog(x);
	            var degreeLat = this.webMercatorYToDegreeLat(y);
	            return [degreeLog, degreeLat];
	        };
	        MathUtils.radianLogToWebMercatorX = function (radianLog) {
	            if (!(Utils.isNumber(radianLog) && radianLog <= (Math.PI + 0.001) && radianLog >= -(Math.PI + 0.001))) {
	                throw "invalid radianLog";
	            }
	            return Kernel.EARTH_RADIUS * radianLog;
	        };
	        MathUtils.degreeLogToWebMercatorX = function (degreeLog) {
	            if (!(Utils.isNumber(degreeLog) && degreeLog <= (180 + 0.001) && degreeLog >= -(180 + 0.001))) {
	                throw "invalid degreeLog";
	            }
	            var radianLog = this.degreeToRadian(degreeLog);
	            return this.radianLogToWebMercatorX(radianLog);
	        };
	        MathUtils.radianLatToWebMercatorY = function (radianLat) {
	            if (!(radianLat <= (Math.PI / 2 + 0.001) && radianLat >= -(Math.PI / 2 + 0.001))) {
	                throw "invalid radianLat";
	            }
	            var a = Math.PI / 4 + radianLat / 2;
	            var b = Math.tan(a);
	            var c = Math.log(b);
	            var y = Kernel.EARTH_RADIUS * c;
	            return y;
	        };
	        MathUtils.degreeLatToWebMercatorY = function (degreeLat) {
	            if (!(degreeLat <= (90 + 0.001) && degreeLat >= -(90 + 0.001))) {
	                throw "invalid degreeLat";
	            }
	            var radianLat = this.degreeToRadian(degreeLat);
	            return this.radianLatToWebMercatorY(radianLat);
	        };
	        MathUtils.radianGeographicToWebMercator = function (radianLog, radianLat) {
	            var x = this.radianLogToWebMercatorX(radianLog);
	            var y = this.radianLatToWebMercatorY(radianLat);
	            return [x, y];
	        };
	        MathUtils.degreeGeographicToWebMercator = function (degreeLog, degreeLat) {
	            var x = this.degreeLogToWebMercatorX(degreeLog);
	            var y = this.degreeLatToWebMercatorY(degreeLat);
	            return [x, y];
	        };
	        MathUtils.getTileWebMercatorEnvelopeByGrid = function (level, row, column) {
	            var k = Kernel.MAX_PROJECTED_COORD;
	            var size = 2 * k / Math.pow(2, level);
	            var minX = -k + column * size;
	            var maxX = minX + size;
	            var maxY = k - row * size;
	            var minY = maxY - size;
	            var Eproj = {
	                "minX": minX,
	                "minY": minY,
	                "maxX": maxX,
	                "maxY": maxY
	            };
	            return Eproj;
	        };
	        MathUtils.getTileGeographicEnvelopByGrid = function (level, row, column) {
	            var Eproj = this.getTileWebMercatorEnvelopeByGrid(level, row, column);
	            var pMin = this.webMercatorToDegreeGeographic(Eproj.minX, Eproj.minY);
	            var pMax = this.webMercatorToDegreeGeographic(Eproj.maxX, Eproj.maxY);
	            var Egeo = {
	                "minLon": pMin[0],
	                "minLat": pMin[1],
	                "maxLon": pMax[0],
	                "maxLat": pMax[1]
	            };
	            return Egeo;
	        };
	        MathUtils.getTileCartesianEnvelopByGrid = function (level, row, column) {
	            var Egeo = this.getTileGeographicEnvelopByGrid(level, row, column);
	            var minLon = Egeo.minLon;
	            var minLat = Egeo.minLat;
	            var maxLon = Egeo.maxLon;
	            var maxLat = Egeo.maxLat;
	            var pLeftBottom = this.geographicToCartesianCoord(minLon, minLat);
	            var pLeftTop = this.geographicToCartesianCoord(minLon, maxLat);
	            var pRightTop = this.geographicToCartesianCoord(maxLon, maxLat);
	            var pRightBottom = this.geographicToCartesianCoord(maxLon, minLat);
	            var Ecar = {
	                "pLeftBottom": pLeftBottom,
	                "pLeftTop": pLeftTop,
	                "pRightTop": pRightTop,
	                "pRightBottom": pRightBottom,
	                "minLon": minLon,
	                "minLat": minLat,
	                "maxLon": maxLon,
	                "maxLat": maxLat
	            };
	            return Ecar;
	        };
	        MathUtils.getGeographicTileCenter = function (level, row, column) {
	            var Egeo = this.getTileGeographicEnvelopByGrid(level, row, column);
	            var minLon = Egeo.minLon;
	            var minLat = Egeo.minLat;
	            var maxLon = Egeo.maxLon;
	            var maxLat = Egeo.maxLat;
	            var centerLon = (minLon + maxLon) / 2;
	            var centerLat = (minLat + maxLat) / 2;
	            var lonlatTileCenter = [centerLon, centerLat];
	            return lonlatTileCenter;
	        };
	        MathUtils.getCartesianTileCenter = function (level, row, column) {
	            var lonLat = this.getGeographicTileCenter(level, row, column);
	            var vertice = this.geographicToCartesianCoord(lonLat[0], lonLat[1]);
	            return vertice;
	        };
	        MathUtils.calculateNormals = function (vs, ind) {
	            var x = 0;
	            var y = 1;
	            var z = 2;
	            var ns = [];
	            for (var i = 0; i < vs.length; i = i + 3) {
	                ns[i + x] = 0.0;
	                ns[i + y] = 0.0;
	                ns[i + z] = 0.0;
	            }
	            for (var i = 0; i < ind.length; i = i + 3) {
	                var v1 = [];
	                var v2 = [];
	                var normal = [];
	                v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
	                v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
	                v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];
	                v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
	                v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
	                v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];
	                normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
	                normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
	                normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
	                for (var j = 0; j < 3; j++) {
	                    ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
	                    ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
	                    ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
	                }
	            }
	            for (var i = 0; i < vs.length; i = i + 3) {
	                var nn = [];
	                nn[x] = ns[i + x];
	                nn[y] = ns[i + y];
	                nn[z] = ns[i + z];
	                var len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
	                if (len == 0)
	                    len = 1.0;
	                nn[x] = nn[x] / len;
	                nn[y] = nn[y] / len;
	                nn[z] = nn[z] / len;
	                ns[i + x] = nn[x];
	                ns[i + y] = nn[y];
	                ns[i + z] = nn[z];
	            }
	            return ns;
	        };
	        return MathUtils;
	    }());
	    ;
	    return MathUtils;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Line = (function () {
	        function Line(position, direction) {
	            this.vertice = position.clone();
	            this.vector = direction.clone();
	            this.vector.normalize();
	        }
	        Line.prototype.setVertice = function (position) {
	            this.vertice = position.clone();
	            return this;
	        };
	        Line.prototype.setVector = function (direction) {
	            this.vector = direction.clone();
	            this.vector.normalize();
	            return this;
	        };
	        Line.prototype.clone = function () {
	            var lineCopy = new Line(this.vertice, this.vector);
	            return lineCopy;
	        };
	        return Line;
	    }());
	    return Line;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Plan = (function () {
	        function Plan(A, B, C, D) {
	            this.A = A;
	            this.B = B;
	            this.C = C;
	            this.D = D;
	        }
	        Plan.prototype.clone = function () {
	            var planCopy = new Plan(this.A, this.B, this.C, this.D);
	            return planCopy;
	        };
	        return Plan;
	    }());
	    return Plan;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, MathUtils) {
	    "use strict";
	    (function (TileGridPosition) {
	        TileGridPosition[TileGridPosition["LEFT_TOP"] = 0] = "LEFT_TOP";
	        TileGridPosition[TileGridPosition["RIGHT_TOP"] = 1] = "RIGHT_TOP";
	        TileGridPosition[TileGridPosition["LEFT_BOTTOM"] = 2] = "LEFT_BOTTOM";
	        TileGridPosition[TileGridPosition["RIGHT_BOTTOM"] = 3] = "RIGHT_BOTTOM";
	        TileGridPosition[TileGridPosition["LEFT"] = 4] = "LEFT";
	        TileGridPosition[TileGridPosition["RIGHT"] = 5] = "RIGHT";
	        TileGridPosition[TileGridPosition["TOP"] = 6] = "TOP";
	        TileGridPosition[TileGridPosition["BOTTOM"] = 7] = "BOTTOM";
	    })(exports.TileGridPosition || (exports.TileGridPosition = {}));
	    var TileGridPosition = exports.TileGridPosition;
	    var maxLatitudeOfWebMercator = MathUtils.webMercatorYToDegreeLat(Kernel.MAX_PROJECTED_COORD);
	    var TileGrid = (function () {
	        function TileGrid(level, row, column) {
	            this.level = level;
	            this.row = row;
	            this.column = column;
	            this.Egeo = null;
	            this.maxSize = 0;
	        }
	        TileGrid.prototype.equals = function (other) {
	            return other && this.level === other.level && this.row === other.row && this.column === other.column;
	        };
	        TileGrid.prototype.getEgeo = function () {
	            if (!this.Egeo) {
	                this.Egeo = MathUtils.getTileGeographicEnvelopByGrid(this.level, this.row, this.column);
	            }
	            return this.Egeo;
	        };
	        TileGrid.prototype.getLeftTopTag = function () {
	            return this.level + "_" + this.row + "_" + this.column;
	        };
	        TileGrid.prototype.getRightTopTag = function () {
	            return this.level + "_" + this.row + "_" + (this.column + 1);
	        };
	        TileGrid.prototype.getLeftBottomTag = function () {
	            return this.level + "_" + (this.row + 1) + "_" + this.column;
	        };
	        TileGrid.prototype.getRightBottomTag = function () {
	            return this.level + "_" + (this.row + 1) + "_" + (this.column + 1);
	        };
	        TileGrid.prototype.getLeft = function () {
	            return TileGrid.getTileGridByBrother(this.level, this.row, this.column, TileGridPosition.LEFT);
	        };
	        TileGrid.prototype.getRight = function () {
	            return TileGrid.getTileGridByBrother(this.level, this.row, this.column, TileGridPosition.RIGHT);
	        };
	        TileGrid.prototype.getTop = function () {
	            return TileGrid.getTileGridByBrother(this.level, this.row, this.column, TileGridPosition.TOP);
	        };
	        TileGrid.prototype.getBottom = function () {
	            return TileGrid.getTileGridByBrother(this.level, this.row, this.column, TileGridPosition.BOTTOM);
	        };
	        TileGrid.prototype.getParent = function () {
	            return TileGrid.getTileGridAncestor(this.level - 1, this.level, this.row, this.column);
	        };
	        TileGrid.prototype.getAncestor = function (ancestorLevel) {
	            return TileGrid.getTileGridAncestor(ancestorLevel, this.level, this.row, this.column);
	        };
	        TileGrid.getTileGridByParent = function (parentLevel, parentRow, parentColumn, position) {
	            var level = parentLevel + 1;
	            var row = -1;
	            var column = -1;
	            if (position === TileGridPosition.LEFT_TOP) {
	                row = 2 * parentRow;
	                column = 2 * parentColumn;
	            }
	            else if (position === TileGridPosition.RIGHT_TOP) {
	                row = 2 * parentRow;
	                column = 2 * parentColumn + 1;
	            }
	            else if (position === TileGridPosition.LEFT_BOTTOM) {
	                row = 2 * parentRow + 1;
	                column = 2 * parentColumn;
	            }
	            else if (position === TileGridPosition.RIGHT_BOTTOM) {
	                row = 2 * parentRow + 1;
	                column = 2 * parentColumn + 1;
	            }
	            else {
	                throw "invalid position";
	            }
	            return new TileGrid(level, row, column);
	        };
	        TileGrid.getTilePositionOfParent = function (level, row, column, parent) {
	            var position = null;
	            parent = parent || this.getTileGridAncestor(level - 1, level, row, column);
	            var ltTileGrid = this.getTileGridByParent(parent.level, parent.row, parent.column, TileGridPosition.LEFT_TOP);
	            if (ltTileGrid.row === row) {
	                if (ltTileGrid.column === column) {
	                    position = TileGridPosition.LEFT_TOP;
	                }
	                else if (ltTileGrid.column + 1 === column) {
	                    position = TileGridPosition.RIGHT_TOP;
	                }
	            }
	            else if (ltTileGrid.row + 1 === row) {
	                if (ltTileGrid.column === column) {
	                    position = TileGridPosition.LEFT_BOTTOM;
	                }
	                else if (ltTileGrid.column + 1 === column) {
	                    position = TileGridPosition.RIGHT_BOTTOM;
	                }
	            }
	            return position;
	        };
	        TileGrid.getTileGridByBrother = function (brotherLevel, brotherRow, brotherColumn, position, options) {
	            options = options || {};
	            var result = new TileGrid(brotherLevel, brotherRow, brotherColumn);
	            if (position === TileGridPosition.LEFT) {
	                if (brotherColumn === 0) {
	                    var maxSize = options.maxSize || Math.pow(2, brotherLevel);
	                    result.column = maxSize - 1;
	                }
	                else {
	                    result.column = brotherColumn - 1;
	                }
	            }
	            else if (position === TileGridPosition.RIGHT) {
	                var maxSize = options.maxSize || Math.pow(2, brotherLevel);
	                if (brotherColumn === maxSize - 1) {
	                    result.column = 0;
	                }
	                else {
	                    result.column = brotherColumn + 1;
	                }
	            }
	            else if (position === TileGridPosition.TOP) {
	                if (brotherRow === 0) {
	                    var maxSize = options.maxSize || Math.pow(2, brotherLevel);
	                    result.row = maxSize - 1;
	                }
	                else {
	                    result.row = brotherRow - 1;
	                }
	            }
	            else if (position === TileGridPosition.BOTTOM) {
	                var maxSize = options.maxSize || Math.pow(2, brotherLevel);
	                if (brotherRow === maxSize - 1) {
	                    result.row = 0;
	                }
	                else {
	                    result.row = brotherRow + 1;
	                }
	            }
	            else {
	                throw "invalid position";
	            }
	            return result;
	        };
	        TileGrid.getTileGridAncestor = function (ancestorLevel, level, row, column) {
	            var result = null;
	            if (ancestorLevel < level) {
	                var deltaLevel = level - ancestorLevel;
	                var a = Math.pow(2, deltaLevel);
	                var ancestorRow = Math.floor(row / a);
	                var ancestorColumn = Math.floor(column / a);
	                result = new TileGrid(ancestorLevel, ancestorRow, ancestorColumn);
	            }
	            else if (ancestorLevel === level) {
	                result = new TileGrid(level, row, column);
	            }
	            return result;
	        };
	        TileGrid.isValidLatitude = function (lat) {
	            return lat >= -maxLatitudeOfWebMercator && lat <= maxLatitudeOfWebMercator;
	        };
	        TileGrid.getTileGridByGeo = function (lon, lat, level) {
	            if (!(lon >= -180 && lon <= 180)) {
	                throw "invalid lon: " + lon;
	            }
	            var coordWebMercator = MathUtils.degreeGeographicToWebMercator(lon, lat);
	            var x = coordWebMercator[0];
	            var y = coordWebMercator[1];
	            var horX = x + Kernel.MAX_PROJECTED_COORD;
	            var verY = Kernel.MAX_PROJECTED_COORD - y;
	            var size = Kernel.MAX_PROJECTED_COORD / Math.pow(2, level - 1);
	            var row = Math.floor(verY / size);
	            var column = Math.floor(horX / size);
	            return new TileGrid(level, row, column);
	        };
	        return TileGrid;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = TileGrid;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(10), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Utils, Vertice, Vector) {
	    "use strict";
	    var Matrix = (function () {
	        function Matrix(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
	            if (m11 === void 0) { m11 = 1; }
	            if (m12 === void 0) { m12 = 0; }
	            if (m13 === void 0) { m13 = 0; }
	            if (m14 === void 0) { m14 = 0; }
	            if (m21 === void 0) { m21 = 0; }
	            if (m22 === void 0) { m22 = 1; }
	            if (m23 === void 0) { m23 = 0; }
	            if (m24 === void 0) { m24 = 0; }
	            if (m31 === void 0) { m31 = 0; }
	            if (m32 === void 0) { m32 = 0; }
	            if (m33 === void 0) { m33 = 1; }
	            if (m34 === void 0) { m34 = 0; }
	            if (m41 === void 0) { m41 = 0; }
	            if (m42 === void 0) { m42 = 0; }
	            if (m43 === void 0) { m43 = 0; }
	            if (m44 === void 0) { m44 = 1; }
	            this.elements = new Float64Array(16);
	            this.setElements(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
	        }
	        Matrix.prototype.getFloat32Array = function () {
	            return new Float32Array(this.elements);
	        };
	        Matrix.prototype.equals = function (matrix) {
	            if (this === matrix) {
	                return true;
	            }
	            return Utils.every(this.elements, function (ele, index) {
	                return ele === matrix.elements[index];
	            });
	        };
	        Matrix.prototype.toJson = function () {
	            var elements = [];
	            Utils.forEach(this.elements, function (ele, i) {
	                elements.push(ele);
	            });
	            return {
	                elements: elements
	            };
	        };
	        Matrix.prototype.fromJson = function (json) {
	            var _this = this;
	            json.elements.forEach(function (ele, i) {
	                _this.elements[i] = ele;
	            });
	        };
	        Matrix.fromJson = function (json) {
	            if (!json) {
	                return null;
	            }
	            var mat = new Matrix();
	            mat.fromJson(json);
	            return mat;
	        };
	        Matrix.prototype.setElements = function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
	            var count = arguments.length;
	            if (count < 16) {
	                throw "invalid arguments:arguments length error";
	            }
	            var values = this.elements;
	            values[0] = m11;
	            values[4] = m12;
	            values[8] = m13;
	            values[12] = m14;
	            values[1] = m21;
	            values[5] = m22;
	            values[9] = m23;
	            values[13] = m24;
	            values[2] = m31;
	            values[6] = m32;
	            values[10] = m33;
	            values[14] = m34;
	            values[3] = m41;
	            values[7] = m42;
	            values[11] = m43;
	            values[15] = m44;
	            return this;
	        };
	        Matrix.prototype.setVectorX = function (vector) {
	            this.elements[0] = vector.x;
	            this.elements[1] = vector.y;
	            this.elements[2] = vector.z;
	        };
	        Matrix.prototype.getVectorX = function () {
	            return new Vector(this.elements[0], this.elements[1], this.elements[2]);
	        };
	        Matrix.prototype.setVectorY = function (vector) {
	            this.elements[4] = vector.x;
	            this.elements[5] = vector.y;
	            this.elements[6] = vector.z;
	        };
	        Matrix.prototype.getVectorY = function () {
	            return new Vector(this.elements[4], this.elements[5], this.elements[6]);
	        };
	        Matrix.prototype.setVectorZ = function (vector) {
	            this.elements[8] = vector.x;
	            this.elements[9] = vector.y;
	            this.elements[10] = vector.z;
	        };
	        Matrix.prototype.getVectorZ = function () {
	            return new Vector(this.elements[8], this.elements[9], this.elements[10]);
	        };
	        Matrix.prototype.setPosition = function (vertice) {
	            this.elements[12] = vertice.x;
	            this.elements[13] = vertice.y;
	            this.elements[14] = vertice.z;
	        };
	        Matrix.prototype.getPosition = function () {
	            return new Vertice(this.elements[12], this.elements[13], this.elements[14]);
	        };
	        Matrix.prototype.setLastRowDefault = function () {
	            this.elements[3] = 0;
	            this.elements[7] = 0;
	            this.elements[11] = 0;
	            this.elements[15] = 1;
	        };
	        Matrix.prototype.transpose = function () {
	            var result = this.getTransposeMatrix();
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.getTransposeMatrix = function () {
	            var result = new Matrix();
	            result.elements[0] = this.elements[0];
	            result.elements[4] = this.elements[1];
	            result.elements[8] = this.elements[2];
	            result.elements[12] = this.elements[3];
	            result.elements[1] = this.elements[4];
	            result.elements[5] = this.elements[5];
	            result.elements[9] = this.elements[6];
	            result.elements[13] = this.elements[7];
	            result.elements[2] = this.elements[8];
	            result.elements[6] = this.elements[9];
	            result.elements[10] = this.elements[10];
	            result.elements[14] = this.elements[11];
	            result.elements[3] = this.elements[12];
	            result.elements[7] = this.elements[13];
	            result.elements[11] = this.elements[14];
	            result.elements[15] = this.elements[15];
	            return result;
	        };
	        Matrix.prototype.inverse = function () {
	            var result = this.getInverseMatrix();
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.getInverseMatrix = function () {
	            var a = this.elements;
	            var result = new Matrix();
	            var b = result.elements;
	            var c = a[0], d = a[1], e = a[2], g = a[3], f = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = a[9], n = a[10], o = a[11], m = a[12], p = a[13], r = a[14], s = a[15];
	            var A = c * h - d * f;
	            var B = c * i - e * f;
	            var t = c * j - g * f;
	            var u = d * i - e * h;
	            var v = d * j - g * h;
	            var w = e * j - g * i;
	            var x = k * p - l * m;
	            var y = k * r - n * m;
	            var z = k * s - o * m;
	            var C = l * r - n * p;
	            var D = l * s - o * p;
	            var E = n * s - o * r;
	            var q = A * E - B * D + t * C + u * z - v * y + w * x;
	            if (!q) {
	                console.log("can't get inverse matrix");
	                return null;
	            }
	            q = 1 / q;
	            b[0] = (h * E - i * D + j * C) * q;
	            b[1] = (-d * E + e * D - g * C) * q;
	            b[2] = (p * w - r * v + s * u) * q;
	            b[3] = (-l * w + n * v - o * u) * q;
	            b[4] = (-f * E + i * z - j * y) * q;
	            b[5] = (c * E - e * z + g * y) * q;
	            b[6] = (-m * w + r * t - s * B) * q;
	            b[7] = (k * w - n * t + o * B) * q;
	            b[8] = (f * D - h * z + j * x) * q;
	            b[9] = (-c * D + d * z - g * x) * q;
	            b[10] = (m * v - p * t + s * A) * q;
	            b[11] = (-k * v + l * t - o * A) * q;
	            b[12] = (-f * C + h * y - i * x) * q;
	            b[13] = (c * C - d * y + e * x) * q;
	            b[14] = (-m * u + p * B - r * A) * q;
	            b[15] = (k * u - l * B + n * A) * q;
	            return result;
	        };
	        Matrix.prototype.setMatrixByOther = function (otherMatrix) {
	            for (var i = 0; i < otherMatrix.elements.length; i++) {
	                this.elements[i] = otherMatrix.elements[i];
	            }
	        };
	        Matrix.prototype.setUnitMatrix = function () {
	            this.setElements(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	        };
	        Matrix.prototype.setUniqueValue = function (value) {
	            var length = this.elements.length;
	            for (var i = 0; i < length; i++) {
	                this.elements[i] = value;
	            }
	        };
	        Matrix.prototype.isUnitMatrix = function () {
	            var values = this.elements;
	            for (var i = 0; i < values.length; i++) {
	                if (i % 4 === 0) {
	                    if (values[i] != 1) {
	                        return false;
	                    }
	                }
	                else {
	                    if (values[i] !== 0) {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        };
	        Matrix.prototype.clone = function () {
	            return new Matrix(this.elements[0], this.elements[4], this.elements[8], this.elements[12], this.elements[1], this.elements[5], this.elements[9], this.elements[13], this.elements[2], this.elements[6], this.elements[10], this.elements[14], this.elements[3], this.elements[7], this.elements[11], this.elements[15]);
	        };
	        Matrix.prototype.multiplyMatrix = function (otherMatrix) {
	            var values1 = this.elements;
	            var values2 = otherMatrix.elements;
	            var m11 = values1[0] * values2[0] + values1[4] * values2[1] + values1[8] * values2[2] + values1[12] * values2[3];
	            var m12 = values1[0] * values2[4] + values1[4] * values2[5] + values1[8] * values2[6] + values1[12] * values2[7];
	            var m13 = values1[0] * values2[8] + values1[4] * values2[9] + values1[8] * values2[10] + values1[12] * values2[11];
	            var m14 = values1[0] * values2[12] + values1[4] * values2[13] + values1[8] * values2[14] + values1[12] * values2[15];
	            var m21 = values1[1] * values2[0] + values1[5] * values2[1] + values1[9] * values2[2] + values1[13] * values2[3];
	            var m22 = values1[1] * values2[4] + values1[5] * values2[5] + values1[9] * values2[6] + values1[13] * values2[7];
	            var m23 = values1[1] * values2[8] + values1[5] * values2[9] + values1[9] * values2[10] + values1[13] * values2[11];
	            var m24 = values1[1] * values2[12] + values1[5] * values2[13] + values1[9] * values2[14] + values1[13] * values2[15];
	            var m31 = values1[2] * values2[0] + values1[6] * values2[1] + values1[10] * values2[2] + values1[14] * values2[3];
	            var m32 = values1[2] * values2[4] + values1[6] * values2[5] + values1[10] * values2[6] + values1[14] * values2[7];
	            var m33 = values1[2] * values2[8] + values1[6] * values2[9] + values1[10] * values2[10] + values1[14] * values2[11];
	            var m34 = values1[2] * values2[12] + values1[6] * values2[13] + values1[10] * values2[14] + values1[14] * values2[15];
	            var m41 = values1[3] * values2[0] + values1[7] * values2[1] + values1[11] * values2[2] + values1[15] * values2[3];
	            var m42 = values1[3] * values2[4] + values1[7] * values2[5] + values1[11] * values2[6] + values1[15] * values2[7];
	            var m43 = values1[3] * values2[8] + values1[7] * values2[9] + values1[11] * values2[10] + values1[15] * values2[11];
	            var m44 = values1[3] * values2[12] + values1[7] * values2[13] + values1[11] * values2[14] + values1[15] * values2[15];
	            return new Matrix(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
	        };
	        Matrix.prototype.multiplyColumn = function (c) {
	            var valid = c.length == 4;
	            if (!valid) {
	                throw "invalid c";
	            }
	            var values1 = this.elements;
	            var values2 = c;
	            var m11 = values1[0] * values2[0] + values1[4] * values2[1] + values1[8] * values2[2] + values1[12] * values2[3];
	            var m21 = values1[1] * values2[0] + values1[5] * values2[1] + values1[9] * values2[2] + values1[13] * values2[3];
	            var m31 = values1[2] * values2[0] + values1[6] * values2[1] + values1[10] * values2[2] + values1[14] * values2[3];
	            var m41 = values1[3] * values2[0] + values1[7] * values2[1] + values1[11] * values2[2] + values1[15] * values2[3];
	            return [m11, m21, m31, m41];
	        };
	        Matrix.prototype.hasNaN = function () {
	            return Utils.some(this.elements, function (v) {
	                return isNaN(v);
	            });
	        };
	        Matrix.prototype.divide = function (a) {
	            if (a === 0) {
	                throw "invalid a:a is 0";
	            }
	            if (a !== 0) {
	                for (var i = 0, length = this.elements.length; i < length; i++) {
	                    this.elements[i] /= a;
	                }
	            }
	        };
	        Matrix.prototype.worldTranslate = function (x, y, z) {
	            this.elements[12] += x;
	            this.elements[13] += y;
	            this.elements[14] += z;
	        };
	        Matrix.prototype.localTranslate = function (x, y, z) {
	            var localColumn = [x, y, z, 1];
	            var worldColumn = this.multiplyColumn(localColumn);
	            var origin = this.getPosition();
	            this.worldTranslate(worldColumn[0] - origin.x, worldColumn[1] - origin.y, worldColumn[2] - origin.z);
	        };
	        Matrix.prototype.worldScale = function (scaleX, scaleY, scaleZ) {
	            scaleX = (scaleX !== undefined) ? scaleX : 1;
	            scaleY = (scaleY !== undefined) ? scaleY : 1;
	            scaleZ = (scaleZ !== undefined) ? scaleZ : 1;
	            var m = new Matrix(scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, scaleZ, 0, 0, 0, 0, 1);
	            var result = m.multiplyMatrix(this);
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.localScale = function (scaleX, scaleY, scaleZ) {
	            var transVertice = this.getPosition();
	            this.setPosition(new Vertice(0, 0, 0));
	            this.worldScale(scaleX, scaleY, scaleZ);
	            this.setPosition(transVertice);
	        };
	        Matrix.prototype.worldRotateX = function (radian) {
	            var c = Math.cos(radian);
	            var s = Math.sin(radian);
	            var m = new Matrix(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
	            var result = m.multiplyMatrix(this);
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.worldRotateY = function (radian) {
	            var c = Math.cos(radian);
	            var s = Math.sin(radian);
	            var m = new Matrix(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
	            var result = m.multiplyMatrix(this);
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.worldRotateZ = function (radian) {
	            var c = Math.cos(radian);
	            var s = Math.sin(radian);
	            var m = new Matrix(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	            var result = m.multiplyMatrix(this);
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.worldRotateByVector = function (radian, vector) {
	            var x = vector.x;
	            var y = vector.y;
	            var z = vector.z;
	            var length, s, c;
	            var xx, yy, zz, xy, yz, zx, xs, ys, zs, one_c;
	            s = Math.sin(radian);
	            c = Math.cos(radian);
	            length = Math.sqrt(x * x + y * y + z * z);
	            x /= length;
	            y /= length;
	            z /= length;
	            xx = x * x;
	            yy = y * y;
	            zz = z * z;
	            xy = x * y;
	            yz = y * z;
	            zx = z * x;
	            xs = x * s;
	            ys = y * s;
	            zs = z * s;
	            one_c = 1.0 - c;
	            var m11 = (one_c * xx) + c;
	            var m12 = (one_c * xy) - zs;
	            var m13 = (one_c * zx) + ys;
	            var m14 = 0.0;
	            var m21 = (one_c * xy) + zs;
	            var m22 = (one_c * yy) + c;
	            var m23 = (one_c * yz) - xs;
	            var m24 = 0.0;
	            var m31 = (one_c * zx) - ys;
	            var m32 = (one_c * yz) + xs;
	            var m33 = (one_c * zz) + c;
	            var m34 = 0.0;
	            var m41 = 0.0;
	            var m42 = 0.0;
	            var m43 = 0.0;
	            var m44 = 1.0;
	            var mat = new Matrix(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
	            var result = mat.multiplyMatrix(this);
	            this.setMatrixByOther(result);
	        };
	        Matrix.prototype.localRotateX = function (radian) {
	            var transVertice = this.getPosition();
	            this.setPosition(new Vertice(0, 0, 0));
	            var columnX = this.getVectorX();
	            this.worldRotateByVector(radian, columnX);
	            this.setPosition(transVertice);
	        };
	        Matrix.prototype.localRotateY = function (radian) {
	            var transVertice = this.getPosition();
	            this.setPosition(new Vertice(0, 0, 0));
	            var columnY = this.getVectorY();
	            this.worldRotateByVector(radian, columnY);
	            this.setPosition(transVertice);
	        };
	        Matrix.prototype.localRotateZ = function (radian) {
	            var transVertice = this.getPosition();
	            this.setPosition(new Vertice(0, 0, 0));
	            var columnZ = this.getVectorZ();
	            this.worldRotateByVector(radian, columnZ);
	            this.setPosition(transVertice);
	        };
	        Matrix.prototype.localRotateByVector = function (radian, localVector) {
	            var localColumn = localVector.getArray();
	            localColumn.push(1);
	            var worldColumn = this.multiplyColumn(localColumn);
	            var worldVector = new Vector(worldColumn[0], worldColumn[1], worldColumn[2]);
	            var transVertice = this.getPosition();
	            this.setPosition(new Vertice(0, 0, 0));
	            this.worldRotateByVector(radian, worldVector);
	            this.setPosition(transVertice);
	        };
	        return Matrix;
	    }());
	    ;
	    return Matrix;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Matrix) {
	    "use strict";
	    var Object3D = (function () {
	        function Object3D() {
	            this.matrix = new Matrix();
	        }
	        Object3D.prototype.getMatrix = function () {
	            return this.matrix;
	        };
	        Object3D.prototype.cloneMatrix = function () {
	            return this.matrix.clone();
	        };
	        Object3D.prototype.setVectorX = function (vector) {
	            this.matrix.setVectorX(vector);
	        };
	        Object3D.prototype.getVectorX = function () {
	            return this.matrix.getVectorX();
	        };
	        Object3D.prototype.setVectorY = function (vector) {
	            this.matrix.setVectorY(vector);
	        };
	        Object3D.prototype.getVectorY = function () {
	            return this.matrix.getVectorY();
	        };
	        Object3D.prototype.setVectorZ = function (vector) {
	            this.matrix.setVectorZ(vector);
	        };
	        Object3D.prototype.getVectorZ = function () {
	            return this.matrix.getVectorZ();
	        };
	        Object3D.prototype.setPosition = function (vertice) {
	            this.matrix.setPosition(vertice);
	        };
	        Object3D.prototype.getPosition = function () {
	            return this.matrix.getPosition();
	        };
	        Object3D.prototype.worldTranslate = function (x, y, z) {
	            this.matrix.worldTranslate(x, y, z);
	        };
	        Object3D.prototype.localTranslate = function (x, y, z) {
	            this.matrix.localTranslate(x, y, z);
	        };
	        Object3D.prototype.worldScale = function (scaleX, scaleY, scaleZ) {
	            this.matrix.worldScale(scaleX, scaleY, scaleZ);
	        };
	        Object3D.prototype.localScale = function (scaleX, scaleY, scaleZ) {
	            this.matrix.localScale(scaleX, scaleY, scaleZ);
	        };
	        Object3D.prototype.worldRotateX = function (radian) {
	            this.matrix.worldRotateX(radian);
	        };
	        Object3D.prototype.worldRotateY = function (radian) {
	            this.matrix.worldRotateY(radian);
	        };
	        Object3D.prototype.worldRotateZ = function (radian) {
	            this.matrix.worldRotateZ(radian);
	        };
	        Object3D.prototype.worldRotateByVector = function (radian, vector) {
	            this.matrix.worldRotateByVector(radian, vector);
	        };
	        Object3D.prototype.localRotateX = function (radian) {
	            this.matrix.localRotateX(radian);
	        };
	        Object3D.prototype.localRotateY = function (radian) {
	            this.matrix.localRotateY(radian);
	        };
	        Object3D.prototype.localRotateZ = function (radian) {
	            this.matrix.localRotateZ(radian);
	        };
	        Object3D.prototype.localRotateByVector = function (radian, localVector) {
	            this.matrix.localRotateByVector(radian, localVector);
	        };
	        Object3D.prototype.getXAxisDirection = function () {
	            var directionX = this.matrix.getVectorX();
	            directionX.normalize();
	            return directionX;
	        };
	        Object3D.prototype.getYAxisDirection = function () {
	            var directionY = this.matrix.getVectorY();
	            directionY.normalize();
	            return directionY;
	        };
	        Object3D.prototype.getZAxisDirection = function () {
	            var directionZ = this.matrix.getVectorZ();
	            directionZ.normalize();
	            return directionZ;
	        };
	        return Object3D;
	    }());
	    return Object3D;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var ImageUtils = {
	        MAX_LEVEL: 4,
	        images: {},
	        add: function (url, img) {
	            this.images[url] = img;
	        },
	        get: function (url) {
	            return this.images[url];
	        },
	        remove: function (url) {
	            delete this.images[url];
	        },
	        clear: function () {
	            this.images = {};
	        },
	        getCount: function () {
	            var count = 0;
	            for (var url in this.images) {
	                if (this.images.hasOwnProperty(url)) {
	                    count++;
	                }
	            }
	            return count;
	        }
	    };
	    return ImageUtils;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(11), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Utils, MathUtils, Vector) {
	    "use strict";
	    var EventHandler = (function () {
	        function EventHandler(canvas) {
	            this.canvas = canvas;
	            this.down = false;
	            this.dragGeo = null;
	            this.previousX = -1;
	            this.previousY = -1;
	            this.twoTouchDistance = -1;
	            this.oldTime = -1;
	            this.lastTime = -1;
	            this.startTime = -1;
	            this.endTime = -1;
	            this.endTime = this.startTime = this.lastTime = this.oldTime = Date.now();
	            this._bindEvents();
	            this._initLayout();
	        }
	        EventHandler.prototype._bindEvents = function () {
	            window.addEventListener("resize", this._initLayout.bind(this));
	            if (Utils.isMobile()) {
	                this.canvas.addEventListener("touchstart", this._onTouchStart.bind(this), false);
	                this.canvas.addEventListener("touchend", this._onTouchEnd.bind(this), false);
	                this.canvas.addEventListener("touchmove", this._onTouchMove.bind(this), false);
	            }
	            else {
	                this.canvas.addEventListener("mousedown", this._onMouseDown.bind(this), false);
	                this.canvas.addEventListener("mouseup", this._onMouseUp.bind(this), false);
	                this.canvas.addEventListener("mousemove", this._onMouseMove.bind(this), false);
	                this.canvas.addEventListener("dblclick", this._onDbClick.bind(this), false);
	                this.canvas.addEventListener("mousewheel", this._onMouseWheel.bind(this), false);
	                this.canvas.addEventListener("DOMMouseScroll", this._onMouseWheel.bind(this), false);
	                document.body.addEventListener("keydown", this._onKeyDown.bind(this), false);
	            }
	        };
	        EventHandler.prototype._initLayout = function () {
	            this.canvas.width = document.body.clientWidth;
	            this.canvas.height = document.body.clientHeight;
	            if (Kernel.globe) {
	                Kernel.globe.camera.setAspect(this.canvas.width / this.canvas.height);
	            }
	        };
	        EventHandler.prototype.moveLonLatToCanvas = function (lon, lat, canvasX, canvasY) {
	            var pickResult = Kernel.globe.camera.getPickCartesianCoordInEarthByCanvas(canvasX, canvasY);
	            if (pickResult.length > 0) {
	                var newLonLat = MathUtils.cartesianCoordToGeographic(pickResult[0]);
	                var newLon = newLonLat[0];
	                var newLat = newLonLat[1];
	                this._moveGeo(lon, lat, newLon, newLat);
	            }
	        };
	        EventHandler.prototype._moveGeo = function (oldLon, oldLat, newLon, newLat) {
	            if (oldLon === newLon && oldLat === newLat) {
	                return;
	            }
	            var p1 = MathUtils.geographicToCartesianCoord(oldLon, oldLat);
	            var v1 = Vector.fromVertice(p1);
	            var p2 = MathUtils.geographicToCartesianCoord(newLon, newLat);
	            var v2 = Vector.fromVertice(p2);
	            var rotateVector = v1.cross(v2);
	            var rotateRadian = -Vector.getRadianOfTwoVectors(v1, v2);
	            Kernel.globe.camera.worldRotateByVector(rotateRadian, rotateVector);
	        };
	        EventHandler.prototype._handleMouseDownOrTouchStart = function (offsetX, offsetY) {
	            this.down = true;
	            this.previousX = offsetX;
	            this.previousY = offsetY;
	            var pickResult = Kernel.globe.camera.getPickCartesianCoordInEarthByCanvas(this.previousX, this.previousY);
	            if (pickResult.length > 0) {
	                this.dragGeo = MathUtils.cartesianCoordToGeographic(pickResult[0]);
	            }
	        };
	        EventHandler.prototype._handleMouseMoveOrTouchMove = function (currentX, currentY) {
	            var globe = Kernel.globe;
	            if (!globe || globe.isAnimating() || !this.down) {
	                return;
	            }
	            var pickResult = globe.camera.getPickCartesianCoordInEarthByCanvas(currentX, currentY);
	            if (pickResult.length > 0) {
	                if (this.dragGeo) {
	                    var newGeo = MathUtils.cartesianCoordToGeographic(pickResult[0]);
	                    this._moveGeo(this.dragGeo[0], this.dragGeo[1], newGeo[0], newGeo[1]);
	                }
	                else {
	                    this.dragGeo = MathUtils.cartesianCoordToGeographic(pickResult[0]);
	                }
	                this.previousX = currentX;
	                this.previousY = currentY;
	                this.canvas.style.cursor = "pointer";
	            }
	            else {
	                this.previousX = -1;
	                this.previousY = -1;
	                this.dragGeo = null;
	                this.canvas.style.cursor = "default";
	            }
	        };
	        EventHandler.prototype._handleMouseUpOrTouchEnd = function () {
	            this.down = false;
	            this.previousX = -1;
	            this.previousY = -1;
	            this.dragGeo = null;
	            if (this.canvas) {
	                this.canvas.style.cursor = "default";
	            }
	        };
	        EventHandler.prototype._onMouseDown = function (event) {
	            var globe = Kernel.globe;
	            if (!globe || globe.isAnimating()) {
	                return;
	            }
	            var previousX = event.layerX || event.offsetX;
	            var previousY = event.layerY || event.offsetY;
	            this._handleMouseDownOrTouchStart(previousX, previousY);
	        };
	        EventHandler.prototype._onMouseMove = function (event) {
	            if (!this.down) {
	                return;
	            }
	            if (Kernel.globe.isAnimating()) {
	                return;
	            }
	            var currentX = event.layerX || event.offsetX;
	            var currentY = event.layerY || event.offsetY;
	            this._handleMouseMoveOrTouchMove(currentX, currentY);
	        };
	        EventHandler.prototype._onMouseUp = function () {
	            this._handleMouseUpOrTouchEnd();
	        };
	        EventHandler.prototype._onDbClick = function (event) {
	            var globe = Kernel.globe;
	            if (!globe || globe.isAnimating()) {
	                return;
	            }
	            var absoluteX = event.layerX || event.offsetX;
	            var absoluteY = event.layerY || event.offsetY;
	            var pickResult = globe.camera.getPickCartesianCoordInEarthByCanvas(absoluteX, absoluteY);
	            globe.zoomIn();
	            if (pickResult.length >= 1) {
	                var pickVertice = pickResult[0];
	                var lonlat = MathUtils.cartesianCoordToGeographic(pickVertice);
	                var lon = lonlat[0];
	                var lat = lonlat[1];
	                globe.zoomIn();
	                this.moveLonLatToCanvas(lon, lat, absoluteX, absoluteY);
	            }
	        };
	        EventHandler.prototype._onMouseWheel = function (event) {
	            var globe = Kernel.globe;
	            if (!globe || globe.isAnimating()) {
	                return;
	            }
	            var deltaLevel = 0;
	            var delta;
	            if (event.wheelDelta) {
	                delta = event.wheelDelta;
	                deltaLevel = parseInt((delta / 120));
	            }
	            else if (event.detail) {
	                delta = event.detail;
	                deltaLevel = -parseInt((delta / 3));
	            }
	            var newLevel = globe.getLevel() + deltaLevel;
	            if (newLevel >= 0) {
	                globe.animateToLevel(newLevel);
	            }
	        };
	        EventHandler.prototype._onKeyDown = function (event) {
	            var globe = Kernel.globe;
	            if (!globe || globe.isAnimating()) {
	                return;
	            }
	            var DELTA_PITCH = 2;
	            var camera = globe.camera;
	            var keyNum = event.keyCode !== undefined ? event.keyCode : event.which;
	            if (keyNum === 38) {
	                camera.setDeltaPitch(DELTA_PITCH);
	            }
	            else if (keyNum === 40) {
	                camera.setDeltaPitch(-DELTA_PITCH);
	            }
	        };
	        EventHandler.prototype._onTouchZero = function () {
	            this.twoTouchDistance = -1;
	            this._handleMouseUpOrTouchEnd();
	            this.endTime = Date.now();
	            var time = this.endTime - this.startTime;
	            if (time <= 200) {
	                var time2 = this.endTime - this.lastTime;
	                if (time2 < 300) {
	                    this.lastTime = this.oldTime;
	                    Kernel.globe.zoomIn();
	                }
	                else {
	                    this.lastTime = this.endTime;
	                }
	            }
	        };
	        EventHandler.prototype._onTouchOne = function (event) {
	            this.twoTouchDistance = -1;
	            var touch = event.targetTouches[0];
	            var previousX = touch.pageX;
	            var previousY = touch.pageY;
	            this._handleMouseDownOrTouchStart(previousX, previousY);
	            this.startTime = Date.now();
	        };
	        EventHandler.prototype._onTouchTwo = function (event) {
	            this.down = true;
	            this.previousX = -1;
	            this.previousY = -1;
	            this.dragGeo = null;
	            var touch1 = event.targetTouches[0];
	            var x1 = touch1.pageX;
	            var y1 = touch1.pageY;
	            var touch2 = event.targetTouches[1];
	            var x2 = touch2.pageX;
	            var y2 = touch2.pageY;
	            this.twoTouchDistance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	        };
	        EventHandler.prototype._onTouchMulti = function () {
	            this.down = true;
	            this.previousX = -1;
	            this.previousY = -1;
	            this.dragGeo = null;
	            this.twoTouchDistance = -1;
	        };
	        EventHandler.prototype._onTouchStart = function (event) {
	            var globe = Kernel.globe;
	            if (!globe || globe.isAnimating()) {
	                return;
	            }
	            var touchCount = event.targetTouches.length;
	            if (touchCount === 0) {
	                this._onTouchZero();
	            }
	            else if (touchCount === 1) {
	                this._onTouchOne(event);
	            }
	            else if (touchCount === 2) {
	                this._onTouchTwo(event);
	            }
	            else {
	                this._onTouchMulti();
	            }
	        };
	        EventHandler.prototype._onTouchMoveOne = function (event) {
	            var touch = event.targetTouches[0];
	            var currentX = touch.pageX;
	            var currentY = touch.pageY;
	            this._handleMouseMoveOrTouchMove(currentX, currentY);
	        };
	        EventHandler.prototype._onTouchMoveTwo = function (event) {
	            var _this = this;
	            var touch1 = event.targetTouches[0];
	            var x1 = touch1.pageX;
	            var y1 = touch1.pageY;
	            var touch2 = event.targetTouches[1];
	            var x2 = touch2.pageX;
	            var y2 = touch2.pageY;
	            var twoTouchDistance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	            var radio = twoTouchDistance / this.twoTouchDistance;
	            if (radio >= 1.3) {
	                Kernel.globe.animateIn(function () {
	                    _this.twoTouchDistance = twoTouchDistance;
	                });
	            }
	            else if (radio <= 0.7) {
	                Kernel.globe.animateOut(function () {
	                    _this.twoTouchDistance = twoTouchDistance;
	                });
	            }
	        };
	        EventHandler.prototype._onTouchMove = function (event) {
	            if (!this.down) {
	                return;
	            }
	            if (Kernel.globe.isAnimating()) {
	                return;
	            }
	            var touchCount = event.targetTouches.length;
	            if (touchCount === 1) {
	                this._onTouchMoveOne(event);
	            }
	            else if (touchCount === 2) {
	                this._onTouchMoveTwo(event);
	            }
	        };
	        EventHandler.prototype._onTouchEnd = function (event) {
	            var touchCount = event.targetTouches.length;
	            if (touchCount === 0) {
	                this._onTouchZero();
	            }
	            else if (touchCount === 1) {
	                this._onTouchOne(event);
	            }
	            else if (touchCount === 2) {
	                this._onTouchTwo(event);
	            }
	            else {
	                this._onTouchMulti();
	            }
	        };
	        return EventHandler;
	    }());
	    return EventHandler;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(20), __webpack_require__(35)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, TiledLayer, LabelLayer_1) {
	    "use strict";
	    var GoogleTiledLayer = (function (_super) {
	        __extends(GoogleTiledLayer, _super);
	        function GoogleTiledLayer(style) {
	            if (style === void 0) { style = "Default"; }
	            _super.call(this, style);
	            this.idx = 0;
	        }
	        GoogleTiledLayer.prototype.getTileUrl = function (level, row, column) {
	            if (this.idx === undefined) {
	                this.idx = 0;
	            }
	            var lyrs = "y";
	            switch (this.style) {
	                case "Satellite":
	                    lyrs = "s";
	                    break;
	                case "Road":
	                    lyrs = "m";
	                    break;
	                case "RoadOnly":
	                    lyrs = "h";
	                    break;
	                case "Terrain":
	                    lyrs = "p";
	                    break;
	                case "TerrainOnly":
	                    lyrs = "t";
	                    break;
	            }
	            var url = "//mt" + this.idx + ".google.cn/maps/vt?lyrs=" + lyrs + "&hl=zh-CN&gl=CN&&x=" + column + "&y=" + row + "&z=" + level;
	            this.idx++;
	            if (this.idx >= 4) {
	                this.idx = 0;
	            }
	            return url;
	        };
	        return GoogleTiledLayer;
	    }(TiledLayer));
	    exports.GoogleTiledLayer = GoogleTiledLayer;
	    ;
	    var GoogleLabelLayer = (function (_super) {
	        __extends(GoogleLabelLayer, _super);
	        function GoogleLabelLayer() {
	            _super.apply(this, arguments);
	            this.idx = 0;
	        }
	        GoogleLabelLayer.prototype.getTileUrl = function (level, row, column) {
	            if (this.idx === undefined) {
	                this.idx = 0;
	            }
	            var url = "//mt" + this.idx + ".google.cn/vt/imgtp=png32&lyrs=h@365000000&hl=zh-CN&gl=cn&x=" + column + "&y=" + row + "&z=" + level + "&s=Galil";
	            this.idx++;
	            if (this.idx >= 4) {
	                this.idx = 0;
	            }
	            return url;
	        };
	        return GoogleLabelLayer;
	    }(LabelLayer_1.default));
	    exports.GoogleLabelLayer = GoogleLabelLayer;
	    ;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(1), __webpack_require__(21), __webpack_require__(22), __webpack_require__(4), __webpack_require__(34)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Utils, Kernel, Extent, Tile, GraphicGroup, SubTiledLayer) {
	    "use strict";
	    var TiledLayer = (function (_super) {
	        __extends(TiledLayer, _super);
	        function TiledLayer(style) {
	            if (style === void 0) { style = ""; }
	            _super.call(this);
	            this.style = style;
	            this.imageRequestOptimizeDeltaLevel = 2;
	            var subLayer0 = new SubTiledLayer(0);
	            this.add(subLayer0);
	            var subLayer1 = new SubTiledLayer(1);
	            this.add(subLayer1);
	            for (var m = 0; m <= 1; m++) {
	                for (var n = 0; n <= 1; n++) {
	                    var args = {
	                        level: 1,
	                        row: m,
	                        column: n,
	                        url: ""
	                    };
	                    args.url = this.getTileUrl(args.level, args.row, args.column);
	                    var tile = Tile.getInstance(args.level, args.row, args.column, args.url);
	                    subLayer1.add(tile);
	                }
	            }
	        }
	        TiledLayer.prototype.refresh = function () {
	            var globe = Kernel.globe;
	            var camera = globe.camera;
	            var level = globe.getLevel();
	            var options = {
	                threshold: 1
	            };
	            var pitch = camera.getPitch();
	            options.threshold = 1;
	            var lastLevelTileGrids = camera.getVisibleTilesByLevel(level, options);
	            var levelsTileGrids = [];
	            var parentTileGrids = lastLevelTileGrids;
	            var subLevel;
	            for (subLevel = level; subLevel >= 2; subLevel--) {
	                levelsTileGrids[subLevel] = parentTileGrids;
	                parentTileGrids = parentTileGrids.map(function (item) {
	                    return item.getParent();
	                });
	                parentTileGrids = Utils.filterRepeatArray(parentTileGrids);
	            }
	            for (subLevel = 2; subLevel <= level; subLevel++) {
	                var addNew = level === subLevel || (level - subLevel) > this.imageRequestOptimizeDeltaLevel;
	                this.children[subLevel].updateTiles(subLevel, levelsTileGrids[subLevel], addNew);
	            }
	        };
	        TiledLayer.prototype.updateSubLayerCount = function () {
	            var level = Kernel.globe.getLevel();
	            var subLayerCount = this.children.length;
	            var deltaLevel = level + 1 - subLayerCount;
	            var i, subLayer;
	            if (deltaLevel > 0) {
	                for (i = 0; i < deltaLevel; i++) {
	                    subLayer = new SubTiledLayer(i + subLayerCount);
	                    this.add(subLayer);
	                }
	            }
	            else if (deltaLevel < 0) {
	                deltaLevel *= -1;
	                for (i = 0; i < deltaLevel; i++) {
	                    var removeLevel = this.children.length - 1;
	                    if (removeLevel >= 2) {
	                        subLayer = this.children[removeLevel];
	                        this.remove(subLayer);
	                    }
	                    else {
	                        break;
	                    }
	                }
	            }
	        };
	        TiledLayer.prototype._getReadyTile = function (tileGrid) {
	            var level = tileGrid.level;
	            var row = tileGrid.row;
	            var column = tileGrid.column;
	            var tile = this.children[level].findTile(level, row, column);
	            if (level === 1) {
	                return tile;
	            }
	            else {
	                if (tile && tile.isReady()) {
	                    return tile;
	                }
	                else {
	                    return this._getReadyTile(tileGrid.getParent());
	                }
	            }
	        };
	        TiledLayer.prototype.updateTileVisibility = function () {
	            var _this = this;
	            var globe = Kernel.globe;
	            var level = globe.getLevel();
	            this.children.forEach(function (subTiledLayer) {
	                subTiledLayer.showAllTiles();
	            });
	            var ancesorLevel = level - this.imageRequestOptimizeDeltaLevel - 1;
	            if (ancesorLevel >= 1) {
	                var camera = Kernel.globe.camera;
	                var tileGrids = camera.getTileGridsOfBoundary(ancesorLevel, false);
	                if (tileGrids.length === 8) {
	                    tileGrids = Utils.filterRepeatArray(tileGrids);
	                    for (var i = 0; i <= ancesorLevel; i++) {
	                        this.children[i].hideAllTiles();
	                    }
	                    tileGrids.forEach(function (tileGrid) {
	                        var tile = _this._getReadyTile(tileGrid);
	                        if (tile) {
	                            tile.setVisible(true);
	                            tile.parent.visible = true;
	                        }
	                    });
	                }
	            }
	        };
	        TiledLayer.prototype.onDraw = function (camera) {
	            var program = Tile.findProgram();
	            if (!program) {
	                return;
	            }
	            program.use();
	            var gl = Kernel.gl;
	            var pmvMatrix = camera.getProjViewMatrixForDraw();
	            var locPMVMatrix = program.getUniformLocation('uPMVMatrix');
	            gl.uniformMatrix4fv(locPMVMatrix, false, pmvMatrix.getFloat32Array());
	            gl.activeTexture(gl.TEXTURE0);
	            var locSampler = program.getUniformLocation('uSampler');
	            gl.uniform1i(locSampler, 0);
	            gl.depthFunc(gl.ALWAYS);
	            _super.prototype.onDraw.call(this, camera);
	            gl.depthFunc(gl.LEQUAL);
	        };
	        TiledLayer.prototype.getExtent = function (level) {
	            var extents = this.getExtents(level);
	            return Extent.union(extents);
	        };
	        TiledLayer.prototype.getExtents = function (level) {
	            if (!(level >= 0 && level <= (this.children.length - 1))) {
	                level = this.children.length - 1 - 3;
	            }
	            var subTiledLayer = this.children[level];
	            if (subTiledLayer) {
	                return subTiledLayer.getExtents();
	            }
	            return [];
	        };
	        TiledLayer.prototype.wrapUrlWithProxy = function (url) {
	            return Utils.wrapUrlWithProxy(url);
	        };
	        TiledLayer.prototype.getLastLevelVisibleTileGrids = function () {
	            var tileGrids = null;
	            var subTiledLayer = this.children[this.children.length - 1];
	            if (subTiledLayer) {
	                tileGrids = subTiledLayer.getVisibleTileGrids();
	            }
	            return tileGrids;
	        };
	        TiledLayer.prototype.logVisibleTiles = function () {
	            var result = [];
	            this.children.forEach(function (subLayer) {
	                var allCount = subLayer.children.length;
	                var visibleCount = subLayer.getShouldDrawTilesCount();
	                result.push({
	                    level: subLayer.getLevel(),
	                    allCount: allCount,
	                    visibleCount: visibleCount
	                });
	            });
	            console.table(result);
	        };
	        return TiledLayer;
	    }(GraphicGroup));
	    return TiledLayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Extent = (function () {
	        function Extent(minLon, minLat, maxLon, maxLat, tileGrid) {
	            this.minLon = minLon;
	            this.minLat = minLat;
	            this.maxLon = maxLon;
	            this.maxLat = maxLat;
	            this.tileGrid = tileGrid;
	        }
	        Extent.prototype.getMinLon = function () {
	            return this.minLon;
	        };
	        Extent.prototype.getMinLat = function () {
	            return this.minLat;
	        };
	        Extent.prototype.getMaxLon = function () {
	            return this.maxLon;
	        };
	        Extent.prototype.getMaxLat = function () {
	            return this.maxLat;
	        };
	        Extent.prototype.getTileGrid = function () {
	            return this.tileGrid;
	        };
	        Extent.prototype.toJson = function () {
	            return [this.minLon, this.minLat, this.maxLon, this.maxLat];
	        };
	        Extent.union = function (extents) {
	            return null;
	        };
	        return Extent;
	    }());
	    return Extent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(21), __webpack_require__(11), __webpack_require__(26), __webpack_require__(23), __webpack_require__(29), __webpack_require__(32), __webpack_require__(33), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Extent, MathUtils, MeshGraphic, TileMaterial, TileGeometry, Vertice, Triangle, TileGrid_1) {
	    "use strict";
	    var TileInfo = (function () {
	        function TileInfo(level, row, column, url) {
	            this.level = level;
	            this.row = row;
	            this.column = column;
	            this.url = url;
	            this.minLon = null;
	            this.minLat = null;
	            this.maxLon = null;
	            this.maxLat = null;
	            this.minX = null;
	            this.minY = null;
	            this.maxX = null;
	            this.maxY = null;
	            this.segment = 1;
	            this._setTileInfo();
	            this._handleGlobeTile();
	            this.material = new TileMaterial(this.level, this.url);
	        }
	        TileInfo.prototype._setTileInfo = function () {
	            var Egeo = MathUtils.getTileGeographicEnvelopByGrid(this.level, this.row, this.column);
	            this.minLon = Egeo.minLon;
	            this.minLat = Egeo.minLat;
	            this.maxLon = Egeo.maxLon;
	            this.maxLat = Egeo.maxLat;
	            var minCoord = MathUtils.degreeGeographicToWebMercator(this.minLon, this.minLat);
	            var maxCoord = MathUtils.degreeGeographicToWebMercator(this.maxLon, this.maxLat);
	            this.minX = minCoord[0];
	            this.minY = minCoord[1];
	            this.maxX = maxCoord[0];
	            this.maxY = maxCoord[1];
	        };
	        TileInfo.prototype._handleGlobeTile = function () {
	            var BASE_LEVEL = Kernel.BASE_LEVEL;
	            if (this.level < BASE_LEVEL) {
	                var changeLevel = BASE_LEVEL - this.level;
	                this.segment = Math.pow(2, changeLevel);
	            }
	            else {
	                this.segment = 1;
	            }
	            this._handleTile();
	        };
	        TileInfo.prototype._handleTile = function () {
	            this.visible = true;
	            var verticeArray = [];
	            var triangleArray = [];
	            var vertices = [];
	            var indices = [];
	            var textureCoords = [];
	            var deltaX = (this.maxX - this.minX) / this.segment;
	            var deltaY = (this.maxY - this.minY) / this.segment;
	            var deltaTextureCoord = 1.0 / this.segment;
	            var changeElevation = 0;
	            var levelDeltaR = 0;
	            var mercatorXs = [];
	            var mercatorYs = [];
	            var textureSs = [];
	            var textureTs = [];
	            var i, j;
	            for (i = 0; i <= this.segment; i++) {
	                mercatorXs.push(this.minX + i * deltaX);
	                mercatorYs.push(this.maxY - i * deltaY);
	                var b = i * deltaTextureCoord;
	                textureSs.push(b);
	                textureTs.push(1 - b);
	            }
	            var index = 0;
	            for (i = 0; i <= this.segment; i++) {
	                for (j = 0; j <= this.segment; j++) {
	                    var merX = mercatorXs[j];
	                    var merY = mercatorYs[i];
	                    var ele = 0;
	                    var lonlat = MathUtils.webMercatorToDegreeGeographic(merX, merY);
	                    var p = MathUtils.geographicToCartesianCoord(lonlat[0], lonlat[1], Kernel.EARTH_RADIUS + ele + levelDeltaR).getArray();
	                    vertices = vertices.concat(p);
	                    textureCoords = textureCoords.concat(textureSs[j], textureTs[i]);
	                    var v = new Vertice({
	                        p: p,
	                        i: index,
	                        uv: [textureSs[j], textureTs[i]]
	                    });
	                    verticeArray.push(v);
	                    index++;
	                }
	            }
	            for (i = 0; i < this.segment; i++) {
	                for (j = 0; j < this.segment; j++) {
	                    var idx0 = (this.segment + 1) * i + j;
	                    var idx1 = (this.segment + 1) * (i + 1) + j;
	                    var idx2 = idx1 + 1;
	                    var idx3 = idx0 + 1;
	                    indices = indices.concat(idx0, idx1, idx2);
	                    indices = indices.concat(idx2, idx3, idx0);
	                    var v0 = verticeArray[idx0];
	                    var v1 = verticeArray[idx1];
	                    var v2 = verticeArray[idx2];
	                    var v3 = verticeArray[idx3];
	                    var triangle1 = new Triangle(v0, v1, v2);
	                    var triangle2 = new Triangle(v2, v3, v0);
	                    triangleArray.push(triangle1, triangle2);
	                }
	            }
	            this.geometry = new TileGeometry(verticeArray, triangleArray);
	        };
	        return TileInfo;
	    }());
	    var Tile = (function (_super) {
	        __extends(Tile, _super);
	        function Tile(geometry, material, tileInfo) {
	            _super.call(this, geometry, material);
	            this.geometry = geometry;
	            this.material = material;
	            this.tileInfo = tileInfo;
	        }
	        Tile.getInstance = function (level, row, column, url) {
	            var tileInfo = new TileInfo(level, row, column, url);
	            return new Tile(tileInfo.geometry, tileInfo.material, tileInfo);
	        };
	        Tile.prototype.updateShaderUniforms = function (camera) {
	        };
	        Tile.prototype.getExtent = function () {
	            var tileInfo = this.tileInfo;
	            var tileGrid = new TileGrid_1.default(tileInfo.level, tileInfo.row, tileInfo.column);
	            return new Extent(this.tileInfo.minLon, this.tileInfo.minLat, this.tileInfo.maxLon, this.tileInfo.maxLat, tileGrid);
	        };
	        Tile.prototype.shouldDraw = function (camera) {
	            return this.tileInfo.visible && _super.prototype.shouldDraw.call(this, camera);
	        };
	        Tile.prototype.destroy = function () {
	            _super.prototype.destroy.call(this);
	            this.subTiledLayer = null;
	        };
	        return Tile;
	    }(MeshGraphic));
	    return Tile;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(24), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, MeshTextureMaterial, ImageUtils) {
	    "use strict";
	    var TileMaterial = (function (_super) {
	        __extends(TileMaterial, _super);
	        function TileMaterial(level, imageOrUrl) {
	            _super.call(this, imageOrUrl, true);
	            this.level = level >= 0 ? level : 20;
	        }
	        TileMaterial.prototype.onLoad = function () {
	            if (this.level <= ImageUtils.MAX_LEVEL) {
	                ImageUtils.add(this.image.src, this.image);
	            }
	            _super.prototype.onLoad.call(this);
	        };
	        return TileMaterial;
	    }(MeshTextureMaterial));
	    return TileMaterial;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(25), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Material, ImageUtils) {
	    "use strict";
	    var MeshTextureMaterial = (function (_super) {
	        __extends(MeshTextureMaterial, _super);
	        function MeshTextureMaterial(imageOrUrl, flipY) {
	            if (imageOrUrl === void 0) { imageOrUrl = null; }
	            if (flipY === void 0) { flipY = false; }
	            _super.call(this);
	            this.flipY = flipY;
	            this.ready = false;
	            this.deleted = false;
	            this.texture = Kernel.gl.createTexture();
	            if (imageOrUrl) {
	                this.setImageOrUrl(imageOrUrl);
	            }
	        }
	        MeshTextureMaterial.prototype.isReady = function () {
	            return this.ready && !this.deleted;
	        };
	        MeshTextureMaterial.prototype.setImageOrUrl = function (imageOrUrl) {
	            if (!imageOrUrl) {
	                return;
	            }
	            if (imageOrUrl instanceof Image && imageOrUrl.width > 0 && imageOrUrl.height > 0) {
	                this.setImage(imageOrUrl);
	            }
	            else if (typeof imageOrUrl === "string") {
	                this.setImageUrl(imageOrUrl);
	            }
	        };
	        MeshTextureMaterial.prototype.setImage = function (image) {
	            if (image.width > 0 && image.height > 0) {
	                this.ready = false;
	                this.image = image;
	                this.onLoad();
	            }
	        };
	        MeshTextureMaterial.prototype.setImageUrl = function (url) {
	            var tileImage = ImageUtils.get(url);
	            if (tileImage) {
	                this.setImage(tileImage);
	            }
	            else {
	                this.ready = false;
	                this.image = new Image();
	                this.image.crossOrigin = 'anonymous';
	                this.image.onload = this.onLoad.bind(this);
	                this.image.src = url;
	            }
	        };
	        MeshTextureMaterial.prototype.onLoad = function () {
	            if (this.deleted) {
	                return;
	            }
	            var gl = Kernel.gl;
	            gl.bindTexture(gl.TEXTURE_2D, this.texture);
	            if (this.flipY) {
	                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, +true);
	            }
	            else {
	                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, +false);
	            }
	            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	            this.ready = true;
	        };
	        MeshTextureMaterial.prototype.destroy = function () {
	            var gl = Kernel.gl;
	            if (this.texture) {
	                gl.deleteTexture(this.texture);
	            }
	            if (this.image && !this.ready) {
	                this.image.src = "";
	            }
	            this.ready = false;
	            this.texture = null;
	            this.deleted = true;
	        };
	        return MeshTextureMaterial;
	    }(Material));
	    return MeshTextureMaterial;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Material = (function () {
	        function Material() {
	        }
	        return Material;
	    }());
	    return Material;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(27), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Program, Graphic) {
	    "use strict";
	    var vs = "\nattribute vec3 aPosition;\nattribute vec2 aUV;\nvarying vec2 vUV;\nuniform mat4 uPMVMatrix;\n\nvoid main()\n{\n\tgl_Position = uPMVMatrix * vec4(aPosition,1.0);\n\tvUV = aUV;\n}\n";
	    var fs = "\nprecision mediump float;\nvarying vec2 vUV;\nuniform sampler2D uSampler;\n\nvoid main()\n{\n\tgl_FragColor = texture2D(uSampler, vec2(vUV.s, vUV.t));\n}\n";
	    var MeshGraphic = (function (_super) {
	        __extends(MeshGraphic, _super);
	        function MeshGraphic(geometry, material) {
	            _super.call(this, geometry, material);
	            this.geometry = geometry;
	            this.material = material;
	            this.geometry.calculateVBO();
	            this.geometry.calculateIBO();
	            this.geometry.calculateUVBO();
	        }
	        MeshGraphic.prototype.isGeometryReady = function () {
	            return !!this.geometry.vbo && !!this.geometry.ibo && !!this.geometry.uvbo;
	        };
	        MeshGraphic.prototype.isReady = function () {
	            return this.isGeometryReady() && _super.prototype.isReady.call(this);
	        };
	        MeshGraphic.findProgram = function () {
	            return Program.findProgram(vs, fs);
	        };
	        MeshGraphic.prototype.createProgram = function () {
	            return Program.getProgram(vs, fs);
	        };
	        MeshGraphic.prototype.updateShaderUniforms = function (camera) {
	            var gl = Kernel.gl;
	            var pmvMatrix = camera.getProjViewMatrixForDraw().multiplyMatrix(this.geometry.getMatrix());
	            var locPMVMatrix = this.program.getUniformLocation('uPMVMatrix');
	            gl.uniformMatrix4fv(locPMVMatrix, false, pmvMatrix.getFloat32Array());
	            gl.activeTexture(gl.TEXTURE0);
	            var locSampler = this.program.getUniformLocation('uSampler');
	            gl.uniform1i(locSampler, 0);
	        };
	        MeshGraphic.prototype.onDraw = function (camera) {
	            var gl = Kernel.gl;
	            this.updateShaderUniforms(camera);
	            var locPosition = this.program.getAttribLocation('aPosition');
	            this.program.enableVertexAttribArray('aPosition');
	            this.geometry.vbo.bind();
	            gl.vertexAttribPointer(locPosition, 3, gl.FLOAT, false, 0, 0);
	            var locUV = this.program.getAttribLocation('aUV');
	            this.program.enableVertexAttribArray('aUV');
	            this.geometry.uvbo.bind();
	            gl.vertexAttribPointer(locUV, 2, gl.FLOAT, false, 0, 0);
	            gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
	            this.geometry.ibo.bind();
	            var count = this.geometry.triangles.length * 3;
	            gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	        };
	        return MeshGraphic;
	    }(Graphic));
	    return MeshGraphic;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel) {
	    "use strict";
	    var Program = (function () {
	        function Program(vs, fs) {
	            this.vs = vs;
	            this.fs = fs;
	            this.ready = false;
	            this.activeInfosObject = {};
	            this._init();
	        }
	        Program.getProgram = function (vs, fs) {
	            var program = Program.findProgram(vs, fs);
	            if (!program) {
	                program = new Program(vs, fs);
	                Program.programs.push(program);
	            }
	            return program;
	        };
	        Program.findProgram = function (vs, fs) {
	            var program = null;
	            Program.programs.some(function (item) {
	                if (item.vs === vs && item.fs === fs) {
	                    program = item;
	                    return true;
	                }
	                else {
	                    return false;
	                }
	            });
	            return program;
	        };
	        Program.prototype.use = function () {
	            if (this.ready && Program.currentProgram !== this) {
	                Kernel.gl.useProgram(this.program);
	                Program.currentProgram = this;
	            }
	        };
	        Program.prototype.updateActiveAttribInfos = function () {
	            var count = Kernel.gl.getProgramParameter(this.program, Kernel.gl.ACTIVE_ATTRIBUTES);
	            for (var i = 0, activeInfo; i < count; i++) {
	                activeInfo = Kernel.gl.getActiveAttrib(this.program, i);
	                activeInfo.loc = Kernel.gl.getAttribLocation(this.program, activeInfo.name);
	                activeInfo.isAttribute = true;
	                this.activeInfosObject[activeInfo.name] = activeInfo;
	            }
	        };
	        Program.prototype.updateActiveUniformInfos = function () {
	            var count = Kernel.gl.getProgramParameter(this.program, Kernel.gl.ACTIVE_UNIFORMS);
	            for (var i = 0, activeInfo; i < count; i++) {
	                activeInfo = Kernel.gl.getActiveUniform(this.program, i);
	                activeInfo.loc = Kernel.gl.getUniformLocation(this.program, activeInfo.name);
	                activeInfo.isAttribute = false;
	                this.activeInfosObject[activeInfo.name] = activeInfo;
	            }
	        };
	        Program.prototype.getLocation = function (name) {
	            var loc = -1;
	            var activeInfo = this.activeInfosObject[name];
	            if (activeInfo) {
	                loc = activeInfo.loc;
	            }
	            return loc;
	        };
	        Program.prototype.getAttribLocation = function (name) {
	            var loc = -1;
	            var activeInfo = this.activeInfosObject[name];
	            if (activeInfo && activeInfo.isAttribute) {
	                loc = activeInfo.loc;
	            }
	            return loc;
	        };
	        Program.prototype.getUniformLocation = function (name) {
	            var loc;
	            var activeInfo = this.activeInfosObject[name];
	            if (activeInfo && !activeInfo.isAttribute) {
	                loc = activeInfo.loc;
	            }
	            return loc;
	        };
	        Program.prototype.getVertexAttrib = function () {
	        };
	        Program.prototype.getUniform = function (name) {
	            var result;
	            var loc = this.getUniformLocation(name);
	            if (loc) {
	                result = Kernel.gl.getUniform(this.program, loc);
	            }
	            return result;
	        };
	        Program.prototype.enableVertexAttribArray = function (name) {
	            var activeInfo = this.activeInfosObject[name];
	            if (activeInfo && activeInfo.isAttribute && activeInfo.isEnabled !== true) {
	                var loc = activeInfo.loc;
	                Kernel.gl.enableVertexAttribArray(loc);
	                activeInfo.isEnabled = true;
	            }
	        };
	        Program.prototype.disableVertexAttribArray = function (name) {
	            var activeInfo = this.activeInfosObject[name];
	            if (activeInfo && activeInfo.isAttribute && activeInfo.isEnabled !== false) {
	                var loc = activeInfo.loc;
	                Kernel.gl.disableVertexAttribArray(loc);
	                activeInfo.isEnabled = false;
	            }
	        };
	        Program.prototype._init = function () {
	            var vs = this._getShader(Kernel.gl.VERTEX_SHADER, this.vs);
	            if (!vs) {
	                return;
	            }
	            var fs = this._getShader(Kernel.gl.FRAGMENT_SHADER, this.fs);
	            if (!fs) {
	                return;
	            }
	            this.program = Kernel.gl.createProgram();
	            Kernel.gl.attachShader(this.program, vs);
	            Kernel.gl.attachShader(this.program, fs);
	            Kernel.gl.linkProgram(this.program);
	            if (!Kernel.gl.getProgramParameter(this.program, Kernel.gl.LINK_STATUS)) {
	                console.error("Could not link program!");
	                Kernel.gl.deleteProgram(this.program);
	                Kernel.gl.deleteShader(vs);
	                Kernel.gl.deleteShader(fs);
	                this.program = null;
	                return;
	            }
	            this.updateActiveAttribInfos();
	            this.updateActiveUniformInfos();
	            this.ready = true;
	        };
	        Program.prototype._getShader = function (shaderType, shaderText) {
	            var shader = Kernel.gl.createShader(shaderType);
	            Kernel.gl.shaderSource(shader, shaderText);
	            Kernel.gl.compileShader(shader);
	            if (!Kernel.gl.getShaderParameter(shader, Kernel.gl.COMPILE_STATUS)) {
	                console.error("create shader failed", Kernel.gl.getShaderInfoLog(shader));
	                Kernel.gl.deleteShader(shader);
	                return null;
	            }
	            return shader;
	        };
	        Program.programs = [];
	        return Program;
	    }());
	    return Program;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel) {
	    "use strict";
	    var Graphic = (function () {
	        function Graphic(geometry, material) {
	            if (geometry === void 0) { geometry = null; }
	            if (material === void 0) { material = null; }
	            this.geometry = geometry;
	            this.material = material;
	            this.visible = true;
	            this.id = ++Kernel.idCounter;
	            this.parent = null;
	            this.program = this.createProgram();
	        }
	        Graphic.prototype.setVisible = function (visible) {
	            this.visible = visible;
	        };
	        Graphic.prototype.isReady = function () {
	            return !!(this.geometry && this.material && this.material.isReady());
	        };
	        Graphic.prototype.shouldDraw = function (camera) {
	            return this.visible && this.isReady();
	        };
	        Graphic.prototype.draw = function (camera) {
	            if (this.shouldDraw(camera)) {
	                this.program.use();
	                this.onDraw(camera);
	            }
	        };
	        Graphic.prototype.destroy = function () {
	            this.parent = null;
	            if (this.geometry) {
	                this.geometry.destroy();
	            }
	            if (this.material) {
	                this.material.destroy();
	            }
	            this.geometry = null;
	            this.material = null;
	        };
	        return Graphic;
	    }());
	    return Graphic;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Mesh) {
	    "use strict";
	    var TileGeometry = (function (_super) {
	        __extends(TileGeometry, _super);
	        function TileGeometry(vertices, triangles) {
	            _super.call(this);
	            this.vertices = vertices;
	            this.triangles = triangles;
	        }
	        return TileGeometry;
	    }(Mesh));
	    return TileGeometry;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(16), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Object3D, VertexBufferObject) {
	    "use strict";
	    var Mesh = (function (_super) {
	        __extends(Mesh, _super);
	        function Mesh() {
	            _super.apply(this, arguments);
	        }
	        Mesh.prototype.buildTriangles = function () {
	            this.vertices = [];
	            this.triangles = [];
	        };
	        Mesh.prototype.calculateVBO = function (force) {
	            if (force === void 0) { force = false; }
	            if (!this.vbo || force) {
	                var vboData = [], vertex;
	                for (var i = 0, length = this.vertices.length; i < length; i++) {
	                    vertex = this.vertices[i];
	                    vboData.push(vertex.p[0]);
	                    vboData.push(vertex.p[1]);
	                    vboData.push(vertex.p[2]);
	                }
	                if (!this.vbo) {
	                    this.vbo = new VertexBufferObject(Kernel.gl.ARRAY_BUFFER);
	                }
	                this.vbo.bind();
	                this.vbo.bufferData(vboData, Kernel.gl.STATIC_DRAW, true);
	            }
	            return this.vbo;
	        };
	        Mesh.prototype.calculateIBO = function (force) {
	            if (force === void 0) { force = false; }
	            if (!this.ibo || force) {
	                var iboData = [], triangle;
	                for (var i = 0, length = this.triangles.length; i < length; i++) {
	                    triangle = this.triangles[i];
	                    iboData.push(triangle.v1.i);
	                    iboData.push(triangle.v2.i);
	                    iboData.push(triangle.v3.i);
	                }
	                if (!this.ibo) {
	                    this.ibo = new VertexBufferObject(Kernel.gl.ELEMENT_ARRAY_BUFFER);
	                }
	                this.ibo.bind();
	                this.ibo.bufferData(iboData, Kernel.gl.STATIC_DRAW, true);
	            }
	            return this.ibo;
	        };
	        Mesh.prototype.calculateNBO = function (force) {
	            if (force === void 0) { force = false; }
	            if (!this.nbo || force) {
	                var nboData = [], vertex;
	                for (var i = 0, length = this.vertices.length; i < length; i++) {
	                    vertex = this.vertices[i];
	                    nboData.push(vertex.n[0]);
	                    nboData.push(vertex.n[1]);
	                    nboData.push(vertex.n[2]);
	                }
	                if (!this.nbo) {
	                    this.nbo = new VertexBufferObject(Kernel.gl.ARRAY_BUFFER);
	                }
	                this.nbo.bind();
	                this.nbo.bufferData(nboData, Kernel.gl.STATIC_DRAW, true);
	            }
	            return this.nbo;
	        };
	        Mesh.prototype.calculateUVBO = function (force) {
	            if (force === void 0) { force = false; }
	            if (!this.uvbo || force) {
	                var uvboData = [], vertex;
	                for (var i = 0, length = this.vertices.length; i < length; i++) {
	                    vertex = this.vertices[i];
	                    uvboData.push(vertex.uv[0]);
	                    uvboData.push(vertex.uv[1]);
	                }
	                if (!this.uvbo) {
	                    this.uvbo = new VertexBufferObject(Kernel.gl.ARRAY_BUFFER);
	                }
	                this.uvbo.bind();
	                this.uvbo.bufferData(uvboData, Kernel.gl.STATIC_DRAW, true);
	            }
	            return this.uvbo;
	        };
	        Mesh.prototype.calculateCBO = function (force) {
	            if (force === void 0) { force = false; }
	            if (!this.cbo || force) {
	                var cboData = [], vertex;
	                for (var i = 0, length = this.vertices.length; i < length; i++) {
	                    vertex = this.vertices[i];
	                    cboData.push(vertex.c[0]);
	                    cboData.push(vertex.c[1]);
	                    cboData.push(vertex.c[2]);
	                }
	                if (!this.cbo) {
	                    this.cbo = new VertexBufferObject(Kernel.gl.ARRAY_BUFFER);
	                }
	                this.cbo.bind();
	                this.cbo.bufferData(cboData, Kernel.gl.STATIC_DRAW, true);
	            }
	            return this.cbo;
	        };
	        Mesh.prototype.destroy = function () {
	            if (this.vbo) {
	                this.vbo.destroy();
	            }
	            if (this.ibo) {
	                this.ibo.destroy();
	            }
	            if (this.nbo) {
	                this.nbo.destroy();
	            }
	            if (this.cbo) {
	                this.cbo.destroy();
	            }
	            if (this.uvbo) {
	                this.uvbo.destroy();
	            }
	            this.vbo = null;
	            this.ibo = null;
	            this.nbo = null;
	            this.cbo = null;
	            this.uvbo = null;
	            this.vertices = [];
	            this.triangles = [];
	        };
	        return Mesh;
	    }(Object3D));
	    return Mesh;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel) {
	    "use strict";
	    var maxBufferSize = 200;
	    var buffers = [];
	    var VertexBufferObject = (function () {
	        function VertexBufferObject(target) {
	            this.target = target;
	            if (buffers.length > 0) {
	                this.buffer = buffers.pop();
	            }
	            else {
	                this.buffer = Kernel.gl.createBuffer();
	            }
	            this.buffer = Kernel.gl.createBuffer();
	        }
	        VertexBufferObject.prototype.bind = function () {
	            Kernel.gl.bindBuffer(this.target, this.buffer);
	        };
	        VertexBufferObject.prototype.bufferData = function (data, usage, hasBinded) {
	            if (hasBinded === void 0) { hasBinded = false; }
	            if (!hasBinded) {
	                this.bind();
	            }
	            var gl = Kernel.gl;
	            if (this.target === gl.ARRAY_BUFFER) {
	                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
	            }
	            else if (this.target === gl.ELEMENT_ARRAY_BUFFER) {
	                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), usage);
	            }
	        };
	        VertexBufferObject.prototype.destroy = function () {
	            if (this.buffer) {
	                if (buffers.length < maxBufferSize) {
	                    buffers.push(this.buffer);
	                }
	                else {
	                    Kernel.gl.deleteBuffer(this.buffer);
	                }
	                Kernel.gl.deleteBuffer(this.buffer);
	            }
	            this.buffer = null;
	        };
	        return VertexBufferObject;
	    }());
	    return VertexBufferObject;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var MeshVertice = (function () {
	        function MeshVertice(args) {
	            this.i = args.i;
	            this.p = args.p;
	            this.uv = args.uv;
	            this.n = args.n;
	            this.c = args.c;
	        }
	        return MeshVertice;
	    }());
	    return MeshVertice;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Triangle = (function () {
	        function Triangle(v1, v2, v3) {
	            this.v1 = v1;
	            this.v2 = v2;
	            this.v3 = v3;
	        }
	        Triangle.prototype.setColor = function (c) {
	            this.v1.c = this.v2.c = this.v3.c = c;
	        };
	        Triangle.assembleQuad = function (leftTop, leftBottom, rightTop, rightBottom) {
	            return [new Triangle(leftTop, leftBottom, rightTop), new Triangle(rightTop, leftBottom, rightBottom)];
	        };
	        return Triangle;
	    }());
	    return Triangle;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(21), __webpack_require__(14), __webpack_require__(4), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Extent, TileGrid_1, GraphicGroup, Tile) {
	    "use strict";
	    var SubTiledLayer = (function (_super) {
	        __extends(SubTiledLayer, _super);
	        function SubTiledLayer(level) {
	            _super.call(this);
	            this.level = level;
	        }
	        SubTiledLayer.prototype.getLevel = function () {
	            return this.level;
	        };
	        SubTiledLayer.prototype.showAllTiles = function () {
	            this.visible = true;
	            this.children.forEach(function (tile) {
	                tile.setVisible(true);
	            });
	        };
	        SubTiledLayer.prototype.hideAllTiles = function () {
	            this.visible = false;
	            this.children.forEach(function (tile) {
	                tile.setVisible(false);
	            });
	        };
	        SubTiledLayer.prototype.add = function (tile) {
	            if (tile.tileInfo.level === this.level) {
	                _super.prototype.add.call(this, tile);
	                tile.subTiledLayer = this;
	            }
	        };
	        SubTiledLayer.prototype.findTile = function (level, row, column) {
	            var length = this.children.length;
	            for (var i = 0; i < length; i++) {
	                var tile = this.children[i];
	                if (tile.tileInfo.level === level && tile.tileInfo.row === row && tile.tileInfo.column === column) {
	                    return tile;
	                }
	            }
	            return null;
	        };
	        SubTiledLayer.prototype.updateTiles = function (level, visibleTileGrids, addNew) {
	            this.level = level;
	            function checkTileExist(tileArray, lev, row, col) {
	                var result = {
	                    isExist: false,
	                    index: -1
	                };
	                for (var m = 0; m < tileArray.length; m++) {
	                    var tileInfo = tileArray[m];
	                    if (tileInfo.level === lev && tileInfo.row === row && tileInfo.column === col) {
	                        result.isExist = true;
	                        result.index = m;
	                        return result;
	                    }
	                }
	                return result;
	            }
	            var tilesNeedDelete = [];
	            var i, tile;
	            for (i = 0; i < this.children.length; i++) {
	                tile = this.children[i];
	                var checkResult = checkTileExist(visibleTileGrids, tile.tileInfo.level, tile.tileInfo.row, tile.tileInfo.column);
	                var isExist = checkResult.isExist;
	                if (isExist) {
	                    visibleTileGrids.splice(checkResult.index, 1);
	                }
	                else {
	                    tilesNeedDelete.push(tile);
	                }
	            }
	            while (tilesNeedDelete.length > 0) {
	                var b = this.remove(tilesNeedDelete[0]);
	                tilesNeedDelete.splice(0, 1);
	                if (!b) {
	                    console.debug("subTiledLayer.remove(tilesNeedDelete[0])失败");
	                }
	            }
	            if (addNew) {
	                for (i = 0; i < visibleTileGrids.length; i++) {
	                    var tileGridInfo = visibleTileGrids[i];
	                    var args = {
	                        level: tileGridInfo.level,
	                        row: tileGridInfo.row,
	                        column: tileGridInfo.column,
	                        url: ""
	                    };
	                    args.url = this.getTileUrl(args.level, args.row, args.column);
	                    tile = Tile.getInstance(args.level, args.row, args.column, args.url);
	                    this.add(tile);
	                }
	            }
	        };
	        SubTiledLayer.prototype.getTileUrl = function (level, row, column) {
	            if (this.parent && typeof this.parent.getTileUrl === "function") {
	                return this.parent.getTileUrl(level, row, column);
	            }
	            return "";
	        };
	        SubTiledLayer.prototype.checkIfAllTilesLoaded = function () {
	            for (var i = 0; i < this.children.length; i++) {
	                var tile = this.children[i];
	                if (tile) {
	                    var isTileLoaded = tile.material.isReady();
	                    if (!isTileLoaded) {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        };
	        SubTiledLayer.prototype.getExtent = function () {
	            return Extent.union(this.getExtents());
	        };
	        SubTiledLayer.prototype.getExtents = function () {
	            return this.children.map(function (item) { return item.getExtent(); });
	        };
	        SubTiledLayer.prototype.getVisibleTileGrids = function () {
	            var tileGrids = [];
	            if (this.visible) {
	                this.children.forEach(function (tile) {
	                    if (tile.visible) {
	                        tileGrids.push(new TileGrid_1.default(tile.tileInfo.level, tile.tileInfo.row, tile.tileInfo.column));
	                    }
	                });
	            }
	            return tileGrids;
	        };
	        SubTiledLayer.prototype.getShouldDrawTilesCount = function () {
	            return this.visible ? this.children.filter(function (tile) {
	                return tile.visible && tile.isReady();
	            }).length : 0;
	        };
	        return SubTiledLayer;
	    }(GraphicGroup));
	    return SubTiledLayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(22), __webpack_require__(34)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Tile, SubTiledLayer) {
	    "use strict";
	    var LabelLayer = (function (_super) {
	        __extends(LabelLayer, _super);
	        function LabelLayer() {
	            _super.call(this, -1);
	            this.minLevel = 4;
	        }
	        LabelLayer.prototype.onDraw = function (camera) {
	            var program = Tile.findProgram();
	            if (!program) {
	                return;
	            }
	            program.use();
	            var gl = Kernel.gl;
	            gl.enable(gl.BLEND);
	            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	            var pmvMatrix = camera.getProjViewMatrixForDraw();
	            var locPMVMatrix = program.getUniformLocation('uPMVMatrix');
	            gl.uniformMatrix4fv(locPMVMatrix, false, pmvMatrix.getFloat32Array());
	            gl.activeTexture(gl.TEXTURE0);
	            var locSampler = program.getUniformLocation('uSampler');
	            gl.uniform1i(locSampler, 0);
	            gl.depthFunc(gl.ALWAYS);
	            _super.prototype.onDraw.call(this, camera);
	            gl.depthFunc(gl.LEQUAL);
	            gl.disable(gl.BLEND);
	        };
	        LabelLayer.prototype.updateTiles = function (level, visibleTileGrids) {
	            var _this = this;
	            var validTileGrids = visibleTileGrids.filter(function (tileGrid) { return tileGrid.level >= _this.minLevel; });
	            _super.prototype.updateTiles.call(this, level, validTileGrids, true);
	        };
	        return LabelLayer;
	    }(SubTiledLayer));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = LabelLayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(20), __webpack_require__(35)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, TiledLayer, LabelLayer_1) {
	    "use strict";
	    var AutonaviTiledLayer = (function (_super) {
	        __extends(AutonaviTiledLayer, _super);
	        function AutonaviTiledLayer(style) {
	            if (style === void 0) { style = "Default"; }
	            _super.call(this, style);
	            this.idx = 1;
	        }
	        AutonaviTiledLayer.prototype.getTileUrl = function (level, row, column) {
	            if (this.idx === undefined) {
	                this.idx = 1;
	            }
	            var url = "";
	            if (this.style === 'Satellite') {
	                url = "//webst0" + this.idx + ".is.autonavi.com/appmaptile?style=6&x=" + column + "&y=" + row + "&z=" + level;
	            }
	            else {
	                url = "//webst0" + this.idx + ".is.autonavi.com/appmaptile?style=7&x=" + column + "&y=" + row + "&z=" + level;
	            }
	            this.idx++;
	            if (this.idx >= 5) {
	                this.idx = 1;
	            }
	            return url;
	        };
	        return AutonaviTiledLayer;
	    }(TiledLayer));
	    exports.AutonaviTiledLayer = AutonaviTiledLayer;
	    ;
	    var AutonaviLabelLayer = (function (_super) {
	        __extends(AutonaviLabelLayer, _super);
	        function AutonaviLabelLayer() {
	            _super.apply(this, arguments);
	            this.idx = 1;
	        }
	        AutonaviLabelLayer.prototype.getTileUrl = function (level, row, column) {
	            if (this.idx === undefined) {
	                this.idx = 1;
	            }
	            var url = "//webst0" + this.idx + ".is.autonavi.com/appmaptile?style=8&x=" + column + "&y=" + row + "&z=" + level;
	            this.idx++;
	            if (this.idx >= 5) {
	                this.idx = 1;
	            }
	            return url;
	        };
	        return AutonaviLabelLayer;
	    }(LabelLayer_1.default));
	    exports.AutonaviLabelLayer = AutonaviLabelLayer;
	    ;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(26), __webpack_require__(38), __webpack_require__(24), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, MeshGraphic, AtmosphereGeometry, MeshTextureMaterial, Vector) {
	    "use strict";
	    var Atmosphere = (function (_super) {
	        __extends(Atmosphere, _super);
	        function Atmosphere(geometry, material) {
	            _super.call(this, geometry, material);
	            this.geometry = geometry;
	            this.material = material;
	        }
	        Atmosphere.getInstance = function () {
	            var geometry = new AtmosphereGeometry();
	            var imageUrl = "/WebGlobe/src/world/images/atmosphere.png";
	            var material = new MeshTextureMaterial(imageUrl, false);
	            return new Atmosphere(geometry, material);
	        };
	        Atmosphere.prototype.shouldDraw = function (camera) {
	            return !camera.isEarthFullOverlapScreen() && _super.prototype.shouldDraw.call(this, camera);
	        };
	        Atmosphere.prototype.onDraw = function (camera) {
	            var gl = Kernel.gl;
	            gl.disable(gl.DEPTH_TEST);
	            gl.depthMask(false);
	            gl.enable(gl.BLEND);
	            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	            this.geometry.getMatrix().setUnitMatrix();
	            var R = Kernel.EARTH_RADIUS;
	            var distanceCamera2Origin = camera.getDistance2EarthOrigin();
	            var distanceCamera2EarthTangent = Math.sqrt(distanceCamera2Origin * distanceCamera2Origin - R * R);
	            var sinθ = distanceCamera2EarthTangent / distanceCamera2Origin;
	            var distanceCamera2Atmosphere = distanceCamera2EarthTangent * sinθ;
	            var vector = camera.getLightDirection().setLength(distanceCamera2Atmosphere);
	            var atmosphereNewPosition = Vector.verticePlusVector(camera.getPosition(), vector);
	            this.geometry.setPosition(atmosphereNewPosition);
	            this.geometry.setVectorX(camera.getVectorX());
	            this.geometry.setVectorY(camera.getVectorY());
	            this.geometry.setVectorZ(camera.getVectorZ());
	            this.geometry.localScale(sinθ, sinθ, sinθ);
	            _super.prototype.onDraw.call(this, camera);
	            gl.enable(gl.DEPTH_TEST);
	            gl.depthMask(true);
	            gl.disable(gl.BLEND);
	        };
	        return Atmosphere;
	    }(MeshGraphic));
	    return Atmosphere;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(32), __webpack_require__(33), __webpack_require__(30), __webpack_require__(10), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, MeshVertice, Triangle, Mesh, Vertice, Matrix) {
	    "use strict";
	    var Atmosphere = (function (_super) {
	        __extends(Atmosphere, _super);
	        function Atmosphere() {
	            _super.call(this);
	            this.segment = 360;
	            this.radius1 = Kernel.EARTH_RADIUS * 0.99;
	            this.radius2 = Kernel.EARTH_RADIUS * 1.01;
	            this.buildTriangles();
	        }
	        Atmosphere.prototype.buildTriangles = function () {
	            this.vertices = [];
	            this.triangles = [];
	            var mat1 = new Matrix();
	            mat1.setPosition(new Vertice(0, this.radius1, 0));
	            var meshVertices1 = [];
	            var mat2 = new Matrix();
	            mat2.setPosition(new Vertice(0, this.radius2, 0));
	            var meshVertices2 = [];
	            var deltaRadian = -Math.PI * 2 / this.segment;
	            var deltaS = 1.0 / this.segment;
	            var u = 0;
	            for (var i = 0; i <= this.segment; i++) {
	                u = deltaS * i;
	                if (u > 1) {
	                    u = 1;
	                }
	                meshVertices1.push(new MeshVertice({
	                    i: i,
	                    p: mat1.getPosition().getArray(),
	                    uv: [u, 1]
	                }));
	                meshVertices2.push(new MeshVertice({
	                    i: this.segment + 1 + i,
	                    p: mat2.getPosition().getArray(),
	                    uv: [u, 0]
	                }));
	                if (i > 0) {
	                    var vLeftTop = meshVertices2[i - 1];
	                    var vLeftBottom = meshVertices1[i - 1];
	                    var vRightTop = meshVertices2[i];
	                    var vRightBottom = meshVertices1[i];
	                    (_a = this.triangles).push.apply(_a, Triangle.assembleQuad(vLeftTop, vLeftBottom, vRightTop, vRightBottom));
	                }
	                mat1.worldRotateZ(deltaRadian);
	                mat2.worldRotateZ(deltaRadian);
	            }
	            (_b = this.vertices).push.apply(_b, meshVertices1.concat(meshVertices2));
	            var _a, _b;
	        };
	        return Atmosphere;
	    }(Mesh));
	    return Atmosphere;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5), __webpack_require__(11), __webpack_require__(27), __webpack_require__(28), __webpack_require__(40), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Kernel, Utils, MathUtils, Program, Graphic, PoiMaterial, VertexBufferObject) {
	    "use strict";
	    var Poi = (function () {
	        function Poi(x, y, z, uuid, name, address, phone) {
	            this.x = x;
	            this.y = y;
	            this.z = z;
	            this.uuid = uuid;
	            this.name = name;
	            this.address = address;
	            this.phone = phone;
	        }
	        return Poi;
	    }());
	    var vs = "\nattribute vec3 aPosition;\nuniform mat4 uPMVMatrix;\nuniform float uSize;\n\nvoid main(void) {\n  gl_Position = uPMVMatrix * vec4(aPosition, 1.0);\n  gl_PointSize = uSize;\n}\n";
	    var fs = "\nprecision mediump float;\nuniform sampler2D uSampler;\n\nvoid main()\n{\n\tvec4 color = texture2D(uSampler, vec2(gl_PointCoord.x, gl_PointCoord.y));\n    if(color.a == 0.0){\n        discard;\n    }\n    gl_FragColor = color;\n}\n";
	    var PoiLayer = (function (_super) {
	        __extends(PoiLayer, _super);
	        function PoiLayer(material) {
	            _super.call(this, null, material);
	            this.material = material;
	            this.keyword = null;
	            this.pois = null;
	            this.vbo = null;
	            this.pois = [];
	            this.vbo = new VertexBufferObject(Kernel.gl.ARRAY_BUFFER);
	        }
	        PoiLayer.getInstance = function () {
	            var url = "/WebGlobe/src/world/images/poi.png";
	            var material = new PoiMaterial(url, 24);
	            return new PoiLayer(material);
	        };
	        PoiLayer.prototype.createProgram = function () {
	            return Program.getProgram(vs, fs);
	        };
	        PoiLayer.prototype.isReady = function () {
	            return !!(this.pois.length > 0 && this.material && this.material.isReady());
	        };
	        PoiLayer.prototype.onDraw = function (camera) {
	            var gl = Kernel.gl;
	            gl.enable(gl.BLEND);
	            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	            var locPosition = this.program.getAttribLocation('aPosition');
	            this.program.enableVertexAttribArray('aPosition');
	            this.vbo.bind();
	            var vertices = [];
	            this.pois.map(function (poi) {
	                vertices.push(poi.x, poi.y, poi.z);
	            });
	            this.vbo.bufferData(vertices, gl.DYNAMIC_DRAW, true);
	            gl.vertexAttribPointer(locPosition, 3, gl.FLOAT, false, 0, 0);
	            var pmvMatrix = camera.getProjViewMatrixForDraw();
	            var locPMVMatrix = this.program.getUniformLocation('uPMVMatrix');
	            gl.uniformMatrix4fv(locPMVMatrix, false, pmvMatrix.getFloat32Array());
	            var locSize = this.program.getUniformLocation('uSize');
	            gl.uniform1f(locSize, this.material.size);
	            var locSampler = this.program.getUniformLocation('uSampler');
	            gl.activeTexture(gl.TEXTURE0);
	            gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
	            gl.uniform1i(locSampler, 0);
	            gl.drawArrays(gl.POINTS, 0, vertices.length / 3);
	            gl.disable(gl.BLEND);
	        };
	        PoiLayer.prototype.clear = function () {
	            this.keyword = null;
	            this.pois = [];
	        };
	        PoiLayer.prototype._addPoi = function (lon, lat, uuid, name, address, phone) {
	            var p = MathUtils.geographicToCartesianCoord(lon, lat, Kernel.EARTH_RADIUS + 0.001);
	            var poi = new Poi(p.x, p.y, p.z, uuid, name, address, phone);
	            this.pois.push(poi);
	            return poi;
	        };
	        PoiLayer.prototype.addPoi = function (lon, lat, uuid, name, address, phone) {
	            return this._addPoi(lon, lat, uuid, name, address, phone);
	        };
	        PoiLayer.search = function (wd, level, minLon, minLat, maxLon, maxLat, callback, pageCapacity, pageIndex) {
	            if (pageCapacity === void 0) { pageCapacity = 50; }
	            if (pageIndex === void 0) { pageIndex = 0; }
	            var url = "//apis.map.qq.com/jsapi?qt=syn&wd=" + wd + "&pn=" + pageIndex + "&rn=" + pageCapacity + "&output=jsonp&b=" + minLon + "," + minLat + "," + maxLon + "," + maxLat + "&l=" + level + "&c=000000";
	            Utils.jsonp(url, callback);
	        };
	        PoiLayer.prototype.search = function (keyword) {
	            var _this = this;
	            this.clear();
	            this.keyword = keyword;
	            var globe = Kernel.globe;
	            var level = globe.getLevel();
	            var extents = globe.getExtents(level);
	            extents.forEach(function (extent) {
	                PoiLayer.search(keyword, level, extent.getMinLon(), extent.getMinLat(), extent.getMaxLon(), extent.getMaxLat(), function (response) {
	                    console.log(keyword + " response:", response);
	                    var data = response.detail.pois || [];
	                    data.forEach(function (item) {
	                        var lon = parseFloat(item.pointx);
	                        var lat = parseFloat(item.pointy);
	                        _this._addPoi(lon, lat, item.uid, item.name, item.addr, item.phone);
	                    });
	                });
	            });
	        };
	        return PoiLayer;
	    }(Graphic));
	    return PoiLayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, MeshTextureMaterial) {
	    "use strict";
	    var PoiMaterial = (function (_super) {
	        __extends(PoiMaterial, _super);
	        function PoiMaterial(imageOrUrl, size) {
	            if (size === void 0) { size = 16; }
	            _super.call(this, imageOrUrl, false);
	            this.size = size;
	        }
	        return PoiMaterial;
	    }(MeshTextureMaterial));
	    return PoiMaterial;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);