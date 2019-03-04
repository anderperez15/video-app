import os
import sys
from flask import Flask, flash,request, render_template, redirect, url_for, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from script import procesar_video
from database import database

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set(['gif','avi','mp4', 'mov'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
import string
import random

ROOT_PATH = os.path.dirname(os.path.realpath(__file__))
os.environ.update({'ROOT_PATH': ROOT_PATH})
sys.path.append(os.path.join(ROOT_PATH, 'modules'))
db = database('test.db')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def new_random_name_title ():
	return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(28))

@app.route('/')
def index():
	""" static files serve """
	return send_from_directory('static', 'index.html')

@app.route('/galery')
def galery():
	""" static files serve """
	return send_from_directory('static', 'index.html')

@app.route('/procesar-video')
def editor():
	""" static files serve """
	return send_from_directory('static', 'index.html')

@app.route('/view/<name>')
def view(name):
	db.view(name)
	return jsonify({'status':200})

@app.route('/videos/<n>')
def videos(n):
	return jsonify({'list':db.list_videos(n)})

@app.route('/<path:path>')
def static_proxy(path):
    """ static folder serve """
    file_name = path.split('/')[-1]
    dir_name = os.path.join('static/', '/'.join(path.split('/')[:-1]))
    return send_from_directory(dir_name, file_name)

@app.route('/upload/<filtro>', methods=['GET', 'POST'])
def upload_file(filtro):
	filter = 'efect'+filtro+'.mp4'
	if request.method == 'POST':
	    # check if the post request has the file part
		if 'file' not in request.files:
			return jsonify({'status':404,'message':'file empty'})
		file = request.files['file']
		# if user does not select file, browser also
		# submit a empty part without filename
		if file.filename == '':
			return jsonify({'status':404,'message':'file empty'})
		if file and allowed_file(file.filename):
			id = new_random_name_title()
			filename = secure_filename(file.filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			procesar_video(filename,id,filter)
			db.save_video({'name':id,'view':0})
			if os.path.isfile('./uploads/'+id+'.mp4'):
				return  jsonify({'status':200, 'name':id})
			else:
				return jsonify({'status':404,'message':'your video could not be processed'})
		return jsonify({'status':404,'message':'format not allowed'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
	return send_from_directory(app.config['UPLOAD_FOLDER'],filename)