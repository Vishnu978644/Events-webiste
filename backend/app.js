import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

// Routes
import typeroute from "./routes/typeRoutes.js";
import galleryroute from "./routes/galleryRoute.js";
import bgalleryroute from "./routes/bgalleryRoute.js";
import recentroute from "./routes/recentRoute.js";
import cogalleryroute from "./routes/cogalleryRoute.js";
import bridedressroute from "./routes/bridedressRoute.js";
import groomdressroute from "./routes/groomdressRoute.js";
import bridemakeuproute from "./routes/bridemakeupRoute.js";
import bridejewelroute from "./routes/bridejewelRoute.js";
import bridejewel1route from "./routes/bridejewel1Route.js";
import bridemakeup1router from "./routes/bridemakeup1Route.js";
import herorouter from "./routes/heroRoute.js";
import transrouter from "./routes/transportRoute.js";
import artistrouter from "./routes/artistRoute.js";
import decorrouter from "./routes/decorRoute.js";
import hallrouter from "./routes/hallRoute.js";
import servicerouter from "./routes/serviceRoute.js";
import destinirouter from "./routes/destiniRoute.js";
import paymentrouter from "./routes/paymentRoute.js";
import contactrouter from "./routes/contactRoute.js";
import clientrouter from "./routes/clientRoute.js";
import userrouter from "./routes/userRoute.js";

import { WED_URL } from "./config.js";

const app = express();

// ✅ Correct CORS for Local + Vercel
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://functions-git-main-vishnus-projects-78d92359.vercel.app",
        "https://functions-sand-seven.vercel.app"
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// ----------------------------
// 🚀 Handle favicon requests
// ----------------------------
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// ----------------------------
// Static files
// ----------------------------
app.use("/uploads", express.static(path.join("uploads")));

// ----------------------------
// Routes
// ----------------------------
app.use("/type", typeroute);
app.use("/gallery", galleryroute);
app.use("/bgallery", bgalleryroute);
app.use("/recent", recentroute);
app.use("/cogallery", cogalleryroute);
app.use("/bridedress", bridedressroute);
app.use("/bridemakeup", bridemakeuproute);
app.use("/groomdress", groomdressroute);
app.use("/bridejewel", bridejewelroute);
app.use("/groomjewel", bridejewel1route);
app.use("/groommakeup", bridemakeup1router);
app.use("/decoration", decorrouter);
app.use("/hall", hallrouter);
app.use("/hero", herorouter);
app.use("/transport", transrouter);
app.use("/artist", artistrouter);
app.use("/services", servicerouter);
app.use("/destini", destinirouter);
app.use("/payment", paymentrouter);
app.use("/contact", contactrouter);
app.use("/client", clientrouter);
app.use("/user", userrouter);

// ----------------------------
// 🚀 MongoDB Connection
// ----------------------------
mongoose.connect(WED_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err));

// ----------------------------
// ❌ DO NOT USE app.listen() on Vercel
// ----------------------------

// ----------------------------
// ✅ Export as Serverless Function
// ----------------------------
export default app;
