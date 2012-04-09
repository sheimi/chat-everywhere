from flask import Flask, render_template
app = Flask(__name__)

@app.route('/flask')
def hello_world():
    return render_template('demo.html')

@app.route('/flask2')
def h2():
    return render_template('demo2.html')
