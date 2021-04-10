const { MessageEmbed } = require("discord.js")

module.exports = {
	name: 'help',
	aliases: ['pomoc', 'h', 'p'],
	run: async ({ msg }) => {
		const firstEmbed = new MessageEmbed()
			.setAuthor('Ładowanie proszę czekać', 'https://cdn.discordapp.com/emojis/824293553030561802.gif?v=1')
			.setColor(Hasfy.config.main)

		const message = await msg.channel.send(firstEmbed);

		await message.react('a:info:828700286591828058');
		await message.react('a:settings:828700350860886048');
		await message.react('a:vershit:830208870257393684');

		const filter = (reaction, user) => {
			if (user.id !== msg.author.id) {
				reaction.users.remove(user.id);
				return false;
			} else {
				return true;
			}
		}

		firstEmbed
			.setDescription([
				`**(** <a:info:828700286591828058> **) ・** __**Komendy informacyjne**__`,
				`**(** <a:settings:828700350860886048> **) ・** __**Komendy ustawień**__`,
				`**(** <a:vershit:830208870257393684> **) ・** __**Komendy developerskie**__`
			].join('\n'))
			.setAuthor(`Menu pomocy ${Hasfy.user.username}`, Hasfy.user.displayAvatarURL())
			.setFooter(`Polecenie wykonane na życzenie ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		await message.edit(firstEmbed);

		const collector = message.createReactionCollector(filter, { time: 40000 });

		collector.on('collect', async (reaction, user) => {
			reaction.users.remove(user.id);
			let edit = false;
			switch (reaction._emoji.id) {
				case '828700286591828058': {
					firstEmbed.setDescription([
						`**(** <a:info:828700286591828058> **) ・** __**${msg.guild.prefix}pomoc - Pokazuje wszystkie komendy bota**__`,
						`**(** <a:info:828700286591828058> **) ・** __**${msg.guild.prefix}status - Pokazuje status konfiguracji serwera**__`,
						`**(** <a:info:828700286591828058> **) ・** __**${msg.guild.prefix}linki - Wszystkie przydatne linki dotyczące bota**__`,
						`**(** <a:info:828700286591828058> **) ・** __**${msg.guild.prefix}ping - Ping bota z WS Discorda**__`
					].join('\n'));
					edit = true;
					break;
				}

				case '828700350860886048': {
					const text = [
						`**(** <a:settings:828700350860886048> **) ・** __**${msg.guild.prefix}kanał - Ustawia kanał reklam serwera**__`,
						`**(** <a:settings:828700350860886048> **) ・** __**${msg.guild.prefix}reklama - Ustawia reklame serwera**__`,
						`**(** <a:settings:828700350860886048> **) ・** __**${msg.guild.prefix}prefix - Ustawia prefix bota na serwerze**__`
					];

					const data = await r.table('guilds').get(msg.guild.id).run(conn);

					if (data.premium) text.push(`**(** <a:settings:828700350860886048> **) ・** __**${msg.guild.prefix}kolor - Ustawia kolor embeda w kolejce premium**__`);

					firstEmbed.setDescription(text.join('\n'));

					edit = true;
					break;
				}

				case '830208870257393684': {
					if (!Hasfy.utils.isOwner(msg.author.id)) return;
					firstEmbed.setDescription([
						`**(** <a:vershit:830208870257393684> **) ・** __**${msg.guild.prefix}eval - Wykonuje podany kod JS**__`,
						`**(** <a:vershit:830208870257393684> **) ・** __**${msg.guild.prefix}shell - Wykonuje podaną komendę w konsoli**__`,
						`**(** <a:vershit:830208870257393684> **) ・** __**${msg.guild.prefix}gban - Nadaje lub zdejmuję gbana na dana osobę**__`,
						`**(** <a:vershit:830208870257393684> **) ・** __**${msg.guild.prefix}stats - Statystyki bota**__`
					].join('\n'));

					edit = true;
					break;
				}
			}

			if (edit) message.edit(firstEmbed);
		});

		collector.on('end', async () => {
			await message.reactions.removeAll().catch(e => e);

			firstEmbed.setFooter(`Polecenie wykonane na życzenie ${msg.author.tag} | Czas na dodanie reakcji minął`, msg.author.displayAvatarURL({ dynamic: true }));

			message.edit(firstEmbed);
		});
	}
}