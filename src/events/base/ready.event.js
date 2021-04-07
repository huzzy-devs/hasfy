module.exports = {
	name: 'ready',
	run: async () => {
		Hasfy.log.ready(`Logged in as ${Hasfy.user.tag}`);
	}
}