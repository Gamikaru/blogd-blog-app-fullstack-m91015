
## **Login - `/login`**
### **Data Requirements:**
None
### **Actions:**
- **Form Validation:**
  - **Fields**: Email (optional: validate string structure), Password
  - **Requirements**: All fields required
- **Login Button**:
  - **If Valid Inputs**:
    - **Action**: Send fetch request to check for existing user and match form inputs with user data.
    - **Server Response Examples**:
      - **Success**:
        ```json
        {
          "status": "ok",
          "data": {
            "user": {
              "first_name": "Brutus",
              "last_name": "Conway",
              "birthday": "1980-04-20T18:25:43.511Z",
              "email": "brutus@happy.com",
              "password": "Test123!",
              "status": "I am loving living life!!!",
              "auth_level": "basic"
            },
            "token": "generated_jwt_token_here"
          },
          "message": "User logged in successfully"
        }
        ```
      - **Failure (e.g., user not found or incorrect password)**:
        - **Action**: Show modal error alert, reset form
        - **Response**:
          ```json
          {
            "status": "400",
            "message": "Bad request - user not found or password incorrect"
          }
          ```
  - **If Invalid Inputs**:
    - **Action**: Show modal error alert (error specific message with valid inputs), reset form
- **Register Link**:  'Not a member? Register Now'
  - **Action**: Navigate to registration page

## **Registration - `/registration`**
### **Data Requirements:**
None
### **Actions:**
- **Form Validation:**
  - **Fields**: First Name, Last Name, Email (optional: validate email string structure), Birthdate (use date picker), Password, Occupation, Location
  - **Requirements**: All fields required
- **Register Button**:  'Register'
  - **If Valid Inputs**:
    - **Action**: Send form content for validation/submission via fetch request.
    - **Server Response Examples**:
      - **Success**:
        ```json
        {
          "status": "ok",
          "data": {
            "user": {
              "first_name": "Brutus",
              "last_name": "Conway",
              "birthday": "1980-04-20T18:25:43.511Z",
              "email": "brutus@happy.com",
              "password": "Test123!",
              "status": "",
              "auth_level": "basic"
            }
          },
          "message": "New user created successfully"
        }
        ```
      - **Failure (e.g., user exists, network issue)**:
        - **Action**: Show modal error alert, reset form
        - **Response**:
          ```json
          {
            "status": "409",
            "message": "User already exists or network issue"
          }
          ```
  - **If Invalid Inputs**:
    - **Action**: Show modal error alert with error message, reset form
			
## **Header**
### **Data Requirements:**
- Required for User Name Element 
### **Positioning**
- Horizontal, at the top of every page.
### **Actions:**
- **Logo**: Displays the CodeBloggs logo, clickable, navigates to the homepage.
- **Header Text**: Provided dynamically based on the current page view.
- **Post Button**: Opens the post modal to allow users to create new content, on-hover color change
    - **API Interaction:**
        - **Request**: No data sent to the backend upon button click.
        - **Action**: Modal pop-up for post creation. 
- **User Name Display:**
    - **Stylized Initials:** Shows the initials of the logged-in user with custom styling
    - **Data Fetching:**
    - **API**: Fetch user details.
    - **Success Response**:
    ```json
    {
      "status": "ok",
      "data": {
        "user": {
          "first_name": "John",
          "last_name": "Doe",
          "initials": "JD",
          "email": "johndoe@example.com"
        }
      },
      "message": "User data retrieved successfully"
    }
    ```
  - **Failure Response**:
    ```json
    {
      "status": "500",
      "message": "Network error or invalid session token"
    }
    ```
  - **Action on Error**: Display modal alert notifying the user of the error.


## **Navbar**
### **Data Requirements:** 
- None
### **Positioning**: 
-Vertically along the left side of the page.
### Actions
- Each link in the Navbar acts as a navigation tool, with active link highlighting:
  - **Home**: Navigates to the homepage.
  - **Bloggs**: Renders Bloggs component as Main view 
  - **Network**: Renders Network component as Main view, with user cards.
  - **Admin** (conditional based on user role, user auth_level): Access to administrative features.

## **Main - Home View**

## **Main - Network View (ACTIONS TBC)** /network/{userid}
### **Data Requirements:**
- **Required**: Fetches data to populate each "User Card" displayed in the network view.
### **Actions:**
- **User Card Click**:
  - **Action**: Navigates to the detailed user profile or initiates a direct message.
  - **API**:
    ```json
    {
      "request": "GET",
      "endpoint": "/api/user/details",
      "params": { "userId": "12345" }
    }
    ```

## **Main - User Card Detailed View - /user/{userid}
### **Data Requirements:**
- **Required**: Fetch detailed user data including initials, user information, user status, and recent posts.
### **Actions:**
- **Interactions** (Follow, Send Message):
  - **API Call**: Update user interactions.
  - **Example API Request**:
    ```json
    {
      "request": "POST",
      "endpoint": "/api/user/follow",
      "body": { "followedUserId": "12345" }
    }
    ```

## **Main - User View and Post Detail**
### **Wireframe Description**
#### **Data Requirements:**
- **Required**: Data for user details and posts.
#### **Actions:**
- **Edit User Information**, **Add Post**, **Interact with Post**:
  - **API Interactions**:
    - **Update User Info**:
      ```json
      {
        "request": "PATCH",
        "endpoint": "/api/user/update",
        "body": {
          "userId": "12345",
          "updatedData": {
            "status": "New status message",
            "location": "New location"
          }
        }
      }
      ```
    - **Add Post**:
      ```json
      {
        "request": "POST",
        "endpoint": "/api/post",
        "body": {
          "userId": "12345",
          "content": "Here is a new post content"
        }
      }
      ```
    - **Like Post**:
      ```json
      {
        "request": "POST",
        "endpoint": "/api/post/like",
        "body": {
          "postId": "67890"
        }
      }
      ```

## **CodeBloggs - Base Frames and Dropdown**
### **Header**
#### **Data Requirements:**
- Required for User Name Element 
#### **Positioning**
- Horizontal, at the top of every page.
#### **Actions:**
- **Logo**: Displays the CodeBloggs logo, clickable, navigates to the homepage.
- **Header Text**: Provided dynamically based on the current page view.
- **Post Button**: Opens the post modal to allow users to create new content, on-hover color change
    - **API Interaction:**
        - **Request**: No data sent to the backend upon button click.
        - **Action**: Modal pop-up for post creation. 
- **User Name Display:**
    - **Stylized Initials:** Shows the initials of the logged-in user with custom styling
    - **Data Fetching:**
    - **API**: Fetch user details.
    - **Success Response**:
    ```json
    {
      "status": "ok",
      "data": {
        "user": {
          "first_name": "John",
          "last_name": "Doe",
          "initials": "JD",
          "email": "johndoe@example.com"
        }
      },
      "message": "User data retrieved successfully"
    }
    ```
  - **Failure Response**:
    ```json
    {
      "status": "500",
      "message": "Network error or invalid session token"
    }
    ```
  - **Action on Error**: Display modal alert notifying the user of the error.
### **Navbar**
#### **Data Requirements:** 
- None
#### **Positioning**: 
-Vertically along the left side of the page.
#### Actions
- Each link in the Navbar acts as a navigation tool, with active link highlighting:
  - **Home**: Navigates to the homepage.
  - **Bloggs**: Renders Bloggs component as Main view 
  - **Network**: Renders Network component as Main view, with user cards.
  - **Admin** (conditional based on user role, user auth_level): Access to administrative features.


