const db        = require('./stardb.json')
const Discord   = require('discord.js')
const client    = new Discord.Client({ disableEveryone: true })
const settings  = { prefix: '!', 
					token: 'MzE4NzYyMzIzNTEyOTE4MDE2.DCzlpw.9j6QK96Hjg9btMqHBcUiDvGO4vQ', 
					embedColor: '#f7d524',
					starboardChannelID: '327333249678442516' }
let currentlyPlaying = Math.floor(Math.random() * Object.keys(db).length)
let boolPlaying

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {

	const cmd = msg.content.toLowerCase().substring(settings.prefix.length).split(' ')[0];

	if (!msg.content.toLowerCase().startsWith(settings.prefix)) return

	if (cmd === 'stats') {
		msg.channel.send({
			embed: new Discord.RichEmbed()
				.setColor(settings.embedColor)
				.addField('Uptime', timeCon(process.uptime()), true)
				.addField('RAM Usage', `${(process.memoryUsage().rss / 1048576).toFixed()}MB`, true)
				.addField('Websocket Ping', `${(client.ping).toFixed(0)} ms`, true)
		})
	}

	if (cmd === 'nowplaying' || cmd === 'np') {
		if (!boolPlaying)
			return msg.channel.send('placeholder message for the "not playing" error')
		msg.channel.send({
			embed: new Discord.RichEmbed()
				.setColor(settings.embedColor)
				.addField('Now Playing:', `[${db[currentlyPlaying].name}](${db[currentlyPlaying].link})`, true)
				.addField('Next in queue:', `[${db[(currentlyPlaying + 1) % 25].name}](${db[(currentlyPlaying + 1) % 25].link})`, true)
		})
	}

	if (cmd === 'save') {
		if (!boolPlaying)
			return msg.channel.send('placeholder message for the "not playing" error')
		msg.author.send({
			embed: new Discord.RichEmbed()
				.setColor(settings.embedColor)
				.addField('Now Playing:', `[${db[currentlyPlaying].name}](${db[currentlyPlaying].link})`, true)
		}).then(() => {
			msg.channel.send('👌')
		}).catch(() => {
			msg.channel.send('❌😩') // you should do the memey stuff :v
		})
	}

	if (!['284122164582416385', '172571295077105664'].includes(msg.author.id)) return

	if (cmd === 'eval') {
		const args = msg.content.split(' ').slice(1)
		const script = args.join(' ')
		try {
			let dank = eval(script)
			if (typeof dank !== 'string')
                dank = require('util').inspect(dank, { depth: 0 });
			msg.channel.send(dank, { code: 'js' })
		} catch (e) {
			msg.channel.send(':warning: **ERROR** :warning: ```\n' + e + '\n```')
		}
	}

	if (cmd === 'radio') {
		if (!msg.member.voiceChannel) {
			msg.react('❌').then(() => {
				msg.reply('join a voice channel fam')
			})
		} else if (!client.voiceConnections.get(msg.guild.id)) {
				msg.react('🌟')
				const conn = await msg.member.voiceChannel.join()
				boolPlaying = true
				play(conn)
		} else {
			msg.react('❌')
		}
	}

	if (cmd === 'stop') {
		if (client.voiceConnections.get(msg.guild.id)) {
			boolPlaying = false
			client.voiceConnections.get(msg.guild.id).channel.leave()
			msg.react('😢')
		}
	}
})

client.on('messageReactionAdd', (messageReaction, user) => {
	if (messageReaction.emoji.name === '⭐') {
		client.channels.get(messageReaction.message.channel.id).fetchMessage(messageReaction.message.id).then(() => {
			if (messageReaction.count > 1) return
			else client.channels.get(settings.starboardChannelID).send({
				embed: new Discord.RichEmbed()
					.setAuthor(messageReaction.message.author.tag + ' ⭐', messageReaction.message.author.avatarURL)
					.setColor(settings.embedColor)
					.setDescription(messageReaction.message.content)
					.setTimestamp(new Date(messageReaction.message.createdTimestamp))
					.setFooter('#' + messageReaction.message.channel.name)
			})
		})
	}
	/* else if (messageReaction.emoji.name == 'LUL') {
			client.channels.get(messageReaction.message.channel.id).fetchMessage(messageReaction.message.id).then(() => {
				if (messageReaction.count > 1) return
				else client.channels.get('327317783937417236').send({
					embed: new Discord.RichEmbed()
						.setAuthor(messageReaction.message.author.tag, 'https://cdn.discordapp.com/emojis/298887728161095681.png')
						.setColor('#656fff')
						.setDescription(messageReaction.message.content)
						.setTimestamp(new Date(messageReaction.message.createdTimestamp))
						.setFooter('#' + messageReaction.message.channel.name)
				})
			})
		} else if (messageReaction.emoji.name == 'waitwhat') {
			client.channels.get(messageReaction.message.channel.id).fetchMessage(messageReaction.message.id).then(() => {
				if (messageReaction.count > 1) return
				else if ()
				else client.channels.get('327317783937417236').send({
					embed: new Discord.RichEmbed()
						.setAuthor(messageReaction.message.author.tag, 'https://cdn.discordapp.com/emojis/327331687677820928.png')
						.setColor('#f75e35')
						.setDescription(messageReaction.message.content)
						.setTimestamp(new Date(messageReaction.message.createdTimestamp))
						.setFooter('#' + messageReaction.message.channel.name)
				})
			})
		}*/
})

function timeCon(time) {
    let days    = Math.floor(time % 31536000 / 86400)
    let hours   = Math.floor(time % 31536000 % 86400 / 3600)
    let minutes = Math.floor(time % 31536000 % 86400 % 3600 / 60)
    let seconds = Math.round(time % 31536000 % 86400 % 3600 % 60)
    days    = days    > 9 ? days    : '0' + days
    hours   = hours   > 9 ? hours   : '0' + hours
    minutes = minutes > 9 ? minutes : '0' + minutes
    seconds = seconds > 9 ? seconds : '0' + seconds
    return `${days > 0 ? `${days}:` : ''}${(hours || days) > 0 ? `${hours}:` : ''}${minutes}:${seconds}`
}

function play(conn) {
	if (currentlyPlaying >= 25)
		currentlyPlaying = 0;
	currentlyPlaying++;
	if (boolPlaying) {
		client.user.setGame(db[currentlyPlaying].name)
		conn.playFile(`./stars/${currentlyPlaying}.mp3`);
		conn.dispatcher.on('end', () => play(conn));
	}
}

client.login(settings.token)
