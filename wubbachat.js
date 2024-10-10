const {Client : DiscordClient, GatewayIntentBits, Message} = require('discord.js')
const {Client : WhatsAppClient, MessageMedia, LocalAuth} = require('whatsapp-web.js')

const qrcode = require('qrcode-terminal');

const client = new DiscordClient({
    intents: [GatewayIntentBits.DirectMessages,
         GatewayIntentBits.Guilds, 
         GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages]
});


const commandsList = `
\`\`\`markdown
# WubbaChat Commands

- **!pickle**: Get a random Pickle Rick response.
- **!wubba**: Hear a Wubba Lubba Dub Dub phrase.
- **!dimension**: Discover a random dimension name.
- **!science**: Learn a fun science fact.
- **!quote**: Receive a random quote from Rick.
\`\`\`
`;

const wassupclient = new WhatsAppClient({
    authStrategy : new LocalAuth()
});

wassupclient.on('qr',(qr) =>{
    qrcode.generate(qr, { small: true });});

wassupclient.on('ready',()=>{
    console.log('wassupClient is ready to use');
})

client.on('messageCreate', async(message) =>{
    if(message.content.startsWith('!sendmsg')){
        const args = message.content.split(' ');
        const number = args[1];
        const msg = args.slice(2).join(' ');

        if (!number || !msg) {
            return message.reply('Usage: !sendmsg <number> <message>');
          }
        
          //send message via whatsapp
          const chatId = `${number}@c.us`;
          wassupclient.sendMessage(chatId,msg).then(response => {
            message.reply(`Message sent to ${number} via WhatsApp!`);
          }).catch(err => {
            message.reply(`Error sending message: ${err}`);
          });
    }
    if (message.content.startsWith('!pickle')) {
        message.reply("I'm Pickle Rick!");
      } else if (message.content.startsWith('!wubba')) {
        message.reply("Wubba Lubba Dub Dub!");
      } else if (message.content.startsWith('!dimension')) {
        message.reply("Dimension C-137");
      } else if (message.content.startsWith('!science')) {
        message.reply("Did you know? Light travels faster than sound.");
      } else if (message.content.startsWith('!quote')) {
        message.reply("Get schwifty!");
      }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const channel = client.channels.cache.find(channel => channel.name === 'codingzz'); // Replace with your channel name
    if (channel) {
      channel.send(`Hello! I'm WubbaChat, your Rick-themed bot. Here are some commands you can use:\n${commandsList}`);
    }
  });

wassupclient.on('qr', (qr) => {
    console.log('Scan this QR code to log in to WhatsApp:', qr);
  });

wassupclient.on('ready',() =>{
    console.log('whatsapp  client is ready');

});
client.login('YOUR _BOT_TOKEN');

wassupclient.initialize();