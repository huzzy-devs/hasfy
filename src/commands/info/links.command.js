module.exports = {
	name: 'links',
	aliases: ['linki', 'link', 'support', 'hasfy'],
	run: async ({ msg }) => {
		return {
			embeds: [
				{
					author: {
						name: msg.author.tag,
						icon_url: msg.author.displayAvatarURL({ dynamic: true })
					},
					color: Hasfy.config.main,
					description: `[**(** <:dev:830403524428824587> **) ・** __**Dodaj bota**__](https://discord.com/api/oauth2/authorize?client_id=${Hasfy.user.id}&permissions=8&scope=bot)\n[**(** <a:guild:830403572751532082> **) ・** __**Serwer support**__](${Hasfy.config.support.invite})`
				}
			]
		}
	}
}