$('#confirm-moves').on('click', () => {
	const pgn = $('#pgnText').val();

	$('#trigger-moves-modal').addClass('hidden');
	$('#startPlayModal').modal('hide');

	startGame(pgn);
});

function startGame(pgn) {
	$('#playMove').removeClass('hidden');

	const tmpChess = new Chess();
	tmpChess.load_pgn(pgn);

	const config = {
		position: 'start',
		moveSpeed: 'slow',
		onMoveEnd,
	};

	const board = Chessboard('board', config);

	const moves = tmpChess.history();
	const tmpMoves = [];
	const chess = new Chess();

	$('#playMove').on('click', () => {
		const move = moves.shift();
		move && tmpMoves.unshift(move);

		if (!move) {
			alert(
				'All possible moves have been played (either the moves are over, or they were entered incorrectly).'
			);
			return;
		}

		$('#undoMove').removeClass('invisible');
		chess.move(move);
		const fen = chess.fen();
		changePosition(fen);
	});

	$('#undoMove').on('click', () => {
		if (!tmpMoves.length) {
			return;
		}

		const tmpMove = tmpMoves.shift();
		moves.unshift(tmpMove);
		chess.undo();
		const fen = chess.fen();
		changePosition(fen);
	});

	function changePosition(fen) {
		$('#playMove').prop('disabled', true);
		$('#undoMove').prop('disabled', true);

		console.log('Moves:', moves);
		console.log('Last move fen:', fen);

		board.position(fen);
	}

	function onMoveEnd() {
		$('#playMove').prop('disabled', false);
		$('#undoMove').prop('disabled', false);
		if (!tmpMoves.length) {
			$('#undoMove').addClass('invisible');
		}
	}
}
