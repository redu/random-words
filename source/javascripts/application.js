$(document).ready(function () {
    var consumer_key = 'Qex0Dle9BDHaLFg6Me4BpRZIIn4pHiSHlbNgm2Jr';
    var config = {
      client_id: consumer_key,
      redirect_uri: "http://random-words.herokuapp.com/",
      authorization: "http://www.redu.com.br/oauth/authorize",
      presenttoken: "qs",
      isDefault : true
    }
    oajaxConfig = {
      jso_provider: "redu",
      jso_allowia: true,
      success: function(data) {
        if (callback !== undefined) {
          callback(data);
        }
        console.log("Response (redu):");
        console.log(data);
      },
      error : function(data) {
        if(errback !== undefined){
          errback(data);
        }
      }
    }
    var me;

    jso_configure({ redu : config });

    if(jso_getToken("redu") !== null) {
      $("#main").show(function(){
          $.fn.startup();
          var options = $.extend(oajaxConfig, { url : 'http://www.redu.com.br/api/me',
              success : function(data) { me = data; }
          })
          $.oajax(options);
      });
    } else {
      jso_ensureTokens({ 'redu'  : false });
    }
});

$.fn.wallPost = function(message, callback, errback) {
  var options = $.extend(oajaxConfig, {
      url: href_to('statuses', me['links']),
      type : 'post',
      data : { 'status' : { 'text' : message }},
  });

  $.oajax(options);
}

$.fn.startup = function(user) {
  $(".start").click(function () {
      $("#intro").hide();
      $("#game").show();
      init();
      $(this).blur()
  });
  var b = "10K RANDOM";
  var a = "";
  $.each(b, function (d, c) {
      r = String.fromCharCode(Math.floor(Math.random() * 6) + 65);
      a += "<span class='" + r + "'>" + c + "</span>"
  });
  $("h1:first").html(a)
}

var href_to = function(rel, links) {
  for(var i = 0; i < links.length; i++) {
    if(links[i]['rel'] === rel)
      return links[i]['href'];
  }
}

var alphabetArray = new Array();
var vowels = new Array(0, 4, 8, 14, 20);
var usedWords = new Array();
var decrement;
var score = 0;
var isawordArray = new Array("YESSSSSSSSSSSS!", "YEEEEEEEEHAW!", "HIZZZZZZZZZAH!", "HOORAHHHHHHH!", "MUY CALIENTE!", "CHICKEN DINNER!");

function init() {
  clearInterval(decrement);
  decrement = setTimeout("decrementCounter()", 1000);
  score = 0;
  for (var a = 0; a < 26; a++) {
    alphabetArray[a] = a
  }
  alphabetArray.splice(0, 1);
  alphabetArray.splice(3, 1);
  alphabetArray.splice(6, 1);
  alphabetArray.splice(11, 1);
  alphabetArray.splice(16, 1);
  alphabetArray.sort(function () {
      return 0.5 - Math.random()
  });
  vowels.sort(function () {
      return 0.5 - Math.random()
  });
  alphabetArray[1] = vowels[1];
  alphabetArray[3] = vowels[3];
  alphabetArray[5] = vowels[4];
  $(".availableLetters ul").html("");
  $(".yourWords").html("");
  $("#definitions").html("");
  for (var a = 0; a < 8; a++) {
    r = String.fromCharCode(Math.floor(Math.random() * 6) + 65);
    $(".availableLetters ul").append("<li class='" + r + "' id='" + (alphabetArray[a] + 65) + "'>" + String.fromCharCode(alphabetArray[a] + 65) + "</li>")
  }
  $("#timer").html("60")
}
$(document.documentElement).keypress(function (a) {
    if (a.keyCode == 8) {
      return false
    }
});
$(document.documentElement).keyup(function (b) {
    if (b.keyCode == 8) {
      $("#" + $(".yourLetters li:last").attr("id")).show();
      $(".yourLetters li:last").remove()
    } else {
      if (b.keyCode == 13) {
        var a = "";
        $(".yourLetters li").each(function () {
            a += $(this).html()
        });
        lookup_word(a.toLowerCase())
      } else {
        if (alphabetArray.indexOf(b.keyCode - 65) >= 0 && alphabetArray.indexOf(b.keyCode - 65) <= 8) {
          if ($(".yourLetters ." + b.keyCode).length == 0) {
            $(".yourLetters ul").append($("#" + b.keyCode).clone());
            $(".availableLetters ul #" + b.keyCode).hide()
          }
        }
      }
    }
});
var API_BASE_URL = "http://api.wordnik.com/api/";
var API_KEY = "1d05a291d0edc70cf0d010e3eca05ba6f81a960878f72771c";

function api_definitions_url(a) {
  return (API_BASE_URL + "word.json/" + encodeURIComponent(a) + "/definitions?callback=?&api_key=" + API_KEY)
}
function lookup_word(b) {
  $("#loading").show();
  var a = api_definitions_url(b);
  if (b.length < 3) {
    notaword("Words must be longer than three letters.")
  } else {
    if (usedWords.indexOf(b) != -1) {
      notaword("You already used this word!")
    } else {
      $.getJSON(a, function (c) {
          if (c.length > 0) {
            isaword(c, b)
          } else {
            notaword("Not a word!")
          }
          $("#loading").hide()
      })
    }
  }
}
function notaword(a) {
  $("#isaword").html(a);
  $("#isaword").css("color", "red");
  $("#isaword").css("display", "block");
  $("#isaword").animate({
      fontSize: "50px",
      left: "20%",
      opacity: 0.5
    }, 1000, function () {
      $("#isaword").css("display", "none");
      $("#isaword").css("opacity", 1);
      $("#isaword").css("font-size", "12px");
      $("#isaword").css("left", "50%");
      $("#isaword").css("color", "#5c3d58")
  });
  $(".availableLetters ul").children().show();
  $(".yourLetters ul").html("")
}
function isaword(a, b) {
  var c = "<ul>";
  $.each(a, function (e, d) {
      if (d.text) {
        c += "<li>" + d.text + "</li>"
      }
  });
  c += "</ul>";
  $("#definitions").html(c);
  $(".availableLetters ul").children().show();
  $(".yourLetters ul").html("");
  score += 1;
  $(".yourWords").prepend("<li><span>" + score + "</span>" + b + "</li>");
  $(".yourWords li").removeClass("first");
  $(".yourWords li:first").addClass("first");
  usedWords.push(b);
  $("#isaword").html(isawordArray[Math.floor(Math.random() * 6)]);
  $("#isaword").css("display", "block");
  $("#isaword").animate({
      fontSize: "100px",
      left: "20%",
      opacity: 0.5
    }, 1000, function () {
      $("#isaword").css("display", "none");
      $("#isaword").css("opacity", 1);
      $("#isaword").css("font-size", "12px");
      $("#isaword").css("left", "50%")
  })
}
function decrementCounter() {
  timeleft = parseInt($("#timer").html());
  $("#timer").html(timeleft - 1);
  if (timeleft > 0) {
    decrement = setTimeout("decrementCounter()", 1000)
  } else {
    endGame()
  }
}
function endGame() {
  $("#game").hide();
  $("#ending").show();
  $("#score").html(score);
  $(".share").unbind("click").show().click(function(){
      $.fn.wallPost("Acabei de fazer " + score + " pontos no jogo das palavras!");
  });

  if (score <= 4) {
    $("#ending .scoremessage").html("blame it on the letters?")
  } else {
    if (score >= 5 && score <= 9) {
      $("#ending .scoremessage").html("you're getting pretty good")
    } else {
      if (score >= 10 && score <= 15) {
        $("#ending .scoremessage").html("how'd you get so smart?")
      } else {
        $("#ending .scoremessage").html("GO HOME SMARTY PANTS")
      }
    }
  }
  $(".start").click(function () {
      $("#ending").hide();
      $("#game").show();
      init();
      $(this).blur()
  })
};
