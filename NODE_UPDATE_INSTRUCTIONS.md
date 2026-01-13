# How to Update Node.js on Windows

## Method 1: Using Node.js Official Installer (Recommended)

1. **Download the Latest Version:**
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version for Windows
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Install:**
   - Run the downloaded installer
   - Follow the installation wizard
   - The installer will automatically replace your old version
   - Make sure to check "Automatically install necessary tools" if prompted

3. **Verify Installation:**
   - Open a new Command Prompt or PowerShell window
   - Run: `node --version`
   - Run: `npm --version`
   - You should see the new version numbers

## Method 2: Using Node Version Manager (nvm-windows)

This method allows you to manage multiple Node.js versions.

1. **Download nvm-windows:**
   - Go to [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
   - Download `nvm-setup.exe` from the latest release

2. **Install nvm-windows:**
   - Run the installer
   - Follow the installation wizard

3. **Install Node.js using nvm:**
   - Open a new Command Prompt or PowerShell (as Administrator)
   - List available versions: `nvm list available`
   - Install latest LTS: `nvm install 20.11.0` (or latest LTS version)
   - Use the version: `nvm use 20.11.0`
   - Set as default: `nvm alias default 20.11.0`

4. **Verify:**
   - `node --version`
   - `npm --version`

## Method 3: Using Chocolatey (Package Manager)

If you have Chocolatey installed:

1. Open PowerShell as Administrator
2. Run: `choco upgrade nodejs-lts`
3. Verify: `node --version`

## After Updating Node.js

1. **Restart your terminal/IDE** to pick up the new Node.js version
2. **Reinstall dependencies** (optional but recommended):
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## Current Status

- **Your Current Version:** Node.js v18.17.1
- **Recommended Version:** Node.js 20.x LTS or 22.x LTS
- **Why Update:** 
  - Better compatibility with modern packages
  - Security updates
  - Performance improvements
  - @supabase/supabase-js requires Node.js 20+

## Notes

- After updating, you may need to reinstall global packages
- Some projects might need dependency updates
- Always test your applications after updating Node.js
