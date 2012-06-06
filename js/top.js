var loadRoots;

loadRoots = function() {
  $('#roots').html('');
  return $.ajax({
    url: '/roots'
  }).done(function(data) {
    var r, roots, _i, _len, _results;
    roots = JSON.parse(data);
    if (roots.length) $('#other').show();
    _results = [];
    for (_i = 0, _len = roots.length; _i < _len; _i++) {
      r = roots[_i];
      _results.push($('#roots').append("<a href='/view/" + r.node_id + "'><div class='span2'><h2>" + r.title + "</h2><div class='thumbnail'><img src=" + r.graph_uri + "></div></div></a>"));
    }
    return _results;
  });
};

$(function() {
  var option;
  $('#other').hide();
  loadRoots();
  $('#create').click(function() {
    return $('#myModal').modal('show');
  });
  option = {
    dataType: 'json',
    success: function(data) {
      $('#myModal').modal('hide');
      return loadRoots();
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
  console.log($('a#close'));
  return $('a#add').click(function() {
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
});
