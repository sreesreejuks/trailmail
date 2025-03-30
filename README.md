# TrailMail - Professional Email Template Manager

<div align="center">
  <img src="frontend/public/trailmail-logo.png" alt="TrailMail Logo" width="200"/>
  <p>A modern email template manager for sending professional job applications</p>
</div>

## 🌟 Features

- 📧 **Dynamic Email Templates**: Customizable templates for job applications
- 🎯 **Smart Placeholders**: Easy personalization with dynamic content
- 📎 **File Attachments**: Support for resume and other document attachments
- 👥 **Multiple Recipients**: Support for CC and BCC
- 🔍 **Live Preview**: Real-time preview of your email before sending
- 🚀 **Easy Deployment**: Docker support for quick setup
- 🔒 **Secure**: Uses Gmail SMTP with app password authentication
- 💅 **Modern UI**: Built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - React Hook Form for form management
  - React Hot Toast for notifications

- **Backend**:
  - Node.js with Express
  - Nodemailer for email handling
  - Multer for file uploads
  - CORS for secure cross-origin requests

- **DevOps**:
  - Docker & Docker Compose
  - Nginx for serving frontend
  - Environment variables for configuration

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Gmail account with App Password ([How to generate?](#gmail-app-password-setup))
- Git (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sreesreejuks/trailmail.git
   cd trailmail
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env

   # Edit the .env file with your credentials
   # Add your Gmail credentials:
   GMAIL_USER=your.email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

3. **Build and run with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:4001

## 📧 Gmail App Password Setup

1. **Enable 2-Step Verification**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - Visit [App Passwords](https://myaccount.google.com/apppasswords)
   - Select 'Mail' and 'Other (Custom name)'
   - Enter 'TrailMail' as the app name
   - Copy the generated 16-character password

3. **Security Note**
   - Keep your app password secure
   - Never commit it to version control
   - Revoke access immediately if compromised

## 🔧 Development Setup

### Running Without Docker

1. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Environment Variables

- Frontend (.env):
  ```
  VITE_API_URL=http://localhost:4001
  ```

- Backend (.env):
  ```
  PORT=4001
  GMAIL_USER=your.email@gmail.com
  GMAIL_APP_PASSWORD=your-app-password
  ```

## 📝 Usage Guide

1. **Compose Email**
   - Fill in recipient details (To, CC, BCC)
   - Enter company information
   - Select or upload template
   - Add attachments if needed

2. **Preview**
   - Click 'Preview' to see how your email will look
   - Check all placeholders are correctly replaced

3. **Send**
   - Click 'Send Email' when ready
   - Wait for confirmation toast message

## 🐳 Docker Commands

```bash
# Build and start containers
docker-compose up --build

# Start existing containers
docker-compose up

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build <service-name>
```

## 🔍 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Verify Gmail credentials in .env
   - Check if 2-Step Verification is enabled
   - Ensure app password is correct

2. **Frontend Not Loading**
   - Check if backend is running
   - Verify API URL in frontend .env
   - Clear browser cache

3. **Docker Issues**
   - Ensure ports 4000 and 4001 are free
   - Check Docker logs for errors
   - Verify Docker Compose installation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## 📞 Contact

Sreeju KS - [@sreesreejuks](https://linkedin.com/in/sreesreejuks)

Project Link: [https://github.com/sreesreejuks/trailmail](https://github.com/sreesreejuks/trailmail) 