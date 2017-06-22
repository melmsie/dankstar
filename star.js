const Discord = require("discord.js")
const client = new Discord.Client({
	disableEveryone: true
})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
});

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