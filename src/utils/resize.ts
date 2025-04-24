export const resize = (file: string, w: number, h = '') =>
	`/i/rs:fit:${w}:${h}/plain/local:///${file}`;