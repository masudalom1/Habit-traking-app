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

# Habit Tracker App (React Native + Appwrite)

This is a simple Habit Tracking mobile app built with **React Native (Expo)** and **Appwrite** as the backend. It allows users to:

- Sign up & log in (Authentication)
- Add, list, and track habits
- Delete habits (with long press interaction)
- Store data securely with Appwrite’s database
- Cancel delete mode easily with a cancel button

## 📸 Screenshots

| Habit Cards | Long Press to Delete | Delete + Cancel |
 
<img src="https://github.com/user-attachments/assets/2efeb854-702a-431b-992f-7e33dfa33d5f" width="200" />


## ⚙️ Tech Stack

- React Native (Expo)
- Appwrite (Database + Auth)


## 📁 Project Structure




## 🔐 Authentication

Handled using Appwrite’s account APIs. Users must log in or sign up before accessing habit tracking features.

## 🗃️ Database Schema

Appwrite Collection: `HABITS_COLLECTION_ID`

| Field Name | Type   | Required |
|------------|--------|----------|
| title      | string | ✅       |
| userId     | string | ✅       |

## 💡 Features

- 🧠 Add & track multiple habits
- 👆 Long-press to delete (with visual blur effect)
- ❌ Cancel delete mode if user changes mind
- 🔐 Secure per-user data access with Appwrite

## 🏃 Getting Started

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yourusername/habit-tracker-app.git
   cd habit-tracker-app
```
## Environment Variables

```bash
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_DATABASE_ID=your_db_id
APPWRITE_HABITS_COLLECTION_ID=your_collection_id
```
# thank you