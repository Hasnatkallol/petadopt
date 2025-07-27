# 🐾 Tailwag - Pet Adoption & Donation Platform


## 📌 Purpose

**PetConnect** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to connect pets in need with loving families. Users can search for adoptable pets, request adoptions, run or contribute to donation campaigns, and manage pet profiles. The platform empowers both pet owners and adopters while supporting rescue efforts and animal welfare causes.

---

## 🔗 Live URL

👉 [Visit Live Site](https://assignment10-b0bdd.web.app/)

---

## 💻 Project Repositories

- **Client**: [GitHub Link](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Hasnatkallol)
- **Server**: [GitHub Link](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-Hasnatkallol)

---

## 🚀 Key Features

### 🔒 Authentication & Authorization
- Email/password auth with Firebase
- Google, GitHub login integrations
- Role-based access: User / Admin
- JWT-based secure API communication
- Route protection & persistence after reload

### 🏠 Public Pages
- Responsive Home page with Banner, Categories, About, and CTAs
- Pet Listings with search, filter, infinite scroll, and category filter
- Detailed Pet Info with Adoption request form
- Donation Campaigns with infinite scroll and donation details
- Donation via Stripe modal with amount and card info
- Recommended donations section on detail pages

### 🧑 User Dashboard (Protected)
- Add Pet (with Cloudinary/ImgBB image upload)
- View/Edit/Delete My Pets with sortable & paginated TanStack Table
- Submit & Manage Adoption Requests
- Create & Manage Donation Campaigns
- View & request refund for Donations

### 🛠️ Admin Dashboard (Protected)
- Make user Admin
- View/Edit/Delete any Pet or Donation
- Pause/unpause donations

### 📱 Responsiveness
- Fully responsive across mobile, tablet, and desktop
- Dark Mode / Light Mode toggle support

### 🧠 UX Enhancements
- Skeleton Loaders instead of spinners
- WYSIWYG Editor (React Quill) for long text inputs
- Clean UI using TailwindCSS 
- Infinite scrolling with TanStack Query + Intersection Observer

---

## 📦 NPM Packages Used

### 🔧 Backend
- `express`
- `cors`
- `jsonwebtoken`
- `dotenv`
- `mongoose`
- `stripe`

### 💻 Frontend
- `react`
- `react-dom`
- `react-router-dom`
- `firebase`
- `axios`
- `react-hook-form`
- `zod` / `yup` (optional schema validation)
- `react-select`
- `@tanstack/react-query`
- `@tanstack/react-table`
- `react-toastify`
- `react-hot-toast`
- `react-loading-skeleton`
- `react-icons`
- `react-intersection-observer`
- `react-quill`
- `clsx`
- `tailwindcss`
- `shadcn/ui` (or alternative: `flowbite`, `material-tailwind`)
- `jwt-decode`
- `react-stripe-js` & `@stripe/stripe-js`

---

## 🔐 Environment Variables

- MongoDB credentials and Firebase config are securely stored using `.env` files in both server and client
- Stripe public & secret keys are also stored securely

---

## 🧪 Deployment & Hosting

- **Client**: Netlify
- **Server**: Vercel
- **Database**: MongoDB Atlas
- **Image Upload**: ImgBB API
- **Payment**: Stripe

---





