import fs from "fs/promises"
import crypto from "crypto"
import path from "path"
import express from "express"

const router = express.Router()

const dataFilePath = path.join("data", "links.json")

const loadLinks = async () => {
    try {
        const rawData = await fs.readFile(dataFilePath, "utf-8")
        return JSON.parse(rawData)
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(dataFilePath, JSON.stringify({}), "utf-8")
            return {}
        }
        throw error
    }
}

const saveLinks = async (links) => {
    await fs.writeFile(dataFilePath, JSON.stringify(links), "utf-8")
}

router.get("/", async(req, res) => {
    try {
        const links = await loadLinks()
        const htmlFile = await fs.readFile(path.join("views", "index.html"), "utf-8")
        const str = htmlFile.toString().replace("[Shortened URLs will be displayed here]", Object.entries(links).map(
            ([shortCode, url]) => {
                return `<li><a href="/${shortCode}" target="_blank">${req.get("host")}/${shortCode}</a> --> ${url}</li>`
            }
        ).join(""))
        return res.status(200).send(str)
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal server error")
    }
})

router.get("/report",(req,res)=>{
    const userData={
        name: "Om",
        age:22
    }
    res.render("report",{userData})
})

router.get("/:shortCode", async (req, res) => {
    try {
        const { shortCode } = req.params
        const links = await loadLinks()
        if (!links[shortCode]) return res.status(404).send("Not found")
        return res.redirect(links[shortCode])
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error")
    }
})



router.use(express.urlencoded({ extended: true }))
router.post("/", async (req, res) => {
    try {
        let links = await loadLinks()
        const { url, shortCode } = req.body
        if (!url) {
            return res.status(400).send("URL is required")
        }

        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        if (links[finalShortCode]) {
            return res.status(400).send("Short Code already exists, try another.");
        }

        links[finalShortCode] = url;
        await saveLinks(links)
        return res.status(302).redirect("/")
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal server error")
    }
})

router.use((req, res) => {
    res.status(404).send("Page not found.")
})

export const shortnerRouter = router