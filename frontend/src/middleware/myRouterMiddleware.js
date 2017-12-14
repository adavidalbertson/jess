import { JOINED_GAME } from '../../../common/Actions.js';

export default function routerMiddleware(history) {
    return () => next => action => {
        if (action.type === JOINED_GAME) {
            history.push(action.payload.gameID);
        }

        return next(action);
    }
}
