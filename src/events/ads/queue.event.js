module.exports = {
	name: 'ready',
	run: async () => {
		await Hasfy.utils.setUpAdsConfig();
		setTimeout(async () => {
			await Hasfy.utils.queue();
		});
	}
}