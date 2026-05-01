
const updateProfileRoute = require("./routes/userUpdateProfile");
const changePasswordRoute = require("./routes/userChangePassword");
const express = require("express");
const fetchCommentsByUser = require("./routes/commentRoute/fetchCommentsByUser");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')
const unflagComment = require('./routes/commentFlags/unflagCommentFlag')
const addCommentFlag = require('./routes/commentFlags/postCommentFlag')
const getAllCommentFlags = require('./routes/commentFlags/getCommentFlags')
const addWatchlistItem = require('./routes/watchlist/addWatchlist')
const fetchWatchlistItem = require('./routes/watchlist/fetchWatchlist')
const addCommentRoutes = require('./routes/commentRoute/addComment');
const allCommentsRoute = require('./routes/commentRoute/Comments');
const fetchCommentRoutes = require('./routes/commentRoute/fetchComment');
const fetchCommentById = require('./routes/commentRoute/fetchCommentByCommentId');
const updateBioRoute = require("./routes/userUpdateBio");
const removeFromWatchlist = require("./routes/watchlist/removeWatchlist");
const updateWatchlist = require("./routes/watchlist/updateWatchlist");
require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use("/comments", fetchCommentsByUser);
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)
app.use('/user', deleteUser)
app.use('/commentFlags', addCommentFlag)
app.use('/commentFlags', getAllCommentFlags)
app.use('/commentFlags', unflagComment)
app.use('/watchlist', addWatchlistItem)
app.use('/watchlist', fetchWatchlistItem)
app.use('/comments', addCommentRoutes);
app.use('/comments', fetchCommentById);
app.use('/comments', fetchCommentRoutes);
app.use('/comments-all', allCommentsRoute);
app.use('/user', updateBioRoute)
app.use("/user", updateProfileRoute);
app.use("/user", changePasswordRoute);
app.use("/watchlist", removeFromWatchlist);
app.use("/watchlist", updateWatchlist);
app.listen(SERVER_PORT, (req, res) => {
console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})