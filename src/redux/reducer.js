const defaultState = {
  heads: [],
  bodies: [],
  feet: [],
}

export default function(state=defaultState, action) {
  console.log(action)
  switch(action.type){
    case "ADD_HEADS":
      return {...state, heads: action.payload}
    case "ADD_BODIES":
      return {...state, bodies: action.payload}
    case "ADD_FEET":
      return {...state, feet: action.payload}
    default:
      return state
  }
}