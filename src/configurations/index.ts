export const configuration = () => {
	return {
		port: process.env.PORT,
		db_port: process.env.DB_PORT,
		db_name: process.env.DB_NAME,
		db_user: process.env.DB_USER,
		db_password: process.env.DB_PASSWORD
	}
}