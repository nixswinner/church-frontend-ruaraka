# Church Management System (Vue 3 + Vite)

## 🚀 Project Overview
This is a **Church Management System** built using **Vue 3** and **Vite**. It is designed to provide a responsive and modern web interface for managing church-related activities.

## 🛠️ Tech Stack
- **Frontend:** Vue 3, Vuex, Vue Router, Bootstrap
- **Build Tool:** Vite
- **Backend:** (Specify if available)
- **Editor:** Quill Editor
- **State Management:** Vuex
- **Utilities:** Axios, Moment.js, Lodash

## 📂 Project Structure
```
vue3-revamp/
│── config/               # Environment configuration files
│── node_modules/         # Installed dependencies
│── src/
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── components/       # Vue components
│   ├── router/           # Vue Router setup
│   ├── store/            # Vuex store
│   ├── subcomponents/    # Additional UI components
│   ├── App.vue           # Root Vue file
│   ├── helpers.js        # Helper functions
│   ├── main.js           # Vue app entry point
│── static/               # Static files (config.json, manifests, etc.)
│── .gitignore            # Git ignore file
│── index.html            # Main HTML file (processed by Vite)
```

## 🌟 Key Features
✅ **Vue 3 Composition API** – for modern, scalable code structure.  
✅ **Vue Router** – handles navigation within the app.  
✅ **Vuex** – state management for global data handling.  
✅ **Axios** – for making HTTP requests.  
✅ **Moment.js** – for formatting dates.  
✅ **Bootstrap** – for styling.  
✅ **Quill Editor** – for rich text editing.  

## 🔧 Setup Instructions
### **1. Clone the Repository**
```sh
git clone "https://github.com/Bultut-yegon/Vue3-revamp.git"
cd your-repo
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Run the Development Server**
```sh
npm run dev
```

### **4. Build for Production**
```sh
npm run build
```

### **5. Preview Production Build**
```sh
npm run preview
```

## ⚙️ Configuration
- Environment variables are managed in `config/` instead of `.env`.
- Static files (like `config.json`) are stored in the `static/` folder.

## 🐛 Troubleshooting
- If you face issues, ensure all dependencies are installed correctly.
- Run `npm update` to check for outdated packages.
- Clear cache using:
  ```sh
  rm -rf node_modules package-lock.json && npm install
  ```

## 📜 License
This project is licensed under the [MIT License](LICENSE).

## 💡 Contributions
Feel free to submit PRs and open issues to improve the project. 🚀

