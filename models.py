from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

# Junction table for material tags
material_tags = db.Table('material_tags',
    db.Column('material_id', db.Integer, db.ForeignKey('material.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)
    profile_image = db.Column(db.String(120), default='default_profile.svg')
    school = db.Column(db.String(100))
    bio = db.Column(db.Text)
    materials = db.relationship('Material', backref='owner', lazy=True)
    ratings_given = db.relationship('Rating', backref='rater', lazy=True, foreign_keys='Rating.rater_id')
    ratings_received = db.relationship('Rating', backref='rated', lazy=True, foreign_keys='Rating.rated_id')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Material(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float)
    condition = db.Column(db.String(50))
    location = db.Column(db.String(100))
    availability = db.Column(db.Boolean, default=True)
    material_type = db.Column(db.String(50), nullable=False)  # book, notes, practice material, etc.
    course_code = db.Column(db.String(20))
    subject = db.Column(db.String(50))
    publish_date = db.Column(db.DateTime, default=datetime.utcnow)
    image_url = db.Column(db.String(120), default='default_material.svg')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tags = db.relationship('Tag', secondary=material_tags, lazy='subquery',
                          backref=db.backref('materials', lazy=True))
    
    def __repr__(self):
        return f'<Material {self.title}>'

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    category = db.Column(db.String(50))  # course, subject, material type, semester
    
    def __repr__(self):
        return f'<Tag {self.name}>'

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)  # 1-5 rating
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    material_id = db.Column(db.Integer, db.ForeignKey('material.id'))
    rater_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rated_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def __repr__(self):
        return f'<Rating {self.score}>'
