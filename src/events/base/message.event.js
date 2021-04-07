const { MessageEmbed } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
	name: 'message',
	run: async (msg) => {
		if (!msg.guild) return;
		if (msg.author.bot) return;

		if (!msg.guild.prefix) {
			const data = await r.table('guilds').get(msg.guild.id).run(conn);

			if (!data) {
				msg.guild.prefix = Hasfy.config.prefix;
				await r.table('guilds').insert({
					guildID: msg.guild.id,
					prefix: Hasfy.config.prefix
				}).run(conn);
			} else {
				msg.guild.prefix = data.prefix;
			}
		}

		if (msg.content.replace(/[<@!>]/g, '') === Hasfy.user.id) return msg.channel.send(
			new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
				.addField('\`Przydatne informacje\`', `> \`Prefix na serwerze: ${msg.guild.prefix}\`\n> \`Ping: ${Hasfy.ws.ping}ms\``)
				.addField('\`Pomoc?\`', `> \`Listę komend znajdziesz po wpisaniu ${msg.guild.prefix}pomoc\`\n> \`Link do serwera support znajdziesz po wpisaniu ${msg.guild.prefix}support\``)
				.setColor(Hasfy.config.main)
		);


		const msgPrefix = msg.content.startsWith(msg.guild.prefix) ? msg.guild.prefix : msg.content.startsWith(`<@!${Hasfy.user.id}>`) ? `<@!${Hasfy.user.id}>` : `<@${Hasfy.user.id}>`;

		if (!msg.content.startsWith(msgPrefix)) return;

		const args = msg.content.slice(msgPrefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();

		if (!cmd.length) return;

		const command = Hasfy.commands.find(c => c.name === cmd || c.aliases && c.aliases.includes(cmd));

		if (!command) return;

		if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;

		if (!msg.channel.permissionsFor(msg.guild.me).has(['EMBED_LINKS', 'ATTACH_FILES'])) return msg.channel.send(`> **\`BRAK PERMISJI\`**\n> **Aby bot działał poprawnie musi posiadać permisje ${require('../../permissions.json')['ATTACH_FILES']}, ${require('../../permissions.json')['EMBED_LINKS']}**`)


		if (msg.author.id === '392312614455214082') return msg.channel.send(
			new MessageEmbed()
				.setAuthor('Gratulacje!', msg.author.displayAvatarURL({ dynamic: true }))
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.setColor(Hasfy.config.main)
				.addField('\`Twój order:\`', `\`\`\`yaml\nBrawo dioxtarr otrzymałeś order fałszywego człowieka!!!!\`\`\``)
		)

		if (msg.author.id === '311155103480545281') return msg.channel.send(
			new MessageEmbed()
				.setAuthor('Gratulacje!', msg.author.displayAvatarURL({ dynamic: true }))
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.setColor(Hasfy.config.main)
				.addField('\`Twój order:\`', `\`\`\`yaml\nBrawo badi otrzymałeś order chama!!!!\`\`\``)
		)

		const gban = await r.table('gbans').get(msg.author.id).run(conn);

		if (gban) {
			const gbanErr = new MessageEmbed()
				.setAuthor('Global Ban!', msg.author.displayAvatarURL({ dynamic: true }))
				.setColor(Hasfy.config.error)
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.addField('**(** `💬` **) ・** __**Powód nadania blokady**__', `\`\`\`yaml\n${gban.reason}\`\`\``)
				.addField('**(** `📆` **) ・** __**Data nadania blokady**__', `\`\`\`yaml\n${dayjs(gban.timestamp).format('DD.MM.YYYY HH:mm')}\`\`\``)
				.addField('**(** `🔎` **) ・** __**Kto nadał blokadę**__', `\`\`\`yaml\n${gban.who}\`\`\``)
				.addField('**(** `❌` **) ・** __**Osoba, która otrzymała blokadę**__', `\`\`\`yaml\n${msg.author.tag} (${msg.author.id})\`\`\``)
			return msg.channel.send(gbanErr);
		}

		if (command.perm === 'dev' && !Hasfy.isOwner(msg.author.id)) return msg.channel.send(
			new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
				.addField('**(** <:no:829061072946200596> **) ・** __**Błąd!**__', `\`\`\`yaml\nNie posiadasz permisji ${require('../../permissions.json')[command.perm]}\`\`\``)
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.setColor(Hasfy.config.error)
		);

		if (command.perm && !Hasfy.isOwner(msg.author.id) && !msg.member.hasPermission(command.perm)) return msg.channel.send(
			new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
				.addField('**(** <:no:829061072946200596> **) ・** __**Błąd!**__', `\`\`\`yaml\nNie posiadasz permisji ${require('../../permissions.json')[command.perm]}\`\`\``)
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.setColor(Hasfy.config.error)
		);

		const data = {
			msg,
			cmd,
			args
		}

		const res = await command.run(data).catch(e => e);

		if (res instanceof Error) return console.log(res);

		if (res) {
			if (res.embeds) {
				res.embeds.forEach(embed => msg.channel.send(new MessageEmbed(embed)));
			}

			if (res.text) {
				if (!res.type) res.type = 'success';

				msg.channel.send(
					new MessageEmbed()
						.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
						.setColor(res.type === 'success' ? Hasfy.config.main : Hasfy.config.error)
						.addField(`${res.type === 'success' ? '**(** <:yes:829061074472009742> **) ・** __**Sukces!**__' : '**(** <:no:829061072946200596> **) ・** __**Błąd!**__'}`, `\`\`\`yaml\n${res.text}\`\`\``)
						.setThumbnail(Hasfy.user.displayAvatarURL())
				);
			}
		}
	}
}
