/*!
 * vClock v2.3
 * Alarm Clock
 * Copyright 2015-2021 Comfort Software Group
 * All rights reserved
 */
var vAlarm = (function () {
  var M = $("#col-main");
  var o = $("#pnl-main");
  var au = $("#lbl-title");
  var F = $("#pnl-time");
  var y = $("#lbl-time");
  var P = $("#lbl-noon");
  var f = $("#lbl-date");
  var v = $("#pnl-set-alarm");
  var x = $("#row-alarm");
  var at = $("#pnl-tools");
  var X = $("#btn-font-minus");
  var ap = $("#btn-font-plus");
  var am = $("#btn-set-alarm");
  var G = $("#btn-stop-alarm");
  var g = $("#pnl-ne0n");
  var an = $("#lbl-alarm-title");
  var ae = $("#pnl-alarm-time");
  var Q = $("#pnl-alarm-timer");
  var k = $("#lbl-alarm-timer");
  var ab = $("#form-alarm");
  var B = $("#edt-hour");
  var w = $("#edt-minute");
  var b = $("#lbl-overdue");
  var T = 0;
  var af = -1;
  var p = -1;
  var S = "";
  var ag = false;
  var L = true;
  var ac = "";
  var W = false;
  var al = {};
  function Y() {
    al = { isSpecified: false, enabled: false, title: "" };
    al.time = new Date();
  }
  var t = "";
  function ak() {
    if (isEmbed) {
      return;
    }
    if (al.isSpecified) {
      if (location.hash.substring(1) !== "") {
        location.replace("");
      }
      return;
    }
    t =
      "time=" +
      intToStrTwo(al.time.getHours()) +
      ":" +
      intToStrTwo(al.time.getMinutes());
    if (al.title != "") {
      t += "&title=" + encodeURIComponent(al.title).replace(/%20/g, "+");
    }
    if (!al.enabled) {
      t += "&enabled=0";
    }
    t += audioC.url();
    if (t != location.hash.substring(1)) {
      location.replace("#" + t);
    }
    configC.alarmHash = t;
    configC.save("alarmHash");
  }
  function E() {
    if (!al.isSpecified) {
      Y();
    }
    t = location.hash.substring(1);
    if (t == "") {
      t = configC.alarmHash;
    }
    if (t == "") {
      return false;
    }
    var aw = t.split("&");
    var av = false;
    var aB = "";
    var aA = false;
    for (var ax = 0; ax < aw.length; ax++) {
      var az = aw[ax].split("=");
      var ay = az[1];
      if (al.isSpecified) {
        processURIParam(az[0], ay);
        continue;
      }
      switch (az[0]) {
        case "time":
          al.enabled = true;
          B[0].selectedIndex = parseInt(ay.substring(0, 2), 10);
          w[0].selectedIndex = parseInt(ay.substring(3, 5), 10);
          n();
          L = false;
          aA = true;
          break;
        case "enabled":
          al.enabled = ay !== "0";
          break;
        case "title":
          aB = decodeURIComponent(ay.replace(/\+/g, "%20"));
          aA = true;
          break;
        case "sound":
          configC.alarmAudioCode = ay;
          av = true;
          break;
        case "loop":
          configC.alarmAudioLoop = ay == "1";
          av = true;
          break;
        default:
          processURIParam(az[0], ay);
          break;
      }
    }
    if (aA) {
      $("#edt-title").val(aB);
      K();
    }
    if (av) {
      audioC.set();
    }
    return true;
  }
  var O = function () {
    $("noscript").remove();
    configC.restoreAlarm();
    Y();
    if (!configC.clock12hour) {
      P.hide();
    }
    if (!configC.clockDateVisible) {
      f.hide();
    }
    ac = au.text();
    au.show();
    if (langC.rtlTime) {
      P.insertBefore(y);
    }
    if (langC.am != "AM") {
      $("#lbl-alarm-time").removeClass("digit");
    }
    fillSelectHours(B);
    fillSelectInt(w, 60);
    audioC.init("alarm");
    $(window).resize(V);
    window.refreshSettings = aB;
    function aB() {
      P.toggle(configC.clock12hour);
      f.toggle(configC.clockDateVisible);
      if (!W) {
        return;
      }
      fillSelectHours(B);
      N();
      K();
      u();
      h(true);
      if (isEmbed) {
        return;
      }
      r();
    }
    ab.on("show.bs.modal", function () {
      cancelFullScreen();
      ad = true;
      V();
      if (L) {
        L = false;
        var aC = new Date();
        B[0].selectedIndex = aC.getHours();
        w[0].selectedIndex = aC.getMinutes();
      }
    });
    ab.on("hide.bs.modal", function () {
      setTimeout(function () {
        ad = false;
      }, 100);
      audioC.pause();
    });
    $("#dialog-alarm")
      .on("show.bs.modal", function () {
        cancelFullScreen();
        ah = ad;
        if (ah) {
          ab.modal("hide");
        }
        b.html("");
        Z();
        audioC.pause();
        pageTitleNotification.on(
          "*** " + S + " - " + langC.alarm.toUpperCase() + " ***"
        );
        audioC.play(true);
        ag = true;
      })
      .on("hide.bs.modal", function () {
        audioC.pause();
        pageTitleNotification.off();
        if (ah) {
          ab.modal("show");
        }
        setTimeout(function () {
          ag = false;
        }, 200);
      });
    function aA(aE) {
      var aD = [];
      var aF = "acdegilmnoprstuwyhb";
      while (aE !== 7) {
        var aC = aE % 37;
        aE = (aE - aC) / 37;
        aD.unshift(aF[aC]);
      }
      return aD.join("");
    }
    var ax = 0;
    var av = $(
      aA(13478286) + "[" + aA(13524613) + "=" + aA(914125832556213) + "]"
    ).attr(aA(667728618146));
    if (av === undefined) {
      return;
    }
    for (var ay = 0; ay < av.length; ay++) {
      var az = av.charCodeAt(ay);
      ax = (ax << 5) - ax + az;
      ax = ax & ax;
    }
    if (ax === -204952091) {
      $("#" + aA(379702) + "-" + aA(508556540) + "-" + aA(485712031)).click(
        function () {
          if (al.isSpecified) {
            al.isSpecified = false;
            e();
            d();
            al.isSpecified = true;
            location.replace("#");
            location.href = $("#link-alarm").attr("href");
          } else {
            e();
          }
        }
      );
      $("#" + aA(379702) + "-" + aA(13745103) + "-" + aA(485712031)).click(Z);
      $("#" + aA(379702) + "-" + aA(13782180) + "-" + aA(485712031)).click(H);
    }
    X.click(function () {
      hideTooltips();
      while (configC.alarmFontSizeId > 0) {
        configC.alarmFontSizeId--;
        if (R > FONT_SIZES[configC.alarmFontSizeId]) {
          break;
        }
      }
      configC.save("alarmFontSizeId");
      V();
    });
    ap.click(function () {
      hideTooltips();
      if (
        configC.alarmFontSizeId < FONT_SIZE_LEN &&
        R == FONT_SIZES[configC.alarmFontSizeId]
      ) {
        configC.alarmFontSizeId++;
      }
      configC.save("alarmFontSizeId");
      V();
    });
    $(document).on("keydown", function (aC) {
      if (ag) {
        return;
      }
      if (
        configC.themeFullScreen &&
        !ad &&
        (aC.key === "Escape" || aC.key === "Esc")
      ) {
        $("#btn-full-screen-exit").trigger("click");
      }
      if (ad && aC.key === "Enter") {
        $("#btn-start-alarm").trigger("click", aC);
      }
    });
    $(window).bind("hashchange", function () {
      if (!isEmbed) {
        setShareEdit();
      }
      if (t == location.hash.substring(1)) {
        return;
      }
      E();
      ah = false;
      if (ag) {
        $("#dialog-alarm").modal("hide");
      }
      if (ab.hasClass("in")) {
        ab.modal("hide");
      }
      if (al.enabled) {
        e();
      } else {
        Z();
      }
    });
    if (!isOperaMini && !isEmbed) {
      am.click(function () {
        if (al.isSpecified) {
          e();
        } else {
          ab.modal("show");
        }
      });
      $("#btn-test-spec-alarm").click(H);
      $("#btn-edit-spec-alarm").click(function () {
        ab.modal("show");
      });
    } else {
      am.click(e);
    }
    if (M.data("alarm-time") !== "") {
      al.isSpecified = true;
      E();
      al.enabled = false;
      al.title = an.text();
      var aw = M.data("alarm-time");
      B[0].selectedIndex = parseInt(aw.substring(0, 2), 10);
      w[0].selectedIndex = parseInt(aw.substring(3, 5), 10);
      if (!isOperaMini && !isEmbed && configC.buttonsVisible) {
        $("#btn-test-spec-alarm,#btn-edit-spec-alarm").show();
      }
      L = false;
      if (!configC.buttonsVisible) {
        al.isSpecified = false;
        e();
        d();
        al.isSpecified = true;
      }
    } else {
      if (E()) {
        if (al.enabled) {
          e();
        } else {
          ak();
        }
      }
    }
    N();
    if (!isEmbed) {
      setShareEdit();
    }
    $("#pnl-time").css("text-align", "");
    M.show();
    $("#pnl-description,#pnl-links,#pnl-share").show();
    audioC.set();
    u();
    h(true);
    aq();
    W = true;
    V();
    setTimeout(V, 100);
    setTimeout(V, 1000);
  };
  function n() {
    var av = new Date();
    al.time = new Date();
    al.time.setMilliseconds(0);
    al.time.setSeconds(0);
    al.time.setMinutes(w[0].selectedIndex);
    al.time.setHours(B[0].selectedIndex);
    if (av > al.time) {
      al.time.setDate(al.time.getDate() + 1);
    }
  }
  function N() {
    am.toggle(!al.enabled && !isOperaMini && configC.buttonsVisible);
    G.toggle(al.enabled && !isOperaMini && configC.buttonsVisible);
  }
  function e() {
    x.show();
    if (al.isSpecified && !isOperaMini && !isEmbed) {
      $("#btn-test-spec-alarm,#btn-edit-spec-alarm").hide();
    }
    n();
    al.enabled = true;
    N();
    K();
    V();
    ak();
    d();
    audioC.check();
  }
  function H() {
    n();
    K();
    $("#dialog-alarm").modal("show");
  }
  function K() {
    if (!al.isSpecified) {
      al.title = $("#edt-title").val();
    }
    S = getTimeText(al.time, false);
    $("#lbl-dialog-alarm-title, #lbl-alarm-title").text(al.title);
    $("#lbl-dialog-alarm-time, #lbl-alarm-time").html(S);
    k.html(getTimerBetween(new Date(), al.time, false));
    if (al.enabled && !al.isSpecified) {
      document.title = S + " - " + (al.title == "" ? ORIGINAL_TITLE : al.title);
    }
  }
  function Z() {
    al.enabled = false;
    N();
    x.hide();
    if (al.isSpecified && !isOperaMini && !isEmbed && configC.buttonsVisible) {
      $("#btn-test-spec-alarm,#btn-edit-spec-alarm").show();
    }
    V();
    document.title = ORIGINAL_TITLE;
    ak();
  }
  var ar = $("#alm-history");
  var c = false;
  var q = [];
  U();
  r();
  function l() {
    var av = [6, 7, 8, 9, 10, 12, 13, 14, 17, 18];
    var ay = new Date();
    ay.setMinutes(0);
    for (var aw = 0; aw < av.length; aw++) {
      ay.setHours(av[aw]);
      var ax = encodeURIComponent(
        langC.alarm + " " + getTimeText(ay, false)
      ).replace(/%20/g, "+");
      q.push(
        "time=" +
          intToStrTwo(av[aw]) +
          ":00&title=" +
          ax +
          "&sound=childhood&loop=0"
      );
    }
  }
  function A() {
    if (isEmbed || typeof localStorage === "undefined") {
      return;
    }
    var av;
    try {
      for (av = 0; av < q.length; av++) {
        localStorage.setItem("alm" + av, q[av]);
      }
    } catch (aw) {
      console.log(aw);
    }
    for (av = q.length; av < 10; av++) {
      localStorage.removeItem("alm" + av);
    }
  }
  function U() {
    if (isEmbed) {
      return;
    }
    if (typeof localStorage === "undefined") {
      l();
      return;
    }
    var aw = localStorage.getItem("alm0");
    if (aw === null) {
      l();
      return;
    }
    for (var av = 0; av < 10; av++) {
      aw = localStorage.getItem("alm" + av);
      if (aw === null) {
        break;
      }
      q.push(aw);
    }
  }
  function d() {
    if (isEmbed) {
      return;
    }
    t = location.hash.substring(1);
    if (t === "") {
      t =
        "time=" +
        intToStrTwo(al.time.getHours()) +
        ":" +
        intToStrTwo(al.time.getMinutes()) +
        "&title=" +
        encodeURIComponent(al.title).replace(/%20/g, "+") +
        audioC.url();
    }
    if (q.length > 0 && q[0] === t) {
      return;
    }
    for (var av = 0; av < q.length; av++) {
      if (q[av] === t) {
        q.splice(av, 1);
        break;
      }
    }
    q.unshift(t);
    while (q.length > 10) {
      q.pop();
    }
    r();
    A();
  }
  function r() {
    if (ar.length === 0) {
      return;
    }
    var aD = "";
    var az = new Date();
    for (var ax = 0; ax < q.length; ax++) {
      var aA = q[ax].split("&");
      var aC = "";
      var ay = "";
      for (var aw = 0; aw < aA.length; aw++) {
        var av = aA[aw].split("=");
        var aB = av[1];
        switch (av[0]) {
          case "time":
            az.setHours(parseInt(aB.substring(0, 2), 10));
            az.setMinutes(parseInt(aB.substring(3, 5), 10));
            ay = getTimeText(az, false);
            break;
          case "title":
            aC = encodeTitle(decodeURIComponent(aB.replace(/\+/g, "%20")));
            break;
        }
      }
      if (aC === "") {
        aC = langC.alarm;
      }
      aD +=
        "<tr id='history'" +
        ax +
        "><td><a href='#" +
        q[ax] +
        "' onclick='scrollToTop(200);'>" +
        aC +
        "</a></td><td>" +
        ay +
        "</td>";
      if (c) {
        aD +=
          "<td><span class='icon ci-close-circle' onclick='removeHistory(" +
          ax +
          ")'></span></td>";
      }
      aD += "</tr>";
    }
    ar.html(aD);
  }
  window.removeHistory = ai;
  function ai(av) {
    q.splice(av, 1);
    r();
    A();
  }
  $("#btn-edit-history").click(function (av) {
    c = !c;
    r();
    if (c) {
      $(av.target).removeClass("ci-edit").addClass("ci-check");
    } else {
      $(av.target).removeClass("ci-check").addClass("ci-edit");
    }
  });
  var aa = 0;
  var ao = 0;
  var R = parseInt(y.css("font-size"), 10);
  function u() {
    setDigitFontNames();
    i(0);
  }
  function aq() {
    var av = configC.alarmFontSizeId;
    R = FONT_SIZES[av];
    y.css("font-size", R + "px");
    while (av > 0 && (m() > $(window).height() || s() > o.width())) {
      av--;
      R = FONT_SIZES[av];
      y.css("font-size", R + "px");
    }
    i(0);
  }
  function i(aw) {
    R = R + aw;
    y.css("font-size", R + "px");
    var av = Math.max(Math.round(R / 6), 14);
    var ax = getSizeDT(R);
    P.css(
      "font-size",
      Math.round(R / (configC.themeDigitalFont && langC.am == "AM" ? 1.3 : 3)) +
        "px"
    );
    aa = Math.round(y.height() / 4);
    ao = configC.themeDigitalFont ? Math.round(y.height() / 6) : 0;
    if (ac != "") {
      au.css("font-size", Math.max(ax, MIN_TITLE_FONT_SIZE) + "px");
    }
    if (configC.clockDateVisible) {
      f.css("font-size", Math.max(ax, MIN_DATE_FONT_SIZE) + "px");
    }
    an.css("font-size", Math.max(ax, MIN_TITLE_FONT_SIZE) + "px");
    ae.css("font-size", Math.max(Math.round(R / 3), 24) + "px");
    Q.css("font-size", av + "px");
  }
  function m() {
    return (
      y.height() +
      (ac != "" ? au.height() + aa + ao : ao) +
      (configC.clockDateVisible ? f.height() + aa + ao : ao) +
      v.height() +
      aa
    );
  }
  function s() {
    return y.width() + (configC.clock12hour ? P.width() * 4 : y.height());
  }
  var j = 0;
  var D = 5;
  function V() {
    if (!W) {
      return;
    }
    if (isEmbed && $(window).height() == 0) {
      return;
    }
    if (at.length == 1) {
      j = M.position().top - 15;
      at.css("margin", j + "px");
      D = at.height();
    }
    var ay = D + j;
    var ax =
      ay +
      j +
      (ac != "" ? MIN_LABEL_HEIGHT : 0) +
      (configC.clockDateVisible ? MIN_LABEL_HEIGHT : 0) +
      v.height() +
      MIN_TIME_HEIGHT;
    var aG = FONT_SIZES[configC.alarmFontSizeId];
    function aA() {
      o.css(
        "height",
        Math.max(
          ax,
          $(window).height() -
            o.offset().top -
            (al.enabled ? x.height() : 0) -
            (isEmbed || g.length === 0 ? 0 : 90) -
            Math.max(MIN_BOTTOM_MARGIN, M.position().top)
        ) + "px"
      );
      if (
        isEmbed &&
        ($(window).width() < 200 || $(window).height() < o.height())
      ) {
        o.css("height", $(window).height());
        if (o.height() < 80) {
          configC.clockDateVisible = false;
          f.hide();
          au.text("");
        }
      }
      if (isEmbed && ($(window).width() < 400 || $(window).height() < 300)) {
        $(".digit-text")
          .removeClass("digit-text")
          .removeClass("font-digit-text");
        setDigitFontNames();
      }
    }
    function aD() {
      return o.height() - ay;
    }
    function aw() {
      return o.width();
    }
    aA();
    if (y.html() != "") {
      var av, az;
      var aC = aD();
      var aF = aw();
      while (R < aG && m() < aC && s() < aF) {
        i(1);
        if (al.enabled) {
          aA();
        }
      }
      while (true) {
        av = m();
        az = s();
        if (R <= aG && av <= aC && az <= aF) {
          break;
        }
        i(Math.round(Math.min((aC - av) / 4, (aF - az) / 20, -1)));
        if (al.enabled) {
          aA();
        }
        if (R < MIN_FONT_SIZE) {
          break;
        }
      }
    }
    a();
    F.css("width", y.width() + P.width() + "px");
    F.css("height", y.height() + "px");
    F.css(
      "left",
      (langC.rtl ? -1 : 1) * Math.round((o.width() - y.width()) / 2) -
        (langC.rtlTime && configC.clock12hour ? P.width() : 0) +
        "px"
    );
    var aB = Math.round((o.height() - F.height()) / 2);
    if (o.height() < m() + v.height() + (ac == "" ? aa : 0)) {
      F.css(
        "top",
        j +
          (ac != "" ? au.height() + aa + ao : ao) +
          Math.round((o.height() - m()) / 2 - y.position().top) +
          "px"
      );
    } else {
      F.css("top", aB - y.position().top + "px");
    }
    au.css("width", o.width() + "px");
    au.css(
      "top",
      F.position().top + y.position().top - au.height() - ao + "px"
    );
    var aE = F.position().top + y.position().top + y.height() + ao;
    f.css("width", o.width() + "px");
    f.css("top", aE + "px");
    v.css("width", o.width() + "px");
    v.css(
      "top",
      Math.round(
        (o.height() +
          (configC.clockDateVisible ? f.position().top + f.height() : aE) -
          v.height()) /
          2
      ) + "px"
    );
    aj();
  }
  var C = true;
  var ad = false;
  var ah = false;
  var I = 450;
  var J = 400;
  function aj() {
    if (!ad) {
      return;
    }
    $(".btn-mp, #btn-audio-play").css("width", ab.width() < I ? "" : "45px");
    if (ab.width() < J) {
      if (C) {
        $(".btn-mp").hide();
        B.css("min-width", "90px");
        w.css("min-width", "");
        C = false;
      }
      $(".btn-classic").css("min-width", "65px");
    } else {
      if (!C) {
        $(".btn-mp").show();
        B.css("min-width", "100px");
        w.css("min-width", "100px");
        C = true;
      }
      $(".btn-classic").css("min-width", "");
    }
  }
  function a() {
    var av = R <= FONT_SIZES[0];
    var aw =
      configC.alarmFontSizeId == FONT_SIZE_LEN ||
      R < FONT_SIZES[configC.alarmFontSizeId];
    if (av && aw) {
      X.hide();
      ap.hide();
    } else {
      if (av) {
        X.addClass("disabled");
      } else {
        X.removeClass("disabled");
      }
      X.show();
      if (aw) {
        ap.addClass("disabled");
      } else {
        ap.removeClass("disabled");
      }
      ap.show();
    }
  }
  var z;
  function h(ax) {
    var az = new Date();
    if (ax === true) {
      clearTimeout(z);
      af = p = -1;
      z = setTimeout(h, 200);
    } else {
      if (az.getMilliseconds() < 350 || az.getMilliseconds() > 650) {
        z = setTimeout(h, 50);
        return;
      }
      z = setTimeout(h, 1000);
    }
    if (T != 0) {
      az.setSeconds(az.getSeconds() + T);
    }
    var av = az.getHours();
    var aw = az.getMinutes();
    var ay = az.getSeconds();
    if (configC.clock12hour) {
      if (langC.rtlTime) {
        P.html((av < 12 ? langC.am : langC.pm) + "&nbsp;");
      } else {
        P.html("&nbsp;" + (av < 12 ? langC.am : langC.pm));
      }
      av = av % 12;
      if (av == 0) {
        av = 12;
      }
    }
    y.html(intToStrHours(av) + ":" + intToStrTwo(aw) + ":" + intToStrTwo(ay));
    if (p != av) {
      p = av;
      V();
    }
    if (az.getDate() != af) {
      af = az.getDate();
      f.html(
        getDateText(az, configC.themeDigitalFont && langC.isDigitalLabel, true)
      );
    }
    if (al.enabled) {
      if (al.time <= az) {
        if (isEmbed) {
          audioC.pause();
          audioC.play(false);
          al.enabled = false;
          $(".colored").css("color", "#fff");
          $(".main-content")
            .css("background-color", "#EF6262")
            .fadeOut(0)
            .fadeIn(400)
            .delay(800)
            .fadeOut(0)
            .fadeIn(400)
            .delay(800)
            .fadeOut(0)
            .fadeIn(400)
            .delay(800)
            .fadeOut(0)
            .fadeIn(400);
          setTimeout(function () {
            $(".main-content").css("background-color", "");
            setColors();
            Z();
          }, 8000);
        } else {
          $("#dialog-alarm").modal("show");
        }
      } else {
        k.html(getTimerBetween(az, al.time, false));
      }
    }
    if (ag && az - al.time > 60000) {
      b.html(getTimerBetween(al.time, az, true) + " " + langC.overdue);
    }
  }
  return { init: O };
})();
