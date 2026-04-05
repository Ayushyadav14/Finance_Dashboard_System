# Finance Dashboard System 💸

A robust, real-time Fullstack Finance Dashboard System built for secure financial monitoring, dynamic role-based access control, and intuitive data visualization.

## 🌟 Key Features

* **Real-Time Authentication Sync**: Asynchronous polling ensures that if an Admin modifies a user's role or deactivates an account, the target user is instantly updated and safely logged out on the spot across any browser without manual refreshes!
* **Role-Based Access Control (RBAC)**: Secure access mapped out dynamically:
  * **ADMIN**: Full panoramic control. Appoint other admins, upgrade users to analysts, or completely suspend active accounts.
  * **ANALYST**: Edit access to vital financial records and core business numbers.
  * **VIEWER**: General read-only access (assigned strictly by default to newly registered users).
* **JWT Stateless Security**: JWT-based stateless architectural flow with `bcrypt` password encryption ensuring supreme industry-grade safety.
* **Modern Material UI/UX**: Exquisite front-end tailored utilizing React + Vite, decorated heavily with modern UI aesthetics for beautiful charts and tables.

---

## 🔑 Test Profiles

The system's database automatically seeds itself dynamically upon its first deployment! You can explicitly log into these exact roles immediately after configuring the system to test varying features:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin123` | Can view Dashboard, modify Records, and has exclusive access to the 'User Management' panel to alter other users' roles or immediately deactivate accounts. |
| **Analyst** | `analyst@gmail.com` | `analyst123` | Can view Dashboard and possesses full Write/Edit rights for Financial Records. Cannot view the 'User Management' tab. |
| **Viewer** | *(Create your own via 'Sign up')* | *(Your choice)* | Pure read-only status for the Dashboard tab. They cannot manipulate Records nor manage users. |

*(Feel absolutely free to utilize the 'Sign Up' page to create a pristine new account. All newly registered users are automatically enrolled exclusively into the `VIEWER` scope. You can then log into the Admin profile to dynamically upgrade their role!)*

---

## 🛠 Tech Stack

**Frontend Framework:**
* **React 18** (Vite configured)
* **Axios** (Centralized API Network Routing)
* **Recharts** (Dynamic Graphical UI Widgets)
* **React Router DOM** (Multi-page Routing)

**Backend Architecture:**
* **Java 21 LTS**
* **Spring Boot 3** (Intelligent Autoconfiguration)
* **Spring Security** (Authentication Protocols + stateless JWT filters)
* **Spring Data JPA & Hibernate** (ORM Model abstraction)

**Database Ecosystem:**
* **PostgreSQL** (Live hosted on Supabase Network)

---

## 🚀 Setup & Local Execution

### Backend Setup:
1. Open the `/finance-backend1` directory in IntelliJ/Eclipse.
2. In `src/main/resources/application.properties`, update your PostgreSQL URL, username, and password credentials.
3. Ensure the `JWT_SECRET` is defined correctly.
4. Run the project from `FinanceBackend1Application.java`! It naturally starts listening quietly on `http://localhost:8080`.

### Frontend Setup:
1. Open your terminal natively into the `/finance-frontend` directory.
2. Install NodeJS environments via:
   ```bash
   npm install
   ```
3. Run the development environment interface via:
   ```bash
   npm run dev
   ```
4. Access the Live Local UI beautifully running on `http://localhost:5173`. 

*(For fully managed cloud deployment to Render & Vercel, refer to `DEPLOYMENT.md` included in the root directory!)*
