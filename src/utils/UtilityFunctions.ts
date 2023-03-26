export function sortArrayByKey(array: any[], key: string): Array<any> {
	let arrayCopy = [...array]
	arrayCopy.sort((a, b) => {
		if (a[key] === null || a[key] === undefined) {
			console.log(a[key], b[key], a[key] === null || a[key] === undefined, 'A NULL')
			return 1
		} else if (b[key] === null || b[key] === undefined) {
			console.log(a[key], b[key], b[key] === null || b[key] === undefined, 'B NULL')
			return 1 
		} else if (a[key] < b[key]) {
			console.log(a[key], b[key], a[key] < b[key])
			return -1
		} else if (a[key] > b[key]) {
			console.log(a[key], b[key], a[key] > b[key])
			return 1
		} 
		return 0
	})
	return arrayCopy
}