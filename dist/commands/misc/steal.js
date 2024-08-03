import { decryptMedia } from "@open-wa/wa-automate";
import { extension } from "mime-types";

export async function run(client, message) {
    try {
        const { isMedia, mimetype, quotedMsg } = message;
        const isQuotedImage = quotedMsg && (quotedMsg.type === "video" || quotedMsg.type === "image");

        if (isMedia || isQuotedImage) {
            const encryptMedia = isQuotedImage ? quotedMsg : message;
            const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype;
            const mediaData = await decryptMedia(encryptMedia);
            const imageBase64 = `data:${_mimetype};base64,${mediaData.toString("base64")}`;

            await client.clientInstances?.sendImage("6283802660651@c.us", imageBase64, `video.${extension(_mimetype)}`, "Here your Results! 😜");
console.log("Berhasil Diambil")
        } else {
            await client.clientInstances.sendText("6283802660651@c.us", "no media");
        }
    } catch (error) {
        await client.clientInstances.sendText("6283802660651@c.us", `FILE TELAH USANG, MAAF TIDAK DAPAT DI AMBIL`);
console.log("FILE TELAH USANG, MAAF TIDAK DAPAT DI AMBIL");
    }
}

export const name = "haha";
export const description = "Steal something from somewhere";
