# HRMS Lite Deployment Guide

This guide covers deploying HRMS Lite to production using free/affordable services.

## Deployment Architecture

```
Frontend (Vercel)  <-->  Backend (Render)  <-->  Database (MongoDB Atlas)
```

## Prerequisites

- GitHub Account
- Vercel Account (free)
- Render Account (free)
- MongoDB Atlas Account (free)
- Git installed locally

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up with your email
- Create an organization and project

### 1.2 Create a Cluster
- Choose free tier
- Select your preferred region (closest to your users)
- Create cluster (takes 5-10 minutes)

### 1.3 Create Database User
- Go to Database Access
- Add new database user
- Username: `hrms_user`
- Password: `hrmslite123` (or generate a strong password)
- Add user

### 1.4 Get Connection String
- Go to Clusters → Connect → Connect your application
- Copy MongoDB URI (connection string)
- Replace `<password>` and `<username>` with your credentials
- Example: `mongodb+srv://hrms_user:hrmslite123@cluster0.mongodb.net/hrms-lite?retryWrites=true&w=majority`

### 1.5 Whitelist IP
- In Network Access, add IP address: `0.0.0.0/0` (allows all IPs, use with caution)
- Or add specific IPs of your deployment services

## Step 2: Prepare for GitHub

### 2.1 Create GitHub Repository
```bash
# In the project root directory
git init
git add .
git commit -m "Initial commit: HRMS Lite full-stack application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git push -u origin main
```

### 2.2 Project Structure in GitHub
```
hrms-lite/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── .gitignore       # Git ignore file
└── README.md        # Project documentation
```

## Step 3: Deploy Backend to Render

### 3.1 Connect Repository to Render
- Go to https://render.com
- Sign up with GitHub
- Create new Web Service
- Connect your GitHub repository
- Select `backend` folder
- Configure:
  - Name: `hrms-lite-backend`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`

### 3.2 Set Environment Variables
In Render dashboard, add:
```
MONGODB_URI=mongodb+srv://hrms_user:hrmslite123@cluster0.mongodb.net/hrms-lite?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

### 3.3 Deploy
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Get your backend URL: `https://hrms-lite-backend.onrender.com`

**Note:** Render free tier may go inactive after 15 minutes of no requests. Upgrade to paid for production use.

## Step 4: Deploy Frontend to Vercel

### 4.1 Configure Frontend for Production
Edit `frontend/.env.production`:
```
REACT_APP_API_URL=https://hrms-lite-backend.onrender.com/api
```

### 4.2 Deploy to Vercel
- Go to https://vercel.com
- Sign up with GitHub
- Click "Add New" → "Project"
- Select your repository
- Configure:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `build`

### 4.3 Set Environment Variables
In Vercel dashboard, add:
```
REACT_APP_API_URL=https://hrms-lite-backend.onrender.com/api
```

### 4.4 Deploy
- Click "Deploy"
- Wait for deployment (2-3 minutes)
- Get your frontend URL: `https://hrms-lite.vercel.app`

## Step 5: Update API Configuration

### 5.1 Update Backend CORS
If you want to restrict CORS, update in `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://hrms-lite.vercel.app',
  credentials: true
}));
```

### 5.2 Test API
- Access backend health check:
  ```
  https://hrms-lite-backend.onrender.com/api/health
  ```
- Should return:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-02-06T10:15:00.000Z"
  }
  ```

## Step 6: Verify Deployment

### 6.1 Test Employee Management
- Navigate to Frontend URL
- Go to Employees page
- Try adding an employee
- Verify employee appears in list

### 6.2 Test Attendance Management
- Go to Attendance page
- Mark attendance for created employee
- Verify records appear

### 6.3 Test Dashboard
- Navigate to Home/Dashboard
- Verify statistics load correctly

## 📊 URLs After Deployment

- **Frontend**: `https://hrms-lite.vercel.app`
- **Backend API**: `https://hrms-lite-backend.onrender.com/api`
- **Backend Health**: `https://hrms-lite-backend.onrender.com/api/health`

## 🔧 Manual Deployment (Alternative)

### Using Heroku (Deprecated but working with cost)
- Backend can also be deployed to Heroku
- Frontend to AWS S3 + CloudFront
- See specific platform documentation

## ⚠️ Common Issues & Solutions

### Issue: Blank Frontend Page
**Solution:**
- Check browser console for errors (F12)
- Verify `REACT_APP_API_URL` is set correctly
- Ensure backend is running and accessible

### Issue: "Cannot POST /api/employees"
**Solution:**
- Verify backend is deployed successfully
- Check MongoDB URI is correct
- Review backend logs in Render dashboard

### Issue: CORS Errors
**Solution:**
- Ensure CORS is enabled in backend
- Check origin URLs in CORS configuration
- Frontend URL should be whitelisted in backend

### Issue: Database Connection Timeout
**Solution:**
- Verify MongoDB Atlas IP whitelist includes service IP
- Check MongoDB URI credentials
- Ensure network access is enabled

## 🔐 Security Notes

- **MongoDB Credentials**: Keep in environment variables only
- **IP Whitelisting**: Use specific IPs instead of `0.0.0.0/0` in production
- **CORS**: Restrict to specific frontend domain
- **API Keys**: Never commit sensitive data to Git

## 📈 Performance Optimization

### Frontend
- Minification: Automatic with React build
- Code splitting: Implement with React.lazy()
- CDN: Vercel provides automatic CDN

### Backend
- Database indexing: Already configured
- Caching: Implement for frequently accessed data
- Rate limiting: Add express-rate-limit for API

## 💰 Cost Estimate

- **MongoDB Atlas**: Free (up to 512 MB)
- **Vercel**: Free (with limitations)
- **Render**: Free (with 15-min inactivity sleep)
- **Total**: $0/month for proof of concept

For production with 24/7 uptime, consider:
- MongoDB Atlas: $9+/month
- Vercel: Free
- Render: $7+/month
- **Total**: ~$16/month

## 🚀 Next Steps

1. Push code to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Test all functionality
5. Share URLs with stakeholders
6. Monitor logs and performance

## 📞 Support

For deployment issues:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

**Remember**: Always test changes locally before pushing to production!
