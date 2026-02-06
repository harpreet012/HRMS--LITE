from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# This will be imported from the main app
db = None

def init_db(app):
    global db
    from flask_sqlalchemy import SQLAlchemy
    db = SQLAlchemy(app)
    return db
