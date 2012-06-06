var goto, setCarousel, setChildren, setItems, setNew;

window.animation_dura = 500;

window.carousel_length = 0;

window.carousel_members = [];

goto = function(node_id) {
  return $.ajax({
    url: '/context?node_id=' + node_id
  }).done(function(data) {
    $('#myModal form>input').val(node_id);
    console.log($('#myModal form>input'));
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
    console.log(window.carousel_length);
    console.log(caro_index);
    if (window.carousel_length === 1) return;
    switch (caro_index) {
      case 1:
        $('.carousel-control.left').hide();
        return $('.carousel-control.right').fadeIn(window.animation_dura);
      case window.carousel_length:
        $('.carousel-control.left').fadeIn(window.animation_dura);
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
    $('#myModal form>input').val(window.carousel_members[index]);
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
    return $('#myModal').modal('show');
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
  var option;
  setCarousel();
  option = {
    dataType: 'json',
    success: function(data) {
      goto(data.self.node_id);
      return $('#myModal').modal('hide');
    }
  };
  $('#myModal form').ajaxForm(option);
  $('#myModal').on('show', function() {
    $('fieldset .control-group').removeClass('error');
    $('fieldset .control-group input').val('');
    return $('fieldset .control-group span').html('');
  });
  $('a#close').click(function() {
    return $('#myModal').modal('hide');
  });
  $('a#add').click(function() {
    var flag;
    flag = true;
    if ($('fieldset .control-group:nth-child(1) input').val() === '') {
      flag = false;
      $('fieldset .control-group:nth-child(1)').addClass('error');
      $('fieldset .control-group:nth-child(1) span').html('Please fill in.');
    }
    if ($('fieldset .control-group:nth-child(3) input').val() === '') {
      flag = false;
      $('fieldset .control-group:nth-child(3)').addClass('error');
      $('fieldset .control-group:nth-child(3) span').html('Please choose the image.');
    }
    if (flag) return $('#myModal form').submit();
  });
  console.log(/(\d+)$/.exec(window.location)[0]);
  return goto(/(\d+)$/.exec(window.location)[0]);
});
