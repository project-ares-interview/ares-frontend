# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

## Deployment to Azure (Staging)

This guide outlines the process for deploying the `ares-frontend` and `ares-backend` applications to Azure Container Instances (ACI) for a staging environment.

### Step 1: Azure Container Registry (ACR) Setup

First, ensure you have a private registry to store your Docker images. This is a one-time setup.

```bash
# Define variables
RESOURCE_GROUP="YourResourceGroup"
ACR_NAME="projectares" # Or your unique ACR name

# Create a resource group (if you don't have one)
az group create --name $RESOURCE_GROUP --location koreacentral

# Create the Azure Container Registry
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Log in to your ACR
az acr login --name $ACR_NAME
```

### Step 2: Build & Push Frontend Docker Image

Build the frontend application into a Docker image. This process requires the `DOTENV_KEY` for the staging environment to be passed as a build argument.

```bash
# Navigate to the ares-frontend project root

# 1. Get the DOTENV_KEY for the staging environment
FRONTEND_DOTENV_KEY=$(npx dotenvx keys staging)

# 2. Build the Docker image, passing the key as a build argument
docker build --build-arg DOTENV_PRIVATE_KEY_STAGING="$FRONTEND_DOTENV_KEY" -t ${ACR_NAME}.azurecr.io/ares-frontend:staging-v1 .

# 3. Push the image to your ACR
docker push ${ACR_NAME}.azurecr.io/ares-frontend:staging-v1
```

### Step 3: Prepare Backend Deployment Variables

The final deployment command requires the `DOTENV_KEY` for the backend. Retrieve it from the `ares-backend` directory.

```bash
# Navigate to the backend directory to get its key
cd ../ares-backend
BACKEND_DOTENV_KEY=$(npx dotenvx keys staging)
cd ../ares-frontend # Return to your original directory

# Keep this key handy for the next step
echo "Backend DOTENV_KEY: $BACKEND_DOTENV_KEY"
```

### Step 4: Deploy to Azure Container Instances (ACI)

This command creates a single ACI Container Group containing both the frontend and backend containers. The frontend container acts as the public entry point and reverse proxies requests to the backend.

```bash
# Define deployment variables
RESOURCE_GROUP="YourResourceGroup"
ACR_NAME="projectares"
ACI_NAME="ares-staging-app"
DNS_NAME="ares-app-$(openssl rand -hex 4)" # Generate a unique DNS name

# Get ACR credentials for ACI to pull images
az acr update -n $ACR_NAME --admin-enabled true
ACR_USERNAME=$(az acr credential show -n $ACR_NAME --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show -n $ACR_NAME --query "passwords[0].value" -o tsv)

# Paste the backend DOTENV_KEY from the previous step
BACKEND_DOTENV_KEY="<paste-backend-dotenv-key-here>"

# Create the ACI Container Group
az container create \
  --resource-group $RESOURCE_GROUP \
  --name $ACI_NAME \
  --image "${ACR_NAME}.azurecr.io/ares-frontend:staging-v1" \
  --dns-name-label $DNS_NAME \
  --ports 80 \
  --registry-login-server "${ACR_NAME}.azurecr.io" \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --containers \
    "[{\
      \"name\": \"ares-backend\",\
      \"image\": \"${ACR_NAME}.azurecr.io/ares-backend:staging-v1\",\
      \"ports\": [],\
      \"environmentVariables\": [{\
        \"name\": \"DOMAIN_NAME\",\
        \"value\": \"${DNS_NAME}.koreacentral.azurecontainer.io\"
      },{\
        \"name\": \"DJANGO_ALLOWED_HOSTS\",\
        \"value\": \"${DNS_NAME}.koreacentral.azurecontainer.io,localhost\"
      }],\
      \"secureEnvironmentVariables\": {\
        \"DOTENV_KEY\": \"$BACKEND_DOTENV_KEY\"
      }
    }]"

echo "Deployment started. Your app will be available at http://${DNS_NAME}.koreacentral.azurecontainer.io in a few minutes."
```