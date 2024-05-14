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
- Feature 1: Chats
- Feature 2: Post
- Feature 3: Home
- Feature 4: Registration
- Feature 5: Login
- Feature 6: Feed
- Feature 7: ForgotPassword
- Feature 8: NewPassword
- Feature 9: Profile/Edit Profile
- Feature 10: Verification
- Feature 11: Friends
  
### Extra Credit
- forget password
- as a user, upon searching, I want to be able to easily add friends, add hashtags that I’ve searched for
- as a user, when I receive friend requests I should be notified of incoming requests with a notification (and conversely when I send a request to a user)
- as a user, when I receive new messages or requests to join new chats, I should be notified with a notification.
- if a user is “public”, then they won’t require a friend request to add them as a friend.
- as a user, I want to be able to send friend requests to other users to grow my network.
- making posts private, friends only, and public

## Source Files Included
- 

## Code Declaration
We declare that all the code submitted in this repository was written by the members listed above, except where specified in the source files themselves or reused from past homeworks.

## Build and Run Instructions

### Prerequisites
- Node.js installed 
- Apache Spark installed
- Install react scripts
- npm i within backend and frontend to install dependencies

### Setup Instructions
1. Clone the repository
2. For testing backend operations, cd into backend (run npm start)
3. cd into frontend (run npm start)
4. For sparkjob, run mvn clean, compile, package (for .jar file), update .env for your AWS credentials
