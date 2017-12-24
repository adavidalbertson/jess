import actions from '../../../common/Actions.js';

export default function routerMiddleware(history) {
    return () => next => action => {
        switch (action.type) {
            case actions.JOINED_GAME:
                history.push(action.payload.gameID);
                break;
            case actions.GAME_DOES_NOT_EXIST:
            case actions.GAME_IS_FULL:
                history.replace('');
        }

        return next(action);
    }
}
