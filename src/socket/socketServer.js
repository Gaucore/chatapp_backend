
// // import { Server } from "socket.io";
// // import User from "../models/User.js";

// // const onlineUsers = new Map();

// // const socketServer = (server) => {
// //   const io = new Server(server, {
// //     cors: {
// //       origin: "*",
// //       methods: ["GET", "POST"],
// //     },
// //   });

// //   io.on("connection", (socket) => {
// //     console.log("User Connected:", socket.id);


// //     socket.on("user-online", async (userId) => {
// //       if (!userId) return;

// //       onlineUsers.set(userId.toString(), socket.id);

// //        io.emit("online-users", [...onlineUsers.keys()]);

// //       // 🔥 UPDATE DB ALSO (IMPORTANT)
// //       await User.findByIdAndUpdate(userId, {
// //         isOnline: true,
// //         lastSeen: null,
// //       });
// //     });

// //     /* =========================
// //        JOIN CHAT
// //     ==========================*/
// //     socket.on("join-chat", (chatId) => {
// //       socket.join(chatId);
// //     });

// //     /* =========================
// //        SEND MESSAGE
// //     ==========================*/
// //     socket.on("send-message", (message) => {
// //       if (!message?.chat) return;

// //       socket.to(message.chat).emit("receive-message", message);
// //     });

// //     socket.on("receive-message", (message) => {

// //         const exists = this.messages.some(
// //           (m) => m._id === message._id
// //         );

// //         if (!exists) {
// //           this.messages.push(message);
// //         }
// //       });

// //     /* =========================
// //        DISCONNECT
// //     ==========================*/
// //     socket.on("disconnect", async () => {
// //       for (const [userId, socketId] of onlineUsers.entries()) {
// //         if (socketId === socket.id) {
// //           onlineUsers.delete(userId);

// //             io.emit("online-users", [...onlineUsers.keys()]);
// //           // 🔥 UPDATE DB OFFLINE
// //           await User.findByIdAndUpdate(userId, {
// //             isOnline: false,
// //             lastSeen: new Date(),
// //           });

// //           break;
// //         }
// //       }

// //       console.log("User Disconnected:", socket.id);
// //     });
// //   });

// //   return io;
// // };

// // export default socketServer;


// import { Server } from "socket.io";
// import User from "../models/User.js";

// const onlineUsers = new Map();

// /**
//  * 🌍 Make it globally accessible
//  */
// global.onlineUsers = onlineUsers;

// const socketServer = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   /**
//    * 🌍 Make io globally accessible
//    */
//   global.io = io;

//   io.on("connection", (socket) => {
//     console.log("✅ User Connected:", socket.id);

//     /**
//      * =========================
//      * USER ONLINE
//      * =========================
//      */
//     socket.on("user-online", async (userId) => {
//       if (!userId) return;

//       onlineUsers.set(userId.toString(), socket.id);

//       // 🔥 send online users list to all
//       io.emit("online-users", [...onlineUsers.keys()]);

//       // update DB
//       await User.findByIdAndUpdate(userId, {
//         isOnline: true,
//         lastSeen: null,
//       });
//     });

//     /**
//      * =========================
//      * JOIN CHAT ROOM
//      * =========================
//      */
//     socket.on("join-chat", (chatId) => {
//       socket.join(chatId);
//     });


    

//     /**
//      * =========================
//      * SEND MESSAGE (REALTIME)
//      * =========================
//      */
//     socket.on("send-message", (message) => {
//       if (!message?.chat) return;

//       // send only to chat room users
//       socket.to(message.chat).emit("receive-message", message);
//     });


//   //   socket.on("delete-message", ({ chatId, messageId }) => {
//   //   socket.to(chatId).emit("message-deleted", { messageId });
//   // });

//     /**
//      * =========================
//      * NOTIFICATION EVENT (OPTIONAL MANUAL EMIT)
//      * =========================
//      */
//     socket.on("send-notification", ({ userId, data }) => {
//       const socketId = onlineUsers.get(userId?.toString());

//       if (socketId) {
//         io.to(socketId).emit("notification", data);
//       }
//     });

//     /**
//      * =========================
//      * DISCONNECT
//      * =========================
//      */
//     socket.on("disconnect", async () => {
//       for (const [userId, socketId] of onlineUsers.entries()) {
//         if (socketId === socket.id) {
//           onlineUsers.delete(userId);

//           io.emit("online-users", [...onlineUsers.keys()]);

//           await User.findByIdAndUpdate(userId, {
//             isOnline: false,
//             lastSeen: new Date(),
//           });

//           break;
//         }
//       }

//       console.log("❌ User Disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// export default socketServer;


import { Server } from "socket.io";
import User from "../models/User.js";

const onlineUsers = new Map();

global.onlineUsers = onlineUsers;

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    /* =========================
       USER ONLINE
    ========================= */
    socket.on("user-online", async (userId) => {
      if (!userId) return;
      
      onlineUsers.set(userId.toString(), socket.id);
      socket.join(userId.toString());

      io.emit("online-users", [...onlineUsers.keys()]);

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: null,
      });
    });

    /* =========================
       JOIN CHAT ROOM
    ========================= */
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
    });

    /* =========================
       MESSAGE SYSTEM
    ========================= */
    socket.on("send-message", (message) => {
      if (!message?.chat) return;

      socket.to(message.chat).emit("receive-message", message);
    });

    // socket.on("delete-message", ({ chatId, messageId }) => {
    //   if (!chatId || !messageId) return;

    //   socket.to(chatId).emit("message-deleted", { messageId });
    // });

    /* =========================
       CALL SYSTEM (WEBRTC)
    ========================= */

    // 📞 START CALL
    socket.on("call-user", ({ to, from, offer, callType }) => {
      const receiverSocket = onlineUsers.get(to);

      if (receiverSocket) {
        io.to(receiverSocket).emit("incoming-call", {
          from,
          offer,
          callType,
        });
      }
    });

    // 📞 ACCEPT CALL
    socket.on("call-accepted", ({ to, answer }) => {
      const receiverSocket = onlineUsers.get(to);

      if (receiverSocket) {
        io.to(receiverSocket).emit("call-accepted", {
          answer,
        });
      }
    });

    // 📡 ICE CANDIDATE
    socket.on("ice-candidate", ({ to, candidate }) => {
      const receiverSocket = onlineUsers.get(to);

      if (receiverSocket) {
        io.to(receiverSocket).emit("ice-candidate", {
          candidate,
        });
      }
    });

    // ❌ END CALL
   socket.on("call-ended", ({ to }) => {
      const receiverSocket = onlineUsers.get(to);

      // send to receiver
      if (receiverSocket) {
        io.to(receiverSocket).emit("call-ended");
      }

      // ✅ ALSO send back to sender (IMPORTANT FIX)
      io.to(socket.id).emit("call-ended");
    });


      socket.on("reject-call", ({ to }) => {
      const receiverSocket = onlineUsers.get(to);

      if (receiverSocket) {
        io.to(receiverSocket).emit("call-rejected");
      }

      // optional safety
      io.to(socket.id).emit("call-rejected");
    });

    /* =========================
       NOTIFICATIONS
    ========================= */
    socket.on("send-notification", ({ userId, data }) => {
      const receiverSocket = onlineUsers.get(userId?.toString());

      if (receiverSocket) {
        io.to(receiverSocket).emit("notification", data);
      }
    });

    /* =========================
       DISCONNECT
    ========================= */
    socket.on("disconnect", async () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          io.emit("online-users", [...onlineUsers.keys()]);

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          break;
        }
      }

      console.log("❌ User Disconnected:", socket.id);
    });
  });

  return io;
};

export default socketServer;