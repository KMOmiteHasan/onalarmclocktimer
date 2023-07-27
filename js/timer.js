/*!
 * vClock v2.3
 * Timer
 * Copyright 2015-2021 Comfort Software Group
 * All rights reserved
 */
var vTimer = (function () {
  var V = $("#col-main");
  var t = $("#pnl-main");
  var aE = $("#lbl-title");
  var T = $("#pnl-time");
  var J = $("#lbl-time");
  var k = $("#lbl-date");
  var B = $("#pnl-set-timer");
  var D = $("#pnl-description");
  var aD = $("#pnl-tools");
  var af = $("#btn-font-minus");
  var ax = $("#btn-font-plus");
  var l = $("#pnl-ne0n");
  var ao = $("#form-timer");
  var O = $("#edt-hour");
  var F = $("#edt-minute");
  var ay = $("#edt-second");
  var c = $("#edt-date");
  var G = $("#edt-time");
  var d = $("#lbl-overdue");
  var x = -1;
  var av = -1;
  var am = false;
  var ab = false;
  var s = false;
  var h = true;
  var ae = false;
  var g = {};
  var aw = isIOS;
  var e = false;
  var aj = 0;
  function ag() {
    g = {
      isHoliday: false,
      isSpecified: false,
      enabled: true,
      isCountdown: true,
      title: "",
      showMessage: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      value: 0,
      isOnZeroStop: true,
      isOnZeroRestart: false,
      isOnZeroIncrease: false,
    };
    g.alarmTime = new Date();
    g.date = g.alarmTime;
  }
  var C = "";
  function aq() {
    if (isEmbed) {
      return;
    }
    if (g.isHoliday || g.isSpecified) {
      if (location.hash.substring(1) !== "") {
        location.replace("");
      }
      return;
    }
    if (g.isCountdown) {
      C =
        "countdown=" +
        intToStrTwo(g.hours) +
        ":" +
        intToStrTwo(g.minutes) +
        ":" +
        intToStrTwo(g.seconds);
      if (g.enabled) {
        C += "&date=" + getFormattedLocalDT(g.alarmTime, true, false);
      } else {
        C += "&enabled=0";
        C += "&seconds=" + g.value;
      }
      if (g.isOnZeroRestart) {
        C += "&onzero=1";
      } else {
        if (g.isOnZeroIncrease) {
          C += "&onzero=2";
        }
      }
    } else {
      C = "date=" + getFormattedLocalDT(g.alarmTime, true, false);
    }
    if (g.title !== "") {
      C += "&title=" + encodeURIComponent(g.title).replace(/%20/g, "+");
    }
    if (!g.showMessage) {
      C += "&showmessage=0";
    }
    if (C !== "") {
      C += audioC.url();
    }
    if (C !== location.hash.substring(1)) {
      location.replace("#" + C);
    }
    configC.timerHash = C;
    configC.save("timerHash");
  }
  function R() {
    if (isEmbed || g.isHoliday) {
      configC.timerAudioCode = "bells";
      configC.timerAudioLoop = false;
    } else {
      if (g.isSpecified) {
      } else {
        ag();
      }
    }
    C = location.hash.substring(1);
    if (C === "") {
      C = configC.timerHash;
    }
    if (C === "") {
      return false;
    }
    if (!g.isHoliday && !g.isSpecified) {
      g.isCountdown = false;
    }
    var aG = C.split("&");
    var aF = false;
    var aK = true;
    for (var aH = 0; aH < aG.length; aH++) {
      var aJ = aG[aH].split("=");
      var aI = aJ[1];
      if ((g.isHoliday || g.isSpecified) && aJ[0] !== "sound") {
        processURIParam(aJ[0], aI);
        continue;
      }
      switch (aJ[0]) {
        case "countdown":
          g.isCountdown = true;
          g.hours = parseInt(aI.substring(0, aI.length - 6), 10);
          g.minutes = parseInt(aI.substring(aI.length - 5, aI.length - 3), 10);
          g.seconds = parseInt(aI.substring(aI.length - 2, aI.length), 10);
          break;
        case "enabled":
          g.enabled = aI !== "0";
          break;
        case "seconds":
          g.value = parseInt(aI, 10);
          aK = false;
          break;
        case "onzero":
          if (aI === "1") {
            g.isOnZeroStop = false;
            g.isOnZeroRestart = true;
          } else {
            if (aI === "2") {
              g.isOnZeroStop = false;
              g.isOnZeroIncrease = true;
            }
          }
          break;
        case "date":
          g.alarmTime = getLocalDTFromStr(aI);
          g.date = g.alarmTime;
          aK = false;
          break;
        case "title":
          g.title = decodeURIComponent(aI.replace(/\+/g, "%20"));
          break;
        case "showmessage":
          g.showMessage = aI === "1";
          break;
        case "sound":
          configC.timerAudioCode = aI;
          aF = true;
          break;
        case "loop":
          configC.timerAudioLoop = aI === "1";
          aF = true;
          break;
        default:
          processURIParam(aJ[0], aI);
          break;
      }
    }
    if (aF) {
      audioC.set();
    }
    if (!g.isHoliday && !g.isSpecified && g.enabled) {
      if (g.isCountdown && aK) {
        ak();
      } else {
        if (g.value !== 0) {
          r();
        }
      }
    }
    return true;
  }
  function ai() {
    if (isEmbed) {
      return;
    }
    $.fn.datetimepicker.dates.en = {
      days: langC.weekDays.concat(langC.weekDays[0]),
      daysShort: langC.daysShort.concat(langC.daysShort[0]),
      daysMin: langC.daysMin.concat(langC.daysMin[0]),
      months: langC.mCalendar,
      monthsShort: langC.monthsShort,
      today: langC.today,
      suffix: [],
      meridiem: [langC.am.toLowerCase(), langC.pm.toLowerCase()],
      weekStart: langC.weekStart,
    };
    $(".date").datetimepicker({
      autoclose: true,
      componentIcon: ".ci-date",
      format: langC.dateFormatShort,
      pickerPosition: "bottom-left",
      todayBtn: true,
      navIcons: { rightIcon: "ci-angle-right", leftIcon: "ci-angle-left" },
    });
    $(".time").datetimepicker({
      autoclose: true,
      componentIcon: ".ci-clock",
      format: configC.clock12hour
        ? "HH:ii P"
        : langC.timeFmtZero
        ? "hh:ii"
        : "h:ii",
      showMeridian: configC.clock12hour,
      pickerPosition: "bottom-left",
      todayBtn: false,
      navIcons: { rightIcon: "ci-angle-right", leftIcon: "ci-angle-left" },
    });
    $(".datetimepicker .datetimepicker-hours thead").hide();
    $(".datetimepicker .datetimepicker-minutes thead").hide();
    $(".datetimepicker .table-condensed").css("min-width", "250px");
  }
  var Y = function () {
    $("noscript").remove();
    configC.restoreTimer();
    ag();
    k.hide();
    $(".btn-mp, #btn-audio-play").css("width", "45px");
    if (!isOperaMini) {
      $("#btn-set-timer").show();
    }
    if (aw) {
      $("#edt-date,#edt-time")
        .removeClass("input-group date time input-datetime")
        .find("span")
        .remove();
      c = $("#edt-date-input");
      G = $("#edt-time-input");
      c.removeClass("form-control").css("color", "#777").prop("type", "date");
      G.removeClass("form-control").css("color", "#777").prop("type", "time");
    } else {
      if (isMobile) {
        $(".input-mobile-ro")
          .css("background-color", "#fff")
          .prop("readonly", true);
      }
    }
    if (!isEmbed && typeof localStorage !== "undefined") {
      $('#holidays-tabs a[data-toggle="tab"]').on("click", function (aI) {
        localStorage.setItem("activeTab", $(aI.target).attr("href"));
      });
      var i = localStorage.getItem("activeTab");
      if (i) {
        $('#holidays-tabs a[href="' + i + '"]').tab("show");
      }
    }
    fillSelectInt(O, 100);
    fillSelectInt(F, 60);
    fillSelectInt(ay, 60);
    audioC.init("timer");
    $(window).resize(ac);
    window.refreshSettings = aH;
    function aH() {
      k.html(aA(true));
      if (!ae) {
        return;
      }
      E();
      W(true);
      X();
      if (isEmbed) {
        return;
      }
      if (!aw) {
        var aI = c.data("datetimepicker").getDate();
        var aJ = G.data("datetimepicker").getDate();
        $(".time").data("datetimepicker").remove();
        ai();
        c.data("datetimepicker").setDate(aI);
        G.data("datetimepicker").setDate(aJ);
      }
      z();
    }
    $("#radio-countdown,#radio-date").change(function () {
      $("#switch-dt").prop("checked", $("#radio-date").prop("checked"));
      p();
    });
    $("#switch-dt").change(function () {
      var aI = $("#switch-dt").prop("checked");
      $("#radio-countdown").prop("checked", !aI);
      $("#radio-date").prop("checked", aI);
      p();
    });
    $("#btn-set-timer, #btn-edit").click(function () {
      at();
      ao.modal("show");
    });
    ao.on("show.bs.modal", function () {
      cancelFullScreen();
    });
    ao.on("hide.bs.modal", function () {
      audioC.pause();
    });
    $("#dialog-alarm")
      .on("show.bs.modal", function () {
        cancelFullScreen();
        ab = ao.hasClass("in");
        if (ab) {
          ao.modal("hide");
        }
        aB();
        am = true;
        pageTitleNotification.on("*** " + aA(false) + " ***");
      })
      .on("hide.bs.modal", function () {
        audioC.pause();
        pageTitleNotification.off();
        if (ab) {
          ao.modal("show");
        }
        setTimeout(function () {
          am = false;
        }, 200);
      });
    $("#btn-start-timer,#btn-restart-timer").click(function () {
      var aI = g.isSpecified;
      g.isSpecified = false;
      Z(true);
      j();
      if (aI) {
        g.isSpecified = true;
        location.replace("#");
        location.href = $("#link-timer").attr("href");
      }
    });
    $("#btn-reset").click(ak);
    $("#btn-resume").click(function () {
      r();
      M();
    });
    $("#btn-pause").click(an);
    $("#btn-test-timer").click(U);
    af.click(function () {
      hideTooltips();
      while (configC.timerFontSizeId > 0) {
        configC.timerFontSizeId--;
        if (aa > FONT_SIZES[configC.timerFontSizeId]) {
          break;
        }
      }
      configC.save("timerFontSizeId");
      ac();
    });
    ax.click(function () {
      hideTooltips();
      if (
        configC.timerFontSizeId < FONT_SIZE_LEN &&
        aa == FONT_SIZES[configC.timerFontSizeId]
      ) {
        configC.timerFontSizeId++;
      }
      configC.save("timerFontSizeId");
      ac();
    });
    $(document).on("keydown", function (aI) {
      if (am) {
        return;
      }
      if ($(".datetimepicker").is(":visible")) {
        if (aI.key === "Escape" || aI.key === "Esc") {
          $(".datetimepicker").data("datetimepicker").hide();
        }
        return;
      }
      if (aI.isDefaultPrevented()) {
        return;
      }
      switch (aI.key) {
        case "Escape":
        case "Esc":
          if (ao.hasClass("in")) {
            $("#btn-cancel").trigger("click", aI);
          } else {
            if (configC.themeFullScreen && !ao.hasClass("in")) {
              $("#btn-full-screen-exit").trigger("click");
            }
          }
          break;
        case "Enter":
          if (ao.hasClass("in")) {
            $("#btn-start-timer").trigger("click", aI);
          }
          break;
        case " ":
        case "Spacebar":
          if (!ao.hasClass("in") && g.isCountdown) {
            aI.preventDefault();
            if (!g.enabled) {
              r();
              M();
            } else {
              an();
            }
          }
          break;
        case "r":
        case "R":
          if (!ao.hasClass("in") && g.isCountdown) {
            aI.preventDefault();
            ak();
          }
          break;
      }
    });
    function aG() {
      if (
        !g.isHoliday &&
        !g.isCountdown &&
        g.title !== "" &&
        isPlainURIParam(g.title)
      ) {
        setShareEdit(
          encodeURIComponent(g.title).replace(/%20/g, "+") +
            "/" +
            getFormattedLocalDT(g.alarmTime, true, false) +
            "/"
        );
      } else {
        setShareEdit();
      }
    }
    $(window).bind("hashchange", function () {
      if (C == location.hash.substring(1)) {
        if (!isEmbed) {
          aG();
        }
        return;
      }
      if (R()) {
        aq();
      }
      j();
      if (!isEmbed) {
        aG();
      }
      s = false;
      ab = false;
      if (am) {
        $("#dialog-alarm").modal("hide");
      }
      if (ao.hasClass("in")) {
        ao.modal("hide");
      }
      Z(false);
      at();
      X();
    });
    if (V.data("timer-date") !== "") {
      g.isHoliday = true;
      g.isCountdown = false;
      g.title = aE.text();
      g.alarmTime = getLocalDTFromStr(V.data("timer-date"));
      g.date = g.alarmTime;
      Z(false);
      R();
      if (!isEmbed) {
        if (g.date.getMonth() === 0 && g.date.getDate() === 1) {
          e = true;
        }
        if (g.date.getMonth() === 11 && g.date.getDate() === 25) {
          e = true;
        }
      }
    } else {
      if (V.data("timer-time") !== "") {
        g.isSpecified = true;
        R();
        g.isCountdown = true;
        g.enabled = false;
        g.title = aE.text();
        var aF = V.data("timer-time");
        g.hours = parseInt(aF.substring(0, aF.length - 6), 10);
        g.minutes = parseInt(aF.substring(aF.length - 5, aF.length - 3), 10);
        g.seconds = parseInt(aF.substring(aF.length - 2, aF.length), 10);
        Z(false);
        ak();
        j(
          "countdown=" +
            aF +
            "&enabled=1&title=" +
            encodeURIComponent(g.title).replace(/%20/g, "+") +
            audioC.url()
        );
        X();
        if (!configC.buttonsVisible) {
          r();
          M();
        }
      } else {
        if (R()) {
          j();
          Z(false);
          if (!g.enabled) {
            aq();
          }
          X();
        }
      }
    }
    if (!isEmbed) {
      aG();
    }
    T.css("text-align", "").css("padding", "");
    V.show();
    $("#pnl-description,#pnl-links,#pnl-share").show();
    if (!isEmbed && !g.isHoliday) {
      audioC.set();
    }
    E();
    az();
    W(true);
    ae = true;
    ac();
    if (e) {
      aj = setTimeout(showFunnyBalls, 2000);
    }
    setTimeout(function () {
      ac();
      ai();
      at();
    }, 100);
    setTimeout(ac, 1000);
  };
  function aB() {
    d.html("");
    audioC.pause();
    audioC.play(true);
  }
  function H() {
    audioC.pause();
    audioC.play(false);
    $(".colored").css("color", "#fff");
    t.css("background-color", "#EF6262")
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
      t.css("background-color", "");
      setColors();
    }, 8000);
  }
  function u() {
    if (g.isCountdown) {
      if (g.isOnZeroStop) {
        an();
      } else {
        if (g.isOnZeroRestart) {
          ak();
        }
      }
    }
  }
  function p() {
    if ($("#radio-countdown").prop("checked")) {
      $("#group-countdown").show();
      $("#group-on-zero").show();
      $("#group-date").hide();
    } else {
      $("#group-countdown").hide();
      $("#group-on-zero").hide();
      $("#group-date").show();
    }
  }
  function at() {
    if (isEmbed) {
      return;
    }
    $("#radio-countdown").prop("checked", g.isCountdown);
    $("#radio-date").prop("checked", !g.isCountdown);
    $("#switch-dt").prop("checked", !g.isCountdown);
    $("#edt-title").val(g.isSpecified ? $("#link-timer").text() : g.title);
    $("#chk-show-message").prop("checked", g.showMessage);
    O[0].selectedIndex = g.hours;
    F[0].selectedIndex = g.minutes;
    ay[0].selectedIndex = g.seconds;
    var aF = g.date;
    if (h || g.isCountdown || g.date == null) {
      aF = new Date();
      aF.setHours(0, 0, 0, 0);
    }
    if (aw) {
      var i = getFormattedLocalDT(aF, false, false).split("T");
      c.val(i[0]);
      G.val(i.length == 1 ? "00:00" : i[1]);
    } else {
      c.data("datetimepicker").setDate(aF);
      G.data("datetimepicker").setDate(aF);
    }
    $("#radio-oz-stop").prop("checked", g.isOnZeroStop);
    $("#radio-oz-restart").prop("checked", g.isOnZeroRestart);
    $("#radio-oz-increase").prop("checked", g.isOnZeroIncrease);
    p();
  }
  function w() {
    if (isEmbed) {
      return;
    }
    g.isCountdown = $("#radio-countdown").prop("checked");
    g.title = $("#edt-title").val();
    g.showMessage = $("#chk-show-message").prop("checked");
    if (g.isCountdown) {
      g.hours = O[0].selectedIndex;
      g.minutes = F[0].selectedIndex;
      g.seconds = ay[0].selectedIndex;
      g.value = g.hours * 3600 + g.minutes * 60 + g.seconds;
      g.isOnZeroStop = $("#radio-oz-stop").prop("checked");
      g.isOnZeroRestart = $("#radio-oz-restart").prop("checked");
      g.isOnZeroIncrease = $("#radio-oz-increase").prop("checked");
    } else {
      if (aw) {
        g.date = getLocalDTFromStr(
          (c.val() != ""
            ? c.val()
            : getFormattedLocalDT(new Date(), false, false).split("T")[0]) +
            "T" +
            G.val()
        );
      } else {
        g.date = c.data("datetimepicker").getDate();
        var i = G.data("datetimepicker").getDate();
        g.date.setHours(i.getHours(), i.getMinutes(), 0, 0);
      }
    }
  }
  function N(aG) {
    var aF = [];
    var aH = "segdilncmyoparth";
    while (aG !== 5) {
      var i = aG % 35;
      aG = (aG - i) / 35;
      aF.unshift(aH[i]);
    }
    return aF.join("");
  }
  var ar = 0;
  var b = $(
    N(7847852) + "[" + N(7775356) + "=" + N(410505427363864) + "]"
  ).attr(N(335099167949));
  if (typeof b === "undefined") {
    b = "n";
  }
  for (var L = 0; L < b.length; L++) {
    var I = b.charCodeAt(L);
    ar = (ar << 4) - ar + I;
    ar = ar & ar;
  }
  if (ar === 1426996725) {
    function Z(i) {
      h = false;
      $("#btn-set-timer").hide();
      if (i) {
        w();
        r();
        M();
      } else {
        if (g.enabled) {
          M();
          var aF = new Date();
          if (g.alarmTime <= aF) {
            u();
          }
        } else {
          r();
        }
        if (!g.enabled) {
          W(true);
        }
      }
      aE.text(g.title);
      aE.show();
      k.html(aA(true));
      if (g.isCountdown) {
        k.hide();
      } else {
        k.show();
      }
      if (!g.isHoliday && g.enabled && g.alarmTime > new Date()) {
        audioC.check();
      }
      m(0);
      ac();
      al();
    }
  } else {
    function Z(i) {}
  }
  function ak() {
    if (!g.isCountdown) {
      return;
    }
    g.value = g.hours * 3600 + g.minutes * 60 + g.seconds;
    r();
    v();
    W(true);
    aq();
    al();
  }
  function M() {
    var i = true;
    if (g.isCountdown) {
      if (g.isOnZeroStop && !g.enabled && g.value <= 0) {
        ak();
        i = false;
      }
    }
    g.enabled = true;
    v();
    X();
    if (i) {
      W(true);
      ac();
      aq();
    }
    al();
    if (!g.isHoliday && g.alarmTime > new Date()) {
      audioC.check();
    }
  }
  function an() {
    g.enabled = false;
    X();
    ac();
    aq();
    al();
  }
  function al() {
    $("#btn-reset").prop(
      "disabled",
      !g.enabled && g.value === g.hours * 3600 + g.minutes * 60 + g.seconds
    );
  }
  function v() {
    var i = new Date();
    s = i < g.alarmTime || (g.isCountdown && g.isOnZeroStop);
    if (
      g.isCountdown &&
      g.hours === 0 &&
      g.minutes === 0 &&
      g.seconds <= (g.isOnZeroRestart ? 4 : 0)
    ) {
      s = false;
      if (!g.isOnZeroIncrease) {
        T.fadeOut(400, function () {
          T.fadeIn();
        });
        g.enabled = false;
      }
    }
  }
  function r() {
    if (g.isCountdown) {
      var i = new Date();
      g.alarmTime = new Date(i.getTime() + g.value * 1000);
      g.alarmTime.setSeconds(g.alarmTime.getSeconds() + 1);
    } else {
      g.alarmTime = g.date;
      g.alarmTime.setSeconds(0);
    }
    g.alarmTime.setMilliseconds(0);
  }
  function X() {
    if (g.isCountdown && configC.buttonsVisible) {
      $("#btn-reset").show();
      if (g.enabled) {
        $("#btn-resume").hide();
        $("#btn-pause").show();
      } else {
        $("#btn-resume").show();
        $("#btn-pause").hide();
      }
      if (!g.isOnZeroRestart) {
        $("#btn-restart-timer").show();
      }
    } else {
      $("#btn-reset, #btn-pause, #btn-resume,#btn-restart-timer").hide();
    }
    $("#btn-edit").toggle(!g.isHoliday && !isEmbed && configC.buttonsVisible);
    $("#group-show-buttons").toggle(g.isCountdown);
  }
  function U() {
    w();
    if (!g.showMessage) {
      if (ao.hasClass("in")) {
        ao.modal("hide");
        setTimeout(function () {
          ao.modal("show");
        }, 3000);
      }
      H();
      return;
    }
    $("#lbl-dialog-alarm-title").text(g.title);
    $("#lbl-dialog-alarm-time").html(aA(false));
    $("#dialog-alarm").modal("show");
  }
  function aA(aF) {
    if (g.isCountdown) {
      var i = g.hours;
      var aI = Math.floor(i / 24);
      i = i % 24;
      return (
        getCountDays(aI) +
        intToStrTwo(i) +
        ":" +
        intToStrTwo(g.minutes) +
        ":" +
        intToStrTwo(g.seconds)
      );
    } else {
      if (g.date.getHours() == 0 && g.date.getMinutes() == 0) {
        var aH = new Date();
        aH.setSeconds(aH.getSeconds() + 1);
        aH.setHours(0, 0, 0, 0);
        var aG = g.alarmTime;
        aG.setHours(0, 0, 0, 0);
        if (aH - aG == 0) {
          return (
            (aF ? "<b>" + langC.today + "</b>" : langC.today) +
            " - " +
            getDateText(g.date, false, false)
          );
        } else {
          return getDateText(g.date, configC.themeDigitalFont, true);
        }
      } else {
        return getDateText(g.date, false, false) + " - " + getTimeText(g.date);
      }
    }
  }
  var aC = $("#tmr-history");
  var f = false;
  var y = [];
  ad();
  z();
  function o() {
    var i = "&sound=guitar&loop=0";
    var aG = langC.isAsian ? "" : "+";
    var aF = aG + langC.minutes.toLowerCase() + i;
    y.push(
      "countdown=00:01:00&enabled=1&title=1" +
        aG +
        langC.minute.toLowerCase() +
        i,
      "countdown=00:02:00&enabled=1&title=2" + aF,
      "countdown=00:03:00&enabled=1&title=3" + aF,
      "countdown=00:05:00&enabled=1&title=5" + aF,
      "countdown=00:10:00&enabled=1&title=10" + aF,
      "countdown=00:15:00&enabled=1&title=15" + aF,
      "countdown=00:20:00&enabled=1&title=20" + aF,
      "countdown=00:30:00&enabled=1&title=30" + aF,
      "countdown=00:40:00&enabled=1&title=40" + aF,
      "countdown=01:00:00&enabled=1&title=1" + aG + langC.hour.toLowerCase() + i
    );
  }
  function K() {
    if (isEmbed || typeof localStorage === "undefined") {
      return;
    }
    var aF;
    try {
      for (aF = 0; aF < y.length; aF++) {
        localStorage.setItem("tmr" + aF, y[aF]);
      }
    } catch (aG) {
      console.log(aG);
    }
    for (aF = y.length; aF < 10; aF++) {
      localStorage.removeItem("tmr" + aF);
    }
  }
  function ad() {
    if (isEmbed) {
      return;
    }
    if (typeof localStorage === "undefined") {
      o();
      return;
    }
    var aG = localStorage.getItem("tmr0");
    if (aG === null) {
      o();
      return;
    }
    for (var aF = 0; aF < 10; aF++) {
      aG = localStorage.getItem("tmr" + aF);
      if (aG === null) {
        break;
      }
      y.push(aG);
    }
  }
  function j(aH) {
    if (isEmbed) {
      return;
    }
    if (aH === undefined) {
      aH = location.hash.substring(1);
    }
    if (aH === "") {
      return;
    }
    var aG;
    if (g.isCountdown) {
      var aF = aH.split("&");
      aG = 0;
      while (aG < aF.length) {
        var aJ = aF[aG].split("=");
        switch (aJ[0]) {
          case "enabled":
          case "seconds":
          case "date":
            aF.splice(aG, 1);
            continue;
        }
        aG++;
      }
      var aI = aF.shift();
      aF.unshift("enabled=1");
      aF.unshift(aI);
      aH = aF.join("&");
    }
    if (y.length > 0 && y[0] === aH) {
      return;
    }
    for (aG = 0; aG < y.length; aG++) {
      if (y[aG] === aH) {
        y.splice(aG, 1);
        break;
      }
    }
    y.unshift(aH);
    while (y.length > 10) {
      y.pop();
    }
    z();
    K();
  }
  function z() {
    if (aC.length == 0) {
      return;
    }
    var aN = "";
    for (var aH = 0; aH < y.length; aH++) {
      var aJ = y[aH].split("&");
      var aL = "";
      var aI = "";
      for (var aG = 0; aG < aJ.length; aG++) {
        var aF = aJ[aG].split("=");
        var aK = aF[1];
        switch (aF[0]) {
          case "countdown":
            aI = aK;
            break;
          case "date":
            if (aI == "") {
              var aM = getLocalDTFromStr(aK);
              aI = getDateText(aM, true, false);
              if (
                aM.getHours() != 0 ||
                aM.getMinutes() != 0 ||
                aM.getSeconds() != 0
              ) {
                aI += " - " + getTimeText(aM);
              }
            }
            break;
          case "title":
            aL = encodeTitle(decodeURIComponent(aK.replace(/\+/g, "%20")));
            break;
        }
      }
      if (aL == "") {
        aL = langC.timer;
      }
      aN +=
        "<tr id='history'" +
        aH +
        "><td><a href='#" +
        y[aH] +
        "' onclick='scrollToTop(200)'>" +
        aL +
        "</a></td><td>" +
        aI +
        "</td>";
      if (f) {
        aN +=
          "<td><span class='icon ci-close-circle' onclick='removeHistory(" +
          aH +
          ")'></span></td>";
      }
      aN += "</tr>";
    }
    aC.html(aN);
  }
  window.removeHistory = ap;
  function ap(i) {
    y.splice(i, 1);
    z();
    K();
  }
  $("#btn-edit-history").click(function (i) {
    f = !f;
    z();
    if (f) {
      $(i.target).removeClass("ci-edit").addClass("ci-check");
    } else {
      $(i.target).removeClass("ci-check").addClass("ci-edit");
    }
  });
  var ah = 0;
  var au = 0;
  var aa = parseInt(J.css("font-size"), 10);
  function E() {
    setDigitFontNames();
    m(0);
  }
  function az() {
    var i = configC.timerFontSizeId;
    aa = FONT_SIZES[i];
    J.css("font-size", aa + "px");
    while (i > 0 && (q() > $(window).height() || A() > t.width())) {
      i--;
      aa = FONT_SIZES[i];
      J.css("font-size", aa + "px");
    }
    m(0);
  }
  function m(i) {
    aa = aa + i;
    J.css("font-size", aa + "px");
    var aF = getSizeDT(aa);
    ah = Math.round(J.height() / 4);
    au = configC.themeDigitalFont ? Math.round(J.height() / 6) : 0;
    if (g.title != "") {
      aE.css("font-size", Math.max(aF, MIN_TITLE_FONT_SIZE) + "px");
    }
    if (!g.isCountdown) {
      k.css("font-size", Math.max(aF, MIN_DATE_FONT_SIZE) + "px");
    }
  }
  function q() {
    return (
      J.height() +
      (g.title != "" ? aE.height() + ah + au : au) +
      (!g.isCountdown ? k.height() + ah + au : au) +
      B.height() +
      ah
    );
  }
  function A() {
    return J.width() + J.height();
  }
  var n = 0;
  var P = 5;
  function ac() {
    if (!ae) {
      return;
    }
    if (isEmbed && $(window).height() == 0) {
      return;
    }
    if (aD.length == 1) {
      n = V.position().top - 15;
      aD.css("margin", n + "px");
      P = aD.height();
    }
    var aH = P + n;
    var aG =
      aH +
      n +
      (g.title != "" ? MIN_LABEL_HEIGHT * 4 : 0) +
      (configC.clockDateVisible ? MIN_LABEL_HEIGHT : 0) +
      B.height() +
      MIN_TIME_HEIGHT;
    var aP = FONT_SIZES[configC.timerFontSizeId];
    function aJ() {
      t.css(
        "height",
        Math.max(
          aG,
          $(window).height() -
            t.offset().top -
            (D.length > 0 && h
              ? Math.min(D.height(), $(window).height() / 6)
              : 0) -
            (isEmbed || l.length === 0 ? 0 : 90) -
            Math.max(MIN_BOTTOM_MARGIN, V.position().top)
        ) + "px"
      );
      if (
        isEmbed &&
        ($(window).width() < 200 || $(window).height() < t.height())
      ) {
        t.css("height", $(window).height());
        if (t.height() < 80) {
          k.hide();
          aE.text("");
        }
      }
      if (isEmbed && ($(window).width() < 400 || $(window).height() < 300)) {
        $(".digit-text")
          .removeClass("digit-text")
          .removeClass("font-digit-text");
        setDigitFontNames();
      }
    }
    function aM() {
      return t.height() - aH;
    }
    function aF() {
      return t.width();
    }
    aJ();
    if (J.html() != "") {
      var i, aI;
      var aL = aM();
      var aO = aF();
      while (aa < aP && q() < aL && A() < aO) {
        m(1);
        aJ();
      }
      while (true) {
        i = q();
        aI = A();
        if (aa <= aP && i <= aL && aI <= aO) {
          break;
        }
        m(Math.round(Math.min((aL - i) / 4, (aO - aI) / 20, -1)));
        aJ();
        if (aa < MIN_FONT_SIZE) {
          break;
        }
      }
    }
    a();
    T.css("width", J.width() + "px");
    T.css("height", J.height() + "px");
    T.css(
      "left",
      (langC.rtl ? -1 : 1) * Math.round((t.width() - J.width()) / 2) + "px"
    );
    var aK = Math.round((t.height() - T.height()) / 2);
    if (t.height() < q() + B.height() + (g.title == "" ? ah : 0)) {
      T.css(
        "top",
        n +
          (g.title != "" ? aE.height() + ah + au : au) +
          Math.round((t.height() - q()) / 2 - J.position().top) +
          "px"
      );
    } else {
      T.css("top", aK - J.position().top + "px");
    }
    aE.css("width", t.width() + "px");
    aE.css(
      "top",
      T.position().top + J.position().top - aE.height() - au + "px"
    );
    var aN = T.position().top + J.position().top + J.height() + au;
    k.css("width", t.width() + "px");
    k.css("top", aN + "px");
    B.css("width", t.width() + "px");
    B.css(
      "top",
      Math.round(
        (t.height() +
          (!g.isCountdown ? k.position().top + k.height() : aN) -
          B.height()) /
          2
      ) + "px"
    );
    if (e && $(".ball-div").length !== 0) {
      clearTimeout(aj);
      aj = setTimeout(showFunnyBalls, 200);
    }
  }
  function a() {
    var i = aa <= FONT_SIZES[0];
    var aF =
      configC.timerFontSizeId == FONT_SIZE_LEN ||
      aa < FONT_SIZES[configC.timerFontSizeId];
    if (i && aF) {
      af.hide();
      ax.hide();
    } else {
      if (i) {
        af.addClass("disabled");
      } else {
        af.removeClass("disabled");
      }
      af.show();
      if (aF) {
        ax.addClass("disabled");
      } else {
        ax.removeClass("disabled");
      }
      ax.show();
    }
  }
  var S;
  var Q = false;
  function W(i) {
    var aJ = new Date();
    if (i === true) {
      clearTimeout(S);
      x = av = -1;
      S = setTimeout(W, 200);
    } else {
      if (aJ.getMilliseconds() < 350 || aJ.getMilliseconds() > 650) {
        S = setTimeout(W, 50);
        return;
      }
      S = setTimeout(W, 1000);
      if (am && aJ - g.alarmTime > 60000) {
        d.html(getTimerBetween(g.alarmTime, aJ, true) + " " + langC.overdue);
      }
      if (!g.enabled) {
        return;
      }
    }
    if (g.enabled) {
      g.value = Math.floor((g.alarmTime - aJ) / 1000);
    }
    var aI = Math.abs(g.value);
    var aG = Math.floor(aI / 60);
    var aM = aI % 60;
    var aL = Math.floor(aG / 60);
    aG = aG % 60;
    var aN = Math.floor(aL / 24);
    aL = aL % 24;
    if (
      g.isHoliday &&
      g.alarmTime <= aJ &&
      aN === 0 &&
      g.alarmTime.getHours() === 0 &&
      g.alarmTime.getMinutes() === 0 &&
      (!e || aI < 60)
    ) {
      J.html("00:00");
    } else {
      var aO = intToStrTwo(aG) + ":" + intToStrTwo(aM);
      if (aL != 0 || aN != 0) {
        aO = intToStrTwo(aL) + ":" + aO;
      }
      var aH = aO;
      if (aN != 0) {
        var aK = aN == 1 ? dayLC : daysLC;
        aH = aN + " " + aK + " " + aO;
        if (configC.themeDigitalFont) {
          aO =
            aN +
            "<span class='" +
            (langC.isDigitalDay
              ? "font-digit-text text-rel-30'>"
              : "font-sans text-normal text-rel-40'>&nbsp;") +
            aK +
            "</span>&nbsp;" +
            aO;
        } else {
          if (aa > 80) {
            aO =
              aN +
              "<span class='text-normal text-40'>&nbsp;" +
              aK +
              "</span>&nbsp;" +
              aO;
          } else {
            aO = aN + "&nbsp;" + aK + "&nbsp;" + aO;
          }
        }
      }
      if (g.isSpecified && !g.enabled) {
        document.title = ORIGINAL_TITLE;
      } else {
        if (!h && !am && !g.isHoliday) {
          document.title =
            aH + " - " + (g.title == "" ? ORIGINAL_TITLE : g.title);
        }
      }
      var aF = g.alarmTime < aJ && !h;
      if (aF) {
        aO =
          (configC.themeDigitalFont ? String.fromCharCode(62423) : "-") +
          " " +
          aO +
          " &nbsp;";
      }
      J.html(aO);
      if (Q != aF) {
        Q = aF;
        ac();
      }
    }
    if (!g.isCountdown && av != aJ.getHours()) {
      av = aJ.getHours();
      k.html(aA(true));
      ac();
    } else {
      if (x != aL) {
        x = aL;
        ac();
      }
    }
    if (s) {
      if (g.alarmTime <= aJ) {
        g.value = 0;
      }
      if (g.value === 0) {
        s = false;
        if (!g.showMessage || isEmbed || g.isHoliday) {
          H();
        } else {
          $("#lbl-dialog-alarm-title").text(g.title);
          $("#lbl-dialog-alarm-time").html(aA(false));
          if (am) {
            aB();
          } else {
            $("#dialog-alarm").modal("show");
          }
        }
        u();
      }
    }
  }
  return { init: Y };
})();
