module.exports = {
	name: 'gban',
	perm: 'dev',
	run: async ({ msg, args }) => {
		if (!args[0]) return {
			type: 'error',
			text: 'Oznacz osobę do gbana lub podaj jej ID'
		}

		args[0] = args[0].replace(/[<@!>]/g, '');

		const user = await Hasfy.users.fetch(args[0]).catch(e => e);

		if (user instanceof Error) return {
			type: 'error',
			text: 'Taka osoba nie istnieje'
		}

		const gbanData = await r.table('gbans').get(args[0]).run(conn);

		if (gbanData) {
			await r.table('gbans').get(args[0]).delete().run(conn);

			return {
				text: `Zdjęto gbana dla ${user.tag}`
			} 
		} else {
			await r.table('gbans').insert({
				userID: args[0],
				reason: args[1] ? args.slice(1).join(' ') : 'Nie podano',
				timestamp: Date.now(),
				who: `${msg.author.tag} | ${msg.author.id}`
			}).run(conn);

			return {
				text: `Nadano gbana dla ${user.tag}`
			}
		}
 	}
}