IM Server
=========

Overview
--------

IM Server and it's javascript client

Usage
----

+   jquery is required
+   example

    
    !function(window, $) {

      function login_chatter(im_host, uname, uid) {
        
        if (window.chatview == undefined) {
          $.getScript('http://'+im_host+'/static/chat-view.js').done(function() {
            setTimeout(function() { 
              window.chatview = new $.chat_view({ 
                user: {
                  uname: uname 
                  , uid: uid  
                }   
              })  
              window.chatview.show()
            }, 1000)
          }).fail(function() {
          })  
        } else {
          window.chatview.show()
        }
      }

      window.login_chatter = login_chatter

    }(window, jQuery)
    login_chatter(.., .., ..)
