# Uppy Uploader Assignment

My submission for the Uppy image uploader assignment.

## Overview

This project involves building a production-ready image uploader in React using Uppy's headless/core API with a fully custom UI. The goal is to showcase the ability to work with third-party libraries at a low level while delivering a polished and responsive user experience.

## Setup

To set up and run the project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Raj2631/uppy-uploader.git
```

2. Navigate to the project directory:

```bash
cd uppy-uploader
```

3. Install the dependencies (use pnpm):

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

5. Open your browser and go to `http://localhost:5173/` to view the application.

### Environment Variables and Cloudinary Setup

Create a `.env` file in the root of the project and add the following variables:

```env
VITE_CLOUDINARY_NAME=<your-cloudinary-cloud-name>
VITE_UPLOAD_PRESET_NAME=<your-upload-preset-name>
```

Replace `<your-cloudinary-cloud-name>` and `<your-upload-preset-name>` with the values from your Cloudinary account.

## Architecture

This project follows a modular and scalable architecture designed for maintainability and ease of development. Below is an overview of the key components:

### 1. **Folder Structure**

The project is organized into the following main directories:

- **src/**: Contains all the source code for the application.
  - **components/**: Reusable React components.
  - **hooks/**: Custom React hooks for managing reusable logic.

### 2. **TypeScript Integration**

TypeScript is used throughout the project to ensure type safety and reduce runtime errors. All components, hooks, and services are strongly typed.

### 3. **Styling**

The project uses [Tailwind CSS](https://tailwindcss.com/) for utility-first and responsive styling. Tailwind CSS allows for rapid UI development with a consistent design system.

### 4åß. **Build and Deployment**

This project is build using [Vite](https://vite.dev/) and deployed to [Vercel](https://vercel.com/)
