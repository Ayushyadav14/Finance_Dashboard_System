# 🚀 Finance Dashboard Deployment Guide

To deploy your application, you will release the backend as a Web Service on **Render**, and the frontend on **Vercel**. 

Before starting, ensure you have committed and pushed your entire project (`finance_system_dashboard` containing both `finance-backend1` and `finance-frontend`) to a public or private **GitHub Repository**.

---

## Part 1: Deploying the Spring Boot Backend (Render)

Render is great for Java/Spring Boot applications. It will automatically detect your project structure.

1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub account and select your project repository.
3. Under the deployment configurations, fill in the following details:
   - **Name**: `finance-backend` (or similar)
   - **Root Directory**: `finance-backend1`
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/finance-backend1-0.0.1-SNAPSHOT.jar`
   - **Instance Type**: Free tier is completely fine.
   
4. **Environment Variables**: Open the "Advanced" menu in Render, click **Add Environment Variable**, and provide these exact values:

| Key | Value |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db.ncwjlwkgmuwtufixdbql.supabase.co:5432/postgres` |
| `SPRING_DATASOURCE_USERNAME` | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | `Chunmun@196868` |
| `JWT_SECRET` | `mySecretKeyForJWTTokenGenerationMustBe32CharsLong123` |
| `JWT_EXPIRATION` | `86400000` |
| `APP_SEED_ENABLED` | `true` |

*(Note: Because we created `render.yaml` earlier, Render might auto-detect these settings via Blueprint—if it does, just verify they match!)*

5. Click **Create Web Service**. 
   - It will take a few minutes to build. Once it finishes, look at the top left corner of the dashboard to copy your secure live URL (it will look like: `https://finance-backend1-xxx.onrender.com`).

---

## Part 2: Deploying the React UI (Vercel)

Vercel is optimized beautifully for React & Vite projects.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import the exact same GitHub repository you just used for Render.
3. Once prompted to configure the project, set these values carefully:
   - **Framework Preset**: Detects Automatically, but ensure it says **`Vite`**.
   - **Root Directory**: Click "Edit", navigate, and select the **`finance-frontend`** folder.
4. Open the **Environment Variables** dropdown and add your Render URL:

| Name | Value |
| :--- | :--- |
| `VITE_API_URL` | `[PASTE YOUR RENDER URL SECURED IN HTTPS]` (e.g. *https://finance-backend-xy.onrender.com*) |

> [!WARNING]
> Ensure there is **no trailing slash ('/')** at the end of your Vercel URL variable, otherwise requests might look like `https://render...com//api/auth`. 

5. Click **Deploy**. Vercel will process your deployment in seconds.

---

### You're Finished! 🎉
You can now click on your generated Vercel domain to access your securely hosted Finance Dashboard UI. It safely and natively communicates with your Render infrastructure, checking the global database roles continuously!
