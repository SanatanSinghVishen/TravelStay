# TravelStay - Airbnb Clone

A full-stack web application built with Node.js, Express, MongoDB, and EJS that allows users to create, view, edit, and delete travel listings with image uploads via Cloudinary.

## 🚀 Features

- **User Authentication**: Sign up, login, and logout functionality
- **CRUD Operations**: Create, read, update, and delete travel listings
- **Image Upload**: Cloudinary integration for image storage
- **Reviews System**: Users can leave reviews and ratings for listings
- **Responsive Design**: Mobile-friendly interface
- **Session Management**: MongoDB-based session storage
- **Security**: Input validation and sanitization

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **File Upload**: Multer with Cloudinary storage
- **Template Engine**: EJS
- **Styling**: Bootstrap CSS
- **Session Storage**: Connect-Mongo
- **Validation**: Joi

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TravelStay.git
   cd TravelStay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   SECRET=your-super-secret-key-here
   CLOUD_NAME=your-cloudinary-cloud-name
   CLOUD_API_KEY=your-cloudinary-api-key
   CLOUD_API_SECRET=your-cloudinary-api-secret
   ATLAS_DB=mongodb+srv://username:password@cluster.mongodb.net/travelstay
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**
   In your Render dashboard, add these environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `SECRET`: Generate a strong secret
   - `CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUD_API_KEY`: Your Cloudinary API key
   - `CLOUD_API_SECRET`: Your Cloudinary API secret
   - `ATLAS_DB`: Your MongoDB Atlas connection string

### Option 2: Manual Deployment

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `travelstay`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

3. **Set Environment Variables**
   Add the same environment variables as mentioned above.

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `SECRET` | Session secret key | Yes |
| `CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUD_API_KEY` | Cloudinary API key | Yes |
| `CLOUD_API_SECRET` | Cloudinary API secret | Yes |
| `ATLAS_DB` | MongoDB Atlas connection string | Yes |

## 📁 Project Structure

```
TravelStay/
├── controllers/          # Route controllers
├── models/              # Database models
├── routes/              # Express routes
├── views/               # EJS templates
├── public/              # Static files
├── utils/               # Utility functions
├── middleware.js        # Custom middleware
├── cloudConfig.js       # Cloudinary configuration
├── app.js              # Main application file
├── package.json         # Dependencies and scripts
└── render.yaml          # Render deployment config
```

## 🎯 API Endpoints

- `GET /` - Home page
- `GET /listings` - All listings
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /signup` - Signup form
- `POST /signup` - User registration
- `GET /login` - Login form
- `POST /login` - User authentication
- `GET /logout` - User logout

## 🔧 Development Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sanatan Singh**
**Sundram Kumar** 
- GitHub: [@SanatanSinghVishen](https://github.com/SanatanSinghVishen)
- GitHub: [@Sundram556](https://github.com/sundram556)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Render](https://render.com/) - Deployment platform
