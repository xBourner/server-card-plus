//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = "0.3.0", i, a, o, s, c, l, u, d, f, p = t((() => {
	i = globalThis, a = i.ShadowRoot && (i.ShadyCSS === void 0 || i.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, o = Symbol(), s = /* @__PURE__ */ new WeakMap(), c = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== o) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (a && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = s.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && s.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, l = (e) => new c(typeof e == "string" ? e : e + "", void 0, o), u = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new c(n, e, o);
	}, d = (e, t) => {
		if (a) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), r = i.litNonce;
			r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
		}
	}, f = a ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return l(t);
	})(e) : e;
})), m, h, ee, g, _, te, v, y, ne, b, x, S, C, re, w, T = t((() => {
	p(), {is: m, defineProperty: h, getOwnPropertyDescriptor: ee, getOwnPropertyNames: g, getOwnPropertySymbols: _, getPrototypeOf: te} = Object, v = globalThis, y = v.trustedTypes, ne = y ? y.emptyScript : "", b = v.reactiveElementPolyfillSupport, x = (e, t) => e, S = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? ne : null;
					break;
				case Object:
				case Array: e = e == null ? e : JSON.stringify(e);
			}
			return e;
		},
		fromAttribute(e, t) {
			let n = e;
			switch (t) {
				case Boolean:
					n = e !== null;
					break;
				case Number:
					n = e === null ? null : Number(e);
					break;
				case Object:
				case Array: try {
					n = JSON.parse(e);
				} catch {
					n = null;
				}
			}
			return n;
		}
	}, C = (e, t) => !m(e, t), re = {
		attribute: !0,
		type: String,
		converter: S,
		reflect: !1,
		useDefault: !1,
		hasChanged: C
	}, Symbol.metadata ??= Symbol("metadata"), v.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap(), w = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ??= []).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = re) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && h(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = ee(this.prototype, e) ?? {
				get() {
					return this[t];
				},
				set(e) {
					this[t] = e;
				}
			};
			return {
				get: r,
				set(t) {
					let a = r?.call(this);
					i?.call(this, t), this.requestUpdate(e, a, n);
				},
				configurable: !0,
				enumerable: !0
			};
		}
		static getPropertyOptions(e) {
			return this.elementProperties.get(e) ?? re;
		}
		static _$Ei() {
			if (this.hasOwnProperty(x("elementProperties"))) return;
			let e = te(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(x("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
				let e = this.properties, t = [...g(e), ..._(e)];
				for (let n of t) this.createProperty(n, e[n]);
			}
			let e = this[Symbol.metadata];
			if (e !== null) {
				let t = litPropertyMetadata.get(e);
				if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
			}
			this._$Eh = /* @__PURE__ */ new Map();
			for (let [e, t] of this.elementProperties) {
				let n = this._$Eu(e, t);
				n !== void 0 && this._$Eh.set(n, e);
			}
			this.elementStyles = this.finalizeStyles(this.styles);
		}
		static finalizeStyles(e) {
			let t = [];
			if (Array.isArray(e)) {
				let n = new Set(e.flat(1 / 0).reverse());
				for (let e of n) t.unshift(f(e));
			} else e !== void 0 && t.push(f(e));
			return t;
		}
		static _$Eu(e, t) {
			let n = t.attribute;
			return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
		}
		constructor() {
			super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
		}
		_$Ev() {
			this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
		}
		addController(e) {
			(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
		}
		removeController(e) {
			this._$EO?.delete(e);
		}
		_$E_() {
			let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
			for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
			e.size > 0 && (this._$Ep = e);
		}
		createRenderRoot() {
			let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
			return d(e, this.constructor.elementStyles), e;
		}
		connectedCallback() {
			this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
		}
		enableUpdating(e) {}
		disconnectedCallback() {
			this._$EO?.forEach((e) => e.hostDisconnected?.());
		}
		attributeChangedCallback(e, t, n) {
			this._$AK(e, n);
		}
		_$ET(e, t) {
			let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
			if (r !== void 0 && !0 === n.reflect) {
				let i = (n.converter?.toAttribute === void 0 ? S : n.converter).toAttribute(t, n.type);
				this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? S : e.converter;
				this._$Em = r;
				let a = i.fromAttribute(t, e.type);
				this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				let a = this.constructor;
				if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? C)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
				this.C(e, t, n);
			}
			!1 === this.isUpdatePending && (this._$ES = this._$EP());
		}
		C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
			n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
		}
		async _$EP() {
			this.isUpdatePending = !0;
			try {
				await this._$ES;
			} catch (e) {
				Promise.reject(e);
			}
			let e = this.scheduleUpdate();
			return e != null && await e, !this.isUpdatePending;
		}
		scheduleUpdate() {
			return this.performUpdate();
		}
		performUpdate() {
			if (!this.isUpdatePending) return;
			if (!this.hasUpdated) {
				if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
					for (let [e, t] of this._$Ep) this[e] = t;
					this._$Ep = void 0;
				}
				let e = this.constructor.elementProperties;
				if (e.size > 0) for (let [t, n] of e) {
					let { wrapped: e } = n, r = this[t];
					!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
				}
			}
			let e = !1, t = this._$AL;
			try {
				e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
			} catch (t) {
				throw e = !1, this._$EM(), t;
			}
			e && this._$AE(t);
		}
		willUpdate(e) {}
		_$AE(e) {
			this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
		}
		_$EM() {
			this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
		}
		get updateComplete() {
			return this.getUpdateComplete();
		}
		getUpdateComplete() {
			return this._$ES;
		}
		shouldUpdate(e) {
			return !0;
		}
		update(e) {
			this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
		}
		updated(e) {}
		firstUpdated(e) {}
	}, w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[x("elementProperties")] = /* @__PURE__ */ new Map(), w[x("finalized")] = /* @__PURE__ */ new Map(), b?.({ ReactiveElement: w }), (v.reactiveElementVersions ??= []).push("2.1.2");
}));
//#endregion
//#region node_modules/lit-html/lit-html.js
function ie(e, t) {
	if (!N(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
function E(e, t, n = e, r) {
	if (t === z) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = M(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = E(e, i._$AS(e, t.values), i, r)), t;
}
var D, ae, O, oe, se, k, ce, le, A, j, M, N, ue, P, F, de, fe, I, pe, me, he, L, R, z, B, ge, V, _e, H, ve, U, W, ye, be, xe, Se, Ce, we, Te = t((() => {
	D = globalThis, ae = (e) => e, O = D.trustedTypes, oe = O ? O.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, se = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + k, le = `<${ce}>`, A = document, j = () => A.createComment(""), M = (e) => e === null || typeof e != "object" && typeof e != "function", N = Array.isArray, ue = (e) => N(e) || typeof e?.[Symbol.iterator] == "function", P = "[ 	\n\f\r]", F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, fe = />/g, I = RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, me = /"/g, he = /^(?:script|style|textarea|title)$/i, L = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), R = L(1), L(2), L(3), z = Symbol.for("lit-noChange"), B = Symbol.for("lit-nothing"), ge = /* @__PURE__ */ new WeakMap(), V = A.createTreeWalker(A, 129), _e = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = F;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === F ? c[1] === "!--" ? o = de : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = I) : (he.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = I) : o = fe : o === I ? c[0] === ">" ? (o = i ?? F, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? I : c[3] === "\"" ? me : pe) : o === me || o === pe ? o = I : o === de || o === fe ? o = F : (o = I, i = void 0);
			let d = o === I && e[t + 1].startsWith("/>") ? " " : "";
			a += o === F ? n + le : l >= 0 ? (r.push(s), n.slice(0, l) + se + n.slice(l) + k + d) : n + k + (l === -2 ? t : d);
		}
		return [ie(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, H = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = _e(t, n);
			if (this.el = e.createElement(l, r), V.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = V.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(se)) {
						let t = u[o++], n = i.getAttribute(e).split(k), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? ye : r[1] === "?" ? be : r[1] === "@" ? xe : W
						}), i.removeAttribute(e);
					} else e.startsWith(k) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (he.test(i.tagName)) {
						let e = i.textContent.split(k), t = e.length - 1;
						if (t > 0) {
							i.textContent = O ? O.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], j()), V.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], j());
						}
					}
				} else if (i.nodeType === 8) {
					if (i.data === ce) c.push({
						type: 2,
						index: a
					});
					else {
						let e = -1;
						for (; (e = i.data.indexOf(k, e + 1)) !== -1;) c.push({
							type: 7,
							index: a
						}), e += k.length - 1;
					}
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = A.createElement("template");
			return n.innerHTML = e, n;
		}
	}, ve = class {
		constructor(e, t) {
			this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
		}
		get parentNode() {
			return this._$AM.parentNode;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		u(e) {
			let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? A).importNode(t, !0);
			V.currentNode = r;
			let i = V.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new U(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Se(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== s?.index && (i = V.nextNode(), a++);
			}
			return V.currentNode = A, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, U = class e {
		get _$AU() {
			return this._$AM?._$AU ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = B, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
		}
		get parentNode() {
			let e = this._$AA.parentNode, t = this._$AM;
			return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
		}
		get startNode() {
			return this._$AA;
		}
		get endNode() {
			return this._$AB;
		}
		_$AI(e, t = this) {
			e = E(this, e, t), M(e) ? e === B || e == null || e === "" ? (this._$AH !== B && this._$AR(), this._$AH = B) : e !== this._$AH && e !== z && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== B && M(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = H.createElement(ie(n.h, n.h[0]), this.options)), n);
			if (this._$AH?._$AD === r) this._$AH.p(t);
			else {
				let e = new ve(r, this), n = e.u(this.options);
				e.p(t), this.T(n), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = ge.get(e.strings);
			return t === void 0 && ge.set(e.strings, t = new H(e)), t;
		}
		k(t) {
			N(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(j()), this.O(j()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
				let t = ae(e).nextSibling;
				ae(e).remove(), e = t;
			}
		}
		setConnected(e) {
			this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
		}
	}, W = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = B, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = B;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = E(this, e, t, 0), a = !M(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = E(this, r[n + o], t, o), s === z && (s = this._$AH[o]), a ||= !M(s) || s !== this._$AH[o], s === B ? e = B : e !== B && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === B ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, ye = class extends W {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === B ? void 0 : e;
		}
	}, be = class extends W {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== B);
		}
	}, xe = class extends W {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = E(this, e, t, 0) ?? B) === z) return;
			let n = this._$AH, r = e === B && n !== B || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== B && (n === B || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, Se = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			E(this, e);
		}
	}, Ce = D.litHtmlPolyfillSupport, Ce?.(H, U), (D.litHtmlVersions ??= []).push("3.3.3"), we = (e, t, n) => {
		let r = n?.renderBefore ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = n?.renderBefore ?? null;
			r._$litPart$ = i = new U(t.insertBefore(j(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), G, K, Ee, De = t((() => {
	T(), T(), Te(), Te(), G = globalThis, K = class extends w {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			let e = super.createRenderRoot();
			return this.renderOptions.renderBefore ??= e.firstChild, e;
		}
		update(e) {
			let t = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = we(t, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			super.connectedCallback(), this._$Do?.setConnected(!0);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._$Do?.setConnected(!1);
		}
		render() {
			return z;
		}
	}, K._$litElement$ = !0, K.finalized = !0, G.litElementHydrateSupport?.({ LitElement: K }), Ee = G.litElementPolyfillSupport, Ee?.({ LitElement: K }), (G.litElementVersions ??= []).push("4.2.2");
})), Oe = t((() => {})), ke = t((() => {
	T(), Te(), De(), Oe();
})), Ae, je = t((() => {
	Ae = (e) => (t, n) => {
		n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
			customElements.define(e, t);
		});
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
function q(e) {
	return (t, n) => typeof n == "object" ? Ne(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
var Me, Ne, Pe = t((() => {
	T(), Me = {
		attribute: !0,
		type: String,
		converter: S,
		reflect: !1,
		hasChanged: C
	}, Ne = (e = Me, t, n) => {
		let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
		if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
			let { name: r } = n;
			return {
				set(n) {
					let i = t.get.call(this);
					t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
				},
				init(t) {
					return t !== void 0 && this.C(r, void 0, e, t), t;
				}
			};
		}
		if (r === "setter") {
			let { name: r } = n;
			return function(n) {
				let i = this[r];
				t.call(this, n), this.requestUpdate(r, i, e, !0, n);
			};
		}
		throw Error("Unsupported decorator location: " + r);
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function Fe(e) {
	return q({
		...e,
		state: !0,
		attribute: !1
	});
}
var Ie = t((() => {
	Pe();
})), Le = t((() => {})), Re = t((() => {})), ze = t((() => {})), Be = t((() => {})), Ve = t((() => {})), He = t((() => {})), Ue = t((() => {
	je(), Pe(), Ie(), Le(), Re(), ze(), Be(), Ve(), He();
}));
//#endregion
//#region src/detect.ts
function We(e, t) {
	let n = {
		start: null,
		stop: null,
		reboot: null,
		shutdown: null
	}, r = "button." + e + "_";
	for (let e of t) {
		if (!e.startsWith(r)) continue;
		let t = Ze.find(([, t]) => t.test(e));
		t && !n[t[0]] && (n[t[0]] = e);
	}
	return n;
}
function Ge(e) {
	return String(e || "").toLowerCase();
}
function Ke(e) {
	let t = Ge(e);
	return Qe.some((e) => t.includes(e));
}
function J(e) {
	let t = (e || []).map((e) => typeof e == "string" ? { entity_id: e } : e), n = /* @__PURE__ */ new Map(), r = [
		[/^binary_sensor\.node_(.+)_status$/, "node"],
		[/^binary_sensor\.lxc_(.+)_status$/, "lxc"],
		[/^binary_sensor\.qemu_(.+)_status$/, "qemu"]
	];
	for (let e of t) for (let [t, i] of r) {
		let r = t.exec(e.entity_id);
		if (r) {
			let t = `${i}_${r[1]}`;
			n.has(t) ? n.get(t).statusEntity = e.entity_id : n.set(t, {
				key: t,
				kind: i,
				label: r[1].replace(/_/g, " "),
				statusEntity: e.entity_id
			});
		}
	}
	return Array.from(n.values()).sort((e, t) => {
		let n = (e) => e === "node" ? 0 : e === "qemu" ? 1 : 2;
		return n(e.kind) === n(t.kind) ? e.key.localeCompare(t.key) : n(e.kind) - n(t.kind);
	});
}
function qe(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Y(e, t) {
	return e.find((e) => t.test(e)) || null;
}
function Je(e, t) {
	let n = (t || []).map((e) => typeof e == "string" ? { entity_id: e } : e), r = J(n).map((e) => e.key).filter((t) => t.startsWith(e + "_")).flatMap((e) => ["." + e + "_", ".disk_" + e.replace(/^node_/, "") + "_"]), i = n.map((e) => e.entity_id).filter((e) => !r.some((t) => e.includes(t))), a = qe(e) + "_", o = (e) => RegExp("^sensor\\." + a + e, "i"), s = (e) => RegExp("^binary_sensor\\." + a + e, "i"), c = e.startsWith("lxc_") ? "lxc" : e.startsWith("qemu_") ? "qemu" : "node", l = Y(i, o("cpu")), u = null;
	for (let e of i) if (e.startsWith("sensor." + a) && Ke(e) && /(prozent|percent|use_percent|usage_percent)/i.test(e)) {
		u = e;
		break;
	}
	let d = Y(i, o("(genutzter_arbeitsspeicher|memory_use)")), f = Y(i, o("(freier_arbeitsspeicher|memory_free)")), p = RegExp("^sensor\\.disk_" + qe(e.replace(/^node_/, "")) + "_(.+)_(temperatur|temperature|grosse|gr..?e|size|verschleiss|wear|betriebsstunden)$", "i"), m = /* @__PURE__ */ new Map();
	if (c === "node") {
		for (let e of i) {
			let t = p.exec(e);
			if (!t) continue;
			let n = t[1], r = Ge(t[2]);
			m.has(n) || m.set(n, {
				key: n,
				name: n,
				temperature: null,
				size: null,
				wear: null,
				powerOnHours: null,
				health: null
			});
			let i = m.get(n);
			r.startsWith("temperatur") || r.startsWith("temperature") ? i.temperature = e : r.startsWith("grosse") || r.startsWith("gr") || r.startsWith("size") ? i.size = e : r.startsWith("verschleiss") || r.startsWith("wear") ? i.wear = e : r.startsWith("betriebsstunden") && (i.powerOnHours = e);
		}
		let t = RegExp("^binary_sensor\\.disk_" + qe(e.replace(/^node_/, "")) + "_(.+)_(gesundheit|health)$", "i");
		for (let e of i) {
			let n = t.exec(e);
			n && m.has(n[1]) && (m.get(n[1]).health = e);
		}
	}
	let h = Array.from(m.values()).map((e) => ({
		...e,
		name: e.key.replace(/_/g, " ")
	}));
	for (let e of h) {
		if (!e.temperature) continue;
		let t = n.find((t) => t.entity_id === e.temperature), r = t && (t.friendly_name || t.attributes && t.attributes.friendly_name);
		r && (e.name = r.replace(/temperatur|temperature$/i, "").replace(/disk.*?:/i, "").trim() || e.name);
	}
	let ee = Y(i, s("gesundheit|health")), g = Y(i, o("(knoten|node)$")), _ = null;
	if (g) {
		let e = n.find((e) => e.entity_id === g);
		e && e.state && (_ = e.state);
	}
	let te = Y(i, RegExp("^sensor\\." + a + "(prozentsatz_belegter_speicherplatz|used_percent|usage_percent|disk_usage_percent)$", "i")), v = Y(i, o("(grosse|gr..?e|size|total)$")), y = Y(i, o("(genutzter_speicherplatz|disk_used|used_space)")), ne = Y(i, o("(freier_speicherplatz|disk_free|free_space)")), b = c === "node";
	return {
		kind: c,
		status: Y(i, s("status")),
		health: c === "node" ? null : ee,
		cpu: l,
		ram: {
			percent: u,
			used: d,
			free: f
		},
		disk: {
			percent: te,
			used: y,
			free: ne,
			total: v
		},
		disks: h,
		vms: b ? Y(i, o("(virtual_machines_running|vms_running)")) : null,
		lxcs: b ? Y(i, o("(container_laufen|lxc_running|containers_running)")) : null,
		updates: b ? Y(i, o("(gesamte_updates|updates_total)")) : null,
		updateAvailable: b ? Y(i, s("(pakete_aktualisieren|updates_available)")) : null,
		lastBoot: Y(i, o("(letzter_start|last_boot)")),
		name: _,
		controls: We(e, i)
	};
}
function Ye(e) {
	return [
		e.status,
		e.health,
		e.cpu,
		e.ram.percent,
		e.ram.used,
		e.ram.free,
		e.disk.percent,
		e.disk.used,
		e.disk.free,
		e.disk.total,
		e.vms,
		e.lxcs,
		e.updates,
		e.updateAvailable,
		e.lastBoot,
		...e.disks.flatMap((e) => [
			e.temperature,
			e.size,
			e.wear,
			e.powerOnHours,
			e.health
		]),
		...Object.values(e.controls)
	].filter((e) => !!e);
}
function Xe(e) {
	let t = e.replace(/^(node|lxc|qemu)_/, "").replace(/_\d+$/, "").toLowerCase();
	return $e[t] ? $e[t] : t.charAt(0).toUpperCase() + t.slice(1);
}
var Ze, Qe, $e, et = t((() => {
	Ze = [
		["reboot", /_(reboot|restart|neustart|neustarten|neu_starten)$/],
		["shutdown", /_(shutdown|herunterfahren)$/],
		["stop", /_(stop|stopp|stoppen)$/],
		["start", /_(start|starten)$/]
	], Qe = [
		"arbeitsspeicher",
		"memory",
		"ram"
	], $e = {
		adguard: "AdGuard",
		authentik: "Authentik",
		bitwarden: "Bitwarden",
		changedetection: "Changedetection",
		cloudflared: "Cloudflared",
		docker: "Docker",
		esphome: "ESPHome",
		frigate: "Frigate",
		grafana: "Grafana",
		homeassistant: "Home Assistant OS",
		haos: "HAOS",
		homebridge: "Homebridge",
		homepage: "Homepage",
		immich: "Immich",
		jellyfin: "Jellyfin",
		nextcloud: "Nextcloud",
		nginxproxymanager: "Nginx Proxy Manager",
		nodered: "Node-RED",
		omada: "Omada",
		paperless: "Paperless",
		pihole: "Pi-hole",
		plex: "Plex",
		portainer: "Portainer",
		proxmox: "Proxmox VE",
		pve: "Proxmox VE",
		tailscale: "Tailscale",
		truenas: "TrueNAS",
		unifi: "UniFi",
		uptimekuma: "Uptime Kuma",
		vaultwarden: "Vaultwarden",
		wireguard: "WireGuard",
		zigbee2mqtt: "Zigbee2MQTT"
	};
})), tt, nt = t((() => {
	tt = (e, t, n, r) => {
		let i = new CustomEvent(t, {
			bubbles: r?.bubbles ?? !0,
			cancelable: r?.cancelable ?? !1,
			composed: r?.composed ?? !0,
			detail: n
		});
		return e.dispatchEvent(i), i;
	};
}));
//#endregion
//#region src/icons.ts
function rt(e) {
	let t = e.replace(/^(node|lxc|qemu)_/, "").replace(/_\d+$/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
	return it[t] ? it[t] : e.startsWith("lxc_") ? "mdi:docker" : e.startsWith("qemu_") ? "mdi:chip" : "mdi:server";
}
var it, at = t((() => {
	it = {
		adguard: "simple-icons:adguard",
		authentik: "simple-icons:authentik",
		changedetection: "simple-icons:changedetection",
		cloudflared: "simple-icons:cloudflare",
		docker: "simple-icons:docker",
		frigate: "simple-icons:frigate",
		homepage: "simple-icons:homepage",
		immich: "simple-icons:immich",
		nginxproxymanager: "simple-icons:nginx",
		omada: "simple-icons:omadacloud",
		paperless: "simple-icons:paperless",
		uptimekuma: "simple-icons:uptimekuma",
		vaultwarden: "simple-icons:bitwarden",
		bitwarden: "simple-icons:bitwarden",
		homeassistant: "simple-icons:homeassistant",
		haos: "simple-icons:homeassistant",
		pve: "simple-icons:proxmox",
		proxmox: "simple-icons:proxmox",
		pihole: "simple-icons:pihole",
		plex: "simple-icons:plex",
		jellyfin: "simple-icons:jellyfin",
		nextcloud: "simple-icons:nextcloud",
		wireguard: "simple-icons:wireguard",
		tailscale: "simple-icons:tailscale",
		grafana: "simple-icons:grafana",
		portainer: "simple-icons:portainer",
		truenas: "simple-icons:truenas",
		unifi: "simple-icons:ubiquiti",
		homebridge: "simple-icons:homebridge",
		nodered: "simple-icons:nodered",
		esphome: "simple-icons:esphome",
		zigbee2mqtt: "simple-icons:zigbee"
	};
}));
//#endregion
//#region src/i18n.ts
function X(e, t, n = {}) {
	return ((e?.locale?.language ?? e?.language ?? "").startsWith("de") ? ot : st)[t].replace(/\{(\w+)\}/g, (e, t) => String(n[t] ?? ""));
}
var ot, st, ct = t((() => {
	ot = {
		loading: "Lade Systeme…",
		all_hidden: "Keine sichtbaren Systeme (alle ausgeblendet)",
		no_metrics: "Für „{key}“ wurden keine Messwerte gefunden.",
		online: "Online",
		offline: "Offline",
		unknown: "Unbekannt",
		kind_node: "Proxmox-Host",
		kind_qemu: "Virtuelle Maschine",
		kind_lxc: "Container",
		short_node: "Host",
		short_qemu: "VM",
		short_lxc: "LXC",
		total: "{v} gesamt",
		uptime: "Uptime: {d} d",
		host: "Host: {v}",
		start: "Start",
		start_t: "Starten",
		reboot: "Neustart",
		reboot_t: "Neu starten",
		shutdown: "Beenden",
		shutdown_t: "Sauber herunterfahren",
		stop: "Stopp",
		stop_t: "Hart stoppen (ohne Herunterfahren)",
		sure: "Sicher?",
		confirm: "{v} bestätigen",
		failed: "Aktion fehlgeschlagen: {v}",
		no_config: "Bitte eine Konfiguration angeben.",
		e_mode: "Modus",
		e_mode_single: "Einzel (ein System)",
		e_mode_dashboard: "Dashboard (alle Systeme als Grid)",
		e_design: "Design",
		e_design_classic: "Klassisch (Balken)",
		e_design_circles: "Kreise (Ringe)",
		e_design_rack: "Rack (LED-Segmente mit Schwellen-Skala)",
		e_hdd: "HDD-Temperatur anzeigen (nur Host)",
		e_controls: "Steuerung anzeigen (Start, Neustart, Beenden, Stopp)",
		e_no_buttons: "Keine Steuer-Buttons gefunden (button.<system>_start / _stop / _reboot / _shutdown). Prüfe, ob die Proxmox-Integration Buttons bereitstellt und diese aktiviert sind.",
		e_server: "Server / Node",
		e_auto: "auto (erstes gefundenes System)",
		e_title: "Name / Titel (optional)",
		e_icon: "Icon (optional, sonst automatisch)",
		e_style: "Schwellen & Farben",
		e_warn: "Warn-Schwelle (%)",
		e_crit: "Critical-Schwelle (%)",
		e_color_ok: "Farbe OK (optional)",
		e_color_warn: "Farbe Warnung (optional)",
		e_color_crit: "Farbe Kritisch (optional)",
		e_accent: "Akzentfarbe Icon + Labels (optional)",
		e_systems: "Systeme (ausblenden oder einzeln anpassen):",
		e_show: "Anzeigen",
		e_hide: "Ausblenden",
		e_expand: "Anpassungen aufklappen",
		e_collapse: "Anpassungen zuklappen",
		e_none: "Keine Proxmox-Entitäten gefunden (binary_sensor.node_*_status, binary_sensor.qemu_*_status, binary_sensor.lxc_*_status)."
	}, st = {
		loading: "Loading systems…",
		all_hidden: "No visible systems (all hidden)",
		no_metrics: "No metrics found for “{key}”.",
		online: "Online",
		offline: "Offline",
		unknown: "Unknown",
		kind_node: "Proxmox host",
		kind_qemu: "Virtual machine",
		kind_lxc: "Container",
		short_node: "Host",
		short_qemu: "VM",
		short_lxc: "LXC",
		total: "{v} total",
		uptime: "Uptime: {d} d",
		host: "Host: {v}",
		start: "Start",
		start_t: "Start",
		reboot: "Reboot",
		reboot_t: "Reboot",
		shutdown: "Shut down",
		shutdown_t: "Shut down gracefully",
		stop: "Stop",
		stop_t: "Hard stop (no shutdown)",
		sure: "Sure?",
		confirm: "Confirm {v}",
		failed: "Action failed: {v}",
		no_config: "Please provide a configuration.",
		e_mode: "Mode",
		e_mode_single: "Single (one system)",
		e_mode_dashboard: "Dashboard (all systems as grid)",
		e_design: "Design",
		e_design_classic: "Classic (bars)",
		e_design_circles: "Circles (rings)",
		e_design_rack: "Rack (LED segments with threshold scale)",
		e_hdd: "Show HDD temperature (host only)",
		e_controls: "Show controls (start, reboot, shut down, stop)",
		e_no_buttons: "No control buttons found (button.<system>_start / _stop / _reboot / _shutdown). Check that the Proxmox integration provides buttons and that they are enabled.",
		e_server: "Server / node",
		e_auto: "auto (first system found)",
		e_title: "Name / title (optional)",
		e_icon: "Icon (optional, automatic otherwise)",
		e_style: "Thresholds & colours",
		e_warn: "Warning threshold (%)",
		e_crit: "Critical threshold (%)",
		e_color_ok: "OK colour (optional)",
		e_color_warn: "Warning colour (optional)",
		e_color_crit: "Critical colour (optional)",
		e_accent: "Accent colour icon + labels (optional)",
		e_systems: "Systems (hide or customise individually):",
		e_show: "Show",
		e_hide: "Hide",
		e_expand: "Expand customisation",
		e_collapse: "Collapse customisation",
		e_none: "No Proxmox entities found (binary_sensor.node_*_status, binary_sensor.qemu_*_status, binary_sensor.lxc_*_status)."
	};
}));
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/decorate.js
function Z(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
var lt = t((() => {})), ut = /* @__PURE__ */ n({ ServerCardPlusEditor: () => Q }), dt, ft, Q, pt = t((() => {
	ke(), Ue(), nt(), et(), at(), ct(), lt(), dt = [
		[
			"warn",
			{ number: {
				min: 0,
				max: 100,
				mode: "box"
			} },
			"e_warn"
		],
		[
			"crit",
			{ number: {
				min: 0,
				max: 100,
				mode: "box"
			} },
			"e_crit"
		],
		[
			"color_ok",
			{ color_rgb: {} },
			"e_color_ok"
		],
		[
			"color_warn",
			{ color_rgb: {} },
			"e_color_warn"
		],
		[
			"color_crit",
			{ color_rgb: {} },
			"e_color_crit"
		],
		[
			"accent",
			{ color_rgb: {} },
			"e_accent"
		]
	], ft = {
		warn: 75,
		crit: 90
	}, Q = class extends K {
		constructor(...e) {
			super(...e), this._config = { type: "custom:server-card-plus" }, this._expanded = /* @__PURE__ */ new Set();
		}
		set config(e) {
			this.setConfig(e);
		}
		setConfig(e) {
			this._config = e;
		}
		_t(e) {
			return X(this.hass, e);
		}
		_commit(e) {
			this._config = e, tt(this, "config-changed", { config: e });
		}
		_toggleHidden(e, t) {
			e.stopPropagation();
			let n = new Set(this._config.hidden_systems ?? []);
			n.delete(t) || n.add(t), this._commit({
				...this._config,
				hidden_systems: [...n]
			});
		}
		_toggleExpand(e, t) {
			e.stopPropagation();
			let n = new Set(this._expanded);
			n.delete(t) || n.add(t), this._expanded = n;
		}
		_overrideChanged(e, t, n) {
			let r = e.detail?.value, i = { ...this._config.overrides ?? {} }, a = { ...i[t] ?? {} };
			r == null || r === "" ? delete a[n] : a[n] = r, Object.keys(a).length === 0 ? delete i[t] : i[t] = a, this._commit({
				...this._config,
				overrides: i
			});
		}
		_valueChanged(e, t) {
			if (this._config[e] === t) return;
			let n = { ...this._config };
			t == null || t === "" ? delete n[e] : n[e] = t, this._commit(n);
		}
		_field(e, t, n, r) {
			return R`<ha-selector
      .hass=${this.hass}
      .selector=${e}
      .value=${n}
      .label=${t}
      @value-changed=${r}
    ></ha-selector>`;
		}
		_cfg(e, t, n, r = "") {
			return this._field(e, t, this._config[n] ?? r, (e) => this._valueChanged(n, e.detail?.value));
		}
		_select(e, t = !1) {
			return { select: {
				mode: "dropdown",
				options: e.map(([e, n]) => ({
					value: e,
					label: t ? n : this._t(n)
				}))
			} };
		}
		render() {
			if (!this.hass) return R``;
			let e = Object.keys(this.hass.states), t = J(e), n = this._config.mode === "dashboard", r = (e) => this._t(`short_${e}`), i = this._config.show_controls && !t.some((t) => Object.values(We(t.key, e)).some(Boolean));
			return R`
      ${this._cfg(this._select([["single", "e_mode_single"], ["dashboard", "e_mode_dashboard"]]), this._t("e_mode"), "mode", "single")}
      ${this._cfg(this._select([
				["classic", "e_design_classic"],
				["circles", "e_design_circles"],
				["rack", "e_design_rack"]
			]), this._t("e_design"), "design", "classic")}
      ${this._cfg({ boolean: {} }, this._t("e_hdd"), "show_hdd_temp", !1)}
      ${this._cfg({ boolean: {} }, this._t("e_controls"), "show_controls", !1)}
      ${i ? R`<div class="hint">${this._t("e_no_buttons")}</div>` : ""}

      ${n ? "" : R`
            ${this._cfg(this._select([["auto", this._t("e_auto")], ...t.map((e) => [e.key, `${r(e.kind)} — ${Xe(e.key)}`])], !0), this._t("e_server"), "node", "auto")}
            ${this._cfg({ text: {} }, this._t("e_title"), "title")}
            ${this._cfg({ icon: {} }, this._t("e_icon"), "icon")}
          `}

      <ha-expansion-panel outlined .header=${this._t("e_style")}>
        <div class="panel">
          ${dt.map(([e, t, n]) => this._cfg(t, this._t(n), e, ft[e] ?? ""))}
        </div>
      </ha-expansion-panel>

      ${n && t.length ? R`
            <div class="list-title">${this._t("e_systems")}</div>
            <div class="entities-list">
              ${t.map((e) => {
				let t = (this._config.hidden_systems ?? []).includes(e.key), n = this._expanded.has(e.key), i = (this._config.overrides ?? {})[e.key] ?? {}, a = (t, n, r, i) => this._field(t, n, i, (t) => this._overrideChanged(t, e.key, r));
				return R`
                  <div class="entity-row ${t ? "disabled" : ""}">
                    <div class="entity-row-top">
                      <ha-icon icon=${i.icon || rt(e.key)} class="system-icon"></ha-icon>
                      <div class="entity-info">
                        <span class="entity-name">${i.title || Xe(e.key)}</span>
                        <span class="entity-id">${r(e.kind)} · ${e.key}</span>
                      </div>
                      <ha-button
                        size="small"
                        appearance="filled"
                        variant="brand"
                        class="${t ? "action-show" : "action-hide"}"
                        @click=${(t) => this._toggleHidden(t, e.key)}
                      >
                        ${this._t(t ? "e_show" : "e_hide")}
                      </ha-button>
                      <ha-icon-button
                        .label=${this._t(n ? "e_collapse" : "e_expand")}
                        @click=${(t) => this._toggleExpand(t, e.key)}
                      >
                        <ha-icon icon=${n ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
                      </ha-icon-button>
                    </div>
                    ${n ? R`
                          <div class="entity-row-bottom">
                            ${a({ text: {} }, this._t("e_title"), "title", i.title ?? "")}
                            ${a({ icon: {} }, this._t("e_icon"), "icon", i.icon ?? "")}
                            ${dt.map(([e, t, n]) => a(t, this._t(n), e, i[e] ?? this._config[e] ?? ft[e] ?? ""))}
                          </div>
                        ` : ""}
                  </div>
                `;
			})}
            </div>
          ` : ""}

      ${t.length === 0 ? R`<div class="error">${this._t("e_none")}</div>` : ""}
    `;
		}
		static {
			this.styles = u`
    :host {
      display: block;
      padding: 4px 0;
    }
    ha-selector {
      display: block;
      margin-bottom: 12px;
    }
    ha-expansion-panel {
      margin-bottom: 12px;
    }
    .panel {
      padding-top: 12px;
    }
    .hint {
      margin: -4px 0 12px;
      font-size: 0.8rem;
      color: var(--warning-color, #ffa600);
    }
    .error {
      margin-top: 8px;
      color: var(--error-color);
    }
    .list-title {
      margin: 4px 0 6px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .entities-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 12px;
    }
    .entity-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--divider-color, #eee);
      border-radius: 8px;
      transition: opacity 0.2s;
    }
    .entity-row-top {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .entity-row-bottom {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 4px;
    }
    .entity-row.disabled {
      opacity: 0.55;
    }
    .system-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }
    .entity-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .entity-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .entity-id {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .entity-row-top ha-button,
    .entity-row-top ha-icon-button {
      flex-shrink: 0;
    }
    .action-hide {
      --mdc-theme-primary: var(--error-color, #db4437);
    }
    .action-show {
      --mdc-theme-primary: var(--primary-color, #03a9f4);
    }
  `;
		}
	}, Z([q({ attribute: !1 })], Q.prototype, "hass", void 0), Z([Fe()], Q.prototype, "_config", void 0), Z([Fe()], Q.prototype, "_expanded", void 0), Q = Z([Ae("server-card-plus-editor")], Q);
}));
ke(), Ue(), et(), nt(), at(), ct(), lt();
var mt = {
	max: 70,
	warn: 45,
	crit: 55
};
function ht(e, t) {
	return e ? Array.isArray(e) && e.length === 3 ? `rgb(${e[0]},${e[1]},${e[2]})` : String(e) : t;
}
var gt = [
	{
		k: "start",
		icon: "mdi:play",
		confirm: !1,
		needsOnline: !1
	},
	{
		k: "reboot",
		icon: "mdi:restart",
		confirm: !0,
		needsOnline: !0
	},
	{
		k: "shutdown",
		icon: "mdi:power",
		confirm: !0,
		needsOnline: !0
	},
	{
		k: "stop",
		icon: "mdi:stop",
		confirm: !0,
		needsOnline: !0
	}
], $ = class extends K {
	constructor(...e) {
		super(...e), this._armed = null, this._ids = [], this._systemList = [], this._mappings = /* @__PURE__ */ new Map();
	}
	_refreshDetection() {
		let e = this.hass ? Object.keys(this.hass.states) : [];
		e.length === this._ids.length && e.every((e, t) => e === this._ids[t]) || (this._ids = e, this._systemList = J(e), this._mappings.clear());
	}
	get _systems() {
		return this._refreshDetection(), this._systemList;
	}
	_visibleKeys() {
		let e = this._systems, t = this.config;
		if (t && t.mode === "dashboard") {
			let n = new Set(t.hidden_systems || []);
			return e.filter((e) => !n.has(e.key)).map((e) => e.key);
		}
		let n = t && t.node ? t.node : "auto";
		return n !== "auto" && e.some((e) => e.key === n) ? [n] : e.length ? [e[0].key] : [];
	}
	_mappingFor(e) {
		if (this._refreshDetection(), !this._mappings.has(e)) {
			let t = null;
			try {
				t = Je(e, this._ids);
			} catch {}
			this._mappings.set(e, t);
		}
		return this._mappings.get(e);
	}
	shouldUpdate(e) {
		let t = e.get("hass");
		return e.size > 1 || !e.has("hass") || !t || !this.hass || this._ids.length !== Object.keys(this.hass.states).length || t.locale?.language !== this.hass.locale?.language || this._visibleKeys().some((e) => {
			let n = this._mappingFor(e);
			return !n || Ye(n).some((e) => t.states[e] !== this.hass.states[e]);
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearTimeout(this._armTimer);
	}
	static getStubConfig(e) {
		let t = e ? J(Object.keys(e.states)) : [];
		return {
			type: "custom:server-card-plus",
			node: t.length ? t[0].key : "auto"
		};
	}
	static async getConfigElement() {
		return await Promise.resolve().then(() => (pt(), ut)), document.createElement("server-card-plus-editor");
	}
	setConfig(e) {
		if (!e) throw Error(X(this.hass, "no_config"));
		this.config = e;
	}
	getCardSize() {
		return Math.max(4, this._visibleKeys().length * 3);
	}
	_accent(e) {
		return ht(e?.accent ?? this.config?.accent, "var(--primary-color, #4a90d9)");
	}
	_palette(e) {
		let t = this.config || {};
		return {
			warn: e?.warn ?? t.warn ?? 75,
			crit: e?.crit ?? t.crit ?? 90,
			ok: ht(e?.color_ok ?? t.color_ok, "var(--green, #2ecc71)"),
			warnColor: ht(e?.color_warn ?? t.color_warn, "var(--yellow, #f1c40f)"),
			critColor: ht(e?.color_crit ?? t.color_crit, "var(--red, #e74c3c)")
		};
	}
	_overrideFor(e) {
		return this.config && this.config.overrides && this.config.overrides[e] || void 0;
	}
	_icon(e, t) {
		return t && t.icon || this.config && this.config.icon || rt(e);
	}
	_state(e) {
		return !e || !this.hass ? null : this.hass.states[e] || null;
	}
	_val(e) {
		let t = this._state(e);
		return t ? t.state : null;
	}
	_pct(e) {
		let t = parseFloat(this._val(e) ?? "");
		return isFinite(t) ? Math.max(0, Math.min(100, t)) : null;
	}
	_hddTempLine(e) {
		if (!(this.config && this.config.show_hdd_temp)) return B;
		let t = e.disks.map((e) => parseFloat(this._val(e.temperature) ?? "")).filter((e) => isFinite(e)).map((e) => e.toFixed(0) + " °C");
		return t.length ? R`
      <div class="row hdd-temp">
        <span class="lbl">
          <ha-icon icon="mdi:harddisk" class="browicon disk-icon"></ha-icon>
          HDD
        </span>
        <span class="hdd-temps">${t.join(" · ")}</span>
      </div>
    ` : B;
	}
	_summaryLine(e) {
		let t = [];
		if (e.vms && t.push(`${this._val(e.vms)} VMs`), e.lxcs && t.push(`${this._val(e.lxcs)} LXCs`), e.updates && t.push(`${this._val(e.updates)} Updates`), e.name && t.push(X(this.hass, "host", { v: e.name })), e.lastBoot) {
			let n = this._state(e.lastBoot);
			if (n && n.attributes && n.attributes.device_class === "timestamp") {
				let e = new Date(n.state);
				if (!isNaN(e.getTime())) {
					let n = Math.floor((Date.now() - e.getTime()) / 864e5);
					t.push(X(this.hass, "uptime", { d: n }));
				}
			}
		}
		return t.length ? R`<div class="summary">${t.join(" · ")}</div>` : B;
	}
	_controls(e, t) {
		if (!(this.config && this.config.show_controls)) return B;
		let n = gt.filter((t) => e.controls[t.k]);
		return n.length ? R`
      <div class="controls">
        ${n.map((n) => {
			let r = e.controls[n.k], i = this._armed === r, a = X(this.hass, `${n.k}_t`), o = t === (n.needsOnline ? "off" : "on") || this._val(r) === "unavailable";
			return R`
            <button
              class="ctl ${i ? "armed" : ""}"
              ?disabled=${o}
              title=${a}
              aria-label=${i ? X(this.hass, "confirm", { v: a }) : a}
              @click=${() => this._press(r, n.confirm)}
            >
              <ha-icon icon=${i ? "mdi:check" : n.icon}></ha-icon>
              <span>${i ? X(this.hass, "sure") : X(this.hass, n.k)}</span>
            </button>
          `;
		})}
      </div>
    ` : B;
	}
	async _press(e, t) {
		if (clearTimeout(this._armTimer), t && this._armed !== e) this._armed = e, this._armTimer = window.setTimeout(() => this._armed = null, 4e3);
		else {
			this._armed = null;
			try {
				await this.hass?.callService?.("button", "press", { entity_id: e });
			} catch (e) {
				tt(this, "hass-notification", { message: X(this.hass, "failed", { v: e.message }) });
			}
		}
	}
	_rackCard(e, t, n, r, i, a, o) {
		let { warn: s, crit: c } = this._palette(this._overrideFor(e)), l = [
			["CPU", this._pct(t.cpu)],
			["RAM", this._pct(t.ram.percent)],
			["Disk", this._pct(t.disk.percent)]
		];
		return R`
      <ha-card class="rack" style=${i}>
        <div class="r-head">
          <span
            class="led ${a === "on" ? "on" : a === "off" ? "off" : ""}"
            role="img"
            aria-label=${o}
            title=${o}
          ></span>
          <ha-icon icon=${r} class="r-icon"></ha-icon>
          <span class="r-title">${n}</span>
          <span class="r-kind">${X(this.hass, `short_${t.kind}`)}</span>
        </div>
        ${l.map(([e, t]) => R`
            <div class="r-row">
              <span class="r-lbl">${e}</span>
              <div
                class="seg"
                role="meter"
                aria-label=${e}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${t === null ? B : t.toFixed(0)}
              >
                ${Array.from({ length: 20 }, (e, n) => {
			let r = n * 5 >= c ? "c" : n * 5 >= s ? "w" : "", i = t !== null && t >= n * 5 + 2.5;
			return R`<i class="${r} ${i ? "lit" : ""}"></i>`;
		})}
              </div>
              <span class="r-num">${t === null ? "–" : R`${t.toFixed(0)}<small>%</small>`}</span>
            </div>
          `)}
        ${t.disk.total ? R`<div class="row subtotal">${X(this.hass, "total", { v: this._val(t.disk.total) ?? "" })}</div>` : B}
        ${this._hddTempLine(t)} ${this._summaryLine(t)} ${this._controls(t, a)}
      </ha-card>
    `;
	}
	render() {
		if (!this.hass) return B;
		if (!this._systems.length) return R`<ha-card><div class="warnbox">${X(this.hass, "loading")}</div></ha-card>`;
		let e = this._visibleKeys();
		return e.length ? this.config && this.config.mode === "dashboard" ? R`<div class="dash">${e.map((e) => this._systemCard(e))}</div>` : this._systemCard(e[0]) : R`<ha-card><div class="warnbox">${X(this.hass, "all_hidden")}</div></ha-card>`;
	}
	_systemCard(e) {
		let t = !!(this.config && this.config.mode === "dashboard"), n = this._overrideFor(e), r = n && n.title ? n.title : !t && this.config && this.config.title ? this.config.title : Xe(e), { ok: i, warnColor: a, critColor: o } = this._palette(n), s = {
			ok: i,
			warn: a,
			crit: o
		}, c = this._icon(e, n), l = `--accent:${this._accent(n)}; --green:${s.ok}; --yellow:${s.warn}; --red:${s.crit}`, u = this._mappingFor(e), d = (e, t, n) => R`
      <div class="c-head">
        <span class="c-tile"><ha-icon icon=${c}></ha-icon></span>
        <div class="c-titles">
          <span class="c-title">${r}</span>
          <span class="c-kind">${e}</span>
        </div>
        ${n ? R`<span class="c-status ${t === "off" ? "off" : ""}">
              <span class="c-dot ${t === "on" ? "on" : ""}"></span>${n}
            </span>` : B}
      </div>
    `;
		if (!u) return R`<ha-card class="apple" style=${l}>
        ${d(e)}
        <p class="empty">${X(this.hass, "no_metrics", { key: e })}</p>
      </ha-card>`;
		let f = u.status ? this._val(u.status) : null, p = X(this.hass, f === "on" ? "online" : f === "off" ? "offline" : "unknown");
		if (this.config && this.config.design === "rack") return this._rackCard(e, u, r, c, l, f, p);
		let m = this.config && this.config.design === "circles", h = this._metrics(u, n, s);
		return R`
      <ha-card class="apple" style=${l}>
        ${d(X(this.hass, `kind_${u.kind}`), f, p)}
        ${m ? R`<div class="c-rings">
              ${h.map((e) => R`
                  <div class="c-ring" role="meter" aria-label=${e.label} aria-valuemin="0"
                    aria-valuemax=${e.max} aria-valuenow=${e.value ?? B}>
                    <div class="c-dial">
                      <svg viewBox="0 0 36 36" aria-hidden="true">
                        <circle class="c-track" cx="18" cy="18" r="15.9155"></circle>
                        ${e.value === null ? B : R`<circle
                              class="c-arc"
                              cx="18"
                              cy="18"
                              r="15.9155"
                              style="stroke:${e.color};stroke-dasharray:${e.fill} 100"
                            ></circle>`}
                      </svg>
                      <span class="c-val">${e.value ?? "–"}${e.value === null ? B : R`<small>${e.unit}</small>`}</span>
                    </div>
                    <span class="c-lbl" title=${e.label}>${e.label}</span>
                    ${e.sub ? R`<span class="c-sub">${e.sub}</span>` : B}
                  </div>
                `)}
            </div>` : R`<div class="b-list">
              ${h.map((e) => R`
                  <div class="b-row" role="meter" aria-label=${e.label} aria-valuemin="0"
                    aria-valuemax=${e.max} aria-valuenow=${e.value ?? B}>
                    <div class="b-top">
                      <span class="b-lbl" title=${e.label}>${e.label}</span>
                      ${e.sub ? R`<span class="b-sub">${e.sub}</span>` : B}
                      <span class="b-val">${e.value ?? "–"}${e.value === null ? B : R`<small>${e.unit}</small>`}</span>
                    </div>
                    <div class="b-track">
                      <div class="b-fill" style="width:${e.fill}%;background:${e.color}"></div>
                    </div>
                  </div>
                `)}
            </div>`}

        ${this._summaryLine(u)} ${this._controls(u, f)}
      </ha-card>
    `;
	}
	_metrics(e, t, n) {
		let { warn: r, crit: i } = this._palette(t), a = (e, t, r) => e >= r ? n.crit : e >= t ? n.warn : n.ok, o = [
			[
				"CPU",
				e.cpu,
				null
			],
			[
				"RAM",
				e.ram.percent,
				null
			],
			[
				"Disk",
				e.disk.percent,
				e.disk.total ? this._val(e.disk.total) : null
			]
		].map(([e, t, n]) => {
			let o = this._pct(t);
			return {
				label: e,
				fill: o ?? 0,
				value: o === null ? null : o.toFixed(0),
				unit: "%",
				max: 100,
				color: a(o ?? 0, r, i),
				sub: n
			};
		});
		if (this.config && this.config.show_hdd_temp) for (let t of e.disks) {
			let e = parseFloat(this._val(t.temperature) ?? "");
			isFinite(e) && o.push({
				label: t.name,
				fill: Math.max(0, Math.min(100, e / mt.max * 100)),
				value: e.toFixed(0),
				unit: "°C",
				max: mt.max,
				color: a(e, mt.warn, mt.crit),
				sub: "HDD"
			});
		}
		return o;
	}
	static get styles() {
		return u`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
        background: var(--card-background-color, #1e1e1e);
        color: var(--primary-text-color, #e1e1e1);
        border-radius: 12px;
        border: 1px solid var(--divider-color, #2a2a2a);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.2s ease;
      }

      ha-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      /* Dashboard-Mode: responsive Grid aus mehreren System-Karten */
      .dash {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 12px;
      }

      .row {
        display: grid;
        grid-template-columns: auto 1fr 60px;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
      }

      .lbl {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
        color: var(--secondary-text-color);
        font-weight: 500;
        letter-spacing: 0.02em;
      }

      .browicon {
        --mdc-icon-size: 16px;
        color: var(--accent);
        flex: 0 0 auto;
      }

      /* HDD-Icon etwas kleiner, damit es nicht über die Karte ragt */
      .browicon.disk-icon {
        --mdc-icon-size: 15px;
      }

      .subtotal {
        grid-column: 2 / 3;
        justify-self: end;
        font-size: 0.7rem;
        color: var(--secondary-text-color);
        font-weight: 400;
        letter-spacing: 0.03em;
        padding-right: 2px;
      }

      .row.hdd-temp {
        grid-template-columns: auto 1fr;
        gap: 10px;
      }

      .hdd-temps {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary-text-color);
        font-variant-numeric: tabular-nums;
      }

      .summary {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--divider-color, #2a2a2a);
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .empty {
        margin: 16px 0 0;
        color: var(--secondary-text-color);
        font-size: 0.85rem;
      }

      .warnbox {
        color: var(--red, #e74c3c);
        font-weight: 500;
        padding: 8px;
        text-align: center;
        font-size: 0.85rem;
        border: 1px solid var(--red, #e74c3c);
        border-radius: 10px;
        margin: 0;
        background: rgba(231, 76, 60, 0.08);
      }

      /* Steuerung (Start / Neustart / Beenden / Stopp) */
      .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
        gap: 6px;
        margin-top: 12px;
      }

      .ctl {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 4px;
        font: inherit;
        font-size: 0.72rem;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
        border: 1px solid var(--divider-color, #2a2a2a);
        border-radius: 8px;
        cursor: pointer;
      }

      .ctl ha-icon {
        --mdc-icon-size: 18px;
        color: var(--accent);
      }

      .ctl:hover:not(:disabled) {
        border-color: var(--accent);
      }

      .ctl:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      .ctl:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .ctl.armed,
      .ctl.armed ha-icon {
        background: var(--red, #e74c3c);
        border-color: var(--red, #e74c3c);
        color: #fff;
      }

      /* Design "Rack": Frontblende mit segmentierten LED-Metern */
      ha-card.rack {
        padding: 14px 16px;
        border-radius: 6px;
        box-shadow: none;
      }

      ha-card.rack:hover {
        box-shadow: none;
      }

      .r-head {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 12px;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--divider-color, #2a2a2a);
      }

      .led {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        flex: 0 0 auto;
        background: var(--secondary-text-color);
      }

      .led.on {
        background: var(--green, #2ecc71);
        box-shadow: 0 0 6px var(--green, #2ecc71);
      }

      .led.off {
        background: var(--red, #e74c3c);
      }

      .r-icon {
        --mdc-icon-size: 22px;
        color: var(--accent);
        flex: 0 0 auto;
      }

      .r-title {
        flex: 1;
        min-width: 0;
        font-size: 1rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .r-kind {
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        border: 1px solid var(--divider-color, #2a2a2a);
        border-radius: 3px;
        padding: 1px 6px;
      }

      .r-row {
        display: grid;
        grid-template-columns: 2.6rem 1fr 3.2rem;
        align-items: center;
        gap: 10px;
        margin: 8px 0;
      }

      .r-lbl {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .seg {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        gap: 2px;
        height: 14px;
      }

      .seg i {
        border-radius: 1px;
        background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      }

      .seg i.w {
        background: color-mix(in srgb, var(--yellow, #f1c40f) 22%, transparent);
      }

      .seg i.c {
        background: color-mix(in srgb, var(--red, #e74c3c) 22%, transparent);
      }

      .seg i.lit {
        background: var(--green, #2ecc71);
      }

      .seg i.lit.w {
        background: var(--yellow, #f1c40f);
      }

      .seg i.lit.c {
        background: var(--red, #e74c3c);
      }

      .r-num {
        text-align: right;
        font-size: 1.05rem;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .r-num small {
        font-size: 0.7rem;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .rack .ctl {
        border-radius: 4px;
      }

      /* Designs "Klassisch" (Balken) + "Kreise" im Stil der Apple-Widgets */
      ha-card.apple {
        padding: 20px;
        border-radius: 22px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      ha-card.apple:hover {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.08);
      }

      .c-head {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .c-tile {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        flex: 0 0 auto;
        border-radius: 11px;
        background: color-mix(in srgb, var(--accent) 15%, transparent);
        color: var(--accent);
        --mdc-icon-size: 22px;
      }

      .c-titles {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .c-title {
        font-size: 1.05rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .c-kind,
      .c-status {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }

      .c-status {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 0 0 auto;
      }

      .c-status.off {
        color: var(--red, #e74c3c);
      }

      .c-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: currentColor;
      }

      .c-dot.on {
        background: var(--green, #2ecc71);
      }

      .c-rings {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
        gap: 14px 6px;
        margin: 18px 0 4px;
      }

      .c-ring {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 0;
      }

      .c-dial {
        position: relative;
        width: min(58px, 100%);
        aspect-ratio: 1;
      }

      .c-dial svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .c-track,
      .c-arc {
        fill: none;
        stroke-width: 3.4;
      }

      .c-track {
        stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      }

      .c-arc {
        stroke-linecap: round;
        transition: stroke-dasharray 0.6s cubic-bezier(0.3, 0.7, 0.4, 1);
      }

      .c-val {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }

      .c-val small {
        font-size: 0.6em;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-left: 1px;
      }

      .c-lbl {
        margin-top: 6px;
        max-width: 100%;
        font-size: 0.78rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .c-sub {
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .b-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-top: 20px;
      }

      .b-top {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .b-lbl {
        min-width: 0;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .b-sub {
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .b-val {
        margin-left: auto;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
      }

      .b-val small {
        font-size: 0.7em;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-left: 1px;
      }

      .b-track {
        height: 6px;
        margin-top: 6px;
        border-radius: 3px;
        overflow: hidden;
        background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      }

      .b-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.6s cubic-bezier(0.3, 0.7, 0.4, 1);
      }

      .apple .summary {
        margin-top: 16px;
        padding-top: 14px;
        border-top-color: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .apple .controls {
        margin-top: 16px;
        gap: 8px;
      }

      .apple .ctl {
        padding: 8px 4px;
        border: none;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .apple .ctl:hover:not(:disabled):not(.armed) {
        background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      }

      .apple .ctl.armed {
        background: var(--red, #e74c3c);
      }

      @media (prefers-reduced-motion: reduce) {
        .c-arc,
        .b-fill {
          transition: none;
        }
      }
    `;
	}
};
Z([q({ attribute: !1 })], $.prototype, "hass", void 0), Z([q({ attribute: !1 })], $.prototype, "config", void 0), Z([Fe()], $.prototype, "_armed", void 0), $ = Z([Ae("server-card-plus")], $), console.info(`%c SERVER-CARD-PLUS %c v${r} `, "color: steelblue; background: black; font-weight: bold;", "color: white ; background: dimgray; font-weight: bold;"), window.customCards = window.customCards || [], window.customCards.push({
	type: "server-card-plus",
	name: "Server Card Plus",
	description: "Proxmox VE system monitor with auto-detection (CPU, RAM, disk, status, controls)."
});
//#endregion
