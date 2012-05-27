var goto, setCarousel, setItems, setNew;

window.animation_dura = 500;

goto = function(node_id) {
  return $.ajax({
    url: '/context?node_id=' + node_id
  }).done(function(data) {
    setItems(data);
    setCarousel();
    return setNew();
  });
};

setCarousel = function() {
  return $('.carousel').carousel({
    interval: false,
    cycle: false
  });
};

setNew = function() {
  var _this = this;
  return $('#new').click(function() {
    var caro_caption, caro_index;
    $('#new ~ li').fadeOut(window.animation_dura, function() {
      return $('#new ~ li').remove();
    });
    caro_index = $('#myCarousel .active').index('#myCarousel .item') + 1;
    caro_caption = $("#myCarousel .carousel-inner .item:nth-child(" + caro_index + ") h4").text();
    $("<li class='span1'><div class='thumbnail'><img src='http://placehold.it/100/fb5c5c/fff&text=" + caro_caption + "'></li>").hide().appendTo('#ancestors .thumbnails').fadeIn(window.animation_dura);
    $('#myCarousel a').fadeOut(window.animation_dura);
    $('#myCarousel .carousel-inner').fadeOut(window.animation_dura);
    return $('#myCarousel .carousel-inner').html("<div class='item active adding'><img src='http://placehold.it/500/aaa/fff&text=drop+pic+here'><div class='carousel-caption'><h4>Your title</h4><p>Your description</p></div></div>").fadeIn(window.animation_dura);
  });
};

setItems = function(data) {
  var node_context,
    _this = this;
  node_context = JSON.parse(data);
  if (node_context.siblings.length === 0) {
    $('#myCarousel a').fadeOut(2 * window.animation_dura);
  } else {
    $('#myCarousel a').fadeIn(2 * window.animation_dura);
  }
  $('#myCarousel .carousel-inner').fadeOut(window.animation_dura, function() {
    var sib, _i, _len, _ref;
    $('#myCarousel .carousel-inner').html("<div class='item active'><img src='http://placehold.it/500/fb5c5c/fff&text=" + node_context.self.title + "'><div class='carousel-caption'><h4>" + node_context.self.title + "</h4><p>" + node_context.self.description + "</p></div></div>");
    _ref = node_context.siblings;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sib = _ref[_i];
      $('#myCarousel .carousel-inner').append("<div class='item'><img src='http://placehold.it/500/fb5c5c/fff&text=" + sib.title + "'><div class='carousel-caption'><h4>" + sib.title + "</h4><p>" + sib.description + "</p></div></div>");
    }
    return $('#myCarousel .carousel-inner').fadeIn(window.animation_dura);
  });
  $('#ancestors ul').html('').fadeOut(window.animation_dura, function() {
    var anc, _i, _len, _ref;
    _ref = node_context.ancestors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      anc = _ref[_i];
      $("<li class='span1'><div class='thumbnail'><img src='http://placehold.it/100/fb5c5c/fff&text=" + anc.title + "'></div></li>").bind('click', (function() {
        var tmp;
        tmp = anc.node_id;
        return function() {
          return goto(tmp);
        };
      })()).appendTo('#ancestors ul');
    }
    return $('#ancestors ul').fadeIn(window.animation_dura);
  });
  return $('#children ul').html("<li id='new' class='span1'><div class='thumbnail'><img src='http://placehold.it/100/aaa/fff&text=new'></div></li>").fadeOut(window.animation_dura, function() {
    var child, _i, _len, _ref;
    _ref = node_context.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      $("<li class='span1'><div class='thumbnail'><img src='http://placehold.it/100/fb5c5c/fff&text=" + child.title + "'></div></li>").bind('click', (function() {
        var tmp;
        tmp = child.node_id;
        return function() {
          return goto(tmp);
        };
      })()).appendTo('#children ul');
    }
    return $('#children ul').fadeIn(window.animation_dura);
  });
};

$(function() {
  return goto(1);
});
