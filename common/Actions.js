const NEW_GAME = 'Socket/NEW_GAME';
const JOIN_GAME = 'Socket/JOIN_GAME';
const JOINED_GAME = 'Socket/JOINED_GAME';
const OPPONENT_JOINED = 'Socket/OPPONENT_JOINED';
const GAME_DOES_NOT_EXIST = 'Socket/GAME_DOES_NOT_EXIST';
const GAME_IS_FULL = 'Socket/GAME_IS_FULL';

const SUBMIT_MOVE = 'GameState/SUBMIT_MOVE';
const MOVE_APPROVED = 'GameState/MOVE_APPROVED';
const MOVE_REJECTED = 'GameState/MOVE_REJECTED';

module.exports = {
    NEW_GAME,
    JOIN_GAME,
    JOINED_GAME,
    OPPONENT_JOINED,
    GAME_DOES_NOT_EXIST,
    GAME_IS_FULL,
    SUBMIT_MOVE,
    MOVE_APPROVED,
    MOVE_REJECTED
}
