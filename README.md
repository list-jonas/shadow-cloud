# Shadow Share V1.1

## About the project
Shadow Share is an intuitive and secure file-sharing platform designed to prioritize both ease of use and user privacy. Driven by the vision of simplified and confidential file-sharing, Shadow Share presents a seamless experience where users can effortlessly bundle multiple files and upload them to the platform.

Upon uploading, users are immediately presented with a unique URL, linking them directly to their uploaded content. This direct-access approach ensures that users can swiftly navigate to their files and decide which particular files they want to download, giving them granular control over their data.

A standout feature of Shadow Share is its commitment to user privacy. Unlike many mainstream file-sharing platforms where anyone can register, Shadow Share adopts a more exclusive approach. Each user account, with the exception of the admin account, has to be created manually. This manual creation process guarantees that only authorized individuals have access to the platform, dramatically enhancing the security of stored files.

Moreover, administrators have the capability to assign maximum storage space on a per-user basis. This feature ensures optimal resource allocation, preventing any one user from overwhelming the system and ensuring fair distribution of storage capacities.

> In an age where digital security is paramount and simplicity is sought after, Shadow Share stands as a beacon for those seeking a user-friendly yet ultra-private file-sharing solution. Whether it's for professional use, where confidential documents need to be shared, or for personal use, where one wants to ensure their files remain private, Shadow Share is the ideal platform.

## Initial Setup
### Initiate Docker Container
To run the application in a production-like environment, you can use Docker. The Dockerfile and docker-compose files should be set up to create the necessary containers. Start them with the command:

```docker
docker-compose up --build
```
Now the Website is accesible using port `3000`. [here](loclhost://3000)

---

### Admin user
Upon your first visit to the website, you'll encounter a login prompt. Simply input your email address and password to auto-generate an admin account. All subsequent accounts require creation via user management.

## Start Project in `dev` Mode
To start the application in development mode, navigate to the frontend and backend directories and run `npm run dev`.

```cmd
cd ./frontend
npm run dev
```
The Frontend will run on port `3001`. **ONLY IN DEV ENVIROMENT** [here](loclhost://3001)

```cmd
cd ./backend
npm run dev
```
The Backend will run on port `3000`. [here](loclhost://3001)
It's the same as it would inside prod or qs, but **without the website**.

## Make Project Ready for Production
### Fix Build Errors
When preparing for a production environment, it's necessary to build the frontend code into a version that can be efficiently served. You can do this by running `npm run build`. If any errors occur during this process, they should be resolved.

```cmd
cd ./frontend
npm run build
```
### Rebuild Docker Container
To run the application in a production-like environment, you can use Docker. The Dockerfile and docker-compose files should be set up to create the necessary containers. Start them with the command:

```docker
docker-compose up --build
```
Now the Website is accesible using port `3000`. [here](loclhost://3000)

---
## About the Technology Stack
The Shadow Share application uses a modern technology stack, featuring React, Express, and Prisma.

### Frontend: [React](https://react.dev) and [PrimeReact](https://primefaces.org/primereact/) with [ChartJS](https://www.chartjs.org)

In this project, the frontend is powered by React and PrimeReact. 

<img src="https://miro.medium.com/v2/resize:fit:1200/format:webp/0*p4OJ29rbtqDvpLU7.png" height="100">

[React](https://react.dev) is a popular JavaScript library for building user interfaces, particularly for single-page applications. It facilitates the creation of reusable UI components and operates on a virtual DOM, allowing for high-performance rendering.

<img src="https://primefaces.org/cdn/primereact/images/primereact-logo-dark.svg" height="100">

[PrimeReact](https://primefaces.org/primereact/) is a rich **UI component library** for React, providing various pre-built components that can easily be used and customized in React applications. It includes components for various tasks and needs such as inputs, buttons, data display, navigation, overlays, and more. It also provides themes and templates for quick UI design.

In this Shadow Share application, PrimeReact is used extensively to build out the user interface, leveraging its various components to speed up development and maintain consistency in design. By combining PrimeReact with React, we can create dynamic, engaging, and responsive user interfaces with less effort.

The frontend communicates with the backend through [axios](https://axios-http.com/docs/post_example) HTTP requests, sending and receiving data to provide a dynamic user experience. The use of these technologies allows the frontend to provide an efficient, interactive, and engaging user interface for users.

<img src="https://avatars.githubusercontent.com/u/10342521?s=280&v=4" height="100">

[ChartJS](https://www.chartjs.org) is a versatile and flexible open-source charting library for designers and developers. It uses HTML5 canvas based technology to render different types of charts in a web application, offering beautiful, responsive, and interactive visualizations. It supports a variety of chart types, including line, bar, pie, doughnut, radar, and more.

In this Shadow Share application, ChartJS is used in conjunction with PrimeReact to display relevant graphical data to the admins. PrimeReact's [Chart component](https://primefaces.org/primereact/showcase/#/chart) is actually a wrapper around ChartJS, making it easy to use ChartJS in a React application. This integration provides a powerful tool for data visualization, as it combines the simplicity and flexibility of ChartJS with the robustness and reusability of PrimeReact's components.

By using ChartJS with PrimeReact, it's possible to render dynamic and interactive charts based on the application's data.

### Backend: [Express](https://expressjs.com) and [Prisma](https://www.prisma.io)
<img src="https://raw.githubusercontent.com/aleksandryackovlev/openapi-mock-express-middleware/master/assets/express-logo.png" height="100">

[Express](https://expressjs.com) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of writing server code and includes features for routing, middleware configuration, and more.

<img src="https://prismalens.vercel.app/header/logo-dark.svg" height="100">

[Prisma](https://www.prisma.io) is an open-source database toolkit. It replaces traditional ORMs and can be used to build GraphQL servers, REST APIs, microservices and more. In this application, Prisma interacts with the database, allowing the backend to perform CRUD operations.

Together, Express and Prisma create a robust and scalable backend for the application.