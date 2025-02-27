import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    videoId: String,
    thumbnail: String,
    description: String,
    category: String // Example: "Web Development"
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
