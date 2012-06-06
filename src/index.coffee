window.animation_dura = 500
window.carousel_length = 0
window.carousel_members = []

goto = (node_id) ->
  $.ajax({
    url: '/context?node_id=' + node_id
  }).done((data)->
    $('#myModal form>input').val(node_id)
    console.log $('#myModal form>input')
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
    console.log window.carousel_length
    console.log caro_index
    if window.carousel_length == 1
      return

    switch caro_index
      when 1
        $('.carousel-control.left').hide()
        $('.carousel-control.right').fadeIn(window.animation_dura)
      when window.carousel_length
        $('.carousel-control.left').fadeIn(window.animation_dura)
        $('.carousel-control.right').hide()
      else
        $('.carousel-control.left').fadeIn(window.animation_dura)
        $('.carousel-control.right').fadeIn(window.animation_dura)
  )
  

setChildren = (index) ->
  $.ajax({
    url: '/context?node_id=' + window.carousel_members[index]
  }).done((data)->
    node_context = JSON.parse(data)
    $('#myModal form>input').val(window.carousel_members[index])
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
    $('#myModal').modal('show')


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

  option = {
    dataType: 'json',
    success: (data) ->
      goto(data.self.node_id)
      $('#myModal').modal('hide')
  }
  $('#myModal form').ajaxForm(option)

  $('#myModal').on('show', ->
    $('fieldset .control-group').removeClass('error')
    $('fieldset .control-group input').val('')
    $('fieldset .control-group span').html('')
  )

  $('a#close').click( ->
    $('#myModal').modal('hide')
  )

  $('a#add').click( ->
    flag = true
    
    # title
    if $('fieldset .control-group:nth-child(1) input').val() == ''
      flag = false
      $('fieldset .control-group:nth-child(1)').addClass('error')
      $('fieldset .control-group:nth-child(1) span').html('Please fill in.')

    # title
    if $('fieldset .control-group:nth-child(3) input').val() == ''
      flag = false
      $('fieldset .control-group:nth-child(3)').addClass('error')
      $('fieldset .control-group:nth-child(3) span').html('Please choose the image.')

    if flag
      $('#myModal form').submit()
  )
  
  # hotkeys
  $(document).keydown((e) ->
    console.log e
    switch e.keyCode
      when 37 #left
        if $('#myModal').is(":hidden")
          $('.carousel-control.left:visible').click()
      when 39 #right
        if $('#myModal').is(":hidden")
          $('.carousel-control.right:visible').click()
      when 78
        $('#myModal').modal('toggle')
  )

  goto(/(\d+)$/.exec(window.location)[0])
