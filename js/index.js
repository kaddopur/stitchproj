var goto, setCarousel, setChildren, setItems, setNew;

window.animation_dura = 500;

window.carousel_length = 0;

window.carousel_members = [];

goto = function(node_id) {
  return $.ajax({
    url: '/context?node_id=' + node_id
  }).done(function(data) {
    setItems(data);
    return setNew(data);
  });
};

setCarousel = function() {
  return $('#myCarousel').carousel({
    interval: false
  }).bind('slide', function() {
    return $('#children ul').fadeOut(window.animation_dura);
  }).bind('slid', function() {
    var caro_index;
    setChildren($('#myCarousel .active').index('#myCarousel .item'));
    caro_index = $('#myCarousel .active').index('#myCarousel .item') + 1;
    switch (caro_index) {
      case 1:
        return $('.carousel-control.left').hide();
      case window.carousel_length:
        return $('.carousel-control.right').hide();
      default:
        $('.carousel-control.left').fadeIn(window.animation_dura);
        return $('.carousel-control.right').fadeIn(window.animation_dura);
    }
  });
};

setChildren = function(index) {
  return $.ajax({
    url: '/context?node_id=' + window.carousel_members[index]
  }).done(function(data) {
    var child, node_context, _i, _len, _ref,
      _this = this;
    node_context = JSON.parse(data);
    $('#children ul').html("<li id='new' class='span1'><div class='thumbnail'><img src='http://placehold.it/100/aaa/fff&text=new'></div></li>");
    _ref = node_context.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      $("<li class='span1'><div class='thumbnail'><img src='" + child.graph_uri + "'></div></li>").bind('click', (function() {
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

setNew = function(data) {
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
  window.carousel_length = node_context.siblings.length + 1;
  $('.carousel-control.left').hide();
  $('.carousel-control.right').hide();
  $('#myCarousel .carousel-inner').fadeOut(window.animation_dura, function() {
    var sib, _i, _len, _ref;
    $('#myCarousel .carousel-inner').html("<div class='item active'><img src='" + node_context.self.graph_uri + "'><div class='carousel-caption'><h4>" + node_context.self.title + "</h4><p>" + node_context.self.description + "</p></div></div>");
    window.carousel_members = [node_context.self.node_id];
    _ref = node_context.siblings;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sib = _ref[_i];
      $('#myCarousel .carousel-inner').append("<div class='item'><img src='" + sib.graph_uri + "'><div class='carousel-caption'><h4>" + sib.title + "</h4><p>" + sib.description + "</p></div></div>");
      window.carousel_members.push(sib.node_id);
    }
    console.log(window.carousel_members);
    $('#myCarousel .carousel-inner').fadeIn(window.animation_dura);
    if (sib) return $('.carousel-control.right').fadeIn(window.animation_dura);
  });
  $('#ancestors ul').html('').fadeOut(window.animation_dura, function() {
    var anc, _i, _len, _ref;
    _ref = node_context.ancestors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      anc = _ref[_i];
      $("<li class='span1'><div class='thumbnail'><img src='" + anc.graph_uri + "'></div></li>").bind('click', (function() {
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
      $("<li class='span1'><div class='thumbnail'><img src='" + child.graph_uri + "'></div></li>").appendTo('#children ul').bind('click', (function() {
        var tmp;
        tmp = child.node_id;
        return function() {
          return goto(tmp);
        };
      })());
    }
    return $('#children ul').fadeIn(window.animation_dura);
  });
};

$(function() {
  setCarousel();
  return goto(1);
});
