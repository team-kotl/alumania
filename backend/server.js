const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: '*',
};
const eventRouter = require("./routes/events");
const userRouter = require("./routes/users");
const experienceRouter = require("./routes/experience");
const jobRouter = require("./routes/jobpost");

// Cariel Joyce Maga
// eventRouter
app.use("/events", eventRouter)
app.use("/interestedinevents", eventRouter)

// experienceRouter
app.use("/experience", experienceRouter)
app.use("/album", experienceRouter)
app.use("/albumexperience", experienceRouter)
app.use("/comment", experienceRouter)
app.use("/experienceimage", experienceRouter)
app.use("/experiencelike", experienceRouter)
app.use("/removexperience", experienceRouter)

// userRouter
app.use("/users", userRouter)
app.use("/alumni", userRouter)
app.use("/applicants", userRouter)

// jobRouter
app.use("/jobpost", jobRouter)
app.use("/interestedinjobpost", jobRouter)

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "orange", "kiwi"] });
});

app.listen(2012, () => {
    console.log("Server started on http://localhost:2012");
});