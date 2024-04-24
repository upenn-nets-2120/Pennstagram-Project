import 'express'
import 'express-session'

declare module 'express-session' {
	interface SessionData {
		username?: string | null
    }
}

declare module 'express' {
	interface Request {
		session: SessionData
	}
}
