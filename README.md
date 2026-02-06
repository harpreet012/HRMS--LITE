# HRMS Lite - Human Resource Management System

A lightweight, full-stack Human Resource Management System built with modern technologies. This application enables admins to manage employees and track attendance efficiently.

## 🎯 Features

### Employee Management
- ✅ Add new employees with unique IDs
- ✅ View all employees in a structured list
- ✅ Delete employees
- ✅ Email validation and duplicate prevention
- ✅ Department assignment

### Attendance Management
- ✅ Mark attendance (Present/Absent)
- ✅ View attendance records by employee
- ✅ Filter attendance by employee
- ✅ Calculate present/absent counts
- ✅ Date-based attendance tracking

### Dashboard
- ✅ Overview of total employees
- ✅ Total attendance records count
- ✅ Today's attendance summary
- ✅ Quick statistics

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** 6.20.0 - Client-side routing
- **Axios** 1.6.0 - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.0.0 - MongoDB ODM
- **Express Validator** 7.0.0 - Input validation
- **CORS** 2.8.5 - Cross-origin resource sharing
- **Dotenv** 16.3.1 - Environment variables

## 📋 Prerequisites

- Node.js 14+ and npm
- MongoDB account (Atlas or local instance)
- Git
- A code editor (VS Code recommended)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hrms-lite
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# Update MONGODB_URI with your MongoDB connection string

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (already provided)
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend development server
npm start
# Application runs on http://localhost:3000
```

## 📚 API Endpoints

### Employee Endpoints
- `POST /api/employees` - Add new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `DELETE /api/employees/:id` - Delete employee

### Attendance Endpoints
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/employee/:employeeId` - Get employee's attendance
- `PATCH /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance record

## 🎨 UI Components

### Reusable Components
- `LoadingSpinner` - Shows loading state
- `ErrorAlert` - Displays error messages
- `SuccessAlert` - Displays success messages
- `EmptyState` - Shows empty state UI
- `Button` - Styled button component
- `Input` - Text input component
- `Select` - Dropdown component

### Feature Components
- `Dashboard` - Statistics overview
- `EmployeeForm` - Add new employee form
- `EmployeeList` - View all employees
- `AttendanceForm` - Mark attendance
- `AttendanceList` - View attendance records

## 📊 Data Validation

### Employee
- Employee ID: Required, unique, max 20 characters
- Full Name: Required, min 2 characters, max 100
- Email: Required, valid email format, unique
- Department: Required

### Attendance
- Employee ID: Required, must exist
- Date: Required, valid ISO8601 format
- Status: Required, must be "Present" or "Absent"
- Unique constraint on (employeeId, date)

## 🔒 Error Handling

The application includes comprehensive error handling:
- Input validation errors with specific messages
- Duplicate record prevention
- Database connection error handling
- Graceful error display in UI
- Proper HTTP status codes

## 📈 UI States

The application properly handles:
- **Loading State** - Shows spinner while fetching data
- **Empty State** - Shows helpful message when no data exists
- **Error State** - Displays error messages with close option
- **Success State** - Confirms successful operations

## 🌐 Responsive Design

- Mobile-first approach
- Mobile menu for navigation
- Responsive tables and forms
- Optimized for all screen sizes

## 📦 Project Structure

```
hrms-lite/
├── backend/
│   ├── models/
│   │   ├── Employee.js
│   │   └── Attendance.js
│   ├── controllers/
│   │   ├── employeeController.js
│   │   └── attendanceController.js
│   ├── routes/
│   │   ├── employees.js
│   │   └── attendance.js
│   ├── middleware/
│   │   └── validation.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmployeeForm.js
│   │   │   ├── EmployeeList.js
│   │   │   ├── AttendanceForm.js
│   │   │   └── AttendanceList.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── EmployeesPage.js
│   │   │   └── AttendancePage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
└── README.md
```

## 🔄 Workflow

1. **Add Employee** → Employee appears in employee list
2. **View Employees** → All employees displayed with options to delete
3. **Mark Attendance** → Select employee, date, and status
4. **View Attendance** → See records grouped by employee with statistics
5. **Dashboard** → View key metrics at a glance

## 📝 Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required)
- Employees have unique email addresses
- Employee ID is unique across the system
- Attendance can be marked for any date (past, present, future)
- Date format: YYYY-MM-DD

### Limitations
- No authentication/authorization system
- No employee photo upload
- No salary/payroll management
- No leave management
- No performance metrics
- No role-based access control
- Single admin, no user roles

### Future Enhancements
- User authentication and authorization
- Employee profiles with photos
- Leave management system
- Payroll integration
- Performance reviews
- Export reports to PDF/Excel
- Mobile application
- Email notifications
- Advanced search and filtering

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### API Connection Issues
- Verify backend is running on port 5000
- Check CORS configuration
- Verify API URL in frontend `.env`

### Port Already in Use
```bash
# Backend: Change port in server.js and .env
# Frontend: npx kill-port 3000
```

## 📱 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

HRMS Lite Development Team

## 🙏 Acknowledgments

- Tailwind CSS for styling utilities
- Lucide React for beautiful icons
- Express.js community
- MongoDB documentation

---

**Note**: This is a lightweight HRMS designed for small to medium-sized organizations. For enterprise deployments, consider additional security measures, authentication layers, and scalability enhancements.
