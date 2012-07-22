/* ===================================================
 * sheimi.chat.js 
 * ===================================================
 * dependency:
 *  sheimi.core.js
 *  sheimi.util.js
 *  jquery
 * ===================================================
 * Copyright 2012 sheimi.me.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

//function(sheimi, $) {




/* -------
 * chat js client
 * -------
 * options = {
 *   user: {
 *     uid: int
 *     , uname: str
 *   }
 *   , on_msg: function when msg come
 * }
 * ------- */
function Chat(option) {

  var defaultOption = {
    host: 'http://localhost:8000'
    , dataType: 'jsonp'
  }

  var config = sheimi.util.updateConfig(defaultOption, option)
  var user = config.user
  
  urls = {
    update: config.host + '/m/update'
    , new_msg: config.host + '/m/new_msg'
    , add_user: config.host + '/m/add_user'
    , rm_user: config.host + '/m/rm_user'
    , get_online: config.host + '/m/get_online'
    , new_session: config.host + '/m/new_session'
    , get_session_user: config.host + '/m/get_session_user'
  }

  /* --- holding the long connection --- */
  function update() {
    $.ajax({
      url: urls.update
      , dataType: config.dataType
      , data: {
        args: JSON.stringify(user)
      }
    }).done(function() {
      update()
    }).done(option.on_msg)
  }

  /* -------
   * to send a message
   * -------
   * args = {
   *  sig: int
   *  , msg: str
   * }
   * ------- */
  function new_msg(args) {
    args.uid = user.uid
    var callback = $.ajax({
      url: urls.new_msg
      , dataType: config.dataType
      , data: {
        args: JSON.stringify(args)
      }
    })
    return callback
  }

  /* -------
   * to add user to a session
   * -------
   * args = {
   *  sig: int
   *  , uids: [int]
   * }
   * ------- */
  function add_user(args) {
    var callback = $.ajax({
      url: urls.add_user
      , dataType: config.dataType
      , data: {
        args: JSON.stringify(args)
      }
    })
    return callback
  }

  /* -------
   * to remove a user from a session
   * -------
   * sid
   * ------- */
  function rm_user(sid) {
    var args = {
      uid : user.uid
      , sid : sid
    }
    var callback = $.ajax({
      url: urls.rm_user
      , dataType: config.dataType
      , data: {
        args: JSON.stringify(args)
      }
    })
    return callback
  }

  /* -------
   * to add a new session
   * -------
   * sraw = {
   *  sname: str (optional)
   *  , uids: [int] (uids)
   * }
   * ------- */
  function new_session(sraw) {
    sraw.oid = user.uid
    var callback = $.ajax({
      url: urls.new_session
      , dataType: config.dataType
      , data: {
        args: JSON.stringify(sraw)
      }
    })
    return callback
  }

  /* -------
   * to get on line users
   * ------- */
  function get_online() {
    var callback = $.ajax({
      url: urls.get_online
      , dataType: config.dataType
    })
    return callback
  }

  /* -------
   * get users from a session
   * ------- */
  function get_session_user(sid) {
    var args = {sid: sid}
    var callback = $.ajax({
      url: urls.get_session_user
      , dataType: config.dataType
      , data: {
        args: JSON.stringify(args)
      }
    })
    return callback
  }

  /* --- the interface --- */
  this.new_msg = new_msg
  this.add_user = add_user
  this.rm_user = rm_user
  this.new_session = new_session
  this.get_online = get_online
  this.get_session_user = get_session_user

  /* --- update ---*/
  update()
}

sheimi.chat = new Sheimi({
  Chat: Chat
})

//}(sheimi, jQuery)
