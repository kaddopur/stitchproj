window.animation_dura = 500

goto = (node_id) ->
  $.ajax({
    url: '/context?node_id=' + node_id
  }).done((data)->
    setItems(data)
    setCarousel()
    setNew()
  )


setCarousel = ->
  $('.carousel').carousel {
    interval: false,
    cycle: false,
  }


setNew = ->
  $('#new').click =>
    $('#new ~ li').fadeOut(window.animation_dura, =>
      $('#new ~ li').remove()
    )
    caro_index = $('#myCarousel .active').index('#myCarousel .item') + 1
    caro_caption = $("#myCarousel .carousel-inner .item:nth-child(#{caro_index}) h4").text()

    $("<li class='span1'><div class='thumbnail'><img src='http://placehold.it/100/fb5c5c/fff&text=#{caro_caption}'></li>").hide().appendTo('#ancestors .thumbnails').fadeIn(window.animation_dura)

    $('#myCarousel a').fadeOut(window.animation_dura)
    $('#myCarousel .carousel-inner').fadeOut(window.animation_dura)
    $('#myCarousel .carousel-inner').html("<div class='item active adding'><img src='http://placehold.it/500/aaa/fff&text=drop+pic+here'><div class='carousel-caption'><h4>Your title</h4><p>Your description</p></div></div>").fadeIn(window.animation_dura)


setItems = (data) ->
  node_context = JSON.parse(data)
  if node_context.siblings.length == 0 then $('#myCarousel a').fadeOut(2*window.animation_dura) else $('#myCarousel a').fadeIn(2*window.animation_dura)

  # self & siblings
  $('#myCarousel .carousel-inner').fadeOut(window.animation_dura, =>
    $('#myCarousel .carousel-inner').html("<div class='item active'><img src='http://placehold.it/500/fb5c5c/fff&text=#{node_context.self.title}'><div class='carousel-caption'><h4>#{node_context.self.title}</h4><p>#{node_context.self.description}</p></div></div>")

    for sib in node_context.siblings
      $('#myCarousel .carousel-inner').append("<div class='item'><img src='http://placehold.it/500/fb5c5c/fff&text=#{sib.title}'><div class='carousel-caption'><h4>#{sib.title}</h4><p>#{sib.description}</p></div></div>")
    $('#myCarousel .carousel-inner').fadeIn(window.animation_dura)
  )

  # ancestors
  $('#ancestors ul').html('').fadeOut(window.animation_dura, =>
    for anc in node_context.ancestors
      $("<li class='span1'><div class='thumbnail'><img src='http://placehold.it/100/fb5c5c/fff&text=#{anc.title}'></div></li>").bind('click', do =>
        tmp = anc.node_id
        -> goto(tmp)
      ).appendTo('#ancestors ul')
    $('#ancestors ul').fadeIn(window.animation_dura)
  )

  # children
  $('#children ul').html("<li id='new' class='span1'><div class='thumbnail'><img src='http://placehold.it/100/aaa/fff&text=new'></div></li>").fadeOut(window.animation_dura, =>
    for child in node_context.children
      $("<li class='span1'><div class='thumbnail'><img src='http://placehold.it/100/fb5c5c/fff&text=#{child.title}'></div></li>").bind('click', do =>
        tmp = child.node_id
        -> goto(tmp)
      ).appendTo('#children ul')
    $('#children ul').fadeIn(window.animation_dura)
  )

$ ->
  goto(1)
