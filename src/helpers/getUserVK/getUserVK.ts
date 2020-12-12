export default function getUserVK(bot: any) {
	return async function (id: number) {
		return await bot.execute('users.get', {
			user_ids: id,
			fields: 'sex',
		})
	}
}
