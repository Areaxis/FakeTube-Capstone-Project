# FakeTube Capstone Project

## Frontend

* React (Vite)
* Redux Toolkit
* React Router
* Axios
* CSS (Responsive Design)

## Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

## Features
1. Authentication

* User registration and login
* JWT based authentication
* Persistent login using token
* User avatars stored as image URLs

2. Videos

* Upload videos using video URLs (no file uploads)
* Add thumbnail URLs
* Edit and delete your own videos

3. Like and dislike system

* View count display

4. Comments

* Add comments to videos
* Edit your own comments
* Delete your own comments
* Real-time comment refresh

5. Channel page

* Home tab (featured oldest video + grid)
* Videos tab (all channel videos)

6. Homepage

* Category filter bar
* Search functionality
* Responsive video grid
* Empty state when no videos found

7. Video Page

* Video player using URL
* Channel info with subscribe button (UI only)
* Like, dislike, share, and download
* Expandable description
* Fully functional comment section
* Recommendation videos sidebar
  
8. Channel Dashboard

* Create and manage channels
* Upload videos
* Edit video details
* Delete videos
* View all videos of your channel

9. Responsive Design

* Desktop, tablet, and mobile support
* Sidebar hidden on small screens
* Adaptive video grid
* Mobile-friendly header and layout

## API Overview
1. Auth

* POST	/api/auth/register	Register user
* POST	/api/auth/login	Login user
* GET	/api/auth/me	Get logged in user

2. Channels
   
* POST	/api/auth/channels	Create channel
* GET	/api/auth/channels	Get all channels
* GET	/api/auth/channels/:id	Get channel by ID
  
3. Videos

* POST	/api/auth/videos	Upload video (URL based)
* GET	/api/auth/videos	Get all videos (filter/search)
* GET	/api/auth/videos/:id	Get single video
* PUT	/api/auth/videos/:id	Update video
* DELETE	/api/auth/videos/:id	Delete video
* PUT	/api/auth/videos/:id/like	Like video
* PUT	/api/auth/videos/:id/dislike	Dislike video
  
4. Comments

* POST	/api/auth/videos/:videoId/comments	Add comment
* GET	/api/auth/videos/:videoId/comments	Get comments
* PUT	/api/auth/comments/:id	Update comment
* DELETE	/api/auth/comments/:id	Delete comment

## Installation

1. Clone the Repository
```bash
git clone https://github.com/your-username/faketube.git
cd faketube
```

2. Backend Setup
```bash
cd NodeJS
npm install
npm start
```

3. MongoDB must be running locally:
```bash
mongodb://127.0.0.1:27017/youtube_clone
```

3. Frontend Setup
```bash
cd ../
npm install
npm run dev
```

4. Frontend runs on:
```bash
http://localhost:5173
```

5. Backend runs on:
```bash
http://localhost:5000
```

## Sample Data / Seeding

This project includes real sample data exported from MongoDB using mongodump.

To seed the database:

1. Make sure MongoDB is running
2. Navigate to the backend folder
3. Run:
  ```bash
  npm install
   npm run seed
  ```
This will restore users, channels, videos, and comments into the database.

## Author

### Khriesezo Peseyie
Developed as a Full Stack Capstone Project.
Built with love using the MERN stack.
