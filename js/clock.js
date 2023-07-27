/*!
 * vClock v2.1
 * Clock
 * Copyright 2015-2019 Comfort Software Group
 * All rights reserved
 */
var vClock = (function () {
  var aa = $("#col-main");
  var v = $("#pnl-main");
  var S = $("#lbl-title");
  var h = $("#pnl-time");
  var ad = $("#lbl-time");
  var c = $("#lbl-noon");
  var a = $("#lbl-date");
  var b = $("#pnl-tools");
  var U = $("#btn-font-minus");
  var x = $("#btn-font-plus");
  var u = $("#pnl-ne0n");
  var k = false;
  var R = false;
  var d = false;
  var Q;
  var B = $("#row-clocks");
  var s = $("#edt-title");
  var n = $("#edt-country");
  var I = $("#edt-time-zone");
  var q = 0;
  if (v.data("utc") != undefined) {
    q = parseInt(v.data("utc"), 10) - Math.floor(new Date().getTime() / 1000);
  }
  var J = -1;
  var i = -1;
  var N = -1;
  var O = "";
  var o = false;
  var l = false;
  var f = "";
  function j() {
    if (isEmbed) {
      return;
    }
    f = "";
    if (f != location.hash.substring(1)) {
      location.replace("#" + f);
    }
  }
  function P() {
    f = location.hash.substring(1);
    if (f == "") {
      return false;
    }
    var ae = f.split("&");
    for (var af = 0; af < ae.length; af++) {
      var ag = ae[af].split("=");
      processURIParam(ag[0], ag[1]);
    }
    return true;
  }
  var Y = function () {
    $("noscript").remove();
    configC.restoreClock();
    if (!configC.clock12hour) {
      c.hide();
    }
    if (!configC.clockDateVisible) {
      a.hide();
    }
    if (langC.rtlTime) {
      c.insertBefore(ad);
    }
    $(window).resize(z);
    window.refreshSettings = ae;
    function ae() {
      c.toggle(configC.clock12hour);
      a.toggle(configC.clockDateVisible);
      if (!o) {
        return;
      }
      y();
      F(true);
    }
    U.click(function () {
      hideTooltips();
      while (configC.clockFontSizeId > 0) {
        configC.clockFontSizeId--;
        if (T > FONT_SIZES[configC.clockFontSizeId]) {
          break;
        }
      }
      configC.save("clockFontSizeId");
      z();
    });
    x.click(function () {
      hideTooltips();
      if (
        configC.clockFontSizeId < FONT_SIZE_LEN &&
        T == FONT_SIZES[configC.clockFontSizeId]
      ) {
        configC.clockFontSizeId++;
      }
      configC.save("clockFontSizeId");
      z();
    });
    $(document).on("keydown", function (af) {
      if (
        configC.themeFullScreen &&
        !R &&
        (af.key === "Escape" || af.key === "Esc")
      ) {
        $("#btn-full-screen-exit").trigger("click");
      }
      if (R && af.key === "Enter") {
        $("#btn-ok").trigger("click", af);
      }
    });
    $(window).bind("hashchange", function () {
      if (!isEmbed) {
        setShareEdit();
      }
      if (f == location.hash.substring(1)) {
        return;
      }
      if (P()) {
        j();
      }
    });
    if (P()) {
      j();
    }
    V();
    if (!isEmbed) {
      setShareEdit();
    }
    $("#pnl-time").css("text-align", "");
    aa.show();
    y();
    F(true);
    w();
    o = true;
    z();
    setTimeout(z, 100);
    setTimeout(z, 1000);
    setInterval(function () {
      if (R) {
        return;
      }
      if ($("#form-embed").css("display") === "block") {
        return;
      }
      if ($(".dropdown.open").length) {
        return;
      }
      window.location.reload(true);
    }, 28800000);
    setTimeout(function () {
      l = true;
    }, 5000);
  };
  function M() {
    var ae = "";
    $(".clock-body").each(function () {
      var ag = $(this).data("country");
      var ah = $(this).data("tz");
      var af = $(this).parent().find(".title").text();
      if (af != D(ag, ah, true)) {
        ae += "title=" + af + "\n";
      }
      ae += ag + "=" + ah + "\n";
    });
    configC.clockPanels = ae;
    configC.save("clockPanels");
  }
  function V() {
    var am;
    O = v.data("langtz").toLowerCase();
    if (O == "") {
      S.css("display", "block");
      if (configC.clockPanels == "") {
        if (typeof arrWorldclock !== "undefined") {
          for (am = 0; am < arrWorldclock.length; am++) {
            if (arrWorldclock[am][3]) {
              g(
                H(arrWorldclock[am][0], arrWorldclock[am][1]),
                arrWorldclock[am][1],
                arrWorldclock[am][2]
              );
            }
          }
        }
      } else {
        var af = configC.clockPanels.split("\n");
        var ar = "";
        for (am = 0; am < af.length; am++) {
          var at = af[am];
          if (at.substr(0, 6) == "title=") {
            ar = at.substr(6);
          } else {
            if (at.charAt(2) == "=") {
              var an = at.substr(0, 2);
              var ae = at.substr(3);
              g(ar == "" ? D(an, ae, true) : ar, an, ae);
              ar = "";
            }
          }
        }
      }
      $("#pnl-add-clock").show();
    } else {
      var aq = false;
      if (typeof arrWorldclock !== "undefined") {
        for (am = 0; am < arrWorldclock.length; am++) {
          if (A(arrWorldclock[am][0], arrWorldclock[am][1]) == O) {
            O = arrWorldclock[am][2];
            if (S.text() == "") {
              S.text(H(arrWorldclock[am][0], arrWorldclock[am][1]));
            }
            aq = true;
            break;
          }
        }
      }
      if (!aq && O.charAt(O.length - 3) == "_") {
        var ag = O.slice(-2).toUpperCase();
        var ao = tzCountries[ag];
        if (ao != undefined) {
          var ah = ao.zones;
          var aj = O.substr(0, O.length - 3);
          for (am = 0; am < ah.length; am++) {
            var ap = ah[am].split("/");
            if (ap[ap.length - 1].toLowerCase() == aj) {
              O = ah[am];
              var al = G(ag);
              if (v.data("title") == "") {
                S.text(
                  ap[ap.length - 1].replace(/_/g, " ") +
                    (al != "" ? langC.commaSign + al : "")
                );
              }
              aq = true;
              break;
            }
          }
        }
      }
      if (!aq) {
        O = v.data("tz");
      }
      if (O != "") {
        var ak = moment.tz.zone(O).parse(moment().clone().tz("UTC"));
        var ai = "(UTC/GMT " + (ak <= 0 ? "+" : "-");
        ak = Math.abs(ak);
        $("#lbl-tz-name").html(
          ai +
            intToStrTwo(Math.floor(ak / 60)) +
            ":" +
            intToStrTwo(ak % 60) +
            ") " +
            O
        );
      }
      S.css("display", "block");
    }
    $("td:nth-child(2)", ".table-lr").remove();
    $("#pnl-description,#pnl-share,#pnl-help").show();
  }
  var ab = false;
  function L() {
    if (ab) {
      return;
    }
    ab = true;
    var af = "";
    if (typeof arrTZCountries !== "undefined") {
      for (var ae = 0; ae < arrTZCountries.length; ae++) {
        af +=
          '<option value="' +
          arrTZCountries[ae][0] +
          '">' +
          arrTZCountries[ae][1] +
          "</option>";
      }
      af += '<option value="" disabled="disabled">─────────</option>';
    }
    $.each(tzCountries, function (ag, ah) {
      af += "<option value='" + ag + "'>" + ah.name + "</option>";
    });
    n.html(af);
    if (tzCountries[langC.id.toUpperCase()] !== undefined) {
      n.val(langC.id.toUpperCase());
    }
  }
  function G(af) {
    if (typeof arrTZCountries === "undefined") {
      return "";
    }
    for (var ae = 0; ae < arrTZCountries.length; ae++) {
      if (arrTZCountries[ae][0] == af) {
        return arrTZCountries[ae][1];
      }
    }
    return "";
  }
  function H(af, ae) {
    return (
      af +
      ((langC.id != "en" || ae != "US") && langC.id.toUpperCase() != ae
        ? langC.commaSign + G(ae)
        : "")
    );
  }
  function A(af, ae) {
    return (af + (langC.id.toUpperCase() != ae ? "-" + G(ae) : ""))
      .replace(/,/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  }
  function D(ah, aj, ai) {
    var af = "";
    if (typeof arrWorldclock !== "undefined") {
      for (var ag = 0; ag < arrWorldclock.length; ag++) {
        if (arrWorldclock[ag][1] == ah && arrWorldclock[ag][2] == aj) {
          af = ai
            ? H(arrWorldclock[ag][0], arrWorldclock[ag][1])
            : arrWorldclock[ag][0];
          break;
        }
      }
    }
    if (af == "") {
      var ae = aj.split("/");
      af = ae[ae.length - 1].replace(/_/g, " ");
    }
    return af;
  }
  function p(ak, aj, al) {
    var ag = "";
    var ah = D(aj, al, true);
    if (typeof arrWorldclock !== "undefined") {
      for (var af = 0; af < arrWorldclock.length; af++) {
        if (arrWorldclock[af][1] == aj && arrWorldclock[af][2] == al) {
          var ai = H(arrWorldclock[af][0], arrWorldclock[af][1]);
          if (ai == ak) {
            ag = A(arrWorldclock[af][0], arrWorldclock[af][1]) + "/";
            ah = ai;
            break;
          }
        }
      }
    }
    if (ag == "") {
      var ae = al.split("/");
      ag = ae[ae.length - 1] + "_" + aj + "/";
    }
    if (ah != ak) {
      if (isPlainURIParam(ak)) {
        ag += ak.replace(/ /g, "+") + "/";
      } else {
        ag += "?title=" + encodeURIComponent(ak).replace(/%20/g, "+");
      }
    }
    return ag;
  }
  n.change(function () {
    var al = moment().clone().tz("UTC");
    var ak = n.val();
    var af = tzCountries[ak].zones;
    var ae, aj, ai;
    var ah = "";
    for (var ag = 0; ag < af.length; ag++) {
      ae = af[ag];
      aj = moment.tz.zone(ae).parse(al);
      ai = "(UTC " + (aj <= 0 ? "+" : "-");
      aj = Math.abs(aj);
      ai +=
        intToStrTwo(Math.floor(aj / 60)) + ":" + intToStrTwo(aj % 60) + ") ";
      ah += "<option value='" + ae + "'>" + ai + D(ak, ae, false) + "</option>";
    }
    I.html(ah);
    I.change();
  });
  I.change(function () {
    s.val(D(n.val(), I.val(), true));
  });
  function K(ae) {
    Q = ae.parent().parent().parent().parent().parent().parent();
  }
  function g(ag, af, ah) {
    var ae = $(
      '<div class="col-sm-4 col-md-3"><div class="panel panel-default panel-heading-fullwidth">      <div class="panel-heading colored">' +
        $("#pnl-clock-tools").html() +
        '<a href="#" class="colored ext-link"><span class="title text-ellipsis">' +
        encodeTitle(ag) +
        '</span></a>      </div>      <div class="panel-body clock-body" data-country="' +
        af +
        '" data-tz="' +
        ah +
        '">      <div class="colored digit text-nowrap text-center" style="font-size: 30px"></div><div class="colored text-center" style="font-size: 16px"></div>      </div></div></div>'
    );
    ae.find(".ext-link").attr("href", p(ag, af, ah));
    ae.insertBefore("#col-add-clock");
    Q = ae.children().first();
    setColors();
    $(".pm-edit")
      .off("click")
      .click(function () {
        if (R) {
          return;
        }
        K($(this));
        $("#lbl-add-clock").hide();
        $("#lbl-edit-clock").show();
        d = false;
        L();
        n.val(Q.find(".clock-body").data("country"));
        n.change();
        I.val(Q.find(".clock-body").data("tz"));
        s.val(Q.find(".title").text());
        $("#form-edit").modal("show");
      });
    $(".pm-move-top")
      .off("click")
      .click(function () {
        K($(this));
        setSelectedColor(Q);
        if ($("html, body").scrollTop() - (v.height() + 30) > 0) {
          $("html, body").animate({ scrollTop: v.height() + 30 }, "fast");
        }
        setTimeout(function () {
          var ai = Q.parent();
          ai.insertBefore(ai.siblings().first());
          setTimeout(function () {
            setDefaultColor(Q);
          }, 400);
          M();
        }, 100);
      });
    $(".pm-move-up")
      .off("click")
      .click(function () {
        K($(this));
        setSelectedColor(Q);
        setTimeout(function () {
          var ai = Q.parent();
          ai.insertBefore(ai.prev());
          setTimeout(function () {
            setDefaultColor(Q);
          }, 400);
          M();
        }, 100);
      });
    $(".pm-move-down")
      .off("click")
      .click(function () {
        K($(this));
        setSelectedColor(Q);
        setTimeout(function () {
          var ai = Q.parent();
          ai.insertAfter(ai.next());
          setTimeout(function () {
            setDefaultColor(Q);
          }, 400);
          M();
        }, 100);
      });
    $(".pm-delete")
      .off("click")
      .click(function () {
        K($(this));
        Q.css("background-color", "#FF8585");
        Q.find(".colored").css("color", "#fff");
        Q.parent().fadeOut(400, function () {
          $(this).remove();
          setTimeout(z, 0);
          M();
        });
      });
  }
  $("#btn-add-clock").click(function () {
    if (R) {
      return;
    }
    Q = undefined;
    $("#lbl-add-clock").show();
    $("#lbl-edit-clock").hide();
    d = true;
    L();
    n.change();
    $("#form-edit").modal("show");
  });
  $("#btn-ok").click(function () {
    var af = s.val();
    var ae = n.val();
    var ag = I.val();
    if (af.trim() == "") {
      af = D(ae, ag, true);
    }
    if (d) {
      g(af, ae, ag);
      setDigitFontNames();
      fadeHighlight(Q, 400);
    } else {
      Q.find(".title").text(af);
      Q.find(".clock-body").data("country", ae);
      Q.find(".clock-body").data("tz", ag);
      Q.find(".ext-link").attr("href", p(af, ae, ag));
    }
    M();
    k = true;
    F(true);
  });
  $("#form-edit")
    .on("show.bs.modal", function () {
      cancelFullScreen();
      R = true;
      setSelectedColor(Q);
    })
    .on("hide.bs.modal", function () {
      setTimeout(function () {
        R = false;
      }, 100);
      if (!d) {
        setDefaultColor(Q);
      }
    });
  var C = 0;
  var Z = 0;
  var T = parseInt(ad.css("font-size"), 10);
  function y() {
    setDigitFontNames();
    X(0);
  }
  function w() {
    var ae = configC.clockFontSizeId;
    T = FONT_SIZES[ae];
    ad.css("font-size", T + "px");
    while (ae > 0 && (ac() > $(window).height() || e() > v.width())) {
      ae--;
      T = FONT_SIZES[ae];
      ad.css("font-size", T + "px");
    }
    X(0);
  }
  function X(ae) {
    T = T + ae;
    ad.css("font-size", T + "px");
    var af = getSizeDT(T);
    c.css(
      "font-size",
      Math.round(T / (configC.themeDigitalFont && langC.am == "AM" ? 1.3 : 3)) +
        "px"
    );
    C = Math.round(ad.height() / 4);
    Z = configC.themeDigitalFont ? Math.round(ad.height() / 6) : 0;
    if (S.text() != "") {
      S.css("font-size", Math.max(af, MIN_TITLE_FONT_SIZE) + "px");
    }
    if (configC.clockDateVisible) {
      a.css("font-size", Math.max(af, MIN_DATE_FONT_SIZE) + "px");
    }
  }
  function ac() {
    return (
      ad.height() +
      (S.text() != "" ? S.height() + C + Z : Z) +
      (configC.clockDateVisible ? a.height() + C + Z : Z) +
      C
    );
  }
  function e() {
    return ad.width() + (configC.clock12hour ? c.width() * 4 : ad.height());
  }
  var r = 0;
  var m = 5;
  function z() {
    if (!o) {
      return;
    }
    if (isEmbed && $(window).height() == 0) {
      return;
    }
    if (b.length == 1) {
      r = aa.position().top - 15;
      b.css("margin", r + "px");
      m = b.height();
    }
    var ah = m + r;
    var ag =
      ah +
      r +
      (S.text() != "" ? MIN_LABEL_HEIGHT : 0) +
      (configC.clockDateVisible ? MIN_LABEL_HEIGHT : 0) +
      MIN_TIME_HEIGHT;
    var ap = FONT_SIZES[configC.clockFontSizeId];
    function aj() {
      if (B.children().length > 1) {
        $("#pnl-add-clock").css(
          "height",
          B.find(".panel-default").first().height() + "px"
        );
        $("#pnl-add-clock-center").css("height", "20%");
      } else {
        $("#pnl-add-clock").css(
          "height",
          $("#btn-add-clock").height() * 4 + "px"
        );
        $("#pnl-add-clock-center").css("height", "45%");
      }
      v.css(
        "height",
        Math.max(
          ag,
          $(window).height() -
            v.offset().top -
            B.children().first().height() -
            (isEmbed || u.length === 0 ? 0 : 90) -
            Math.max(MIN_BOTTOM_MARGIN, aa.position().top)
        ) + "px"
      );
      if (
        isEmbed &&
        ($(window).width() < 200 || $(window).height() < v.height())
      ) {
        v.css("height", $(window).height());
        if (v.height() < 80) {
          configC.clockDateVisible = false;
          a.hide();
          S.text("");
        }
      }
      if (isEmbed && ($(window).width() < 400 || $(window).height() < 300)) {
        $(".digit-text")
          .removeClass("digit-text")
          .removeClass("font-digit-text");
        setDigitFontNames();
      }
    }
    function am() {
      return v.height() - ah;
    }
    function af() {
      return v.width();
    }
    aj();
    if (ad.html() != "") {
      var ae, ai;
      var al = am();
      var ao = af();
      while (T < ap && ac() < al && e() < ao) {
        X(1);
      }
      while (true) {
        ae = ac();
        ai = e();
        if (T <= ap && ae <= al && ai <= ao) {
          break;
        }
        X(Math.round(Math.min((al - ae) / 4, (ao - ai) / 20, -1)));
        if (T < MIN_FONT_SIZE) {
          break;
        }
      }
    }
    W();
    h.css("width", ad.width() + c.width() + "px");
    h.css("height", ad.height() + "px");
    h.css(
      "left",
      (langC.rtl ? -1 : 1) * Math.round((v.width() - ad.width()) / 2) -
        (langC.rtlTime && configC.clock12hour ? c.width() : 0) +
        "px"
    );
    var ak = Math.round((v.height() - h.height()) / 2);
    if (v.height() < ac() + (S.text() == "" ? C : 0)) {
      h.css(
        "top",
        r +
          (S.text() != "" ? S.height() + C + Z : Z) +
          Math.round((v.height() - ac()) / 2 - ad.position().top) +
          "px"
      );
    } else {
      h.css("top", ak - ad.position().top + "px");
    }
    S.css("width", v.width() + "px");
    S.css("top", h.position().top + ad.position().top - S.height() - Z + "px");
    var an = h.position().top + ad.position().top + ad.height() + Z;
    a.css("width", v.width() + "px");
    a.css("top", an + "px");
  }
  function W() {
    var ae = T <= FONT_SIZES[0];
    var af =
      configC.clockFontSizeId == FONT_SIZE_LEN ||
      T < FONT_SIZES[configC.clockFontSizeId];
    if (ae && af) {
      U.hide();
      x.hide();
    } else {
      if (ae) {
        U.addClass("disabled");
      } else {
        U.removeClass("disabled");
      }
      U.show();
      if (af) {
        x.addClass("disabled");
      } else {
        x.removeClass("disabled");
      }
      x.show();
    }
  }
  var E;
  function F(aj) {
    var ai = moment();
    if (aj === true) {
      clearTimeout(E);
      J = i = -1;
      E = setTimeout(F, 200);
    } else {
      if (ai.milliseconds() < 350 || ai.milliseconds() > 650) {
        E = setTimeout(F, 50);
        return;
      }
      E = setTimeout(F, 1000);
    }
    if (q !== 0) {
      ai.add(q, "seconds");
    }
    if (O !== "") {
      ai = ai.tz(O);
    }
    var ae = ai.hours();
    var ah = ai.minutes();
    var ak = ai.seconds();
    var ag = "";
    if (configC.clock12hour) {
      ag = ae < 12 ? langC.am : langC.pm;
      if (langC.rtlTime) {
        c.html(ag + "&nbsp;");
      } else {
        c.html("&nbsp;" + ag);
      }
      ae = ae % 12;
      if (ae === 0) {
        ae = 12;
      }
    }
    var af = intToStrHours(ae) + ":" + intToStrTwo(ah) + ":" + intToStrTwo(ak);
    ad.html(af);
    if (l) {
      document.title =
        (langC.rtlTime ? ag + " " + af : af + " " + ag) + " - " + S.text();
    }
    if (i !== ae) {
      i = ae;
      z();
    }
    if (N !== ah) {
      k = true;
      N = ah;
    }
    $(".clock-body").each(function (ao, ap) {
      var aq = ai.clone().tz($(ap).data("tz"));
      var am = aq.hours();
      if (configC.clock12hour) {
        var an = am < 12 ? langC.am : langC.pm;
        if (langC.rtlTime) {
          an += "&nbsp;";
        } else {
          an = "&nbsp;" + an;
        }
        if (!configC.themeDigitalFont || langC.am !== "AM") {
          an =
            "<span style='font-size: 18px;" +
            (configC.themeDigitalFont
              ? " position: relative; top: -2px;"
              : "") +
            "'>" +
            an +
            "</span>";
        }
        am = am % 12;
        if (am === 0) {
          am = 12;
        }
      }
      var al =
        intToStrHours(am) +
        ":" +
        intToStrTwo(aq.minutes()) +
        ":" +
        intToStrTwo(aq.seconds());
      if (configC.clock12hour) {
        if (langC.rtlTime) {
          al = an + al;
        } else {
          al += an;
        }
      }
      $(ap).children().first().html(al);
      if (k) {
        $(ap).children().last().html(t(ai, aq));
      }
    });
    if (k) {
      $("#lbl-offset").html(t(moment(), ai));
    }
    k = false;
    if (ai.date() != J) {
      J = ai.date();
      a.html(
        getDateTextByParts(
          ai.day(),
          ai.date(),
          ai.month(),
          ai.year(),
          configC.themeDigitalFont && langC.isDigitalLabel,
          true
        )
      );
    }
  }
  function t(ai, ah) {
    var ag = ah.utcOffset() - ai.utcOffset();
    var ae = ag >= 0 ? "+" : "-";
    ag = Math.abs(ag);
    var af = ag % 60;
    ae +=
      Math.floor(ag / 60) +
      (af != 0
        ? ":" + intToStrTwo(ag % 60)
        : langC.isAsian
        ? langC.hour
        : " " + langC.hour[0]);
    return (
      (ai.dayOfYear() == ah.dayOfYear()
        ? langC.today
        : ah.year() < ai.year() || ah.dayOfYear() < ai.dayOfYear()
        ? langC.yesterday
        : langC.tomorrow) +
      langC.commaSign +
      ae
    );
  }
  return { init: Y };
})();
