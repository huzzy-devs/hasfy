module.exports = {
	name: 'ready',
	run: async () => {
		Hasfy.log.ready(`Logged in as ${Hasfy.user.tag}`);
		await Hasfy.user.setActivity(`🔎 @${Hasfy.user.username} | V${require('../../../package.json').version}`);
		await Hasfy.user.setStatus('dnd');
	}
}