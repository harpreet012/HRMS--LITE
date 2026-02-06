from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from config import MONGODB_URI, DEBUG, PORT

app = Flask(__name__, template_folder='app/templates', static_folder='app/static')

# Enable CORS for API routes (allow frontend dev server)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "*"]}})

# Import routes
from app.routes.employees import employees_bp
from app.routes.attendance import attendance_bp
from app.routes.dashboard import dashboard_bp
from app.routes.performance import performance_bp

# Register blueprints
app.register_blueprint(employees_bp, url_prefix='/api/employees')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(performance_bp, url_prefix='/api/performance')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health():
    return jsonify({
        'success': True,
        'message': 'Server is running',
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Route not found'
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print(f'MongoDB URI: {MONGODB_URI}')
    app.run(debug=DEBUG, port=PORT, host='0.0.0.0')
