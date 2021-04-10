const { MessageEmbed, WebhookClient } = require('discord.js');
const { guilds } = require('../../../webhooks.json');
const dayjs = require('dayjs');

const webhook = new WebhookClient(guilds.id, guilds.token);

module.exports = {
	name: 'guildDelete',
	run: async (guild) => {
		let owner = await Hasfy.users.fetch(guild.ownerID).catch(e => e);
		if (owner instanceof Error) owner = null;

		const data = await r.table('guilds').get(guild.id).run(conn);

		const guildDeleteEmbed = new MessageEmbed()
			.setAuthor('Wyrzucono bota z serwera', Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.error)
			.setThumbnail(guild.iconURL({ dynamic: true }) || Hasfy.user.displayAvatarURL())
			.addField('**(** `🔐` **) ・** __**Serwer**__', `\`\`\`yaml\n${guild.name} (${guild.id})\`\`\``)
			.addField('**(** `🔐` **) ・** __**Właściciel**__', `\`\`\`yaml\n${owner ? `${owner.tag} (${guild.ownerID})` : 'Nie można określić'})\`\`\``)
			.addField('**(** `🔐` **) ・** __**Zaproszenie**__', `> ${data && data.inviteCode ? `[\`discord.gg/${data.inviteCode}\`](https://discord.gg/${data.inviteCode})` : '\`Nie można określić\`'}`)
			.addField('**(** `🔐` **) ・** __**Ilość osób**__', `\`\`\`yaml\n${guild.memberCount}\`\`\``)
			.addField('**(** `🔐` **) ・** __**Data utworzenia**__', `\`\`\`yaml\n${dayjs(guild.createdTimestamp).format('DD.MM.YYYY HH:mm:ss')}\`\`\``)
		webhook.send({
			avatarURL: Hasfy.user.displayAvatarURL(),
			embeds: [guildDeleteEmbed.toJSON()]
		});
	}
}