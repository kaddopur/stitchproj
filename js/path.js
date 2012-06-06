var render;

render = function(id) {
  $('#story').html('');
  return $.ajax({
    url: '/context?node_id=' + id
  }).done(function(data) {
    var a, context, _i, _len, _ref;
    context = JSON.parse(data);
    _ref = context.ancestors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      $('#story').append("<div class='span3'><h2>" + a.title + "</h2><div class='thumbnail'><img src=" + a.graph_uri + "></div></div>");
    }
    $('#story').append("<div class='span3'><h2>" + context.self.title + "</h2><div class='thumbnail'><img src=" + context.self.graph_uri + "></div></div>");
    return $('#fb').prepend("<a name='fb_share' type='button' share_url='" + window.location + "'</a><script src='http://static.ak.fbcdn.net/connect.php/js/FB.Share' type='text/javascript'></script>");
  });
};

$(function() {
  return render(/(\d+)$/.exec(window.location)[0]);
});
