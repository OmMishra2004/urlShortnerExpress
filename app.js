import { shortnerRouter } from "./routes/shortner.routes.js"
import path from "path"

import express from "express"


const app = express()

app.use(express.static(path.join(import.meta.dirname, "public")))
app.use(shortnerRouter)

app.set("view engine","ejs")
app.set("views","./views")

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))