# Registration API

This is an Express.js and MongoDB API for managing user registrations. It allows users to retrieve all registrations, create new registrations with auto-generated or custom IDs, and delete registrations by `regId`. The project connects to a MongoDB instance for data storage.

## Features

- **Retrieve Registrations**: Fetch all registration documents or filter them using query parameters.
- **Create Registration**: Add a new registration entry with auto-generated or custom `regId`.
- **Delete Registration**: Remove a registration entry by specifying the `regId`.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment**:
   Replace the MongoDB connection string in `index.js` with your MongoDB URI:
   ```javascript
   mongoose.connect("<Your MongoDB URI>")
   ```

4. **Start the server**:
   ```bash
   node index.js
   ```
   The server will run on port `3001`.

## API Endpoints

### 1. Get All Registrations
   Retrieve all registration documents or filter based on query parameters.

   - **URL**: `/registrations`
   - **Method**: `GET`
   - **Query Parameters** (optional): Filter fields like `name`, `dept`, `college`, etc.
   - **Success Response**:
     - **Code**: 200
     - **Content**:
       ```json
       [
           {
               "_id": "612e1bf539d25a2b9409cfea",
               "regId": "RID123",
               "name": "John Doe",
               "phNo": 1234567890,
               "year": 2023,
               "dept": "Engineering",
               "email": "johndoe@example.com",
               "college": "Sample University",
               "refCode": "REF001"
           },
           ...
       ]
       ```

### 2. Create a New Registration
   Create a new registration entry. If `regId` is not provided, it auto-generates based on the highest `regId`.

   - **URL**: `/registrations`
   - **Method**: `POST`
   - **Body** (JSON):
     ```json
     {
         "name": "John Doe",
         "phNo": 1234567890,
         "year": 2023,
         "dept": "Engineering",
         "email": "johndoe@example.com",
         "college": "Sample University",
         "refCode": "REF001"
     }
     ```
   - **Success Response**:
     - **Code**: 201
     - **Content**:
       ```json
       {
           "message": "Inserted new registration successfully."
       }
       ```

### 3. Delete a Registration
   Delete a registration by `regId`.

   - **URL**: `/registrations`
   - **Method**: `DELETE`
   - **Query Parameters**:
     - `regId`: Registration ID to delete.
   - **Success Response**:
     - **Code**: 200
     - **Content**:
       ```json
       {
           "message": "regId deleted successfully."
       }
       ```
   - **Error Response**:
     - **Code**: 404
     - **Content**:
       ```json
       {
           "message": "RegId not found."
       }
       ```

## Code Overview

### Dependencies

- **Express**: Web framework for building RESTful APIs.
- **Mongoose**: MongoDB ODM for data modeling.
- **MongoDB Atlas**: Cloud database service.

### File Structure

- **index.js**: Main file containing the Express server setup and API routes.
- **models/Registrations.js**: Mongoose model definition for the `Registration` schema.

### Summary

- **Creating a New Registration**: Use a `POST` request to the `/registrations` endpoint with the registration details in the request body.
- **Getting All Registrations**: Use a `GET` request to the `/registrations` endpoint. You can also filter results by appending query parameters.
- **Deleting a Registration**: Use a `DELETE` request to the `/registrations` endpoint with the `regId` specified in the query parameters.

This approach allows users to interact with your API using standard JavaScript methods without requiring external tools like `cURL`.


## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Author

Created by Vijay Srinivas K.
```

This `README.md` provides a clear project overview, instructions for setup, and documentation for each endpoint, making it easy to understand and use the API.
