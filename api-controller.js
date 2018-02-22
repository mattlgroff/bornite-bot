const request = require('request')

module.exports = {
  // Find Stats off of the args sent
  stats: function(msg, args){
    const platform = args[0]
    const username = args.slice(1,args.length).join('%20')

    if(platform !== 'psn' && platform !== 'pc' && platform !== 'xbl' || platform === undefined){
      msg.reply(`
      The platform was not set correctly.
      Please type in commands like so:
      !stats pc BillyGates
      !stats xbl MajorNelson
      !stats psn KazHarai
      `)
      return null;
    }
    else if(username === undefined){
      msg.reply(`
      The username was not set.
      Please type in commands like so:
      !stats platform username
      !stats pc BillyGates
      `)
      return null;
    }

    const options = {
      'uri': `https://api.fortnitetracker.com/v1/profile/${platform}/${username}`,
      'headers': {
        'TRN-Api-Key': process.env.FORNITE_TRACKER_KEY,
        'Content-Type': 'application/json'
      }
    }

    request(options, (err, res, body) => {
      if(err){
        console.error(err)
        msg.reply(`There was a problem getting stats for ${username.replace('%20', ' ')} on ${platform}.`)
        return null
      }
      else if(res.statusCode === 200){
        data = JSON.parse(body)
        let soloWins = 0
        let soloTime = '0h 0m'
        let duoWins = 0
        let duoTime = '0h 0m'
        let squadWins = 0
        let squadTime = '0h 0m'

        // Player Not Found
        if(data.error){
          msg.reply(`${data.error}`)
          return null
        }

        // Solo
        if(data.stats.p2){
          soloWins = data.stats.p2.top1.displayValue
          soloTime = data.stats.p2.minutesPlayed.displayValue
        }

        // Duos
        if(data.stats.p10){
          duoWins = data.stats.p10.top1.displayValue
          duoTime = data.stats.p10.minutesPlayed.displayValue
        }
        
        // Squad Wins
        if(data.stats.p9){
          squadWins = data.stats.p9.top1.displayValue
          squadTime = data.stats.p9.minutesPlayed.displayValue
        }

        // The most important line of code.
        const user = username.replace(/b/ig, '🅱').replace('%20', ' ')

        msg.reply(`
        Stats for ${user} on ${platform}:
        Gametype | # of Wins | Time Played
        Solo | ${soloWins} | ${soloTime}
        Duo | ${duoWins} | ${duoTime}
        Squad | ${squadWins} | ${squadTime}

        Source: FORTNITE TRACKER - https://fortnitetracker.com/
        `)
      } 
      else {
        msg.reply(`Something went wrong. Sorry :b:ud.`)
        return null
      }
    })
  }
}