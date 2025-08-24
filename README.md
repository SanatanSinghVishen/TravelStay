# 🌍 TravelStay

TravelStay is a full-stack web application.
It allows users to explore, list, and manage travel accommodations with ease.  

The project demonstrates core concepts of **backend + frontend integration**, CRUD operations, authentication, and deployment practices.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 Overview

TravelStay is built as a learning + portfolio project to practice **MERN-like stack (without React)**.  
Users can create accounts, browse stays, add new listings, and leave reviews.

It’s structured using **MVC architecture** with:
- Models (`/models`)  
- Views (`/views` with EJS templates)  
- Controllers (`/controllers`)  
- Routes (`/routes`)

---

## ✨ Features
- 🏘️ View all available stays
- ➕ Add new listings (with images, price, and location)
- ✏️ Edit or delete listings
- 💬 Leave reviews on listings
- 🔑 User authentication (register/login/logout)
- ☁️ Cloud-based image upload (Cloudinary integration)
- 🛡️ Error handling and form validation

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB & Mongoose  
- **Frontend:** EJS, CSS, Bootstrap  
- **Authentication:** Passport.js  
- **Image Uploads:** Cloudinary + Multer  
- **Other:** dotenv, method-override, express-session  

---

## ⚙️ Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/SanatanSinghVishen/TravelStay.git
   cd TravelStay
