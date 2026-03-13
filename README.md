# MAAC Dibrugarh - Official Website

A high-performance, visually stunning Lead Generation and Portfolio platform for MAAC Dibrugarh (Upper Assam's premier Animation & VFX Academy). Built with **Next.js 16**, **Firebase**, and **React Three Fiber**.

## 🚀 Tech Stack & Core Dependencies

### Frontend
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Animations:** [Framer Motion 12](https://www.framer.com/motion/) (Character-based lightning reveals, entry effects)
- **3D VFX:** [React Three Fiber](https://r3f.docs.pmnd.rs/) & [Three.js](https://threejs.org/) (Interactive particle exploder, kinetic glass text)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Utilities:** `clsx` & `tailwind-merge` (Optimized class management)

### Backend & Infrastructure
- **BaaS:** [Firebase 12](https://firebase.google.com/) (Firestore, Auth, Storage)
- **Media Optimization:** [Cloudinary](https://cloudinary.com/) (Unsigned uploads for CMS)
- **Content Security:** [Isomorphic DOMPurify](https://github.com/kkomelin/isomorphic-dompurify) (Sanitizing CMS HTML)

---

## 📊 Database Schema (Firestore)

The project utilizes **Google Firestore** in a serverless configuration. All timestamps are converted to ISO strings in the service layer for Next.js serialization compatibility.

### 1. `leads` (Student Enquiries)
- `id`: Document ID
- `name`: String
- `phone`: String
- `courseInterest`: String
- `createdAt`: Timestamp (ISO String)

### 2. `courses` (Curriculum)
- `id`: Document ID
- `title`: String
- `slug`: String (URL unique identifier)
- `description`: String (HTML supported)
- `excerpt`: String (Short summary)
- `thumbnailUrl`: String (Cloudinary/Drive)
- `duration`: String
- `category`: String
- `status`: "published" | "draft"
- `createdAt`: Timestamp

### 3. `blogs` (CMS Posts)
- `id`: Document ID
- `title`: String
- `slug`: String
- `content`: String (HTML/Rich Text)
- `excerpt`: String
- `coverImage`: String
- `author`: String
- `published`: Boolean
- `createdAt`: Timestamp

### 4. `student_gallery` (Showcase)
- `id`: Document ID
- `title`: String
- `imageUrl`: String
- `createdAt`: Timestamp

### 5. `ads` (Global Popups)
- `id`: Document ID
- `title`: String
- `imageUrl`: String
- `isActive`: Boolean
- `targetPages`: Array (e.g., `["*"]` for global)
- `delaySeconds`: Number
- `createdAt`: Timestamp

### 6. `settings` (Global Config)
- **Document ID:** `global`
- `showreelUrl`: Youtube Embed URL
- `heroHeading`: String
- `heroSubheading`: String
- `contactPhone`: String
- `contactEmail`: String
- `contactAddress`: String
- `instagramUrl`: String
- `facebookUrl`: String
- `youtubeUrl`: String
- `linkedinUrl`: String
- `aboutImageUrl`: String
- `operatingHours`: String

---

## ⚙️ External Service Configuration

### 1. Firestore Composite Indexes
The following composite indexes are **REQUIRED** for the public pages to function. Without these, the site will throw "Query requires index" errors.

| Collection | Fields to Index (Ascending/Descending) | Usage |
| :--- | :--- | :--- |
| `courses` | `status` (Asc), `createdAt` (Desc) | Public Course Grid |
| `ads` | `isActive` (Asc), `createdAt` (Desc) | Global Ad Overlay |
| `blogs` | `published` (Asc), `createdAt` (Desc) | Public Blog Feed |

**How to create:**
1. Go to **Firestore Database** > **Indexes** tab in Firebase Console.
2. Click **Add Index**.
3. Select the collection and add the specific fields with the directions listed above.
4. Set query scope to **Collection**.

### 2. Cloudinary Upload Presets
The CMS uses **Unsigned Uploads** to handle media. Create the following presets in your Cloudinary Settings:

| Preset Name | Target Use | Recommended Settings |
| :--- | :--- | :--- |
| `COURSES` | Course Thumbnails/Videos | Auto-format, Quality: Auto |
| `BLOGS` | Blog Cover Images | Format: WebP, Quality: 80 |
| `ADS` | Popup Banner Media | Resize: Fill (1200x800) |
| `GALLERY` | Student Showcase | Auto-format, Quality: Auto |

**How to create:**
1. Go to **Cloudinary Dashboard** > **Settings (Gear Icon)** > **Upload**.
2. Scroll to **Upload presets** and click **Add upload preset**.
3. Set **Signing Mode** to **Unsigned**.
4. Set the **Upload preset name** to match one of the values above.
5. (Optional) Add a folder path (e.g., `maac/courses`) to keep your media organized.

---

## 🛠️ Key Processes & Architecture

### 1. Media Pipeline
- **Cloudinary Integration:** Images and videos uploaded via the Admin CMS use Cloudinary's unsigned upload presets (`COURSES`, `BLOGS`, `ADS`).
- **Google Drive Proxy:** `src/utils/drive.ts` contains a parser to convert standard Drive sharing links into direct media stream URLs for `<img/>` and `<video/>` tags.

### 2. On-Demand Revalidation
The public pages (Home, Courses, Blogs) are rendered as **Static Server Components** to minimize Firebase read quotas.
- When data is mutated in the Admin CMS, `revalidatePath("/")` or `revalidatePath("/courses")` is triggered to purge the cache and update the production site instantly.

### 3. Lead Generation Engine
- **Global Modal:** Controlled via `EnquiryContext`, accessible from any button or auto-triggered after 5 seconds on first visit.
- **Lightning Reveal:** Character-based staggered animations reveal the brand message to increase user engagement.

### 4. Content Styling (CMS)
- **Inline CSS Requirement:** When adding HTML content (e.g., for Courses or Blogs) via the Admin CMS, **use only inline vanilla CSS** for styling.
- **Why?** Tailwind CSS classes will not work because they are pruned at build-time and the dynamic content is added at runtime.
- **AI Prompt Guide:** If you use an AI to generate course content, use the following instruction in your prompt:
  > "Use ONLY inline vanilla CSS for all styling (colors, layout, spacing). Do NOT use Tailwind CSS classes as they will not be rendered."

### 5. Security
- **Admin Protection:** The `/admin` route group is protected via Firebase Auth.
- **Input Sanitization:** Rich text from the CMS is passed through `DOMPurify` before being rendered with `dangerouslySetInnerHTML`.

---

## 🛠️ Development & Build

### Setup
1. Clone the repo.
2. Install dependencies: `npm install`
3. Configure `.env.local` with Firebase and Cloudinary credentials.

### Commands
- `npm run dev`: Start local development server.
- `npm run build`: Production-grade build (includes Type-checking and Linting).
- `npm run lint`: Run ESLint checks.

---

## 📂 Directory Structure
- `src/app/(public)`: All customer-facing routes.
- `src/app/admin`: Auth-protected CMS dashboard.
- `src/components/3d`: Heavy WebGL components (Next/Dynamic).
- `src/services`: Firestore CRUD logic.
- `src/lib`: Firebase and Cloudinary config.
- `src/context`: Global React state (Enquiry Modal).
