$(document).ready(function(){
    var consumer_key = 'consumer_key';
    var config = {
      client_id: consumer_key,
      redirect_uri: "http://random-words.herokuapp.com/auth.html",
      authorization: "http://redu.com/oauth/authorize",
      presenttoken: "qs",
      isDefault : true
    }

    jso_configure({ redu : config });
    var token = jso_getToken("redu")

    $.oajax({
        url : 'http://www.redu.com.br/api/me',
        jso_provider: "redu",
        jso_allowia: true,
        success: function(data) {
          var $pre = $("<pre/>").text(JSON.stringify(data, null, '\t'));
          $("body").append($pre);
        },
        error : function(data) {
          console.log("Error (redu):")
          console.log(data);
        }
    });
});
