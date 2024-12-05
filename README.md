<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Up - Documentation</title>
</head>
<body>
    <header>
        <h1>Link Up - Headless Social Media Platform</h1>
        <p>
            Welcome to the **Link Up** backend platform! This application provides APIs for 
            social media content management, accessible via Swagger documentation at:
            <strong><a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a></strong>.
        </p>
    </header>

    <section id="features">
        <h2>Features</h2>
        <ul>
            <li><strong>User Authentication and Authorization:</strong> Secure login and role-based access control.</li>
            <li><strong>Content Management:</strong> CRUD operations for user posts.</li>
            <li><strong>Media Management:</strong> Upload and retrieve media files via Azure Blob Storage.</li>
        </ul>
    </section>

    <section id="setup">
        <h2>Setup Instructions</h2>
        <h3>1. Clone the Repository</h3>
        <pre>
            <code>
git clone https://github.com/your-repo/link-up.git
cd link-up
            </code>
        </pre>

        <h3>2. Configure Environment Variables</h3>
        <p>Create a <code>.env</code> file in the root directory:</p>
        <pre>
            <code>
DATABASE_URL=<database_connection_string>
AZURE_STORAGE_CONNECTION_STRING=<your_blob_storage_connection_string>
SECRET_KEY=<your_secret_key_for_JWT>
            </code>
        </pre>

        <h3>3. Install Dependencies</h3>
        <h4>For FastAPI (Python):</h4>
        <ol>
            <li>Set up a virtual environment:
                <pre><code>python -m venv venv</code></pre>
                <pre><code>source venv/bin/activate  # On Windows: venv\Scripts\activate</code></pre>
            </li>
            <li>Install required libraries:
                <pre><code>pip install -r requirements.txt</code></pre>
            </li>
        </ol>

        <h4>For Express.js (Node.js):</h4>
        <pre>
            <code>
npm install
            </code>
        </pre>
    </section>

    <section id="deployment">
        <h2>Deploying to Azure</h2>
        <h3>1. Authenticate with Azure CLI</h3>
        <pre>
            <code>
az login
            </code>
        </pre>

        <h3>2. Deploy the Backend</h3>
        <h4>Option 1: Using Azure App Service</h4>
        <ol>
            <li>Create an App Service:
                <pre>
<code>
az webapp create --resource-group &lt;RESOURCE_GROUP&gt; --plan &lt;SERVICE_PLAN&gt; --name &lt;APP_NAME&gt; --runtime "PYTHON:3.9"
# For Express.js
az webapp create --resource-group &lt;RESOURCE_GROUP&gt; --plan &lt;SERVICE_PLAN&gt; --name &lt;APP_NAME&gt; --runtime "NODE:16-lts"
</code>
                </pre>
            </li>
            <li>Deploy the code:
                <pre>
<code>
az webapp deployment source config-local-git --name &lt;APP_NAME&gt; --resource-group &lt;RESOURCE_GROUP&gt;
git remote add azure &lt;REMOTE_URL_FROM_AZURE&gt;
git push azure main
</code>
                </pre>
            </li>
        </ol>

        <h4>Option 2: Using Docker</h4>
        <ol>
            <li>Build and push the Docker image:
                <pre>
<code>
docker build -t &lt;your_dockerhub_username&gt;/link-up:latest .
docker push &lt;your_dockerhub_username&gt;/link-up:latest
</code>
                </pre>
            </li>
            <li>Deploy the image to an Azure Web App with Docker support.</li>
        </ol>

        <h3>3. Configure Environment Variables on Azure</h3>
        <p>
            In the Azure portal, go to your App Service and add the environment variables 
            (<code>DATABASE_URL</code>, <code>AZURE_STORAGE_CONNECTION_STRING</code>, <code>SECRET_KEY</code>).
        </p>
    </section>
</body>
</html>
