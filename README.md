This is Jay's project for Permaconn interview.

The repository includes 2 folders

`/client`: ReactJS frontend
`/server`: Express JS app

Step to run client:

```
npm install

npm start
```

App will be served in http://localhost:3000

Step to run server:

```
npm install

npm run dev
```

Unit testing:

```
npm run test
```

Database setup: My choice of database is PostgreSQL. To make it easy, I have written a `docker-compose.yml` file that will create a database container in your local. You are required to have Docker in order to run this.

```
docker-compose up -d
```

Configure .env file: `.env` file will be excluded from the repository for security reason. You can setup your environment as below 

```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=admin 
DB_PASSWORD=admin123
DB_NAME=permaconn
TEST_TOKEN=<This will be used as a mock token to run the unit test. Copy the token from /api/login response and paste it here>
```

Docker build and running: Both client and server contain Dockerfile to build the docker images. Steps can be followed:

```
cd client/
docker build -t client .

cd server/
docker build -t server .
```

List of project pages:
- Home Page: Display a table of products with details. For first time user, they can only see the list of products, add to cart button and a login button. If the user is not logged in and click to Add to cart button, the system will tell the user to login. After logging in, users can add the items to cart and checkout. If the user tries to add/update the products, they will be announced if they don't have permissions to do that. If they do, perform the action
- Super admin page: This is the page for user who have super admin role. A button super admin will appear in the home page. Clicking into that will redirect the admin to super admin page, where they can see the list of the user and update their permissions.
- Login page: Login page for user and super admin to login to the page. 

What needs to be improve:
There are many things that I can think of when doing this project. Due to the limited time, I didn't have time to overcome all of these. I will point some of the suggested improvements here:

Frontend:
- There are a lot of internal states in each components, especially in the `Home.tsx`. Some of them can be reused but needed to be created inside other components instead. I would suggest using a state management such as `useContext` or `Redux` to this. It's definitely recommended in commercial projects.
- Implementing data pagination. In this use case I'm fetching all the records from the database, which will be a heavy task in the future that will reduce the performance of the application remarkably.
- Improve the Form component so it can be used for every use cases. Currently I'm creating 2 Form components which are quite similar.
- Implementing some unit testings
- Authentication flow need to be improved. Currently I'm cheating by check user login in every single page, which can be easily done by creating a HOC to serve the other pages as its child components.

Backend:
- Code need to be well-structured. Currently I'm writing everything in `index.ts`, which can be very messy. I would recommend to have separate folder `controller/`, `service/`, `routes`, etc. That will give us more cleaner strucutre. I would also recommend using classes in order to follow the SOLID principal in developing backend.
- Unit testing need to mock the database connection instead. Currently it is manipulating the database while running the test, which can create a lot of dummy data.
- Implementing relationship between tables.
