import { loadLinks,saveLinks } from "../models/url.model.js"
import crypto from "crypto"

export const renderHomePage=async(req, res) => {
    try {
        const links = await loadLinks()
        return res.render("index",{links,host:req.get("host")})
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal server error")
    }
}

export const renderReportPage=(req,res)=>{ 
    const userData={
        name: "Om",
        age:22
    }
    res.render("report",{userData})
}

export const redirectToOriginalUrl=async (req, res) => {
    try {
        const { shortCode } = req.params
        const links = await loadLinks()
        if (!links[shortCode]) return res.status(404).send("Not found")
        return res.redirect(links[shortCode])
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error")
    }
}

export const createNewShortLink=async (req, res) => {
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
}