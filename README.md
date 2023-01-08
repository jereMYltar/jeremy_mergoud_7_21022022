# jeremy_mergoud_7_21022022

# Cloning this repository :

git clone https://github.com/jereMYltar/jeremy_mergoud_7_21022022.git
=> this will create a folder named 'jeremy_mergoud_7_21022022'

You can also download it.

# Prerequisites :

1. Get sure you use Node v16.13.0
2. If you use Node Version Manager, you can execute the following commands in a terminal :
   - to check Node version : node -v
   - if Node v16.13.0 is not installed : nvm install 16.13.0
   - to use Node v16.13.0 : nvm use 16.13.0

# Installing the client server :

1. Open a terminal
2. In this terminal, open the folder witch contain the repository (for exemple 'jeremy_mergoud_7_21022022')
3. Then open the 'frontend' folder, and finally execute in a prompt :
   - npm install

# Create a local mySQL database

1. Use the complete guide : https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql

# Create a .env file in the 'backend/config' folder

1. Respect the model file : "env_model.js"
2. Fill all DB_xxx variables with datas needed
3. In JWT_SALT, fill in a salting key
4. If you want to change ADMIN_PASSWORD value, keep its new value in mind

# Installing the backend server :

1. Open a NEW terminal
2. In this terminal, open the folder witch contain the repository (for exemple 'jeremy_mergoud_7_21022022')
3. Then open the 'backend' folder, and finally execute in a prompt :
   - npm install

# Launching the App

1. In the frontend terminal, execute :
   - npm run start
2. In the backend terminal, execute :
   - npm run start
3. Follow the URL given in the frontend terminal
4. The application will open and then reload automatically if you modify a source file
