module.exports = {
	name: 'stats',
	perm: 'dev',
	run: async ({ msg }) => {
		let total = 0;

		Hasfy.guilds.cache.forEach(guild => total += guild.memberCount);

		return {
			embeds: [
				{
					author: {
						name: msg.author.tag,
						icon_url: msg.author.displayAvatarURL({ dynamic: true })
					},
					color: Hasfy.config.main,
					description: `\`\`\`yaml\nSerwery: ${Hasfy.guilds.cache.size}\nUżytkownicy: (${total} wszyscy | ${Hasfy.users.cache.size} cache)\nUptime: ${Hasfy.uptime}\`\`\``
				}
			]
		}
	}
}