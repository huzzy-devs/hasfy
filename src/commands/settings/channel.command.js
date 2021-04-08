const ytdl = require('ytdl-core');
const permissions = require('../../../permissions.json');

module.exports = {
	name: 'channel',
	aliases: ['kanal', 'kanał'],
	perm: 'MANAGE_GUILD',
	run: async ({ msg, args }) => {
		if (!args[0]) return {
			type: 'error',
			text: 'Oznacz kanał reklam lub podaj jego ID'
		}

		args[0] = args[0].replace(/[<#>]/g, '');

		const channel = msg.guild.channels.cache.get(args[0]);

		if (!channel) return {
			type: 'error',
			text: 'Na tym serwerze nie ma takiego kanału'
		}

		if (channel.type !== 'text') {
			if (channel.type === 'voice') {
				const time = 215000;

				const connection = await channel.join().catch(e => e);

				if (connection instanceof Error);
				else {
					connection.play(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).on('error', () => channel.leave());

					setTimeout(() => {
						channel.leave();
					}, time);

					return {
						text: `Ustawiono kanał reklam na #${channel.name}`
					}
				}
			} else return {
				type: 'error',
				text: 'Podany kanał nie jest tekstowy'
			}
		}

		if (!Hasfy.utils.checkChannel(channel)) return {
			type: 'error',
			text: 'Kanał reklam nie jest widoczny dla wszystkich'
		}

		if (channel.nsfw) return {
			type: 'error',
			text: 'Kanał jest nsfw'
		}

		if (!channel.permissionsFor(msg.guild.me).has(['SEND_MESSAGES', 'ATTACH_FILES', 'CREATE_INSTANT_INVITE', 'EMBED_LINKS'])) return {
			type: 'error',
			text: `Bot nie posiada odpowiednich permisji\n${permissions['SEND_MESSAGES']}, ${permissions['ATTACH_FILES']}, ${permissions['CREATE_INSTANT_INVITE']}, ${permissions['EMBED_LINKS']}`
		}

		const invite = await channel.createInvite({ maxAge: 0 }).catch(e => e);

		if (invite instanceof Error) return {
			type: 'error',
			text: 'Nie udało się utworzyć zaproszenia'
		}

		await r.table('guilds').get(msg.guild.id).update({
			channelID: channel.id,
			inviteCode: invite.code
		}).run(conn);

		return {
			text: `Kanał reklam został ustawiony na #${channel.name}`
		}
	}
}