# CampusBookShare

## Overview
CampusBookShare is a Flask-based web platform that facilitates the sharing and trading of academic materials among students within a campus community. The platform promotes collaborative learning and resource optimization through a user-friendly interface for managing academic materials.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Development Guidelines](#development-guidelines)
- [Security](#security)

## Features
- **User Management**
  - User registration and authentication
  - Profile customization
  - User rating system
  - Secure password handling

- **Material Management**
  - Create, read, update, and delete academic materials
  - Material categorization with tags
  - Price and availability tracking
  - Condition and location information

- **Rating System**
  - User-to-user ratings
  - Material ratings and reviews
  - Comment system

## Prerequisites
- Python 3.8 or higher
- SQLite/PostgreSQL
- Git

## Project Structure
```
CampusBookShare/
├── models.py          # Database models
├── requirements.txt   # Project dependencies
├── .env              # Environment variables
├── static/           # Static files
│   ├── default_profile.svg
│   └── default_material.svg
└── instance/         # SQLite database
```

## Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd CampusBookShare
```

# If setting up a new repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-repository-url]
git branch -M main
git push -u origin main
```

# If updating existing repository:
```bash
git add .
git commit -m "Update project files"
git push
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration
1. Create `.env` file with:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///instance/campusbookshare.db
```

2. Ensure proper permissions for:
   - `instance/` directory
   - `static/` directory

## Database Setup
Initialize the database:
```python
from app import db
db.create_all()
```

## Running the Application
1. Start the Flask server:
```bash
flask run
```
2. Access the application at `http://localhost:5000`

## Testing
Run tests and generate coverage report:
```bash
pytest tests/
coverage run -m pytest
coverage report
```

## Development Guidelines
- Follow PEP 8 coding standards
- Use provided extensions:
  - Flask-Login for authentication
  - SQLAlchemy for database operations
  - WTForms for form handling
  - Pillow for image processing

## Security
- Password hashing using Werkzeug
- Session management with Flask-Login
- CSRF protection via Flask-WTF
- Input validation on all forms

## Model Relationships
- Users can own multiple materials (One-to-Many)
- Materials can have multiple tags (Many-to-Many)
- Users can give and receive ratings (One-to-Many)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
