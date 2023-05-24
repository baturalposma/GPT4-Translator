1. Install Node.js: Go to the official website nodejs.org and download the latest version of Node.js. Run the downloaded file and follow the installation instructions to install Node.js on your system.
2. Verify Node.js installation: Open the command prompt (CMD) and type the following command to verify that Node.js is successfully installed:
```json
node -v
```
This command will display the installed version of Node.js if it has been installed correctly.
3. Install Yarn package manager: In the command prompt, enter the following command to install Yarn globally on your system:
```json
npm install --global yarn
```
This command will download and install the Yarn package manager.
4. Install project dependencies: In the command prompt, navigate to your project's directory. Then, run the following commands one by one:
```json
yarn add
yarn add react react-dom next
yarn add next
```
These commands will install the project dependencies, including React, ReactDOM, and Next.js.
5. Close and reopen the command prompt: After installing the project dependencies, close the current command prompt window and reopen a new one. This is necessary for the installed dependencies to take effect.
6. Start the development server: In the new command prompt window, navigate to your project's directory. Then, run the following command:
```json
npm run dev
```
or
```json
npm run start
```
By following these steps, you should be able to set up and run your project using the specified commands.