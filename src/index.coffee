window.animation_dura = 500
window.carousel_length = 0
window.carousel_members = []

goto = (node_id) ->
  $.ajax({
    url: '/context?node_id=' + node_id
  }).done((data)->
    setItems(data)
    setNew(data)
  )


setCarousel = ->
  $('#myCarousel').carousel({
    interval: false
  }).bind('slide', ->
    $('#children ul').fadeOut(window.animation_dura)
  ).bind('slid', ->
    setChildren($('#myCarousel .active').index('#myCarousel .item'))
    caro_index = $('#myCarousel .active').index('#myCarousel .item') + 1
    switch caro_index
      when 1 then $('.carousel-control.left').hide()
      when window.carousel_length then $('.carousel-control.right').hide()
      else
        $('.carousel-control.left').fadeIn(window.animation_dura)
        $('.carousel-control.right').fadeIn(window.animation_dura)
  )
  

setChildren = (index) ->
  $.ajax({
    url: '/context?node_id=' + window.carousel_members[index]
  }).done((data)->
    node_context = JSON.parse(data)

    # children
    $('#children ul').html("<li id='new' class='span1'><div class='thumbnail'><img src='http://placehold.it/100/aaa/fff&text=new'></div></li>")
    for child in node_context.children
      $("<li class='span1'><div class='thumbnail'><img src='#{child.graph_uri}'></div></li>").bind('click', do =>
        tmp = child.node_id
        -> goto(tmp)
      ).appendTo('#children ul')
    $('#children ul').fadeIn(window.animation_dura)
  )


setNew = (data) ->
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
  #if node_context.siblings.length == 0 then $('#myCarousel a').fadeOut(2*window.animation_dura) else $('#myCarousel a').fadeIn(2*window.animation_dura)
  window.carousel_length = node_context.siblings.length + 1
  $('.carousel-control.left').hide()
  $('.carousel-control.right').hide()

  # self & siblings
  $('#myCarousel .carousel-inner').fadeOut(window.animation_dura, =>
    $('#myCarousel .carousel-inner').html("<div class='item active'><img src='#{node_context.self.graph_uri}'><div class='carousel-caption'><h4>#{node_context.self.title}</h4><p>#{node_context.self.description}</p></div></div>")
    window.carousel_members = [node_context.self.node_id]

    for sib in node_context.siblings
      $('#myCarousel .carousel-inner').append("<div class='item'><img src='#{sib.graph_uri}'><div class='carousel-caption'><h4>#{sib.title}</h4><p>#{sib.description}</p></div></div>")
      window.carousel_members.push(sib.node_id)
    console.log window.carousel_members
    $('#myCarousel .carousel-inner').fadeIn(window.animation_dura)
    if sib then $('.carousel-control.right').fadeIn(window.animation_dura)
  )

  # ancestors
  $('#ancestors ul').html('').fadeOut(window.animation_dura, =>
    for anc in node_context.ancestors
      $("<li class='span1'><div class='thumbnail'><img src='#{anc.graph_uri}'></div></li>").bind('click', do =>
        tmp = anc.node_id
        -> goto(tmp)
      ).appendTo('#ancestors ul')
    $('#ancestors ul').fadeIn(window.animation_dura)
  )

  # children
  $('#children ul').html("<li id='new' class='span1'><div class='thumbnail'><img src='http://placehold.it/100/aaa/fff&text=new'></div></li>").fadeOut(window.animation_dura, =>
    for child in node_context.children
      $("<li class='span1'><div class='thumbnail'><img src='#{child.graph_uri}'></div></li>").appendTo('#children ul').bind('click', do =>
        tmp = child.node_id
        -> goto(tmp)
      )
    $('#children ul').fadeIn(window.animation_dura)
  )

$ ->
  setCarousel()
  goto(1)
