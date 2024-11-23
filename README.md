# 🎨 Stage Stream Frontend

**Frontend Project for Stage Stream:** A zero-latency streaming solution built on MediaMTX.

---

## 🚀 **Setup**

Follow the [Setup Guide](https://stagestream.jxnxsdev.me/setup) for detailed instructions.

---

## 🔧 **Building the Project (Developement)**

### Requirements:

- **NodeJS**: Version 20 or newer
- **TypeScript**

### Steps:

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Build the Project**:  
   Run the TypeScript compiler:

   ```bash
   npm tsc
   ```

   To enable watch mode for automatic rebuilds:

   ```bash
   npm tsc -w
   ```

3. **Start the Development Server**:  
   Use the following command to start the frontend development server:
   ```bash
   npm start
   ```

---

## ⚙️ **Environment Variables and Configuration**

There are two ways to configure the environment:

1. **Edit the `defaults.json` file**: Located in the `src/` directory.
2. **Set Environment Variables**: Use your system or `.env` file.

### Supported Environment Variables:

#### General Settings

| Variable     | Description                                 |
| ------------ | ------------------------------------------- |
| **WEB_PORT** | Port for the development server to bind to. |

#### Media and API Configuration

| Variable       | Description                     |
| -------------- | ------------------------------- |
| **STREAM_URL** | URL where MediaMTX runs.        |
| **API_URL**    | URL where the backend API runs. |

---

## 📂 **Output**

The compiled project will be placed in the `/build` folder after building.

---
