import {Client} from "./util/extend/Client.js";
import "dotenv/config";
import * as settings from "./util/settings.js";
import { ContactId } from "@open-wa/wa-automate";
import { GroupNotificationTypes, ParticipantChangedEventModel } from "@open-wa/wa-automate/dist/api/model/group-metadata.js";
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

client.setSecret(process.env.Secret as string || "").start().then((clientInstance)=>{
  
  clientInstance.onAnyMessage((msg)=>{
    try {
      client.handleCommand(msg);
    } catch (error) {
      if (error instanceof Error) {
        client.logger(`Error founded on ${msg.body} ${error.message}`, "ERROR DETECTED");
      }
    }
  });


  clientInstance.onGlobalParticipantsChanged((async (message) => {
    await welcome(client, message)
    //left(client, heuh)

  }))
});

async function welcome(client:Client, event:ParticipantChangedEventModel){
  try {
      if(!client.clientInstances) return console.log("returned")
      if (event.action == 'add') {

          const gChat = await client.clientInstances.getChatById((event.chat as ContactId))
          const pChat = await client.clientInstances.getContact((event.who as unknown as ContactId))
          const { contact, groupMetadata, name } = gChat
          const pepe = await client.client.getProfilePicFromServer((event.who as unknown as ContactId))

          await client.clientInstances.sendTextWithMentions(event.chat, `Halo, Selamat datang @${(pChat.id as unknown as string).replace("@c.us","")} as ${pChat?.name ? pChat?.shortName : pChat.pushname} ke dalam grup ${name}`)

      }

      if (event.action == 'remove') {

          //const { contact, groupMetadata, name } = gChat
          const gChat = await client.clientInstances.getChatById((event.chat as ContactId))
          const pChat = await client.clientInstances.getContact((event.who as unknown as ContactId))
          const pepe = await client.client.getProfilePicFromServer((event.who as unknown as ContactId))
          const capt = `Sampai jumpa. *${pChat?.name ? pChat?.shortName : pChat.pushname }*👋 meninggalkan kita`

          await client.clientInstances.sendText(event.chat, capt)

      }

  } catch (err) {
      console.log(err)
  }
}
