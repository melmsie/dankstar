const Discord = require("discord.js")
const client = new Discord.Client({
	disableEveryone: true
})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
});


function timeCon(time) {
	let days = Math.floor((time % 31536000) / 86400)
	let hours = Math.floor(((time % 31536000) % 86400) / 3600)
	let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60)
	let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60)
	days = days > 9 ? days : days
	hours = hours > 9 ? hours : hours
	minutes = minutes > 9 ? minutes : minutes
	seconds = seconds > 9 ? seconds : seconds
	return (parseInt(days) > 0 ? days + (days > 1 ? ' days ' : ' day ') : '') + (parseInt(hours) === 0 && parseInt(days) === 0 ? '' : hours + (hours > 1 ? ' hours ' : ' hour ')) + (parseInt(minutes) === 0 && parseInt(hours) === 0 && parseInt(days) === 0 ? '' : minutes + (minutes > 1 ? ' minutes ' : ' minute ')) + seconds + (seconds > 1 ? ' seconds ' : ' second ')
}

client.on('message', msg => {
	if (msg.author.id != '172571295077105664') return

	if (msg.content.includes('!eval')) {
		const args = msg.content.split(' ').slice(1)
		const script = args.join(' ')
		try {
			const dank = eval(script) // eslint-disable-line no-eval

			msg.channel.sendCode('js', dank)
		} catch (e) {
			msg.channel.sendMessage(':warning: **ERROR** :warning: ```\n' + e + '\n```')
		}
	}

	if (msg.content.includes('!radio')) {
		if (!msg.member.voiceChannel) {
			msg.react('❌').then(() => {
				msg.reply('join a voice channel fam')
			})
		} else {

			if (!client.voiceConnections.get(msg.guild.id)) {
				msg.react('🌟')
				msg.member.voiceChannel.join().then(conn => {
					conn.playFile('./star.mp3')
					conn.player.dispatcher.once('end', () => {
						conn.playFile('./star.mp3')
					})
				}).catch(e => {
					msg.reply('Couldn\'t join your voicechannel ¯\\_(ツ)_/¯')
					console.log(`${new Date()}: ${e.message}`)
				})

			} else {
				msg.react('❌')
			}
		}
	}

	if (msg.content.includes('!stop')) {
		if (client.voiceConnections.get(msg.guild.id)) {
			client.voiceConnections.get(msg.guild.id).channel.leave()
			msg.react('😢')
		}
	}

	if (msg.content.includes('!stats')) {
		msg.channel.send({
			embed: new Discord.RichEmbed()
				.setColor("#f7d524")
				.addField("Uptime", `${timeCon(process.uptime())}`, true)
				.addField("RAM Usage", `${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)} MB`, true)
				.addField("Websocket Ping", `${(client.ping).toFixed(0)} ms`, true)
		})
	}






})

client.on('messageReactionAdd', (messageReaction, user) => {
	if (messageReaction.emoji.name == '⭐') {
		client.channels.get(messageReaction.message.channel.id).fetchMessage(messageReaction.message.id).then(() => {
			if (messageReaction.count > 1) return
			else client.channels.get('327333249678442516').send({
				embed: new Discord.RichEmbed()
					.setAuthor(messageReaction.message.author.tag + ' ⭐', messageReaction.message.author.avatarURL)
					.setColor('#f7d524')
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

client.login('MzE4NzYyMzIzNTEyOTE4MDE2.DCzlpw.9j6QK96Hjg9btMqHBcUiDvGO4vQ')