function search_user(_p1) {
  
  $(function() {
    
    $('#user_search_form').submit(function(_ev) {
      
      _ev.preventDefault();
      
      var _val = $('#q').val();
      
      if (!_val) {
        
        return;
      }
      
      $.ajax({
        type: "GET",
        data: { 'q': _val },
        url: _p1,
        complete: function() {
          
        },
        success: function(_d) {
          
          $('#search_result').html(_d);
        }
      })
    });
  })
}

function add_wish() {
  
  $(function() {
    
    $('#add_wish_form').submit(function(_ev) {
      
      _ev.preventDefault();
      
      var _data = {},
      _url = $(this).attr('action');
      
      if (!$('#gift_name').val()) {
        
        return;
      }
      
      $(this).find('input, select, textarea').each(function(_i, _el) {
        
        var _el = $(_el), _name = _el.attr('name');

        if (_name) {
          _data[_name] = _el.val();
        }
      });
      
      $.ajax({
        type: "POST",
        data: _data,
        url: _url,
        complete: function() {
          
        },
        success: function(_d) {
          
          $('#gift_list').find('li.empty').remove().end().append(_d);
          $('#gift_name').val('');
        }
      })
    });
  })
}

function request_friendship(_url, _user_id) {
  
  $(function() {
    $('#request-frienship').click(function() {
      var self = this;
      $(self).html('loading...');
      $.ajax({
        type: 'POST',
        url: _url,
        data: { user_id: _user_id },
        success: function(_r) {
          $(self).html('request sent!')
        },
        complete: function() {
          
        }
      })
    })
  })
}

function friendship_requests(_url) {
  
  $('#friendship-requests-list').find('a.allow').click(function(_ev) {
    _ev.preventDefault();
    var _a = $(this), _li = _a.closest('li'), _user_id = _li.attr('userid');
    
    $.ajax({
      type: 'PUT',
      url: _url,
      data: { user_id: _user_id },
      success: function(_r) {
        if (!_li.siblings('li.user:visible').length) {
          _li.parent().fadeOut()
        } else {
          _li.fadeOut();
        }
      }
    })
  }).end().find('a.decline').click(function(_ev) {
    _ev.preventDefault();
    var _a = $(this), _li = _a.closest('li'), _user_id = _li.attr('userid');
    
    $.ajax({
      type: 'DELETE',
      url: _url,
      data: { user_id: _user_id },
      success: function(_r) {
        _li.fadeOut(function() {
          if (!_li.siblings('li.user:visible').length) {
            _li.parent().fadeout()
          }
        });
      }
    })
  })
}

function mark_friend_wish(_url) {
  
  $(function() {
    $('#gift_list a.i-promise').click(function(_ev) {
      _ev.preventDefault();
      var _a = $(this), _wish_id = _a.closest('li').attr('i'), _span = _a.next('span');
      $.ajax({
        url: _url,
        type: 'PUT',
        data: { a: 'fp', i: _wish_id },
        success: function(_r) {
          _a.fadeOut();
          _span.html('<span class="promised">' + _span.html() + '</span>');
        }
      });
    })
  })
}

function my_wish_list(_url) {
  $(function() {
    $('#gift_list a.checkout').click(function(_ev) {
      _ev.preventDefault();
      var _a = $(this), _wish_id = _a.closest('li').attr('i'), _span = _a.next('span');
      $.ajax({
        url: _url,
        type: 'PUT',
        data: { a: 'co', i: _wish_id },
        success: function(_r) {
          _a.fadeOut(); _a.siblings('a.edit').fadeOut();
          _span.html('<span class="checkedout">' + _span.html() + '</span>');
        }
      });
    });
    $('#gift_list a.remove').click(function(_ev) {
      _ev.preventDefault();
      var _a = $(this), _wish_id = _a.closest('li').attr('i'), _li = _a.closest('li');
      $.ajax({
        url: _url,
        type: 'DELETE',
        data: { i: _wish_id },
        success: function(_r) {
          _li.fadeOut(function() { _li.remove(); });
        }
      })
    });
  })
}