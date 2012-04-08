!function($) {

  /*
  * options = {
  *   user : {uid, uname}
  * }
  */
  function chat_view(options) {

    var global = {
      user: options.user
    };

    if (document.styleSheets.length == 0) {
      $('<style></style>').appendTo('head')
    }

    document.styleSheets[0].addRule("#chat-bar .divider", "height: 26px; float: left; border-left: 1px solid #d8d8d8; border-right: 1px solid #fdfdfd;")
    document.styleSheets[0].addRule("hr", "border-left-width: 0; border-right-width: 0;border-top: 1px solid #d8d8d8; border-bottom: 1px solid #fdfdfd;")
    document.styleSheets[0].addRule("#o-ulist li", "padding: 7px")
    document.styleSheets[0].addRule(".left", "float: left;")
    document.styleSheets[0].addRule(".right", "float: right;")
    document.styleSheets[0].addRule(".inner", "cursor: pointer; padding: 5px; float: left;")
    document.styleSheets[0].addRule(".clear", "clear: both;")
    //for chat-room
    document.styleSheets[0].addRule("#chat-rooms li", "padding: 0")
    document.styleSheets[0].addRule("#chat-rooms-chooser li", "padding: 5; cursor: pointer;")
    document.styleSheets[0].addRule("#chat-rooms-chooser li.active", "background-color: whiteSmoke; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px 0px")
    document.styleSheets[0].addRule("#chat-rooms li .chat-room", "padding: 5px; height: 317px; width: 476px; overflow: scroll")
    document.styleSheets[0].addRule("#chat-rooms-chooser ul, #chat-rooms ul, ul#o-ulist", "margin: 0; padding: 0; list-style: none;")
    document.styleSheets[0].addRule("#chat-tool-bar span", "padding: 10px 7px 7px 7px;")
    document.styleSheets[0].addRule("#chat-tools span", "cursor: pointer;")
    document.styleSheets[0].addRule("#chat-tools span.active, #chat-block li.o-user.active", "box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 3px 0px inset; background-color: #F5F5F5")
    document.styleSheets[0].addRule("#chat-block li.o-user", "cursor: pointer;")

    var chat_bar = $('<div id="chat-bar"><div style="min-width: 1000px; padding: 0 50px"><div class="divider"></div>'
                     + '<div id="user-block" class="inner"><a>' + options.user.uname + '</a></div><div class="divider"></div>' 
                     + '<div id="other-users" class="inner" style="cursor: pointer">Online Users</div><div class="divider"></div>' 
                     + '<div id="chat-min" class="inner">Chat Block</div>'
                     + '<div class="clear"></div></div></div>')

    chat_bar.css({
      'z-index': 2000
      , 'opacity': 0.7
      , 'position': 'fixed'
      , 'border-top': 'solid #D2D2D2 1px'
      , 'box-shadow': 'rgba(0, 0, 0, 0.5) 0px 0px 5px 0px'
      , 'background-color': 'whiteSmoke'
      , 'bottom': 0
      , 'left': 0
      , 'right': 0
      , 'color': 'black'
      , 'font-size': 15
    })

    $(chat_bar).appendTo('body')
    $("#chat-bar").hover(function() {
      $(this).animate({opacity: 1})
    }, function() {
      $(this).animate({opacity: 0.7})
    })

    function msg_handler(msg, build_msg) {

      var chatroom = global.croom(msg.sid)
      console.log(chatroom)
      $(build_msg(msg)).hide()
                           .appendTo(chatroom.find(".chat-room"))
                           .slideDown()
    }

    options.on_msg = function(msg) {
      msg = msg.msg
      console.log(msg)
      if (msg.cmd == 'new_msg') {
        msg_handler(msg, function(msg) {
          var mdiv = '<div>'+msg.user.uname+' : '+msg.msg+'</div>'
          return mdiv
        })
      } else if (msg.cmd == 'new_session') {
        global.make_chatroom({
          sid: msg.session.sid
          , sname: msg.session.sname || "Untitled"
        })
      } else if (msg.cmd == 'rm_user') {
        msg_handler(msg, function(msg) {
          var mdiv = '<div>'+msg.user.uname+' Quit</div>'
          return mdiv
        })
      }
    }

    //chat operation
    var chat = new $.chat(options)
    global.chat = chat

    //chat more
    /*
    * online block
    */
    !function($) {

      function online_block(options) {
        options.append_to = options.append_to || 'body'
        var ob = $('<div id="online-block"></div>')
        ob.css({
          'z-index': 1990 
          , 'position': 'absolute'
          , 'border': 'solid #D2D2D2 1px'
          , 'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px'
          , 'background-color': 'whiteSmoke'
          , 'color': 'black'
          , 'overflow': 'scroll'
        })
        if (options.css != undefined)
        ob.css(options.css)
        function build_userli(user) {
          var li = '<li class="o-user" data-id="' + user.uid + '">'+user.uname+'</li>'
          return li
        }

        this.hide = function() {
          ob.fadeOut(100, function() {$(this).remove()})
        }

        this.show = function(op) {
          var op = op || {}
          if (op.css != undefined) {
            ob.css(op.css)
          }
          options.online_func(op.sid).done(function(msg) {
            users = msg.users
            if (users.length <= 1) {
              is_click = !is_click
              return
            }
            var lis = '<ul id="o-ulist">';
            for (var ui in users) {
              if (users[ui].uid != global.user.uid)
                lis += build_userli(users[ui])
            }
            lis += '</ul>'
            ob.html("").hide().append(lis).appendTo(options.append_to).fadeIn(100)
            if (options.callback != undefined)
              options.callback(ob)
          })
        }
      }

      global.online_block = online_block

      var is_click = false
      var ob = new online_block({
        online_func: chat.get_online
        , css: {
          'border-bottom-width': 0 
          , 'width': $("#chat-bar #other-users").width() + 10
          , 'font-size': 15
          , 'max-height': 200
          , 'top': $("#chat-bar").position().top - $("#chat-bar").height() 
          , 'left': $("#chat-bar #other-users").position().left - 1
        }
      })
      $("#other-users").click(function() {
        is_click = !is_click
        if (is_click) {
          ob.show()
        } else {
          ob.hide()
        }
      })
    }(jQuery)

    /*
    * chat block
    */
    !function($) {

      global.active_sid = 0
      global.sids = [0]

      var is_show = false
      var chat_block = $('<div id="chat-block">'
                         + '<div class="close" style="position: absolute; font-size: 15px; right: 5px; top: 0; color: #ccc; cursor: pointer;">&times;</div>'
                         + '<div id="chat-tool-bar">'
                         +   '<span id="chat-session-name">Broad Cast</span>'
                         +   '<div id="chat-tools" class="right" style="margin-right: 10px">'
                         +     '<span id="session-users">Group Users</span>'
                         +     '<span id="new-session">New</span>'
                         +   '</div><div class="clear"></div>'
                         + '</div><hr/>'
                         + '<div id="chat-rooms-chooser" class="left">'
                         +   '<ul><li data-id="0" data-name="Broad Cast" class="active chooser" id="chat-room-chooser-0">Broad Cast</li></ul>'
                         + '</div>'
                         + '<div id="chat-rooms" class="left">'
                         +   '<ul><li data-id="0" data-name="Broad Cast" id="chat-room-0"><div class="chat-room">Broad Cast</div></li></ul>'
                         + '</div>'
                         + '<input id="chat-input" class="left" type="text"/>'
                         + '<div class="clear"></div></div>')
      var chat_block_min = $('<span id="chat-block-min">Chat Block</span>')

      chat_block.css({
        'position': 'absolute'
        , 'border': 'solid #D2D2D2 1px'
        , 'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 0px 7px 0px'
        , 'background-color': 'whiteSmoke'
        , 'color': 'black'
        , 'width': 600 
        , 'height': 400
        , 'padding': 10
        , 'font-size': 15
      }).hide().appendTo('body').draggable()


      //tools

      all_ob = new global.online_block({
        online_func: global.chat.get_online
        , append_to: '#chat-block'
        , css: {
          'width': 140 
          , 'max-height': 200
        }
        , callback: function(ob) {
          var lis = $(ob).find('li')
          var lis_f = {}
          $(lis).each(function() {
            var id = $(this).attr('data-id')
            lis_f[id] = false
          }).click(function() {
            var id = $(this).attr('data-id')
            lis_f[id] = !lis_f[id]
            if (lis_f[id]) {
              $(this).addClass('active')
            } else {
              $(this).removeClass('active')
            }
          })
          var sname_input = $('<li><input id="sname-new" type="text" placehold="group name"/></li>')
          $(ob).find('ul').append(sname_input)
          var submit = $('<li><input id="create-session" type="submit"/></li>')
          submit.appendTo($(ob).find('ul')).click(function(e) {
            e.preventDefault()
            var users = []
            var unames = []
            $(lis).each(function() {
              if($(this).hasClass('active')) {
                users.push(parseInt($(this).attr('data-id')))
                var text = $(this).text()
                unames.push(text)
              }
            })
            var sname_b = "chat with"
            for (var i in unames) {
              sname_b += " " + unames[i]
            }
            var sname = $("#sname-new").val() || sname_b 
            users.push(global.user.uid)
            global.chat.new_session({
              uids: users
              , sname: sname
            }).done(function() {
              active_new_session(false)
            })
          })
        }
      })

      session_ob = new global.online_block({
        online_func: global.chat.get_session_user
        , append_to: '#chat-block'
        , css: {
          'width': 140 
          , 'max-height': 200
        }
      })

      function active_session_users(active) {
        obj = $("#session-users")
        if (active) {
          if (!obj.hasClass("active")) {
            obj.addClass("active")
            session_ob.show({
              css: {
                'top': $("#session-users").position().top + $("#new-session").height() + 10
                , 'left': $("#session-users").position().left 
              }
              , sid: global.active_sid
            })
          }
        } else {
          if (obj.hasClass("active")) {
            obj.removeClass("active")
            session_ob.hide()
          }
        }
      }

      function active_new_session(active) {
        obj = $("#new-session")
        if (active) {
          if (!obj.hasClass("active")) {
            obj.addClass("active")
            all_ob.show({
              css: {
                'top': $("#new-session").position().top + $("#new-session").height() + 10
                , 'left': $("#new-session").position().left 
              }
            })
          }
        } else {
          if (obj.hasClass("active")) {
            obj.removeClass("active")
            all_ob.hide()
          }
        }
      }

      $("#session-users").click(function() {
        if ($(this).hasClass('active')) {
          active_session_users(false)
        } else {
          active_session_users(true)
          active_new_session(false)
        }
      })
      $("#new-session").click(function() {
        if ($(this).hasClass('active')) {
          active_new_session(false)
        } else {
          active_session_users(false)
          active_new_session(true)
        }
      })



      var css_p = {
        main_height : 365
        , widths: [100, 486]
        , chat_input_h: 30
        , box_shadow: 'rgba(0, 0, 0, 0.1) 0px 0px 7px 0px inset'
        , border: 'solid #D2D2D2 1px'
      }
      $("#chat-block .divider").css({
        'height': css_p.main_height
        , 'margin': '0 5px'
        , 'float': 'left'
      })
      $("#chat-rooms-chooser").css({
        'height': css_p.main_height 
        , 'width': css_p.widths[0]
        , 'border': css_p.border
        , 'box-shadow': css_p.box_shadow
        , 'background-color': 'white'
        , 'margin-right': '10px'
        , 'overflow': 'scroll'
        , 'background-color': '#EEEEE'
      })
      $("#chat-rooms").css({
        'height': css_p.main_height - css_p.chat_input_h - 10
        , 'width': css_p.widths[1]
        , 'border': css_p.border
        , 'box-shadow': css_p.box_shadow
        , 'background-color': 'white'
        , 'overflow': 'hidden'
      })
      $("#chat-input").css({
        'height': css_p.chat_input_h 
        , 'width': css_p.widths[1]
        , 'border': css_p.border
        , 'box-shadow': css_p.box_shadow
        , 'padding': css_p.padding
        , 'margin-top': '10px'
        , 'font-size': 15
      }).keydown(function(e){
        if (e.keyCode != 13)
          return
        chat.new_msg({
          sid: global.active_sid
          , msg: $("#chat-input").val()
        })
      })

      var css_p = {
        main_height : 365
        , widths: [100, 486]
        , chat_input_h: 30
        , box_shadow: 'rgba(0, 0, 0, 0.1) 0px 0px 7px 0px inset'
        , border: 'solid #D2D2D2 1px'
      }
      $("#chat-block .divider").css({
        'height': css_p.main_height
        , 'margin': '0 5px'
        , 'float': 'left'
      })
      $("#chat-rooms-chooser").css({
        'height': css_p.main_height 
        , 'width': css_p.widths[0]
        , 'border': css_p.border
        , 'box-shadow': css_p.box_shadow
        , 'background-color': 'white'
        , 'margin-right': '10px'
        , 'overflow': 'scroll'
        , 'background-color': '#EEEEE'
      })
      $("#chat-rooms").css({
        'height': css_p.main_height - css_p.chat_input_h - 10
        , 'width': css_p.widths[1]
        , 'border': css_p.border
        , 'box-shadow': css_p.box_shadow
        , 'background-color': 'white'
        , 'overflow': 'hidden'
      })
      $("#chat-input").css({
        'height': css_p.chat_input_h 
        , 'width': css_p.widths[1]
        , 'border': css_p.border
        , 'box-shadow': css_p.box_shadow
        , 'padding': css_p.padding
        , 'margin-top': '10px'
        , 'font-size': 15
      }).keydown(function(e){
        if (e.keyCode != 13)
          return
        chat.new_msg({
          sid: global.active_sid
          , msg: $("#chat-input").val()
        })
      })

      function init_position() {
        var wh = $(window).height()
        var ww = $(window).width()
        var cbh = $("#chat-block").height()
        var cbw = $("#chat-block").width()
        $("#chat-block").css({
          'left': (ww - cbw) / 2
          , 'top': (wh - cbh) / 2 
        })
      }
      function show_chat_block(show) {
        if (show) {
          init_position()
          $("#chat-block").fadeIn()
        } else {
          $("#chat-block").fadeOut()
        }
        is_show = show 
      }

      $('#chat-min').click(function() {
        show_chat_block(!is_show)
      })
      
      $("#chat-block .close").click(function() {
        show_chat_block(false)
      })

      $(".chooser").live("click", function() {
        var sid = parseInt($(this).attr("data-id"))
        if (sid != global.active_sid) {
          moveto_chatroom(sid)
          global.active_sid = sid
        }
      })

      /*
      * options = {
      *   sid: chatroom id
      *   sname: chatroom name optional
      * }
      */
      $(".chooser span.close").live('click', function() {
        var sid = parseInt($(this).attr("data-id"))
        global.chat.rm_user(sid).done(function() {
          console.log(true)
        })
        $(this).parent().fadeOut(function() {
          $(this).remove()
          croom(sid).remove()
        })
        if (parseInt(sid) == global.active_sid) {
          moveto_chatroom(0)
        }
      })
      function make_chatroom(options) {
        if (global.sids.indexOf(options.sid) != -1)
          return
        global.sids.push(options.sid)
        if (options.sname == undefined)
          options.sname = "Untitled"
        var chatroom = '<li id="chat-room-'+options.sid+'" data-name="'+options.sname+'"data-id="'+options.sid+'">'
                       + '<div class="chat-room">'+options.sid+'</div></li>'
        var chatroomchooser = '<li class="chooser" id="chat-room-chooser-'+options.sid+'" data-name="'+options.sname+'"data-id="'+options.sid+'">'
                      + options.sname + '<span class="close right" data-id="'+options.sid+'" style="margin-right: 5px;color: #ccc;">&times;</span></li>'
        $(chatroom).appendTo("#chat-rooms ul")
        $(chatroomchooser).appendTo("#chat-rooms-chooser ul")
      }
      function moveto_chatroom(sid) {

        var chatroom = croom(sid)
        var ul_top = $("#chat-rooms ul").position().top
        var c_top = $(chatroom).position().top
        var delta = "-=" + (c_top - ul_top)
        $("#chat-rooms ul").animate({'margin-top': delta})

        var chooser = croomc(sid)
        $(".chooser").each(function() {$(this).removeClass("active")})
        chooser.addClass("active")

        var sname = $(chatroom).attr("data-name")
        $("#chat-session-name").fadeOut(function() {
          $(this).text(sname)
          $(this).fadeIn()
        })
      }
      function croom(sid) {
        return $("#chat-room-"+sid)
      }
      function croomc(sid) {
        return $("#chat-room-chooser-"+sid)
      }
      global.croom = croom
      global.make_chatroom = make_chatroom
      global.moveto_chatroom = moveto_chatroom
      $.global = global

      $.chat_block = chat_block
    }(jQuery)

  }
  $.chat_view = chat_view
}(jQuery)
