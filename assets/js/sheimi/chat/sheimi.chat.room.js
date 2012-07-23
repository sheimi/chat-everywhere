//!function(sheimi, $) {

var chatroom_frame = '<div id="chatrooms"><ul class="clearfix">'
                   + '<li class="chatroom"><div class="chat-content"></div></li>'
                   + '</ul><div class="chat-input">'
                   + '<input placeholder="Your Message ..." id="chat-input" type="text"'
                   + ' x-webkit-speech="" x-webkit-grammar="builtin:search" lang="en">'
                   + '</div></div>'

$(chatroom_frame).appendTo('body').css({'right': -500})
var roomShowed = false
function toggleChatRoom() {
  roomShowed = !roomShowed
  var change = roomShowed ? '+=500' : '-=500'
  $('#chatrooms').animate({
    'right': change
  }, {
    easing: 'easeInOutExpo'
  })
}
var chatrooms_toggle = '<div id="chatrooms-toggle"><i class="icon-off icon-white"></i></div>'
$(chatrooms_toggle).appendTo('body').click(function() {
  toggleChatRoom()
})

$('#chat-input').keydown(function(e) {
  if (e.keyCode != 13)
    return
  var msg = $(this).val()
  var block = new MsgBlock({
    type: 'msg'
    , msg: msg
    , user: 'I'
  })
  block.show()
  $(this).val('')
})

/* ---- 
 * msg block
 * ----
 * options = {
 *   type: str
 *   , msg: str
 *   , user: str(option)
 * }
 * ---- */
function MsgBlock(options) {
  var block = '<div class="msg-block"></div>'
  if (options.type == 'msg') {
    block = $(block).addClass('clearfix')
    var user_div = $('<div></div>')
    var chat_inner = $('<div class="chat-inner"></div>')
    if (options.user == 'I') {
      user_div.addClass("chat-me")
      chat_inner.append('<span class="username">I</span>')
    } else {
      chat_inner.append('<span class="username">'+options.user+'</span>')
      user_div.addClass("chat-user")
    }
    user_div.append(chat_inner)
    block.append(user_div)
  } else {
    block = $(block).addClass(options.type)
  }

  var text = '<div class="chat-msg">' + options.msg + '</div>'
  block.append(text)
  
  /* --- show the block --- */
  function show() {
    var right = 500
    block.appendTo(".chatroom .chat-content").css({
      'position': 'fixed'
      , 'right': -right
    }).animate({
      'right': '+=' + right
    }, {
      easing: 'easeInOutExpo'
      , complete: function() {
        block.css({
          'position': 'static'
        })
      }
    })
  }

  /* --- interfaces --- */
  this.show = show
}

//}(jQuery)
