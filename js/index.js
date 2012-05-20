var setCarousel, setNew;

window.animation_dura = 500;

setCarousel = function() {
  $('.carousel').carousel({
    interval: false,
    cycle: false
  });
  if ($('#myCarousel .item').length === 1) return $('#myCarousel a').hide();
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

$(function() {
  setCarousel();
  return setNew();
});
