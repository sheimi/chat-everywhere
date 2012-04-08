!function($) {
  var host = 'http://localhost:8000'
  var default_urls = {
    update: host + '/m/update'
    , new_msg: host + '/m/new_msg'
    , add_user: host + '/m/add_user'
    , rm_user: host + '/m/rm_user'
    , get_online: host + '/m/get_online'
    , new_session: host + '/m/new_session'
    , get_session_user: host + '/m/get_session_user'
  }
 /*
  * options = {
  *   user: {
  *     uid: int
  *     uname: str
  *   }
  *   , on_msg: function when msg come
  * }
  *
  */
  function chat(options) {

    var urls = default_urls
    var user = options.user

    function update() {
      $.ajax({
        url: urls.update
        , dataType: 'jsonp'
        , data: {
          args: JSON.stringify(user)
        }
      }).done(function() {
        update()
      }).done(options.on_msg)
    }
    /*
    * args = {
    *   sid: int
    *   msg: str
    * }
    */
    function new_msg(args) {
      args.uid = user.uid
      var callback = $.ajax({
        url: urls.new_msg
        , dataType: 'jsonp'
        , data: {
          args: JSON.stringify(args)
        }
      })
      return callback
    }

    /*
    * args = {
    *   'sid': int
    *   'uids': [int]
    * }
    */
    function add_user(args) {
      var callback = $.ajax({
        url: urls.add_user
        , dataType: 'jsonp'
        , data: {
          args: JSON.stringify(args)
        }
      })
      return callback
    }

    function rm_user(sid) {
      var args = {
        uid : user.uid
        , sid : sid
      }
      var callback = $.ajax({
        url: urls.rm_user
        , dataType: 'jsonp'
        , data: {
          args: JSON.stringify(args)
        }
      })
      return callback
    }
    /*
    * sraw = {
    *   sname: str (optional) 
    *   uids: [int] (uids) 
    * }
    */
    function new_session(sraw) {
      sraw.oid = user.uid
      var callback = $.ajax({
        url: urls.new_session
        , dataType: 'jsonp'
        , data: {
          args: JSON.stringify(sraw)
        }
      })
      return callback
    }

    function get_online() {
      var callback = $.ajax({
        url: urls.get_online
        , dataType: 'jsonp'
      })
      return callback
    }

    function get_session_user(sid) {
      var args = {sid: sid}
      var callback = $.ajax({
        url: urls.get_session_user
        , dataType: 'jsonp'
        , data: {
          args: JSON.stringify(args)
        }
      })
      return callback
    }

    //make function public
    this.new_msg = new_msg
    this.add_user = add_user
    this.rm_user = rm_user
    this.new_session = new_session
    this.get_online = get_online
    this.get_session_user = get_session_user

    //run update
    update()
  }

  $.chat = chat

}(jQuery)
