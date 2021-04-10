const { MessageEmbed, WebhookClient } = require('discord.js');
const { guilds } = require('../../../webhooks.json');
const dayjs = require('dayjs');

const webhook = new WebhookClient(guilds.id, guilds.token);

module.exports = {
	name: 'guildCreate',
	run: async (guild) => {
		const randomChannel = guild.channels.cache.filter(chn => chn.type === 'text').random();

		let invite;

		if (!randomChannel.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE')) invite = null;
		else {
			invite = await randomChannel.createInvite({ maxAge: 0 }).catch(e => e);
			if (invite instanceof Error) invite = null;
		}

		let auditLog;

		if (guild.me.hasPermission('VIEW_AUDIT_LOG')) {
			auditLog = await guild.fetchAuditLogs({
				type: 'BOT_ADD',
				limit: 1
			}).catch(e => e);

			if (auditLog instanceof Error) auditLog = null;
		}

		const guildCreateEmbed = new MessageEmbed()
			.setAuthor('Dodano bota na nowy serwer', Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.main)
			.setThumbnail(guild.iconURL({ dynamic: true }) || Hasfy.user.displayAvatarURL())
			.addField('**(** `🔐` **) ・** __**Serwer**__', `\`\`\`yaml\n${guild.name} (${guild.id})\`\`\``)
			.addField('**(** `🔐` **) ・** __**Kto dodał**__', `\`\`\`yaml\n${auditLog ? `${auditLog.entries.first().executor.tag} (${auditLog.entries.first().executor.id})` : 'Nie można określić'}\`\`\``)
			.addField('**(** `🔐` **) ・** __**Zaproszenie**__', `> ${invite ? `[\`discord.gg/${invite.code}\`](https://discord.gg/${invite.code})` : '\`Nie można określić\`'}`)
			.addField('**(** `🔐` **) ・** __**Ilość osób**__', `\`\`\`yaml\n${guild.memberCount}\`\`\``)
			.addField('**(** `🔐` **) ・** __**Data utworzenia**__', `\`\`\`yaml\n${dayjs(guild.createdTimestamp).format('DD.MM.YYYY HH:mm:ss')}\`\`\``)
		webhook.send({
			avatarURL: Hasfy.user.displayAvatarURL(),
			embeds: [guildCreateEmbed.toJSON()]
		});
	}
}