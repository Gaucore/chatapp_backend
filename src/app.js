  import express from "express";
  import cors from "cors";

  import authRoutes from "./routes/authRoutes.js";
  import userRoutes from "./routes/userRoutes.js";
  import contactRoutes from "./routes/contactRoutes.js";
  import chatRoutes from "./routes/chatRoutes.js";
  import messageRoutes from "./routes/messageRoutes.js";
  import fileRoutes from "./routes/fileRoutes.js";
  import groupRoutes from "./routes/groupRoutes.js";
  import notificationRoutes from "./routes/notificationRoutes.js";
  import uploadRoutes from "./routes/uploadRoutes.js";
  import callRoutes from "./routes/callRoutes.js";

  import agoraRoutes from "./routes/agoraRoutes.js";



  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // =======================
  // AUTH ROUTES
  // =======================
  app.use("/api/auth", authRoutes);

  app.use("/agora", agoraRoutes);

  // =======================
  // USER ROUTES
  // =======================
  app.use("/api/users", userRoutes);

  // =======================
  // CONTACT ROUTES
  // =======================
  app.use("/api/contacts", contactRoutes);

  // =======================
  // CHAT ROUTES
  // =======================
  app.use("/api/chats", chatRoutes);

  // =======================
  // MESSAGE ROUTES
  // =======================
  app.use("/api/messages", messageRoutes);

  // =======================
  // FILE ROUTES
  // =======================
  app.use("/api/files", fileRoutes);

  // =======================
  // GROUP ROUTES
  // =======================
  app.use("/api/groups", groupRoutes);


  app.use("/api/notifications",notificationRoutes);

  app.use("/api/upload", uploadRoutes);

  app.use("/api/call", callRoutes);



  // =======================
  // HEALTH CHECK
  // =======================
  app.get("/", (req, res) => {
    res.send("Chat App API Running");
  });

  export default app;