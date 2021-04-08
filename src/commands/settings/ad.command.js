const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ad',
	aliases: ['rek', 'reklama'],
	perm: 'MANAGE_GUILD',
	run: async ({ msg, args }) => {
		const verifyData = (await r.table('verify').getAll(msg.guild.id, { index: 'guildID' }).coerceTo('array').run(conn))[0];

		if (verifyData) return {
			type: 'error',
			text: 'Reklama jest w trakcie weryfikacji'
		}

		const check = await Hasfy.utils.check(msg.guild);

		if (!check) return {
			type: 'error',
			text: 'Najpierw ustaw kanał reklam'
		}

		if (!args[0]) return {
			type: 'error',
			text: 'Podaj treść reklamy'
		}

		const content = args.join(' ');

		if (content.length > 1000) return {
			type: 'error',
			text: 'Reklama może mieć max 1000 znaków'
		}

		if (args.length < 10) return {
			type: 'error',
			text: 'Reklama musi mieć minimalnie 10 słów'
		}

		const guildData = await r.table('guilds').get(msg.guild.id).run(conn);
		const channel = msg.guild.channels.cache.get(guildData.channelID);
		const adData = (await r.table('ads').getAll(msg.guild.id, { index: 'guildID' }).coerceTo('array').run(conn))[0];

		const verifyEmbed = new MessageEmbed()
			.setAuthor('Nowa reklama do weryfikacji', Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.main)
			.addField('**(** <a:discord:829680039754334268> **) ・** __**Serwer**__', `\`\`\`yaml\n${msg.guild.name} | ${msg.guild.id}\`\`\``)
			.addField('**(** <:user:829680298248896552> **) ・** __**Osoba**__', `\`\`\`yaml\n${msg.author.tag} | ${msg.author.id}\`\`\``)
			.addField('**(** <:link:829680767902416946> **) ・** __**Zaproszenie**__', `> [\`discord.gg/${guildData.inviteCode}\`](https://discord.gg/${guildData.inviteCode})`)
			.addField(`**(** ${msg.guild.me.nickname ? '<:yes:825785935706193950>' : '<:no:825785890289877032>'} **) ・** __**Pseudonim bota na serwerze**__`, `\`\`\`yaml\n${msg.guild.me.nickname || 'Brak'}\`\`\``)
			.addField('**(** <:channel:829681620638367784> **) ・** __**Kanał reklam**__', `\`\`\`yaml\n${channel.name} | ${channel.id}\`\`\``)
			.addField('**(** <a:resources:824293553030561802> **) ・** __**Serwer posiada reklame?**__', `\`\`\`yaml\n${adData ? `Serwer posiada reklame pod numerem ${adData.number}` : 'Serwer nie posiada reklamy'}\`\`\``)
			.addField('**(** 💬 **) ・** __**Treść**__', content)
			.setFooter(`System weryfikacji reklam ${Hasfy.user.username}`, 'https://cdn.discordapp.com/emojis/772153283300950087.gif?v=1')
		Hasfy.channels.cache.get(Hasfy.config.support.verifyChannel)?.send(verifyEmbed);

		return {
			text: 'Reklama została wysłana do weryfikacji'
		}
	}
}