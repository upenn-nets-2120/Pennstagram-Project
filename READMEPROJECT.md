## Team Information

- **Team Number**: go7
- **Team Name**: project-electro-motive-diesel-sd70-ace-t4


### Team Members
| Full Name       | SEAS Login Name |
|-----------------|-----------------|
| Joshua Weissman | joshw11         |
| Alain Welliver  | alainw          |
| Sem Ferid       | semf            |
| Anushka Levaku  | alevaku         |

## Project Description
The project aims to create a social media platform that engages users through interactive features like chat options, notifications for follow requests and chats, creating profiles/accounts, and uploading, updating, or deleting posts they create. Upon signing up, users can add photos to their profiles and select relevant hashtags. The project would use a feed that presents posts based on their ranking through sn adsorption algorithms processed in Apache Spark and updated through Apache Kafka. Profiles can be linked to similar actor profiles using image recognition. For communication, the system includes a chat feature that supports both individual and group conversations, with options to invite friends for a chat and maintain chat history for continuity. Notifications alert users to new posts, chat invitations, and friend activities.

### Features Implemented
- Feature 1: Chats: a page where users can have conversations with friends through direct or group chat-style features
- Feature 2: Post: users can upload images and create posts, update posts, and delete posts on this page
- Feature 4: Registration: this is where users can sign up for an account on the page and enter their name, email, password, birthday, and affiliations
- Feature 5: Login: users can login into the platform on this page and access their accounts
- Feature 6: Feed: this page displays posts and a content stream updated through Apache Kafka
- Feature 7: ForgotPassword: users are able to initiate a password reset if they have forgotten their login credentials, which sends an email to reset their password
- Feature 8: Profile/Edit Profile: this page also users to view their profile and make changes to their personal details like updating a profile photo
- Feature 9: Friends: users can view their current friends, send friend requests, and accept follow requests
  
### Extra Credit
- forget password
- as a user, upon searching, I want to be able to easily add friends, add hashtags that I’ve searched for
- as a user, when I receive friend requests I should be notified of incoming requests with a notification (and conversely when I send a request to a user)
- as a user, when I receive new messages or requests to join new chats, I should be notified with a notification.
- if a user is “public”, then they won’t require a friend request to add them as a friend.
- as a user, I want to be able to send friend requests to other users to grow my network.
- making posts private, friends only, and public

## Source Files Included
- Backend src folder includes necessary database operations (db-operations) for each of the features as well as for accessing the S3 bucket, databse setup (db-setup) for the tables used with storing information about users, posts, hashtags, etc, routes (routes) for each of the features, and utils for the face-match portion of the assignment
- Frontend src folder includes elements like assets, reusable components, and constants, entities, hooks, pages for different features, providers for user and theme, a router for managing different paths, and utils for tasks like chats and requests

## Code Declaration
We declare that all the code submitted in this repository was written by the members listed above, except where specified in the source files themselves or reused from past homeworks.

### Prerequisites
- Node.js installed 
- Apache Spark installed
- Install react scripts
- npm i within backend and frontend to install dependencies

### Setup Instructions & Build and Run Instructions
1. Clone the repository
2. For testing backend operations, cd into backend (run npm start)
3. cd into frontend (run npm start)
4. For sparkjob, run mvn clean, compile, package (for .jar file), update .env for your AWS credentials
