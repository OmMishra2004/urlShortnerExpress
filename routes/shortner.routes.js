import express from "express";
import { renderHomePage,renderReportPage,redirectToOriginalUrl,createNewShortLink } from "../controllers/shortner.controller.js"

const router = express.Router()

router.get("/", renderHomePage)

router.get("/report",renderReportPage)

router.get("/:shortCode", redirectToOriginalUrl)



router.use(express.urlencoded({ extended: true }))
router.post("/", createNewShortLink)

router.use((req, res) => {
    res.status(404).send("Page not found.")
})

export const shortnerRouter = router