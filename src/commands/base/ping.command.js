module.exports = {
	name: 'ping',
	run: async () => {
		return {
			text: `Pong! 🏓 ${Hasfy.ws.ping}ms`
		}
	}
}