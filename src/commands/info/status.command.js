const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'status',
	run: async ({ msg }) => {
		const guildConfig = await r.table('guilds').get(msg.guild.id).run(conn);
		const adData = (await r.table('ads').getAll(msg.guild.id, { index: 'guildID' }).coerceTo('array').run(conn))[0];
		const verifyData = (await r.table('verify').getAll(msg.guild.id, { index: 'guildID' }).coerceTo('array').run(conn))[0];

		const channel = msg.guild.channels.cache.get(guildConfig.channelID);

		const embed = new MessageEmbed()
			.setAuthor(`Informacje o serwerze ${msg.guild.name}`, Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.main)
			.addField('**(** <:channel:829681620638367784> **) ・** __**Kanał reklam**__', `\`\`\`yaml\n${channel ? (Hasfy.utils.checkChannel(channel) ? `#${channel.name}` : `Kanał reklam nie jest widoczny dla każdego | #${channel.name}`) : 'Nie ustawiony' }\`\`\`` )
			.addField('**(** <a:info:828700286591828058> **) ・** __**Reklama**__', `\`\`\`yaml\n${adData ? `Status: Zweryfikowana\nWysłana: ${adData.sent}\nW cyklach: ${adData.queue}` : verifyData ? `W trakcie weryfikacji` : 'Nie ustawiona'}\`\`\``)
			.setFooter(`Polecenie wykonane dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))

		if (adData) embed.addField('**(** 💬 **) ・** __**Treść reklamy**__', adData.content)

		return { embeds: [embed.toJSON()] }
	}
}