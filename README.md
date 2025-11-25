# 📔 My Journal - Desktop Application

A beautiful, private journal and task management desktop application built with React and Electron. Keep your thoughts organized and your tasks on track, all stored locally on your computer.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ✨ Features

### 📝 Journal
- **Beautiful writing experience** with a clean, distraction-free interface
- **Rich text entries** with titles and timestamps
- **Dark mode design** for comfortable writing
- **Edit and delete** your entries anytime
- **Chronologically organized** entries

### ✅ Task Management
- **Create and track tasks** with priorities (High, Medium, Low)
- **Add descriptions** and due dates
- **Mark tasks as complete** with satisfying checkboxes
- **Color-coded priorities** for easy scanning
- **Edit and delete** tasks as needed

### 🔒 Privacy First
- **100% local storage** - all your data stays on YOUR computer
- **No cloud sync** - no accounts, no servers, no tracking
- **Offline-ready** - works without internet connection
- **Private by design** - your thoughts are yours alone

## 🖥️ For Users - Installation

### Windows
1. Download `My Journal Setup 0.1.0.exe` from the releases
2. Double-click to run the installer
3. **If Windows shows a warning:**
   - Click "More info"
   - Click "Run anyway"
   - (This happens because the app isn't code-signed, but it's safe!)
4. Find "My Journal" in your Start Menu or Desktop
5. Start writing! 🎉

### Portable Version (No Installation)
1. Download the `win-unpacked.zip` file
2. Extract the folder anywhere
3. Run `My Journal.exe`
4. No installation needed!

## 💻 For Developers - Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/my-journal-app.git
cd my-journal-app

# Install dependencies
npm install

# Run in development mode (browser)
npm start

# Run as desktop app in development
npm run electron:dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run React app in browser (localhost:3000) |
| `npm run electron:dev` | Run desktop app in development mode |
| `npm run electron:build` | Build desktop app for all platforms |
| `npm run electron:build-win` | Build for Windows only |
| `npm run electron:build-mac` | Build for macOS only |
| `npm run electron:build-linux` | Build for Linux only |
| `npm test` | Run tests |

### Building the Desktop App

```bash
# Build for Windows (creates .exe installer)
npm run electron:build-win

# Output will be in the dist/ folder
# - My Journal Setup 0.1.0.exe (Installer)
# - win-unpacked/ (Portable version)
```

## 🏗️ Tech Stack

- **React 19** - UI framework
- **Electron 28** - Desktop app framework
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons
- **localStorage** - Data persistence
- **electron-builder** - App packaging

## 📁 Project Structure

```
my-journal-app/
├── electron/              # Electron main process
│   └── main.js           # Desktop window configuration
├── public/               # Static assets
├── src/                  # React source code
│   ├── App.js           # Main application component
│   ├── App.css          # Styles
│   └── index.js         # React entry point
├── package.json         # Dependencies and scripts
└── README.md           # You are here!
```

## 🔧 Configuration

### Customizing the App

**Window Size** - Edit `electron/main.js`:
```javascript
const win = new BrowserWindow({
  width: 1400,  // Change width
  height: 900,  // Change height
  // ...
});
```

**App Name** - Edit `package.json`:
```json
{
  "name": "my-journal-app",
  "build": {
    "productName": "My Journal"  // Change this
  }
}
```

## 🐛 Troubleshooting

### Windows SmartScreen Warning
**Problem:** Windows blocks the app saying "unrecognized app"

**Solution:** Click "More info" → "Run anyway". This happens because the app isn't code-signed ($300/year certificate).

### App Won't Open
**Problem:** Double-clicking the .exe does nothing

**Solution:** 
- Right-click → "Run as administrator"
- Check if your antivirus blocked it
- Try the portable version in `win-unpacked/`

### Data Not Saving
**Problem:** Entries/tasks disappear after closing

**Solution:** Make sure you're running the built .exe, not the development version. Data location:
- Windows: `C:\Users\YourName\AppData\Roaming\my-journal-app\`

## 🚀 Deployment Options

### Local Desktop App (Current)
- Build .exe and share with friends
- Each user has their own private data

### Docker Container
```bash
# Build Docker image
docker build -t my-journal-app .

# Run container
docker-compose up
```

### Web Deployment
Deploy to Vercel, Netlify, or GitHub Pages:
```bash
npm run build
# Upload the build/ folder to your hosting provider
```

## 📝 Data Storage

All data is stored locally using `localStorage`:

- **Journal Entries:** Saved as JSON in browser storage
- **Tasks:** Saved as JSON in browser storage
- **Location (Desktop App):** `%APPDATA%\my-journal-app\`
- **Location (Browser):** Browser's localStorage

**Note:** Uninstalling the app will delete all data. To backup, export localStorage or copy the data folder.

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Desktop framework by [Electron](https://www.electronjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

Having issues? Found a bug? Have a feature request?

- Open an issue on GitHub
- Email: your-email@example.com
- Twitter: @yourhandle

---

**Made with SHEER WILL POWER and extreme stupidity**

*Keep journaling, stay organized!* ✨