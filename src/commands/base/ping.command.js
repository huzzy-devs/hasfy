module.exports = {
	name: 'ping',
	run: async () => {
		return {
			text: `Pong! 🏓 ${Hasfy.wsa.ping}ms`
		}
	}
}