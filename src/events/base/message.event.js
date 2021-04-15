const { MessageEmbed, Team } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
	name: 'message',
	run: async (msg) => {
		if (!msg.guild) return;
		if (msg.author.bot) return;

		/*
		if (/(sparfy|versy|crusty|casualy|rapfy|alky|lsq|editbot|marketing|lambda|vave|axty|krasti|mocek|wawrzyniak)/g.test(msg.content.toLowerCase())) msg.react('🤮');
		if (/(freezy|lemd|invdsc)/g.test(msg.content.toLowerCase())) msg.react('❤');
		if (/(hasfy|kacperrrooo|hamisz|493119070032363541|692734175324799016)/g.test(msg.content.toLowerCase())) msg.react('👑'); 
		*/

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
                .setDescription(`> \`‣\` *Cześć! Jestem ${Hasfy.user.username}. Poniżej znajdziesz kilka informacji o mnie:*\n\n> \`‣\` *Uptime:*\n\`\`\`css\n[1] ‣ ${Hasfy.uptime} \n\`\`\`\n\n> \`‣\` *Prefix:*\n\`\`\`css\n[2] ‣ ${msg.guild.prefix}\n\`\`\`\n\n> \`‣\` *Właściciele:*\n\`\`\`css\n[3] ‣ "${Hasfy.application.owner instanceof Team ? Hasfy.application.owner.members.map(u => u.user.tag).join(' & ') : Hasfy.application.owner.tag}"\n\`\`\``)
                .setFooter(`Na polecenie: ${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({ dynamic: true }))
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
				.setAuthor("Oof\n!", "https://cdn.discordapp.com/emojis/826487512703827968.png?v=1")
				.setColor(bot.config.main)
				.setDescription("> *Oof, wygląda na to że dostałeś \`order bycia fałszywym\`!*\n> **Dla ludzi fałszywych mogę powiedzieć tylko kto nadał \`zasłużony order debilizmu\`**\n\n> *\`Administrator:\`*\n\`\`\`css\n[1] Automatyczny System Wykrywania Fałszywych Ludzi\n\`\`\`")
				.setFooter(`Na polecenie: ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		)

		if (msg.author.id === '311155103480545281') return msg.channel.send(
			new MessageEmbed()
				.setAuthor("Oof\n!", "https://cdn.discordapp.com/emojis/826487512703827968.png?v=1")
				.setColor(bot.config.main)
				.setDescription("> *Oof, wygląda na to że dostałeś \`order chamstwa\`!*\n> **Dla chamów mogę powiedzieć tylko kto nadał \`zasłużony order debilizmu\`**\n\n> *\`Administrator:\`*\n\`\`\`css\n[1] Automatyczny System Wykrywania Chamów\n\`\`\`")
				.setFooter(`Na polecenie: ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		)

		if (msg.author.id === "715825874393628685") {
			const orderDebilizmuLectrona = new MessageEmbed()
				.setAuthor("Oof\n!", "https://cdn.discordapp.com/emojis/826487512703827968.png?v=1")
				.setColor(bot.config.main)
				.setDescription("> *Oof, wygląda na to że dostałeś \`order debilizmu\`!*\n> **Dla debili mogę powiedzieć tylko kto nadał \`zasłużony order debilizmu\`**\n\n> *\`Administrator:\`*\n\`\`\`css\n[1] Automatyczny System Wykrywania Debili\n\`\`\`")
				.setFooter(`Na polecenie: ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
			return msg.channel.send(orderDebilizmuLectrona);
		}

		if (msg.author.id === "583672333055688725") {
			const orderDebilizmuIgorrrooo = new MessageEmbed()
				.setAuthor("Oof\n", "https://cdn.discordapp.com/emojis/826487512703827968.png?v=1")
				.setColor(bot.config.main)
				.setDescription("> *Oof, wygląda na to że dostałeś \`order debilizmu\`!*\n> **Dla debili mogę powiedzieć tylko kto nadał \`zasłużony order debilizmu\`**\n\n> *\`Administrator:\`*\n\`\`\`css\n[1] Automatyczny System Wykrywania Debili\n\`\`\`")
				.setFooter(`Na polecenie: ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
			return msg.channel.send(orderDebilizmuIgorrrooo);
		}


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
		
		/*
		if (Hasfy.utils.jebacVersy(msg.guild) && (command.name === 'ad' || command.name === 'channel')) {
			const syf = Hasfy.users.cache.get('785586120074199060') || await Hasfy.users.fetch('785586120074199060').catch(() => null);

			return msg.channel.send(
				new MessageEmbed()
					.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
					.addField('**(** <:no:829061072946200596> **) ・** __**Błąd!**__', `\`\`\`yaml\nPrzykro nam ale Hasfy nie będzie działać jeśli na serwerze jest ${syf ? syf.tag : 'Versy'}\`\`\``)
					.setThumbnail(Hasfy.user.displayAvatarURL())
					.setColor(Hasfy.config.error)
			);
		}
		*/

		if (command.perm === 'dev' && !Hasfy.utils.isOwner(msg.author.id)) return msg.channel.send(
			new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
				.addField('**(** <:no:829061072946200596> **) ・** __**Błąd!**__', `\`\`\`yaml\nNie posiadasz permisji ${require('../../../permissions.json')[command.perm]}\`\`\``)
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.setColor(Hasfy.config.error)
		);

		if (command.perm && !Hasfy.utils.isOwner(msg.author.id) && !msg.member.hasPermission(command.perm)) return msg.channel.send(
			new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
				.addField('**(** <:no:829061072946200596> **) ・** __**Błąd!**__', `\`\`\`yaml\nNie posiadasz permisji ${require('../../../permissions.json')[command.perm]}\`\`\``)
				.setThumbnail(Hasfy.user.displayAvatarURL())
				.setColor(Hasfy.config.error)
		);

		const data = {
			msg,
			cmd,
			args
		}

		const res = await command.run(data).catch(e => e);

		if (res instanceof Error) {
			Hasfy.utils.errorHandle({ error: res, msg, command });
			return msg.channel.send(
				new MessageEmbed()
					.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
					.addField('**(** <:no:829061072946200596> **) ・** __**Błąd!**__', `\`\`\`yaml\nPodczas wykonywania polecenia napotkałem błąd, który zgłosiłem do programistów\nJeśli będzie dalej występował skontaktuj się z support'em\`\`\``)
					.setThumbnail(Hasfy.user.displayAvatarURL())
					.setColor(Hasfy.config.error)
			)
		}

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
