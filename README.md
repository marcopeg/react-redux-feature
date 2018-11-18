# react-redux-feature

A proposal for a feature centric React/Redux application where teams can
focus on a small part of the big picture and avoid stepping on each
others shoes.

## What is a "feature"?

A feature, in a react/redux application, is a set of reducers (with actions),
services (aka asynchronous actions), [listeners (aka side effects)](https://www.npmjs.com/package/redux-events-middleware) and containers
that work together to bring a business value to life. 

A feature can represent a "login" or a "signup" or a "compose email" functionality.

Starting from the classic [create-react-app](https://facebook.github.io/create-react-app/)
folder structure I suggest to lay down features as follow:

- /src
  - App.js
  - /features
    - index.js
    - /feature1
      - index.js
      - /reducers
      - /services
      - /listeners
      - /containers
      - /components

## Feature's Manifest

A feature exposes a manifest file in it's `index.js` file that should export at least:

- reducers
- services
- listeners

```
/* feature1/index.js */

export const reducers = {
    auth: require('./auth.reducer').default,
}

export const services = [
    require('./auth.service),
]

export const listeners = [
    require('./auth.listener').default,
]

```

**NOTE:** redux' reducers must have unique names across the entire app!

## Reducers

Here is an example of a possible reducer definition, as you can see a reducer
definition is responsible to export the `action names`, `action creators` and
the reducer function itself.

Experience showed me that this is a decent nucleous of functionality that is
small enough so to be described in one single file.

```
/* auth.reducer.js */

export const initialState = {
    hasLogin: false,
    id: null,
}

/**
 * Actions
 */

export const SET_LOGIN = 'setLogin@auth'

export const setLogin = ({ id }) => ({
    type: SET_LOGIN,
    payload: { id },
})


/**
 * Handlers
 */

export const actionHandlers = {
    [SET_LOGIN]: (state, { payload }) => ({
        ...state,
        hasLogin: true,
        id: payload.id,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer
```

## Services

A service contains a list of `asynchronous redux actions` that are handled by
[redux-thunk](https://github.com/reduxjs/redux-thunk) (which should be running 
in your redux store).

A feature may expose two particular functions `init` and `start` that will be
executed the first time you register the service.

If you are setting up multiple features, first all the `init` methods will be fired,
and only after this init phase all the `start` methods will run.

Services functions are completely asynchronous, this let you do all sort of
operations, but could be a way to stuck the booting of your app. Be cautious on await!

```
/* auth.service.js */
import { setLogin } from './auth.reducer.js'

// generic service function that talk with your backend
export const login = (uname, passw) => async (dispatch, getState) => {
    const baseUrl = getState().baseUrl
    const loginId = await post(`${baseUrl}/login`, { uname, passw })
    dispatch(setLogin(loginId))
}

export const logout = () => ...

// service lifecycle methods
export const init = (store, history) => (dispatch, getState) => {}
export const start = (store, history) => (dispatch, getState) => {}
```

## Listeners

A listener is a way to **indirectly** associate side effect to a redux action.
The basic idea is to use redux as a simple event emitter in our app.

[Read more about redux-events and listeners.](https://www.npmjs.com/package/redux-events-middleware)

```
/* auth.listener.js */

import { logout } from './auth.service'

export default [
    {
        type: '@logout',
        handler: (action, { history }) => async (dispatch) => {
            await dispatch(logout())
            history.push('/goodbye')
        },
    },
]
```

## Cross features operations

A feature communicates with the rest of the app in 2 ways:

- import/export of api calls
- listening for side effects calls

The first method consist in `featureA` exposing a `foo` method that `featureB`
imports and executes.

This way is very safe as features declare hard dependencies on each other
(if you misspell a method name you will see red in your console) and it is kept
under control because you will use only the feature's manifest to deisgn
your feature's APIs.

But hard dependencies are not always possible (or convenient).

The second way is for `featureA` to dispatch redux actions that we know are handled
by `featureB` via listeners. The loop looks like:

1. feature "A" dispatch "@foo"
2. feature "B" listen to "@foo"
3. feature "B" dispatch an internal service action "foo"
4. feature "B"'s service does stuff and dispatch internal reducer actions
5. eventually the state gets updated :-)

This whole process is a little bit cumbersome but in my experience I find worth it
if I can define a very simple pathway for my "intentions" to go through.

The downside of this approach is that if `featureA` misspells `@fou` there will be
no hard failure. `featureB` will be listening for `@foo` and a very tough to debug
error will take place in your app.

In conclusion I use both those methods, but tend to prefer indirect inter-feature
communications because make my codebase less entangled. Regression tests helps me
getting logical errors under control.
