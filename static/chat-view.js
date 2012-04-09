!function($) {

$.getScript('http://localhost:8000/static/ui/jquery-ui-1.8.18.custom.js').done(function() {
$.getScript('http://localhost:8000/static/chat.js').done(function() {

  /*
  * options = {
  *   user : {uid, uname}
  * }
  */
  function chat_view(options) {

    var global = {
      user: options.user
      , render_to: options.render_to || 'body'
      , bar_position: options.bar_position || 'fixed'
    }

    if ($.chat_obj == undefined) {
      //chat operation
      var chat = new $.chat(options)
      $.chat_obj = chat
    }
    global.chat = $.chat_obj

    if (document.styleSheets.length == 0) {
      $('<style tyle="text/css"></style>').appendTo('head')
    }

    function addcss(s, r) {
      var len = document.styleSheets.length
      var sheet = document.styleSheets[len-1]
      if (sheet.addRule) {
        sheet.addRule(s, r)
      } else if (sheet.insertRule){
        var rule = s + '{' + r + '}'
        sheet.insertRule(rule, 0)
      }
    }

    function addcss_transition(s, r) {
      addcss(s, "-webkit-transition:"+r)
      addcss(s, "-moz-transition:"+r)
      addcss(s, "-ms-transition:"+r)
      addcss(s, "-o-transition:"+r)
      addcss(s, "transition:"+r)
    }

    addcss("#chat-bar .divider", "height: 26px; float: left; border-left: 1px solid #d8d8d8; border-right: 1px solid #fdfdfd;")
    addcss("hr", "border-left-width: 0; border-right-width: 0;border-top: 1px solid #d8d8d8; border-bottom: 1px solid #fdfdfd;")
    addcss("#o-ulist li", "padding: 7px")
    addcss(".left", "float: left;")
    addcss(".right", "float: right;")
    addcss(".inner", "cursor: pointer; padding: 5px; float: left;")
    addcss(".clear", "clear: both;")
    //for chat-room
    addcss("#chat-rooms li", "padding: 0")
    addcss("#chat-rooms-chooser li", "padding: 5px; cursor: pointer; text-overflow: ellipsis;")
    addcss("#chat-rooms-chooser li.active", "background-color: whiteSmoke; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px 0px")
    addcss("#chat-rooms li .chat-room", "padding: 0; height: 327px; width: 486px; overflow-y: auto;overflow-x: hidden;")
    addcss("#chat-rooms-chooser ul, #chat-rooms ul, ul#o-ulist", "margin: 0; padding: 0; list-style: none;")
    addcss("#chat-tool-bar span", "padding: 10px 7px 7px 7px;")
    addcss("#chat-tools span", "cursor: pointer;")
    addcss("#chat-tools span.active, #chat-block li.o-user.active", "box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 3px 0px inset; background-color: #F5F5F5")
    addcss("#chat-block li.o-user", "cursor: pointer;")
    //chat msg
    addcss("div.chat-room div.msg, div.chat-room div.info, div.chat-room div.chat-hint", "box-shadow: 0 2px 5px rgba(200, 200, 200, 0.5)")
    addcss("div.chat-room div.chat-hint", "padding: 10px; color: #C09853; background-color: #FCF8E3; border-bottom: 1px solid #FBEED5;")
    addcss("div.chat-room div.msg", "padding: 10px;color: #555; background-color: #F8F8F8; border-bottom: 1px solid #D2D2D2;")
    addcss("div.chat-room div.info", "padding: 10px;color: #3A87AD; background-color: #D9EDF7; border-bottom: 1px solid #BCE8F1;")
    //for tools
    addcss('input:focus', 'box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);outline: 0;border: 1px solid deepSkyBlue;') 
    addcss('input:hover', 'border: 1px solid deepSkyBlue;')
    addcss("#chat-new-submit input", "width: 138px; padding: 3px !important; padding-left: 3px; pading-right: 3px;")
    addcss('input', 'box-sizing: content-box; border: solid #D2D2D2 1px;')
    addcss_transition('input', 'border linear 0.2s, box-shadow linear 0.2s;')
    addcss('input[type="text"]', 'box_shadow: rgba(0, 0, 0, 0.1) 0px 0px 7px 0px inset;') 
    addcss('input[type="submit"]', 'background: #F0F0F0; cursor: pointer')


    var chat_bar = $('<div id="chat-bar"><div style="padding: 0 50px"><div class="divider"></div>'
                     + '<div id="user-block" class="inner"><a>' + options.user.uname + '</a></div><div class="divider"></div>' 
                     + '<div id="other-users" class="inner" style="cursor: pointer">Online Users</div><div class="divider"></div>' 
                     + '<div id="chat-min" class="inner">Chat Block</div>'
                     + '<div class="clear"></div></div></div>')

    console.log($(global.render_to).height())
    chat_bar.css({
      'z-index': 20000
      , 'opacity': 0.7
      , 'position': global.bar_position
      , 'border-top': 'solid #D2D2D2 1px'
      , 'box-shadow': 'rgba(0, 0, 0, 0.5) 0px 0px 5px 0px'
      , 'background-color': 'whiteSmoke'
      , 'color': 'black'
      , 'font-size': 15
    })

    if (global.bar_position == 'fixed') {
      chat_bar.css({
        'bottom' : 0
        , 'left': 0
        , 'right': 0
      })
    } else {
      chat_bar.css({
        'margin-top': $(global.render_to).height() - 28
        , 'margin-left': 0
        , 'width': $(global.render_to).width()
        , 'float': 'left'
      })

      $(window).resize(function() {
        $(chat_bar).css({
        'margin-top': $(global.render_to).height() - 28
        , 'margin-left': 0
        , 'width': $(global.render_to).width()
        })
      })

    }

    $(chat_bar).appendTo(global.render_to)
    $("#chat-bar").hover(function() {
      $(this).animate({opacity: 1})
    }, function() {
      $(this).animate({opacity: 0.7})
    })


    function msg_handler(msg, build_msg) {

      var chatroom = global.croom(msg.sid)
      var final_msg = '<div>' + build_msg(msg) + '</div>'
      $(final_msg).hide()
            .appendTo(chatroom.find(".chat-content"))
            .slideDown(function() {
              var height = $(chatroom).find('.chat-content').height() - $(chatroom).find(".chat-room").height()
              console.log(height)
              $(chatroom).find(".chat-room").animate({scrollTop: height});
            })
    }

    options.on_msg = function(msg) {
      msg = msg.msg
      console.log(msg)
      if (msg.cmd == 'new_msg') {
        msg_handler(msg, function(msg) {
          var mdiv = '<div class="msg">' + msg.user.uname+' : '+msg.msg + '</div>'
          return mdiv
        })
      } else if (msg.cmd == 'new_session') {
        global.make_chatroom({
          sid: msg.session.sid
          , sname: msg.session.sname || "Untitled"
        })
      } else if (msg.cmd == 'rm_user') {
        msg_handler(msg, function(msg) {
          var mdiv = '<div class="info">'+msg.user.uname+' Quit</div>'
          return mdiv
        })
      } else if (msg.cmd == 'added') {
        global.make_chatroom({
          sid: msg.session.sid
          , sname: msg.session.sname || "Untitled"
        })
      } else if (msg.cmd == 'add_user') {
        msg_handler(msg, function(msg) {
          var mdiv = '<div class="info">User '
          for (var ui in msg.users) {
            var user = msg.users[ui]
            if (user.uname == undefined)
              return
            mdiv += user.uname + ', '
          }
          mdiv += "Added To This Group</div>"
          return mdiv
        })
      }
    }


    //chat more
    /*
    * online block
    */
    !function($) {

      function online_block(options) {
        options.append_to = options.append_to || global.render_to 
        var ob = $('<div id="online-block"></div>')
        ob.css({
          'z-index': 19900
          , 'position': 'absolute'
          , 'border': 'solid #D2D2D2 1px'
          , 'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px'
          , 'background-color': 'whiteSmoke'
          , 'color': 'black'
          , 'overflow-y': 'auto'
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
            var users = msg.users
            if (users.length <= 1) {
              is_click = !is_click
              return
            }
            var lis = '<ul id="o-ulist">';
            for (var ui in users) {
              if (users[ui].uid != global.user.uid && users[ui].uname != undefined)
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
        online_func: global.chat.get_online
        , css: {
          'border-bottom-width': 0 
          , 'width': $("#chat-bar #other-users").width() + 10
          , 'font-size': 15
          , 'max-height': 200
          , 'position': 'fixed'
        }
      })
      $("#other-users").click(function() {
        is_click = !is_click
        if (is_click) {
          ob.show({
            css: {
              'top': $("#chat-bar").position().top - $("#chat-bar").height() 
              , 'left': $("#chat-bar #other-users").position().left - 1
            }
          })
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
                         +   '<span id="chat-session-name">Broadcast</span>'
                         +   '<div id="chat-tools" class="right" style="margin-right: 10px">'
                         +     '<span id="session-users">Group Users</span>'
                         +     '<span id="new-session">New</span>'
                         +   '</div><div class="clear"></div>'
                         + '</div><hr/>'
                         + '<div id="chat-rooms-chooser" class="left">'
                         +   '<ul><li data-id="0" data-name="Broadcast" class="active chooser" id="chat-room-chooser-0">Broadcast</li></ul>'
                         + '</div>'
                         + '<div id="chat-rooms" class="left">'
                         +   '<ul style="padding: 0"><li data-id="0" data-name="Broadcast" id="chat-room-0"><div class="chat-room">'
                         +   '<div class="chat-content"><div class="chat-hint">Your Messages From Broadcast</div></div></div></li></ul>'
                         + '</div>'
                         + '<input placeholder="Your Message ..." id="chat-input" class="left" type="text" x-webkit-speech="" x-webkit-grammar="builtin:search" lang="en"/>'
                         + '<div class="clear"></div></div>')
      var chat_block_min = $('<span id="chat-block-min">Chat Block</span>')

      chat_block.css({
        'position': 'absolute'
        , 'float': 'left'
        , 'border': 'solid #D2D2D2 1px'
        , 'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 0px 7px 0px'
        , 'background-color': 'whiteSmoke'
        , 'color': 'black'
        , 'width': 600 
        , 'height': 400
        , 'padding': 10
        , 'font-size': 15
      }).hide().appendTo(global.render_to).draggable()


      //tools

      all_ob = new global.online_block({
        online_func: global.chat.get_online
        , append_to: '#chat-block'
        , css: {
          'width': 160 
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
          var submit = $('<li id="chat-new-submit"><div><input id="sname-new" type="text" placeholder="group name"/></div>'
                        + '<div style="margin: 5px 0"><input id="create-session" type="submit" value="new group"/></div>'
                        +'<div><input id="add-user" type="submit" value="add to this group"/></div></li>')
          $(ob).find('ul').append(submit)
          function get_selected() {
            var users = []
            var unames = []
            $(lis).each(function() {
              if($(this).hasClass('active')) {
                users.push(parseInt($(this).attr('data-id')))
                var text = $(this).text()
                unames.push(text)
              }
            })
            console.log(unames)
            return {
              users: users
              , unames: unames
            }
          }

          $("#add-user").click(function(e) {
            e.preventDefault()
            selected = get_selected()
            console.log(selected.users)
            if (selected.users.length == 0)
              return
            global.chat.add_user({
              sid: global.active_sid
              , uids: selected.users
            }).done(function() {
              active_new_session(false)
            })
          })

          $("#create-session").click(function(e) {
            e.preventDefault()
            var sname_b = "chat with"
            selected = get_selected()
            if (selected.users.length == 0)
              return
            for (var i in selected.unames) {
              if (typeof selected.unames[i] === "string")
                sname_b += " " + selected.unames[i]
            }
            var sname = $("#sname-new").val() || sname_b 
            selected.users.push(global.user.uid)
            global.chat.new_session({
              uids: selected.users
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
        , 'margin-right': '10px'
        , 'overflow-y': 'auto'
        , 'background-color': '#EEEEEE'
        , 'font-size': 13
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
        'height': css_p.chat_input_h - 10
        , 'width': css_p.widths[1] - 10 
        , 'padding': 4 
        , 'margin-top': '10px'
        , 'font-size': 15
      }).keydown(function(e){
        if (e.keyCode != 13)
          return
        global.chat.new_msg({
          sid: global.active_sid
          , msg: $("#chat-input").val()
        }).done(function() {
          $("#chat-input").val("")
        })
      })

      function init_position() {
        var wh = $(global.render_to).height() - 28
        var ww = $(global.render_to).width()
        var cbh = $("#chat-block").height()
        var cbw = $("#chat-block").width()
        $("#chat-block").css({
          'margin-left': (ww - cbw) / 2
          , 'margin-top': (wh - cbh) / 2 
        })
        console.log(wh)
        console.log(cbh)
        console.log((wh - cbh) / 2)
      }
      function show_chat_block(show) {
        if (show) {
          init_position()
          $("#chat-block").fadeIn(200)
        } else {
          $("#chat-block").fadeOut(200)
        }
        is_show = show 
      }

      $('#chat-min').click(function() {
        show_chat_block(!is_show)
      })
      
      $("#chat-block .close").click(function() {
        show_chat_block(false)
      })

      global.chooser_close = false
      $(".chooser").live("click", function() {
        var sid = parseInt($(this).attr("data-id"))
        if (sid != global.active_sid && !global.chooser_close) {
          moveto_chatroom(sid)
        }
        global.chooser_close = false 
      })

      $(".chooser span.close").live('click', function() {
        global.chooser_close = true
        var sid = parseInt($(this).attr("data-id"))
        global.chat.rm_user(sid).done(function() {
          //TODO
        })
        $(this).parent().fadeOut(function() {
          $(this).remove()
          croom(sid).remove()
        })
        if (parseInt(sid) == global.active_sid) {
          moveto_chatroom(0)
          $.m = global
        }
      })
      /*
      * options = {
      *   sid: chatroom id
      *   sname: chatroom name optional
      * }
      */
      function make_chatroom(options) {
        if (global.sids.indexOf(options.sid) != -1)
          return
        global.sids.push(options.sid)
        if (options.sname == undefined)
          options.sname = "Untitled"
        var chatroom = '<li id="chat-room-'+options.sid+'" data-name="'+options.sname+'"data-id="'+options.sid+'">'
                       + '<div class="chat-room"><div class="chat-hint">Your Messages from '+options.sname+'</div></div></li>'
        var chatroomchooser = '<li class="chooser" id="chat-room-chooser-'+options.sid+'" data-name="'+options.sname+'"data-id="'+options.sid+'">'
        + '<span class="name left" style="width: 75px; text-overflow:ellipsis; overflow: hidden;">' + options.sname + '</span>'
                + '<span class="close right" data-id="'+options.sid+'" style="margin-right: 5px;color: #ccc;">&times;</span><div class="clear"></div></li>'
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
        global.active_sid = sid
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

})})

}(jQuery)
