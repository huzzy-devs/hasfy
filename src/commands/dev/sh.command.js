const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	name: 'shell',
	aliases: ['sh', 'cmd'],
	perm: 'dev',
	run: async ({ args }) => {

		const cmd = args.join(' ');
		if (cmd === '') return {
			type: 'error',
			text: 'Musisz podać komendę do wykonania'
		}
		const embed = new MessageEmbed()
			.setAuthor('Shell', Hasfy.user.displayAvatarURL())
			.setColor(Hasfy.config.main);

		return await new Promise(resolve => {
			exec(cmd, async (error, data, getter) => {
				if (error) {
					if (error.length > 1012) error = error.substring(0, 1012) + '...';
					embed.setDescription(`\`\`\`\n${error.message}\`\`\``).setColor(Hasfy.config.error);
					resolve({ embeds: [embed.toJSON()] })
				}
				if (getter) {
					if (data.length > 1012) data = data.substring(0, 1012) + '...';
					embed.setDescription(`\`\`\`\n${data}\`\`\``);
					resolve({ embeds: [embed.toJSON()] })
				}
				if (data) {
					if (data.length > 1012) data = data.substring(0, 1012) + '...';
					embed.setDescription(`\`\`\`\n${data}\`\`\``);
					resolve({ embeds: [embed.toJSON()] })
				}
			});
		});
	},
};
