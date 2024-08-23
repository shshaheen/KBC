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
    global registered_email
    global registered_name
    if(request.method == 'POST'):
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
            registered_email = email 
            registered_name = name
            msg = Message("From KBC",sender = 'kaunbanegacrorepati7963@gmail.com', recipients = [registered_email] )
            msg.body = f"""Dear {registered_name},

Thanks a bunch for signing up on our KBC website! 
We're super excited to have you on board. Get ready to test your knowledge, have some fun, and maybe even win some cool prizes.
We're looking forward to seeing you in action!

Best wishes,
The KBC Team
"""
            try:
                mail.send(msg)
            except Exception as e:
                flash(f"Failed to send email: {str(e)}")  # Print the error message for debugging
                # flash("Failed to send email. Please try again later.")
                print(e)
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

@app.route('/logout')
def logout():
    session.pop('email',None)
    return redirect('/')

@app.route('/dashboard')
def dashboard():
    if(session['name']):
        user = User.query.filter_by(email = session['email']).first()
        return render_template('dashboard.html',user = user)
    return redirect('/login')

@app.route('/play')
def play():
    return render_template('play.html')



@app.route('/quiz')
def quiz():
    return render_template('quiz.html')


@app.route('/timer')
def timer():
    return render_template('timer.html')

@app.route('/cheque')
def cheque():
    msg = Message("Thanks for Attending the Quiz!", sender='kaunbanegacrorepati7963@gmail.com', recipients=[registered_email])
    msg.body = f"""Dear {registered_name},

We wanted to reach out and give you a huge shout-out for not just registering on our KBC quiz site but also for diving right into the quiz! The quiz has now ended, and we hope you enjoyed the experience.

Remember, every quiz is a chance to learn something new, challenge yourself, and maybe even come out on top as a winner! We're excited to see you continue participating, sharpening your skills, and having fun along the way. Keep going—your next big win could be just around the corner!

Thanks again for being a part of our KBC community.

Best regards,
The KBC Team
"""
    try:
        mail.send(msg)
    except Exception as e:
        print(e)
        flash(f"Failed to send email: {str(e)}")  # Print the error message for debugging
    return render_template('cheque.html',registered_name = registered_name)

@app.route('/lose')
def lose():
    msg = Message("Thanks for Attending the Quiz!", sender='kaunbanegacrorepati7963@gmail.com', recipients=[registered_email])
    msg.body = f"""Dear {registered_name},

We wanted to reach out and give you a huge shout-out for not just registering on our KBC quiz site but also for diving right into the quiz! The quiz has now ended, and we hope you enjoyed the experience.

Remember, every quiz is a chance to learn something new, challenge yourself, and maybe even come out on top as a winner! We're excited to see you continue participating, sharpening your skills, and having fun along the way. Keep going—your next big win could be just around the corner!

Thanks again for being a part of our KBC community.

Best regards,
The KBC Team
"""
    try:
        mail.send(msg)
    except Exception as e:
        print(e)
        flash(f"Failed to send email: {str(e)}")  # Print the error message for debugging
    return render_template('lose.html')


# @app.route('/send_email')
# def send_email():
#     msg = Message("Hey",sender = 'kaunbanegacrorepati7963@gmail.com', recipients = ['rr200094@rguktrkv.ac.in'] )
#     msg.body = f"Hello {registered_name},\n\nQuiz has ended\n\nBest regards,\nYour KBC Team"
#     try:
#         mail.send(msg)
#     except Exception as e:
#         print(e)
#         flash(f"Failed to send email: {str(e)}")  # Print the error message for debugging
#     return render_template('home.html')
#         # flash("Failed to send email. Please try again later.")

@app.route('/save-image', methods=['POST'])
def save_image():
    try:
        data = request.json
        img_data = data['image']

        # Ensure we correctly parse the base64 data
        img_data = img_data.split(',')[1]
        img_data = base64.b64decode(img_data)
        
        # Save the image to a file
        home_dir = os.path.expanduser('~')
        file_path = os.path.join(home_dir, 'cheque.png')

        with open(file_path, 'wb') as f:
            f.write(img_data)
        send_email()
        return jsonify({"message": "Image saved successfully!"})
    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    


if(__name__ == '__main__'):
    app.run(debug=True)

