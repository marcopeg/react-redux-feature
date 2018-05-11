
import { combineReducers } from 'redux'

export class ReducerRegistry {
    constructor () {
        this._emitChange = null
        this._reducers = {}
    }

    getReducers () {
        return { ...this._reducers }
    }

    register (name, reducer) {
        this._reducers = { ...this._reducers, [name]: reducer }
        if (this._emitChange) {
            this._emitChange(this.getReducers())
        }
    }

    setChangeListener (listener) {
        this._emitChange = listener
    }
}

export const recombine = (reducers, initialReducers) => {
    return combineReducers({
        ...initialReducers,
        ...reducers,
    })
}
