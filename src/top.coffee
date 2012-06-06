loadRoots = ->
  $('#roots').html('')
  $.ajax({
    url: '/roots'
  }).done((data) ->
    roots = JSON.parse(data)
    if roots.length
      $('#other').show()

    for r in roots
      $('#roots').append("<a href='/view/#{r.node_id}'><div class='span2'><h2>#{r.title}</h2><div class='thumbnail'><img src=#{r.graph_uri}></div></div></a>")
  )

$ ->
  $('#other').hide()
  loadRoots()

  # modal
  $('#create').click( ->
    $('#myModal').modal('show')
  )

  option = {
    dataType: 'json',
    success: (data) ->
      $('#myModal').modal('hide')
      loadRoots()
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

  console.log $('a#close')

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
