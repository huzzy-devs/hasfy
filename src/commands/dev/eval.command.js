/* eslint-disable no-eval */
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'eval',
	aliases: ['js', 'dżawaskript', 'jebać_pseudoli', 'jestem_pseudolem_kappa', 'e'],
	perm: 'dev',
	run: async ({ msg, args }) => {

		let toEval = args.join(' ');

		try {
			let evaled = await eval(toEval);

			if (typeof evaled !== 'undefined' && evaled.toString().includes(Hasfy.token)) {
				const embed = new MessageEmbed()
					.setAuthor('Wykonano pomyślnie!', Hasfy.user.displayAvatarURL())
					.addField('Kod', '```js\n' + (toEval || 'null') + '\n```')
					.addField('Wynik', '```wypierdalaj```')
					.addField('Typ', '```token bota```')
					.setColor(Hasfy.config.main);
				return { embeds: [embed.toJSON()] }
			}

			const type = typeof evaled;
			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
			if (toEval.length > 1012) toEval = toEval.substring(0, 1012) + '...';
			if (evaled.length > 1012) evaled = evaled.substring(0, 1012) + '...';

			const embed = new MessageEmbed()
				.setAuthor('Wykonano pomyślnie!', Hasfy.user.displayAvatarURL())
				.addField('Kod', '```js\n' + (toEval || 'null') + '\n```')
				.addField('Wynik', '```js\n' + (evaled) + '```')
				.addField('Typ', '```js\n' + (type) + '```')
				.setColor(Hasfy.config.main);
			return { embeds: [embed.toJSON()] }
		} catch (error) {
			const errorEmbed = new MessageEmbed()
				.setAuthor('Wystąpił błąd!', Hasfy.user.displayAvatarURL())
				.setDescription('Błąd' + ':\n```js\n' + (error) + '```')
				.setColor(Hasfy.config.error);
			return { embeds: [errorEmbed.toJSON()] }
		}
	},
};
