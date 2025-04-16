# shoe-zone


# 💅 SHOE ZONE - Frontend

## 📋 Project Overview
This is the frontend for the **SHOE ZONE** project, a modern women's shoe e-commerce platform.  
Built using **React.js** and **React Router**, this SPA interacts with the Django backend via REST APIs.

---

## 🔧 Technologies Used
- React.js (Vite or CRA)
- React Router (For Navigation)
- Axios or Fetch (for API requests)
- Tailwind CSS or Bootstrap (optional)
- Context API or Redux (optional, for state management)

---

## ✨ Features Implemented
1. *User Authentication*
   - Registration with email verification
   - Login & Logout
   - Profile Management

2. *Product Management*
   - Users can view Products, and make orders 
   - Product details include title, description, images, price and category'
  
3. *Frontend Components*
   - ✅ *Navbar:* For navigation
   - ✅ *Footer:* With copyright info
   - ✅ *Homepage:* Displays Products
   - ✅ *Product Page:* Shows Product details, comments, and rating

---

## 🧱 Project Structure
frontend/             # React frontend
    ├── public/
    └── src/
        ├── components/
        │   └── Navbar.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── ProductDetails.jsx
        │   ├── Cart.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── AdminDashboard.jsx
        │   └── NotFound.jsx
        ├── App.jsx
        └── main.jsx
        └── README.md
	└── Requierments.txt


---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Ahmed-Mansy/shoe-zone
cd shoe-zone/frontend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Start Development Server

```sh
npm run dev     # for Vite
# or
npm start       # for Create React App
```

App will run at:
http://localhost:3000

## 🔀 Branching Strategy
Each team member should follow the steps below:

### 1. Pull Latest Code
```sh
git pull origin main
```

### 2. Create Feature Branch
```sh
git checkout -b feature/your-feature-name
```
### 3. Make Changes and Commit
```sh
git add .
git commit -m "Added: your feature description"
```

### 4. Push Your Branch
```sh
git push origin feature/your-feature-name
```
Happy Styling! 💃👠

