module.exports = {
	name: 'ready',
	run: async () => {
		await Hasfy.utils.setUpAdsConfig();
		Hasfy.utils.queue();
	}
}