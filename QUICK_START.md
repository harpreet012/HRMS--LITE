# HRMS Lite - Quick Start for GitHub

This document provides instructions for setting up and deploying HRMS Lite from GitHub.

## 📋 What You're Getting

Complete, production-ready Human Resource Management System with:
- ✅ Employee management (add, view, delete)
- ✅ Attendance tracking (mark, view, filter)
- ✅ Professional dashboard
- ✅ Responsive UI
- ✅ Full-stack application
- ✅ Comprehensive documentation

## 🚀 5-Minute Quick Start (Local)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
cd hrms-lite
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
Server starts on `http://localhost:5000`

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm start
```
App opens on `http://localhost:3000`

### 4. Add Test Data
- Go to Employees page
- Add: ID=`EMP001`, Name=`John Doe`, Email=`john@test.com`, Dept=`IT`
- View in employee list
- Go to Attendance page
- Mark attendance for the employee
- View on Dashboard

Done! ✅

## 📚 Complete Documentation

- **[README.md](README.md)** - Project overview & features
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed local setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
- **[SUBMISSION.md](SUBMISSION.md)** - Complete submission details

## ☁️ Production Deployment (30-45 minutes)

### Prerequisites
- GitHub account (repository synced)
- MongoDB Atlas account
- Vercel account
- Render account

### Steps
1. **MongoDB Atlas**
   - Create free cluster
   - Set up database user
   - Get connection string

2. **Backend (Render)**
   - Connect GitHub repo
   - Deploy `/backend` folder
   - Set `MONGODB_URI` environment variable
   - Get backend URL: `https://hrms-lite-backend.onrender.com`

3. **Frontend (Vercel)**
   - Connect GitHub repo
   - Deploy `/frontend` folder
   - Set `REACT_APP_API_URL=https://hrms-lite-backend.onrender.com/api`
   - Get frontend URL: `https://hrms-lite.vercel.app`

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions.

## 🌐 After Deployment

Your app will be available at:
- **Frontend**: `https://hrms-lite.vercel.app`
- **Backend API**: `https://hrms-lite-backend.onrender.com/api`
- **Database**: MongoDB Atlas (free tier)

## 📁 Project Structure

```
hrms-lite/
├── backend/          # Node.js/Express API
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── middleware/   # Validation
│   └── server.js     # Express app
├── frontend/         # React app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API integration
│   │   └── App.js       # Main component
│   └── public/
└── docs/
    ├── README.md        # Project overview
    ├── SETUP_GUIDE.md   # Local setup
    ├── DEPLOYMENT.md    # Deployment guide
    └── SUBMISSION.md    # Submission details
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
# For production: https://your-backend-domain/api
```

## ✨ Features

### Employee Management
- Add employees with validation
- View all employees
- Delete employees
- Prevent duplicates

### Attendance Management
- Mark attendance (Present/Absent)
- View attendance history
- Filter by employee
- Calculate statistics

### Dashboard
- Real-time statistics
- Employee count
- Attendance summary
- Today's attendance

### UI/UX
- Responsive design
- Mobile navigation
- Loading states
- Error handling
- Success confirmations
- Empty states

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check MongoDB connection string
# Verify node_modules installed
cd backend && npm install
npm start
```

### Frontend Won't Connect
```bash
# Check API URL in .env
# Verify backend is running
# Check browser console (F12) for errors
```

### Port Already in Use
```bash
# Kill existing process (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed troubleshooting.

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| APIs | RESTful with Express Validator |
| Deployment | Vercel, Render, MongoDB Atlas |

## 📞 Support

- See **[README.md](README.md)** for detailed documentation
- See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for setup issues
- See **[DEPLOYMENT.md](DEPLOYMENT.md)** for deployment help
- Check browser console (F12) for errors
- Check backend logs in Render dashboard

## 📄 Files Included

### Documentation (4 files)
- `README.md` - Complete project documentation
- `SETUP_GUIDE.md` - Local development setup
- `DEPLOYMENT.md` - Production deployment guide
- `SUBMISSION.md` - Complete submission details

### Backend (7 files)
- `server.js` - Express server
- `package.json` - Dependencies
- `.env` - Configuration
- `models/` - Database schemas
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/` - Validation

### Frontend (15+ files)
- `package.json` - Dependencies
- `.env` - Configuration
- `src/App.js` - Main component
- `src/components/` - React components
- `src/pages/` - Page components
- `src/services/` - API integration
- `public/index.html` - HTML template

## ✅ Quality Checklist

- ✅ All core features working
- ✅ Bonus features implemented
- ✅ Responsive design
- ✅ Error handling
- ✅ Form validation
- ✅ Loading states
- ✅ Professional UI
- ✅ Complete documentation
- ✅ Ready for deployment
- ✅ Clean code structure

## 🎯 Next Steps

1. **Local Development**
   - Follow 5-Minute Quick Start above
   - Test all features locally
   - Review code structure

2. **Deployment**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up MongoDB Atlas
   - Deploy backend to Render
   - Deploy frontend to Vercel

3. **Verification**
   - Test all features in production
   - Share links with stakeholders
   - Monitor for issues

## 📝 Notes

- No authentication required (admin-only)
- Free tier deployments may have limitations
- See [DEPLOYMENT.md](DEPLOYMENT.md) for cost details
- Production recommendations included

## 🎉 You're All Set!

Everything is ready to go. Choose either:
- **Local Development**: Start with the 5-Minute Quick Start
- **Production**: Follow the Deployment section

Happy coding! 🚀

---

For detailed information, see the documentation files included in this repository.
