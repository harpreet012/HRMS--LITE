# Setup and Run Guide for HRMS Lite

## 🚀 Quick Start

### Local Development Setup

#### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm start
```

Backend runs on: `http://localhost:5000`

#### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## 📋 Prerequisites

- **Node.js**: 14.x or higher
- **npm**: 6.x or higher
- **MongoDB**: Local instance OR MongoDB Atlas account
- **Git**: For version control

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create a free cluster
3. Create database user credentials
4. Get connection string
5. Update `.env` in backend folder:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/hrms-lite
PORT=5000
NODE_ENV=development
```

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── models/                 # Mongoose schemas
│   │   ├── Employee.js
│   │   └── Attendance.js
│   ├── controllers/            # Business logic
│   │   ├── employeeController.js
│   │   └── attendanceController.js
│   ├── routes/                 # API endpoints
│   │   ├── employees.js
│   │   └── attendance.js
│   ├── middleware/             # Validation
│   │   └── validation.js
│   ├── server.js               # Express app
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── UI.js           # Reusable UI components
│   │   │   ├── Dashboard.js
│   │   │   ├── EmployeeForm.js
│   │   │   ├── EmployeeList.js
│   │   │   ├── AttendanceForm.js
│   │   │   └── AttendanceList.js
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── EmployeesPage.js
│   │   │   └── AttendancePage.js
│   │   ├── services/           # API calls
│   │   │   └── api.js
│   │   ├── App.js              # Main component
│   │   ├── index.js            # Entry point
│   │   └── index.css
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── .gitignore
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Deployment guide
└── .gitignore                  # Root level git ignore
```

## 🔌 API Endpoints

### Employees

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/employees` | Add new employee | `{employeeId, fullName, email, department}` |
| GET | `/api/employees` | Get all employees | - |
| GET | `/api/employees/:id` | Get employee by ID | - |
| DELETE | `/api/employees/:id` | Delete employee | - |

### Attendance

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/attendance` | Mark attendance | `{employeeId, date, status}` |
| GET | `/api/attendance` | Get all records | - |
| GET | `/api/attendance/employee/:employeeId` | Get employee's attendance | - |
| PATCH | `/api/attendance/:id` | Update attendance | `{status}` |
| DELETE | `/api/attendance/:id` | Delete attendance record | - |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |

## 🎯 Features Implementation Status

### Employee Management ✅
- [x] Add new employee
- [x] View all employees
- [x] Delete employee
- [x] Duplicate prevention (ID & Email)
- [x] Input validation

### Attendance Management ✅
- [x] Mark attendance
- [x] View attendance records
- [x] Filter by employee
- [x] Calculate present/absent days
- [x] Update attendance
- [x] Delete attendance

### Dashboard ✅
- [x] Total employees count
- [x] Total attendance records
- [x] Today's present count
- [x] Today's absent count

### UI Features ✅
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Success confirmations
- [x] Responsive design
- [x] Mobile navigation
- [x] Form validation
- [x] Table display

## 🧪 Testing Locally

### Test Employee Management

1. Open http://localhost:3000/employees
2. Fill in employee form:
   - Employee ID: EMP001
   - Full Name: John Doe
   - Email: john@example.com
   - Department: IT
3. Click "Add Employee"
4. Verify employee appears in the list
5. Click trash icon to delete

### Test Attendance Management

1. Open http://localhost:3000/attendance
2. Select employee from dropdown
3. Select date
4. Select status (Present/Absent)
5. Click "Mark Attendance"
6. Verify record appears in the list

### Test Dashboard

1. Open http://localhost:3000/
2. Verify statistics load:
   - Total Employees
   - Total Attendance Records
   - Present Today
   - Absent Today

## 🔧 Troubleshooting

### Backend Won't Start

**Error**: `Cannot find module 'express'`
```bash
cd backend
npm install
npm start
```

**Error**: `MongoDB connection error`
- Verify MongoDB is running
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas

### Frontend Won't Start

**Error**: `Module not found`
```bash
cd frontend
npm install
npm start
```

**Error**: `API connection failed`
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Check browser console (F12) for CORS errors

### Port Already in Use

**Backend port 5000**:
- Change PORT in backend `.env`
- Or kill existing process:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend port 3000**:
- It will ask to use a different port
- Or clear port and restart

## 📊 Environment Variables

### Backend (.env)

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update to your deployed backend URL.

## 🚀 Deploying to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick summary:
1. Set up MongoDB Atlas database
2. Push code to GitHub
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Update environment variables

## 📱 Using the Application

### Navigation

- **Home**: Dashboard with statistics
- **Employees**: Manage employees (add/view/delete)
- **Attendance**: Mark and view attendance

### Add Employee

1. Navigate to Employees page
2. Fill in form details
3. Click "Add Employee"
4. Verify in employee list

### Mark Attendance

1. Navigate to Attendance page
2. Select employee
3. Select date
4. Select status
5. Click "Mark Attendance"
6. View in attendance records

### View Statistics

1. Navigate to Home/Dashboard
2. See real-time statistics

## ✨ Best Practices

1. **Always use environment variables** for sensitive data
2. **Test locally before deploying** to production
3. **Keep validation** on both frontend and backend
4. **Handle errors gracefully** with user-friendly messages
5. **Use HTTPS** in production
6. **Whitelist IP addresses** in database security

## 📝 Code Quality

- Clean, readable code
- Proper error handling
- Input validation
- Component reusability
- Modular structure
- Well-documented APIs

## 🆘 Need Help?

- Check the README.md for project overview
- Review DEPLOYMENT.md for deployment issues
- Check browser console (F12) for frontend errors
- Check Render/Vercel logs for backend errors
- Check MongoDB Atlas logs for database issues

## 📞 Support Resources

- Express.js Documentation: https://expressjs.com/
- MongoDB Documentation: https://docs.mongodb.com/
- React Documentation: https://react.dev/
- Vercel Documentation: https://vercel.com/docs
- Render Documentation: https://render.com/docs

---

**Happy coding! 🎉**
