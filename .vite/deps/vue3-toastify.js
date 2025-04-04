import {
  Fragment,
  cloneVNode,
  computed,
  createApp,
  createVNode,
  defineComponent,
  h,
  isVNode,
  mergeProps,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  watchEffect
} from "./chunk-MHIYXKIF.js";

// node_modules/.deno/vue3-toastify@0.2.8/node_modules/vue3-toastify/dist/index.mjs
var D = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  TOP_CENTER: "top-center",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_CENTER: "bottom-center"
};
var M = {
  LIGHT: "light",
  DARK: "dark",
  COLORED: "colored",
  AUTO: "auto"
};
var g = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  DEFAULT: "default"
};
var Ie = {
  BOUNCE: "bounce",
  SLIDE: "slide",
  FLIP: "flip",
  ZOOM: "zoom",
  NONE: "none"
};
var fe = {
  dangerouslyHTMLString: false,
  multiple: true,
  position: D.TOP_RIGHT,
  autoClose: 5e3,
  transition: "bounce",
  hideProgressBar: false,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  closeOnClick: true,
  className: "",
  bodyClassName: "",
  style: {},
  progressClassName: "",
  progressStyle: {},
  role: "alert",
  theme: "light"
};
var he = {
  rtl: false,
  newestOnTop: false,
  toastClassName: ""
};
var me = {
  ...fe,
  ...he
};
({
  ...fe,
  type: g.DEFAULT
});
var r = ((e) => (e[e.COLLAPSE_DURATION = 300] = "COLLAPSE_DURATION", e[e.DEBOUNCE_DURATION = 50] = "DEBOUNCE_DURATION", e.CSS_NAMESPACE = "Toastify", e))(r || {});
var ee = ((e) => (e.ENTRANCE_ANIMATION_END = "d", e))(ee || {});
var Oe = {
  enter: "Toastify--animate Toastify__bounce-enter",
  exit: "Toastify--animate Toastify__bounce-exit",
  appendPosition: true
};
var be = {
  enter: "Toastify--animate Toastify__slide-enter",
  exit: "Toastify--animate Toastify__slide-exit",
  appendPosition: true
};
var Pe = {
  enter: "Toastify--animate Toastify__zoom-enter",
  exit: "Toastify--animate Toastify__zoom-exit"
};
var Le = {
  enter: "Toastify--animate Toastify__flip-enter",
  exit: "Toastify--animate Toastify__flip-exit"
};
var le = "Toastify--animate Toastify__none-enter";
function ge(e, t = false) {
  var a;
  let n = Oe;
  if (!e || typeof e == "string")
    switch (e) {
      case "flip":
        n = Le;
        break;
      case "zoom":
        n = Pe;
        break;
      case "slide":
        n = be;
        break;
    }
  else
    n = e;
  if (t)
    n.enter = le;
  else if (n.enter === le) {
    const o = (a = n.exit.split("__")[1]) == null ? void 0 : a.split("-")[0];
    n.enter = `Toastify--animate Toastify__${o}-enter`;
  }
  return n;
}
function $e(e) {
  return e.containerId || String(e.position);
}
var Y = "will-unmount";
function qe(e = D.TOP_RIGHT) {
  return !!document.querySelector(`.${r.CSS_NAMESPACE}__toast-container--${e}`);
}
function Be(e = D.TOP_RIGHT) {
  return `${r.CSS_NAMESPACE}__toast-container--${e}`;
}
function we(e, t, n = false) {
  const a = [
    `${r.CSS_NAMESPACE}__toast-container`,
    `${r.CSS_NAMESPACE}__toast-container--${e}`,
    n ? `${r.CSS_NAMESPACE}__toast-container--rtl` : null
  ].filter(Boolean).join(" ");
  return w(t) ? t({
    position: e,
    rtl: n,
    defaultClassName: a
  }) : `${a} ${t || ""}`;
}
function Me(e) {
  var E;
  const { position: t, containerClassName: n, rtl: a = false, style: o = {} } = e, s = r.CSS_NAMESPACE, i = Be(t), C = document.querySelector(`.${s}`), u = document.querySelector(`.${i}`), A = !!u && !((E = u.className) != null && E.includes(Y)), m = C || document.createElement("div"), v = document.createElement("div");
  v.className = we(
    t,
    n,
    a
  ), v.dataset.testid = `${r.CSS_NAMESPACE}__toast-container--${t}`, v.id = $e(e);
  for (const S in o)
    if (Object.prototype.hasOwnProperty.call(o, S)) {
      const _ = o[S];
      v.style[S] = _;
    }
  return C || (m.className = r.CSS_NAMESPACE, document.body.appendChild(m)), A || m.appendChild(v), v;
}
function te(e) {
  var a, o, s;
  const t = typeof e == "string" ? e : ((a = e.currentTarget) == null ? void 0 : a.id) || ((o = e.target) == null ? void 0 : o.id), n = document.getElementById(t);
  n && n.removeEventListener("animationend", te, false);
  try {
    x[t].unmount(), (s = document.getElementById(t)) == null || s.remove(), delete x[t], delete c[t];
  } catch {
  }
}
var x = reactive({});
function Fe(e, t) {
  const n = document.getElementById(String(t));
  n && (x[n.id] = e);
}
function ne(e, t = true) {
  const n = String(e);
  if (!x[n]) return;
  const a = document.getElementById(n);
  a && a.classList.add(Y), t ? (Ue(e), a && a.addEventListener("animationend", te, false)) : te(n), N.items = N.items.filter((o) => o.containerId !== e);
}
function Re(e) {
  for (const t in x)
    ne(t, e);
  N.items = [];
}
function Ce(e, t) {
  const n = document.getElementById(e.toastId);
  if (n) {
    let a = e;
    a = {
      ...a,
      ...ge(a.transition)
    };
    const o = a.appendPosition ? `${a.exit}--${a.position}` : a.exit;
    n.className += ` ${o}`, t && t(n);
  }
}
function Ue(e) {
  for (const t in c)
    if (t === e)
      for (const n of c[t] || [])
        Ce(n);
}
function ke(e) {
  const n = F().find((a) => a.toastId === e);
  return n == null ? void 0 : n.containerId;
}
function re(e) {
  return document.getElementById(e);
}
function xe(e) {
  const t = re(e.containerId);
  return t && t.classList.contains(Y);
}
function ie(e) {
  var n;
  const t = isVNode(e.content) ? toRaw(e.content.props) : null;
  return t != null ? t : toRaw((n = e.data) != null ? n : {});
}
function De(e) {
  return e ? N.items.filter((n) => n.containerId === e).length > 0 : N.items.length > 0;
}
function He() {
  if (N.items.length > 0) {
    const e = N.items.shift();
    j(e == null ? void 0 : e.toastContent, e == null ? void 0 : e.toastProps);
  }
}
var c = reactive({});
var N = reactive({ items: [] });
function F() {
  const e = toRaw(c);
  return Object.values(e).reduce((t, n) => [...t, ...n], []);
}
function ze(e) {
  return F().find((n) => n.toastId === e);
}
function j(e, t = {}) {
  if (xe(t)) {
    const n = re(t.containerId);
    n && n.addEventListener("animationend", ae.bind(null, e, t), false);
  } else
    ae(e, t);
}
function ae(e, t = {}) {
  const n = re(t.containerId);
  n && n.removeEventListener("animationend", ae.bind(null, e, t), false);
  const a = c[t.containerId] || [], o = a.length > 0;
  if (!o && !qe(t.position)) {
    const s = Me(t), i = createApp(dt, t);
    t.useHandler && t.useHandler(i), i.mount(s), Fe(i, s.id);
  }
  o && !t.updateId && (t.position = a[0].position), nextTick(() => {
    t.updateId ? y.update(t) : y.add(e, t);
  });
}
var y = {
  /**
   * add a toast
   * @param _ ..
   * @param opts toast props
   */
  add(e, t) {
    const { containerId: n = "" } = t;
    n && (c[n] = c[n] || [], c[n].find((a) => a.toastId === t.toastId) || setTimeout(() => {
      var a, o;
      t.newestOnTop ? (a = c[n]) == null || a.unshift(t) : (o = c[n]) == null || o.push(t), t.onOpen && t.onOpen(ie(t));
    }, t.delay || 0));
  },
  /**
   * remove a toast
   * @param id toastId
   */
  remove(e) {
    if (e) {
      const t = ke(e);
      if (t) {
        const n = c[t];
        let a = n.find((o) => o.toastId === e);
        c[t] = n.filter((o) => o.toastId !== e), !c[t].length && !De(t) && ne(t, false), He(), nextTick(() => {
          a != null && a.onClose && (a.onClose(ie(a)), a = void 0);
        });
      }
    }
  },
  /**
   * update the toast
   * @param opts toast props
   */
  update(e = {}) {
    const { containerId: t = "" } = e;
    if (t && e.updateId) {
      c[t] = c[t] || [];
      const n = c[t].find((s) => s.toastId === e.toastId), a = (n == null ? void 0 : n.position) !== e.position || (n == null ? void 0 : n.transition) !== e.transition, o = {
        ...e,
        disabledEnterTransition: !a,
        updateId: void 0
      };
      y.dismissForce(e == null ? void 0 : e.toastId), setTimeout(() => {
        l(o.content, o);
      }, e.delay || 0);
    }
  },
  /**
   * clear all toasts in container.
   * @param containerId container id
   */
  clear(e, t = true) {
    e ? ne(e, t) : Re(t);
  },
  dismissCallback(e) {
    var a;
    const t = (a = e.currentTarget) == null ? void 0 : a.id, n = document.getElementById(t);
    n && (n.removeEventListener("animationend", y.dismissCallback, false), setTimeout(() => {
      y.remove(t);
    }));
  },
  dismiss(e) {
    if (e) {
      const t = F();
      for (const n of t)
        if (n.toastId === e) {
          Ce(n, (a) => {
            a.addEventListener("animationend", y.dismissCallback, false);
          });
          break;
        }
    }
  },
  dismissForce(e) {
    if (e) {
      const t = F();
      for (const n of t)
        if (n.toastId === e) {
          const a = document.getElementById(e);
          a && (a.remove(), a.removeEventListener("animationend", y.dismissCallback, false), y.remove(e));
          break;
        }
    }
  }
};
var je = reactive({ useHandler: void 0 });
var ye = reactive({});
var W = reactive({});
function Ee() {
  return Math.random().toString(36).substring(2, 9);
}
function Ge(e) {
  return typeof e == "number" && !isNaN(e);
}
function oe(e) {
  return typeof e == "string";
}
function w(e) {
  return typeof e == "function";
}
function Z(...e) {
  return mergeProps(...e);
}
function G(e) {
  return typeof e == "object" && (!!(e != null && e.render) || !!(e != null && e.setup) || typeof (e == null ? void 0 : e.type) == "object");
}
function Ve(e = {}) {
  ye[`${r.CSS_NAMESPACE}-default-options`] = e;
}
function Qe() {
  return ye[`${r.CSS_NAMESPACE}-default-options`] || me;
}
function We() {
  const e = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return document.documentElement.classList.contains("dark") || e ? "dark" : "light";
}
var V = ((e) => (e[e.Enter = 0] = "Enter", e[e.Exit = 1] = "Exit", e))(V || {});
var Te = {
  containerId: {
    type: [String, Number],
    required: false,
    default: ""
  },
  clearOnUrlChange: {
    type: Boolean,
    required: false,
    default: true
  },
  disabledEnterTransition: {
    type: Boolean,
    required: false,
    default: false
  },
  dangerouslyHTMLString: {
    type: Boolean,
    required: false,
    default: false
  },
  multiple: {
    type: Boolean,
    required: false,
    default: true
  },
  limit: {
    type: Number,
    required: false,
    default: void 0
  },
  position: {
    type: String,
    required: false,
    default: D.TOP_LEFT
  },
  bodyClassName: {
    type: String,
    required: false,
    default: ""
  },
  autoClose: {
    type: [Number, Boolean],
    required: false,
    default: false
  },
  closeButton: {
    type: [Boolean, Function, Object],
    required: false,
    default: void 0
  },
  transition: {
    type: [String, Object],
    required: false,
    default: "bounce"
  },
  hideProgressBar: {
    type: Boolean,
    required: false,
    default: false
  },
  pauseOnHover: {
    type: Boolean,
    required: false,
    default: true
  },
  pauseOnFocusLoss: {
    type: Boolean,
    required: false,
    default: true
  },
  closeOnClick: {
    type: Boolean,
    required: false,
    default: true
  },
  progress: {
    type: Number,
    required: false,
    default: void 0
  },
  progressClassName: {
    type: String,
    required: false,
    default: ""
  },
  toastStyle: {
    type: Object,
    required: false,
    default() {
      return {};
    }
  },
  progressStyle: {
    type: Object,
    required: false,
    default() {
      return {};
    }
  },
  role: {
    type: String,
    required: false,
    default: "alert"
  },
  theme: {
    type: String,
    required: false,
    default: M.AUTO
  },
  content: {
    type: [String, Object, Function],
    required: false,
    default: ""
  },
  toastId: {
    type: [String, Number],
    required: false,
    default: ""
  },
  data: {
    type: [Object, String],
    required: false,
    default() {
      return {};
    }
  },
  type: {
    type: String,
    required: false,
    default: g.DEFAULT
  },
  icon: {
    type: [Boolean, String, Number, Object, Function],
    required: false,
    default: void 0
  },
  delay: {
    type: Number,
    required: false,
    default: void 0
  },
  onOpen: {
    type: Function,
    required: false,
    default: void 0
  },
  onClose: {
    type: Function,
    required: false,
    default: void 0
  },
  onClick: {
    type: Function,
    required: false,
    default: void 0
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: void 0
  },
  rtl: {
    type: Boolean,
    required: false,
    default: false
  },
  toastClassName: {
    type: String,
    required: false,
    default: ""
  },
  updateId: {
    type: [String, Number],
    required: false,
    default: ""
  },
  contentProps: {
    type: Object,
    required: false,
    default: null
  },
  expandCustomProps: {
    type: Boolean,
    required: false,
    default: false
  }
};
var Ke = {
  autoClose: {
    type: [Number, Boolean],
    required: true
  },
  isRunning: {
    type: Boolean,
    required: false,
    default: void 0
  },
  type: {
    type: String,
    required: false,
    default: g.DEFAULT
  },
  theme: {
    type: String,
    required: false,
    default: M.AUTO
  },
  hide: {
    type: Boolean,
    required: false,
    default: void 0
  },
  className: {
    type: [String, Function],
    required: false,
    default: ""
  },
  controlledProgress: {
    type: Boolean,
    required: false,
    default: void 0
  },
  rtl: {
    type: Boolean,
    required: false,
    default: void 0
  },
  isIn: {
    type: Boolean,
    required: false,
    default: void 0
  },
  progress: {
    type: Number,
    required: false,
    default: void 0
  },
  closeToast: {
    type: Function,
    required: false,
    default: void 0
  }
};
var Ye = defineComponent({
  name: "ProgressBar",
  props: Ke,
  // @ts-ignore
  setup(e, {
    attrs: t
  }) {
    const n = ref(), a = computed(() => e.hide ? "true" : "false"), o = computed(() => ({
      ...t.style || {},
      animationDuration: `${e.autoClose === true ? 5e3 : e.autoClose}ms`,
      animationPlayState: e.isRunning ? "running" : "paused",
      opacity: e.hide || e.autoClose === false ? 0 : 1,
      transform: e.controlledProgress ? `scaleX(${e.progress})` : "none"
    })), s = computed(() => [`${r.CSS_NAMESPACE}__progress-bar`, e.controlledProgress ? `${r.CSS_NAMESPACE}__progress-bar--controlled` : `${r.CSS_NAMESPACE}__progress-bar--animated`, `${r.CSS_NAMESPACE}__progress-bar-theme--${e.theme}`, `${r.CSS_NAMESPACE}__progress-bar--${e.type}`, e.rtl ? `${r.CSS_NAMESPACE}__progress-bar--rtl` : null].filter(Boolean).join(" ")), i = computed(() => `${s.value} ${(t == null ? void 0 : t.class) || ""}`), C = () => {
      n.value && (n.value.onanimationend = null, n.value.ontransitionend = null);
    }, u = () => {
      e.isIn && e.closeToast && e.autoClose !== false && (e.closeToast(), C());
    }, A = computed(() => e.controlledProgress ? null : u), m = computed(() => e.controlledProgress ? u : null);
    return watchEffect(() => {
      n.value && (C(), n.value.onanimationend = A.value, n.value.ontransitionend = m.value);
    }), () => createVNode("div", {
      ref: n,
      role: "progressbar",
      "aria-hidden": a.value,
      "aria-label": "notification timer",
      class: i.value,
      style: o.value
    }, null);
  }
});
var Ze = defineComponent({
  name: "CloseButton",
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      required: false,
      default: M.AUTO
    },
    type: {
      type: String,
      required: false,
      default: M.LIGHT
    },
    ariaLabel: {
      type: String,
      required: false,
      default: "close"
    },
    closeToast: {
      type: Function,
      required: false,
      default: void 0
    }
  },
  setup(e) {
    return () => createVNode("button", {
      class: `${r.CSS_NAMESPACE}__close-button ${r.CSS_NAMESPACE}__close-button--${e.theme}`,
      type: "button",
      onClick: (t) => {
        t.stopPropagation(), e.closeToast && e.closeToast(t);
      },
      "aria-label": e.ariaLabel
    }, [createVNode("svg", {
      "aria-hidden": "true",
      viewBox: "0 0 14 16"
    }, [createVNode("path", {
      "fill-rule": "evenodd",
      d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
    }, null)])]);
  }
});
var X = ({
  theme: e,
  type: t,
  path: n,
  ...a
}) => createVNode("svg", mergeProps({
  viewBox: "0 0 24 24",
  width: "100%",
  height: "100%",
  fill: e === "colored" ? "currentColor" : `var(--toastify-icon-color-${t})`
}, a), [createVNode("path", {
  d: n
}, null)]);
function Xe(e) {
  return createVNode(X, mergeProps(e, {
    path: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"
  }), null);
}
function Je(e) {
  return createVNode(X, mergeProps(e, {
    path: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"
  }), null);
}
function et(e) {
  return createVNode(X, mergeProps(e, {
    path: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
  }), null);
}
function tt(e) {
  return createVNode(X, mergeProps(e, {
    path: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
  }), null);
}
function nt() {
  return createVNode("div", {
    class: `${r.CSS_NAMESPACE}__spinner`
  }, null);
}
var Q = {
  info: Je,
  warning: Xe,
  success: et,
  error: tt,
  spinner: nt
};
var at = (e) => e in Q;
function ot({
  theme: e,
  type: t,
  isLoading: n,
  icon: a
}) {
  let o;
  const s = !!n || t === "loading", i = {
    theme: e,
    type: t
  };
  if (s && (a === void 0 || typeof a == "boolean")) return Q.spinner();
  if (a !== false) {
    if (G(a))
      o = toRaw(a);
    else if (w(a)) {
      const C = a;
      i.type = s ? "loading" : t, o = C(i), o = !o && s ? Q.spinner() : o;
    } else isVNode(a) ? o = cloneVNode(a, i) : oe(a) || Ge(a) ? o = a : at(t) && (o = Q[t](i));
    return o;
  }
}
var st = () => {
};
function rt(e, t, n = r.COLLAPSE_DURATION) {
  const { scrollHeight: a, style: o } = e, s = n;
  requestAnimationFrame(() => {
    o.minHeight = "initial", o.height = a + "px", o.transition = `all ${s}ms`, requestAnimationFrame(() => {
      o.height = "0", o.padding = "0", o.margin = "0", setTimeout(t, s);
    });
  });
}
function lt(e) {
  const t = ref(false), n = ref(false), a = ref(false), o = ref(V.Enter), s = reactive({
    ...e,
    appendPosition: e.appendPosition || false,
    collapse: typeof e.collapse > "u" ? true : e.collapse,
    collapseDuration: e.collapseDuration || r.COLLAPSE_DURATION
  }), i = s.done || st, C = computed(() => s.appendPosition ? `${s.enter}--${s.position}` : s.enter), u = computed(() => s.appendPosition ? `${s.exit}--${s.position}` : s.exit), A = computed(() => e.pauseOnHover ? {
    onMouseenter: h2,
    onMouseleave: I
  } : {});
  function m() {
    const T = C.value.split(" ");
    E().addEventListener(
      ee.ENTRANCE_ANIMATION_END,
      I,
      { once: true }
    );
    const O = (q) => {
      const U = E();
      q.target === U && (U.dispatchEvent(new Event(ee.ENTRANCE_ANIMATION_END)), U.removeEventListener("animationend", O), U.removeEventListener("animationcancel", O), o.value === V.Enter && q.type !== "animationcancel" && U.classList.remove(...T));
    }, b = () => {
      const q = E();
      q.classList.add(...T), q.addEventListener("animationend", O), q.addEventListener("animationcancel", O);
    };
    e.pauseOnFocusLoss && S(), b();
  }
  function v() {
    if (!E()) return;
    const T = () => {
      const b = E();
      b.removeEventListener("animationend", T), s.collapse ? rt(b, i, s.collapseDuration) : i();
    }, O = () => {
      const b = E();
      o.value = V.Exit, b && (b.className += ` ${u.value}`, b.addEventListener("animationend", T));
    };
    n.value || (a.value ? T() : setTimeout(O));
  }
  function E() {
    return e.toastRef.value;
  }
  function S() {
    document.hasFocus() || h2(), window.addEventListener("focus", I), window.addEventListener("blur", h2);
  }
  function _() {
    window.removeEventListener("focus", I), window.removeEventListener("blur", h2);
  }
  function I() {
    (!e.loading.value || e.isLoading === void 0) && (t.value = true);
  }
  function h2() {
    t.value = false;
  }
  function R(T) {
    T && (T.stopPropagation(), T.preventDefault()), n.value = false;
  }
  return watchEffect(v), watchEffect(() => {
    const T = F();
    n.value = T.findIndex((O) => O.toastId === s.toastId) > -1;
  }), watchEffect(() => {
    e.isLoading !== void 0 && (e.loading.value ? h2() : I());
  }), onMounted(m), onUnmounted(() => {
    e.pauseOnFocusLoss && _();
  }), {
    isIn: n,
    isRunning: t,
    hideToast: R,
    eventHandlers: A
  };
}
var it = defineComponent({
  name: "ToastItem",
  inheritAttrs: false,
  props: Te,
  // @ts-ignore
  setup(e) {
    const t = ref(), n = computed(() => !!e.isLoading), a = computed(() => e.progress !== void 0 && e.progress !== null), o = computed(() => ot(e)), s = computed(() => [`${r.CSS_NAMESPACE}__toast`, `${r.CSS_NAMESPACE}__toast-theme--${e.theme}`, `${r.CSS_NAMESPACE}__toast--${e.type}`, e.rtl ? `${r.CSS_NAMESPACE}__toast--rtl` : void 0, e.toastClassName || ""].filter(Boolean).join(" ")), {
      isRunning: i,
      isIn: C,
      hideToast: u,
      eventHandlers: A
    } = lt({
      toastRef: t,
      loading: n,
      done: () => {
        y.remove(e.toastId);
      },
      ...ge(e.transition, e.disabledEnterTransition),
      ...e
    });
    return () => createVNode("div", mergeProps({
      id: e.toastId,
      class: s.value,
      style: e.toastStyle || {},
      ref: t,
      "data-testid": `toast-item-${e.toastId}`,
      onClick: (m) => {
        e.closeOnClick && u(), e.onClick && e.onClick(m);
      }
    }, A.value), [createVNode("div", {
      role: e.role,
      "data-testid": "toast-body",
      class: `${r.CSS_NAMESPACE}__toast-body ${e.bodyClassName || ""}`
    }, [o.value != null && createVNode("div", {
      "data-testid": `toast-icon-${e.type}`,
      class: [`${r.CSS_NAMESPACE}__toast-icon`, e.isLoading ? "" : `${r.CSS_NAMESPACE}--animate-icon ${r.CSS_NAMESPACE}__zoom-enter`].join(" ")
    }, [G(o.value) ? h(toRaw(o.value), {
      theme: e.theme,
      type: e.type
    }) : w(o.value) ? o.value({
      theme: e.theme,
      type: e.type
    }) : o.value]), createVNode("div", {
      "data-testid": "toast-content"
    }, [G(e.content) ? h(toRaw(e.content), {
      toastProps: toRaw(e),
      closeToast: u,
      data: e.data,
      ...e.expandCustomProps ? e.contentProps : {
        contentProps: e.contentProps || {}
      }
    }) : w(e.content) ? e.content({
      toastProps: toRaw(e),
      closeToast: u,
      data: e.data
    }) : e.dangerouslyHTMLString ? h("div", {
      innerHTML: e.content
    }) : e.content])]), (e.closeButton === void 0 || e.closeButton === true) && createVNode(Ze, {
      theme: e.theme,
      closeToast: (m) => {
        m.stopPropagation(), m.preventDefault(), u();
      }
    }, null), G(e.closeButton) ? h(toRaw(e.closeButton), {
      closeToast: u,
      type: e.type,
      theme: e.theme
    }) : w(e.closeButton) ? e.closeButton({
      closeToast: u,
      type: e.type,
      theme: e.theme
    }) : null, createVNode(Ye, {
      className: e.progressClassName,
      style: e.progressStyle,
      rtl: e.rtl,
      theme: e.theme,
      isIn: C.value,
      type: e.type,
      hide: e.hideProgressBar,
      isRunning: i.value,
      autoClose: e.autoClose,
      controlledProgress: a.value,
      progress: e.progress,
      closeToast: e.isLoading ? void 0 : u
    }, null)]);
  }
});
var k = 0;
function ve() {
  typeof window > "u" || (k && window.cancelAnimationFrame(k), k = window.requestAnimationFrame(ve), W.lastUrl !== window.location.href && (W.lastUrl = window.location.href, y.clear()));
}
var dt = defineComponent({
  name: "ToastifyContainer",
  inheritAttrs: false,
  props: Te,
  // @ts-ignore
  setup(e) {
    const t = computed(() => e.containerId), n = computed(() => c[t.value] || []), a = computed(() => n.value.filter((o) => o.position === e.position));
    return onMounted(() => {
      typeof window < "u" && e.clearOnUrlChange && window.requestAnimationFrame(ve);
    }), onUnmounted(() => {
      typeof window < "u" && k && (window.cancelAnimationFrame(k), W.lastUrl = "");
    }), () => createVNode(Fragment, null, [a.value.map((o) => {
      const {
        toastId: s = ""
      } = o;
      return createVNode(it, mergeProps({
        key: s
      }, o), null);
    })]);
  }
});
var J = false;
var Se = {
  isLoading: true,
  autoClose: false,
  closeOnClick: false,
  closeButton: false,
  draggable: false
};
function pe() {
  const e = [];
  return F().forEach((n) => {
    const a = document.getElementById(n.containerId);
    a && !a.classList.contains(Y) && e.push(n);
  }), e;
}
function ut(e) {
  const t = pe().length, n = e != null ? e : 0;
  return n > 0 && t + N.items.length >= n;
}
function ct(e) {
  ut(e.limit) && !e.updateId && N.items.push({
    toastId: e.toastId,
    containerId: e.containerId,
    toastContent: e.content,
    toastProps: e
  });
}
function L(e, t, n = {}) {
  if (J) return;
  n = Z(Qe(), {
    type: t
  }, toRaw(n)), (!n.toastId || typeof n.toastId != "string" && typeof n.toastId != "number") && (n.toastId = Ee()), n = {
    ...n,
    ...n.type === "loading" ? Se : {},
    content: e,
    containerId: n.containerId || String(n.position)
  };
  const a = Number(n == null ? void 0 : n.progress);
  return !isNaN(a) && a < 0 && (n.progress = 0), a > 1 && (n.progress = 1), n.theme === "auto" && (n.theme = We()), ct(n), W.lastUrl = window.location.href, n.multiple ? N.items.length ? n.updateId && j(e, n) : j(e, n) : (J = true, l.clearAll(void 0, false), setTimeout(() => {
    j(e, n);
  }, 0), setTimeout(() => {
    J = false;
  }, 390)), n.toastId;
}
var l = (e, t) => L(e, g.DEFAULT, t);
l.info = (e, t) => L(e, g.DEFAULT, {
  ...t,
  type: g.INFO
});
l.error = (e, t) => L(e, g.DEFAULT, {
  ...t,
  type: g.ERROR
});
l.warning = (e, t) => L(e, g.DEFAULT, {
  ...t,
  type: g.WARNING
});
l.warn = l.warning;
l.success = (e, t) => L(e, g.DEFAULT, {
  ...t,
  type: g.SUCCESS
});
l.loading = (e, t) => L(e, g.DEFAULT, Z(t, Se));
l.dark = (e, t) => L(e, g.DEFAULT, Z(t, {
  theme: M.DARK
}));
l.remove = (e) => {
  e ? y.dismiss(e) : y.clear();
};
l.clearAll = (e, t) => {
  nextTick(() => {
    y.clear(e, t);
  });
};
l.isActive = (e) => {
  let t = false;
  return t = pe().findIndex((a) => a.toastId === e) > -1, t;
};
l.update = (e, t = {}) => {
  setTimeout(() => {
    const n = ze(e);
    if (n) {
      const a = toRaw(n), {
        content: o
      } = a, s = {
        ...a,
        ...t,
        toastId: t.toastId || e,
        updateId: Ee()
      }, i = s.render || o;
      delete s.render, L(i, s.type, s);
    }
  }, 0);
};
l.done = (e) => {
  l.update(e, {
    isLoading: false,
    progress: 1
  });
};
l.promise = ft;
function ft(e, {
  pending: t,
  error: n,
  success: a
}, o) {
  var m, v, E;
  let s;
  const i = {
    ...o || {},
    autoClose: false
  };
  t && (s = oe(t) ? l.loading(t, i) : l.loading(t.render, {
    ...i,
    ...t
  }));
  const C = {
    autoClose: (m = o == null ? void 0 : o.autoClose) != null ? m : true,
    closeOnClick: (v = o == null ? void 0 : o.closeOnClick) != null ? v : true,
    closeButton: (E = o == null ? void 0 : o.autoClose) != null ? E : null,
    isLoading: void 0,
    draggable: null,
    delay: 100
  }, u = (S, _, I) => {
    if (_ == null) {
      l.remove(s);
      return;
    }
    const h2 = {
      type: S,
      ...C,
      ...o,
      data: I
    }, R = oe(_) ? {
      render: _
    } : _;
    return s ? l.update(s, {
      ...h2,
      ...R,
      isLoading: false
    }) : l(R.render, {
      ...h2,
      ...R,
      isLoading: false
    }), I;
  }, A = w(e) ? e() : e;
  return A.then((S) => {
    u("success", a, S);
  }).catch((S) => {
    u("error", n, S);
  }), A;
}
l.POSITION = D;
l.THEME = M;
l.TYPE = g;
l.TRANSITIONS = Ie;
var mt = {
  install(e, t = {}) {
    je.useHandler = t.useHandler || (() => {
    }), gt(t);
  }
};
typeof window < "u" && (window.Vue3Toastify = mt);
function gt(e = {}) {
  const t = Z(me, e);
  Ve(t);
}
export {
  V as AnimationStep,
  Oe as Bounce,
  Le as Flip,
  be as Slide,
  y as ToastActions,
  dt as ToastifyContainer,
  Pe as Zoom,
  Ce as addExitAnimateToNode,
  je as appInstance,
  He as appendFromQueue,
  Fe as cacheRenderInstance,
  Re as clearContainers,
  x as containerInstances,
  mt as default,
  j as doAppend,
  F as getAllToast,
  ze as getToast,
  W as globalCache,
  ye as globalOptions,
  N as queue,
  ne as removeContainer,
  l as toast,
  c as toastContainers,
  gt as updateGlobalOptions,
  lt as useCssTransition
};
//# sourceMappingURL=vue3-toastify.js.map
