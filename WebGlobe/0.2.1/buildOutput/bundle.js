var __extends = this && this.__extends || function(t, e) {
  function r() {
    this.constructor = t
  }
  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
  t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r)
};
define("world/Utils", ["require", "exports"], function(t, e) {
  "use strict";
  var r = {
    GREATER: "GREATER",
    GEQUAL: "GEQUAL",
    LESS: "LESS",
    LEQUAL: "LEQUAL",
    isBool: function(t) {
      return "boolean" == typeof t
    },
    isNumber: function(t) {
      return "number" == typeof t
    },
    isInteger: function(t) {
      var e = !1,
        r = this.isNumber(t);
      if (r) {
        var i = parseFloat(t),
          n = parseInt(t);
        e = i == n
      } else e = !1;
      return e
    },
    judgeNumberBoundary: function(t, e, r) {
      if (e != this.GREATER && e != this.GEQUAL && e != this.LESS && e != this.LEQUAL) throw "operator is invalid";
      var i;
      return e == this.GREATER ? i = t > r : e == this.GEQUAL ? i = t >= r : e == this.LESS ? i = t < r : e == this.LEQUAL && (i = t <= r), i
    },
    isPositive: function(t) {
      return this.judgeNumberBoundary(t, this.GREATER, 0)
    },
    isNegative: function(t) {
      return this.judgeNumberBoundary(t, this.LESS, 0)
    },
    isNonNegative: function(t) {
      return this.judgeNumberBoundary(t, this.GEQUAL, 0)
    },
    isNonPositive: function(t) {
      return this.judgeNumberBoundary(t, this.LEQUAL, 0)
    },
    isPositiveInteger: function(t) {
      return this.isPositive(t) && this.isInteger(t)
    },
    isNonNegativeInteger: function(t) {
      return this.isNonNegative(t) && this.isInteger
    },
    isString: function(t) {
      return "string" == typeof t
    },
    isArray: function(t) {
      return "[object Array]" === Object.prototype.toString.call(t)
    },
    isFunction: function(t) {
      return "function" == typeof t
    },
    isNull: function(t) {
      return null === t
    },
    isUndefined: function(t) {
      return "undefined" == typeof t
    },
    isNullOrUndefined: function(t) {
      return this.isNull(t) || this.isUndefined(t)
    },
    isJsonObject: function(t) {
      return "object" == typeof t && !this.isNull(t) && !this.isArray(t)
    },
    isDom: function(t) {
      return t instanceof HTMLElement
    },
    forEach: function(t, e) {
      if (this.isFunction(Array.prototype.forEach)) t.forEach(e);
      else
        for (var r = 0; r < t.length; r++) e(t[r], r, t)
    },
    filter: function(t, e) {
      var r = [];
      if (this.isFunction(Array.prototype.filter)) r = t.filter(e);
      else
        for (var i = 0; i < t.length; i++) e(t[i], i, t) && r.push(t[i]);
      return r
    },
    map: function(t, e) {
      var r = [];
      if (this.isFunction(Array.prototype.map)) r = t.map(e);
      else
        for (var i = 0; i < t.length; i++) r.push(e(t[i], i, t));
      return r
    },
    some: function(t, e) {
      if (this.isFunction(Array.prototype.some)) return t.some(e);
      for (var r = 0; r < t.length; r++)
        if (e(t[r], r, t)) return !0;
      return !1
    },
    every: function(t, e) {
      if (this.isFunction(Array.prototype.every)) return t.every(e);
      for (var r = 0; r < t.length; r++)
        if (!e(t[r], r, t)) return !1;
      return !0
    },
    filterRepeatArray: function(t) {
      for (var e = this.map(t, function(t) {
          return t
        }), r = []; e.length > 0;) {
        var i = e[0],
          n = this.some(r, function(t) {
            return i.equals(t)
          });
        n || r.push(i), e.splice(0, 1)
      }
      return r
    }
  };
  return r
}), define("world/math/Vertice", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t(t, e, r) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === r && (r = 0), this.x = t, this.y = e, this.z = r
    }
    return t.prototype.getArray = function() {
      return [this.x, this.y, this.z]
    }, t.prototype.clone = function() {
      return new t(this.x, this.y, this.z)
    }, t.prototype.getOpposite = function() {
      return new t((-this.x), (-this.y), (-this.z))
    }, t
  }();
  return r
}), define("world/math/Vector", ["require", "exports", "world/math/Vertice"], function(t, e, r) {
  "use strict";
  var i = function() {
    function t(t, e, r) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === r && (r = 0), this.x = t, this.y = e, this.z = r
    }
    return t.fromVertice = function(e) {
      return new t(e.x, e.y, e.z)
    }, t.verticeMinusVertice = function(e, r) {
      return new t(e.x - r.x, e.y - r.y, e.z - r.z)
    }, t.verticePlusVector = function(t, e) {
      return new r(t.x + e.x, t.y + e.y, t.z + e.z)
    }, t.getRadianOfTwoVectors = function(t, e) {
      var r = t.clone().normalize(),
        i = e.clone().normalize(),
        n = r.dot(i);
      n < -1 && (n = -1), n > 1 && (n = 1);
      var o = Math.acos(n);
      return o
    }, t.prototype.getVertice = function() {
      return new r(this.x, this.y, this.z)
    }, t.prototype.getArray = function() {
      return [this.x, this.y, this.z]
    }, t.prototype.clone = function() {
      return new t(this.x, this.y, this.z)
    }, t.prototype.getOpposite = function() {
      return new t((-this.x), (-this.y), (-this.z))
    }, t.prototype.getLength = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }, t.prototype.normalize = function() {
      var t = this.getLength();
      return Math.abs(t) >= 1e-6 ? (this.x /= t, this.y /= t, this.z /= t) : (this.x = 0, this.y = 0, this.z = 0), this
    }, t.prototype.setLength = function(t) {
      return this.normalize(), this.x *= t, this.y *= t, this.z *= t, this
    }, t.prototype.getRandomVerticalVector = function() {
      var e, r = this.getLength();
      if (0 === r) e = new t(0, 0, 0);
      else {
        var i, n, o;
        0 !== this.x ? (n = 1, o = 0, i = -this.y / this.x) : 0 !== this.y ? (o = 1, i = 0, n = -this.z / this.y) : 0 !== this.z && (i = 1, n = 0, o = -this.x / this.z), e = new t(i, n, o), e.normalize()
      }
      return e
    }, t.prototype.cross = function(e) {
      var r = this.y * e.z - this.z * e.y,
        i = this.z * e.x - this.x * e.z,
        n = this.x * e.y - this.y * e.x;
      return new t(r, i, n)
    }, t.prototype.dot = function(e) {
      if (!(e instanceof t)) throw "invalid other";
      return this.x * e.x + this.y * e.y + this.z * e.z
    }, t
  }();
  return i
}), define("world/math/Line", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t(t, e) {
      this.vertice = t.clone(), this.vector = e.clone(), this.vector.normalize()
    }
    return t.prototype.setVertice = function(t) {
      return this.vertice = t.clone(), this
    }, t.prototype.setVector = function(t) {
      return this.vector = t.clone(), this.vector.normalize(), this
    }, t.prototype.clone = function() {
      var e = new t(this.vertice, this.vector);
      return e
    }, t
  }();
  return r
}), define("world/math/Plan", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t(t, e, r, i) {
      this.A = t, this.B = e, this.C = r, this.D = i
    }
    return t.prototype.clone = function() {
      var e = new t(this.A, this.B, this.C, this.D);
      return e
    }, t
  }();
  return r
}), define("world/math/Math", ["require", "exports", "world/Kernel", "world/Utils", "world/math/Vertice", "world/math/Vector", "world/math/Line", "world/math/Plan"], function(t, e, r, i, n, o, s, a) {
  "use strict";
  var l = {
    ONE_RADIAN_EQUAL_DEGREE: 57.29577951308232,
    ONE_DEGREE_EQUAL_RADIAN: .017453292519943295,
    LEFT_TOP: "LEFT_TOP",
    RIGHT_TOP: "RIGHT_TOP",
    LEFT_BOTTOM: "LEFT_BOTTOM",
    RIGHT_BOTTOM: "RIGHT_BOTTOM",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    izZero: function(t) {
      if (!i.isNumber(t)) throw "invalid value";
      return Math.abs(t) < 1e-6
    },
    isPowerOfTwo: function(t) {
      return 0 === (t & t - 1) && 0 !== t
    },
    numerationSystemTo10: function(t, e) {
      for (var r = 0, i = 0; i < e.length; i++) {
        var n = e.length - 1 - i,
          o = parseInt(e[i]);
        r += o * Math.pow(t, n)
      }
      return r
    },
    numerationSystemFrom10: function(t, e) {
      var r = [],
        i = Math.floor(e / t),
        n = e % t;
      for (r.push(n); 0 != i;) e = i, i = Math.floor(e / t), n = e % t, r.push(n);
      r.reverse();
      var o = r.join("");
      return o
    },
    numerationSystemChange: function(t, e, r) {
      var i = this.numerationSystemTo10(t, r),
        n = this.numerationSystemFrom10(e, i);
      return n
    },
    getTriangleArea: function(t, e, r) {
      var i = t.clone(),
        n = e.clone(),
        a = r.clone(),
        l = o.verticeMinusVertice(a, n),
        h = new s(n, l),
        c = this.getLengthFromVerticeToLine(i, h),
        u = this.getLengthFromVerticeToVertice(n, a),
        v = .5 * u * c;
      return v
    },
    getLengthFromVerticeToVertice: function(t, e) {
      var r = t.clone(),
        i = e.clone(),
        n = Math.pow(r.x - i.x, 2) + Math.pow(r.y - i.y, 2) + Math.pow(r.z - i.z, 2),
        o = Math.sqrt(n);
      return o
    },
    getLengthFromVerticeToLine: function(t, e) {
      var r = t.clone(),
        i = e.clone(),
        n = r.x,
        o = r.y,
        s = r.z,
        a = i.vertice,
        l = a.x,
        h = a.y,
        c = a.z,
        u = i.vector;
      u.normalize();
      var v = u.x,
        f = u.y,
        p = u.z,
        d = (o - h) * p - f * (s - c),
        g = (s - c) * v - p * (n - l),
        m = (n - l) * f - v * (o - h);
      return Math.sqrt(d * d + g * g + m * m)
    },
    getLengthFromVerticeToPlan: function(t, e) {
      var r = t.clone(),
        i = e.clone(),
        n = r.x,
        o = r.y,
        s = r.z,
        a = i.A,
        l = i.B,
        h = i.C,
        c = i.D,
        u = Math.abs(a * n + l * o + h * s + c),
        v = Math.sqrt(a * a + l * l + h * h),
        f = u / v;
      return f
    },
    getVerticeVerticalIntersectPointWidthPlan: function(t, e) {
      var r = t.clone(),
        i = e.clone(),
        s = r.x,
        a = r.y,
        l = r.z,
        h = new o(i.A, i.B, i.C);
      h.normalize();
      var c = h.x,
        u = h.y,
        v = h.z,
        f = i.D * c / i.A,
        p = -(c * s + u * a + v * l + f),
        d = p * c + s,
        g = p * u + a,
        m = p * v + l,
        y = new n(d, g, m);
      return y
    },
    getIntersectPointByLineAdPlan: function(t, e) {
      var r = t.clone(),
        i = e.clone();
      r.vector.normalize();
      var o = i.A,
        s = i.B,
        a = i.C,
        l = i.D,
        h = r.vertice.x,
        c = r.vertice.y,
        u = r.vertice.z,
        v = r.vector.x,
        f = r.vector.y,
        p = r.vector.z,
        d = -(o * h + s * c + a * u + l) / (o * v + s * f + a * p),
        g = d * v + h,
        m = d * f + c,
        y = d * p + u,
        T = new n(g, m, y);
      return T
    },
    getLineIntersectPointWithEarth: function(t) {
      var e = [],
        i = t.clone(),
        o = i.vertice,
        s = i.vector;
      s.normalize();
      var a = r.EARTH_RADIUS,
        l = s.x,
        h = s.y,
        c = s.z,
        u = o.x,
        v = o.y,
        f = o.z,
        p = l * l,
        d = h * h,
        g = c * c,
        m = a * a,
        y = l * v,
        T = l * f,
        w = h * u,
        E = h * f,
        L = c * u,
        b = c * v,
        x = y * w + T * L + E * b,
        _ = y * y + T * T + w * w + E * E + L * L + b * b,
        M = p + d + g,
        R = 8 * x - 4 * _ + 4 * m * M;
      if (R < 0) e = [];
      else {
        var I = l * u + h * v + c * f,
          C = p + d + g;
        if (0 == R) {
          var A = -I / C,
            P = A * l + u,
            V = A * h + v,
            D = A * c + f,
            O = new n(P, V, D);
          e.push(O)
        } else if (R > 0) {
          var N = Math.sqrt(R),
            B = (-2 * I + N) / (2 * C),
            G = B * l + u,
            U = B * h + v,
            F = B * c + f,
            S = new n(G, U, F);
          e.push(S);
          var z = (-2 * I - N) / (2 * C),
            W = z * l + u,
            X = z * h + v,
            q = z * c + f,
            j = new n(W, X, q);
          e.push(j)
        }
      }
      return e
    },
    getCrossPlaneByLine: function(t, e) {
      var r = t.clone(),
        i = e.clone();
      i.normalize();
      var n = i.x,
        o = i.y,
        s = i.z,
        l = r.x,
        h = r.y,
        c = r.z,
        u = -(n * l + o * h + s * c),
        v = new a(n, o, s, u);
      return v
    },
    convertPointFromCanvasToNDC: function(t, e) {
      if (!i.isNumber(t)) throw "invalid canvasX";
      if (!i.isNumber(e)) throw "invalid canvasY";
      var n = 2 * t / r.canvas.width - 1,
        o = 1 - 2 * e / r.canvas.height;
      return [n, o]
    },
    convertPointFromNdcToCanvas: function(t, e) {
      if (!i.isNumber(t)) throw "invalid ndcX";
      if (!i.isNumber(e)) throw "invalid ndcY";
      var n = (1 + t) * r.canvas.width / 2,
        o = (1 - e) * r.canvas.height / 2;
      return [n, o]
    },
    getLengthFromCamera2EarthSurface: function(t) {
      return 7820683 / Math.pow(2, t)
    },
    geographicToCartesianCoord: function(t, e, i) {
      if (void 0 === i && (i = r.EARTH_RADIUS), !(t >= -180.001 && t <= 180.001)) throw "invalid lon";
      if (!(e >= -90.001 && e <= 90.001)) throw "invalid lat";
      var o = this.degreeToRadian(t),
        s = this.degreeToRadian(e),
        a = Math.sin(o),
        l = Math.cos(o),
        h = Math.sin(s),
        c = Math.cos(s),
        u = i * a * c,
        v = i * h,
        f = i * l * c;
      return new n(u, v, f)
    },
    cartesianCoordToGeographic: function(t) {
      var e = t.clone(),
        i = e.x,
        n = e.y,
        o = e.z,
        s = n / r.EARTH_RADIUS;
      s > 1 ? s = 2 : s < -1 && (s = -1);
      var a = Math.asin(s),
        l = Math.cos(a),
        h = i / (r.EARTH_RADIUS * l);
      h > 1 ? h = 1 : h < -1 && (h = -1);
      var c = o / (r.EARTH_RADIUS * l);
      c > 1 ? c = 1 : c < -1 && (c = -1);
      var u = Math.asin(h);
      u = h >= 0 ? c >= 0 ? u : Math.PI - u : c >= 0 ? u : -u - Math.PI;
      var v = this.radianToDegree(a),
        f = this.radianToDegree(u);
      return [f, v]
    },
    degreeToRadian: function(t) {
      return t * this.ONE_DEGREE_EQUAL_RADIAN
    },
    radianToDegree: function(t) {
      return t * this.ONE_RADIAN_EQUAL_DEGREE
    },
    webMercatorXToRadianLog: function(t) {
      return t / r.EARTH_RADIUS
    },
    webMercatorXToDegreeLog: function(t) {
      var e = this.webMercatorXToRadianLog(t);
      return this.radianToDegree(e)
    },
    webMercatorYToRadianLat: function(t) {
      if (!i.isNumber(t)) throw "invalid y";
      var e = t / r.EARTH_RADIUS,
        n = Math.pow(Math.E, e),
        o = Math.atan(n),
        s = 2 * o - Math.PI / 2;
      return s
    },
    webMercatorYToDegreeLat: function(t) {
      var e = this.webMercatorYToRadianLat(t);
      return this.radianToDegree(e)
    },
    webMercatorToRadianGeographic: function(t, e) {
      var r = this.webMercatorXToRadianLog(t),
        i = this.webMercatorYToRadianLat(e);
      return [r, i]
    },
    webMercatorToDegreeGeographic: function(t, e) {
      var r = this.webMercatorXToDegreeLog(t),
        i = this.webMercatorYToDegreeLat(e);
      return [r, i]
    },
    radianLogToWebMercatorX: function(t) {
      if (!(i.isNumber(t) && t <= Math.PI + .001 && t >= -(Math.PI + .001))) throw "invalid radianLog";
      return r.EARTH_RADIUS * t
    },
    degreeLogToWebMercatorX: function(t) {
      if (!(i.isNumber(t) && t <= 180.001 && t >= -180.001)) throw "invalid degreeLog";
      var e = this.degreeToRadian(t);
      return this.radianLogToWebMercatorX(e)
    },
    radianLatToWebMercatorY: function(t) {
      if (!(t <= Math.PI / 2 + .001 && t >= -(Math.PI / 2 + .001))) throw "invalid radianLat";
      var e = Math.PI / 4 + t / 2,
        i = Math.tan(e),
        n = Math.log(i),
        o = r.EARTH_RADIUS * n;
      return o
    },
    degreeLatToWebMercatorY: function(t) {
      if (!(t <= 90.001 && t >= -90.001)) throw "invalid degreeLat";
      var e = this.degreeToRadian(t);
      return this.radianLatToWebMercatorY(e)
    },
    radianGeographicToWebMercator: function(t, e) {
      var r = this.radianLogToWebMercatorX(t),
        i = this.radianLatToWebMercatorY(e);
      return [r, i]
    },
    degreeGeographicToWebMercator: function(t, e) {
      var r = this.degreeLogToWebMercatorX(t),
        i = this.degreeLatToWebMercatorY(e);
      return [r, i]
    },
    getTileWebMercatorEnvelopeByGrid: function(t, e, i) {
      var n = r.MAX_PROJECTED_COORD,
        o = 2 * n / Math.pow(2, t),
        s = -n + i * o,
        a = s + o,
        l = n - e * o,
        h = l - o,
        c = {
          minX: s,
          minY: h,
          maxX: a,
          maxY: l
        };
      return c
    },
    getTileGeographicEnvelopByGrid: function(t, e, r) {
      var i = this.getTileWebMercatorEnvelopeByGrid(t, e, r),
        n = this.webMercatorToDegreeGeographic(i.minX, i.minY),
        o = this.webMercatorToDegreeGeographic(i.maxX, i.maxY),
        s = {
          minLon: n[0],
          minLat: n[1],
          maxLon: o[0],
          maxLat: o[1]
        };
      return s
    },
    getTileCartesianEnvelopByGrid: function(t, e, r) {
      var i = this.getTileGeographicEnvelopByGrid(t, e, r),
        n = i.minLon,
        o = i.minLat,
        s = i.maxLon,
        a = i.maxLat,
        l = this.geographicToCartesianCoord(n, o),
        h = this.geographicToCartesianCoord(n, a),
        c = this.geographicToCartesianCoord(s, a),
        u = this.geographicToCartesianCoord(s, o),
        v = {
          pLeftBottom: l,
          pLeftTop: h,
          pRightTop: c,
          pRightBottom: u,
          minLon: n,
          minLat: o,
          maxLon: s,
          maxLat: a
        };
      return v
    },
    getGeographicTileCenter: function(t, e, r) {
      var i = this.getTileGeographicEnvelopByGrid(t, e, r),
        n = i.minLon,
        o = i.minLat,
        s = i.maxLon,
        a = i.maxLat,
        l = (n + s) / 2,
        h = (o + a) / 2,
        c = [l, h];
      return c
    },
    getCartesianTileCenter: function(t, e, r) {
      var i = this.getGeographicTileCenter(t, e, r),
        n = this.geographicToCartesianCoord(i[0], i[1]);
      return n
    },
    calculateNormals: function(t, e) {
      for (var r = 0, i = 1, n = 2, o = [], s = 0; s < t.length; s += 3) o[s + r] = 0, o[s + i] = 0, o[s + n] = 0;
      for (var s = 0; s < e.length; s += 3) {
        var a = [],
          l = [],
          h = [];
        a[r] = t[3 * e[s + 2] + r] - t[3 * e[s + 1] + r], a[i] = t[3 * e[s + 2] + i] - t[3 * e[s + 1] + i], a[n] = t[3 * e[s + 2] + n] - t[3 * e[s + 1] + n], l[r] = t[3 * e[s] + r] - t[3 * e[s + 1] + r], l[i] = t[3 * e[s] + i] - t[3 * e[s + 1] + i], l[n] = t[3 * e[s] + n] - t[3 * e[s + 1] + n], h[r] = a[i] * l[n] - a[n] * l[i], h[i] = a[n] * l[r] - a[r] * l[n], h[n] = a[r] * l[i] - a[i] * l[r];
        for (var c = 0; c < 3; c++) o[3 * e[s + c] + r] = o[3 * e[s + c] + r] + h[r], o[3 * e[s + c] + i] = o[3 * e[s + c] + i] + h[i], o[3 * e[s + c] + n] = o[3 * e[s + c] + n] + h[n]
      }
      for (var s = 0; s < t.length; s += 3) {
        var u = [];
        u[r] = o[s + r], u[i] = o[s + i], u[n] = o[s + n];
        var v = Math.sqrt(u[r] * u[r] + u[i] * u[i] + u[n] * u[n]);
        0 == v && (v = 1), u[r] = u[r] / v, u[i] = u[i] / v, u[n] = u[n] / v, o[s + r] = u[r], o[s + i] = u[i], o[s + n] = u[n]
      }
      return o
    }
  };
  return l
}), define("world/TileGrid", ["require", "exports", "world/Kernel", "world/math/Math"], function(t, e, r, i) {
  "use strict";
  var n = function() {
    function t(t, e, r) {
      this.level = t, this.row = e, this.column = r
    }
    return t.prototype.equals = function(t) {
      return t && this.level === t.level && this.row === t.row && this.column === t.column
    }, t.prototype.getLeft = function() {
      return t.getTileGridByBrother(this.level, this.row, this.column, i.LEFT)
    }, t.prototype.getRight = function() {
      return t.getTileGridByBrother(this.level, this.row, this.column, i.RIGHT)
    }, t.prototype.getTop = function() {
      return t.getTileGridByBrother(this.level, this.row, this.column, i.TOP)
    }, t.prototype.getBottom = function() {
      return t.getTileGridByBrother(this.level, this.row, this.column, i.BOTTOM)
    }, t.prototype.getParent = function() {
      return t.getTileGridAncestor(this.level - 1, this.level, this.row, this.column)
    }, t.prototype.getAncestor = function(e) {
      return t.getTileGridAncestor(e, this.level, this.row, this.column)
    }, t.getTileGridByParent = function(e, r, i, n) {
      var o = e + 1,
        s = -1,
        a = -1;
      if (n == t.LEFT_TOP) s = 2 * r, a = 2 * i;
      else if (n == t.RIGHT_TOP) s = 2 * r, a = 2 * i + 1;
      else if (n == t.LEFT_BOTTOM) s = 2 * r + 1, a = 2 * i;
      else {
        if (n != t.RIGHT_BOTTOM) throw "invalid position";
        s = 2 * r + 1, a = 2 * i + 1
      }
      return new t(o, s, a)
    }, t.getTilePositionOfParent = function(t, e, r, i) {
      var n = "UNKNOWN";
      i = i || this.getTileGridAncestor(t - 1, t, e, r);
      var o = this.getTileGridByParent(i.level, i.row, i.column, this.LEFT_TOP);
      return o.row == e ? o.column == r ? n = this.LEFT_TOP : o.column + 1 == r && (n = this.RIGHT_TOP) : o.row + 1 == e && (o.column == r ? n = this.LEFT_BOTTOM : o.column + 1 == r && (n = this.RIGHT_BOTTOM)), n
    }, t.getTileGridByBrother = function(e, r, i, n, o) {
      o = o || {};
      var s = new t(e, r, i);
      if (n === t.LEFT)
        if (0 == i) {
          var a = o.maxSize || Math.pow(2, e);
          s.column = a - 1
        } else s.column = i - 1;
      else if (n == t.RIGHT) {
        var a = o.maxSize || Math.pow(2, e);
        i == a - 1 ? s.column = 0 : s.column = i + 1
      } else if (n == t.TOP)
        if (0 == r) {
          var a = o.maxSize || Math.pow(2, e);
          s.row = a - 1
        } else s.row = r - 1;
      else {
        if (n != t.BOTTOM) throw "invalid position";
        var a = o.maxSize || Math.pow(2, e);
        r == a - 1 ? s.row = 0 : s.row = r + 1
      }
      return s
    }, t.getTileGridAncestor = function(e, r, i, n) {
      var o = null;
      if (e < r) {
        var s = r - e,
          a = Math.pow(2, s),
          l = Math.floor(i / a),
          h = Math.floor(n / a);
        o = new t(e, l, h)
      } else e == r && (o = new t(r, i, n));
      return o
    }, t.getTileGridByGeo = function(e, n, o) {
      if (!(e >= -180 && e <= 180)) throw "invalid lon";
      if (!(n >= -90 && n <= 90)) throw "invalid lat";
      var s = i.degreeGeographicToWebMercator(e, n),
        a = s[0],
        l = s[1],
        h = a + r.MAX_PROJECTED_COORD,
        c = r.MAX_PROJECTED_COORD - l,
        u = r.MAX_PROJECTED_COORD / Math.pow(2, o - 1),
        v = Math.floor(c / u),
        f = Math.floor(h / u);
      return new t(o, v, f)
    }, t.LEFT_TOP = "LEFT_TOP", t.RIGHT_TOP = "RIGHT_TOP", t.LEFT_BOTTOM = "LEFT_BOTTOM", t.RIGHT_BOTTOM = "RIGHT_BOTTOM", t.LEFT = "LEFT", t.RIGHT = "RIGHT", t.TOP = "TOP", t.BOTTOM = "BOTTOM", t
  }();
  return n
}), define("world/math/Matrix", ["require", "exports", "world/math/Vertice", "world/math/Vector"], function(t, e, r, i) {
  "use strict";
  var n = function() {
    function t(t, e, r, i, n, o, s, a, l, h, c, u, v, f, p, d) {
      void 0 === t && (t = 1), void 0 === e && (e = 0), void 0 === r && (r = 0), void 0 === i && (i = 0), void 0 === n && (n = 0), void 0 === o && (o = 1), void 0 === s && (s = 0), void 0 === a && (a = 0), void 0 === l && (l = 0), void 0 === h && (h = 0), void 0 === c && (c = 1), void 0 === u && (u = 0), void 0 === v && (v = 0), void 0 === f && (f = 0), void 0 === p && (p = 0), void 0 === d && (d = 1), this.elements = new Float32Array(16), this.setElements(t, e, r, i, n, o, s, a, l, h, c, u, v, f, p, d)
    }
    return t.prototype.setElements = function(t, e, r, i, n, o, s, a, l, h, c, u, v, f, p, d) {
      var g = arguments.length;
      if (g < 16) throw "invalid arguments:arguments length error";
      var m = this.elements;
      return m[0] = t, m[4] = e, m[8] = r, m[12] = i, m[1] = n, m[5] = o, m[9] = s, m[13] = a, m[2] = l, m[6] = h, m[10] = c, m[14] = u, m[3] = v, m[7] = f, m[11] = p, m[15] = d, this
    }, t.prototype.setColumnX = function(t, e, r) {
      this.elements[0] = t, this.elements[1] = e, this.elements[2] = r
    }, t.prototype.getColumnX = function() {
      return new i(this.elements[0], this.elements[1], this.elements[2])
    }, t.prototype.setColumnY = function(t, e, r) {
      this.elements[4] = t, this.elements[5] = e, this.elements[6] = r
    }, t.prototype.getColumnY = function() {
      return new i(this.elements[4], this.elements[5], this.elements[6])
    }, t.prototype.setColumnZ = function(t, e, r) {
      this.elements[8] = t, this.elements[9] = e, this.elements[10] = r
    }, t.prototype.getColumnZ = function() {
      return new i(this.elements[8], this.elements[9], this.elements[10])
    }, t.prototype.setColumnTrans = function(t, e, r) {
      this.elements[12] = t, this.elements[13] = e, this.elements[14] = r
    }, t.prototype.getColumnTrans = function() {
      return new r(this.elements[12], this.elements[13], this.elements[14])
    }, t.prototype.setLastRowDefault = function() {
      this.elements[3] = 0, this.elements[7] = 0, this.elements[11] = 0, this.elements[15] = 1
    }, t.prototype.transpose = function() {
      var t = this.getTransposeMatrix();
      this.setMatrixByOther(t)
    }, t.prototype.getTransposeMatrix = function() {
      var e = new t;
      return e.elements[0] = this.elements[0], e.elements[4] = this.elements[1], e.elements[8] = this.elements[2], e.elements[12] = this.elements[3], e.elements[1] = this.elements[4], e.elements[5] = this.elements[5], e.elements[9] = this.elements[6], e.elements[13] = this.elements[7], e.elements[2] = this.elements[8], e.elements[6] = this.elements[9], e.elements[10] = this.elements[10], e.elements[14] = this.elements[11], e.elements[3] = this.elements[12], e.elements[7] = this.elements[13], e.elements[11] = this.elements[14], e.elements[15] = this.elements[15], e
    }, t.prototype.inverse = function() {
      var t = this.getInverseMatrix();
      this.setMatrixByOther(t)
    }, t.prototype.getInverseMatrix = function() {
      var e = this.elements,
        r = new t,
        i = r.elements,
        n = e[0],
        o = e[1],
        s = e[2],
        a = e[3],
        l = e[4],
        h = e[5],
        c = e[6],
        u = e[7],
        v = e[8],
        f = e[9],
        p = e[10],
        d = e[11],
        g = e[12],
        m = e[13],
        y = e[14],
        T = e[15],
        w = n * h - o * l,
        E = n * c - s * l,
        L = n * u - a * l,
        b = o * c - s * h,
        x = o * u - a * h,
        _ = s * u - a * c,
        M = v * m - f * g,
        R = v * y - p * g,
        I = v * T - d * g,
        C = f * y - p * m,
        A = f * T - d * m,
        P = p * T - d * y,
        V = w * P - E * A + L * C + b * I - x * R + _ * M;
      return V ? (V = 1 / V, i[0] = (h * P - c * A + u * C) * V, i[1] = (-o * P + s * A - a * C) * V, i[2] = (m * _ - y * x + T * b) * V, i[3] = (-f * _ + p * x - d * b) * V, i[4] = (-l * P + c * I - u * R) * V, i[5] = (n * P - s * I + a * R) * V, i[6] = (-g * _ + y * L - T * E) * V, i[7] = (v * _ - p * L + d * E) * V, i[8] = (l * A - h * I + u * M) * V, i[9] = (-n * A + o * I - a * M) * V, i[10] = (g * x - m * L + T * w) * V, i[11] = (-v * x + f * L - d * w) * V, i[12] = (-l * C + h * R - c * M) * V, i[13] = (n * C - o * R + s * M) * V, i[14] = (-g * b + m * E - y * w) * V, i[15] = (v * b - f * E + p * w) * V, r) : (console.log("can't get inverse matrix"), null)
    }, t.prototype.setMatrixByOther = function(e) {
      if (!(e instanceof t)) throw "invalid otherMatrix";
      for (var r = 0; r < e.elements.length; r++) this.elements[r] = e.elements[r]
    }, t.prototype.setUnitMatrix = function() {
      this.setElements(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }, t.prototype.isUnitMatrix = function() {
      for (var t = this.elements, e = 0; e < t.length; e++)
        if (e % 4 === 0) {
          if (1 != t[e]) return !1
        } else if (0 !== t[e]) return !1;
      return !0
    }, t.prototype.clone = function() {
      return new t(this.elements[0], this.elements[4], this.elements[8], this.elements[12], this.elements[1], this.elements[5], this.elements[9], this.elements[13], this.elements[2], this.elements[6], this.elements[10], this.elements[14], this.elements[3], this.elements[7], this.elements[11], this.elements[15])
    }, t.prototype.multiplyMatrix = function(e) {
      var r = this.elements,
        i = e.elements,
        n = r[0] * i[0] + r[4] * i[1] + r[8] * i[2] + r[12] * i[3],
        o = r[0] * i[4] + r[4] * i[5] + r[8] * i[6] + r[12] * i[7],
        s = r[0] * i[8] + r[4] * i[9] + r[8] * i[10] + r[12] * i[11],
        a = r[0] * i[12] + r[4] * i[13] + r[8] * i[14] + r[12] * i[15],
        l = r[1] * i[0] + r[5] * i[1] + r[9] * i[2] + r[13] * i[3],
        h = r[1] * i[4] + r[5] * i[5] + r[9] * i[6] + r[13] * i[7],
        c = r[1] * i[8] + r[5] * i[9] + r[9] * i[10] + r[13] * i[11],
        u = r[1] * i[12] + r[5] * i[13] + r[9] * i[14] + r[13] * i[15],
        v = r[2] * i[0] + r[6] * i[1] + r[10] * i[2] + r[14] * i[3],
        f = r[2] * i[4] + r[6] * i[5] + r[10] * i[6] + r[14] * i[7],
        p = r[2] * i[8] + r[6] * i[9] + r[10] * i[10] + r[14] * i[11],
        d = r[2] * i[12] + r[6] * i[13] + r[10] * i[14] + r[14] * i[15],
        g = r[3] * i[0] + r[7] * i[1] + r[11] * i[2] + r[15] * i[3],
        m = r[3] * i[4] + r[7] * i[5] + r[11] * i[6] + r[15] * i[7],
        y = r[3] * i[8] + r[7] * i[9] + r[11] * i[10] + r[15] * i[11],
        T = r[3] * i[12] + r[7] * i[13] + r[11] * i[14] + r[15] * i[15];
      return new t(n, o, s, a, l, h, c, u, v, f, p, d, g, m, y, T)
    }, t.prototype.multiplyColumn = function(t) {
      var e = 4 == t.length;
      if (!e) throw "invalid c";
      var r = this.elements,
        i = t,
        n = r[0] * i[0] + r[4] * i[1] + r[8] * i[2] + r[12] * i[3],
        o = r[1] * i[0] + r[5] * i[1] + r[9] * i[2] + r[13] * i[3],
        s = r[2] * i[0] + r[6] * i[1] + r[10] * i[2] + r[14] * i[3],
        a = r[3] * i[0] + r[7] * i[1] + r[11] * i[2] + r[15] * i[3];
      return [n, o, s, a]
    }, t.prototype.hasNaN = function() {
      return this.elements.some(function(t) {
        return isNaN(t)
      })
    }, t.prototype.divide = function(t) {
      if (0 === t) throw "invalid a:a is 0";
      if (0 !== t)
        for (var e = 0, r = this.elements.length; e < r; e++) this.elements[e] /= t
    }, t.prototype.getPosition = function() {
      return this.getColumnTrans()
    }, t.prototype.worldTranslate = function(t, e, r) {
      this.elements[12] += t, this.elements[13] += e, this.elements[14] += r
    }, t.prototype.localTranslate = function(t, e, r) {
      var i = [t, e, r, 1],
        n = this.multiplyColumn(i),
        o = this.getPosition();
      this.worldTranslate(n[0] - o.x, n[1] - o.y, n[2] - o.z)
    }, t.prototype.worldScale = function(e, r, i) {
      e = void 0 !== e ? e : 1, r = void 0 !== r ? r : 1, i = void 0 !== i ? i : 1;
      var n = new t(e, 0, 0, 0, 0, r, 0, 0, 0, 0, i, 0, 0, 0, 0, 1),
        o = n.multiplyMatrix(this);
      this.setMatrixByOther(o)
    }, t.prototype.localScale = function(t, e, r) {
      var i = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0), this.worldScale(t, e, r), this.setColumnTrans(i.x, i.y, i.z)
    }, t.prototype.worldRotateX = function(e) {
      var r = Math.cos(e),
        i = Math.sin(e),
        n = new t(1, 0, 0, 0, 0, r, (-i), 0, 0, i, r, 0, 0, 0, 0, 1),
        o = n.multiplyMatrix(this);
      this.setMatrixByOther(o)
    }, t.prototype.worldRotateY = function(e) {
      var r = Math.cos(e),
        i = Math.sin(e),
        n = new t(r, 0, i, 0, 0, 1, 0, 0, (-i), 0, r, 0, 0, 0, 0, 1),
        o = n.multiplyMatrix(this);
      this.setMatrixByOther(o)
    }, t.prototype.worldRotateZ = function(e) {
      var r = Math.cos(e),
        i = Math.sin(e),
        n = new t(r, (-i), 0, 0, i, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1),
        o = n.multiplyMatrix(this);
      this.setMatrixByOther(o)
    }, t.prototype.worldRotateByVector = function(e, r) {
      var i, n, o, s, a, l, h, c, u, v, f, p, d, g = r.x,
        m = r.y,
        y = r.z;
      n = Math.sin(e), o = Math.cos(e), i = Math.sqrt(g * g + m * m + y * y), g /= i, m /= i, y /= i, s = g * g, a = m * m, l = y * y, h = g * m, c = m * y, u = y * g, v = g * n, f = m * n, p = y * n, d = 1 - o;
      var T = d * s + o,
        w = d * h - p,
        E = d * u + f,
        L = 0,
        b = d * h + p,
        x = d * a + o,
        _ = d * c - v,
        M = 0,
        R = d * u - f,
        I = d * c + v,
        C = d * l + o,
        A = 0,
        P = 0,
        V = 0,
        D = 0,
        O = 1,
        N = new t(T, w, E, L, b, x, _, M, R, I, C, A, P, V, D, O),
        B = N.multiplyMatrix(this);
      this.setMatrixByOther(B)
    }, t.prototype.localRotateX = function(t) {
      var e = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      var r = this.getColumnX();
      this.worldRotateByVector(t, r), this.setColumnTrans(e.x, e.y, e.z)
    }, t.prototype.localRotateY = function(t) {
      var e = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      var r = this.getColumnY();
      this.worldRotateByVector(t, r), this.setColumnTrans(e.x, e.y, e.z)
    }, t.prototype.localRotateZ = function(t) {
      var e = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0);
      var r = this.getColumnZ();
      this.worldRotateByVector(t, r), this.setColumnTrans(e.x, e.y, e.z)
    }, t.prototype.localRotateByVector = function(t, e) {
      var r = e.getArray();
      r.push(1);
      var n = this.multiplyColumn(r),
        o = new i(n[0], n[1], n[2]),
        s = this.getColumnTrans();
      this.setColumnTrans(0, 0, 0), this.worldRotateByVector(t, o), this.setColumnTrans(s.x, s.y, s.z)
    }, t
  }();
  return n
}), define("world/Object3D", ["require", "exports", "world/math/Matrix"], function(t, e, r) {
  "use strict";
  var i = function() {
    function t() {
      this.matrix = new r
    }
    return t.prototype.getPosition = function() {
      var t = this.matrix.getPosition();
      return t
    }, t.prototype.setPosition = function(t, e, r) {
      this.matrix.setColumnTrans(t, e, r)
    }, t.prototype.worldTranslate = function(t, e, r) {
      this.matrix.worldTranslate(t, e, r)
    }, t.prototype.localTranslate = function(t, e, r) {
      this.matrix.localTranslate(t, e, r)
    }, t.prototype.worldScale = function(t, e, r) {
      this.matrix.worldScale(t, e, r)
    }, t.prototype.localScale = function(t, e, r) {
      this.matrix.localScale(t, e, r)
    }, t.prototype.worldRotateX = function(t) {
      this.matrix.worldRotateX(t)
    }, t.prototype.worldRotateY = function(t) {
      this.matrix.worldRotateY(t)
    }, t.prototype.worldRotateZ = function(t) {
      this.matrix.worldRotateZ(t)
    }, t.prototype.worldRotateByVector = function(t, e) {
      this.matrix.worldRotateByVector(t, e)
    }, t.prototype.localRotateX = function(t) {
      this.matrix.localRotateX(t)
    }, t.prototype.localRotateY = function(t) {
      this.matrix.localRotateY(t)
    }, t.prototype.localRotateZ = function(t) {
      this.matrix.localRotateZ(t)
    }, t.prototype.localRotateByVector = function(t, e) {
      this.matrix.localRotateByVector(t, e)
    }, t.prototype.getXAxisDirection = function() {
      var t = this.matrix.getColumnX();
      return t.normalize(), t
    }, t.prototype.getYAxisDirection = function() {
      var t = this.matrix.getColumnY();
      return t.normalize(), t
    }, t.prototype.getZAxisDirection = function() {
      var t = this.matrix.getColumnZ();
      return t.normalize(), t
    }, t
  }();
  return i
}), define("world/PerspectiveCamera", ["require", "exports", "world/Kernel", "world/Utils", "world/math/Math", "world/math/Vertice", "world/math/Vector", "world/math/Line", "world/TileGrid", "world/math/Matrix", "world/Object3D"], function(t, e, r, i, n, o, s, a, l, h, c) {
  "use strict";
  var u = function(t) {
    function e(e, r, i, n) {
      void 0 === e && (e = 90), void 0 === r && (r = 1), void 0 === i && (i = 1), void 0 === n && (n = 1), t.call(this), this.fov = e, this.aspect = r, this.near = i, this.far = n, this.animationDuration = 600, this.Enum = {
        EARTH_FULL_OVERSPREAD_SCREEN: "EARTH_FULL_OVERSPREAD_SCREEN",
        EARTH_NOT_FULL_OVERSPREAD_SCREEN: "EARTH_NOT_FULL_OVERSPREAD_SCREEN"
      }, this.animating = !1, this.pitch = 90, this.projMatrix = new h, this.setPerspectiveMatrix(this.fov, this.aspect, this.near, this.far)
    }
    return __extends(e, t), e.prototype.setPerspectiveMatrix = function(t, e, r, i) {
      void 0 === t && (t = 90), void 0 === e && (e = 1), void 0 === r && (r = 1), void 0 === i && (i = 1), this.fov = t, this.aspect = e, this.near = r, this.far = i;
      var n = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        o = this.fov * Math.PI / 180 / 2,
        s = 1 / Math.tan(o),
        a = this.far - this.near;
      n[0] = s / this.aspect, n[5] = s, n[10] = -(this.far + this.near) / a, n[11] = -1, n[14] = -2 * this.near * this.far / a, n[15] = 0, this.projMatrix.setElements(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7], n[8], n[9], n[10], n[11], n[12], n[13], n[14], n[15])
    }, e.prototype.getLightDirection = function() {
      var t = this.matrix.getColumnZ(),
        e = new s((-t.x), (-t.y), (-t.z));
      return e.normalize(), e
    }, e.prototype.getProjViewMatrix = function() {
      var t = this.getViewMatrix(),
        e = this.projMatrix.multiplyMatrix(t);
      return e
    }, e.prototype.setFov = function(t) {
      if (!(t > 0)) throw "invalid fov:" + t;
      this.setPerspectiveMatrix(t, this.aspect, this.near, this.far)
    }, e.prototype.setAspect = function(t) {
      if (!(t > 0)) throw "invalid aspect:" + t;
      this.setPerspectiveMatrix(this.fov, t, this.near, this.far)
    }, e.prototype.setNear = function(t) {
      if (!(t > 0)) throw "invalid near:" + t;
      this.setPerspectiveMatrix(this.fov, this.aspect, t, this.far)
    }, e.prototype.setFar = function(t) {
      if (!(t > 0)) throw "invalid far:" + t;
      this.setPerspectiveMatrix(this.fov, this.aspect, this.near, t)
    }, e.prototype.getViewMatrix = function() {
      return this.matrix.getInverseMatrix()
    }, e.prototype.look = function(t, e, r) {
      void 0 === r && (r = new s(0, 1, 0));
      var i = t.clone(),
        n = e.clone(),
        o = r.clone(),
        a = i.x,
        l = i.y,
        h = i.z,
        c = new s(i.x - n.x, i.y - n.y, i.z - n.z).normalize(),
        u = o.cross(c).normalize(),
        v = c.cross(u).normalize();
      this.matrix.setColumnX(u.x, u.y, u.z), this.matrix.setColumnY(v.x, v.y, v.z), this.matrix.setColumnZ(c.x, c.y, c.z), this.matrix.setColumnTrans(a, l, h), this.matrix.setLastRowDefault();
      var f = i.x - n.x,
        p = i.y - n.y,
        d = i.z - n.z,
        g = Math.sqrt(f * f + p * p + d * d);
      this.setFar(g)
    }, e.prototype.lookAt = function(t, e) {
      var r = t.clone(),
        i = this.getPosition();
      this.look(i, r, e)
    }, e.prototype.convertVerticeFromWorldToNDC = function(t, e) {
      e instanceof h || (e = this.getProjViewMatrix());
      var r = [t.x, t.y, t.z, 1],
        i = e.multiplyColumn(r),
        n = i[3],
        s = [];
      s[0] = i[0] / n, s[1] = i[1] / n, s[2] = i[2] / n, s[3] = 1;
      var a = new o(s[0], s[1], s[2]);
      return a
    }, e.prototype.convertVerticeFromNdcToWorld = function(t) {
      var e = [t.x, t.y, t.z, 1],
        r = this.projMatrix.getInverseMatrix(),
        i = r.multiplyColumn(e),
        n = i[0] / i[3],
        s = i[1] / i[3],
        a = i[2] / i[3],
        l = 1,
        h = [n, s, a, l],
        c = this.getViewMatrix(),
        u = c.getInverseMatrix(),
        v = u.multiplyColumn(h),
        f = new o(v[0], v[1], v[2]);
      return f
    }, e.prototype.convertVerticeFromCameraToWorld = function(t, e) {
      e instanceof h || (e = this.getViewMatrix());
      var r = t.clone(),
        i = e.getInverseMatrix(),
        n = [r.x, r.y, r.z, 1],
        s = i.multiplyColumn(n),
        a = new o(s[0], s[1], s[2]);
      return a
    }, e.prototype.convertVectorFromCameraToWorld = function(t, e) {
      if (!(t instanceof s)) throw "invalid vectorInCamera: not Vector";
      e instanceof h || (e = this.getViewMatrix());
      var r = t.clone(),
        i = r.getVertice(),
        n = this.convertVerticeFromCameraToWorld(i, e),
        o = this.getPosition(),
        a = s.verticeMinusVertice(n, o);
      return a.normalize(), a
    }, e.prototype.getPickDirectionByCanvas = function(t, e) {
      var r = n.convertPointFromCanvasToNDC(t, e),
        i = this.getPickDirectionByNDC(r[0], r[1]);
      return i
    }, e.prototype.getDirectionIntersectPointWithEarth = function() {
      var t = this.getLightDirection(),
        e = this.getPosition(),
        r = new a(e, t),
        i = this.getPickCartesianCoordInEarthByLine(r);
      return i
    }, e.prototype.getPickDirectionByNDC = function(t, e) {
      var r = new o(t, e, .499),
        i = this.convertVerticeFromNdcToWorld(r),
        n = this.getPosition(),
        a = s.verticeMinusVertice(i, n);
      return a.normalize(), a
    }, e.prototype.getPickCartesianCoordInEarthByLine = function(t) {
      var e = [],
        r = n.getLineIntersectPointWithEarth(t);
      if (0 === r.length) e = [];
      else if (1 == r.length) e = r;
      else if (2 == r.length) {
        var i = r[0],
          o = r[1],
          s = this.getPosition(),
          a = n.getLengthFromVerticeToVertice(s, i),
          l = n.getLengthFromVerticeToVertice(s, o);
        e = a <= l ? [i, o] : [o, i]
      }
      return e
    }, e.prototype.getPickCartesianCoordInEarthByCanvas = function(t, e) {
      var r = this.getPickDirectionByCanvas(t, e),
        i = this.getPosition(),
        n = new a(i, r),
        o = this.getPickCartesianCoordInEarthByLine(n);
      return o
    }, e.prototype.getPickCartesianCoordInEarthByNDC = function(t, e) {
      var r = this.getPickDirectionByNDC(t, e),
        i = this.getPosition(),
        n = new a(i, r),
        o = this.getPickCartesianCoordInEarthByLine(n);
      return o
    }, e.prototype.getPlanXOZ = function() {
      var t = this.getPosition(),
        e = this.getLightDirection(),
        r = n.getCrossPlaneByLine(t, e);
      return r
    }, e.prototype.isAnimating = function() {
      return this.animating
    }, e.prototype.animateToLevel = function(t) {
      var e = this._animateToLevel(t);
      this._animateToMatrix(e, function() {
        r.globe.CURRENT_LEVEL = t
      })
    }, e.prototype._animateToMatrix = function(t, e) {
      var r = this;
      if (!this.isAnimating()) {
        this.animating = !0;
        var i = this.getPosition(),
          n = t.getPosition(),
          o = this.animationDuration,
          s = 1e3 / 60,
          a = Math.floor(o / s),
          l = (n.x - i.x) / a,
          h = (n.y - i.y) / a,
          c = (n.z - i.z) / a,
          u = -1,
          v = function(i) {
            u < 0 && (u = i);
            var n = i - u;
            if (n >= o) r.matrix = t, r.animating = !1, e();
            else {
              var s = r.getPosition();
              r.setPosition(s.x + l, s.y + h, s.z + c), requestAnimationFrame(v)
            }
          };
        requestAnimationFrame(v)
      }
    }, e.prototype._animateToLevel = function(t) {
      if (!i.isNonNegativeInteger(t)) throw "invalid level:" + t;
      var e = this._clone();
      return e._setLevel(t), e.matrix
    }, e.prototype._clone = function() {
      var t = new e;
      return t.pitch = this.pitch, t.matrix = this.matrix.clone(), t.projMatrix = this.projMatrix.clone(), t
    }, e.prototype.setLevel = function(t) {
      this._setLevel(t), r.globe.CURRENT_LEVEL = t
    }, e.prototype._setLevel = function(t) {
      if (!i.isNonNegativeInteger(t)) throw "invalid level:" + t;
      var e = this.getPosition();
      if (0 === e.x && 0 === e.y && 0 === e.z) {
        var a = n.getLengthFromCamera2EarthSurface(t) + r.EARTH_RADIUS,
          l = new o(0, 0, 0),
          h = this.getLightDirection().getOpposite();
        h.setLength(a);
        var c = h.getVertice();
        this.look(c, l)
      } else {
        var u = n.getLengthFromCamera2EarthSurface(r.globe.CURRENT_LEVEL),
          v = n.getLengthFromCamera2EarthSurface(t),
          f = u - v,
          p = this.getLightDirection();
        p.setLength(f);
        var d = s.verticePlusVector(e, p);
        this.setPosition(d.x, d.y, d.z)
      }
    }, e.prototype.isWorldVerticeVisibleInCanvas = function(t, e) {
      if (!(t instanceof o)) throw "invalid verticeInWorld: not Vertice";
      e = e || {};
      var r = "number" == typeof e.threshold ? Math.abs(e.threshold) : 1,
        i = this.getPosition(),
        l = s.verticeMinusVertice(t, i),
        c = new a(i, l),
        u = this.getPickCartesianCoordInEarthByLine(c);
      if (u.length > 0) {
        var v = u[0],
          f = n.getLengthFromVerticeToVertice(i, t),
          p = n.getLengthFromVerticeToVertice(i, v);
        if (f < p + 5) {
          e.verticeInNDC instanceof o || (e.projView instanceof h || (e.projView = this.getProjViewMatrix()),
            e.verticeInNDC = this.convertVerticeFromWorldToNDC(t, e.projView));
          var d = e.verticeInNDC.x >= -1 && e.verticeInNDC.x <= 1 && e.verticeInNDC.y >= -r && e.verticeInNDC.y <= 1;
          return d
        }
      }
      return !1
    }, e.prototype.isGeoVisibleInCanvas = function(t, e, r) {
      var i = n.geographicToCartesianCoord(t, e),
        o = this.isWorldVerticeVisibleInCanvas(i, r);
      return o
    }, e.prototype.getVisibleTilesByLevel = function(t, e) {
      function r(t) {
        return !!(t.area >= 5e3 && t.clockwise && t.visibleCount >= 1)
      }

      function i(i, o) {
        var h = [],
          c = new l(t, i, o),
          u = this.getTileVisibleInfo(c.level, c.row, c.column, e),
          v = r(u);
        if (v) {
          c.visibleInfo = u, h.push(c);
          for (var f, p = 0, d = o; p < s && (p++, c = l.getTileGridByBrother(t, i, d, n.LEFT, a), d = c.column, u = this.getTileVisibleInfo(c.level, c.row, c.column, e), f = r(u));) c.visibleInfo = u, h.push(c);
          for (var g = 0, m = o; g < s && (g++, c = l.getTileGridByBrother(t, i, m, n.RIGHT, a), m = c.column, u = this.getTileVisibleInfo(c.level, c.row, c.column, e), f = r(u));) c.visibleInfo = u, h.push(c)
        }
        return h
      }
      if (!(t >= 0)) throw "invalid level";
      var o = [];
      e = e || {}, e.projView instanceof h || (e.projView = this.getProjViewMatrix());
      var s = Math.min(10, Math.pow(2, t) - 1),
        a = {
          maxSize: Math.pow(2, t)
        },
        c = this._getVerticalVisibleCenterInfo(e),
        u = l.getTileGridByGeo(c.lon, c.lat, t),
        v = i.bind(this),
        f = v(u.row, u.column);
      o = o.concat(f);
      for (var p, d = 0, g = u.row; d < s && (d++, p = l.getTileGridByBrother(t, g, u.column, n.BOTTOM, a), g = p.row, f = v(p.row, p.column), f.length > 0);) o = o.concat(f);
      for (var m = 0, y = u.row; m < s && (m++, p = l.getTileGridByBrother(t, y, u.column, n.TOP, a), y = p.row, f = v(p.row, p.column), f.length > 0);) o = o.concat(f);
      return o
    }, e.prototype.getTileVisibleInfo = function(t, e, i, o) {
      if (!(t >= 0)) throw "invalid level";
      if (!(e >= 0)) throw "invalid row";
      if (!(i >= 0)) throw "invalid column";
      o = o || {};
      var a = "number" == typeof o.threshold ? Math.abs(o.threshold) : 1,
        l = {
          lb: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: !1
          },
          lt: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: !1
          },
          rt: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: !1
          },
          rb: {
            lon: null,
            lat: null,
            verticeInWorld: null,
            verticeInNDC: null,
            visible: !1
          },
          Egeo: null,
          visibleCount: 0,
          clockwise: !1,
          width: null,
          height: null,
          area: null
        };
      o.projView instanceof h || (o.projView = this.getProjViewMatrix()), l.Egeo = n.getTileGeographicEnvelopByGrid(t, e, i);
      var c = l.Egeo.minLon,
        u = l.Egeo.maxLon,
        v = l.Egeo.minLat,
        f = l.Egeo.maxLat;
      l.lb.lon = c, l.lb.lat = v, l.lb.verticeInWorld = n.geographicToCartesianCoord(l.lb.lon, l.lb.lat), l.lb.verticeInNDC = this.convertVerticeFromWorldToNDC(l.lb.verticeInWorld, o.projView), l.lb.visible = this.isWorldVerticeVisibleInCanvas(l.lb.verticeInWorld, {
        verticeInNDC: l.lb.verticeInNDC,
        projView: o.projView,
        threshold: a
      }), l.lb.visible && l.visibleCount++, l.lt.lon = c, l.lt.lat = f, l.lt.verticeInWorld = n.geographicToCartesianCoord(l.lt.lon, l.lt.lat), l.lt.verticeInNDC = this.convertVerticeFromWorldToNDC(l.lt.verticeInWorld, o.projView), l.lt.visible = this.isWorldVerticeVisibleInCanvas(l.lt.verticeInWorld, {
        verticeInNDC: l.lt.verticeInNDC,
        projView: o.projView,
        threshold: a
      }), l.lt.visible && l.visibleCount++, l.rt.lon = u, l.rt.lat = f, l.rt.verticeInWorld = n.geographicToCartesianCoord(l.rt.lon, l.rt.lat), l.rt.verticeInNDC = this.convertVerticeFromWorldToNDC(l.rt.verticeInWorld, o.projView), l.rt.visible = this.isWorldVerticeVisibleInCanvas(l.rt.verticeInWorld, {
        verticeInNDC: l.rt.verticeInNDC,
        projView: o.projView,
        threshold: a
      }), l.rt.visible && l.visibleCount++, l.rb.lon = u, l.rb.lat = v, l.rb.verticeInWorld = n.geographicToCartesianCoord(l.rb.lon, l.rb.lat), l.rb.verticeInNDC = this.convertVerticeFromWorldToNDC(l.rb.verticeInWorld, o.projView), l.rb.visible = this.isWorldVerticeVisibleInCanvas(l.rb.verticeInWorld, {
        verticeInNDC: l.rb.verticeInNDC,
        projView: o.projView,
        threshold: a
      }), l.rb.visible && l.visibleCount++;
      var p = [l.lb.verticeInNDC, l.lt.verticeInNDC, l.rt.verticeInNDC, l.rb.verticeInNDC],
        d = s.verticeMinusVertice(p[3], p[0]);
      d.z = 0;
      var g = s.verticeMinusVertice(p[1], p[0]);
      g.z = 0;
      var m = d.cross(g);
      l.clockwise = m.z > 0;
      var y = Math.sqrt(Math.pow(p[1].x - p[2].x, 2) + Math.pow(p[1].y - p[2].y, 2)) * r.canvas.width / 2,
        T = Math.sqrt(Math.pow(p[0].x - p[3].x, 2) + Math.pow(p[0].y - p[3].y, 2)) * r.canvas.width / 2;
      l.width = Math.floor((y + T) / 2);
      var w = Math.sqrt(Math.pow(p[0].x - p[1].x, 2) + Math.pow(p[0].y - p[1].y, 2)) * r.canvas.height / 2,
        E = Math.sqrt(Math.pow(p[2].x - p[3].x, 2) + Math.pow(p[2].y - p[3].y, 2)) * r.canvas.height / 2;
      return l.height = Math.floor((w + E) / 2), l.area = l.width * l.height, l
    }, e.prototype._getVerticalVisibleCenterInfo = function(t) {
      t = t || {}, t.projView || (t.projView = this.getProjViewMatrix());
      var e, r = {
        ndcY: null,
        pIntersect: null,
        lon: null,
        lat: null
      };
      if (90 == this.pitch) r.ndcY = 0;
      else {
        var i, o = 10,
          s = 2 / o,
          a = 1,
          l = -1;
        for (i = 1; i >= -1; i -= s)
          if (e = this.getPickCartesianCoordInEarthByNDC(0, i), e.length > 0) {
            a = i;
            break
          }
        for (i = -1; i <= 1; i += s)
          if (e = this.getPickCartesianCoordInEarthByNDC(0, i), e.length > 0) {
            l = i;
            break
          }
        r.ndcY = (a + l) / 2
      }
      e = this.getPickCartesianCoordInEarthByNDC(0, r.ndcY), r.pIntersect = e[0];
      var h = n.cartesianCoordToGeographic(r.pIntersect);
      return r.lon = h[0], r.lat = h[1], r
    }, e
  }(c);
  return u
}), define("world/Event", ["require", "exports", "world/Kernel", "world/math/Math", "world/math/Vector"], function(t, e, r, i, n) {
  "use strict";
  var o = {
    canvas: HTMLCanvasElement,
    bMouseDown: !1,
    dragGeo: null,
    previousX: -1,
    previousY: -1,
    onMouseMoveListener: null,
    bindEvents: function(t) {
      this.canvas = t, this.onMouseMoveListener = this.onMouseMove.bind(this), window.addEventListener("resize", this.initLayout.bind(this)), this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this)), this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this)), this.canvas.addEventListener("dblclick", this.onDbClick.bind(this)), this.canvas.addEventListener("mousewheel", this.onMouseWheel.bind(this)), this.canvas.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this)), document.body.addEventListener("keydown", this.onKeyDown.bind(this))
    },
    initLayout: function() {
      this.canvas instanceof HTMLCanvasElement && (this.canvas.width = document.body.clientWidth, this.canvas.height = document.body.clientHeight, r.globe && (r.globe.camera.setAspect(this.canvas.width / this.canvas.height), r.globe.refresh()))
    },
    moveLonLatToCanvas: function(t, e, n, o) {
      var s = r.globe.camera.getPickCartesianCoordInEarthByCanvas(n, o);
      if (s.length > 0) {
        var a = i.cartesianCoordToGeographic(s[0]),
          l = a[0],
          h = a[1];
        this.moveGeo(t, e, l, h)
      }
    },
    onMouseDown: function(t) {
      if (r.globe) {
        this.bMouseDown = !0, this.previousX = t.layerX || t.offsetX, this.previousY = t.layerY || t.offsetY;
        var e = r.globe.camera.getPickCartesianCoordInEarthByCanvas(this.previousX, this.previousY);
        e.length > 0 && (this.dragGeo = i.cartesianCoordToGeographic(e[0])), this.canvas.addEventListener("mousemove", this.onMouseMoveListener, !1)
      }
    },
    onMouseMove: function(t) {
      var e = r.globe;
      if (e && this.bMouseDown) {
        var n = t.layerX || t.offsetX,
          o = t.layerY || t.offsetY,
          s = e.camera.getPickCartesianCoordInEarthByCanvas(n, o);
        if (s.length > 0) {
          if (this.dragGeo) {
            var a = i.cartesianCoordToGeographic(s[0]);
            this.moveGeo(this.dragGeo[0], this.dragGeo[1], a[0], a[1])
          } else this.dragGeo = i.cartesianCoordToGeographic(s[0]);
          this.previousX = n, this.previousY = o, this.canvas.style.cursor = "pointer"
        } else this.previousX = -1, this.previousY = -1, this.dragGeo = null, this.canvas.style.cursor = "default"
      }
    },
    moveGeo: function(t, e, o, s) {
      if (t !== o || e !== s) {
        var a = i.geographicToCartesianCoord(t, e),
          l = n.fromVertice(a),
          h = i.geographicToCartesianCoord(o, s),
          c = n.fromVertice(h),
          u = l.cross(c),
          v = -n.getRadianOfTwoVectors(l, c),
          f = r.globe.camera;
        f.worldRotateByVector(v, u)
      }
    },
    onMouseUp: function() {
      this.bMouseDown = !1, this.previousX = -1, this.previousY = -1, this.dragGeo = null, this.canvas instanceof HTMLCanvasElement && (this.canvas.removeEventListener("mousemove", this.onMouseMoveListener, !1), this.canvas.style.cursor = "default")
    },
    onDbClick: function(t) {
      var e = r.globe;
      if (e) {
        var n = t.layerX || t.offsetX,
          o = t.layerY || t.offsetY,
          s = e.camera.getPickCartesianCoordInEarthByCanvas(n, o);
        if (e.setLevel(e.CURRENT_LEVEL + 1), s.length >= 1) {
          var a = s[0],
            l = i.cartesianCoordToGeographic(a),
            h = l[0],
            c = l[1];
          e.setLevel(e.CURRENT_LEVEL + 1), this.moveLonLatToCanvas(h, c, n, o)
        }
      }
    },
    onMouseWheel: function(t) {
      var e = r.globe;
      if (e) {
        var i, n = 0;
        t.wheelDelta ? (i = t.wheelDelta, n = parseInt(i / 120)) : t.detail && (i = t.detail, n = -parseInt(i / 3));
        var o = e.CURRENT_LEVEL + n;
        o >= 0 && e.animateToLevel(o)
      }
    },
    onKeyDown: function(t) {
      var e = r.globe;
      if (e) {
        var o = 36,
          s = 2,
          a = e.camera,
          l = void 0 !== t.keyCode ? t.keyCode : t.which;
        if (38 == l || 40 == l) {
          if (38 == l) {
            if (a.pitch <= o) return
          } else if (40 == l) {
            if (a.pitch >= 90) return;
            s *= -1
          }
          var h = a.getDirectionIntersectPointWithEarth();
          if (h.length > 0) {
            var c = h[0],
              u = a.getPosition(),
              v = i.getLengthFromVerticeToVertice(u, c),
              f = a.matrix.clone();
            f.setColumnTrans(c.x, c.y, c.z);
            var p = i.degreeToRadian(s);
            f.localRotateX(p);
            var d = f.getColumnZ();
            d.setLength(v);
            var g = n.verticePlusVector(c, d);
            a.look(g, c), a.pitch -= s, e.refresh()
          } else alert("视线与地球无交点")
        }
      }
    }
  };
  return o
}), define("world/geometries/Vertice", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t(t) {
      this.p = t.p, this.n = t.n, this.uv = t.uv, this.c = t.c, this.i = t.i
    }
    return t
  }();
  return r
}), define("world/geometries/Triangle", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t(t, e, r) {
      this.v1 = t, this.v2 = e, this.v3 = r
    }
    return t.prototype.setColor = function(t) {
      this.v1.c = this.v2.c = this.v3.c = t
    }, t
  }();
  return r
}), define("world/VertexBufferObject", ["require", "exports", "world/Kernel"], function(t, e, r) {
  "use strict";
  var i = function() {
    function t(t) {
      this.target = t, this.buffer = r.gl.createBuffer()
    }
    return t.prototype.bind = function() {
      r.gl.bindBuffer(this.target, this.buffer)
    }, t.prototype.unbind = function() {
      r.gl.bindBuffer(this.target, null)
    }, t.prototype.bufferData = function(t, e, i) {
      void 0 === i && (i = !1), i || this.bind(), this.target === r.gl.ARRAY_BUFFER ? r.gl.bufferData(r.gl.ARRAY_BUFFER, new Float32Array(t), e) : this.target === r.gl.ELEMENT_ARRAY_BUFFER && r.gl.bufferData(r.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(t), e)
    }, t.prototype.destroy = function() {
      r.gl.isBuffer(this.buffer) && r.gl.deleteBuffer(this.buffer), this.buffer = null
    }, t
  }();
  return i
}), define("world/geometries/Geometry", ["require", "exports", "world/Kernel", "world/Object3D", "world/VertexBufferObject"], function(t, e, r, i, n) {
  "use strict";
  var o = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.buildTriangles = function() {
      this.vertices = [], this.triangles = []
    }, e.prototype.calculateVBO = function(t) {
      if (void 0 === t && (t = !1), !this.vbo || t) {
        for (var e, i = [], o = 0, s = this.vertices.length; o < s; o++) e = this.vertices[o], i.push(e.p[0]), i.push(e.p[1]), i.push(e.p[2]);
        this.vbo || (this.vbo = new n(r.gl.ARRAY_BUFFER)), this.vbo.bind(), this.vbo.bufferData(i, r.gl.STATIC_DRAW, !0), this.vbo.unbind()
      }
      return this.vbo
    }, e.prototype.calculateIBO = function(t) {
      if (void 0 === t && (t = !1), !this.ibo || t) {
        for (var e, i = [], o = 0, s = this.triangles.length; o < s; o++) e = this.triangles[o], i.push(e.v1.i), i.push(e.v2.i), i.push(e.v3.i);
        this.ibo || (this.ibo = new n(r.gl.ELEMENT_ARRAY_BUFFER)), this.ibo.bind(), this.ibo.bufferData(i, r.gl.STATIC_DRAW, !0), this.ibo.unbind()
      }
      return this.ibo
    }, e.prototype.calculateNBO = function(t) {
      if (void 0 === t && (t = !1), !this.nbo || t) {
        for (var e, i = [], o = 0, s = this.vertices.length; o < s; o++) e = this.vertices[o], i.push(e.n[0]), i.push(e.n[1]), i.push(e.n[2]);
        this.nbo || (this.nbo = new n(r.gl.ARRAY_BUFFER)), this.nbo.bind(), this.nbo.bufferData(i, r.gl.STATIC_DRAW, !0), this.nbo.unbind()
      }
      return this.nbo
    }, e.prototype.calculateUVBO = function(t) {
      if (void 0 === t && (t = !1), !this.uvbo || t) {
        for (var e, i = [], o = 0, s = this.vertices.length; o < s; o++) e = this.vertices[o], i.push(e.uv[0]), i.push(e.uv[1]);
        this.uvbo || (this.uvbo = new n(r.gl.ARRAY_BUFFER)), this.uvbo.bind(), this.uvbo.bufferData(i, r.gl.STATIC_DRAW, !0), this.uvbo.unbind()
      }
      return this.uvbo
    }, e.prototype.calculateCBO = function(t) {
      if (void 0 === t && (t = !1), !this.cbo || t) {
        for (var e, i = [], o = 0, s = this.vertices.length; o < s; o++) e = this.vertices[o], i.push(e.c[0]), i.push(e.c[1]), i.push(e.c[2]);
        this.cbo || (this.cbo = new n(r.gl.ARRAY_BUFFER)), this.cbo.bind(), this.cbo.bufferData(i, r.gl.STATIC_DRAW, !0), this.cbo.unbind()
      }
      return this.cbo
    }, e.prototype.destroy = function() {
      this.vbo && this.vbo.destroy(), this.ibo && this.ibo.destroy(), this.nbo && this.nbo.destroy(), this.cbo && this.cbo.destroy(), this.uvbo && this.uvbo.destroy(), this.vbo = null, this.ibo = null, this.nbo = null, this.cbo = null, this.uvbo = null, this.vertices = [], this.triangles = []
    }, e
  }(i);
  return o
}), define("world/materials/Material", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t() {}
    return t
  }();
  return r
}), define("world/Program", ["require", "exports", "world/Kernel"], function(t, e, r) {
  "use strict";
  var i = function() {
    function t(t, e, r) {
      this.type = t, this.vs = e, this.fs = r, this.ready = !1, this.activeInfosObject = {}, this._init()
    }
    return t.prototype.use = function() {
      this.ready && t.currentProgram !== this && (r.gl.useProgram(this.program), t.currentProgram = this)
    }, t.prototype.updateActiveAttribInfos = function() {
      for (var t, e = r.gl.getProgramParameter(this.program, r.gl.ACTIVE_ATTRIBUTES), i = 0; i < e; i++) t = r.gl.getActiveAttrib(this.program, i), t.loc = r.gl.getAttribLocation(this.program, t.name), t.isAttribute = !0, this.activeInfosObject[t.name] = t
    }, t.prototype.updateActiveUniformInfos = function() {
      for (var t, e = r.gl.getProgramParameter(this.program, r.gl.ACTIVE_UNIFORMS), i = 0; i < e; i++) t = r.gl.getActiveUniform(this.program, i), t.loc = r.gl.getUniformLocation(this.program, t.name), t.isAttribute = !1, this.activeInfosObject[t.name] = t
    }, t.prototype.getLocation = function(t) {
      var e = -1,
        r = this.activeInfosObject[t];
      return r && (e = r.loc), e
    }, t.prototype.getAttribLocation = function(t) {
      var e = -1,
        r = this.activeInfosObject[t];
      return r && r.isAttribute && (e = r.loc), e
    }, t.prototype.getUniformLocation = function(t) {
      var e, r = this.activeInfosObject[t];
      return r && !r.isAttribute && (e = r.loc), e
    }, t.prototype.getVertexAttrib = function() {}, t.prototype.getUniform = function(t) {
      var e, i = this.getUniformLocation(t);
      return i && (e = r.gl.getUniform(this.program, i)), e
    }, t.prototype.enableVertexAttribArray = function(t) {
      var e = this.activeInfosObject[t];
      if (e && e.isAttribute && e.isEnabled !== !0) {
        var i = e.loc;
        r.gl.enableVertexAttribArray(i), e.isEnabled = !0
      }
    }, t.prototype.disableVertexAttribArray = function(t) {
      var e = this.activeInfosObject[t];
      if (e && e.isAttribute && e.isEnabled !== !1) {
        var i = e.loc;
        r.gl.disableVertexAttribArray(i), e.isEnabled = !1
      }
    }, t.prototype._init = function() {
      var t = this._getShader(r.gl.VERTEX_SHADER, this.vs);
      if (t) {
        var e = this._getShader(r.gl.FRAGMENT_SHADER, this.fs);
        if (e) {
          if (this.program = r.gl.createProgram(), r.gl.attachShader(this.program, t), r.gl.attachShader(this.program, e), r.gl.linkProgram(this.program), !r.gl.getProgramParameter(this.program, r.gl.LINK_STATUS)) return console.error("Could not link program!"), r.gl.deleteProgram(this.program), r.gl.deleteShader(t), r.gl.deleteShader(e), void(this.program = null);
          this.updateActiveAttribInfos(), this.updateActiveUniformInfos(), this.ready = !0
        }
      }
    }, t.prototype._getShader = function(t, e) {
      var i = r.gl.createShader(t);
      return r.gl.shaderSource(i, e), r.gl.compileShader(i), r.gl.getShaderParameter(i, r.gl.COMPILE_STATUS) ? i : (console.error("create shader failed", r.gl.getShaderInfoLog(i)), r.gl.deleteShader(i), null)
    }, t
  }();
  return i
}), define("world/ProgramUtils", ["require", "exports"], function(t, e) {
  "use strict";
  var r = [],
    i = {
      getProgram: function(t) {
        var e = null;
        t.getProgramType();
        return r.some(function(r) {
          return r.type === t.getProgramType() && (e = r, !0)
        }), e || (e = t.createProgram(), r.push(e)), e
      }
    };
  return i
}), define("world/graphics/Graphic", ["require", "exports", "world/Kernel", "world/ProgramUtils"], function(t, e, r, i) {
  "use strict";
  var n = function() {
    function t(t, e) {
      this.geometry = t, this.material = e, this.visible = !0, this.id = ++r.idCounter, this.parent = null, this.program = i.getProgram(this)
    }
    return t.prototype.setVisible = function(t) {
      this.visible = t
    }, t.prototype.getProgramType = function() {
      return this.material.getType()
    }, t.prototype.isReady = function() {
      return this.geometry && this.material && this.material.isReady()
    }, t.prototype.isDrawable = function() {
      return this.visible && this.isReady()
    }, t.prototype.draw = function(t) {
      this.isDrawable() && (this.program.use(), this.onDraw(t))
    }, t.prototype.destroy = function() {
      this.parent = null, this.geometry.destroy(), this.material.destroy(), this.geometry = null, this.material = null
    }, t
  }();
  return n
}), define("world/GraphicGroup", ["require", "exports", "world/Kernel"], function(t, e, r) {
  "use strict";
  var i = function() {
    function t() {
      this.visible = !0, this.id = ++r.idCounter, this.children = []
    }
    return t.prototype.add = function(t) {
      this.children.push(t), t.parent = this
    }, t.prototype.remove = function(t) {
      var e = !1,
        r = this.findGraphicById(t.id);
      return r && (t.destroy(), this.children.splice(r.index, 1), t = null, e = !0), e
    }, t.prototype.clear = function() {
      for (var t = 0, e = this.children.length, r = null; t < e; t++) r = this.children[t], r.destroy();
      this.children = []
    }, t.prototype.destroy = function() {
      this.parent = null, this.clear()
    }, t.prototype.findGraphicById = function(t) {
      for (var e = 0, r = this.children.length, i = null; e < r; e++)
        if (i = this.children[e], i.id === t) return {
          index: e,
          graphic: i
        };
      return null
    }, t.prototype.isDrawable = function() {
      return this.visible
    }, t.prototype.draw = function(t) {
      this.isDrawable() && this.children.forEach(function(e) {
        e.isDrawable() && e.draw(t)
      })
    }, t
  }();
  return i
}), define("world/Enum", ["require", "exports"], function(t, e) {
  "use strict";
  var r;
  return function(t) {
    t[t.UNKNOWN = 0] = "UNKNOWN", t[t.FULL_IN = 1] = "FULL_IN", t[t.FULL_OUT = 2] = "FULL_OUT", t[t.IN_OUT = 3] = "IN_OUT", t[t.NOKIA_TILED_MAP = 4] = "NOKIA_TILED_MAP", t[t.Google_TILED_MAP = 5] = "Google_TILED_MAP", t[t.OSM_TILED_MAP = 6] = "OSM_TILED_MAP", t[t.BLENDED_TILED_MAP = 7] = "BLENDED_TILED_MAP", t[t.GLOBE_TILE = 8] = "GLOBE_TILE", t[t.TERRAIN_TILE = 9] = "TERRAIN_TILE"
  }(r || (r = {})), r
}), define("world/Image", ["require", "exports"], function(t, e) {
  "use strict";
  var r = {
    MAX_LEVEL: 4,
    images: {},
    add: function(t, e) {
      this.images[t] = e
    },
    get: function(t) {
      return this.images[t]
    },
    remove: function(t) {
      delete this.images[t]
    },
    clear: function() {
      this.images = {}
    },
    getCount: function() {
      var t = 0;
      for (var e in this.images) this.images.hasOwnProperty(e) && t++;
      return t
    }
  };
  return r
}), define("world/materials/MeshTextureMaterial", ["require", "exports", "world/Kernel", "world/math/Math", "world/materials/Material", "world/Image"], function(t, e, r, i, n, o) {
  "use strict";
  var s = function(t) {
    function e(e) {
      t.call(this), this.ready = !1, this.deleted = !1, this.texture = r.gl.createTexture(), e && this.setImageOrUrl(e)
    }
    return __extends(e, t), e.prototype.getType = function() {
      return "MeshTextureMaterial"
    }, e.prototype.isReady = function() {
      return this.ready
    }, e.prototype.setImageOrUrl = function(t) {
      t && (t instanceof Image && t.width > 0 && t.height > 0 ? this.setImage(t) : "string" == typeof t && this.setImageUrl(t))
    }, e.prototype.setImage = function(t) {
      t.width > 0 && t.height > 0 && (this.ready = !1, this.image = t, this.onLoad())
    }, e.prototype.setImageUrl = function(t) {
      var e = o.get(t);
      e ? this.setImage(e) : (this.ready = !1, this.image = new Image, this.image.crossOrigin = "anonymous", this.image.onload = this.onLoad.bind(this), this.image.src = t)
    }, e.prototype.onLoad = function() {
      if (!this.deleted) {
        r.gl.bindTexture(r.gl.TEXTURE_2D, this.texture), r.gl.pixelStorei(r.gl.UNPACK_FLIP_Y_WEBGL, 1), r.gl.texImage2D(r.gl.TEXTURE_2D, 0, r.gl.RGBA, r.gl.RGBA, r.gl.UNSIGNED_BYTE, this.image);
        var t = this.image.width === this.image.height && i.isPowerOfTwo(this.image.width);
        t ? (r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_MIN_FILTER, r.gl.LINEAR_MIPMAP_NEAREST), r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_MAG_FILTER, r.gl.LINEAR), r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_WRAP_S, r.gl.CLAMP_TO_EDGE), r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_WRAP_T, r.gl.CLAMP_TO_EDGE), r.gl.generateMipmap(r.gl.TEXTURE_2D)) : (r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_MIN_FILTER, r.gl.LINEAR), r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_MAG_FILTER, r.gl.LINEAR), r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_WRAP_S, r.gl.CLAMP_TO_EDGE), r.gl.texParameteri(r.gl.TEXTURE_2D, r.gl.TEXTURE_WRAP_T, r.gl.CLAMP_TO_EDGE)), r.gl.bindTexture(r.gl.TEXTURE_2D, null), this.ready = !0
      }
    }, e.prototype.destroy = function() {
      r.gl.isTexture(this.texture) && r.gl.deleteTexture(this.texture), this.texture = null, this.deleted = !0
    }, e
  }(n);
  return s
}), define("world/graphics/MeshGraphic", ["require", "exports", "world/Kernel", "world/Program", "world/graphics/Graphic"], function(t, e, r, i, n) {
  "use strict";
  var o = "\nattribute vec3 aPosition;\nattribute vec2 aUV;\nvarying vec2 vUV;\nuniform mat4 uPMVMatrix;\n\nvoid main()\n{\n\tgl_Position = uPMVMatrix * vec4(aPosition,1.0);\n\tvUV = aUV;\n}\n",
    s = "\nprecision mediump float;\nvarying vec2 vUV;\nuniform sampler2D uSampler;\n\nvoid main()\n{\n\tgl_FragColor = texture2D(uSampler, vec2(vUV.s, vUV.t));\n}\n",
    a = function(t) {
      function e(e, r) {
        t.call(this, e, r), this.geometry = e, this.material = r, this.geometry.calculateVBO(), this.geometry.calculateIBO(), this.geometry.calculateUVBO()
      }
      return __extends(e, t), e.prototype.isGeometryReady = function() {
        return !!this.geometry.vbo && !!this.geometry.ibo && !!this.geometry.uvbo
      }, e.prototype.isReady = function() {
        return this.isGeometryReady() && t.prototype.isReady.call(this)
      }, e.prototype.createProgram = function() {
        return new i(this.getProgramType(), o, s)
      }, e.prototype._drawTextureMaterial = function(t) {
        var e = t.getAttribLocation("aUV");
        t.enableVertexAttribArray("aUV"), this.geometry.uvbo.bind(), r.gl.vertexAttribPointer(e, 2, r.gl.FLOAT, !1, 0, 0);
        var i = t.getUniformLocation("uSampler");
        r.gl.activeTexture(r.gl.TEXTURE0), r.gl.bindTexture(r.gl.TEXTURE_2D, this.material.texture), r.gl.uniform1i(i, 0)
      }, e.prototype.onDraw = function(t) {
        var e = this.program.getAttribLocation("aPosition");
        this.program.enableVertexAttribArray("aPosition"), this.geometry.vbo.bind(), r.gl.vertexAttribPointer(e, 3, r.gl.FLOAT, !1, 0, 0);
        var i = t.projViewMatrix.multiplyMatrix(this.geometry.matrix),
          n = this.program.getUniformLocation("uPMVMatrix");
        r.gl.uniformMatrix4fv(n, !1, i.elements), this._drawTextureMaterial(this.program), this.geometry.ibo.bind();
        var o = 3 * this.geometry.triangles.length;
        r.gl.drawElements(r.gl.TRIANGLES, o, r.gl.UNSIGNED_SHORT, 0), r.gl.bindBuffer(r.gl.ARRAY_BUFFER, null), r.gl.bindBuffer(r.gl.ELEMENT_ARRAY_BUFFER, null), r.gl.bindTexture(r.gl.TEXTURE_2D, null)
      }, e
    }(n);
  return a
}), define("world/materials/TileMaterial", ["require", "exports", "world/materials/MeshTextureMaterial", "world/Image"], function(t, e, r, i) {
  "use strict";
  var n = function(t) {
    function e(e, r) {
      t.call(this), this.level = e >= 0 ? e : 20, this.setImageOrUrl(r)
    }
    return __extends(e, t), e.prototype.onLoad = function() {
      this.level <= i.MAX_LEVEL && i.add(this.image.src, this.image), t.prototype.onLoad.call(this)
    }, e
  }(r);
  return n
}), define("world/geometries/TileGeometry", ["require", "exports", "world/geometries/Geometry"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e(e, r) {
      t.call(this), this.vertices = e, this.triangles = r
    }
    return __extends(e, t), e
  }(r);
  return i
}), define("world/graphics/Tile", ["require", "exports", "world/Kernel", "world/Enum", "world/Elevation", "world/math/Math", "world/graphics/MeshGraphic", "world/materials/TileMaterial", "world/geometries/TileGeometry", "world/geometries/Vertice", "world/geometries/Triangle"], function(t, e, r, i, n, o, s, a, l, h, c) {
  "use strict";
  var u = function() {
      function t(t, e, r, n) {
        this.level = t, this.row = e, this.column = r, this.url = n, this.type = i.UNKNOWN, this.elevationLevel = 0, this.minLon = null, this.minLat = null, this.maxLon = null, this.maxLat = null, this.minX = null, this.minY = null, this.maxX = null, this.maxY = null, this.segment = 1, this.elevationInfo = null, this._setTileInfo(), this._checkTerrain(), this.material = new a(this.level, this.url)
      }
      return t.prototype._setTileInfo = function() {
        this.elevationLevel = n.getAncestorElevationLevel(this.level);
        var t = o.getTileGeographicEnvelopByGrid(this.level, this.row, this.column);
        this.minLon = t.minLon, this.minLat = t.minLat, this.maxLon = t.maxLon, this.maxLat = t.maxLat;
        var e = o.degreeGeographicToWebMercator(this.minLon, this.minLat),
          r = o.degreeGeographicToWebMercator(this.maxLon, this.maxLat);
        this.minX = e[0], this.minY = e[1], this.maxX = r[0], this.maxY = r[1]
      }, t.prototype._checkTerrain = function(t) {
        void 0 === t && (t = !1);
        var e = r.globe,
          o = t === !0 || this.level >= r.TERRAIN_LEVEL,
          s = this.type != i.TERRAIN_TILE && o && e && e.camera && 90 != e.camera.pitch;
        if (s) {
          this.elevationInfo || (this.elevationInfo = n.getExactElevation(this.level, this.row, this.column));
          var a = !!this.elevationInfo;
          a ? this._handleTerrainTile() : this.visible = !1
        } else this.type == i.UNKNOWN && this._handleGlobeTile()
      }, t.prototype._handleGlobeTile = function() {
        if (this.type = i.GLOBE_TILE, this.level < r.BASE_LEVEL) {
          var t = r.BASE_LEVEL - this.level;
          this.segment = Math.pow(2, t)
        } else this.segment = 1;
        this._handleTile()
      }, t.prototype._handleTerrainTile = function() {
        this.type = i.TERRAIN_TILE, this.segment = 10, this._handleTile()
      }, t.prototype._handleTile = function() {
        this.visible = !0;
        var t, e, n = [],
          s = [],
          a = [],
          u = [],
          v = [],
          f = (this.maxX - this.minX) / this.segment,
          p = (this.maxY - this.minY) / this.segment,
          d = 1 / this.segment,
          g = this.type === i.TERRAIN_TILE && this.elevationInfo,
          m = 0,
          y = [],
          T = [],
          w = [],
          E = [];
        for (t = 0; t <= this.segment; t++) {
          y.push(this.minX + t * f), T.push(this.maxY - t * p);
          var L = t * d;
          w.push(L), E.push(1 - L)
        }
        var b = 0;
        for (t = 0; t <= this.segment; t++)
          for (e = 0; e <= this.segment; e++) {
            var x = y[e],
              _ = T[t],
              M = g ? this.elevationInfo.elevations[(this.segment + 1) * t + e] : 0,
              R = o.webMercatorToDegreeGeographic(x, _),
              I = o.geographicToCartesianCoord(R[0], R[1], r.EARTH_RADIUS + M + m).getArray();
            a = a.concat(I), v = v.concat(w[e], E[t]);
            var C = new h({
              p: I,
              i: b,
              uv: [w[e], E[t]]
            });
            n.push(C), b++
          }
        for (t = 0; t < this.segment; t++)
          for (e = 0; e < this.segment; e++) {
            var A = (this.segment + 1) * t + e,
              P = (this.segment + 1) * (t + 1) + e,
              V = P + 1,
              D = A + 1;
            u = u.concat(A, P, V), u = u.concat(V, D, A);
            var O = n[A],
              N = n[P],
              B = n[V],
              G = n[D],
              U = new c(O, N, B),
              F = new c(B, G, O);
            s.push(U, F)
          }
        this.geometry = new l(n, s)
      }, t
    }(),
    v = function(t) {
      function e(e, r, i) {
        t.call(this, e, r), this.geometry = e, this.material = r, this.tileInfo = i
      }
      return __extends(e, t), e.getTile = function(t, r, i, n) {
        var o = new u(t, r, i, n);
        return new e(o.geometry, o.material, o)
      }, e.prototype.isDrawable = function() {
        return this.tileInfo.visible && t.prototype.isDrawable.call(this)
      }, e.prototype.destroy = function() {
        t.prototype.destroy.call(this), this.subTiledLayer = null
      }, e
    }(s);
  return v
}), define("world/layers/SubTiledLayer", ["require", "exports", "world/Kernel", "world/TileGrid", "world/GraphicGroup", "world/graphics/Tile", "world/Elevation"], function(t, e, r, i, n, o, s) {
  "use strict";
  var a = function(t) {
    function e(e) {
      t.call(this), this.level = -1, this.elevationLevel = -1, this.tiledLayer = null, this.level = e.level, this.elevationLevel = s.getAncestorElevationLevel(this.level)
    }
    return __extends(e, t), e.prototype.draw = function(e) {
      this.level >= r.TERRAIN_LEVEL && r.globe && r.globe.camera.pitch <= r.TERRAIN_PITCH ? (r.gl.clear(r.gl.DEPTH_BUFFER_BIT), r.gl.clearDepth(1), r.gl.enable(r.gl.DEPTH_TEST)) : r.gl.disable(r.gl.DEPTH_TEST), t.prototype.draw.call(this, e)
    }, e.prototype.add = function(e) {
      e.tileInfo.level === this.level && (t.prototype.add.call(this, e), e.subTiledLayer = this)
    }, e.prototype.destroy = function() {
      t.prototype.destroy.call(this), this.tiledLayer = null
    }, e.prototype.findTile = function(t, e, r) {
      for (var i = this.children.length, n = 0; n < i; n++) {
        var o = this.children[n];
        if (o.tileInfo.level === t && o.tileInfo.row === e && o.tileInfo.column === r) return o
      }
      return null
    }, e.prototype.updateTiles = function(t, e) {
      function r(t, e, r, i) {
        for (var n = {
            isExist: !1,
            index: -1
          }, o = 0; o < t.length; o++) {
          var s = t[o];
          if (s.level === e && s.row === r && s.column === i) return n.isExist = !0, n.index = o, n
        }
        return n
      }
      var i, n, s = [];
      for (i = 0; i < this.children.length; i++) {
        n = this.children[i];
        var a = r(t, n.tileInfo.level, n.tileInfo.row, n.tileInfo.column),
          l = a.isExist;
        l ? t.splice(a.index, 1) : s.push(n)
      }
      for (; s.length > 0;) {
        var h = this.remove(s[0]);
        s.splice(0, 1), h || console.debug("LINE:2191,subTiledLayer.remove(tilesNeedDelete[0])失败")
      }
      if (e)
        for (i = 0; i < t.length; i++) {
          var c = t[i],
            u = {
              level: c.level,
              row: c.row,
              column: c.column,
              url: ""
            };
          u.url = this.tiledLayer.getImageUrl(u.level, u.row, u.column), n = o.getTile(u.level, u.row, u.column, u.url), this.add(n)
        }
    }, e.prototype.checkTerrain = function(t) {
      void 0 === t && (t = !1)
    }, e.prototype.requestElevations = function() {
      var t = [];
      if (this.level > r.ELEVATION_LEVEL) {
        var e, n, o = this.children;
        for (e = 0; e < o.length; e++) {
          var a = o[e],
            l = i.getTileGridAncestor(this.elevationLevel, a.tileInfo.level, a.tileInfo.row, a.tileInfo.column);
          n = l.level + "_" + l.row + "_" + l.column, t.indexOf(n) < 0 && t.push(n)
        }
        for (e = 0; e < t.length; e++) {
          n = t[e];
          var h = n.split("_"),
            c = parseInt(h[0]),
            u = parseInt(h[1]),
            v = parseInt(h[2]);
          s.elevations.hasOwnProperty(n) || s.requestElevationsByTileGrid(c, u, v)
        }
      }
    }, e.prototype.checkIfLoaded = function() {
      for (var t = 0; t < this.children.length; t++) {
        var e = this.children[t];
        if (e) {
          var r = e.material.isReady();
          if (!r) return !1
        }
      }
      return !0
    }, e
  }(n);
  return a
}), define("world/layers/TiledLayer", ["require", "exports", "world/Kernel", "world/GraphicGroup", "world/layers/SubTiledLayer"], function(t, e, r, i, n) {
  "use strict";
  var o = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.add = function(e) {
      t.prototype.add.call(this, e), e.tiledLayer = this
    }, e.prototype.wrapUrlWithProxy = function(t) {
      return r.proxy ? r.proxy + "?" + t : t
    }, e.prototype.updateSubLayerCount = function(t) {
      var e, r, i = this.children.length,
        o = t + 1 - i;
      if (o > 0)
        for (e = 0; e < o; e++) {
          var s = {
            level: e + i
          };
          r = new n(s), this.add(r)
        } else if (o < 0)
          for (o *= -1, e = 0; e < o; e++) {
            var a = this.children.length - 1;
            if (!(a >= 2)) break;
            r = this.children[a], this.remove(r)
          }
    }, e
  }(i);
  return o
}), define("world/Scene", ["require", "exports", "world/GraphicGroup"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e
  }(r);
  return i
}), define("world/Renderer", ["require", "exports", "world/Kernel", "world/Event"], function(t, e, r, i) {
  "use strict";
  var n = function() {
    function t(t) {
      function e(t) {
        try {
          for (var e = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], i = 0; i < e.length; i++)
            if (n = t.getContext(e[i], {
                antialias: !0
              })) {
              r.gl = n, r.canvas = t;
              break
            }
        } catch (t) {}
      }
      this.scene = null, this.camera = null, this.bAutoRefresh = !1, r.renderer = this, i.bindEvents(t);
      var n;
      return e(t), n ? (n.clearColor(255, 255, 255, 1), n.disable(n.DEPTH_TEST), n.depthFunc(n.LEQUAL), n.enable(n.CULL_FACE), n.frontFace(n.CCW), void n.cullFace(n.BACK)) : (alert("浏览器不支持WebGL或将WebGL禁用!"), void console.debug("浏览器不支持WebGL或将WebGL禁用!"))
    }
    return t.prototype.render = function(t, e) {
      r.gl.viewport(0, 0, r.canvas.width, r.canvas.height), r.gl.clear(r.gl.COLOR_BUFFER_BIT | r.gl.DEPTH_BUFFER_BIT), e.viewMatrix = null, e.viewMatrix = e.getViewMatrix(), e.projViewMatrix = e.projMatrix.multiplyMatrix(e.viewMatrix), t.draw(e)
    }, t.prototype.bindScene = function(t) {
      this.scene = t
    }, t.prototype.bindCamera = function(t) {
      this.camera = t
    }, t.prototype.tick = function() {
      r.renderer instanceof t && (r.renderer.scene && r.renderer.camera && r.renderer.render(r.renderer.scene, r.renderer.camera), r.renderer.bAutoRefresh && window.requestAnimationFrame(r.renderer.tick))
    }, t.prototype.setIfAutoRefresh = function(t) {
      this.bAutoRefresh = t, this.bAutoRefresh && this.tick()
    }, t
  }();
  return n
}), define("world/Globe", ["require", "exports", "world/Kernel", "world/Utils", "world/Renderer", "world/PerspectiveCamera", "world/Scene", "world/layers/SubTiledLayer", "world/graphics/Tile", "world/Image", "world/Event"], function(t, e, r, i, n, o, s, a, l, h, c) {
  "use strict";
  var u = function() {
    function t(t, e) {
      this.MAX_LEVEL = 14, this.CURRENT_LEVEL = -1, this.REFRESH_INTERVAL = 300, this.idTimeOut = null, this.renderer = null, this.scene = null, this.camera = null, this.tiledLayer = null, e = e || {}, r.globe = this, this.renderer = r.renderer = new n(t), this.scene = new s;
      var i = t.width / t.height;
      this.camera = new o(30, i, 1, 2e7), this.renderer.bindScene(this.scene), this.renderer.bindCamera(this.camera), this.setLevel(0), this.renderer.setIfAutoRefresh(!0), c.initLayout()
    }
    return t.prototype.setTiledLayer = function(t) {
      if (clearTimeout(this.idTimeOut), h.clear(), this.tiledLayer) {
        var e = this.scene.remove(this.tiledLayer);
        e || console.error("this.scene.remove(this.tiledLayer)失败"), this.scene.tiledLayer = null
      }
      this.tiledLayer = t, this.scene.add(this.tiledLayer);
      var i = new a({
        level: 0
      });
      this.tiledLayer.add(i);
      var n = new a({
        level: 1
      });
      this.tiledLayer.add(n), r.canvas.style.cursor = "wait";
      for (var o = 0; o <= 1; o++)
        for (var s = 0; s <= 1; s++) {
          var c = {
            level: 1,
            row: o,
            column: s,
            url: ""
          };
          c.url = this.tiledLayer.getImageUrl(c.level, c.row, c.column);
          var u = l.getTile(c.level, c.row, c.column, c.url);
          n.add(u)
        }
      r.canvas.style.cursor = "default", this.tick()
    }, t.prototype.setLevel = function(t) {
      if (!i.isNonNegativeInteger(t)) throw "invalid level:" + t;
      t = t > this.MAX_LEVEL ? this.MAX_LEVEL : t, t != this.CURRENT_LEVEL && this.camera instanceof o && (this.camera.setLevel(t), this.refresh())
    }, t.prototype.isAnimating = function() {
      return this.camera.isAnimating()
    }, t.prototype.animateToLevel = function(t) {
      this.isAnimating() || this.camera.animateToLevel(t)
    }, t.prototype.tick = function() {
      var t = r.globe;
      t && (t.refresh(), this.idTimeOut = setTimeout(t.tick, t.REFRESH_INTERVAL))
    }, t.prototype.refresh = function() {
      if (this.tiledLayer && this.scene && this.camera) {
        var t = this.CURRENT_LEVEL + 3;
        this.tiledLayer.updateSubLayerCount(t);
        var e = this.camera.getProjViewMatrix(),
          n = {
            projView: e,
            threshold: 1
          };
        n.threshold = Math.min(90 / this.camera.pitch, 1.5);
        var o, s = this.camera.getVisibleTilesByLevel(t, n),
          a = [],
          l = s;
        for (o = t; o >= 2; o--) a.push(l), l = i.map(l, function(t) {
          return t.getParent()
        }), l = i.filterRepeatArray(l);
        for (a.reverse(), o = 2; o <= t; o++) {
          var h = o,
            c = this.tiledLayer.children[h];
          c.updateTiles(a[0], !0), a.splice(0, 1)
        }
        r.TERRAIN_ENABLED && this.requestElevationsAndCheckTerrain()
      }
    }, t.prototype.requestElevationsAndCheckTerrain = function() {
      var t = this.tiledLayer.children.length - 1;
      if (t >= r.TERRAIN_LEVEL)
        for (var e = r.ELEVATION_LEVEL + 1; e <= t; e++) {
          var i = this.tiledLayer.children[e];
          i.requestElevations(), e >= r.TERRAIN_LEVEL && i.checkTerrain()
        }
    }, t
  }();
  return u
}), define("world/Kernel", ["require", "exports"], function(t, e) {
  "use strict";
  var r = {
    gl: null,
    canvas: null,
    renderer: null,
    globe: null,
    idCounter: 0,
    BASE_LEVEL: 6,
    EARTH_RADIUS: 6378137,
    MAX_PROJECTED_COORD: 20037508.3427892,
    ELEVATION_LEVEL: 7,
    TERRAIN_LEVEL: 10,
    TERRAIN_ENABLED: !1,
    TERRAIN_PITCH: 80,
    proxy: ""
  };
  return r
}), define("world/Elevation", ["require", "exports", "world/Kernel", "world/Utils", "world/math/Math", "world/TileGrid"], function(t, e, r, i, n, o) {
  "use strict";
  var s = {
    elevationUrl: "//sampleserver4.arcgisonline.com/ArcGIS/rest/services/Elevation/ESRI_Elevation_World/MapServer/exts/ElevationsSOE/ElevationLayers/1/GetElevationData",
    elevations: {},
    factor: 1,
    getAncestorElevationLevel: function(t) {
      if (!(t >= 0)) throw "invalid level";
      var e = Math.floor((t - 1 - r.ELEVATION_LEVEL) / 3),
        i = r.ELEVATION_LEVEL + 3 * e;
      return i
    },
    requestElevationsByTileGrid: function(t, e, r) {
      function o() {
        if (4 == b.readyState && 200 == b.status) try {
          var t = JSON.parse(b.responseText);
          1 == this.factor ? this.elevations[a] = t.data : this.elevations[a] = i.map(this.elevations, function(t) {
            return t * this.factor
          }.bind(this))
        } catch (t) {
          console.error("requestElevationsByTileGrid_callback error", t)
        }
      }
      if (!(t >= 0)) throw "invalid level";
      if (!(e >= 0)) throw "invalid row";
      if (!(r >= 0)) throw "invalid column";
      var s = 80,
        a = t + "_" + e + "_" + r;
      if (!this.elevations.hasOwnProperty(a)) {
        this.elevations[a] = null;
        var l = n.getTileWebMercatorEnvelopeByGrid(t, e, r),
          h = l.minX,
          c = l.minY,
          u = l.maxX,
          v = l.maxY,
          f = (u - h) / s,
          p = (v - c) / s,
          d = f / 2,
          g = p / 2,
          m = {
            xmin: h - d,
            ymin: c - g,
            xmax: u + d,
            ymax: v + g,
            spatialReference: {
              wkid: 102100
            }
          },
          y = encodeURIComponent(JSON.stringify(m)),
          T = s + 1,
          w = s + 1,
          E = "pjson",
          L = "Extent=" + y + "&Rows=" + T + "&Columns=" + w + "&f=" + E,
          b = new XMLHttpRequest;
        b.onreadystatechange = o.bind(this), b.open("GET", "proxy.jsp?" + this.elevationUrl + "?" + L, !0), b.send()
      }
    },
    getElevation: function(t, e, r) {
      if (!(t >= 0)) throw "invalid level";
      if (!(e >= 0)) throw "invalid row";
      if (!(r >= 0)) throw "invalid column";
      var i = null,
        n = this.getExactElevation(t, e, r);
      return i = n ? n : this.getLinearElevation(t, e, r)
    },
    getExactElevation: function(t, e, i) {
      if (!(t >= 0)) throw "invalid level";
      if (!(e >= 0)) throw "invalid row";
      if (!(i >= 0)) throw "invalid column";
      var s = null,
        a = this.getAncestorElevationLevel(t),
        l = o.getTileGridAncestor(a, t, e, i),
        h = l.level + "_" + l.row + "_" + l.column,
        c = this.elevations[h];
      if (c instanceof Array && c.length > 0 && t > r.ELEVATION_LEVEL) {
        for (var u = {
            level: l.level,
            row: l.row,
            column: l.column
          }; u.level != t;) u = o.getTileGridByParent(u.level, u.row, u.column, n.LEFT_TOP);
        if (u.level == t) {
          var v = e - u.row,
            f = i - u.column,
            p = 81,
            d = a + 3 - t,
            g = Math.pow(2, d),
            m = v * g * 10 * p + f * g * 10;
          s = {
            sourceLevel: a,
            elevations: []
          };
          for (var y = 0; y <= 10; y++) {
            for (var T = m, w = 0; w <= 10; w++) {
              var E = c[T];
              s.elevations.push(E), T += g
            }
            m += g * p
          }
        }
      }
      return s
    },
    getLinearElevation: function(t, e, r) {
      if (!(t >= 0)) throw "invalid level";
      if (!(e >= 0)) throw "invalid row";
      if (!(r >= 0)) throw "invalid column";
      var i = null,
        n = this.getAncestorElevationLevel(t),
        s = o.getTileGridAncestor(n, t, e, r),
        a = this.getExactElevation(s.level, s.row, s.column),
        l = t - n;
      return a && (i = {
        sourceLevel: n - 3,
        elevations: null
      }, 1 == l ? i.elevations = this.getLinearElevationFromParent(a, t, e, r) : 2 == l ? i.elevations = this.getLinearElevationFromParent2(a, t, e, r) : 3 == l && (i.elevations = this.getLinearElevationFromParent3(a, t, e, r))), i
    },
    getLinearElevationFromParent: function(t, e, r, i) {
      if (!(t.length > 0)) throw "invalid parentElevations";
      if (!(e >= 0)) throw "invalid level";
      if (!(r >= 0)) throw "invalid row";
      if (!(i >= 0)) throw "invalid column";
      var s = o.getTilePositionOfParent(e, r, i),
        a = [],
        l = 0;
      s == n.LEFT_TOP ? l = 0 : s == n.RIGHT_TOP ? l = 5 : s == n.LEFT_BOTTOM ? l = 55 : s == n.RIGHT_BOTTOM && (l = 60);
      var h, c, u;
      for (h = 0; h <= 5; h++) {
        for (u = l, c = 0; c <= 5; c++) {
          var v = t[u];
          a.push(v), u++
        }
        l += 11
      }
      var f, p, d, g, m = [];
      for (h = 0; h <= 5; h++)
        for (c = 0; c <= 5; c++) u = 6 * h + c, f = a[u], c > 0 && (g = a[u - 1], d = (g + f) / 2, m.push(d)), m.push(f);
      var y = [];
      for (h = 0; h <= 5; h++)
        for (c = 0; c <= 10; c++) u = 11 * h + c, f = m[u], h > 0 && (p = m[u - 11], d = (p + f) / 2, y[11 * (2 * h - 1) + c] = d), y[2 * h * 11 + c] = f;
      return y
    },
    getLinearElevationFromParent2: function(t, e, r, i) {
      var n = o.getTileGridAncestor(e - 1, e, r, i),
        s = this.getLinearElevationFromParent(t, n.level, n.row, n.column),
        a = this.getLinearElevationFromParent(s, e, r, i);
      return a
    },
    getLinearElevationFromParent3: function(t, e, r, i) {
      var n = o.getTileGridAncestor(e - 1, e, r, i),
        s = this.getLinearElevationFromParent2(t, n.level, n.row, n.column),
        a = this.getLinearElevationFromParent(s, e, r, i);
      return a
    }
  };
  return s
}), define("world/geometries/Box", ["require", "exports", "world/geometries/Vertice", "world/geometries/Triangle", "world/geometries/Geometry"], function(t, e, r, i, n) {
  "use strict";
  var o = function(t) {
    function e(e, r, i) {
      t.call(this), this.length = e, this.width = r, this.height = i, this.buildTriangles()
    }
    return __extends(e, t), e.prototype.buildTriangles = function() {
      this.vertices = [], this.triangles = [];
      var t = this.length / 2,
        e = this.height / 2,
        r = this.width / 2,
        i = [-t, e, r],
        n = [-t, -e, r],
        o = [t, e, r],
        s = [t, -e, r],
        a = [-t, e, -r],
        l = [-t, -e, -r],
        h = [t, e, -r],
        c = [t, -e, -r],
        u = 0,
        v = this._buildPlane(u, i, n, o, s, [0, 0, 1]);
      this.vertices = this.vertices.concat(v.vertices), this.triangles = this.triangles.concat(v.triangles), u += 4;
      var f = this._buildPlane(u, o, s, h, c, [1, 0, 0]);
      this.vertices = this.vertices.concat(f.vertices), this.triangles = this.triangles.concat(f.triangles), u += 4;
      var p = this._buildPlane(u, h, c, a, l, [0, 0, -1]);
      this.vertices = this.vertices.concat(p.vertices), this.triangles = this.triangles.concat(p.triangles), u += 4;
      var d = this._buildPlane(u, a, l, i, n, [-1, 0, 0]);
      this.vertices = this.vertices.concat(d.vertices), this.triangles = this.triangles.concat(d.triangles), u += 4;
      var g = this._buildPlane(u, a, i, h, o, [0, 1, 0]);
      this.vertices = this.vertices.concat(g.vertices), this.triangles = this.triangles.concat(g.triangles), u += 4;
      var m = this._buildPlane(u, n, l, s, c, [0, -1, 0]);
      this.vertices = this.vertices.concat(m.vertices), this.triangles = this.triangles.concat(m.triangles)
    }, e.prototype._buildPlane = function(t, e, n, o, s, a) {
      var l = {
          vertices: [],
          triangles: []
        },
        h = new r({
          i: t,
          p: e,
          uv: [0, 0],
          n: a,
          c: null
        }),
        c = new r({
          i: t + 1,
          p: n,
          uv: [0, 1],
          n: a,
          c: null
        }),
        u = new r({
          i: t + 2,
          p: o,
          uv: [1, 0],
          n: a,
          c: null
        }),
        v = new r({
          i: t + 3,
          p: s,
          uv: [1, 1],
          n: a,
          c: null
        });
      l.vertices = [h, c, u, v];
      var f = new i(h, c, u),
        p = new i(u, c, v);
      return l.triangles = [f, p], l
    }, e
  }(n);
  return o
}), define("world/layers/ArcGISTiledLayer", ["require", "exports", "world/Kernel", "world/layers/TiledLayer"], function(t, e, r, i) {
  "use strict";
  var n = function(t) {
    function e(e) {
      t.call(this), this.url = e
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, i) {
      var n = r.proxy + "?" + this.url + "/tile/" + t + "/" + e + "/" + i;
      return this.wrapUrlWithProxy(n)
    }, e
  }(i);
  return n
}), define("world/layers/AutonaviTiledLayer", ["require", "exports", "world/layers/TiledLayer"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var i = t + e + r,
        n = 1 + i % 4,
        o = "//webrd0" + n + ".is.autonavi.com/appmaptile?x=" + r + "&y=" + e + "&z=" + t + "&lang=zh_cn&size=1&scale=1&style=8";
      return this.wrapUrlWithProxy(o)
    }, e
  }(r);
  return i
}), define("world/layers/BingTiledLayer", ["require", "exports", "world/math/Math", "world/layers/TiledLayer"], function(t, e, r, i) {
  "use strict";
  var n = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, i) {
      var n, o = "",
        s = i,
        a = e,
        l = r.numerationSystemFrom10(2, s),
        h = r.numerationSystemFrom10(2, a),
        c = l.length - h.length;
      if (c > 0)
        for (n = 0; n < c; n++) h = "0" + h;
      else if (c < 0)
        for (c = -c, n = 0; n < c; n++) l = "0" + l;
      var u = "";
      for (n = 0; n < h.length; n++) {
        var v = h[n],
          f = l[n];
        u += v + f
      }
      var p = r.numerationSystemChange(2, 4, u);
      if (p.length < t)
        for (c = t - p.length, n = 0; n < c; n++) p = "0" + p;
      var d = t + e + i,
        g = d % 8;
      return o = "//ecn.t" + g + ".tiles.virtualearth.net/tiles/h" + p + ".jpeg?g=1239&mkt=en-us"
    }, e
  }(i);
  return n
}), define("world/layers/NokiaTiledLayer", ["require", "exports", "world/layers/TiledLayer"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var i = t + e + r,
        n = 1 + i % 4,
        o = "//" + n + ".base.maps.api.here.com/maptile/2.1/maptile/f1f4a211b3/normal.day/" + t + "/" + r + "/" + e + "/512/png8?app_id=xWVIueSv6JL0aJ5xqTxb&app_code=djPZyynKsbTjIUDOBcHZ2g&lg=eng&ppi=72&pview=DEF";
      return o
    }, e
  }(r);
  return i
}), define("world/layers/GoogleTiledLayer", ["require", "exports", "world/layers/TiledLayer"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var i = t + e + r,
        n = 1 + i % 3,
        o = "//mt" + n + ".google.cn/vt/lyrs=m@212000000&hl=zh-CN&gl=CN&src=app&x=" + r + "&y=" + e + "&z=" + t + "&s=Galil";
      return o
    }, e
  }(r);
  return i
}), define("world/layers/OsmTiledLayer", ["require", "exports", "world/layers/TiledLayer"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var i = t + e + r,
        n = i % 3,
        o = ["a", "b", "c"][n],
        s = "//" + o + ".tile.openstreetmap.org/" + t + "/" + r + "/" + e + ".png";
      return s
    }, e
  }(r);
  return i
}), define("world/layers/BlendTiledLayer", ["require", "exports", "world/layers/TiledLayer", "world/layers/NokiaTiledLayer", "world/layers/GoogleTiledLayer", "world/layers/OsmTiledLayer"], function(t, e, r, i, n, o) {
  "use strict";
  var s = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var s = [i, n, o],
        a = t + e + r,
        l = a % 3,
        h = s[l].prototype.getImageUrl.apply(this, arguments);
      return h
    }, e
  }(r);
  return s
}), define("world/layers/SosoTiledLayer", ["require", "exports", "world/layers/TiledLayer"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var i = "",
        n = Math.pow(2, t),
        o = r,
        s = n - e - 1,
        a = Math.floor(o / 16),
        l = Math.floor(s / 16),
        h = t + e + r,
        c = h % 4,
        u = "//p" + c + ".map.soso.com/sateTiles/" + t + "/" + a + "/" + l + "/" + o + "_" + s + ".jpg";
      return i = u
    }, e
  }(r);
  return i
}), define("world/layers/TiandituTiledLayer", ["require", "exports", "world/layers/TiledLayer"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.getImageUrl = function(t, e, r) {
      var i = "",
        n = t + e + r,
        o = n % 8;
      return i = "//t" + o + ".tianditu.com/DataServer?T=vec_w&x=" + r + "&y=" + e + "&l=" + t
    }, e
  }(r);
  return i
}), define("world/materials/MeshColorMaterial", ["require", "exports", "world/materials/Material"], function(t, e, r) {
  "use strict";
  var i = function(t) {
    function e() {
      t.call(this), this.type = "", this.ready = !1, this.reset()
    }
    return __extends(e, t), e.prototype.isReady = function() {
      return this.ready
    }, e.prototype.getType = function() {
      return "MeshColorMaterial"
    }, e.prototype.reset = function() {
      this.type = "", this.singleColor = null, this.triangleColors = [], this.verticeColors = [], this.ready = !1
    }, e.prototype.setSingleColor = function(t) {
      this.type = "single", this.singleColor = t, this.ready = !0
    }, e.prototype.setTriangleColor = function(t) {
      this.type = "triangle", this.triangleColors = t, this.ready = !0
    }, e.prototype.setVerticeColor = function(t) {
      this.type = "vertice", this.verticeColors = t, this.ready = !0
    }, e.prototype.destroy = function() {
      this.reset()
    }, e
  }(r);
  return i
}), define("world/math/Ray", ["require", "exports"], function(t, e) {
  "use strict";
  var r = function() {
    function t(t, e) {
      this.vertice = t.clone(), this.vector = e.clone(), this.vector.normalize()
    }
    return t.prototype.setVertice = function(t) {
      return this.vertice = t.clone(), this
    }, t.prototype.setVector = function(t) {
      return this.vector = t.clone(), this.vector.normalize(), this
    }, t.prototype.clone = function() {
      var e = new t(this.vertice, this.vector);
      return e
    }, t.prototype.rotateVertice = function(t) {
      return null
    }, t
  }();
  return r
});