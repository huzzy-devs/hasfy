const { WebhookClient, MessageEmbed } = require('discord.js');

const webhook = new WebhookClient(process.env.DM_LOGS_WEBHOOK_ID, process.env.DM_LOGS_WEBHOOK_TOKEN);

module.exports = {
	name: 'message',
	run: async (msg) => {
		if (msg.guild) return;
		if (msg.author.bot) return;

		const embed = new MessageEmbed()
			.setAuthor('Ktoś napisał wiadomość do bota!')
			.setColor(Hasfy.config.main)
			.addField('**(** <:user:829680298248896552> **) ・** __**Osoba**__', `\`\`\`yaml\n${msg.author.tag} | ${msg.author.id}\`\`\``)
			.addField('**(** :speech_balloon: **) ・** __**Treść**__', `\`\`\`yaml\n${msg.content ? msg.content : msg.attachments.first() ? msg.attachments.first().proxyURL : 'Brak treści' }\`\`\``)
			.setTimestamp()
			.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
		webhook.send({
			avatarURL: Hasfy.user.displayAvatarURL(),
			embeds: [embed.toJSON()]
		});
	}
}