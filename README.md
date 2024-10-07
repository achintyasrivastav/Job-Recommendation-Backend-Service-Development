# Job Recommendation Backend Service Development

This project implements a new feature for an AI-powered talent acquisition platform that recommends relevant job postings to users based on their profiles and preferences. The job recommendation system uses a content-based recommendation algorithm incorporating **TF-IDF** and **keyword matching**.

## Project Structure

```bash
├── models/                   # MongoDB models (Job schema)
├── routes/                   # API routes (job-related routes)
├── content_based_algorithm/   # Recommendation logic
├── db.js                     # MongoDB connection setup
├── server.js                 # Express server setup
├── .env.example              # Example environment variables file
├── .gitignore                # Git ignored files (including .env)
└── README.md                 # Project documentation
```

## Features

*   **Content-based job recommendation** using TF-IDF scores.
*   **Keyword matching fallback** for job suggestions when TF-IDF scores are low.
*   API endpoints for job CRUD operations and fetching recommendations.
*   MongoDB as the database for storing job postings and user data.

## Setup Instructions

### Prerequisites

*   Node.js and npm installed
*   MongoDB installed and running

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/job-recommendation-system.git 
    cd job-recommendation-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    * Create a `.env` file in the root of the project based on `.env.example`:

    ```bash
    cp .env.example .env
    ```

    * Edit the `.env` file with your MongoDB connection string:

    ```bash
    MONGO_URI=mongodb://localhost:27017/job-recommendation-db
    ```

4.  **Start the MongoDB service.**

5.  **Run the application:**

    ```bash
    npm start
    ```

    The server should be running at `http://localhost:3000`.

