# C.I.C.E - Project Three (GA)

This project was completed at the end of Unit 3 of the Software Engineering Immersive Course. The current focus was React.js and the goal of the project was to produce a Frontend and Backend for a site that would allow for CRUD Operations. As a part of a 2-person team we created a messaging application to allow users to create private & group chats with contacts making use of the MERN (MongoDB, Express.js, React.js, Node.js infrastructure).

![messaging-app](https://i.imgur.com/p2P7Fmn.png)

## Deployment

This project was deployed using Netlify and is available [here](https://cicefe.netlify.app/)

## Getting started

This project is separated into two repositories

- [Frontend](https://github.com/alfphiee/chatappfe)
- Backend (This repo)

To run the backend:

1. Clone this repository
2. In CLI run `npm i` on the root folder to install the required dependencies
3. Next in the CLI run `node server.js` to run the backend in your local environment

## Timeframe & Working Team

We had a week to complete this project, working as a group of two.

## Technologies Used

- Node.js
- MongoDB
- Express.js
- React.js
- ShadCN
- Tailwind CSS
- Sockets.io
- react-router-dom
- Craco
- Bcrypt
- Mongoose
- Git
- jsonwebtoken
- zod

## Brief

- A working full-stack, single-page application hosted on Heroku.
- Incorporate the technologies of the MERN-stack:
  - MongoDB/Mongoose
  - Express
  - React
  - Node
- Have a well-styled interactive front-end
- Communicates with the Express backend
- Implement token-based authentication. Including the ability of a user to sign-up, log in & log out
- Implement authorization by restricting CUD data functionality to authenticated users. Also, navigation should respond to the login status of the user.
- Have a well-scoped feature-set. Full-CRUD data operations are not required if one or more other features are included, for example:
  - Consume data from a third-party API.
  - Implement additional functionality if the user is an admin.
  - Implementation of a highly dynamic UI or data visualization.
  - Other, instructor approved, complexity/features.

## Planning

Started by initially creating an ERD Diagram:

![ERD-diagram](https://imgur.com/aaB3Ogx.png)

Then created some basic Wireframes to understand the flow and layout of the site:

![Wireframe](https://imgur.com/cOFEXXf.png)

We then created a basic plan of how our Data Models might look, a few basic endpoints that we would need and some notes around how we would implement the Frontend

![Notes](https://imgur.com/FukXTJa.png)

We used a Trello board to track our current workload - we started and ended each day with a catch-up to make sure we both were clear on what the other team member was working on and what we would be tackling next.

We broke down every User Story we created into which component of the Frontend it was related to e.g. User Profile - we also used a basic prioritisation system to flag the priority of implementing each User Story - we used Must Have, Should Have, Nice to Have. This really helped us work methodically through each User Story and focus initially on what we felt were the most important features

![Trello-board](https://imgur.com/deIRnBu.png)

## Build/Code Process

```javascript
import jwt from "jsonwebtoken";

export default function (req, res, next) {
  // Check for the token being sent in a header or as a query parameter
  let token = req.get("Authorization") || req.query.token;
  if (token) {
    token = token.replace("Bearer ", "");
    // Check if token is valid and not expired
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      req.user = err ? null : decoded.user;
      req.exp = err ? null : new Date(decoded.exp * 1000);
      return next();
    });
  } else {
    req.user = null;
    return next();
  }
}
```

Started off by implementing authentication - the application was only for registered users so we felt it was important to ensure authentication was working before we could start building out the rest of the Backend / Frontend. We used jwt tokens - first we’d extract the token from the request before we verified it using the secret key - we then added the user information to the request payload.

```javascript
const formSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function SignUpForm({ setUser }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const user = await signUp(values);
      setUser(user);
    } catch (err) {
      console.error(err);
    }
  };
```

On the Frontend we used zod to validate our form submissions - this allowed us to add some custom validation - like making sure the confirmed password matched the initial password field. It also allows us to easily add error messages which help the user to correct any errors they have in the forms ‘e.g. Password must be at least 6 characters long’

```javascript
for (let i = 0; i < messages.length; i++) {
  const isLastMessage = i === messages.length - 1;
  const senderChangesNext =
    !isLastMessage && messages[i].senderId !== messages[i + 1].senderId;
  messages[i].highlight = isLastMessage || senderChangesNext;
}
const lastReadByMessageIndex = {};

messages.forEach((message, index) => {
  message.readBy.forEach((userId) => {
    lastReadByMessageIndex[userId] = index;
  });
});
```

These two pieces of code are used to help implement some UI features to our messages. The goal of the first for statement is to check if the message is the last message in a chain sent by a user - this allows us to place the user’s avatar next to only the last message in their chain - we set a property to True if it is the last message in the conversation, or the last message sent by that user.

The next forEach is to try and identify the last message that a specific user has read in the chat - this allows us to put a mini image of their avatar under that message to inform other members of the conversation what message the other recipients are up to date with.

## Challenges

- Since this was our first group project an initial challenge was getting used to working on a repository with another collaborator - we used slack to communicate and had start + end of day catch ups to make sure we knew what the other was working on and to be aware of any potential conflicts this might cause
- Another challenge we faced was the lack of ‘real-time’ messaging - since the way we setup the app requires user interaction to search the Database for any updates - to fix this we researched how this was possible - here we learnt about Web Sockets and ended up implementing Socket.IO on our Front & Backend

## Wins

```javascript
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on("send_message", (data) => {
    console.log(data.chatId);
    socket.to(data.chatId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    socket.broadcast.emit("user_disconnected", { userId: socket.id });
  });
});
```

The implementation of Socket.IO was something we were really proud of - here we track when a user has opened and chat and listen out for when users send messages so we can emit a signal back to the Frontend of the other user to update their message list - this allows for updating of the messages live without the user having to interact or refresh the page.

## Key Learnings

- This was the first project I have made use of Tailwind CSS - it will definitely be something I make use of in future projects - it felt very easy to simply add the CSS styles I wanted to specific elements without having to worry about a very long CSS file with potential conflicts.
- Became a lot more confident working with Git - previously we had worked on a single branch, alone. For this project we created branches for new features, merging these to a development branch before deploying a master branch. Worked with pull requests and resolving merge conflicts.

## Future Improvements

- I would like to improve the look of the application on mobile - since it’s a messaging application it makes a lot of sense for it to be used on mobile so I think there’s potential for this to be improved.
- I’d also like to improve the functionality for starting a new chat - at the moment you just have to blindly enter another user’s name - I would prefer to have some form of contact system that allows you to have saved contacts you could easily add to or start chats with
