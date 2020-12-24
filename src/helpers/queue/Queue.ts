export default class Queue {
	ms: number
	queue: any[]
	constructor(ms: number) {
		this.ms = ms
		this.queue = []
		setInterval(() => {
			const fnc = this.queue.shift()
			if (fnc) fnc()
		}, ms)
	}

	addToQueue(fnc: any) {
		this.queue.push(fnc)
	}
}
