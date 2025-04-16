from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, TextAreaField, SelectField, SelectMultipleField, FloatField, IntegerField, HiddenField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError, NumberRange, Optional
from models import User

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is already taken. Please choose a different one.')
            
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is already registered. Please use a different one.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class MaterialForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired()])
    price = FloatField('Price (leave blank if free)', validators=[Optional()])
    condition = SelectField('Condition', choices=[
        ('new', 'New'), 
        ('like_new', 'Like New'), 
        ('good', 'Good'), 
        ('fair', 'Fair'), 
        ('poor', 'Poor')
    ], validators=[DataRequired()])
    location = StringField('Location', validators=[Optional(), Length(max=100)])
    material_type = SelectField('Material Type', choices=[
        ('textbook', 'Textbook'),
        ('notes', 'Lecture Notes'),
        ('practice_material', 'Practice Material'),
        ('solution_manual', 'Solution Manual'),
        ('other', 'Other')
    ], validators=[DataRequired()])
    course_code = StringField('Course Code', validators=[Optional(), Length(max=20)])
    subject = StringField('Subject', validators=[Optional(), Length(max=50)])
    availability = BooleanField('Currently Available', default=True)
    tags = SelectMultipleField('Tags', coerce=int)
    new_tags = StringField('Add New Tags (comma separated)', validators=[Optional()])
    submit = SubmitField('Submit')

class RatingForm(FlaskForm):
    score = SelectField('Rating', choices=[(1, '1 - Poor'), (2, '2 - Fair'), (3, '3 - Good'), (4, '4 - Very Good'), (5, '5 - Excellent')], coerce=int, validators=[DataRequired()])
    comment = TextAreaField('Comment')
    submit = SubmitField('Submit Rating')

class SearchForm(FlaskForm):
    query = StringField('Search', validators=[Optional()])
    material_type = SelectField('Type', choices=[
        ('all', 'All Types'),
        ('textbook', 'Textbook'),
        ('notes', 'Lecture Notes'),
        ('practice_material', 'Practice Material'),
        ('solution_manual', 'Solution Manual'),
        ('other', 'Other')
    ], default='all')
    sort_by = SelectField('Sort By', choices=[
        ('relevance', 'Relevance'),
        ('recent', 'Most Recent'),
        ('price_low', 'Price: Low to High'),
        ('price_high', 'Price: High to Low')
    ], default='relevance')
    tags = SelectMultipleField('Tags', coerce=int)
    submit = SubmitField('Search')
