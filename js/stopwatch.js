/*!
 * vClock v2.3
 * Timer
 * Copyright 2015-2021 Comfort Software Group
 * All rights reserved
 */
var vStopwatch = (function () {
  var U = $("#col-main");
  var u = $("#pnl-main");
  var K = $("#lbl-title");
  var i = $("#pnl-time");
  var Y = $("#lbl-time");
  var o = $("#lbl-msec");
  var H = $("#pnl-set-timer");
  var j = $("#row-laps");
  var b = $("#pnl-tools");
  var N = $("#btn-font-minus");
  var w = $("#btn-font-plus");
  var t = $("#pnl-ne0n");
  var A = $("#tbl-laps");
  var a = A.html();
  var V;
  var S;
  var k = 0;
  var c = 0;
  var n = 0;
  var q = false;
  var J = {};
  function I() {
    J = { enabled: false, title: "", value: 0, laps: [] };
    J.start = new Date();
  }
  var g = "";
  function m() {
    if (isEmbed) {
      return;
    }
    g = "";
    if (J.enabled) {
      g += "start=" + getFormattedLocalDT(J.start, true, true);
    } else {
      if (J.value != 0) {
        g += "enabled=0";
        g += "&msec=" + J.value;
      }
    }
    if (J.laps.length != 0) {
      g += "&laps=" + L();
    }
    if (J.title != "") {
      g += "&title=" + encodeURIComponent(J.title).replace(/%20/g, "+");
    }
    if (g != location.hash.substring(1)) {
      location.replace("#" + g);
    }
    configC.swHash = g;
    configC.save("swHash");
  }
  function G() {
    I();
    g = location.hash.substring(1);
    if (g == "") {
      g = configC.swHash;
    }
    if (g == "") {
      return false;
    }
    var ae = false;
    var af = g.split("&");
    for (var ac = 0; ac < af.length; ac++) {
      var ab = af[ac].split("=");
      var ag = ab[1];
      switch (ab[0]) {
        case "enabled":
          J.enabled = ag != "0";
          break;
        case "msec":
          J.value = parseInt(ag, 10);
          break;
        case "start":
          J.start = getLocalDTFromStr(ag);
          J.enabled = true;
          break;
        case "laps":
          ae = true;
          var ad = ag.split(".");
          var ai = 0;
          var ah = 0;
          for (var aa = 0; aa < ad.length; aa++) {
            ah = parseInt(ad[aa], 10);
            if (ah >= ai) {
              J.laps.push(ah);
              ai = ah;
            }
          }
          break;
        case "title":
          J.title = decodeURIComponent(ag.replace(/\+/g, "%20"));
          break;
        default:
          processURIParam(ab[0], ag);
          break;
      }
    }
    if (J.enabled && J.value !== 0) {
      C();
    }
    if (ae) {
      h(true);
    }
    return true;
  }
  var Q = function () {
    $("noscript").remove();
    configC.restoreStopwatch();
    $("#select-format-time").val(configC.swTimeFormat);
    I();
    if (langC.rtl) {
      o.html("");
    }
    $(window).resize(y);
    window.refreshSettings = af;
    function af() {
      if (!q) {
        return;
      }
      x();
      E();
      h(true);
    }
    $("#btn-reset").click(X).show();
    $("#btn-resume")
      .click(function () {
        C();
        F();
      })
      .show();
    N.click(function () {
      hideTooltips();
      while (configC.swFontSizeId > 0) {
        configC.swFontSizeId--;
        if (M > FONT_SIZES[configC.swFontSizeId]) {
          break;
        }
      }
      configC.save("swFontSizeId");
      y();
    });
    w.click(function () {
      hideTooltips();
      if (
        configC.swFontSizeId < FONT_SIZE_LEN &&
        M == FONT_SIZES[configC.swFontSizeId]
      ) {
        configC.swFontSizeId++;
      }
      configC.save("swFontSizeId");
      y();
    });
    $(document).on("keydown", function (ag) {
      if (ag.isDefaultPrevented()) {
        return;
      }
      switch (ag.key) {
        case "Escape":
        case "Esc":
          if (configC.themeFullScreen) {
            $("#btn-full-screen-exit").trigger("click");
          }
          break;
        case " ":
        case "Spacebar":
          ag.preventDefault();
          if (!J.enabled) {
            C();
            F();
          } else {
            l();
          }
          break;
        case "Add":
        case "+":
        case "l":
        case "L":
          ag.preventDefault();
          if (J.enabled) {
            e();
          }
          break;
        case "r":
        case "R":
          ag.preventDefault();
          X();
          break;
      }
    });
    $(window).bind("hashchange", function () {
      if (!isEmbed) {
        setShareEdit();
      }
      if (g == location.hash.substring(1)) {
        return;
      }
      if (G()) {
        m();
      }
      Z();
      R();
    });
    function ae(ai) {
      var ah = [];
      var aj = "hsygtedilcpmnroa#-bu";
      while (ai !== 9) {
        var ag = ai % 38;
        ai = (ai - ag) / 38;
        ah.unshift(aj[ag]);
      }
      return ah.join("");
    }
    var ab = 0;
    var aa = $(
      ae(19377203) + "[" + ae(19446771) + "=" + ae(1527707154097768) + "]"
    ).attr(ae(1057973211936));
    if (aa === undefined) {
      return;
    }
    for (var ac = 0; ac < aa.length; ac++) {
      var ad = aa.charCodeAt(ac);
      ab = (ab << 6) - ab + ad;
      ab = ab & ab;
    }
    if (ab === 704881605) {
      $(ae(1558582096654191) + "e").click(l);
      $(ae(41015318330108)).click(e);
    }
    if (G()) {
      Z();
      if (!J.enabled) {
        m();
      }
      R();
    } else {
      Z();
    }
    if (!isEmbed) {
      setShareEdit();
    }
    $("#pnl-time").css("text-align", "");
    U.show();
    $("#pnl-description,#pnl-links,#pnl-share").show();
    x();
    v();
    q = true;
    y();
    setTimeout(y, 100);
    setTimeout(y, 1000);
  };
  function Z() {
    if (J.enabled) {
      F();
    }
    E();
    h(true);
    K.text(J.title);
    P(0);
    y();
    D();
  }
  function X() {
    J.value = 0;
    J.laps = [];
    J.title = "";
    K.text(J.title);
    C();
    E();
    h(true);
    m();
    D();
  }
  function F() {
    J.enabled = true;
    h(true);
    R();
    m();
    D();
  }
  function C() {
    var aa = new Date();
    J.start = new Date(aa.getTime() - J.value);
  }
  function l() {
    J.enabled = false;
    R();
    y();
    m();
    D();
  }
  function D() {
    $("#btn-reset").prop("disabled", !J.enabled && J.value == 0);
  }
  function e() {
    J.laps.push(J.value);
    E();
    h(true);
    y(true);
    m();
  }
  function E() {
    var ab = "";
    if (J.laps.length == 0) {
      n = 0;
    } else {
      n = J.laps[J.laps.length - 1];
      for (var aa = 0; aa < J.laps.length; aa++) {
        ab =
          "<tr class='digit'><td>" +
          (aa + 1) +
          "</td><td>" +
          z(aa == 0 ? J.laps[aa] : J.laps[aa] - J.laps[aa - 1]) +
          "</td><td>" +
          z(J.laps[aa]) +
          "</td></tr>" +
          ab;
      }
      ab =
        "<tr class='digit'><td>" +
        (J.laps.length + 1) +
        "</td><td id='lbl-lap-time'>" +
        z(J.value - n) +
        "</td><td id='lbl-lap-total'>" +
        z(J.value) +
        "</td></tr>" +
        ab;
    }
    A.html(a + ab);
    V = $("#lbl-lap-time");
    S = $("#lbl-lap-total");
    setDigitFontNames();
    if (J.laps.length == 0) {
      j.hide();
    } else {
      j.show();
    }
    y();
  }
  function L() {
    var ab = "";
    for (var aa = 0; aa < J.laps.length; aa++) {
      ab += J.laps[aa] + (aa == J.laps.length - 1 ? "" : ".");
    }
    return ab;
  }
  function R() {
    if (configC.buttonsVisible) {
      if (J.enabled) {
        $("#btn-reset, #btn-resume").hide();
        $("#btn-lap, #btn-pause").show();
      } else {
        $("#btn-reset, #btn-resume").show();
        $("#btn-lap, #btn-pause").hide();
      }
    } else {
      $("#btn-reset, #btn-resume, #btn-lap, #btn-pause").hide();
    }
  }
  var B = 0;
  var T = 0;
  var M = parseInt(Y.css("font-size"), 10);
  function x() {
    setDigitFontNames();
    P(0);
    o.css("top", configC.themeDigitalFont ? "-4%" : "");
  }
  function v() {
    var aa = configC.swFontSizeId;
    M = FONT_SIZES[aa];
    Y.css("font-size", M + "px");
    while (aa > 0 && (W() > $(window).height() || f() > u.width())) {
      aa--;
      M = FONT_SIZES[aa];
      Y.css("font-size", M + "px");
    }
    P(0);
  }
  function P(ab) {
    M = M + ab;
    Y.css("font-size", M + "px");
    o.css("font-size", Math.max(Math.round(M / 2.5), 10) + "px");
    B = Math.round(Y.height() / 4);
    T = configC.themeDigitalFont ? Math.round(Y.height() / 6) : 0;
    if (J.title != "") {
      K.css(
        "font-size",
        Math.max(Math.round(M / 4), MIN_TITLE_FONT_SIZE) + "px"
      );
    }
    var aa = Math.max(Math.round(M / 6), 14);
    A.css("font-size", aa + "px");
  }
  function W() {
    return (
      Y.height() + (J.title != "" ? K.height() + B + T : T) + T + H.height() + B
    );
  }
  function f() {
    return Y.width() + o.width() * 2 + Y.height();
  }
  var s = 0;
  var p = 5;
  window.onMainResize = y;
  function y() {
    if (!q) {
      return;
    }
    if (isEmbed && $(window).height() == 0) {
      return;
    }
    if (b.length == 1) {
      s = U.position().top - 15;
      b.css("margin", s + "px");
      p = b.height();
    }
    var ad = p + s;
    var ac =
      ad +
      s +
      (J.title != "" ? MIN_LABEL_HEIGHT : 0) +
      (configC.clockDateVisible ? MIN_LABEL_HEIGHT : 0) +
      H.height() +
      MIN_TIME_HEIGHT;
    var al = FONT_SIZES[configC.swFontSizeId];
    var aj = Math.max(
      ac,
      $(window).height() -
        u.offset().top -
        (isEmbed || t.length === 0 ? 0 : 90) -
        Math.max(MIN_BOTTOM_MARGIN, U.position().top)
    );
    function af() {
      if (j.is(":visible")) {
        u.css(
          "height",
          Math.round((aj + Y.height()) / 2 + H.height() * 2) + "px"
        );
      } else {
        u.css("height", aj + "px");
      }
    }
    function ai() {
      return u.height() - ad;
    }
    function ab() {
      return u.width();
    }
    af();
    if (Y.html() != "") {
      var aa, ae;
      var ah = ai();
      var ak = ab();
      while (M < al && W() < ah && f() < ak) {
        P(1);
        af();
      }
      while (true) {
        aa = W();
        ae = f();
        if (M <= al && aa <= ah && ae <= ak) {
          break;
        }
        P(Math.round(Math.min((ah - aa) / 4, (ak - ae) / 20, -1)));
        af();
        if (M < MIN_FONT_SIZE) {
          break;
        }
      }
    }
    O();
    i.css("width", Y.width() + o.width() + "px");
    i.css("height", Y.height() + "px");
    i.css(
      "left",
      (langC.rtl ? -1 : 1) * Math.round((u.width() - Y.width()) / 2) + "px"
    );
    var ag = Math.round((aj - i.height()) / 2);
    if (u.height() < W() + H.height() + (J.title == "" ? B : 0)) {
      i.css(
        "top",
        s +
          (J.title != "" ? K.height() + B + T : T) +
          Math.round((u.height() - W()) / 2 - Y.position().top) +
          "px"
      );
    } else {
      i.css("top", ag - Y.position().top + "px");
    }
    K.css("width", u.width() + "px");
    K.css("top", i.position().top + Y.position().top - K.height() - T + "px");
    H.css("width", u.width() + "px");
    H.css(
      "top",
      i.position().top +
        Y.position().top +
        Y.height() +
        Math.round(H.height() / 2) +
        "px"
    );
  }
  function O() {
    var aa = M <= FONT_SIZES[0];
    var ab =
      configC.swFontSizeId == FONT_SIZE_LEN ||
      M < FONT_SIZES[configC.swFontSizeId];
    if (aa && ab) {
      N.hide();
      w.hide();
    } else {
      if (aa) {
        N.addClass("disabled");
      } else {
        N.removeClass("disabled");
      }
      N.show();
      if (ab) {
        w.addClass("disabled");
      } else {
        w.removeClass("disabled");
      }
      w.show();
    }
  }
  var r;
  function h(aa) {
    var af = new Date();
    var ab = false;
    var ai = false;
    if (aa === true) {
      clearTimeout(r);
      ab = true;
    } else {
      if (!J.enabled) {
        return;
      }
    }
    if (J.enabled) {
      J.value = af - J.start;
    }
    var ac = J.value % 1000;
    var aj = Math.floor(J.value / 1000);
    if (c != aj) {
      c = aj;
      ab = true;
    }
    var ad = Math.floor(aj / 60);
    aj = aj % 60;
    var ah = Math.floor(ad / 60);
    if (k != ah) {
      k = ah;
      ai = true;
    }
    ad = ad % 60;
    var ak = Math.floor(ah / 24);
    ah = ah % 24;
    var al = intToStrTwo(ad) + ":" + intToStrTwo(aj);
    if (ah != 0) {
      al = intToStrTwo(ah) + ":" + al;
    }
    var ae = al;
    if (ak != 0) {
      var ag = ak == 1 ? dayLC : daysLC;
      ae = ak + " " + ag + " " + al;
      if (configC.themeDigitalFont) {
        al =
          ak +
          "<span class='" +
          (langC.isDigitalDay
            ? "font-digit-text text-rel-30'>"
            : "font-sans text-normal text-rel-40'>&nbsp;") +
          ag +
          "</span>&nbsp;" +
          al;
      } else {
        al =
          ak +
          "<span class='text-normal text-40'>&nbsp;" +
          ag +
          "</span>&nbsp;" +
          al;
      }
    }
    if (ab) {
      document.title =
        (J.value != 0 ? ae + " - " : "") +
        (J.title == "" ? ORIGINAL_TITLE : J.title);
    }
    if (langC.rtl) {
      Y.html(al + d(ac));
    } else {
      if (ab) {
        Y.html(al);
      }
      o.html(d(ac));
    }
    if (n != 0) {
      V.html(z(J.value - n));
      S.html(z(J.value));
    }
    if (ai) {
      y();
    }
    if (J.enabled) {
      r = setTimeout(h, 33);
    }
  }
  function d(aa) {
    switch (configC.swTimeFormat) {
      case 1:
        return "." + intToStrTwo(Math.floor(aa / 10));
      case 2:
        return "." + Math.floor(aa / 100);
      case 3:
        return "";
      default:
        return "." + intToStrThree(aa);
    }
  }
  function z(ae) {
    var af = ae % 1000;
    var ag = Math.floor(ae / 1000);
    var ab = Math.floor(ag / 60);
    ag = ag % 60;
    var aa = Math.floor(ab / 60);
    ab = ab % 60;
    var ah = Math.floor(aa / 24);
    aa = aa % 24;
    var ad = intToStrTwo(ab) + ":" + intToStrTwo(ag);
    if (k > 0) {
      ad = intToStrTwo(aa) + ":" + ad;
    }
    if (ah != 0) {
      var ac = ah == 1 ? dayLC : daysLC;
      if (configC.themeDigitalFont) {
        ad =
          ah +
          (ac.charAt(0) == "d"
            ? "d "
            : "<span class='font-sans text-normal text-rel-70'> " +
              ac +
              "</span> ") +
          ad;
      } else {
        ad = ah + "<span class='text-normal text-70'> " + ac + "</span> " + ad;
      }
    }
    return ad + d(af);
  }
  return { init: Q };
})();
