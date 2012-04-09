import tornado, json, os
from tornado.wsgi import WSGIContainer
from tornado.ioloop import IOLoop
from tornado.web import FallbackHandler, RequestHandler, Application
from flasky import app

class MainHandler(RequestHandler):
    def get(self):
        self.write("This message comes from Tornado ^_^")

class JSONPHandler(RequestHandler):

    def jsonp_encode(self, msg):
        self.set_header("Content-Type", "text/javascript; charset=UTF-8")
        callback = self.get_argument('callback')
        raw = json.dumps(msg)
        return "%s(%s)" % (callback, raw)


class ChatRoom(object):
    '''
    users = { uid: user }
    user = {
        'uid': int,
        'uname': str,
        'waiters': [],
        'sessions': list,
    }
    sessions = { sid: session }
    session = {
        'sid': int,
        'sname': none,
        'owner': user,
        'users': [user],
    }
    '''
    sessions = {
        0: {
            'sid': 0,
            'sname': 'broadcast',
            'users': [],
        }
    }
    users = {}
    session_count = 1 

    def waiting(self, callback, **user_raw):
        '''
        user_raw = {
            'uid': int, 
            'uname': str 
        }
        '''
        cls = ChatRoom
        uid = user_raw['uid']
        users = cls.users
        if uid in users.keys():
            user = users[uid]
        else:
            user = {
                'uid': uid,
                'uname': user_raw['uname'],
                'sessions': [],
                'waiters': [], 
            }
            users[uid] = user
            bc = cls.sessions[0]
            bc['users'].append(user)
            user['sessions'].append(bc)

        user['waiters'].append(callback)

    def sending(self, msg, user):
        '''user is not uid but a dict'''
        for callback in user['waiters']:
            try:
                callback(msg)
            except:
                pass
        user['waiters'] = []

    def cancel_wait(self, uid, callback):
        cls = ChatRoom
        user = cls.users[uid]
        user['waiters'].remove(callback)
        if not user['waiters']:
            for session in user['sessions']:
                self.rm_user(session['sid'], user['uid'])
            cls.users.pop(uid)

    def new_msg(self, sid, msg):
        cls = ChatRoom
        session = cls.sessions[sid]
        for user in session['users']:
            self.sending(msg, user)

    def new_session(self, **sraw):
        '''
        sraw = {
            'sname': option,
            'oid': the owner id
            'uids': users id
        }
        '''
        cls = ChatRoom
        sc = cls.session_count
        cls.session_count += 1 
        session = {
            'sid': sc,
            'sname': sraw.get('sname', None),
            'owner': cls.users[sraw['oid']],
            'users': [cls.users[uid] for uid in sraw['uids']]
        }
        cls.sessions[sc] = session
        dumped = self.dump_session(session)
        msg = {
            'cmd': 'new_session',
            'session': dumped,
        }
        for user in session['users']:
            self.sending(msg, user)
            user['sessions'].append(session)
        return dumped 

    def add_user(self, sid, uid):
        cls = ChatRoom
        session = cls.sessions[sid]
        user = cls.users[uid]
        user['sessions'].append(session)
        session['users'].append(user)
        msg = {
            'cmd': 'add_user',
            'session': self.dump_session(session),
        }
        self.sending(msg, user)

    def rm_user(self, sid, uid):
        cls = ChatRoom
        session = cls.sessions[sid]
        user = cls.users[uid]
        user['sessions'].remove(session)
        session['users'].remove(user)
        if not session['users'] and sid != 0:
            cls.sessions.pop(sid)
        else:
            msg = {
                'cmd': 'rm_user',
                'user': self.dump_user(user),
                'sid': sid,
            }
            self.new_msg(sid, msg)
            
    def get_online(self):
        cls = ChatRoom
        return self.dump_users(cls.users.values())

    def get_session_users(self, sid):
        cls = ChatRoom
        users = cls.sessions[sid]['users']
        return self.dump_users(users)

    #some help function
    def get_user(self, uid):
        cls = ChatRoom
        return cls.users[uid]
    
    def get_session_user(self, sid):
        cls = ChatRoom
        return cls.sessions[sid]

    def dump_user(self, user):
        return {'uid': user['uid'], 'uname': user['uname']}

    def dump_users(self, users):
        return [self.dump_user(user) for user in users]

    def dump_session(self, session):
        return {
            'sid': session['sid'],
            'sname': session['sname'], 
            'owner': self.dump_user(session['owner']),
            'users': self.dump_users(session['users']),
        }

class UpdateHandler(JSONPHandler, ChatRoom):
    
    @tornado.web.asynchronous
    def get(self):
        '''
        args = {
            'uid': int,
            'uname': str,
        }
        '''
        args = json.loads(self.get_argument("args"))
        self.callback = self.on_new_msg
        self.uid = args['uid']
        self.waiting(self.on_new_msg, **args)

    def on_new_msg(self, msg):
        if self.request.connection.stream.closed():
            return
        self.finish(self.jsonp_encode(dict(msg=msg)))

    def on_connection_close(self):
        self.cancel_wait(self.uid, self.callback)

class AddUserHandler(JSONPHandler, ChatRoom):

    def get(self):
        '''
        args = {
            'sid': int
            'uids': [int]
        }
        '''
        args = json.loads(self.get_argument("args"))
        for uid in args['uids']:
            self.add_user(sid=args['sid'], uid=uid)
        self.write(self.jsonp_encode(dict(success=True)))

class NewSessionHandler(JSONPHandler, ChatRoom):

    def get(self):
        '''
        args = {
            'sname': option,
            'oid': the owner id
            'uids': users id
        }
        '''
        args = json.loads(self.get_argument("args"))
        session = self.new_session(**args) 
        self.write(self.jsonp_encode(dict(session=session)))

class OnlineHandler(JSONPHandler, ChatRoom):

    def get(self):
        users = self.get_online()
        self.write(self.jsonp_encode(dict(users=users)))


class RemoveUserHandler(JSONPHandler, ChatRoom):

    def get(self):
        '''
        args = {
            'sid': int,
            'uid': int,
        }
        '''
        args = json.loads(self.get_argument("args"))
        self.rm_user(**args)
        msg = {
            'cmd': 'rm_user',
            'result': True,
        }
        self.write(self.jsonp_encode(dict(msg=msg)))
        
class SessionUserHandler(JSONPHandler, ChatRoom):

    def get(self):
        '''
        args = {
            sid: int
        }
        '''
        args = json.loads(self.get_argument("args"))
        users = self.get_session_users(args['sid'])
        self.write(self.jsonp_encode(dict(users=users)))
        
         

class MsgHandler(JSONPHandler, ChatRoom):

    def get(self):
        '''
        args = {
            'uid': int,
            'sid': int,
            'msg': str
        }
        msg = {
            'cmd': 'new_msg',
            'user': user,
            'msg': msg,
            'sid': int,
        }
        '''
        args = json.loads(self.get_argument("args"))
        user = self.get_user(args['uid'])
        msg = {
            'cmd': 'new_msg',
            'user': self.dump_user(user),
            'msg': args['msg'],
            'sid': args['sid'], 
        }
        self.new_msg(args['sid'], msg)
        self.write(self.jsonp_encode(dict(msg=msg)))
        

tr = WSGIContainer(app)

application = Application([
    (r"/main", MainHandler),
    (r"/m/update", UpdateHandler),
    (r"/m/add_user", AddUserHandler),
    (r"/m/new_session", NewSessionHandler),
    (r"/m/get_online", OnlineHandler),
    (r"/m/rm_user", RemoveUserHandler),
    (r"/m/new_msg", MsgHandler),
    (r"/m/get_session_user", SessionUserHandler),
    (r".*", FallbackHandler, dict(fallback=tr)),
], **{ 
    'static_path': os.path.join(os.path.dirname(__file__), "static"),
})

if __name__ == "__main__":
    application.listen(8000)
    IOLoop.instance().start()
