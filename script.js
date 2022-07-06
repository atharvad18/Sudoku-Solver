var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}


var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j]
			}
			else
				arr[i][j].innerText = ''
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle')
let SolvePuzzle = document.getElementById('SolvePuzzle')

GetPuzzle.onclick = function () {
	Row = Array(9).fill(0);
 	Col = Array(9).fill(0);
 	Box = Array(9).fill(0);
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response);
		board = response.board;
		FillBoard(board);
		console.log(board);
		intialization(board);


	}
	xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=random')
	xhrRequest.send()
}	

SolvePuzzle.onclick = () => {
	
	SudokuSolver(board, 0, 0, 9);
};

function getbox(i,j){
	return 3*Math.trunc(i/3) + Math.trunc(j/3);
}

function intialization (board){
	for(let i=0;i<9;i++){
		for(let j=0;j<9;j++){
			if(board[i][j]!=0){
				Row[i] |= (1<<board[i][j]);
				Col[j] |= (1<<board[i][j]);
				Box[getbox(i,j)] |= (1<<board[i][j]);
			}
		}
	}
}

//is safe function
function issafe(row,col,value){
	if(Row[row]&(1<<value)) return false;
	if(Col[col]&(1<<value)) return false;
	if(Box[getbox(row,col)]&(1<<value)) return false;
	return true;
}

//sudoku solver
function SudokuSolver(board, i, j, n) {
	if(i==n){
		FillBoard(board);
        return true;
    }
    if(j==n){
        return SudokuSolver(board,i+1,0,n);
    }
    if(board[i][j]==0){
        for(let val=1;val<=9;val++){
            if(issafe(i,j,val)){
                board[i][j] = val;
				Row[i] |= (1<<val);
				Col[j] |= (1<<val);
				Box[getbox(i,j)] |= (1<<val); 
                let ans = SudokuSolver(board,i,j+1,n);
                    if(ans) return true;
                    else {
						board[i][j] = 0;
						Row[i] &= ~(1 << val);
            			Col[j] &= ~(1 << val);
            			Box[getbox(i, j)] &= ~(1 << val);
					}
				}
        }
        return false;
    }
    else{
        SudokuSolver(board,i,j+1,n);
    }	
}
