import { MakeSocketAction } from 'react-redux-socket/client';
import { LOCATION_CHANGE } from 'react-router-redux';

import { NEW_GAME, JOIN_GAME, JOINED_GAME } from '../../../common/Actions.js';

export default function Socket(state = {msgs: []}, action = {}) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case JOINED_GAME:
            console.log('JOINED_GAME', action.payload.gameID, action);
            newState.gameID = action.payload.gameID;
            return newState;
        default: return state;
    }
}

export function newGame() {
    return MakeSocketAction({
      type: NEW_GAME,
    })
}
