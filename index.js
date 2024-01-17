class kNN {
	constructor(k, data, labels) {
		this.k = k;
		this.data = data;
		this.labels = labels;
	}

	distance(a, b) {
		let sum = 0;
		for (let i = 0; i < a.length; i++) {
			sum += Math.pow(a[i] - b[i], 2);
		}
		return Math.sqrt(sum);
	}

	predict(point) {
		let distances = [];
		for (let i = 0; i < this.data.length; i++) {
			let dist = this.distance(point, this.data[i]);
			distances.push({dist: dist, label: this.labels[i]});
		}
		distances.sort((a, b) => a.dist - b.dist);
		let counts = {};
		for (let i = 0; i < this.k; i++) {
			let label = distances[i].label;
			if (counts[label] === undefined) {
				counts[label] = 0;
			}
			counts[label] += 1;
		}
		return this.majority(counts);
	}

	majority(counts) {
		let maxLabel = undefined;
		let maxCount = -1;
		for (let label in counts) {
			if (counts[label] > maxCount) {
		maxLabel = label;
				maxCount = counts[label];
			}
		}
		return maxLabel;
	}
}

let pairsData = [];
let labelsData = [];
function populateTable() {
	const table = document.getElementById('dataTable');

	while (table.rows.length > 1) {
		table.deleteRow(1);
	}
	for (let i = 0; i < pairsData.length; i++) {
        const pair = pairsData[i];
        const label = labelsData[i];

        const row = table.insertRow();
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3 = row.insertCell();

        cell1.textContent = pair[0];
        cell2.textContent = pair[1];
        cell3.textContent = label;
	}
}
String.prototype.toHex = function() {
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        hash = this.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}
function update_canvas(data,labels) {
	populateTable();
	const canvas = document.getElementById("viz");
	const ctx = canvas.getContext("2d");

	
	let mx = 0, my = 0, w = canvas.width , h = canvas.height;
	
	ctx.fillStyle = "#FFFFFF";

	ctx.fillRect(0,0,w,h);

	ctx.fillStyle = "#00000033";

	let lineNum = 32;

	for(let i = 0; i <= lineNum; i++){
		//ctx.fillStyle = Math.random().toString().toHex()
		if(i == lineNum){
			ctx.fillRect(i * w/32 - 2, 0, 2, h);
			ctx.fillRect(0, i * h/32 - 2, w, 2);
		}else{
			ctx.fillRect(i * w/32, 0, 2, h);
			ctx.fillRect(0, i * h/32, w, 2);
		}
	}

	
	for(let i = 0; i < data.length; i++){
		mx = Math.max(data[i][0], mx);
		my = Math.max(data[i][1], my);
	}

	for(let i = 0; i < data.length; i++){

		ctx.fillStyle =labels[i].toHex();
		console.log(ctx.fillStyle);
		let x = data[i][0] / mx * (w - 10);
		let y = data[i][1] / my * (h - 10);

		console.log(x,y);

		ctx.fillRect( x, y, 8,8);
	}
	
}
function readFile() {
	const fileInput = document.getElementById('fileInput');
	const file = fileInput.files[0];
	const reader = new FileReader();
	pairsData = []
	labelsData = []
	reader.onload = function(e) {		
		const contents = e.target.result;
		const pairs = [];
		const lines = contents.split('\n');

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line !== '') {
				const numbers = line.split(' ');
				const pair = [parseFloat(numbers[0]), parseFloat(numbers[1])];
				pairsData.push(pair);
				
				const label = numbers[2];
				labelsData.push(label);
			}
		}

		console.log(pairs); // Displaying the pairs in the console
		update_canvas(pairsData, labelsData);
	}

	reader.readAsText(file);
}

let to_predict = [0,0];
function getPoint() {
	const pointInput = document.getElementById('pointInput').value;
	const coordinates = pointInput.split(',');

	if (coordinates.length === 2) {
		to_predict = [parseFloat(coordinates[0]), parseFloat(coordinates[1])];
		// You can perform further operations with the point array here
	} else {
		console.log("Invalid input format. Please enter values in 'x,y' format.");
	}
}

function runClassifer(){
	getPoint();
	let knn = new kNN(3, pairsData, labelsData);
	let label = knn.predict(to_predict); // Outputs: 'a'
	pairsData.push(to_predict);
	labelsData.push(label);
	update_canvas(pairsData,labelsData);
}
//let knn = new kNN(3, [[1, 2], [2, 3], [3, 4], [4, 5]], ['a', 'a', 'b', 'b']);
//console.log(knn.predict([5, 5])); // Outputs: 'a'
