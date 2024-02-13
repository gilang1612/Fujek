import { Client } from "./util/extend/Client.js";
import "dotenv/config";
import * as settings from "./util/settings.js";
export const client = new Client({
    authTimeout: 0,
    qrTimeout: 0,
    multiDevice: true,
    popup: true,
    licenseKey: settings.Lisences,
    useChrome: settings.useChrome || false,
}, {
    mongoUrl: settings.MongoURL,
});
export const uptime = new Date();
client.setSecret(process.env.Secret || "").start().then((clientInstance) => {
    clientInstance.onAnyMessage((msg) => {
        try {
            client.handleCommand(msg);
        }
        catch (error) {
            if (error instanceof Error) {
                client.logger(`Error founded on ${msg.body} ${error.message}`, "ERROR DETECTED");
            }
        }
    });
    clientInstance.onGlobalParticipantsChanged((async (message) => {
        await welcome(client, message);
        //left(client, heuh)
    }));
});
async function welcome(client, event) {
    try {
        if (!client.clientInstances)
            return console.log("returned");
        if (event.action == 'add') {
            const gChat = await client.clientInstances.getChatById(event.chat);
            const pChat = await client.clientInstances.getContact(event.who);
            const { contact, groupMetadata, name } = gChat;
            const pepe = await client.client.getProfilePicFromServer(event.who);
            await client.clientInstances.sendTextWithMentions(event.chat, `Halo, Selamat datang @${pChat.id.replace("@c.us", "")} as ${pChat?.name ? pChat?.shortName : pChat.pushname} ke dalam grup ${name}`);
        }
        if (event.action == 'remove') {
            //const { contact, groupMetadata, name } = gChat
            const gChat = await client.clientInstances.getChatById(event.chat);
            const pChat = await client.clientInstances.getContact(event.who);
            const pepe = await client.client.getProfilePicFromServer(event.who);
            const capt = `Sampai jumpa. *${pChat?.name ? pChat?.shortName : pChat.pushname}*👋 meninggalkan kita`;
            await client.clientInstances.sendText(event.chat, capt);
        }
    }
    catch (err) {
        console.log(err);
    }
}
