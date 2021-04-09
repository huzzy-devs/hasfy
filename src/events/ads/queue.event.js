module.exports = {
	name: 'ready',
	run: async () => {
		await Hasfy.utils.setUpAdsConfig();
		await Hasfy.utils.queue();
	}
}