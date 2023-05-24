# Mantis - Bug Tracker API

The Bug Tracker API is a backend API service that provides functionality for managing bugs and issues in software projects. It serves as the backend for the Bug Tracker application, allowing the frontend to interact with the database and perform CRUD operations on projects, issues and tickets.

## Features

- Authentication: Handle user authentication and authorization for accessing and manipulating bug data.
- Issues and Tickets Management: Create, retrieve, update, and delete records in the database.
- User Management: Manage user accounts, including registration, login, and profile management.
- Project Management: Associate bugs with specific projects and handle project-related operations.
- API Endpoints: Expose RESTful API endpoints for interacting with bug and project data.

## Technologies Used

- Nestjs: A nodejs framework to build escalable APIS
- PostgreSQL: A database to store data and logic schemas
- Passport: A middleware for handling user authentication and authorization.
- JWT: JSON Web Tokens for secure authentication and session management.

## Installation

1. Clone the repository: `git clone https://github.com/softEsteban/bugtracker-api.git`
2. Navigate to the project directory: `cd bugtracker-api`
3. Install the dependencies: `npm install` or `nest start`

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Define the following environment variables in the `.env` file:
   #Github API

   - `CLIENT_ID`=<client_id>
   - `CLIENT_SECRET`=<client_secret>

   #Chatgpt API

   - `CHAT_KEY`=<api_akey>

   #Mailing and Gmail

   - `EMAIL_USER`=<email>
   - `EMAIL_PASS`=<password>

   - `CONFIRM_URL`="http://localhost:3000/auth/confirmAccount?email="
   - `LOGIN_URL`="http://localhost:4200/login"

   #JWT

   - `JWT_SECRET_KEY`=<secret_key>
   - `JWT_EXPIRATION`=1d

   #Database

   - `DATABASE_HOST`=<host>
   - `DATABASE_PORT`=<port>
   - `DATABASE_USERNAME`=<user>
   - `DATABASE_PASSWORD`=<passwor>
   - `DATABASE_NAME`=mantis

## Usage

1. Start the API server: `npm start`
2. The API will be accessible at `http://localhost:<port>`, where `<port>` is the port number specified in the `.env` file.

## API Documentation

For detailed information about the available API endpoints and their usage, refer to the API documentation. [Link to API documentation goes here]

## Contributing

Contributions to the Bug Tracker API are welcome! If you encounter any bugs, have feature requests, or want to contribute enhancements, please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any inquiries or questions, please contact [Your Name](mailto:your.email@example.com).
