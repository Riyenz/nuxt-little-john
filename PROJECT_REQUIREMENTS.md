### **Nuxt 3 & Nuxt UI Frontend Development Test (Advanced - 1 Week)**

#### **Objective**

This test aims to assess a candidate’s ability to build a full-featured **Nuxt 3** application using **Nuxt UI**, including authentication, dashboard functionality, state management, API handling, and UX best practices. It also includes bonus points for **real-time updates, performance optimizations, and deployment**.

---

## **Project Requirements**

### **1. Authentication (Login/Logout) using Google OAuth**

✅ Implement **Google OAuth** login/logout using Firebase, Supabase, or a custom OAuth flow with Google API.  
✅ Store user session securely using **Nuxt 3’s useState() or Pinia**.  
✅ Redirect unauthenticated users to the login page.  
✅ Display the **logged-in user’s profile picture and name** in the dashboard header.

#### **Advanced Requirements**

⚡ Implement **auto-refresh tokens** to keep users logged in.  
⚡ Allow users to log out across multiple devices.  
⚡ Secure API endpoints to return only **authenticated user-specific data**.

---

### **2. Dashboard Page**

After login, users should be redirected to a **dashboard** containing:  
✅ **Sidebar navigation** (Dashboard, Tasks, Analytics, Settings, Logout).  
✅ **Dynamic card-based UI** using **Nuxt UI**.  
✅ **Welcome message** displaying the user's name and current time of day.  
✅ **Data table with pagination** listing dynamic mock data (e.g., tasks, orders, or users).  
✅ **Form with validation** (using built-in `Nuxt UI Form`) to add/edit data.  
✅ **CRUD functionality** for tasks or users (Create, Read, Update, Delete).

#### **Advanced Requirements**

⚡ **Search and filters** on the data table (e.g., filter tasks by status, search by name).  
⚡ **Inline editing** (double-clicking a table row to edit data).  
⚡ **Drag-and-drop** sorting of tasks using drag & Drop
⚡ **Role-based access** (e.g., Admin can edit all tasks, User can edit only their own).

---

### **3. API Handling**

✅ Mock an API using **Nuxt server routes (`server/api/`)** or **JSON Server**.  
✅ Fetch and display **user-specific** data on the dashboard using `useFetch()`.  
✅ Implement **error handling** for failed requests (e.g., expired session, network failure).

#### **Advanced Requirements**

⚡ Cache API responses using **useAsyncData()** to reduce redundant requests.  
⚡ Add a **retry mechanism** for failed API calls.

---

### **4. UI & Styling**

✅ Use **Nuxt UI** components to create a polished and modern interface.  
✅ Ensure **responsiveness** for mobile, tablet, and desktop.  
✅ Implement **dark mode support** using Nuxt’s built-in color mode.  
✅ Use **global layout and reusable components** to keep the code clean.

#### **Advanced Requirements**

⚡ Add **theme customization** where users can select their preferred theme.  
⚡ Implement **drag-and-drop widgets** on the dashboard for customizable layout.

---

### **5. Analytics Page (New Requirement)**

✅ Create an **Analytics page** using any charts library solution  
✅ Include charts such as:

- **Bar chart** for completed tasks per day
- **Pie chart** for task status distribution
- **Line chart** showing weekly productivity  
   ✅ Make data **dynamic** based on user input.

#### **Advanced Requirements**

⚡ Implement **real-time data updates** on the charts.  
⚡ Allow users to **customize** which charts appear on their dashboard.

---

### **6. Notifications & Toast Messages**

✅ Implement **Toast notifications** (e.g., “Task added successfully”).  
✅ Show **alert dialogs** before deleting items.  
✅ Notify users **when they are inactive for too long** and suggest logging out.

---

### **7. User Settings Page**

✅ Allow users to **update their profile** (name, email, profile picture).  
✅ Let users **toggle dark mode and customize UI**.

#### **Advanced Requirements**

⚡ Enable **two-factor authentication (2FA)** using OTP.

### **8. Deployment & Performance Optimization**

✅ Deploy the app to **Vercel, Netlify, or Cloudflare Pages**.  
✅ Optimize **lazy loading** for components and images.  
✅ Reduce **API call frequency** using caching.

#### **Advanced Requirements**

⚡ Implement **PWA (Progressive Web App)** features (offline mode, installable app).  
⚡ Measure performance with **Lighthouse** and optimize accordingly.

---

### **Bonus Features (Extra Points)**

⭐ **Voice commands** (e.g., “Add a new task for today at 5 PM”). This will populate the result in a table

---

### **Evaluation Criteria**

---

### **Submission Requirements**

📌 **GitHub Repository** with a well-documented **README.md**.  
📌 **Live deployed version** (Vercel/Netlify/Cloudflare). If not possible We are fine executing it locally

---

### **Final Thoughts**

This extended test provides a **real-world challenge** that assesses a candidate’s:  
✅ **Technical skills** in Nuxt 3 & Nuxt UI.  
✅ **Problem-solving ability** when handling API interactions and authentication.  
✅ **Attention to detail** in UI/UX and responsiveness.  
✅ **Initiative** to add **extra features** beyond the basic requirements.
