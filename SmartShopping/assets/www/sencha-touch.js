/*
 * This file is part of Sencha Touch 2.0
 * 
 * Copyright (c) 2011-2012 Sencha Inc
 * 
 * Contact: http://www.sencha.com/contact
 * 
 * Commercial Usage Licensees holding valid commercial licenses may use this
 * file in accordance with the Commercial Software License Agreement provided
 * with the Software or, alternatively, in accordance with the terms contained
 * in a written agreement between you and Sencha.
 * 
 * If you are unsure which license is appropriate for your use, please contact
 * the sales department at http://www.sencha.com/contact.
 * 
 * Build date: 2012-06-04 15:34:28 (d81f71da2d56f5f71419dc892fbc85685098c6b7)
 */
/*
 * 
 * This file is part of Sencha Touch 2
 * 
 * Copyright (c) 2012 Sencha Inc
 * 
 * Contact: http://www.sencha.com/contact
 * 
 * Commercial Usage Licensees holding valid commercial licenses may use this
 * file in accordance with the Commercial Software License Agreement provided
 * with the Software or, alternatively, in accordance with the terms contained
 * in a written agreement between you and Sencha.
 * 
 * If you are unsure which license is appropriate for your use, please contact
 * the sales department at http://www.sencha.com/contact.
 * 
 */
(function() {
	var global = this, objectPrototype = Object.prototype, toString = objectPrototype.toString, enumerables = true, enumerablesTest = {
		toString : 1
	}, emptyFn = function() {
	}, i;
	if (typeof Ext === "undefined") {
		global.Ext = {}
	}
	Ext.global = global;
	for (i in enumerablesTest) {
		enumerables = null
	}
	if (enumerables) {
		enumerables = ["hasOwnProperty", "valueOf", "isPrototypeOf",
				"propertyIsEnumerable", "toLocaleString", "toString",
				"constructor"]
	}
	Ext.enumerables = enumerables;
	Ext.apply = function(object, config, defaults) {
		if (defaults) {
			Ext.apply(object, defaults)
		}
		if (object && config && typeof config === "object") {
			var i, j, k;
			for (i in config) {
				object[i] = config[i]
			}
			if (enumerables) {
				for (j = enumerables.length; j--;) {
					k = enumerables[j];
					if (config.hasOwnProperty(k)) {
						object[k] = config[k]
					}
				}
			}
		}
		return object
	};
	Ext.buildSettings = Ext.apply({
				baseCSSPrefix : "x-",
				scopeResetCSS : false
			}, Ext.buildSettings || {});
	Ext.apply(Ext, {
				emptyFn : emptyFn,
				baseCSSPrefix : Ext.buildSettings.baseCSSPrefix,
				applyIf : function(object, config) {
					var property;
					if (object) {
						for (property in config) {
							if (object[property] === undefined) {
								object[property] = config[property]
							}
						}
					}
					return object
				},
				iterate : function(object, fn, scope) {
					if (Ext.isEmpty(object)) {
						return
					}
					if (scope === undefined) {
						scope = object
					}
					if (Ext.isIterable(object)) {
						Ext.Array.each.call(Ext.Array, object, fn, scope)
					} else {
						Ext.Object.each.call(Ext.Object, object, fn, scope)
					}
				}
			});
	Ext.apply(Ext, {
		extend : function() {
			var objectConstructor = objectPrototype.constructor, inlineOverrides = function(
					o) {
				for (var m in o) {
					if (!o.hasOwnProperty(m)) {
						continue
					}
					this[m] = o[m]
				}
			};
			return function(subclass, superclass, overrides) {
				if (Ext.isObject(superclass)) {
					overrides = superclass;
					superclass = subclass;
					subclass = overrides.constructor !== objectConstructor
							? overrides.constructor
							: function() {
								superclass.apply(this, arguments)
							}
				}
				var F = function() {
				}, subclassProto, superclassProto = superclass.prototype;
				F.prototype = superclassProto;
				subclassProto = subclass.prototype = new F();
				subclassProto.constructor = subclass;
				subclass.superclass = superclassProto;
				if (superclassProto.constructor === objectConstructor) {
					superclassProto.constructor = superclass
				}
				subclass.override = function(overrides) {
					Ext.override(subclass, overrides)
				};
				subclassProto.override = inlineOverrides;
				subclassProto.proto = subclassProto;
				subclass.override(overrides);
				subclass.extend = function(o) {
					return Ext.extend(subclass, o)
				};
				return subclass
			}
		}(),
		override : function(cls, overrides) {
			if (cls.$isClass) {
				return cls.override(overrides)
			} else {
				Ext.apply(cls.prototype, overrides)
			}
		}
	});
	Ext.apply(Ext, {
				valueFrom : function(value, defaultValue, allowBlank) {
					return Ext.isEmpty(value, allowBlank)
							? defaultValue
							: value
				},
				typeOf : function(value) {
					if (value === null) {
						return "null"
					}
					var type = typeof value;
					if (type === "undefined" || type === "string"
							|| type === "number" || type === "boolean") {
						return type
					}
					var typeToString = toString.call(value);
					switch (typeToString) {
						case "[object Array]" :
							return "array";
						case "[object Date]" :
							return "date";
						case "[object Boolean]" :
							return "boolean";
						case "[object Number]" :
							return "number";
						case "[object RegExp]" :
							return "regexp"
					}
					if (type === "function") {
						return "function"
					}
					if (type === "object") {
						if (value.nodeType !== undefined) {
							if (value.nodeType === 3) {
								return (/\S/).test(value.nodeValue)
										? "textnode"
										: "whitespace"
							} else {
								return "element"
							}
						}
						return "object"
					}
				},
				isEmpty : function(value, allowEmptyString) {
					return (value === null) || (value === undefined)
							|| (!allowEmptyString ? value === "" : false)
							|| (Ext.isArray(value) && value.length === 0)
				},
				isArray : ("isArray" in Array)
						? Array.isArray
						: function(value) {
							return toString.call(value) === "[object Array]"
						},
				isDate : function(value) {
					return toString.call(value) === "[object Date]"
				},
				isObject : (toString.call(null) === "[object Object]")
						? function(value) {
							return value !== null
									&& value !== undefined
									&& toString.call(value) === "[object Object]"
									&& value.ownerDocument === undefined
						}
						: function(value) {
							return toString.call(value) === "[object Object]"
						},
				isSimpleObject : function(value) {
					return value instanceof Object
							&& value.constructor === Object
				},
				isPrimitive : function(value) {
					var type = typeof value;
					return type === "string" || type === "number"
							|| type === "boolean"
				},
				isFunction : (typeof document !== "undefined" && typeof document
						.getElementsByTagName("body") === "function")
						? function(value) {
							return toString.call(value) === "[object Function]"
						}
						: function(value) {
							return typeof value === "function"
						},
				isNumber : function(value) {
					return typeof value === "number" && isFinite(value)
				},
				isNumeric : function(value) {
					return !isNaN(parseFloat(value)) && isFinite(value)
				},
				isString : function(value) {
					return typeof value === "string"
				},
				isBoolean : function(value) {
					return typeof value === "boolean"
				},
				isElement : function(value) {
					return value ? value.nodeType === 1 : false
				},
				isTextNode : function(value) {
					return value ? value.nodeName === "#text" : false
				},
				isDefined : function(value) {
					return typeof value !== "undefined"
				},
				isIterable : function(value) {
					return (value && typeof value !== "string")
							? value.length !== undefined
							: false
				}
			});
	Ext.apply(Ext, {
				clone : function(item) {
					if (item === null || item === undefined) {
						return item
					}
					if (item.nodeType && item.cloneNode) {
						return item.cloneNode(true)
					}
					var type = toString.call(item);
					if (type === "[object Date]") {
						return new Date(item.getTime())
					}
					var i, j, k, clone, key;
					if (type === "[object Array]") {
						i = item.length;
						clone = [];
						while (i--) {
							clone[i] = Ext.clone(item[i])
						}
					} else {
						if (type === "[object Object]"
								&& item.constructor === Object) {
							clone = {};
							for (key in item) {
								clone[key] = Ext.clone(item[key])
							}
							if (enumerables) {
								for (j = enumerables.length; j--;) {
									k = enumerables[j];
									clone[k] = item[k]
								}
							}
						}
					}
					return clone || item
				},
				getUniqueGlobalNamespace : function() {
					var uniqueGlobalNamespace = this.uniqueGlobalNamespace;
					if (uniqueGlobalNamespace === undefined) {
						var i = 0;
						do {
							uniqueGlobalNamespace = "ExtBox" + (++i)
						} while (Ext.global[uniqueGlobalNamespace] !== undefined);
						Ext.global[uniqueGlobalNamespace] = Ext;
						this.uniqueGlobalNamespace = uniqueGlobalNamespace
					}
					return uniqueGlobalNamespace
				},
				functionFactory : function() {
					var args = Array.prototype.slice.call(arguments), ln = args.length;
					if (ln > 0) {
						args[ln - 1] = "var Ext=window."
								+ this.getUniqueGlobalNamespace() + ";"
								+ args[ln - 1]
					}
					return Function.prototype.constructor.apply(
							Function.prototype, args)
				},
				globalEval : ("execScript" in global) ? function(code) {
					global.execScript(code)
				} : function(code) {
					(function() {
						eval(code)
					})()
				}
			});
	Ext.type = Ext.typeOf
})();
(function() {
	var a = "4.1.0", b;
	Ext.Version = b = Ext.extend(Object, {
				constructor : function(d) {
					var c = this.toNumber, f, e;
					if (d instanceof b) {
						return d
					}
					this.version = this.shortVersion = String(d).toLowerCase()
							.replace(/_/g, ".").replace(/[\-+]/g, "");
					e = this.version.search(/([^\d\.])/);
					if (e !== -1) {
						this.release = this.version.substr(e, d.length);
						this.shortVersion = this.version.substr(0, e)
					}
					this.shortVersion = this.shortVersion.replace(/[^\d]/g, "");
					f = this.version.split(".");
					this.major = c(f.shift());
					this.minor = c(f.shift());
					this.patch = c(f.shift());
					this.build = c(f.shift());
					return this
				},
				toNumber : function(c) {
					c = parseInt(c || 0, 10);
					if (isNaN(c)) {
						c = 0
					}
					return c
				},
				toString : function() {
					return this.version
				},
				valueOf : function() {
					return this.version
				},
				getMajor : function() {
					return this.major || 0
				},
				getMinor : function() {
					return this.minor || 0
				},
				getPatch : function() {
					return this.patch || 0
				},
				getBuild : function() {
					return this.build || 0
				},
				getRelease : function() {
					return this.release || ""
				},
				isGreaterThan : function(c) {
					return b.compare(this.version, c) === 1
				},
				isGreaterThanOrEqual : function(c) {
					return b.compare(this.version, c) >= 0
				},
				isLessThan : function(c) {
					return b.compare(this.version, c) === -1
				},
				isLessThanOrEqual : function(c) {
					return b.compare(this.version, c) <= 0
				},
				equals : function(c) {
					return b.compare(this.version, c) === 0
				},
				match : function(c) {
					c = String(c);
					return this.version.substr(0, c.length) === c
				},
				toArray : function() {
					return [this.getMajor(), this.getMinor(), this.getPatch(),
							this.getBuild(), this.getRelease()]
				},
				getShortVersion : function() {
					return this.shortVersion
				},
				gt : function() {
					return this.isGreaterThan.apply(this, arguments)
				},
				lt : function() {
					return this.isLessThan.apply(this, arguments)
				},
				gtEq : function() {
					return this.isGreaterThanOrEqual.apply(this, arguments)
				},
				ltEq : function() {
					return this.isLessThanOrEqual.apply(this, arguments)
				}
			});
	Ext.apply(b, {
				releaseValueMap : {
					dev : -6,
					alpha : -5,
					a : -5,
					beta : -4,
					b : -4,
					rc : -3,
					"#" : -2,
					p : -1,
					pl : -1
				},
				getComponentValue : function(c) {
					return !c ? 0 : (isNaN(c)
							? this.releaseValueMap[c] || c
							: parseInt(c, 10))
				},
				compare : function(g, f) {
					var d, e, c;
					g = new b(g).toArray();
					f = new b(f).toArray();
					for (c = 0; c < Math.max(g.length, f.length); c++) {
						d = this.getComponentValue(g[c]);
						e = this.getComponentValue(f[c]);
						if (d < e) {
							return -1
						} else {
							if (d > e) {
								return 1
							}
						}
					}
					return 0
				}
			});
	Ext.apply(Ext, {
				versions : {},
				lastRegisteredVersion : null,
				setVersion : function(d, c) {
					Ext.versions[d] = new b(c);
					Ext.lastRegisteredVersion = Ext.versions[d];
					return this
				},
				getVersion : function(c) {
					if (c === undefined) {
						return Ext.lastRegisteredVersion
					}
					return Ext.versions[c]
				},
				deprecate : function(c, e, f, d) {
					if (b.compare(Ext.getVersion(c), e) < 1) {
						f.call(d)
					}
				}
			});
	Ext.setVersion("core", a)
})();
Ext.String = {
	trimRegex : /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
	escapeRe : /('|\\)/g,
	formatRe : /\{(\d+)\}/g,
	escapeRegexRe : /([-.*+?^${}()|[\]\/\\])/g,
	htmlEncode : (function() {
		var d = {
			"&" : "&amp;",
			">" : "&gt;",
			"<" : "&lt;",
			'"' : "&quot;"
		}, b = [], c, a;
		for (c in d) {
			b.push(c)
		}
		a = new RegExp("(" + b.join("|") + ")", "g");
		return function(e) {
			return (!e) ? e : String(e).replace(a, function(g, f) {
						return d[f]
					})
		}
	})(),
	htmlDecode : (function() {
		var d = {
			"&amp;" : "&",
			"&gt;" : ">",
			"&lt;" : "<",
			"&quot;" : '"'
		}, b = [], c, a;
		for (c in d) {
			b.push(c)
		}
		a = new RegExp("(" + b.join("|") + "|&#[0-9]{1,5};)", "g");
		return function(e) {
			return (!e) ? e : String(e).replace(a, function(g, f) {
						if (f in d) {
							return d[f]
						} else {
							return String
									.fromCharCode(parseInt(f.substr(2), 10))
						}
					})
		}
	})(),
	urlAppend : function(b, a) {
		if (!Ext.isEmpty(a)) {
			return b + (b.indexOf("?") === -1 ? "?" : "&") + a
		}
		return b
	},
	trim : function(a) {
		return a.replace(Ext.String.trimRegex, "")
	},
	capitalize : function(a) {
		return a.charAt(0).toUpperCase() + a.substr(1)
	},
	ellipsis : function(c, a, d) {
		if (c && c.length > a) {
			if (d) {
				var e = c.substr(0, a - 2), b = Math.max(e.lastIndexOf(" "), e
								.lastIndexOf("."), e.lastIndexOf("!"), e
								.lastIndexOf("?"));
				if (b !== -1 && b >= (a - 15)) {
					return e.substr(0, b) + "..."
				}
			}
			return c.substr(0, a - 3) + "..."
		}
		return c
	},
	escapeRegex : function(a) {
		return a.replace(Ext.String.escapeRegexRe, "\\$1")
	},
	escape : function(a) {
		return a.replace(Ext.String.escapeRe, "\\$1")
	},
	toggle : function(b, c, a) {
		return b === c ? a : c
	},
	leftPad : function(b, c, d) {
		var a = String(b);
		d = d || " ";
		while (a.length < c) {
			a = d + a
		}
		return a
	},
	format : function(b) {
		var a = Ext.Array.toArray(arguments, 1);
		return b.replace(Ext.String.formatRe, function(c, d) {
					return a[d]
				})
	},
	repeat : function(e, d, b) {
		for (var a = [], c = d; c--;) {
			a.push(e)
		}
		return a.join(b || "")
	}
};
Ext.htmlEncode = Ext.String.htmlEncode;
Ext.htmlDecode = Ext.String.htmlDecode;
Ext.urlAppend = Ext.String.urlAppend;
(function() {
	var f = Array.prototype, n = f.slice, p = function() {
		var z = [], e, y = 20;
		if (!z.splice) {
			return false
		}
		while (y--) {
			z.push("A")
		}
		z.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F",
				"F", "F", "F", "F", "F", "F", "F", "F", "F", "F");
		e = z.length;
		z.splice(13, 0, "XXX");
		if (e + 1 != z.length) {
			return false
		}
		return true
	}(), i = "forEach" in f, t = "map" in f, o = "indexOf" in f, x = "every" in f, c = "some" in f, d = "filter" in f, m = function() {
		var e = [1, 2, 3, 4, 5].sort(function() {
					return 0
				});
		return e[0] === 1 && e[1] === 2 && e[2] === 3 && e[3] === 4
				&& e[4] === 5
	}(), j = true, a;
	try {
		if (typeof document !== "undefined") {
			n.call(document.getElementsByTagName("body"))
		}
	} catch (r) {
		j = false
	}
	function l(y, e) {
		return (e < 0) ? Math.max(0, y.length + e) : Math.min(y.length, e)
	}
	function w(F, E, y, I) {
		var J = I ? I.length : 0, A = F.length, G = l(F, E);
		if (G === A) {
			if (J) {
				F.push.apply(F, I)
			}
		} else {
			var D = Math.min(y, A - G), H = G + D, z = H + J - D, e = A - H, B = A
					- D, C;
			if (z < H) {
				for (C = 0; C < e; ++C) {
					F[z + C] = F[H + C]
				}
			} else {
				if (z > H) {
					for (C = e; C--;) {
						F[z + C] = F[H + C]
					}
				}
			}
			if (J && G === B) {
				F.length = B;
				F.push.apply(F, I)
			} else {
				F.length = B + J;
				for (C = 0; C < J; ++C) {
					F[G + C] = I[C]
				}
			}
		}
		return F
	}
	function h(A, e, z, y) {
		if (y && y.length) {
			if (e < A.length) {
				A.splice.apply(A, [e, z].concat(y))
			} else {
				A.push.apply(A, y)
			}
		} else {
			A.splice(e, z)
		}
		return A
	}
	function b(z, e, y) {
		return w(z, e, y)
	}
	function q(z, e, y) {
		z.splice(e, y);
		return z
	}
	function k(B, e, z) {
		var A = l(B, e), y = B.slice(e, l(B, A + z));
		if (arguments.length < 4) {
			w(B, A, z)
		} else {
			w(B, A, z, n.call(arguments, 3))
		}
		return y
	}
	function g(e) {
		return e.splice.apply(e, n.call(arguments, 1))
	}
	var v = p ? q : b, s = p ? h : w, u = p ? g : k;
	a = Ext.Array = {
		each : function(C, A, z, e) {
			C = a.from(C);
			var y, B = C.length;
			if (e !== true) {
				for (y = 0; y < B; y++) {
					if (A.call(z || C[y], C[y], y, C) === false) {
						return y
					}
				}
			} else {
				for (y = B - 1; y > -1; y--) {
					if (A.call(z || C[y], C[y], y, C) === false) {
						return y
					}
				}
			}
			return true
		},
		forEach : i ? function(z, y, e) {
			return z.forEach(y, e)
		} : function(B, z, y) {
			var e = 0, A = B.length;
			for (; e < A; e++) {
				z.call(y, B[e], e, B)
			}
		},
		indexOf : (o) ? function(z, e, y) {
			return z.indexOf(e, y)
		} : function(B, z, A) {
			var e, y = B.length;
			for (e = (A < 0) ? Math.max(0, y + A) : A || 0; e < y; e++) {
				if (B[e] === z) {
					return e
				}
			}
			return -1
		},
		contains : o ? function(y, e) {
			return y.indexOf(e) !== -1
		} : function(A, z) {
			var e, y;
			for (e = 0, y = A.length; e < y; e++) {
				if (A[e] === z) {
					return true
				}
			}
			return false
		},
		toArray : function(z, B, e) {
			if (!z || !z.length) {
				return []
			}
			if (typeof z === "string") {
				z = z.split("")
			}
			if (j) {
				return n.call(z, B || 0, e || z.length)
			}
			var A = [], y;
			B = B || 0;
			e = e ? ((e < 0) ? z.length + e : e) : z.length;
			for (y = B; y < e; y++) {
				A.push(z[y])
			}
			return A
		},
		pluck : function(C, e) {
			var y = [], z, B, A;
			for (z = 0, B = C.length; z < B; z++) {
				A = C[z];
				y.push(A[e])
			}
			return y
		},
		map : t ? function(z, y, e) {
			return z.map(y, e)
		} : function(C, B, A) {
			var z = [], y = 0, e = C.length;
			for (; y < e; y++) {
				z[y] = B.call(A, C[y], y, C)
			}
			return z
		},
		every : function(B, z, y) {
			if (x) {
				return B.every(z, y)
			}
			var e = 0, A = B.length;
			for (; e < A; ++e) {
				if (!z.call(y, B[e], e, B)) {
					return false
				}
			}
			return true
		},
		some : function(B, z, y) {
			if (c) {
				return B.some(z, y)
			}
			var e = 0, A = B.length;
			for (; e < A; ++e) {
				if (z.call(y, B[e], e, B)) {
					return true
				}
			}
			return false
		},
		clean : function(B) {
			var y = [], e = 0, A = B.length, z;
			for (; e < A; e++) {
				z = B[e];
				if (!Ext.isEmpty(z)) {
					y.push(z)
				}
			}
			return y
		},
		unique : function(B) {
			var A = [], e = 0, z = B.length, y;
			for (; e < z; e++) {
				y = B[e];
				if (a.indexOf(A, y) === -1) {
					A.push(y)
				}
			}
			return A
		},
		filter : function(C, A, z) {
			if (d) {
				return C.filter(A, z)
			}
			var y = [], e = 0, B = C.length;
			for (; e < B; e++) {
				if (A.call(z, C[e], e, C)) {
					y.push(C[e])
				}
			}
			return y
		},
		from : function(y, e) {
			if (y === undefined || y === null) {
				return []
			}
			if (Ext.isArray(y)) {
				return (e) ? n.call(y) : y
			}
			if (y && y.length !== undefined && typeof y !== "string") {
				return a.toArray(y)
			}
			return [y]
		},
		remove : function(z, y) {
			var e = a.indexOf(z, y);
			if (e !== -1) {
				v(z, e, 1)
			}
			return z
		},
		include : function(y, e) {
			if (!a.contains(y, e)) {
				y.push(e)
			}
		},
		clone : function(e) {
			return n.call(e)
		},
		merge : function() {
			var e = n.call(arguments), A = [], y, z;
			for (y = 0, z = e.length; y < z; y++) {
				A = A.concat(e[y])
			}
			return a.unique(A)
		},
		intersect : function() {
			var A = [], e = n.call(arguments), E, C, B, G, H, K, J, I, z, D;
			if (!e.length) {
				return A
			}
			for (E = K = 0, I = e.length; E < I, H = e[E]; E++) {
				if (!G || H.length < G.length) {
					G = H;
					K = E
				}
			}
			G = a.unique(G);
			v(e, K, 1);
			for (E = 0, I = G.length; E < I, K = G[E]; E++) {
				var F = 0;
				for (C = 0, z = e.length; C < z, H = e[C]; C++) {
					for (B = 0, D = H.length; B < D, J = H[B]; B++) {
						if (K === J) {
							F++;
							break
						}
					}
				}
				if (F === z) {
					A.push(K)
				}
			}
			return A
		},
		difference : function(y, e) {
			var D = n.call(y), B = D.length, A, z, C;
			for (A = 0, C = e.length; A < C; A++) {
				for (z = 0; z < B; z++) {
					if (D[z] === e[A]) {
						v(D, z, 1);
						z--;
						B--
					}
				}
			}
			return D
		},
		slice : function(z, y, e) {
			return n.call(z, y, e)
		},
		sort : function(E, D) {
			if (m) {
				if (D) {
					return E.sort(D)
				} else {
					return E.sort()
				}
			}
			var B = E.length, A = 0, C, e, z, y;
			for (; A < B; A++) {
				z = A;
				for (e = A + 1; e < B; e++) {
					if (D) {
						C = D(E[e], E[z]);
						if (C < 0) {
							z = e
						}
					} else {
						if (E[e] < E[z]) {
							z = e
						}
					}
				}
				if (z !== A) {
					y = E[A];
					E[A] = E[z];
					E[z] = y
				}
			}
			return E
		},
		flatten : function(z) {
			var y = [];
			function e(A) {
				var C, D, B;
				for (C = 0, D = A.length; C < D; C++) {
					B = A[C];
					if (Ext.isArray(B)) {
						e(B)
					} else {
						y.push(B)
					}
				}
				return y
			}
			return e(z)
		},
		min : function(C, B) {
			var y = C[0], e, A, z;
			for (e = 0, A = C.length; e < A; e++) {
				z = C[e];
				if (B) {
					if (B(y, z) === 1) {
						y = z
					}
				} else {
					if (z < y) {
						y = z
					}
				}
			}
			return y
		},
		max : function(C, B) {
			var e = C[0], y, A, z;
			for (y = 0, A = C.length; y < A; y++) {
				z = C[y];
				if (B) {
					if (B(e, z) === -1) {
						e = z
					}
				} else {
					if (z > e) {
						e = z
					}
				}
			}
			return e
		},
		mean : function(e) {
			return e.length > 0 ? a.sum(e) / e.length : undefined
		},
		sum : function(B) {
			var y = 0, e, A, z;
			for (e = 0, A = B.length; e < A; e++) {
				z = B[e];
				y += z
			}
			return y
		},
		erase : v,
		insert : function(z, y, e) {
			return s(z, y, 0, e)
		},
		replace : s,
		splice : u
	};
	Ext.each = a.each;
	a.union = a.merge;
	Ext.min = a.min;
	Ext.max = a.max;
	Ext.sum = a.sum;
	Ext.mean = a.mean;
	Ext.flatten = a.flatten;
	Ext.clean = a.clean;
	Ext.unique = a.unique;
	Ext.pluck = a.pluck;
	Ext.toArray = function() {
		return a.toArray.apply(a, arguments)
	}
})();
(function() {
	var a = (0.9).toFixed() !== "1";
	Ext.Number = {
		constrain : function(d, c, b) {
			d = parseFloat(d);
			if (!isNaN(c)) {
				d = Math.max(d, c)
			}
			if (!isNaN(b)) {
				d = Math.min(d, b)
			}
			return d
		},
		snap : function(e, c, d, g) {
			var f = e, b;
			if (!(c && e)) {
				return e
			}
			b = e % c;
			if (b !== 0) {
				f -= b;
				if (b * 2 >= c) {
					f += c
				} else {
					if (b * 2 < -c) {
						f -= c
					}
				}
			}
			return Ext.Number.constrain(f, d, g)
		},
		toFixed : function(d, b) {
			if (a) {
				b = b || 0;
				var c = Math.pow(10, b);
				return (Math.round(d * c) / c).toFixed(b)
			}
			return d.toFixed(b)
		},
		from : function(c, b) {
			if (isFinite(c)) {
				c = parseFloat(c)
			}
			return !isNaN(c) ? c : b
		}
	}
})();
Ext.num = function() {
	return Ext.Number.from.apply(this, arguments)
};
(function() {
	var a = function() {
	};
	var b = Ext.Object = {
		chain : function(d) {
			a.prototype = d;
			var c = new a();
			a.prototype = null;
			return c
		},
		toQueryObjects : function(e, j, d) {
			var c = b.toQueryObjects, h = [], f, g;
			if (Ext.isArray(j)) {
				for (f = 0, g = j.length; f < g; f++) {
					if (d) {
						h = h.concat(c(e + "[" + f + "]", j[f], true))
					} else {
						h.push({
									name : e,
									value : j[f]
								})
					}
				}
			} else {
				if (Ext.isObject(j)) {
					for (f in j) {
						if (j.hasOwnProperty(f)) {
							if (d) {
								h = h.concat(c(e + "[" + f + "]", j[f], true))
							} else {
								h.push({
											name : e,
											value : j[f]
										})
							}
						}
					}
				} else {
					h.push({
								name : e,
								value : j
							})
				}
			}
			return h
		},
		toQueryString : function(f, d) {
			var g = [], e = [], k, h, l, c, m;
			for (k in f) {
				if (f.hasOwnProperty(k)) {
					g = g.concat(b.toQueryObjects(k, f[k], d))
				}
			}
			for (h = 0, l = g.length; h < l; h++) {
				c = g[h];
				m = c.value;
				if (Ext.isEmpty(m)) {
					m = ""
				} else {
					if (Ext.isDate(m)) {
						m = Ext.Date.toString(m)
					}
				}
				e.push(encodeURIComponent(c.name) + "="
						+ encodeURIComponent(String(m)))
			}
			return e.join("&")
		},
		fromQueryString : function(d, q) {
			var l = d.replace(/^\?/, "").split("&"), t = {}, r, h, v, m, p, f, n, o, c, g, s, k, u, e;
			for (p = 0, f = l.length; p < f; p++) {
				n = l[p];
				if (n.length > 0) {
					h = n.split("=");
					v = decodeURIComponent(h[0]);
					m = (h[1] !== undefined) ? decodeURIComponent(h[1]) : "";
					if (!q) {
						if (t.hasOwnProperty(v)) {
							if (!Ext.isArray(t[v])) {
								t[v] = [t[v]]
							}
							t[v].push(m)
						} else {
							t[v] = m
						}
					} else {
						g = v.match(/(\[):?([^\]]*)\]/g);
						s = v.match(/^([^\[]+)/);
						v = s[0];
						k = [];
						if (g === null) {
							t[v] = m;
							continue
						}
						for (o = 0, c = g.length; o < c; o++) {
							u = g[o];
							u = (u.length === 2) ? "" : u.substring(1, u.length
											- 1);
							k.push(u)
						}
						k.unshift(v);
						r = t;
						for (o = 0, c = k.length; o < c; o++) {
							u = k[o];
							if (o === c - 1) {
								if (Ext.isArray(r) && u === "") {
									r.push(m)
								} else {
									r[u] = m
								}
							} else {
								if (r[u] === undefined
										|| typeof r[u] === "string") {
									e = k[o + 1];
									r[u] = (Ext.isNumeric(e) || e === "")
											? []
											: {}
								}
								r = r[u]
							}
						}
					}
				}
			}
			return t
		},
		each : function(c, e, d) {
			for (var f in c) {
				if (c.hasOwnProperty(f)) {
					if (e.call(d || c, f, c[f], c) === false) {
						return
					}
				}
			}
		},
		merge : function(c) {
			var h = 1, j = arguments.length, d = b.merge, f = Ext.clone, g, l, k, e;
			for (; h < j; h++) {
				g = arguments[h];
				for (l in g) {
					k = g[l];
					if (k && k.constructor === Object) {
						e = c[l];
						if (e && e.constructor === Object) {
							d(e, k)
						} else {
							c[l] = f(k)
						}
					} else {
						c[l] = k
					}
				}
			}
			return c
		},
		mergeIf : function(j) {
			var f = 1, g = arguments.length, d = Ext.clone, c, e, h;
			for (; f < g; f++) {
				c = arguments[f];
				for (e in c) {
					if (!(e in j)) {
						h = c[e];
						if (h && h.constructor === Object) {
							j[e] = d(h)
						} else {
							j[e] = h
						}
					}
				}
			}
			return j
		},
		getKey : function(c, e) {
			for (var d in c) {
				if (c.hasOwnProperty(d) && c[d] === e) {
					return d
				}
			}
			return null
		},
		getValues : function(d) {
			var c = [], e;
			for (e in d) {
				if (d.hasOwnProperty(e)) {
					c.push(d[e])
				}
			}
			return c
		},
		getKeys : ("keys" in Object) ? Object.keys : function(c) {
			var d = [], e;
			for (e in c) {
				if (c.hasOwnProperty(e)) {
					d.push(e)
				}
			}
			return d
		},
		getSize : function(c) {
			var d = 0, e;
			for (e in c) {
				if (c.hasOwnProperty(e)) {
					d++
				}
			}
			return d
		},
		classify : function(f) {
			var e = f, h = [], d = {}, c = function() {
				var j = 0, k = h.length, l;
				for (; j < k; j++) {
					l = h[j];
					this[l] = new d[l]
				}
			}, g, i;
			for (g in f) {
				if (f.hasOwnProperty(g)) {
					i = f[g];
					if (i && i.constructor === Object) {
						h.push(g);
						d[g] = b.classify(i)
					}
				}
			}
			c.prototype = e;
			return c
		},
		defineProperty : ("defineProperty" in Object)
				? Object.defineProperty
				: function(d, c, e) {
					if (e.get) {
						d.__defineGetter__(c, e.get)
					}
					if (e.set) {
						d.__defineSetter__(c, e.set)
					}
				}
	};
	Ext.merge = Ext.Object.merge;
	Ext.mergeIf = Ext.Object.mergeIf;
	Ext.urlEncode = function() {
		var c = Ext.Array.from(arguments), d = "";
		if ((typeof c[1] === "string")) {
			d = c[1] + "&";
			c[1] = false
		}
		return d + b.toQueryString.apply(b, c)
	};
	Ext.urlDecode = function() {
		return b.fromQueryString.apply(b, arguments)
	}
})();
Ext.Function = {
	flexSetter : function(a) {
		return function(d, c) {
			var e, f;
			if (d === null) {
				return this
			}
			if (typeof d !== "string") {
				for (e in d) {
					if (d.hasOwnProperty(e)) {
						a.call(this, e, d[e])
					}
				}
				if (Ext.enumerables) {
					for (f = Ext.enumerables.length; f--;) {
						e = Ext.enumerables[f];
						if (d.hasOwnProperty(e)) {
							a.call(this, e, d[e])
						}
					}
				}
			} else {
				a.call(this, d, c)
			}
			return this
		}
	},
	bind : function(d, c, b, a) {
		if (arguments.length === 2) {
			return function() {
				return d.apply(c, arguments)
			}
		}
		var f = d, e = Array.prototype.slice;
		return function() {
			var g = b || arguments;
			if (a === true) {
				g = e.call(arguments, 0);
				g = g.concat(b)
			} else {
				if (typeof a == "number") {
					g = e.call(arguments, 0);
					Ext.Array.insert(g, a, b)
				}
			}
			return f.apply(c || window, g)
		}
	},
	pass : function(c, a, b) {
		if (!Ext.isArray(a)) {
			a = Ext.Array.clone(a)
		}
		return function() {
			a.push.apply(a, arguments);
			return c.apply(b || this, a)
		}
	},
	alias : function(b, a) {
		return function() {
			return b[a].apply(b, arguments)
		}
	},
	clone : function(a) {
		return function() {
			return a.apply(this, arguments)
		}
	},
	createInterceptor : function(d, c, b, a) {
		var e = d;
		if (!Ext.isFunction(c)) {
			return d
		} else {
			return function() {
				var g = this, f = arguments;
				c.target = g;
				c.method = d;
				return (c.apply(b || g || window, f) !== false) ? d.apply(g
								|| window, f) : a || null
			}
		}
	},
	createDelayed : function(e, c, d, b, a) {
		if (d || b) {
			e = Ext.Function.bind(e, d, b, a)
		}
		return function() {
			var g = this, f = Array.prototype.slice.call(arguments);
			setTimeout(function() {
						e.apply(g, f)
					}, c)
		}
	},
	defer : function(e, c, d, b, a) {
		e = Ext.Function.bind(e, d, b, a);
		if (c > 0) {
			return setTimeout(e, c)
		}
		e();
		return 0
	},
	createSequence : function(b, c, a) {
		if (!c) {
			return b
		} else {
			return function() {
				var d = b.apply(this, arguments);
				c.apply(a || this, arguments);
				return d
			}
		}
	},
	createBuffered : function(e, b, d, c) {
		var a;
		return function() {
			if (!d) {
				d = this
			}
			if (!c) {
				c = Array.prototype.slice.call(arguments)
			}
			if (a) {
				clearTimeout(a);
				a = null
			}
			a = setTimeout(function() {
						e.apply(d, c)
					}, b)
		}
	},
	createThrottled : function(e, b, d) {
		var f, a, c, h, g = function() {
			e.apply(d || this, c);
			f = new Date().getTime()
		};
		return function() {
			a = new Date().getTime() - f;
			c = arguments;
			clearTimeout(h);
			if (!f || (a >= b)) {
				g()
			} else {
				h = setTimeout(g, b - a)
			}
		}
	},
	interceptBefore : function(b, a, c) {
		var d = b[a] || Ext.emptyFn;
		return b[a] = function() {
			var e = c.apply(this, arguments);
			d.apply(this, arguments);
			return e
		}
	},
	interceptAfter : function(b, a, c) {
		var d = b[a] || Ext.emptyFn;
		return b[a] = function() {
			d.apply(this, arguments);
			return c.apply(this, arguments)
		}
	}
};
Ext.defer = Ext.Function.alias(Ext.Function, "defer");
Ext.pass = Ext.Function.alias(Ext.Function, "pass");
Ext.bind = Ext.Function.alias(Ext.Function, "bind");
Ext.JSON = new (function() {
	var useHasOwn = !!{}.hasOwnProperty, isNative = function() {
		var useNative = null;
		return function() {
			if (useNative === null) {
				useNative = Ext.USE_NATIVE_JSON && window.JSON
						&& JSON.toString() == "[object JSON]"
			}
			return useNative
		}
	}(), pad = function(n) {
		return n < 10 ? "0" + n : n
	}, doDecode = function(json) {
		return eval("(" + json + ")")
	}, doEncode = function(o) {
		if (!Ext.isDefined(o) || o === null) {
			return "null"
		} else {
			if (Ext.isArray(o)) {
				return encodeArray(o)
			} else {
				if (Ext.isDate(o)) {
					return Ext.JSON.encodeDate(o)
				} else {
					if (Ext.isString(o)) {
						return encodeString(o)
					} else {
						if (typeof o == "number") {
							return isFinite(o) ? String(o) : "null"
						} else {
							if (Ext.isBoolean(o)) {
								return String(o)
							} else {
								if (Ext.isObject(o)) {
									return encodeObject(o)
								} else {
									if (typeof o === "function") {
										return "null"
									}
								}
							}
						}
					}
				}
			}
		}
		return "undefined"
	}, m = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\",
		"\x0b" : "\\u000b"
	}, charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g, encodeString = function(s) {
		return '"' + s.replace(charToReplace, function(a) {
					var c = m[a];
					return typeof c === "string" ? c : "\\u"
							+ ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				}) + '"'
	}, encodeArray = function(o) {
		var a = ["[", ""], len = o.length, i;
		for (i = 0; i < len; i += 1) {
			a.push(doEncode(o[i]), ",")
		}
		a[a.length - 1] = "]";
		return a.join("")
	}, encodeObject = function(o) {
		var a = ["{", ""], i;
		for (i in o) {
			if (!useHasOwn || o.hasOwnProperty(i)) {
				a.push(doEncode(i), ":", doEncode(o[i]), ",")
			}
		}
		a[a.length - 1] = "}";
		return a.join("")
	};
	this.encodeDate = function(o) {
		return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-"
				+ pad(o.getDate()) + "T" + pad(o.getHours()) + ":"
				+ pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"'
	};
	this.encode = function() {
		var ec;
		return function(o) {
			if (!ec) {
				ec = isNative() ? JSON.stringify : doEncode
			}
			return ec(o)
		}
	}();
	this.decode = function() {
		var dc;
		return function(json, safe) {
			if (!dc) {
				dc = isNative() ? JSON.parse : doDecode
			}
			try {
				return dc(json)
			} catch (e) {
				if (safe === true) {
					return null
				}
				Ext.Error.raise({
							sourceClass : "Ext.JSON",
							sourceMethod : "decode",
							msg : "You're trying to decode an invalid JSON String: "
									+ json
						})
			}
		}
	}()
})();
Ext.encode = Ext.JSON.encode;
Ext.decode = Ext.JSON.decode;
Ext.Error = {
	raise : function(a) {
		throw new Error(a.msg)
	}
};
Ext.Date = {
	now : Date.now,
	toString : function(a) {
		if (!a) {
			a = new Date()
		}
		var b = Ext.String.leftPad;
		return a.getFullYear() + "-" + b(a.getMonth() + 1, 2, "0") + "-"
				+ b(a.getDate(), 2, "0") + "T" + b(a.getHours(), 2, "0") + ":"
				+ b(a.getMinutes(), 2, "0") + ":" + b(a.getSeconds(), 2, "0")
	}
};
(function(a) {
	var c = [], b = function() {
	};
	Ext.apply(b, {
		$className : "Ext.Base",
		$isClass : true,
		create : function() {
			return Ext.create.apply(Ext, [this].concat(Array.prototype.slice
							.call(arguments, 0)))
		},
		extend : function(h) {
			var d = h.prototype, f, g, j, e, k;
			f = this.prototype = Ext.Object.chain(d);
			f.self = this;
			this.superclass = f.superclass = d;
			if (!h.$isClass) {
				Ext.apply(f, Ext.Base.prototype);
				f.constructor = function() {
					d.constructor.apply(this, arguments)
				}
			}
			k = d.$inheritableStatics;
			if (k) {
				for (g = 0, j = k.length; g < j; g++) {
					e = k[g];
					if (!this.hasOwnProperty(e)) {
						this[e] = h[e]
					}
				}
			}
			if (h.$onExtended) {
				this.$onExtended = h.$onExtended.slice()
			}
			f.config = f.defaultConfig = new f.configClass;
			f.initConfigList = f.initConfigList.slice();
			f.initConfigMap = Ext.Object.chain(f.initConfigMap)
		},
		"$onExtended" : [],
		triggerExtended : function() {
			var f = this.$onExtended, e = f.length, d, g;
			if (e > 0) {
				for (d = 0; d < e; d++) {
					g = f[d];
					g.fn.apply(g.scope || this, arguments)
				}
			}
		},
		onExtended : function(e, d) {
			this.$onExtended.push({
						fn : e,
						scope : d
					});
			return this
		},
		addConfig : function(f, i) {
			var j = this.prototype, g = j.initConfigList, e = j.initConfigMap, h = j.defaultConfig, l, d, k;
			i = Boolean(i);
			for (d in f) {
				if (f.hasOwnProperty(d) && (i || !(d in h))) {
					k = f[d];
					l = e[d];
					if (k !== null) {
						if (!l) {
							e[d] = true;
							g.push(d)
						}
					} else {
						if (l) {
							e[d] = false;
							Ext.Array.remove(g, d)
						}
					}
				}
			}
			if (i) {
				Ext.merge(h, f)
			} else {
				Ext.mergeIf(h, f)
			}
			j.configClass = Ext.Object.classify(h)
		},
		addStatics : function(d) {
			var f, e;
			for (e in d) {
				if (d.hasOwnProperty(e)) {
					f = d[e];
					this[e] = f
				}
			}
			return this
		},
		addInheritableStatics : function(e) {
			var h, d, g = this.prototype, f, i;
			h = g.$inheritableStatics;
			d = g.$hasInheritableStatics;
			if (!h) {
				h = g.$inheritableStatics = [];
				d = g.$hasInheritableStatics = {}
			}
			for (f in e) {
				if (e.hasOwnProperty(f)) {
					i = e[f];
					this[f] = i;
					if (!d[f]) {
						d[f] = true;
						h.push(f)
					}
				}
			}
			return this
		},
		addMembers : function(e) {
			var g = this.prototype, d = Ext.enumerables, k = [], h, j, f, l;
			for (f in e) {
				k.push(f)
			}
			if (d) {
				k.push.apply(k, d)
			}
			for (h = 0, j = k.length; h < j; h++) {
				f = k[h];
				if (e.hasOwnProperty(f)) {
					l = e[f];
					if (typeof l == "function" && !l.$isClass
							&& l !== Ext.emptyFn) {
						l.$owner = this;
						l.$name = f
					}
					g[f] = l
				}
			}
			return this
		},
		addMember : function(d, e) {
			if (typeof e == "function" && !e.$isClass && e !== Ext.emptyFn) {
				e.$owner = this;
				e.$name = d
			}
			this.prototype[d] = e;
			return this
		},
		implement : function() {
			this.addMembers.apply(this, arguments)
		},
		borrow : function(h, f) {
			var m = this.prototype, l = h.prototype, g, j, e, k, d;
			f = Ext.Array.from(f);
			for (g = 0, j = f.length; g < j; g++) {
				e = f[g];
				d = l[e];
				if (typeof d == "function") {
					k = function() {
						return d.apply(this, arguments)
					};
					k.$owner = this;
					k.$name = e;
					m[e] = k
				} else {
					m[e] = d
				}
			}
			return this
		},
		override : function(e) {
			var l = this, n = Ext.enumerables, j = l.prototype, g = Ext.Function.clone, d, i, f, m, k, h;
			if (arguments.length === 2) {
				d = e;
				e = {};
				e[d] = arguments[1];
				n = null
			}
			do {
				k = [];
				m = null;
				for (d in e) {
					if (d == "statics") {
						m = e[d]
					} else {
						if (d == "config") {
							l.addConfig(e[d], true)
						} else {
							k.push(d)
						}
					}
				}
				if (n) {
					k.push.apply(k, n)
				}
				for (i = k.length; i--;) {
					d = k[i];
					if (e.hasOwnProperty(d)) {
						f = e[d];
						if (typeof f == "function" && !f.$className
								&& f !== Ext.emptyFn) {
							if (typeof f.$owner != "undefined") {
								f = g(f)
							}
							f.$owner = l;
							f.$name = d;
							h = j[d];
							if (h) {
								f.$previous = h
							}
						}
						j[d] = f
					}
				}
				j = l;
				e = m
			} while (e);
			return this
		},
		callParent : function(d) {
			var e;
			return (e = this.callParent.caller)
					&& (e.$previous || ((e = e.$owner ? e : e.caller) && e.$owner.superclass.$class[e.$name]))
							.apply(this, d || c)
		},
		mixin : function(f, h) {
			var d = h.prototype, e = this.prototype, g;
			if (typeof d.onClassMixedIn != "undefined") {
				d.onClassMixedIn.call(h, this)
			}
			if (!e.hasOwnProperty("mixins")) {
				if ("mixins" in e) {
					e.mixins = Ext.Object.chain(e.mixins)
				} else {
					e.mixins = {}
				}
			}
			for (g in d) {
				if (g === "mixins") {
					Ext.merge(e.mixins, d[g])
				} else {
					if (typeof e[g] == "undefined" && g != "mixinId"
							&& g != "config") {
						e[g] = d[g]
					}
				}
			}
			if ("config" in d) {
				this.addConfig(d.config, false)
			}
			e.mixins[f] = d
		},
		getName : function() {
			return Ext.getClassName(this)
		},
		createAlias : a(function(e, d) {
					this.override(e, function() {
								return this[d].apply(this, arguments)
							})
				}),
		addXtype : function(h) {
			var e = this.prototype, g = e.xtypesMap, f = e.xtypes, d = e.xtypesChain;
			if (!e.hasOwnProperty("xtypesMap")) {
				g = e.xtypesMap = Ext.merge({}, e.xtypesMap || {});
				f = e.xtypes = e.xtypes ? [].concat(e.xtypes) : [];
				d = e.xtypesChain = e.xtypesChain
						? [].concat(e.xtypesChain)
						: [];
				e.xtype = h
			}
			if (!g[h]) {
				g[h] = true;
				f.push(h);
				d.push(h);
				Ext.ClassManager.setAlias(this, "widget." + h)
			}
			return this
		}
	});
	b.implement({
		isInstance : true,
		$className : "Ext.Base",
		configClass : Ext.emptyFn,
		initConfigList : [],
		initConfigMap : {},
		statics : function() {
			var e = this.statics.caller, d = this.self;
			if (!e) {
				return d
			}
			return e.$owner
		},
		callParent : function(e) {
			var f, d = (f = this.callParent.caller)
					&& (f.$previous || ((f = f.$owner ? f : f.caller) && f.$owner.superclass[f.$name]));
			return d.apply(this, e || c)
		},
		self : b,
		constructor : function() {
			return this
		},
		wasInstantiated : false,
		initConfig : function(m) {
			var l = Ext.Class.configNameCache, p = this.self.prototype, h = this.initConfigList, f = this.initConfigMap, g = new this.configClass, j = this.defaultConfig, k, o, e, q, n, d;
			this.initConfig = Ext.emptyFn;
			this.initialConfig = m || {};
			if (m) {
				Ext.merge(g, m)
			}
			this.config = g;
			if (!p.hasOwnProperty("wasInstantiated")) {
				p.wasInstantiated = true;
				for (k = 0, o = h.length; k < o; k++) {
					e = h[k];
					n = l[e];
					q = j[e];
					if (!(n.apply in p) && !(n.update in p)
							&& p[n.set].$isDefault && typeof q != "object") {
						p[n.internal] = j[e];
						f[e] = false;
						Ext.Array.remove(h, e);
						k--;
						o--
					}
				}
			}
			if (m) {
				h = h.slice();
				for (e in m) {
					if (e in j && !f[e]) {
						h.push(e)
					}
				}
			}
			for (k = 0, o = h.length; k < o; k++) {
				e = h[k];
				n = l[e];
				this[n.get] = this[n.initGet]
			}
			this.beforeInitConfig(g);
			for (k = 0, o = h.length; k < o; k++) {
				e = h[k];
				n = l[e];
				d = n.get;
				if (this.hasOwnProperty(d)) {
					this[n.set].call(this, g[e]);
					delete this[d]
				}
			}
			return this
		},
		beforeInitConfig : Ext.emptyFn,
		getCurrentConfig : function() {
			var d = this.defaultConfig, g = Ext.Class.configNameCache, f = {}, e, h;
			for (e in d) {
				h = g[e];
				f[e] = this[h.get].call(this)
			}
			return f
		},
		setConfig : function(e, l) {
			if (!e) {
				return this
			}
			var h = Ext.Class.configNameCache, j = this.config, f = this.defaultConfig, o = this.initialConfig, k = [], d, g, n, m;
			l = Boolean(l);
			for (d in e) {
				if ((l && (d in o))) {
					continue
				}
				j[d] = e[d];
				if (d in f) {
					k.push(d);
					m = h[d];
					this[m.get] = this[m.initGet]
				}
			}
			for (g = 0, n = k.length; g < n; g++) {
				d = k[g];
				m = h[d];
				this[m.set].call(this, e[d]);
				delete this[m.get]
			}
			return this
		},
		getConfig : function(d) {
			return this[Ext.Class.configNameCache[d].get].call(this)
		},
		hasConfig : function(d) {
			return (d in this.defaultConfig)
		},
		getInitialConfig : function(e) {
			var d = this.config;
			if (!e) {
				return d
			} else {
				return d[e]
			}
		},
		onConfigUpdate : function(j, l, m) {
			var n = this.self, f, h, d, g, k, e;
			j = Ext.Array.from(j);
			m = m || this;
			for (f = 0, h = j.length; f < h; f++) {
				d = j[f];
				g = "update" + Ext.String.capitalize(d);
				k = this[g] || Ext.emptyFn;
				e = function() {
					k.apply(this, arguments);
					m[l].apply(m, arguments)
				};
				e.$name = g;
				e.$owner = n;
				this[g] = e
			}
		},
		destroy : function() {
			this.destroy = Ext.emptyFn;
			this.isDestroyed = true
		}
	});
	b.prototype.callOverridden = b.prototype.callParent;
	Ext.Base = b
})(Ext.Function.flexSetter);
(function() {
	var b, a = Ext.Base, e = [], d, c;
	for (d in a) {
		if (a.hasOwnProperty(d)) {
			e.push(d)
		}
	}
	c = e.length;
	Ext.Class = b = function(g, h, f) {
		if (typeof g != "function") {
			f = h;
			h = g;
			g = null
		}
		if (!h) {
			h = {}
		}
		g = b.create(g);
		b.process(g, h, f);
		return g
	};
	Ext.apply(b, {
		onBeforeCreated : function(g, h, f) {
			g.addMembers(h);
			f.onCreated.call(g, g)
		},
		create : function(f) {
			var g, h;
			if (!f) {
				f = function() {
					return this.constructor.apply(this, arguments)
				}
			}
			for (h = 0; h < c; h++) {
				g = e[h];
				f[g] = a[g]
			}
			return f
		},
		process : function(g, m, k) {
			var j = m.preprocessors || b.defaultPreprocessors, q = this.preprocessors, t = {
				onBeforeCreated : this.onBeforeCreated,
				onCreated : k || Ext.emptyFn
			}, n = 0, f, u, p, l, o, r, s, h;
			delete m.preprocessors;
			h = function(v, w, i) {
				r = null;
				while (r === null) {
					f = j[n++];
					if (f) {
						u = q[f];
						p = u.properties;
						if (p === true) {
							r = u.fn
						} else {
							for (l = 0, o = p.length; l < o; l++) {
								s = p[l];
								if (w.hasOwnProperty(s)) {
									r = u.fn;
									break
								}
							}
						}
					} else {
						i.onBeforeCreated.apply(this, arguments);
						return
					}
				}
				if (r.call(this, v, w, i, h) !== false) {
					h.apply(this, arguments)
				}
			};
			h.call(this, g, m, t)
		},
		preprocessors : {},
		registerPreprocessor : function(g, j, h, f, i) {
			if (!f) {
				f = "last"
			}
			if (!h) {
				h = [g]
			}
			this.preprocessors[g] = {
				name : g,
				properties : h || false,
				fn : j
			};
			this.setDefaultPreprocessorPosition(g, f, i);
			return this
		},
		getPreprocessor : function(f) {
			return this.preprocessors[f]
		},
		getPreprocessors : function() {
			return this.preprocessors
		},
		defaultPreprocessors : [],
		getDefaultPreprocessors : function() {
			return this.defaultPreprocessors
		},
		setDefaultPreprocessors : function(f) {
			this.defaultPreprocessors = Ext.Array.from(f);
			return this
		},
		setDefaultPreprocessorPosition : function(h, j, i) {
			var f = this.defaultPreprocessors, g;
			if (typeof j == "string") {
				if (j === "first") {
					f.unshift(h);
					return this
				} else {
					if (j === "last") {
						f.push(h);
						return this
					}
				}
				j = (j === "after") ? 1 : -1
			}
			g = Ext.Array.indexOf(f, i);
			if (g !== -1) {
				Ext.Array.splice(f, Math.max(0, g + j), 0, h)
			}
			return this
		},
		configNameCache : {},
		getConfigNameMap : function(h) {
			var g = this.configNameCache, i = g[h], f;
			if (!i) {
				f = h.charAt(0).toUpperCase() + h.substr(1);
				i = g[h] = {
					name : h,
					internal : "_" + h,
					initializing : "is" + f + "Initializing",
					apply : "apply" + f,
					update : "update" + f,
					set : "set" + f,
					get : "get" + f,
					initGet : "initGet" + f,
					doSet : "doSet" + f,
					changeEvent : h.toLowerCase() + "change"
				}
			}
			return i
		},
		generateSetter : function(i) {
			var g = i.internal, h = i.get, f = i.apply, k = i.update, j;
			j = function(n) {
				var m = this[g], l = this[f], o = this[k];
				delete this[h];
				if (l) {
					n = l.call(this, n, m)
				}
				if (typeof n != "undefined") {
					this[g] = n;
					if (o && n !== m) {
						o.call(this, n, m)
					}
				}
				return this
			};
			j.$isDefault = true;
			return j
		},
		generateInitGetter : function(j) {
			var f = j.name, i = j.set, g = j.get, h = j.initializing;
			return function() {
				this[h] = true;
				delete this[g];
				this[i].call(this, this.config[f]);
				delete this[h];
				return this[g].apply(this, arguments)
			}
		},
		generateGetter : function(g) {
			var f = g.internal;
			return function() {
				return this[f]
			}
		}
	});
	b.registerPreprocessor("extend", function(f, i) {
				var h = Ext.Base, j = i.extend, g;
				delete i.extend;
				if (j && j !== Object) {
					g = j
				} else {
					g = h
				}
				f.extend(g);
				f.triggerExtended.apply(f, arguments);
				if (i.onClassExtended) {
					f.onExtended(i.onClassExtended, f);
					delete i.onClassExtended
				}
			}, true);
	b.registerPreprocessor("statics", function(f, g) {
				f.addStatics(g.statics);
				delete g.statics
			});
	b.registerPreprocessor("inheritableStatics", function(f, g) {
				f.addInheritableStatics(g.inheritableStatics);
				delete g.inheritableStatics
			});
	b.registerPreprocessor("config", function(h, m) {
				var j = m.config, p = h.prototype, l = p.config, o, g, n, f, i, k, q;
				delete m.config;
				for (g in j) {
					if (j.hasOwnProperty(g) && !(g in l)) {
						q = j[g];
						o = this.getConfigNameMap(g);
						n = o.set;
						f = o.get;
						i = o.initGet;
						k = o.internal;
						m[i] = this.generateInitGetter(o);
						if (q === null && !m.hasOwnProperty(k)) {
							m[k] = null
						}
						if (!m.hasOwnProperty(f)) {
							m[f] = this.generateGetter(o)
						}
						if (!m.hasOwnProperty(n)) {
							m[n] = this.generateSetter(o)
						}
					}
				}
				h.addConfig(j, true)
			});
	b.registerPreprocessor("mixins", function(j, n, f) {
				var g = n.mixins, k, h, l, m;
				delete n.mixins;
				Ext.Function.interceptBefore(f, "onCreated", function() {
							if (g instanceof Array) {
								for (l = 0, m = g.length; l < m; l++) {
									h = g[l];
									k = h.prototype.mixinId || h.$className;
									j.mixin(k, h)
								}
							} else {
								for (k in g) {
									if (g.hasOwnProperty(k)) {
										j.mixin(k, g[k])
									}
								}
							}
						})
			});
	Ext.extend = function(h, i, g) {
		if (arguments.length === 2 && Ext.isObject(i)) {
			g = i;
			i = h;
			h = null
		}
		var f;
		if (!i) {
			throw new Error("[Ext.extend] Attempting to extend from a class which has not been loaded on the page.")
		}
		g.extend = i;
		g.preprocessors = ["extend", "statics", "inheritableStatics", "mixins",
				"config"];
		if (h) {
			f = new b(h, g)
		} else {
			f = new b(g)
		}
		f.prototype.override = function(k) {
			for (var j in k) {
				if (k.hasOwnProperty(j)) {
					this[j] = k[j]
				}
			}
		};
		return f
	}
})();
(function(b, d, f, c, e) {
	var a = Ext.ClassManager = {
		classes : {},
		existCache : {},
		namespaceRewrites : [{
					from : "Ext.",
					to : Ext
				}],
		maps : {
			alternateToName : {},
			aliasToName : {},
			nameToAliases : {},
			nameToAlternates : {}
		},
		enableNamespaceParseCache : true,
		namespaceParseCache : {},
		instantiators : [],
		isCreated : function(l) {
			var k = this.existCache, j, m, h, g, n;
			if (this.classes[l] || k[l]) {
				return true
			}
			g = e;
			n = this.parseNamespace(l);
			for (j = 0, m = n.length; j < m; j++) {
				h = n[j];
				if (typeof h != "string") {
					g = h
				} else {
					if (!g || !g[h]) {
						return false
					}
					g = g[h]
				}
			}
			k[l] = true;
			this.triggerCreated(l);
			return true
		},
		createdListeners : [],
		nameCreatedListeners : {},
		triggerCreated : function(q) {
			var s = this.createdListeners, k = this.nameCreatedListeners, l = this.maps.nameToAlternates[q], r = [q], n, p, m, o, h, g;
			for (n = 0, p = s.length; n < p; n++) {
				h = s[n];
				h.fn.call(h.scope, q)
			}
			if (l) {
				r.push.apply(r, l)
			}
			for (n = 0, p = r.length; n < p; n++) {
				g = r[n];
				s = k[g];
				if (s) {
					for (m = 0, o = s.length; m < o; m++) {
						h = s[m];
						h.fn.call(h.scope, g)
					}
					delete k[g]
				}
			}
		},
		onCreated : function(k, j, i) {
			var h = this.createdListeners, g = this.nameCreatedListeners, l = {
				fn : k,
				scope : j
			};
			if (i) {
				if (this.isCreated(i)) {
					k.call(j, i);
					return
				}
				if (!g[i]) {
					g[i] = []
				}
				g[i].push(l)
			} else {
				h.push(l)
			}
		},
		parseNamespace : function(j) {
			var g = this.namespaceParseCache;
			if (this.enableNamespaceParseCache) {
				if (g.hasOwnProperty(j)) {
					return g[j]
				}
			}
			var k = [], m = this.namespaceRewrites, o = e, h = j, r, q, p, l, n;
			for (l = 0, n = m.length; l < n; l++) {
				r = m[l];
				q = r.from;
				p = r.to;
				if (h === q || h.substring(0, q.length) === q) {
					h = h.substring(q.length);
					if (typeof p != "string") {
						o = p
					} else {
						k = k.concat(p.split("."))
					}
					break
				}
			}
			k.push(o);
			k = k.concat(h.split("."));
			if (this.enableNamespaceParseCache) {
				g[j] = k
			}
			return k
		},
		setNamespace : function(k, n) {
			var h = e, o = this.parseNamespace(k), m = o.length - 1, g = o[m], l, j;
			for (l = 0; l < m; l++) {
				j = o[l];
				if (typeof j != "string") {
					h = j
				} else {
					if (!h[j]) {
						h[j] = {}
					}
					h = h[j]
				}
			}
			h[g] = n;
			return h[g]
		},
		createNamespaces : function() {
			var g = e, n, k, l, h, m, o;
			for (l = 0, m = arguments.length; l < m; l++) {
				n = this.parseNamespace(arguments[l]);
				for (h = 0, o = n.length; h < o; h++) {
					k = n[h];
					if (typeof k != "string") {
						g = k
					} else {
						if (!g[k]) {
							g[k] = {}
						}
						g = g[k]
					}
				}
			}
			return g
		},
		set : function(g, k) {
			var j = this, m = j.maps, l = m.nameToAlternates, i = j.getName(k), h;
			j.classes[g] = j.setNamespace(g, k);
			if (i && i !== g) {
				m.alternateToName[g] = i;
				h = l[i] || (l[i] = []);
				h.push(g)
			}
			return this
		},
		get : function(j) {
			var l = this.classes;
			if (l[j]) {
				return l[j]
			}
			var g = e, n = this.parseNamespace(j), h, k, m;
			for (k = 0, m = n.length; k < m; k++) {
				h = n[k];
				if (typeof h != "string") {
					g = h
				} else {
					if (!g || !g[h]) {
						return null
					}
					g = g[h]
				}
			}
			return g
		},
		setAlias : function(g, h) {
			var j = this.maps.aliasToName, k = this.maps.nameToAliases, i;
			if (typeof g == "string") {
				i = g
			} else {
				i = this.getName(g)
			}
			if (h && j[h] !== i) {
				j[h] = i
			}
			if (!k[i]) {
				k[i] = []
			}
			if (h) {
				Ext.Array.include(k[i], h)
			}
			return this
		},
		getByAlias : function(g) {
			return this.get(this.getNameByAlias(g))
		},
		getNameByAlias : function(g) {
			return this.maps.aliasToName[g] || ""
		},
		getNameByAlternate : function(g) {
			return this.maps.alternateToName[g] || ""
		},
		getAliasesByName : function(g) {
			return this.maps.nameToAliases[g] || []
		},
		getName : function(g) {
			return g && g.$className || ""
		},
		getClass : function(g) {
			return g && g.self || null
		},
		create : function(h, i, g) {
			i.$className = h;
			return new b(i, function() {
				var m = i.postprocessors || a.defaultPostprocessors, t = a.postprocessors, q = 0, u = [], s, k, n, r, l, p, o, v;
				delete i.postprocessors;
				for (n = 0, r = m.length; n < r; n++) {
					s = m[n];
					if (typeof s == "string") {
						s = t[s];
						o = s.properties;
						if (o === true) {
							u.push(s.fn)
						} else {
							if (o) {
								for (l = 0, p = o.length; l < p; l++) {
									v = o[l];
									if (i.hasOwnProperty(v)) {
										u.push(s.fn);
										break
									}
								}
							}
						}
					} else {
						u.push(s)
					}
				}
				k = function(w, j, x) {
					s = u[q++];
					if (!s) {
						a.set(h, j);
						if (g) {
							g.call(j, j)
						}
						a.triggerCreated(h);
						return
					}
					if (s.call(this, w, j, x, k) !== false) {
						k.apply(this, arguments)
					}
				};
				k.call(a, h, this, i)
			})
		},
		createOverride : function(h, j) {
			var i = j.override, g = Ext.Array.from(j.requires);
			delete j.override;
			delete j.requires;
			this.existCache[h] = true;
			Ext.require(g, function() {
						this.onCreated(function() {
									this.get(i).override(j);
									this.triggerCreated(h)
								}, this, i)
					}, this);
			return this
		},
		instantiateByAlias : function() {
			var h = arguments[0], g = f.call(arguments), i = this
					.getNameByAlias(h);
			if (!i) {
				i = this.maps.aliasToName[h];
				Ext.syncRequire(i)
			}
			g[0] = i;
			return this.instantiate.apply(this, g)
		},
		instantiate : function() {
			var i = arguments[0], h = f.call(arguments, 1), j = i, k, g;
			if (typeof i != "function") {
				g = this.get(i)
			} else {
				g = i
			}
			if (!g) {
				k = this.getNameByAlias(i);
				if (k) {
					i = k;
					g = this.get(i)
				}
			}
			if (!g) {
				k = this.getNameByAlternate(i);
				if (k) {
					i = k;
					g = this.get(i)
				}
			}
			if (!g) {
				Ext.syncRequire(i);
				g = this.get(i)
			}
			return this.getInstantiator(h.length)(g, h)
		},
		dynInstantiate : function(h, g) {
			g = c(g, true);
			g.unshift(h);
			return this.instantiate.apply(this, g)
		},
		getInstantiator : function(k) {
			var j = this.instantiators, l;
			l = j[k];
			if (!l) {
				var h = k, g = [];
				for (h = 0; h < k; h++) {
					g.push("a[" + h + "]")
				}
				l = j[k] = new Function("c", "a", "return new c(" + g.join(",")
								+ ")")
			}
			return l
		},
		postprocessors : {},
		defaultPostprocessors : [],
		registerPostprocessor : function(h, k, i, g, j) {
			if (!g) {
				g = "last"
			}
			if (!i) {
				i = [h]
			}
			this.postprocessors[h] = {
				name : h,
				properties : i || false,
				fn : k
			};
			this.setDefaultPostprocessorPosition(h, g, j);
			return this
		},
		setDefaultPostprocessors : function(g) {
			this.defaultPostprocessors = c(g);
			return this
		},
		setDefaultPostprocessorPosition : function(h, k, j) {
			var i = this.defaultPostprocessors, g;
			if (typeof k == "string") {
				if (k === "first") {
					i.unshift(h);
					return this
				} else {
					if (k === "last") {
						i.push(h);
						return this
					}
				}
				k = (k === "after") ? 1 : -1
			}
			g = Ext.Array.indexOf(i, j);
			if (g !== -1) {
				Ext.Array.splice(i, Math.max(0, g + k), 0, h)
			}
			return this
		},
		getNamesByExpression : function(o) {
			var m = this.maps.nameToAliases, p = [], g, l, j, h, q, k, n;
			if (o.indexOf("*") !== -1) {
				o = o.replace(/\*/g, "(.*?)");
				q = new RegExp("^" + o + "$");
				for (g in m) {
					if (m.hasOwnProperty(g)) {
						j = m[g];
						if (g.search(q) !== -1) {
							p.push(g)
						} else {
							for (k = 0, n = j.length; k < n; k++) {
								l = j[k];
								if (l.search(q) !== -1) {
									p.push(g);
									break
								}
							}
						}
					}
				}
			} else {
				h = this.getNameByAlias(o);
				if (h) {
					p.push(h)
				} else {
					h = this.getNameByAlternate(o);
					if (h) {
						p.push(h)
					} else {
						p.push(o)
					}
				}
			}
			return p
		}
	};
	a.registerPostprocessor("alias", function(j, h, m) {
				var g = m.alias, k, l;
				for (k = 0, l = g.length; k < l; k++) {
					d = g[k];
					this.setAlias(h, d)
				}
			}, ["xtype", "alias"]);
	a.registerPostprocessor("singleton", function(h, g, j, i) {
				i.call(this, h, new g(), j);
				return false
			});
	a.registerPostprocessor("alternateClassName", function(h, g, m) {
				var k = m.alternateClassName, j, l, n;
				if (!(k instanceof Array)) {
					k = [k]
				}
				for (j = 0, l = k.length; j < l; j++) {
					n = k[j];
					this.set(n, g)
				}
			});
	Ext.apply(Ext, {
				create : d(a, "instantiate"),
				widget : function(h) {
					var g = f.call(arguments);
					g[0] = "widget." + h;
					return a.instantiateByAlias.apply(a, g)
				},
				createByAlias : d(a, "instantiateByAlias"),
				define : function(h, i, g) {
					if ("override" in i) {
						return a.createOverride.apply(a, arguments)
					}
					return a.create.apply(a, arguments)
				},
				getClassName : d(a, "getName"),
				getDisplayName : function(g) {
					if (g) {
						if (g.displayName) {
							return g.displayName
						}
						if (g.$name && g.$class) {
							return Ext.getClassName(g.$class) + "#" + g.$name
						}
						if (g.$className) {
							return g.$className
						}
					}
					return "Anonymous"
				},
				getClass : d(a, "getClass"),
				namespace : d(a, "createNamespaces")
			});
	Ext.createWidget = Ext.widget;
	Ext.ns = Ext.namespace;
	b.registerPreprocessor("className", function(g, h) {
				if (h.$className) {
					g.$className = h.$className
				}
			}, true, "first");
	b.registerPreprocessor("alias", function(s, m) {
		var q = s.prototype, j = c(m.xtype), g = c(m.alias), t = "widget.", r = t.length, n = Array.prototype.slice
				.call(q.xtypesChain || []), k = Ext
				.merge({}, q.xtypesMap || {}), l, p, o, h;
		for (l = 0, p = g.length; l < p; l++) {
			o = g[l];
			if (o.substring(0, r) === t) {
				h = o.substring(r);
				Ext.Array.include(j, h)
			}
		}
		s.xtype = m.xtype = j[0];
		m.xtypes = j;
		for (l = 0, p = j.length; l < p; l++) {
			h = j[l];
			if (!k[h]) {
				k[h] = true;
				n.push(h)
			}
		}
		m.xtypesChain = n;
		m.xtypesMap = k;
		Ext.Function.interceptAfter(m, "onClassCreated", function() {
					var i = q.mixins, v, u;
					for (v in i) {
						if (i.hasOwnProperty(v)) {
							u = i[v];
							j = u.xtypes;
							if (j) {
								for (l = 0, p = j.length; l < p; l++) {
									h = j[l];
									if (!k[h]) {
										k[h] = true;
										n.push(h)
									}
								}
							}
						}
					}
				});
		for (l = 0, p = j.length; l < p; l++) {
			h = j[l];
			Ext.Array.include(g, t + h)
		}
		m.alias = g
	}, ["xtype", "alias"])
})(Ext.Class, Ext.Function.alias, Array.prototype.slice, Ext.Array.from,
		Ext.global);
(function(a, c, d, g, i, h, f, j) {
	var e = ["extend", "mixins", "requires"], b;
	b = Ext.Loader = {
		isInHistory : {},
		history : [],
		config : {
			enabled : true,
			disableCaching : true,
			disableCachingParam : "_dc",
			paths : {
				Ext : "."
			}
		},
		setConfig : function(k, l) {
			if (Ext.isObject(k) && arguments.length === 1) {
				Ext.merge(this.config, k)
			} else {
				this.config[k] = (Ext.isObject(l)) ? Ext.merge(this.config[k],
						l) : l
			}
			return this
		},
		getConfig : function(k) {
			if (k) {
				return this.config[k]
			}
			return this.config
		},
		setPath : d(function(k, l) {
					this.config.paths[k] = l;
					return this
				}),
		getPath : function(k) {
			var m = "", n = this.config.paths, l = this.getPrefix(k);
			if (l.length > 0) {
				if (l === k) {
					return n[l]
				}
				m = n[l];
				k = k.substring(l.length + 1)
			}
			if (m.length > 0) {
				m += "/"
			}
			return m.replace(/\/\.\//g, "/") + k.replace(/\./g, "/") + ".js"
		},
		getPrefix : function(l) {
			var n = this.config.paths, m, k = "";
			if (n.hasOwnProperty(l)) {
				return l
			}
			for (m in n) {
				if (n.hasOwnProperty(m)
						&& m + "." === l.substring(0, m.length + 1)) {
					if (m.length > k.length) {
						k = m
					}
				}
			}
			return k
		},
		require : function(m, l, k, n) {
			if (l) {
				l.call(k)
			}
		},
		syncRequire : function() {
		},
		exclude : function(l) {
			var k = this;
			return {
				require : function(o, n, m) {
					return k.require(o, n, m, l)
				},
				syncRequire : function(o, n, m) {
					return k.syncRequire(o, n, m, l)
				}
			}
		},
		onReady : function(n, m, o, k) {
			var l;
			if (o !== false && Ext.onDocumentReady) {
				l = n;
				n = function() {
					Ext.onDocumentReady(l, m, k)
				}
			}
			n.call(m)
		}
	};
	Ext.apply(b, {
		documentHead : typeof document != "undefined"
				&& (document.head || document.getElementsByTagName("head")[0]),
		isLoading : false,
		queue : [],
		isClassFileLoaded : {},
		isFileLoaded : {},
		readyListeners : [],
		optionalRequires : [],
		requiresMap : {},
		numPendingFiles : 0,
		numLoadedFiles : 0,
		hasFileLoadError : false,
		classNameToFilePathMap : {},
		syncModeEnabled : false,
		scriptElements : {},
		refreshQueue : function() {
			var k = this.queue, q = k.length, n, p, l, o, m;
			if (q === 0) {
				this.triggerReady();
				return
			}
			for (n = 0; n < q; n++) {
				p = k[n];
				if (p) {
					o = p.requires;
					m = p.references;
					if (o.length > this.numLoadedFiles) {
						continue
					}
					l = 0;
					do {
						if (a.isCreated(o[l])) {
							f(o, l, 1)
						} else {
							l++
						}
					} while (l < o.length);
					if (p.requires.length === 0) {
						f(k, n, 1);
						p.callback.call(p.scope);
						this.refreshQueue();
						break
					}
				}
			}
			return this
		},
		injectScriptElement : function(m, o, q, n) {
			var l = document.createElement("script"), p = this, k = function() {
				p.cleanupScriptElement(l);
				o.call(n)
			}, r = function() {
				p.cleanupScriptElement(l);
				q.call(n)
			};
			l.type = "text/javascript";
			l.src = m;
			l.onload = k;
			l.onerror = r;
			l.onreadystatechange = function() {
				if (this.readyState === "loaded"
						|| this.readyState === "complete") {
					k()
				}
			};
			this.documentHead.appendChild(l);
			return l
		},
		removeScriptElement : function(l) {
			var k = this.scriptElements;
			if (k[l]) {
				this.cleanupScriptElement(k[l], true);
				delete k[l]
			}
			return this
		},
		cleanupScriptElement : function(l, k) {
			l.onload = null;
			l.onreadystatechange = null;
			l.onerror = null;
			if (k) {
				this.documentHead.removeChild(l)
			}
			return this
		},
		loadScriptFile : function(l, s, o, w, k) {
			var r = this, x = this.isFileLoaded, m = this.scriptElements, v = l
					+ (this.getConfig("disableCaching")
							? ("?" + this.getConfig("disableCachingParam")
									+ "=" + Ext.Date.now())
							: ""), u, n, q, t;
			if (x[l]) {
				return this
			}
			w = w || this;
			this.isLoading = true;
			if (!k) {
				t = function() {
				};
				if (!Ext.isReady && Ext.onDocumentReady) {
					Ext.onDocumentReady(function() {
								if (!x[l]) {
									m[l] = r.injectScriptElement(v, s, t, w)
								}
							})
				} else {
					m[l] = this.injectScriptElement(v, s, t, w)
				}
			} else {
				if (typeof XMLHttpRequest != "undefined") {
					u = new XMLHttpRequest()
				} else {
					u = new ActiveXObject("Microsoft.XMLHTTP")
				}
				try {
					u.open("GET", v, false);
					u.send(null)
				} catch (p) {
				}
				n = (u.status == 1223) ? 204 : u.status;
				q = u.responseText;
				if ((n >= 200 && n < 300) || n == 304
						|| (n == 0 && q.length > 0)) {
					Ext.globalEval(q + "\n//@ sourceURL=" + l);
					s.call(w)
				} else {
				}
				u = null
			}
		},
		syncRequire : function() {
			var k = this.syncModeEnabled;
			if (!k) {
				this.syncModeEnabled = true
			}
			this.require.apply(this, arguments);
			if (!k) {
				this.syncModeEnabled = false
			}
			this.refreshQueue()
		},
		require : function(F, t, n, q) {
			var v = {}, m = {}, y = this.queue, C = this.classNameToFilePathMap, A = this.isClassFileLoaded, s = [], H = [], E = [], l = [], r, G, x, w, k, p, D, B, z, u, o;
			if (q) {
				q = h(q);
				for (B = 0, u = q.length; B < u; B++) {
					k = q[B];
					if (typeof k == "string" && k.length > 0) {
						s = a.getNamesByExpression(k);
						for (z = 0, o = s.length; z < o; z++) {
							v[s[z]] = true
						}
					}
				}
			}
			F = h(F);
			if (t) {
				if (t.length > 0) {
					r = function() {
						var K = [], J, L, I;
						for (J = 0, L = l.length; J < L; J++) {
							I = l[J];
							K.push(a.get(I))
						}
						return t.apply(this, K)
					}
				} else {
					r = t
				}
			} else {
				r = Ext.emptyFn
			}
			n = n || Ext.global;
			for (B = 0, u = F.length; B < u; B++) {
				w = F[B];
				if (typeof w == "string" && w.length > 0) {
					H = a.getNamesByExpression(w);
					o = H.length;
					for (z = 0; z < o; z++) {
						D = H[z];
						if (v[D] !== true) {
							l.push(D);
							if (!a.isCreated(D) && !m[D]) {
								m[D] = true;
								E.push(D)
							}
						}
					}
				}
			}
			if (E.length > 0) {
				if (!this.config.enabled) {
					throw new Error("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. Missing required class"
							+ ((E.length > 1) ? "es" : "")
							+ ": "
							+ E.join(", "))
				}
			} else {
				r.call(n);
				return this
			}
			G = this.syncModeEnabled;
			if (!G) {
				y.push({
							requires : E.slice(),
							callback : r,
							scope : n
						})
			}
			u = E.length;
			for (B = 0; B < u; B++) {
				p = E[B];
				x = this.getPath(p);
				if (G && A.hasOwnProperty(p)) {
					this.numPendingFiles--;
					this.removeScriptElement(x);
					delete A[p]
				}
				if (!A.hasOwnProperty(p)) {
					A[p] = false;
					C[p] = x;
					this.numPendingFiles++;
					this.loadScriptFile(x, i(this.onFileLoaded, [p, x], this),
							i(this.onFileLoadError, [p, x]), this, G)
				}
			}
			if (G) {
				r.call(n);
				if (u === 1) {
					return a.get(p)
				}
			}
			return this
		},
		onFileLoaded : function(l, k) {
			this.numLoadedFiles++;
			this.isClassFileLoaded[l] = true;
			this.isFileLoaded[k] = true;
			this.numPendingFiles--;
			if (this.numPendingFiles === 0) {
				this.refreshQueue()
			}
		},
		onFileLoadError : function(m, l, k, n) {
			this.numPendingFiles--;
			this.hasFileLoadError = true
		},
		addOptionalRequires : function(m) {
			var o = this.optionalRequires, l, n, k;
			m = h(m);
			for (l = 0, n = m.length; l < n; l++) {
				k = m[l];
				j(o, k)
			}
			return this
		},
		triggerReady : function(l) {
			var n = this.readyListeners, m = this.optionalRequires, k;
			if (this.isLoading || l) {
				this.isLoading = false;
				if (m.length !== 0) {
					m = m.slice();
					this.optionalRequires.length = 0;
					this.require(m, i(this.triggerReady, [true], this), this);
					return this
				}
				while (n.length) {
					k = n.shift();
					k.fn.call(k.scope);
					if (this.isLoading) {
						return this
					}
				}
			}
			return this
		},
		onReady : function(n, m, o, k) {
			var l;
			if (o !== false && Ext.onDocumentReady) {
				l = n;
				n = function() {
					Ext.onDocumentReady(l, m, k)
				}
			}
			if (!this.isLoading) {
				n.call(m)
			} else {
				this.readyListeners.push({
							fn : n,
							scope : m
						})
			}
		},
		historyPush : function(l) {
			var k = this.isInHistory;
			if (l && this.isClassFileLoaded.hasOwnProperty(l) && !k[l]) {
				k[l] = true;
				this.history.push(l)
			}
			return this
		}
	});
	Ext.require = g(b, "require");
	Ext.syncRequire = g(b, "syncRequire");
	Ext.exclude = g(b, "exclude");
	Ext.onReady = function(m, l, k) {
		b.onReady(m, l, true, k)
	};
	c.registerPreprocessor("loader", function(x, m, w, v) {
				var t = this, r = [], s = a.getName(x), n, l, q, p, u, o, k;
				for (n = 0, q = e.length; n < q; n++) {
					o = e[n];
					if (m.hasOwnProperty(o)) {
						k = m[o];
						if (typeof k == "string") {
							r.push(k)
						} else {
							if (k instanceof Array) {
								for (l = 0, p = k.length; l < p; l++) {
									u = k[l];
									if (typeof u == "string") {
										r.push(u)
									}
								}
							} else {
								if (typeof k != "function") {
									for (l in k) {
										if (k.hasOwnProperty(l)) {
											u = k[l];
											if (typeof u == "string") {
												r.push(u)
											}
										}
									}
								}
							}
						}
					}
				}
				if (r.length === 0) {
					return
				}
				b.require(r, function() {
							for (n = 0, q = e.length; n < q; n++) {
								o = e[n];
								if (m.hasOwnProperty(o)) {
									k = m[o];
									if (typeof k == "string") {
										m[o] = a.get(k)
									} else {
										if (k instanceof Array) {
											for (l = 0, p = k.length; l < p; l++) {
												u = k[l];
												if (typeof u == "string") {
													m[o][l] = a.get(u)
												}
											}
										} else {
											if (typeof k != "function") {
												for (var y in k) {
													if (k.hasOwnProperty(y)) {
														u = k[y];
														if (typeof u == "string") {
															m[o][y] = a.get(u)
														}
													}
												}
											}
										}
									}
								}
							}
							v.call(t, x, m, w)
						});
				return false
			}, true, "after", "className");
	a.registerPostprocessor("uses", function(n, l, r) {
				var k = h(r.uses), m = [], o, q, p;
				for (o = 0, q = k.length; o < q; o++) {
					p = k[o];
					if (typeof p == "string") {
						m.push(p)
					}
				}
				b.addOptionalRequires(m)
			});
	a.onCreated(function(k) {
				this.historyPush(k)
			}, b)
})(Ext.ClassManager, Ext.Class, Ext.Function.flexSetter, Ext.Function.alias,
		Ext.Function.pass, Ext.Array.from, Ext.Array.erase, Ext.Array.include);
Ext.setVersion("touch", "2.0.1.1");
Ext.apply(Ext, {
	version : Ext.getVersion("touch"),
	idSeed : 0,
	repaint : function() {
		var a = Ext.getBody().createChild({
			cls : Ext.baseCSSPrefix + "mask " + Ext.baseCSSPrefix
					+ "mask-transparent"
		});
		setTimeout(function() {
					a.destroy()
				}, 0)
	},
	id : function(a, b) {
		if (a && a.id) {
			return a.id
		}
		a = Ext.getDom(a) || {};
		if (a === document || a === document.documentElement) {
			a.id = "ext-application"
		} else {
			if (a === document.body) {
				a.id = "ext-viewport"
			} else {
				if (a === window) {
					a.id = "ext-window"
				}
			}
		}
		a.id = a.id || ((b || "ext-element-") + (++Ext.idSeed));
		return a.id
	},
	getBody : function() {
		if (!Ext.documentBodyElement) {
			if (!document.body) {
				throw new Error("[Ext.getBody] document.body does not exist at this point")
			}
			Ext.documentBodyElement = Ext.get(document.body)
		}
		return Ext.documentBodyElement
	},
	getHead : function() {
		if (!Ext.documentHeadElement) {
			Ext.documentHeadElement = Ext.get(document.head
					|| document.getElementsByTagName("head")[0])
		}
		return Ext.documentHeadElement
	},
	getDoc : function() {
		if (!Ext.documentElement) {
			Ext.documentElement = Ext.get(document)
		}
		return Ext.documentElement
	},
	getCmp : function(a) {
		return Ext.ComponentMgr.get(a)
	},
	copyTo : function(a, b, d, c) {
		if (typeof d == "string") {
			d = d.split(/[,;\s]/)
		}
		Ext.each(d, function(e) {
					if (c || b.hasOwnProperty(e)) {
						a[e] = b[e]
					}
				}, this);
		return a
	},
	destroy : function() {
		var a = arguments, d = a.length, b, c;
		for (b = 0; b < d; b++) {
			c = a[b];
			if (c) {
				if (Ext.isArray(c)) {
					this.destroy.apply(this, c)
				} else {
					if (Ext.isFunction(c.destroy)) {
						c.destroy()
					}
				}
			}
		}
	},
	getDom : function(a) {
		if (!a || !document) {
			return null
		}
		return a.dom ? a.dom : (typeof a == "string" ? document
				.getElementById(a) : a)
	},
	removeNode : function(a) {
		if (a && a.parentNode && a.tagName != "BODY") {
			Ext.get(a).clearListeners();
			a.parentNode.removeChild(a);
			delete Ext.cache[a.id]
		}
	},
	defaultSetupConfig : {
		eventPublishers : {
			dom : {
				xclass : "Ext.event.publisher.Dom"
			},
			touchGesture : {
				xclass : "Ext.event.publisher.TouchGesture",
				recognizers : {
					drag : {
						xclass : "Ext.event.recognizer.Drag"
					},
					tap : {
						xclass : "Ext.event.recognizer.Tap"
					},
					doubleTap : {
						xclass : "Ext.event.recognizer.DoubleTap"
					},
					longPress : {
						xclass : "Ext.event.recognizer.LongPress"
					},
					swipe : {
						xclass : "Ext.event.recognizer.HorizontalSwipe"
					},
					pinch : {
						xclass : "Ext.event.recognizer.Pinch"
					},
					rotate : {
						xclass : "Ext.event.recognizer.Rotate"
					}
				}
			},
			componentDelegation : {
				xclass : "Ext.event.publisher.ComponentDelegation"
			},
			componentPaint : {
				xclass : "Ext.event.publisher.ComponentPaint"
			},
			componentSize : {
				xclass : "Ext.event.publisher.ComponentSize"
			}
		},
		animator : {
			xclass : "Ext.fx.Runner"
		},
		viewport : {
			xclass : "Ext.viewport.Viewport"
		}
	},
	isSetup : false,
	setupListeners : [],
	onSetup : function(b, a) {
		if (Ext.isSetup) {
			b.call(a)
		} else {
			Ext.setupListeners.push({
						fn : b,
						scope : a
					})
		}
	},
	setup : function(s) {
		var k = Ext.defaultSetupConfig, m = Ext.emptyFn, b = s.onReady || m, f = s.onUpdated
				|| m, a = s.scope, d = Ext.Array.from(s.requires), l = Ext.onReady, h = Ext
				.getHead(), g, q, i;
		Ext.setup = function() {
			throw new Error("Ext.setup has already been called before")
		};
		delete s.requires;
		delete s.onReady;
		delete s.onUpdated;
		delete s.scope;
		Ext.require(["Ext.event.Dispatcher"]);
		g = function() {
			var v = Ext.setupListeners, w = v.length, u, x;
			delete Ext.setupListeners;
			Ext.isSetup = true;
			for (u = 0; u < w; u++) {
				x = v[u];
				x.fn.call(x.scope)
			}
			Ext.onReady = l;
			Ext.onReady(b, a)
		};
		Ext.onUpdated = f;
		Ext.onReady = function(w, v) {
			var u = b;
			b = function() {
				u();
				Ext.onReady(w, v)
			}
		};
		s = Ext.merge({}, k, s);
		Ext.onDocumentReady(function() {
					Ext.factoryConfig(s, function(u) {
								Ext.event.Dispatcher.getInstance()
										.setPublishers(u.eventPublishers);
								if (u.logger) {
									Ext.Logger = u.logger
								}
								if (u.animator) {
									Ext.Animator = u.animator
								}
								if (u.viewport) {
									Ext.Viewport = q = u.viewport;
									if (!a) {
										a = q
									}
									Ext.require(d, function() {
												Ext.Viewport.on("ready", g,
														null, {
															single : true
														})
											})
								} else {
									Ext.require(d, g)
								}
							})
				});
		function j(u, v) {
			var w = document.createElement("meta");
			w.setAttribute("name", u);
			w.setAttribute("content", v);
			h.append(w)
		}
		function n(u, w, x) {
			var v = document.createElement("link");
			v.setAttribute("rel", "apple-touch-icon"
							+ (x ? "-precomposed" : ""));
			v.setAttribute("href", u);
			if (w) {
				v.setAttribute("sizes", w)
			}
			h.append(v)
		}
		function e(u, w) {
			var v = document.createElement("link");
			v.setAttribute("rel", "apple-touch-startup-image");
			v.setAttribute("href", u);
			if (w) {
				v.setAttribute("media", w)
			}
			h.append(v)
		}
		var p = s.icon, t = Boolean(s.isIconPrecomposed), r = s.startupImage
				|| {}, c = s.statusBarStyle, o = window.devicePixelRatio || 1;
		j(
				"viewport",
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no");
		j("apple-mobile-web-app-capable", "yes");
		j("apple-touch-fullscreen", "yes");
		if (c) {
			j("apple-mobile-web-app-status-bar-style", c)
		}
		if (Ext.isString(p)) {
			p = {
				57 : p
			}
		} else {
			if (!p) {
				p = {}
			}
		}
		if ("57" in p) {
			n(p["57"], null, t)
		}
		if ("72" in p) {
			n(p["72"], "72x72", t)
		}
		if ("114" in p) {
			n(p["114"], "114x114", t)
		}
		if ("144" in p) {
			n(p["144"], "144x144", t)
		}
		if (Ext.os.is.iPad) {
			if (o >= 2) {
				if ("1496x2048" in r) {
					e(r["1496x2048"], "(orientation: landscape)")
				}
				if ("1536x2008" in r) {
					e(r["1536x2008"], "(orientation: portrait)")
				}
			} else {
				if ("748x1024" in r) {
					e(r["748x1024"], "(orientation: landscape)")
				}
				if ("768x1004" in r) {
					e(r["768x1004"], "(orientation: portrait)")
				}
			}
		} else {
			if (o >= 2 && Ext.os.version.gtEq("4.3")) {
				e(r["640x920"])
			} else {
				e(r["320x460"])
			}
		}
	},
	application : function(b) {
		var a = b.name, e, d, c;
		if (!b) {
			b = {}
		}
		if (!Ext.Loader.config.paths[a]) {
			Ext.Loader.setPath(a, b.appFolder || "app")
		}
		c = Ext.Array.from(b.requires);
		b.requires = ["Ext.app.Application"];
		e = b.onReady;
		d = b.scope;
		b.onReady = function() {
			b.requires = c;
			new Ext.app.Application(b);
			if (e) {
				e.call(d)
			}
		};
		Ext.setup(b)
	},
	factoryConfig : function(a, l) {
		var g = Ext.isSimpleObject(a);
		if (g && a.xclass) {
			var f = a.xclass;
			delete a.xclass;
			Ext.require(f, function() {
						Ext.factoryConfig(a, function(i) {
									l(Ext.create(f, i))
								})
					});
			return
		}
		var d = Ext.isArray(a), m = [], k, j, c, e;
		if (g || d) {
			if (g) {
				for (k in a) {
					if (a.hasOwnProperty(k)) {
						j = a[k];
						if (Ext.isSimpleObject(j) || Ext.isArray(j)) {
							m.push(k)
						}
					}
				}
			} else {
				for (c = 0, e = a.length; c < e; c++) {
					j = a[c];
					if (Ext.isSimpleObject(j) || Ext.isArray(j)) {
						m.push(c)
					}
				}
			}
			c = 0;
			e = m.length;
			if (e === 0) {
				l(a);
				return
			}
			function h(i) {
				a[k] = i;
				c++;
				b()
			}
			function b() {
				if (c >= e) {
					l(a);
					return
				}
				k = m[c];
				j = a[k];
				Ext.factoryConfig(j, h)
			}
			b();
			return
		}
		l(a)
	},
	factory : function(b, e, a, f) {
		var d = Ext.ClassManager, c;
		if (!b || b.isInstance) {
			if (a && a !== b) {
				a.destroy()
			}
			return b
		}
		if (f) {
			if (typeof b == "string") {
				return d.instantiateByAlias(f + "." + b)
			} else {
				if (Ext.isObject(b) && "type" in b) {
					return d.instantiateByAlias(f + "." + b.type, b)
				}
			}
		}
		if (b === true) {
			return a || d.instantiate(e)
		}
		if ("xtype" in b) {
			c = d.instantiateByAlias("widget." + b.xtype, b)
		} else {
			if ("xclass" in b) {
				c = d.instantiate(b.xclass, b)
			}
		}
		if (c) {
			if (a) {
				a.destroy()
			}
			return c
		}
		if (a) {
			return a.setConfig(b)
		}
		return d.instantiate(e, b)
	},
	deprecateClassMember : function(b, c, a, d) {
		return this.deprecateProperty(b.prototype, c, a, d)
	},
	deprecateClassMembers : function(b, c) {
		var d = b.prototype, e, a;
		for (e in c) {
			if (c.hasOwnProperty(e)) {
				a = c[e];
				this.deprecateProperty(d, e, a)
			}
		}
	},
	deprecateProperty : function(b, c, a, d) {
		if (!d) {
			d = "'" + c + "' is deprecated"
		}
		if (a) {
			d += ", please use '" + a + "' instead"
		}
		if (a) {
			Ext.Object.defineProperty(b, c, {
						get : function() {
							return this[a]
						},
						set : function(e) {
							this[a] = e
						},
						configurable : true
					})
		}
	},
	deprecatePropertyValue : function(b, a, d, c) {
		Ext.Object.defineProperty(b, a, {
					get : function() {
						return d
					},
					configurable : true
				})
	},
	deprecateMethod : function(b, a, d, c) {
		b[a] = function() {
			if (d) {
				return d.apply(this, arguments)
			}
		}
	},
	deprecateClassMethod : function(a, b, h, d) {
		if (typeof b != "string") {
			var g, f;
			for (g in b) {
				if (b.hasOwnProperty(g)) {
					f = b[g];
					Ext.deprecateClassMethod(a, g, f)
				}
			}
			return
		}
		var c = typeof h == "string", e;
		if (!d) {
			d = "'" + b + "()' is deprecated, please use '" + (c ? h : h.name)
					+ "()' instead"
		}
		if (c) {
			e = function() {
				return this[h].apply(this, arguments)
			}
		} else {
			e = function() {
				return h.apply(this, arguments)
			}
		}
		if (b in a.prototype) {
			Ext.Object.defineProperty(a.prototype, b, {
						value : null,
						writable : true,
						configurable : true
					})
		}
		a.addMember(b, e)
	},
	isReady : false,
	readyListeners : [],
	triggerReady : function() {
		var b = Ext.readyListeners, a, c, d;
		if (!Ext.isReady) {
			Ext.isReady = true;
			for (a = 0, c = b.length; a < c; a++) {
				d = b[a];
				d.fn.call(d.scope)
			}
			delete Ext.readyListeners
		}
	},
	onDocumentReady : function(c, b) {
		if (Ext.isReady) {
			c.call(b)
		} else {
			var a = Ext.triggerReady;
			Ext.readyListeners.push({
						fn : c,
						scope : b
					});
			if (Ext.browser.is.PhoneGap && !Ext.os.is.Desktop) {
				if (!Ext.readyListenerAttached) {
					Ext.readyListenerAttached = true;
					document.addEventListener("deviceready", a, false)
				}
			} else {
				if (document.readyState.match(/interactive|complete|loaded/) !== null) {
					a()
				} else {
					if (!Ext.readyListenerAttached) {
						Ext.readyListenerAttached = true;
						window.addEventListener("DOMContentLoaded", a, false)
					}
				}
			}
		}
	},
	callback : function(d, c, b, a) {
		if (Ext.isFunction(d)) {
			b = b || [];
			c = c || window;
			if (a) {
				Ext.defer(d, a, c, b)
			} else {
				d.apply(c, b)
			}
		}
	}
});
Ext.define("Ext.env.Browser", {
	requires : ["Ext.Version"],
	statics : {
		browserNames : {
			ie : "IE",
			firefox : "Firefox",
			safari : "Safari",
			chrome : "Chrome",
			opera : "Opera",
			dolfin : "Dolfin",
			webosbrowser : "webOSBrowser",
			chromeMobile : "ChromeMobile",
			silk : "Silk",
			other : "Other"
		},
		engineNames : {
			webkit : "WebKit",
			gecko : "Gecko",
			presto : "Presto",
			trident : "Trident",
			other : "Other"
		},
		enginePrefixes : {
			webkit : "AppleWebKit/",
			gecko : "Gecko/",
			presto : "Presto/",
			trident : "Trident/"
		},
		browserPrefixes : {
			ie : "MSIE ",
			firefox : "Firefox/",
			chrome : "Chrome/",
			safari : "Version/",
			opera : "Opera/",
			dolfin : "Dolfin/",
			webosbrowser : "wOSBrowser/",
			chromeMobile : "CrMo/",
			silk : "Silk/"
		}
	},
	styleDashPrefixes : {
		WebKit : "-webkit-",
		Gecko : "-moz-",
		Trident : "-ms-",
		Presto : "-o-",
		Other : ""
	},
	stylePrefixes : {
		WebKit : "Webkit",
		Gecko : "Moz",
		Trident : "ms",
		Presto : "O",
		Other : ""
	},
	propertyPrefixes : {
		WebKit : "webkit",
		Gecko : "moz",
		Trident : "ms",
		Presto : "o",
		Other : ""
	},
	is : Ext.emptyFn,
	name : null,
	version : null,
	engineName : null,
	engineVersion : null,
	setFlag : function(a, b) {
		if (typeof b == "undefined") {
			b = true
		}
		this.is[a] = b;
		this.is[a.toLowerCase()] = b;
		return this
	},
	constructor : function(o) {
		this.userAgent = o;
		e = this.is = function(i) {
			return e[i] === true
		};
		var k = this.statics(), c = o.match(new RegExp("((?:"
				+ Ext.Object.getValues(k.browserPrefixes).join(")|(?:")
				+ "))([\\w\\._]+)")), b = o.match(new RegExp("((?:"
				+ Ext.Object.getValues(k.enginePrefixes).join(")|(?:")
				+ "))([\\w\\._]+)")), g = k.browserNames, j = g.other, f = k.engineNames, n = f.other, m = "", l = "", h = false, e, d, a;
		if (c) {
			j = g[Ext.Object.getKey(k.browserPrefixes, c[1])];
			m = new Ext.Version(c[2])
		}
		if (b) {
			n = f[Ext.Object.getKey(k.enginePrefixes, b[1])];
			l = new Ext.Version(b[2])
		}
		if (o.match(/FB/) && j == "Other") {
			j = g.safari;
			n = f.webkit
		}
		Ext.apply(this, {
					engineName : n,
					engineVersion : l,
					name : j,
					version : m
				});
		this.setFlag(j);
		if (m) {
			this.setFlag(j + (m.getMajor() || ""));
			this.setFlag(j + m.getShortVersion())
		}
		for (d in g) {
			if (g.hasOwnProperty(d)) {
				a = g[d];
				this.setFlag(a, j === a)
			}
		}
		this.setFlag(a);
		if (l) {
			this.setFlag(n + (l.getMajor() || ""));
			this.setFlag(n + l.getShortVersion())
		}
		for (d in f) {
			if (f.hasOwnProperty(d)) {
				a = f[d];
				this.setFlag(a, n === a)
			}
		}
		this.setFlag("Standalone", !!navigator.standalone);
		if (typeof window.PhoneGap != "undefined"
				|| typeof window.Cordova != "undefined"
				|| typeof window.cordova != "undefined") {
			h = true;
			this.setFlag("PhoneGap")
		} else {
			if (!!window.isNK) {
				h = true;
				this.setFlag("Sencha")
			}
		}
		this.setFlag("WebView", h);
		this.isStrict = document.compatMode == "CSS1Compat";
		this.isSecure = /^https/i.test(window.location.protocol);
		return this
	},
	getStyleDashPrefix : function() {
		return this.styleDashPrefixes[this.engineName]
	},
	getStylePrefix : function() {
		return this.stylePrefixes[this.engineName]
	},
	getVendorProperyName : function(a) {
		var b = this.propertyPrefixes[this.engineName];
		if (b.length > 0) {
			return b + Ext.String.capitalize(a)
		}
		return a
	}
}, function() {
	var a = Ext.browser = new this(Ext.global.navigator.userAgent)
});
Ext.define("Ext.env.OS", {
	requires : ["Ext.Version"],
	statics : {
		names : {
			ios : "iOS",
			android : "Android",
			webos : "webOS",
			blackberry : "BlackBerry",
			rimTablet : "RIMTablet",
			mac : "MacOS",
			win : "Windows",
			linux : "Linux",
			bada : "Bada",
			other : "Other"
		},
		prefixes : {
			ios : "i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ",
			android : "(Android |HTC_|Silk/)",
			blackberry : "BlackBerry(?:.*)Version/",
			rimTablet : "RIM Tablet OS ",
			webos : "(?:webOS|hpwOS)/",
			bada : "Bada/"
		}
	},
	is : Ext.emptyFn,
	name : null,
	version : null,
	setFlag : function(a, b) {
		if (typeof b == "undefined") {
			b = true
		}
		this.is[a] = b;
		this.is[a.toLowerCase()] = b;
		return this
	},
	constructor : function(m, b) {
		var k = this.statics(), j = k.names, c = k.prefixes, a, h = "", d, g, f, l, e;
		e = this.is = function(i) {
			return this.is[i] === true
		};
		for (d in c) {
			if (c.hasOwnProperty(d)) {
				g = c[d];
				f = m.match(new RegExp("(?:" + g + ")([^\\s;]+)"));
				if (f) {
					a = j[d];
					if (f[1] && (f[1] == "HTC_" || f[1] == "Silk/")) {
						h = new Ext.Version("2.3")
					} else {
						h = new Ext.Version(f[f.length - 1])
					}
					break
				}
			}
		}
		if (!a) {
			a = j[(m.toLowerCase().match(/mac|win|linux/) || ["other"])[0]];
			h = new Ext.Version("")
		}
		this.name = a;
		this.version = h;
		if (b) {
			this.setFlag(b)
		}
		this.setFlag(a);
		if (h) {
			this.setFlag(a + (h.getMajor() || ""));
			this.setFlag(a + h.getShortVersion())
		}
		for (d in j) {
			if (j.hasOwnProperty(d)) {
				l = j[d];
				if (!e.hasOwnProperty(a)) {
					this.setFlag(l, (a === l))
				}
			}
		}
		return this
	}
}, function() {
	var a = Ext.global.navigator, e = a.userAgent, b, g, d;
	Ext.os = b = new this(e, a.platform);
	g = b.name;
	var c = window.location.search.match(/deviceType=(Tablet|Phone)/), f = window.deviceType;
	if (c && c[1]) {
		d = c[1]
	} else {
		if (f === "iPhone") {
			d = "Phone"
		} else {
			if (f === "iPad") {
				d = "Tablet"
			} else {
				if (!b.is.Android && !b.is.iOS && /Windows|Linux|MacOS/.test(g)) {
					d = "Desktop"
				} else {
					if (b.is.iPad || b.is.Android3
							|| (b.is.Android4 && e.search(/mobile/i) == -1)) {
						d = "Tablet"
					} else {
						d = "Phone"
					}
				}
			}
		}
	}
	b.setFlag(d, true);
	b.deviceType = d
});
Ext.define("Ext.env.Feature", {
	requires : ["Ext.env.Browser", "Ext.env.OS"],
	constructor : function() {
		this.testElements = {};
		this.has = function(a) {
			return !!this.has[a]
		};
		return this
	},
	getTestElement : function(a, b) {
		if (a === undefined) {
			a = "div"
		} else {
			if (typeof a !== "string") {
				return a
			}
		}
		if (b) {
			return document.createElement(a)
		}
		if (!this.testElements[a]) {
			this.testElements[a] = document.createElement(a)
		}
		return this.testElements[a]
	},
	isStyleSupported : function(c, b) {
		var d = this.getTestElement(b).style, a = Ext.String.capitalize(c);
		if (typeof d[c] !== "undefined"
				|| typeof d[Ext.browser.getStylePrefix(c) + a] !== "undefined") {
			return true
		}
		return false
	},
	isEventSupported : function(c, a) {
		if (a === undefined) {
			a = window
		}
		var e = this.getTestElement(a), b = "on" + c.toLowerCase(), d = (b in e);
		if (!d) {
			if (e.setAttribute && e.removeAttribute) {
				e.setAttribute(b, "");
				d = typeof e[b] === "function";
				if (typeof e[b] !== "undefined") {
					e[b] = undefined
				}
				e.removeAttribute(b)
			}
		}
		return d
	},
	getSupportedPropertyName : function(b, a) {
		var c = Ext.browser.getVendorProperyName(a);
		if (c in b) {
			return c
		} else {
			if (a in b) {
				return a
			}
		}
		return null
	},
	registerTest : Ext.Function.flexSetter(function(a, b) {
				this.has[a] = b.call(this);
				return this
			})
}, function() {
	Ext.feature = new this;
	var a = Ext.feature.has;
	Ext.feature.registerTest({
				Canvas : function() {
					var b = this.getTestElement("canvas");
					return !!(b && b.getContext && b.getContext("2d"))
				},
				Svg : function() {
					var b = document;
					return !!(b.createElementNS && !!b.createElementNS(
							"http://www.w3.org/2000/svg", "svg").createSVGRect)
				},
				Vml : function() {
					var c = this.getTestElement(), b = false;
					c.innerHTML = "<!--[if vml]><br><![endif]-->";
					b = (c.childNodes.length === 1);
					c.innerHTML = "";
					return b
				},
				Touch : function() {
					return this.isEventSupported("touchstart")
							&& !(Ext.os && Ext.os.name
									.match(/Windows|MacOS|Linux/))
				},
				Orientation : function() {
					return ("orientation" in window)
							&& this.isEventSupported("orientationchange")
				},
				OrientationChange : function() {
					return this.isEventSupported("orientationchange")
				},
				DeviceMotion : function() {
					return this.isEventSupported("devicemotion")
				},
				Geolocation : function() {
					return "geolocation" in window.navigator
				},
				SqlDatabase : function() {
					return "openDatabase" in window
				},
				WebSockets : function() {
					return "WebSocket" in window
				},
				Range : function() {
					return !!document.createRange
				},
				CreateContextualFragment : function() {
					var b = !!document.createRange
							? document.createRange()
							: false;
					return b && !!b.createContextualFragment
				},
				History : function() {
					return ("history" in window && "pushState" in window.history)
				},
				CssTransforms : function() {
					return this.isStyleSupported("transform")
				},
				Css3dTransforms : function() {
					return this.has("CssTransforms")
							&& this.isStyleSupported("perspective")
							&& !Ext.os.is.Android2
				},
				CssAnimations : function() {
					return this.isStyleSupported("animationName")
				},
				CssTransitions : function() {
					return this.isStyleSupported("transitionProperty")
				},
				Audio : function() {
					return !!this.getTestElement("audio").canPlayType
				},
				Video : function() {
					return !!this.getTestElement("video").canPlayType
				},
				ClassList : function() {
					return "classList" in this.getTestElement()
				}
			})
});
Ext.define("Ext.dom.Query", {
			select : function(h, b) {
				var g = [], d, f, e, c, a;
				b = b || document;
				if (typeof b == "string") {
					b = document.getElementById(b)
				}
				h = h.split(",");
				for (f = 0, c = h.length; f < c; f++) {
					if (typeof h[f] == "string") {
						if (h[f][0] == "@") {
							d = b.getAttributeNode(h[f].substring(1));
							g.push(d)
						} else {
							d = b.querySelectorAll(h[f]);
							for (e = 0, a = d.length; e < a; e++) {
								g.push(d[e])
							}
						}
					}
				}
				return g
			},
			selectNode : function(b, a) {
				return this.select(b, a)[0]
			},
			is : function(a, b) {
				if (typeof a == "string") {
					a = document.getElementById(a)
				}
				return this.select(b).indexOf(a) !== -1
			},
			isXml : function(a) {
				var b = (a ? a.ownerDocument || a : 0).documentElement;
				return b ? b.nodeName !== "HTML" : false
			}
		}, function() {
			Ext.ns("Ext.core");
			Ext.core.DomQuery = Ext.DomQuery = new this();
			Ext.query = Ext.Function.alias(Ext.DomQuery, "select")
		});
Ext.define("Ext.dom.Helper", {
	emptyTags : /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
	confRe : /tag|children|cn|html|tpl|tplData$/i,
	endRe : /end/i,
	attribXlat : {
		cls : "class",
		htmlFor : "for"
	},
	closeTags : {},
	decamelizeName : function() {
		var c = /([a-z])([A-Z])/g, b = {};
		function a(d, f, e) {
			return f + "-" + e.toLowerCase()
		}
		return function(d) {
			return b[d] || (b[d] = d.replace(c, a))
		}
	}(),
	generateMarkup : function(d, c) {
		var g = this, b, h, a, e, f;
		if (typeof d == "string") {
			c.push(d)
		} else {
			if (Ext.isArray(d)) {
				for (e = 0; e < d.length; e++) {
					if (d[e]) {
						g.generateMarkup(d[e], c)
					}
				}
			} else {
				a = d.tag || "div";
				c.push("<", a);
				for (b in d) {
					if (d.hasOwnProperty(b)) {
						h = d[b];
						if (!g.confRe.test(b)) {
							if (typeof h == "object") {
								c.push(" ", b, '="');
								g.generateStyles(h, c).push('"')
							} else {
								c.push(" ", g.attribXlat[b] || b, '="', h, '"')
							}
						}
					}
				}
				if (g.emptyTags.test(a)) {
					c.push("/>")
				} else {
					c.push(">");
					if ((h = d.tpl)) {
						h.applyOut(d.tplData, c)
					}
					if ((h = d.html)) {
						c.push(h)
					}
					if ((h = d.cn || d.children)) {
						g.generateMarkup(h, c)
					}
					f = g.closeTags;
					c.push(f[a] || (f[a] = "</" + a + ">"))
				}
			}
		}
		return c
	},
	generateStyles : function(e, c) {
		var b = c || [], d;
		for (d in e) {
			if (e.hasOwnProperty(d)) {
				b.push(this.decamelizeName(d), ":", e[d], ";")
			}
		}
		return c || b.join("")
	},
	markup : function(a) {
		if (typeof a == "string") {
			return a
		}
		var b = this.generateMarkup(a, []);
		return b.join("")
	},
	applyStyles : function(a, b) {
		Ext.fly(a).applyStyles(b)
	},
	createContextualFragment : function(c) {
		var f = document.createElement("div"), a = document
				.createDocumentFragment(), b = 0, d, e;
		f.innerHTML = c;
		e = f.childNodes;
		d = e.length;
		for (; b < d; b++) {
			a.appendChild(e[b].cloneNode(true))
		}
		return a
	},
	insertHtml : function(d, a, e) {
		var h, f, i, c, b, g;
		d = d.toLowerCase();
		if (Ext.isTextNode(a)) {
			if (d == "afterbegin") {
				d = "beforebegin"
			} else {
				if (d == "beforeend") {
					d = "afterend"
				}
			}
		}
		b = d == "beforebegin";
		g = d == "afterbegin";
		f = Ext.feature.has.CreateContextualFragment ? a.ownerDocument
				.createRange() : undefined;
		h = "setStart" + (this.endRe.test(d) ? "After" : "Before");
		if (b || d == "afterend") {
			if (f) {
				f[h](a);
				i = f.createContextualFragment(e)
			} else {
				i = this.createContextualFragment(e)
			}
			a.parentNode.insertBefore(i, b ? a : a.nextSibling);
			return a[(b ? "previous" : "next") + "Sibling"]
		} else {
			c = (g ? "first" : "last") + "Child";
			if (a.firstChild) {
				if (f) {
					f[h](a[c]);
					i = f.createContextualFragment(e)
				} else {
					i = this.createContextualFragment(e)
				}
				if (g) {
					a.insertBefore(i, a.firstChild)
				} else {
					a.appendChild(i)
				}
			} else {
				a.innerHTML = e
			}
			return a[c]
		}
	},
	insertBefore : function(a, c, b) {
		return this.doInsert(a, c, b, "beforebegin")
	},
	insertAfter : function(a, c, b) {
		return this.doInsert(a, c, b, "afterend")
	},
	insertFirst : function(a, c, b) {
		return this.doInsert(a, c, b, "afterbegin")
	},
	append : function(a, c, b) {
		return this.doInsert(a, c, b, "beforeend")
	},
	overwrite : function(a, c, b) {
		a = Ext.getDom(a);
		a.innerHTML = this.markup(c);
		return b ? Ext.get(a.firstChild) : a.firstChild
	},
	doInsert : function(b, d, c, e) {
		var a = this.insertHtml(e, Ext.getDom(b), this.markup(d));
		return c ? Ext.get(a, true) : a
	},
	createTemplate : function(b) {
		var a = this.markup(b);
		return new Ext.Template(a)
	}
}, function() {
	Ext.ns("Ext.core");
	Ext.core.DomHelper = Ext.DomHelper = new this
});
Ext.define("Ext.mixin.Identifiable", {
			statics : {
				uniqueIds : {}
			},
			isIdentifiable : true,
			mixinId : "identifiable",
			idCleanRegex : /\.|[^\w\-]/g,
			defaultIdPrefix : "ext-",
			defaultIdSeparator : "-",
			getOptimizedId : function() {
				return this.id
			},
			getUniqueId : function() {
				var f = this.id, b, d, e, a, c;
				if (!f) {
					b = this.self.prototype;
					d = this.defaultIdSeparator;
					a = Ext.mixin.Identifiable.uniqueIds;
					if (!b.hasOwnProperty("identifiablePrefix")) {
						e = this.xtype;
						if (e) {
							c = this.defaultIdPrefix + e + d
						} else {
							c = b.$className.replace(this.idCleanRegex, d)
									.toLowerCase()
									+ d
						}
						b.identifiablePrefix = c
					}
					c = this.identifiablePrefix;
					if (!a.hasOwnProperty(c)) {
						a[c] = 0
					}
					f = this.id = c + (++a[c])
				}
				this.getUniqueId = this.getOptimizedId;
				return f
			},
			setId : function(a) {
				this.id = a
			},
			getId : function() {
				var a = this.id;
				if (!a) {
					a = this.getUniqueId()
				}
				this.getId = this.getOptimizedId;
				return a
			}
		});
Ext.define("Ext.dom.Element", {
	alternateClassName : "Ext.Element",
	mixins : ["Ext.mixin.Identifiable"],
	requires : ["Ext.dom.Query", "Ext.dom.Helper"],
	observableType : "element",
	xtype : "element",
	statics : {
		CREATE_ATTRIBUTES : {
			style : "style",
			className : "className",
			cls : "cls",
			classList : "classList",
			text : "text",
			hidden : "hidden",
			html : "html",
			children : "children"
		},
		create : function(c, b) {
			var f = this.CREATE_ATTRIBUTES, e, h, k, j, a, d, g;
			if (!c) {
				c = {}
			}
			if (c.isElement) {
				return c.dom
			} else {
				if ("nodeType" in c) {
					return c
				}
			}
			if (typeof c == "string") {
				return document.createTextNode(c)
			}
			k = c.tag;
			if (!k) {
				k = "div"
			}
			e = document.createElement(k);
			h = e.style;
			for (a in c) {
				if (a != "tag" && c.hasOwnProperty(a)) {
					j = c[a];
					switch (a) {
						case f.style :
							if (typeof j == "string") {
								e.setAttribute(a, j)
							} else {
								for (d in j) {
									if (j.hasOwnProperty(d)) {
										h[d] = j[d]
									}
								}
							}
							break;
						case f.className :
						case f.cls :
							e.className = j;
							break;
						case f.classList :
							e.className = j.join(" ");
							break;
						case f.text :
							e.textContent = j;
							break;
						case f.hidden :
							if (j) {
								e.style.display = "none"
							}
							break;
						case f.html :
							e.innerHTML = j;
							break;
						case f.children :
							for (d = 0, g = j.length; d < g; d++) {
								e.appendChild(this.create(j[d], true))
							}
							break;
						default :
							e.setAttribute(a, j)
					}
				}
			}
			if (b) {
				return e
			} else {
				return this.get(e)
			}
		},
		documentElement : null,
		cache : {},
		get : function(c) {
			var b = this.cache, a, d, e;
			if (!c) {
				return null
			}
			if (typeof c == "string") {
				if (b.hasOwnProperty(c)) {
					return b[c]
				}
				if (!(d = document.getElementById(c))) {
					return null
				}
				b[c] = a = new this(d);
				return a
			}
			if ("tagName" in c) {
				e = c.id;
				if (b.hasOwnProperty(e)) {
					return b[e]
				}
				a = new this(c);
				b[a.getId()] = a;
				return a
			}
			if (c.isElement) {
				return c
			}
			if (c.isComposite) {
				return c
			}
			if (Ext.isArray(c)) {
				return this.select(c)
			}
			if (c === document) {
				if (!this.documentElement) {
					this.documentElement = new this(document.documentElement);
					this.documentElement.setId("ext-application")
				}
				return this.documentElement
			}
			return null
		},
		data : function(c, b, e) {
			var a = Ext.cache, f, d;
			c = this.get(c);
			if (!c) {
				return null
			}
			f = c.id;
			d = a[f].data;
			if (!d) {
				a[f].data = d = {}
			}
			if (arguments.length == 2) {
				return d[b]
			} else {
				return (d[b] = e)
			}
		}
	},
	isElement : true,
	constructor : function(a) {
		if (typeof a == "string") {
			a = document.getElementById(a)
		}
		if (!a) {
			throw new Error("Invalid domNode reference or an id of an existing domNode: "
					+ a)
		}
		this.dom = a;
		this.getUniqueId()
	},
	attach : function(a) {
		this.dom = a;
		this.id = a.id;
		return this
	},
	getUniqueId : function() {
		var b = this.id, a;
		if (!b) {
			a = this.dom;
			if (a.id.length > 0) {
				this.id = b = a.id
			} else {
				a.id = b = this.mixins.identifiable.getUniqueId.call(this)
			}
			this.self.cache[b] = this
		}
		return b
	},
	setId : function(c) {
		var a = this.id, b = this.self.cache;
		if (a) {
			delete b[a]
		}
		this.dom.id = c;
		this.id = c;
		b[c] = this;
		return this
	},
	setHtml : function(a) {
		this.dom.innerHTML = a
	},
	getHtml : function() {
		return this.dom.innerHTML
	},
	setText : function(a) {
		this.dom.textContent = a
	},
	redraw : function() {
		var b = this.dom, a = b.style;
		a.display = "none";
		b.offsetHeight;
		a.display = ""
	},
	isPainted : function() {
		var a = this.dom;
		return Boolean(a && a.offsetParent)
	},
	set : function(a, b) {
		var e = this.dom, c, d;
		for (c in a) {
			if (a.hasOwnProperty(c)) {
				d = a[c];
				if (c == "style") {
					this.applyStyles(d)
				} else {
					if (c == "cls") {
						e.className = d
					} else {
						if (b !== false) {
							if (d === undefined) {
								e.removeAttribute(c)
							} else {
								e.setAttribute(c, d)
							}
						} else {
							e[c] = d
						}
					}
				}
			}
		}
		return this
	},
	is : function(a) {
		return Ext.DomQuery.is(this.dom, a)
	},
	getValue : function(b) {
		var a = this.dom.value;
		return b ? parseInt(a, 10) : a
	},
	getAttribute : function(a, b) {
		var c = this.dom;
		return c.getAttributeNS(b, a) || c.getAttribute(b + ":" + a)
				|| c.getAttribute(a) || c[a]
	},
	destroy : function() {
		this.isDestroyed = true;
		var a = Ext.Element.cache, b = this.dom;
		if (b && b.parentNode && b.tagName != "BODY") {
			b.parentNode.removeChild(b)
		}
		delete a[this.id];
		delete this.dom
	}
}, function(a) {
	Ext.elements = Ext.cache = a.cache;
	this.addStatics({
				Fly : new Ext.Class({
							extend : a,
							constructor : function(b) {
								this.dom = b
							}
						}),
				_flyweights : {},
				fly : function(e, c) {
					var f = null, d = a._flyweights, b;
					c = c || "_global";
					e = Ext.getDom(e);
					if (e) {
						f = d[c] || (d[c] = new a.Fly());
						f.dom = e;
						f.isSynchronized = false;
						b = Ext.cache[e.id];
						if (b && b.isElement) {
							b.isSynchronized = false
						}
					}
					return f
				}
			});
	Ext.get = function(b) {
		return a.get.call(a, b)
	};
	Ext.fly = function() {
		return a.fly.apply(a, arguments)
	};
	Ext.ClassManager.onCreated(function() {
				a.mixin("observable", Ext.mixin.Observable)
			}, null, "Ext.mixin.Observable")
});
Ext.dom.Element.addStatics({
			numberRe : /\d+$/,
			unitRe : /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
			camelRe : /(-[a-z])/gi,
			cssRe : /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
			opacityRe : /alpha\(opacity=(.*)\)/i,
			propertyCache : {},
			defaultUnit : "px",
			borders : {
				l : "border-left-width",
				r : "border-right-width",
				t : "border-top-width",
				b : "border-bottom-width"
			},
			paddings : {
				l : "padding-left",
				r : "padding-right",
				t : "padding-top",
				b : "padding-bottom"
			},
			margins : {
				l : "margin-left",
				r : "margin-right",
				t : "margin-top",
				b : "margin-bottom"
			},
			addUnits : function(b, a) {
				if (b === "" || b == "auto" || b === undefined || b === null) {
					return b || ""
				}
				if (Ext.isNumber(b) || this.numberRe.test(b)) {
					return b + (a || this.defaultUnit || "px")
				} else {
					if (!this.unitRe.test(b)) {
						return b || ""
					}
				}
				return b
			},
			isAncestor : function(b, d) {
				var a = false;
				b = Ext.getDom(b);
				d = Ext.getDom(d);
				if (b && d) {
					if (b.contains) {
						return b.contains(d)
					} else {
						if (b.compareDocumentPosition) {
							return !!(b.compareDocumentPosition(d) & 16)
						} else {
							while ((d = d.parentNode)) {
								a = d == b || a
							}
						}
					}
				}
				return a
			},
			parseBox : function(b) {
				if (typeof b != "string") {
					b = b.toString()
				}
				var c = b.split(" "), a = c.length;
				if (a == 1) {
					c[1] = c[2] = c[3] = c[0]
				} else {
					if (a == 2) {
						c[2] = c[0];
						c[3] = c[1]
					} else {
						if (a == 3) {
							c[3] = c[1]
						}
					}
				}
				return {
					top : c[0] || 0,
					right : c[1] || 0,
					bottom : c[2] || 0,
					left : c[3] || 0
				}
			},
			unitizeBox : function(c, a) {
				var b = this;
				c = b.parseBox(c);
				return b.addUnits(c.top, a) + " " + b.addUnits(c.right, a)
						+ " " + b.addUnits(c.bottom, a) + " "
						+ b.addUnits(c.left, a)
			},
			camelReplaceFn : function(b, c) {
				return c.charAt(1).toUpperCase()
			},
			normalize : function(a) {
				return this.propertyCache[a]
						|| (this.propertyCache[a] = a.replace(this.camelRe,
								this.camelReplaceFn))
			},
			fromPoint : function(a, b) {
				return Ext.get(document.elementFromPoint(a, b))
			},
			parseStyles : function(c) {
				var a = {}, b = this.cssRe, d;
				if (c) {
					b.lastIndex = 0;
					while ((d = b.exec(c))) {
						a[d[1]] = d[2]
					}
				}
				return a
			}
		});
Ext.dom.Element.addMembers({
	appendChild : function(a) {
		this.dom.appendChild(Ext.getDom(a));
		return this
	},
	removeChild : function(a) {
		this.dom.removeChild(Ext.getDom(a));
		return this
	},
	append : function() {
		this.appendChild.apply(this, arguments)
	},
	appendTo : function(a) {
		Ext.getDom(a).appendChild(this.dom);
		return this
	},
	insertBefore : function(a) {
		a = Ext.getDom(a);
		a.parentNode.insertBefore(this.dom, a);
		return this
	},
	insertAfter : function(a) {
		a = Ext.getDom(a);
		a.parentNode.insertBefore(this.dom, a.nextSibling);
		return this
	},
	insertFirst : function(b) {
		var a = Ext.getDom(b), d = this.dom, c = d.firstChild;
		if (!c) {
			d.appendChild(a)
		} else {
			d.insertBefore(a, c)
		}
		return this
	},
	insertSibling : function(e, c, d) {
		var f = this, b, a = (c || "before").toLowerCase() == "after", g;
		if (Ext.isArray(e)) {
			g = f;
			Ext.each(e, function(h) {
						b = Ext.fly(g, "_internal").insertSibling(h, c, d);
						if (a) {
							g = b
						}
					});
			return b
		}
		e = e || {};
		if (e.nodeType || e.dom) {
			b = f.dom.parentNode.insertBefore(Ext.getDom(e), a
							? f.dom.nextSibling
							: f.dom);
			if (!d) {
				b = Ext.get(b)
			}
		} else {
			if (a && !f.dom.nextSibling) {
				b = Ext.core.DomHelper.append(f.dom.parentNode, e, !d)
			} else {
				b = Ext.core.DomHelper[a ? "insertAfter" : "insertBefore"](
						f.dom, e, !d)
			}
		}
		return b
	},
	replace : function(a) {
		a = Ext.get(a);
		this.insertBefore(a);
		a.remove();
		return this
	},
	replaceWith : function(a) {
		var b = this;
		if (a.nodeType || a.dom || typeof a == "string") {
			a = Ext.get(a);
			b.dom.parentNode.insertBefore(a, b.dom)
		} else {
			a = Ext.core.DomHelper.insertBefore(b.dom, a)
		}
		delete Ext.cache[b.id];
		Ext.removeNode(b.dom);
		b.id = Ext.id(b.dom = a);
		Ext.dom.Element.addToCache(b.isFlyweight
				? new Ext.dom.Element(b.dom)
				: b);
		return b
	},
	createChild : function(b, a, c) {
		b = b || {
			tag : "div"
		};
		if (a) {
			return Ext.core.DomHelper.insertBefore(a, b, c !== true)
		} else {
			return Ext.core.DomHelper[!this.dom.firstChild
					? "insertFirst"
					: "append"](this.dom, b, c !== true)
		}
	},
	wrap : function(b, c) {
		var e = this.dom, f = this.self.create(b, c), d = (c) ? f : f.dom, a = e.parentNode;
		if (a) {
			a.insertBefore(d, e)
		}
		d.appendChild(e);
		return f
	},
	wrapAllChildren : function(a) {
		var d = this.dom, b = d.childNodes, e = this.self.create(a), c = e.dom;
		while (b.length > 0) {
			c.appendChild(d.firstChild)
		}
		d.appendChild(c);
		return e
	},
	unwrapAllChildren : function() {
		var c = this.dom, b = c.childNodes, a = c.parentNode;
		if (a) {
			while (b.length > 0) {
				a.insertBefore(c, c.firstChild)
			}
			this.destroy()
		}
	},
	unwrap : function() {
		var c = this.dom, a = c.parentNode, b;
		if (a) {
			b = a.parentNode;
			b.insertBefore(c, a);
			b.removeChild(a)
		} else {
			b = document.createDocumentFragment();
			b.appendChild(c)
		}
		return this
	},
	insertHtml : function(b, c, a) {
		var d = Ext.core.DomHelper.insertHtml(b, this.dom, c);
		return a ? Ext.get(d) : d
	}
});
Ext.dom.Element.override({
	getX : function(a) {
		return this.getXY(a)[0]
	},
	getY : function(a) {
		return this.getXY(a)[1]
	},
	getXY : function() {
		var a = window.webkitConvertPointFromNodeToPage;
		if (a) {
			return function() {
				var b = a(this.dom, new WebKitPoint(0, 0));
				return [b.x, b.y]
			}
		} else {
			return function() {
				var c = this.dom.getBoundingClientRect(), b = Math.round;
				return [b(c.left + window.pageXOffset),
						b(c.top + window.pageYOffset)]
			}
		}
	}(),
	getOffsetsTo : function(a) {
		var c = this.getXY(), b = Ext.fly(a, "_internal").getXY();
		return [c[0] - b[0], c[1] - b[1]]
	},
	setX : function(a) {
		return this.setXY([a, this.getY()])
	},
	setY : function(a) {
		return this.setXY([this.getX(), a])
	},
	setXY : function(d) {
		var b = this;
		if (arguments.length > 1) {
			d = [d, arguments[1]]
		}
		var c = b.translatePoints(d), a = b.dom.style;
		for (d in c) {
			if (!c.hasOwnProperty(d)) {
				continue
			}
			if (!isNaN(c[d])) {
				a[d] = c[d] + "px"
			}
		}
		return b
	},
	getLeft : function() {
		return parseInt(this.getStyle("left"), 10) || 0
	},
	getRight : function() {
		return parseInt(this.getStyle("right"), 10) || 0
	},
	getTop : function() {
		return parseInt(this.getStyle("top"), 10) || 0
	},
	getBottom : function() {
		return parseInt(this.getStyle("bottom"), 10) || 0
	},
	translatePoints : function(a, g) {
		g = isNaN(a[1]) ? g : a[1];
		a = isNaN(a[0]) ? a : a[0];
		var d = this, e = d.isStyle("position", "relative"), f = d.getXY(), b = parseInt(
				d.getStyle("left"), 10), c = parseInt(d.getStyle("top"), 10);
		b = !isNaN(b) ? b : (e ? 0 : d.dom.offsetLeft);
		c = !isNaN(c) ? c : (e ? 0 : d.dom.offsetTop);
		return {
			left : (a - f[0] + b),
			top : (g - f[1] + c)
		}
	},
	setBox : function(d) {
		var c = this, b = d.width, a = d.height, f = d.top, e = d.left;
		if (e !== undefined) {
			c.setLeft(e)
		}
		if (f !== undefined) {
			c.setTop(f)
		}
		if (b !== undefined) {
			c.setWidth(b)
		}
		if (a !== undefined) {
			c.setHeight(a)
		}
		return this
	},
	getBox : function(g, j) {
		var h = this, e = h.dom, c = e.offsetWidth, k = e.offsetHeight, n, f, d, a, m, i;
		if (!j) {
			n = h.getXY()
		} else {
			if (g) {
				n = [0, 0]
			} else {
				n = [parseInt(h.getStyle("left"), 10) || 0,
						parseInt(h.getStyle("top"), 10) || 0]
			}
		}
		if (!g) {
			f = {
				x : n[0],
				y : n[1],
				0 : n[0],
				1 : n[1],
				width : c,
				height : k
			}
		} else {
			d = h.getBorderWidth.call(h, "l") + h.getPadding.call(h, "l");
			a = h.getBorderWidth.call(h, "r") + h.getPadding.call(h, "r");
			m = h.getBorderWidth.call(h, "t") + h.getPadding.call(h, "t");
			i = h.getBorderWidth.call(h, "b") + h.getPadding.call(h, "b");
			f = {
				x : n[0] + d,
				y : n[1] + m,
				0 : n[0] + d,
				1 : n[1] + m,
				width : c - (d + a),
				height : k - (m + i)
			}
		}
		f.left = f.x;
		f.top = f.y;
		f.right = f.x + f.width;
		f.bottom = f.y + f.height;
		return f
	},
	getPageBox : function(e) {
		var g = this, c = g.dom, j = c.offsetWidth, f = c.offsetHeight, m = g
				.getXY(), k = m[1], a = m[0] + j, i = m[1] + f, d = m[0];
		if (!c) {
			return new Ext.util.Region()
		}
		if (e) {
			return new Ext.util.Region(k, a, i, d)
		} else {
			return {
				left : d,
				top : k,
				width : j,
				height : f,
				right : a,
				bottom : i
			}
		}
	}
});
Ext.dom.Element.addMembers({
	WIDTH : "width",
	HEIGHT : "height",
	MIN_WIDTH : "min-width",
	MIN_HEIGHT : "min-height",
	MAX_WIDTH : "max-width",
	MAX_HEIGHT : "max-height",
	TOP : "top",
	RIGHT : "right",
	BOTTOM : "bottom",
	LEFT : "left",
	VISIBILITY : 1,
	DISPLAY : 2,
	OFFSETS : 3,
	SEPARATOR : "-",
	trimRe : /^\s+|\s+$/g,
	wordsRe : /\w/g,
	spacesRe : /\s+/,
	styleSplitRe : /\s*(?::|;)\s*/,
	transparentRe : /^(?:transparent|(?:rgba[(](?:\s*\d+\s*[,]){3}\s*0\s*[)]))$/i,
	classNameSplitRegex : /[\s]+/,
	borders : {
		t : "border-top-width",
		r : "border-right-width",
		b : "border-bottom-width",
		l : "border-left-width"
	},
	paddings : {
		t : "padding-top",
		r : "padding-right",
		b : "padding-bottom",
		l : "padding-left"
	},
	margins : {
		t : "margin-top",
		r : "margin-right",
		b : "margin-bottom",
		l : "margin-left"
	},
	defaultUnit : "px",
	isSynchronized : false,
	synchronize : function() {
		var g = this.dom, a = {}, d = g.className, f, c, e, b;
		if (d.length > 0) {
			f = g.className.split(this.classNameSplitRegex);
			for (c = 0, e = f.length; c < e; c++) {
				b = f[c];
				a[b] = true
			}
		} else {
			f = []
		}
		this.classList = f;
		this.hasClassMap = a;
		this.isSynchronized = true;
		return this
	},
	addCls : function(j, g, k) {
		if (!j) {
			return this
		}
		if (!this.isSynchronized) {
			this.synchronize()
		}
		var e = this.dom, c = this.hasClassMap, d = this.classList, a = this.SEPARATOR, f, h, b;
		g = g ? g + a : "";
		k = k ? a + k : "";
		if (typeof j == "string") {
			j = j.split(this.spacesRe)
		}
		for (f = 0, h = j.length; f < h; f++) {
			b = g + j[f] + k;
			if (!c[b]) {
				c[b] = true;
				d.push(b)
			}
		}
		e.className = d.join(" ");
		return this
	},
	removeCls : function(j, g, k) {
		if (!j) {
			return this
		}
		if (!this.isSynchronized) {
			this.synchronize()
		}
		if (!k) {
			k = ""
		}
		var e = this.dom, c = this.hasClassMap, d = this.classList, a = this.SEPARATOR, f, h, b;
		g = g ? g + a : "";
		k = k ? a + k : "";
		if (typeof j == "string") {
			j = j.split(this.spacesRe)
		}
		for (f = 0, h = j.length; f < h; f++) {
			b = g + j[f] + k;
			if (c[b]) {
				delete c[b];
				Ext.Array.remove(d, b)
			}
		}
		e.className = d.join(" ");
		return this
	},
	replaceCls : function(b, a, c, d) {
		return this.removeCls(b, c, d).addCls(a, c, d)
	},
	hasCls : function(a) {
		if (!this.isSynchronized) {
			this.synchronize()
		}
		return this.hasClassMap.hasOwnProperty(a)
	},
	toggleCls : function(a) {
		return this.hasCls(a) ? this.removeCls(a) : this.addCls(a)
	},
	setWidth : function(a) {
		return this.setLengthValue(this.WIDTH, a)
	},
	setHeight : function(a) {
		return this.setLengthValue(this.HEIGHT, a)
	},
	setSize : function(b, a) {
		if (Ext.isObject(b)) {
			a = b.height;
			b = b.width
		}
		this.setWidth(b);
		this.setHeight(a);
		return this
	},
	setMinWidth : function(a) {
		return this.setLengthValue(this.MIN_WIDTH, a)
	},
	setMinHeight : function(a) {
		return this.setLengthValue(this.MIN_HEIGHT, a)
	},
	setMaxWidth : function(a) {
		return this.setLengthValue(this.MAX_WIDTH, a)
	},
	setMaxHeight : function(a) {
		return this.setLengthValue(this.MAX_HEIGHT, a)
	},
	setTop : function(a) {
		return this.setLengthValue(this.TOP, a)
	},
	setRight : function(a) {
		return this.setLengthValue(this.RIGHT, a)
	},
	setBottom : function(a) {
		return this.setLengthValue(this.BOTTOM, a)
	},
	setLeft : function(a) {
		return this.setLengthValue(this.LEFT, a)
	},
	setMargin : function(b) {
		var a = this.dom.style;
		if (b || b === 0) {
			b = this.self.unitizeBox((b === true) ? 5 : b);
			a.setProperty("margin", b, "important")
		} else {
			a.removeProperty("margin-top");
			a.removeProperty("margin-right");
			a.removeProperty("margin-bottom");
			a.removeProperty("margin-left")
		}
	},
	setPadding : function(b) {
		var a = this.dom.style;
		if (b || b === 0) {
			b = this.self.unitizeBox((b === true) ? 5 : b);
			a.setProperty("padding", b, "important")
		} else {
			a.removeProperty("padding-top");
			a.removeProperty("padding-right");
			a.removeProperty("padding-bottom");
			a.removeProperty("padding-left")
		}
	},
	setBorder : function(a) {
		var b = this.dom.style;
		if (a || a === 0) {
			a = this.self.unitizeBox((a === true) ? 1 : a);
			b.setProperty("border-width", a, "important")
		} else {
			b.removeProperty("border-top-width");
			b.removeProperty("border-right-width");
			b.removeProperty("border-bottom-width");
			b.removeProperty("border-left-width")
		}
	},
	setLengthValue : function(a, c) {
		var b = this.dom.style;
		if (c === null) {
			b.removeProperty(a);
			return this
		}
		if (typeof c == "number") {
			c = c + "px"
		}
		b.setProperty(a, c, "important");
		return this
	},
	setVisible : function(b) {
		var a = this.getVisibilityMode(), c = b ? "removeCls" : "addCls";
		switch (a) {
			case this.VISIBILITY :
				this.removeCls(["x-hidden-display", "x-hidden-offsets"]);
				this[c]("x-hidden-visibility");
				break;
			case this.DISPLAY :
				this.removeCls(["x-hidden-visibility", "x-hidden-offsets"]);
				this[c]("x-hidden-display");
				break;
			case this.OFFSETS :
				this.removeCls(["x-hidden-visibility", "x-hidden-display"]);
				this[c]("x-hidden-offsets");
				break
		}
		return this
	},
	getVisibilityMode : function() {
		var b = this.dom, a = Ext.dom.Element.data(b, "visibilityMode");
		if (a === undefined) {
			Ext.dom.Element.data(b, "visibilityMode", a = this.DISPLAY)
		}
		return a
	},
	setVisibilityMode : function(a) {
		this.self.data(this.dom, "visibilityMode", a);
		return this
	},
	show : function() {
		var a = this.dom;
		if (a) {
			a.style.removeProperty("display")
		}
	},
	hide : function() {
		this.dom.style.setProperty("display", "none", "important")
	},
	setVisibility : function(a) {
		var b = this.dom.style;
		if (a) {
			b.removeProperty("visibility")
		} else {
			b.setProperty("visibility", "hidden", "important")
		}
	},
	styleHooks : {},
	addStyles : function(h, g) {
		var b = 0, f = h.match(this.wordsRe), e = 0, a = f.length, d, c;
		for (; e < a; e++) {
			d = f[e];
			c = d && parseInt(this.getStyle(g[d]), 10);
			if (c) {
				b += Math.abs(c)
			}
		}
		return b
	},
	isStyle : function(a, b) {
		return this.getStyle(a) == b
	},
	getStyle : function(f) {
		var c = this, e = c.dom, d = c.styleHooks[f], b, a;
		if (e == document) {
			return null
		}
		if (!d) {
			c.styleHooks[f] = d = {
				name : Ext.dom.Element.normalize(f)
			}
		}
		if (d.get) {
			return d.get(e, c)
		}
		b = window.getComputedStyle(e, "");
		a = (b && b[d.name]);
		return a
	},
	setStyle : function(a, h) {
		var f = this, d = f.dom, i = f.styleHooks, b = d.style, e = Ext.valueFrom, c, g;
		if (typeof a == "string") {
			g = i[a];
			if (!g) {
				i[a] = g = {
					name : Ext.dom.Element.normalize(a)
				}
			}
			h = e(h, "");
			if (g.set) {
				g.set(d, h, f)
			} else {
				b[g.name] = h
			}
		} else {
			for (c in a) {
				if (a.hasOwnProperty(c)) {
					g = i[c];
					if (!g) {
						i[c] = g = {
							name : Ext.dom.Element.normalize(c)
						}
					}
					h = e(a[c], "");
					if (g.set) {
						g.set(d, h, f)
					} else {
						b[g.name] = h
					}
				}
			}
		}
		return f
	},
	getHeight : function(b) {
		var c = this.dom, a = b
				? (c.clientHeight - this.getPadding("tb"))
				: c.offsetHeight;
		return a > 0 ? a : 0
	},
	getWidth : function(a) {
		var c = this.dom, b = a
				? (c.clientWidth - this.getPadding("lr"))
				: c.offsetWidth;
		return b > 0 ? b : 0
	},
	getBorderWidth : function(a) {
		return this.addStyles(a, this.borders)
	},
	getPadding : function(a) {
		return this.addStyles(a, this.paddings)
	},
	applyStyles : function(d) {
		if (d) {
			var e = this.dom, c, b, a;
			if (typeof d == "function") {
				d = d.call()
			}
			c = typeof d;
			if (c == "string") {
				d = Ext.util.Format.trim(d).split(this.styleSplitRe);
				for (b = 0, a = d.length; b < a;) {
					e.style[Ext.dom.Element.normalize(d[b++])] = d[b++]
				}
			} else {
				if (c == "object") {
					this.setStyle(d)
				}
			}
		}
	},
	getSize : function(b) {
		var a = this.dom;
		return {
			width : Math.max(0, b
							? (a.clientWidth - this.getPadding("lr"))
							: a.offsetWidth),
			height : Math.max(0, b
							? (a.clientHeight - this.getPadding("tb"))
							: a.offsetHeight)
		}
	},
	repaint : function() {
		var a = this.dom;
		this.addCls(Ext.baseCSSPrefix + "repaint");
		setTimeout(function() {
					Ext.fly(a).removeCls(Ext.baseCSSPrefix + "repaint")
				}, 1);
		return this
	},
	getMargin : function(b) {
		var c = this, d = {
			t : "top",
			l : "left",
			r : "right",
			b : "bottom"
		}, e = {}, a;
		if (!b) {
			for (a in c.margins) {
				e[d[a]] = parseFloat(c.getStyle(c.margins[a])) || 0
			}
			return e
		} else {
			return c.addStyles.call(c, b, c.margins)
		}
	}
});
Ext.dom.Element.addMembers({
			getParent : function() {
				return Ext.get(this.dom.parentNode)
			},
			getFirstChild : function() {
				return Ext.get(this.dom.firstElementChild)
			},
			contains : function(a) {
				if (!a) {
					return false
				}
				var b = Ext.getDom(a);
				return (b === this.dom) || this.self.isAncestor(this.dom, b)
			},
			findParent : function(h, g, c) {
				var e = this.dom, a = document.body, f = 0, d;
				g = g || 50;
				if (isNaN(g)) {
					d = Ext.getDom(g);
					g = Number.MAX_VALUE
				}
				while (e && e.nodeType == 1 && f < g && e != a && e != d) {
					if (Ext.DomQuery.is(e, h)) {
						return c ? Ext.get(e) : e
					}
					f++;
					e = e.parentNode
				}
				return null
			},
			findParentNode : function(d, c, a) {
				var b = Ext.fly(this.dom.parentNode, "_internal");
				return b ? b.findParent(d, c, a) : null
			},
			up : function(b, a) {
				return this.findParentNode(b, a, true)
			},
			select : function(a, b) {
				return Ext.dom.Element.select(a, this.dom, b)
			},
			query : function(a) {
				return Ext.DomQuery.select(a, this.dom)
			},
			down : function(a, b) {
				var c = Ext.DomQuery.selectNode(a, this.dom);
				return b ? c : Ext.get(c)
			},
			child : function(a, b) {
				var d, c = this, e;
				e = Ext.get(c).id;
				e = e.replace(/[\.:]/g, "\\$0");
				d = Ext.DomQuery.selectNode("#" + e + " > " + a, c.dom);
				return b ? d : Ext.get(d)
			},
			parent : function(a, b) {
				return this.matchNode("parentNode", "parentNode", a, b)
			},
			next : function(a, b) {
				return this.matchNode("nextSibling", "nextSibling", a, b)
			},
			prev : function(a, b) {
				return this.matchNode("previousSibling", "previousSibling", a,
						b)
			},
			first : function(a, b) {
				return this.matchNode("nextSibling", "firstChild", a, b)
			},
			last : function(a, b) {
				return this.matchNode("previousSibling", "lastChild", a, b)
			},
			matchNode : function(b, e, a, c) {
				if (!this.dom) {
					return null
				}
				var d = this.dom[e];
				while (d) {
					if (d.nodeType == 1 && (!a || Ext.DomQuery.is(d, a))) {
						return !c ? Ext.get(d) : d
					}
					d = d[b]
				}
				return null
			},
			isAncestor : function(a) {
				return this.self.isAncestor.call(this.self, this.dom, a)
			}
		});
Ext.define("Ext.dom.CompositeElementLite", {
			alternateClassName : ["Ext.CompositeElementLite",
					"Ext.CompositeElement"],
			requires : ["Ext.dom.Element"],
			statics : {
				importElementMethods : function() {
				}
			},
			constructor : function(b, a) {
				this.elements = [];
				this.add(b, a);
				this.el = new Ext.dom.Element.Fly()
			},
			isComposite : true,
			getElement : function(a) {
				return this.el.attach(a).synchronize()
			},
			transformElement : function(a) {
				return Ext.getDom(a)
			},
			getCount : function() {
				return this.elements.length
			},
			add : function(c, a) {
				var e = this.elements, b, d;
				if (!c) {
					return this
				}
				if (typeof c == "string") {
					c = Ext.dom.Element.selectorFunction(c, a)
				} else {
					if (c.isComposite) {
						c = c.elements
					} else {
						if (!Ext.isIterable(c)) {
							c = [c]
						}
					}
				}
				for (b = 0, d = c.length; b < d; ++b) {
					e.push(this.transformElement(c[b]))
				}
				return this
			},
			invoke : function(d, a) {
				var f = this.elements, e = f.length, c, b;
				for (b = 0; b < e; b++) {
					c = f[b];
					if (c) {
						Ext.dom.Element.prototype[d].apply(this.getElement(c),
								a)
					}
				}
				return this
			},
			item : function(b) {
				var c = this.elements[b], a = null;
				if (c) {
					a = this.getElement(c)
				}
				return a
			},
			addListener : function(b, h, g, f) {
				var d = this.elements, a = d.length, c, j;
				for (c = 0; c < a; c++) {
					j = d[c];
					if (j) {
						j.on(b, h, g || j, f)
					}
				}
				return this
			},
			each : function(f, d) {
				var g = this, c = g.elements, a = c.length, b, h;
				for (b = 0; b < a; b++) {
					h = c[b];
					if (h) {
						h = this.getElement(h);
						if (f.call(d || h, h, g, b) === false) {
							break
						}
					}
				}
				return g
			},
			fill : function(a) {
				var b = this;
				b.elements = [];
				b.add(a);
				return b
			},
			filter : function(a) {
				var b = [], d = this, c = Ext.isFunction(a) ? a : function(e) {
					return e.is(a)
				};
				d.each(function(g, e, f) {
							if (c(g, f) !== false) {
								b[b.length] = d.transformElement(g)
							}
						});
				d.elements = b;
				return d
			},
			indexOf : function(a) {
				return Ext.Array.indexOf(this.elements, this
								.transformElement(a))
			},
			replaceElement : function(e, c, a) {
				var b = !isNaN(e) ? e : this.indexOf(e), f;
				if (b > -1) {
					c = Ext.getDom(c);
					if (a) {
						f = this.elements[b];
						f.parentNode.insertBefore(c, f);
						Ext.removeNode(f)
					}
					Ext.Array.splice(this.elements, b, 1, c)
				}
				return this
			},
			clear : function() {
				this.elements = []
			},
			addElements : function(c, a) {
				if (!c) {
					return this
				}
				if (typeof c == "string") {
					c = Ext.dom.Element.selectorFunction(c, a)
				}
				var b = this.elements;
				Ext.each(c, function(d) {
							b.push(Ext.get(d))
						});
				return this
			},
			first : function() {
				return this.item(0)
			},
			last : function() {
				return this.item(this.getCount() - 1)
			},
			contains : function(a) {
				return this.indexOf(a) != -1
			},
			removeElement : function(c, e) {
				var b = this, d = this.elements, a;
				Ext.each(c, function(f) {
							if ((a = (d[f] || d[f = b.indexOf(f)]))) {
								if (e) {
									if (a.dom) {
										a.remove()
									} else {
										Ext.removeNode(a)
									}
								}
								Ext.Array.erase(d, f, 1)
							}
						});
				return this
			}
		}, function() {
			var a = Ext.dom.Element, d = a.prototype, c = this.prototype, b;
			for (b in d) {
				if (typeof d[b] == "function") {
					(function(e) {
						c[e] = c[e] || function() {
							return this.invoke(e, arguments)
						}
					}).call(c, b)
				}
			}
			c.on = c.addListener;
			if (Ext.DomQuery) {
				a.selectorFunction = Ext.DomQuery.select
			}
			a.select = function(e, f) {
				var g;
				if (typeof e == "string") {
					g = a.selectorFunction(e, f)
				} else {
					if (e.length !== undefined) {
						g = e
					} else {
					}
				}
				return new Ext.CompositeElementLite(g)
			};
			Ext.select = function() {
				return a.select.apply(a, arguments)
			}
		});
