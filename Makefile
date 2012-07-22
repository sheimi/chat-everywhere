all: js less

less:
	lessc --compress assets/less/chat.less > static/css/chat.css

js:
	cat assets/js/underscore.js > static/js/chat.js
	cat assets/js/jquery/jquery.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.core.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.widget.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.mouse.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.draggable.js >> static/js/chat.js
	cat assets/js/jquery/jquery.ui.resizable.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.core.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.util.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.jquery.js >> static/js/chat.js
	cat assets/js/sheimi/sheimi.chat.js >> static/js/chat.js
	cat assets/js/chat-view.js >> static/js/chat.js
