# Link Up - Headless Social Media Platform

Welcome to **Link Up**, a headless social media backend platform designed for content creators. This platform provides secure APIs for user authentication, content creation, media management, and more.

> **Swagger Documentation**: Available at [http://localhost:3000/](http://localhost:3000/) after running the application locally.

---

## Features

- **User Authentication and Authorization**: Secure login and role-based access control.
- **Content Management**: CRUD operations for user posts.
- **Media Management**: Upload and retrieve media files via Azure Blob Storage.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/link-up.git
cd link-up
2. Configure Environment Variables
Create a .env file in the root directory:

env
Copier le code
DATABASE_URL=<database_connection_string>
AZURE_STORAGE_CONNECTION_STRING=<your_blob_storage_connection_string>
SECRET_KEY=<your_secret_key_for_JWT>
3. Install Dependencies
For FastAPI (Python):
Set up a virtual environment:
bash
Copier le code
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install the required Python libraries:
bash
Copier le code
pip install -r requirements.txt
For Express.js (Node.js):
Install Node.js dependencies:
bash
Copier le code
npm install
Deploying to Azure
1. Authenticate with Azure CLI
bash
Copier le code
az login
2. Deploy the Backend
Option 1: Using Azure App Service
Create an App Service:

bash
Copier le code
az webapp create --resource-group <RESOURCE_GROUP> --plan <SERVICE_PLAN> --name <APP_NAME> --runtime "PYTHON:3.9"
Or for Express.js:

bash
Copier le code
az webapp create --resource-group <RESOURCE_GROUP> --plan <SERVICE_PLAN> --name <APP_NAME> --runtime "NODE:16-lts"
Deploy the code:

bash
Copier le code
az webapp deployment source config-local-git --name <APP_NAME> --resource-group <RESOURCE_GROUP>
git remote add azure <REMOTE_URL_FROM_AZURE>
git push azure main
Option 2: Using Docker
Build and push the Docker image:

bash
Copier le code
docker build -t <your_dockerhub_username>/link-up:latest .
docker push <your_dockerhub_username>/link-up:latest
Deploy the image to an Azure Web App with Docker support.

3. Configure Environment Variables on Azure
In the Azure portal, go to your App Service and add the following environment variables:

DATABASE_URL
AZURE_STORAGE_CONNECTION_STRING
SECRET_KEY
