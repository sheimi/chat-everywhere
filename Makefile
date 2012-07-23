all: js less other

other:
	cp -r assets/img static/img
	cp -r assets/font static/font

less:
	lessc --compress assets/less/chat.less > static/css/chat.css
	lessc --compress assets/less/chat2.less > static/css/chat2.css

js:
	cat assets/js/underscore.js > static/js/chat.js
	cat assets/js/jquery/jquery.js >> static/js/chat.js
	cat assets/js/jquery/jquery.easing.1.3.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.core.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.widget.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.mouse.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.draggable.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.resizable.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.core.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.util.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.jquery.js >> static/js/chat.js
	cat assets/js/sheimi/chat/sheimi.chat.js >> static/js/chat.js
	#chat2.js
	cat static/js/chat.js > static/js/chat2.js
	cat assets/js/chat-view.js >> static/js/chat.js
	cat assets/js/sheimi/chat/sheimi.chat.room.js >> static/js/chat2.js
