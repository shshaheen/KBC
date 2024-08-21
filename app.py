from flask import Flask,request,render_template,url_for,redirect,session,flash
from flask_sqlalchemy import SQLAlchemy
from wtforms.validators import DataRequired
from werkzeug.security import generate_password_hash,check_password_hash
from flask_mail import Mail,Message
import os
import base64

registered_email = None  # Global variable
registered_name = "David"
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
app.secret_key = 'mysecretkey'

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'kaunbanegacrorepati7963@gmail.com'
app.config['MAIL_PASSWORD'] = 'fngu imnh quwy dvxk '
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(100))

    def __init__(self,email,password,name):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
    
    def check_password(self,password):
        return check_password_hash(self.password_hash,password)
        
with app.app_context():
    db.create_all()
    
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/instructions')
def instructions():
    return render_template('instructions.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

@app.route('/register',methods=['GET','POST'])
def register():
    if(request.method=='POST'):
        name = request.form['name']
        email = request.form['email']
        password_hash = request.form['password']
        user = User.query.filter_by(email=email).first()
        if(user):
            flash("Email  Already  registered!")
        else:
            new_user = User(name=name,email=email,password=password_hash)
            db.session.add(new_user)
            db.session.commit()
            return redirect('login')
        
    return render_template('register.html')

@app.route('/login',methods=['GET','POST'])
def login():
    if(request.method == 'POST'):
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()

        if(user and user.check_password(password)):
            session['name'] = user.name
            session['email'] = user.email
            session['password'] = user.password_hash
            # flash("Congratulations,You have successfully logged in!")
            return redirect('/play')
        else:
            flash('Login failed! Please recheck your username and password and try agian.')

    return render_template('login.html')

if(__name__ == '__main__'):
    app.run(debug=True)

