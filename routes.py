import os
from datetime import datetime
from flask import render_template, url_for, flash, redirect, request, abort, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from app import app, db
from models import User, Material, Tag, Rating
from forms import RegistrationForm, LoginForm, MaterialForm, RatingForm, SearchForm

# Make datetime available to all templates
@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

@app.route('/')
@app.route('/home')
def home():
    recent_materials = Material.query.order_by(Material.publish_date.desc()).limit(6).all()
    search_form = SearchForm()
    popular_tags = Tag.query.join(Tag.materials).group_by(Tag.id).order_by(db.func.count().desc()).limit(10).all()
    return render_template('index.html', title='Home', materials=recent_materials, 
                          search_form=search_form, popular_tags=popular_tags)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in.', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login unsuccessful. Please check email and password.', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/profile')
@login_required
def profile():
    user_materials = Material.query.filter_by(user_id=current_user.id).all()
    user_ratings = Rating.query.filter_by(rated_id=current_user.id).all()
    avg_rating = 0
    if user_ratings:
        avg_rating = sum(r.score for r in user_ratings) / len(user_ratings)
    return render_template('profile.html', title='Profile', materials=user_materials, 
                          ratings=user_ratings, avg_rating=avg_rating)

@app.route('/material/<int:material_id>')
def material_details(material_id):
    material = Material.query.get_or_404(material_id)
    rating_form = RatingForm()
    return render_template('material_details.html', title=material.title, material=material, form=rating_form)

@app.route('/material/new', methods=['GET', 'POST'])
@login_required
def add_material():
    form = MaterialForm()
    # Populate tag choices from the database
    form.tags.choices = [(tag.id, tag.name) for tag in Tag.query.all()]
    
    if form.validate_on_submit():
        material = Material(
            title=form.title.data,
            description=form.description.data,
            price=form.price.data,
            condition=form.condition.data,
            location=form.location.data,
            material_type=form.material_type.data,
            course_code=form.course_code.data,
            subject=form.subject.data,
            user_id=current_user.id
        )
        
        # Add selected tags
        selected_tags = Tag.query.filter(Tag.id.in_(form.tags.data)).all()
        material.tags = selected_tags
        
        # Add new tags if specified
        if form.new_tags.data:
            new_tag_names = [t.strip() for t in form.new_tags.data.split(',')]
            for tag_name in new_tag_names:
                if tag_name:
                    existing_tag = Tag.query.filter_by(name=tag_name).first()
                    if not existing_tag:
                        new_tag = Tag(name=tag_name, category='custom')
                        db.session.add(new_tag)
                        material.tags.append(new_tag)
                    else:
                        material.tags.append(existing_tag)
        
        db.session.add(material)
        db.session.commit()
        flash('Your material has been added!', 'success')
        return redirect(url_for('home'))
    
    return render_template('add_material.html', title='Add Material', form=form, legend='Add New Material')

@app.route('/material/<int:material_id>/update', methods=['GET', 'POST'])
@login_required
def update_material(material_id):
    material = Material.query.get_or_404(material_id)
    if material.owner != current_user:
        abort(403)
    
    form = MaterialForm()
    form.tags.choices = [(tag.id, tag.name) for tag in Tag.query.all()]
    
    if form.validate_on_submit():
        material.title = form.title.data
        material.description = form.description.data
        material.price = form.price.data
        material.condition = form.condition.data
        material.location = form.location.data
        material.material_type = form.material_type.data
        material.course_code = form.course_code.data
        material.subject = form.subject.data
        material.availability = form.availability.data
        
        # Update tags
        selected_tags = Tag.query.filter(Tag.id.in_(form.tags.data)).all()
        material.tags = selected_tags
        
        # Add new tags if specified
        if form.new_tags.data:
            new_tag_names = [t.strip() for t in form.new_tags.data.split(',')]
            for tag_name in new_tag_names:
                if tag_name:
                    existing_tag = Tag.query.filter_by(name=tag_name).first()
                    if not existing_tag:
                        new_tag = Tag(name=tag_name, category='custom')
                        db.session.add(new_tag)
                        material.tags.append(new_tag)
                    else:
                        material.tags.append(existing_tag)
        
        db.session.commit()
        flash('Your material has been updated!', 'success')
        return redirect(url_for('material_details', material_id=material.id))
    
    elif request.method == 'GET':
        form.title.data = material.title
        form.description.data = material.description
        form.price.data = material.price
        form.condition.data = material.condition
        form.location.data = material.location
        form.material_type.data = material.material_type
        form.course_code.data = material.course_code
        form.subject.data = material.subject
        form.availability.data = material.availability
        form.tags.data = [tag.id for tag in material.tags]
    
    return render_template('add_material.html', title='Update Material', 
                          form=form, legend='Update Material')

@app.route('/material/<int:material_id>/delete', methods=['POST'])
@login_required
def delete_material(material_id):
    material = Material.query.get_or_404(material_id)
    if material.owner != current_user:
        abort(403)
    db.session.delete(material)
    db.session.commit()
    flash('Your material has been deleted!', 'success')
    return redirect(url_for('home'))

@app.route('/rate/<int:material_id>/<int:user_id>', methods=['POST'])
@login_required
def rate_user(material_id, user_id):
    form = RatingForm()
    if form.validate_on_submit():
        if user_id == current_user.id:
            flash('You cannot rate yourself!', 'danger')
            return redirect(url_for('material_details', material_id=material_id))
        
        # Check if already rated
        existing_rating = Rating.query.filter_by(
            rater_id=current_user.id, 
            rated_id=user_id,
            material_id=material_id
        ).first()
        
        if existing_rating:
            existing_rating.score = form.score.data
            existing_rating.comment = form.comment.data
            existing_rating.timestamp = datetime.utcnow()
            flash('Your rating has been updated!', 'success')
        else:
            rating = Rating(
                score=form.score.data,
                comment=form.comment.data,
                material_id=material_id,
                rater_id=current_user.id,
                rated_id=user_id
            )
            db.session.add(rating)
            flash('Your rating has been submitted!', 'success')
        
        db.session.commit()
    return redirect(url_for('material_details', material_id=material_id))

@app.route('/search', methods=['GET', 'POST'])
def search():
    form = SearchForm()
    
    if request.method == 'POST' and form.validate_on_submit():
        query = form.query.data
        material_type = form.material_type.data
        tags = request.form.getlist('tags')
        sort_by = form.sort_by.data
        
        # Start with base query
        materials_query = Material.query
        
        # Apply text search if provided
        if query:
            materials_query = materials_query.filter(
                db.or_(
                    Material.title.contains(query),
                    Material.description.contains(query),
                    Material.course_code.contains(query),
                    Material.subject.contains(query)
                )
            )
        
        # Filter by material type if provided
        if material_type and material_type != 'all':
            materials_query = materials_query.filter(Material.material_type == material_type)
        
        # Filter by tags if provided
        if tags:
            materials_query = materials_query.join(Material.tags).filter(Tag.id.in_(tags))
        
        # Apply sorting
        if sort_by == 'recent':
            materials_query = materials_query.order_by(Material.publish_date.desc())
        elif sort_by == 'price_low':
            materials_query = materials_query.order_by(Material.price.asc())
        elif sort_by == 'price_high':
            materials_query = materials_query.order_by(Material.price.desc())
        elif sort_by == 'relevance':
            # For relevance, we prioritize exact matches in title and course code
            if query:
                materials_query = materials_query.order_by(
                    db.case([(Material.title.contains(query), 1)], else_=2),
                    db.case([(Material.course_code.contains(query), 1)], else_=2)
                )
        
        materials = materials_query.all()
        
        return render_template('search_results.html', 
                              title='Search Results', 
                              materials=materials, 
                              form=form,
                              query=query,
                              count=len(materials))
    
    # For GET requests, display search form with no results
    all_tags = Tag.query.all()
    return render_template('search_results.html', title='Search', form=form, all_tags=all_tags, materials=[])

@app.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    return jsonify([{'id': tag.id, 'name': tag.name, 'category': tag.category} for tag in tags])

# API route to get materials for homepage or filtering
@app.route('/api/materials', methods=['GET'])
def get_materials():
    materials = Material.query.order_by(Material.publish_date.desc()).limit(12).all()
    result = []
    for material in materials:
        result.append({
            'id': material.id,
            'title': material.title,
            'description': material.description,
            'price': material.price,
            'condition': material.condition,
            'material_type': material.material_type,
            'course_code': material.course_code,
            'subject': material.subject,
            'image_url': material.image_url,
            'owner': material.owner.username,
            'publish_date': material.publish_date.strftime('%Y-%m-%d'),
            'tags': [{'id': tag.id, 'name': tag.name} for tag in material.tags]
        })
    return jsonify(result)

# Initialize some test data
# Initialize database with sample data
def initialize_data():
    # Only run this if the database is empty
    if not User.query.first():
        # Define default tags
        default_tags = [
            ('Computer Science', 'subject'),
            ('Mathematics', 'subject'),
            ('Physics', 'subject'),
            ('CS101', 'course'),
            ('MATH201', 'course'),
            ('PHYS301', 'course'),
            ('Textbook', 'material_type'),
            ('Notes', 'material_type'),
            ('Solution Manual', 'material_type'),
            ('Spring 2023', 'semester'),
            ('Fall 2023', 'semester'),
            ('Programming', 'subject'),
            ('Calculus', 'subject'),
            ('Statistics', 'subject'),
            ('Engineering', 'subject')
        ]
        
        # Add each tag if it doesn't already exist
        for name, category in default_tags:
            if not Tag.query.filter_by(name=name).first():
                tag = Tag(name=name, category=category)
                db.session.add(tag)
        
        db.session.commit()
