const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	async execute(interaction) {
		await interaction.reply('test');
	},
};