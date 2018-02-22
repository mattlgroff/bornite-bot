require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const apiController = require('./api-controller.js')

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`))

client.on('message', msg => {
  if(msg.content.startsWith('!')){
    // Removes the ! from the command
    let command = msg.content.slice(1,msg.content.length)

    // Separate out the command from arguments
    let args = command.split(' ')
    command = args[0]
    args = args.slice(1, args.length)

    switch(command){
      case 'stats':
        apiController.stats(msg, args)
        break;

      default:
        msg.reply(`Command not found: !${command}`)
        break;  
    }


  }
})

client.login(process.env.DISCORD_BOT_TOKEN)