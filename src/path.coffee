render = (id)->
  $('#story').html('')
  $.ajax({
    url: '/context?node_id=' + id
  }).done((data) ->
    context = JSON.parse(data)
    for a in context.ancestors
      $('#story').append("<div class='span3'><h2>#{a.title}</h2><div class='thumbnail'><img src=#{a.graph_uri}></div></div>")
    $('#story').append("<div class='span3'><h2>#{context.self.title}</h2><div class='thumbnail'><img src=#{context.self.graph_uri}></div></div>")

    #$('head').append("<link rel='image_src' type='image' href=#{window.location.origin + context.self.graph_uri}>")

    $('#fb').prepend("<a name='fb_share' type='button' share_url='#{window.location}'</a><script src='http://static.ak.fbcdn.net/connect.php/js/FB.Share' type='text/javascript'></script>")
  )



$ ->
  render(/(\d+)$/.exec(window.location)[0])

  
