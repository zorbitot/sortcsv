const fs = require('fs');
const process = require('process');
const args = process.argv;
const sourceFile = args[2];
let targetFile;
let sortOrder;
if (!isNaN(args[3])) {
	targetFile = sourceFile;
	sortOrder = args.splice(3);
} else {
	targetFile = args[3];
	sortOrder = args.splice(4);
}
let fileContent = [];
let newContent = [];
let fileStr = fs.readFileSync(sourceFile, 'utf8');

sortOrder = sortOrder.map(Number); //converts sortOrder to an array
fileContent = fileStr.split('\n');

for (var i = 0; i < fileContent.length; i++) {
	fileContent[i] = fileContent[i].split(',');
}

newContent = fileContent.filter(n => n.join() != ""); //filters newContent of blank elements

//adds missing columns to sortOrder array
let columnCount = newContent[1].length;
for (let i = 1; i <= columnCount; i++) {
	if (!sortOrder.includes(i) && !sortOrder.includes(0 - i)) {
		sortOrder.push(i);
	}
}

newContent.sort(sortArr);

console.table(newContent);

for (var i = 0; i < newContent .length; i++) {
	newContent[i] = newContent[i].join(',');
}
newContent = newContent.join('\n');
rewriteFile(targetFile, newContent);

function sortArr(a, b) {
	let compare = 0;
	for (let i = 0; i < sortOrder.length; i++) {
		const col = Math.abs(sortOrder[i]) - 1;
		let aa = a[col];
		let bb = b[col];
		if (!isNaN(aa) && !isNan(bb)) {
			//sorts numbers
			compare = aa/1 - bb/1;
		} else if (!isNaN(Date.parse(aa)) && !isNan(Date.parse(bb))) {
			//sorts dates
			compare = Date.parse(aa) - Date.parse(bb);
		} else {
			//sorts words
			compare = aa.localeCompare(bb);
		}
		//reverses sort order if needed
		//breaks from loop if aa & bb are not the same
		if (compare != 0) {
			if (sortOrder[i] < 0) {
				compare = -compare;	
			}
			break;
		}
	}
	return compare;
}

//rewrites target file with new data
function rewriteFile(target, data) {
	fs.writeFile(target, data, 'utf8', (error) => {
		if (error) {
			console.error(error);
			return;
		}
	});
}


