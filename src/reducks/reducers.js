
import initialState from './store/initialState';



export const BasketReducer = (state= initialState, action) => {
    switch (action.type){
        case 'ADD_TO_CART':
            {
                return addReducer(state,action);
            }
        case 'CANCEL':
            {
                return cancelReducer(state,action);
            }
        case 'REMOVE':
            {
                return removeReducer(state,action);
            }
        case 'RESET':
            {
                return initialState;
            }
        default:
            return state;
    }
}

export const AccountReducer = (state=initialState, action )=>{
    switch (action.type){
        case 'LOGIN':
            {
                return loginReducer(state,action);
            }
        default:
            return state;
    }
}

function loginReducer(state,action){
    return {
        ...action.payload
    };
}


function addReducer(state,action){
    return {
        basket:[...state.basket, action.payload]
    };
}

function cancelReducer(state,action){
    return {
        basket: state.basket.filter((list) => list.id !== action.payload.id)
    };
}

function removeReducer(state,action){
    return {
        basket: state.basket.filter((list)=> list.num != action.payload.num)
    };
}