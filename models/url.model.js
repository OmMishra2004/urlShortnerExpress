import path from "path"
import fs from "fs/promises"


const dataFilePath = path.join("data", "links.json")

export const loadLinks = async () => {
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

export const saveLinks = async (links) => {
    await fs.writeFile(dataFilePath, JSON.stringify(links), "utf-8")
    return 
}
