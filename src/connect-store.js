/**
 * Fetches default's Redux store from context and passes it down
 * as property to the wrapped component.
 *
 * It also executes an optional `registerFn` that is passwed to the
 * factory function.
 */

import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

const storeKey = 'store'

export const storeShape = PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
})

const createConnectStore = (registerFn) => {
    const connectStore = (WrappedComponent) => {
        const contextTypes = {
            [storeKey]: storeShape, // eslint-disable-line
        }

        class Connect extends Component {
            constructor (props, context) {
                super(props, context)
                this.store = props[storeKey] || context[storeKey]
            }

            // Execute the register feature handler
            // It prevents multiple executions of the `registerFn`
            componentWillMount () {
                if (registerFn) {
                    if (this.store.registeredFeatures.indexOf(registerFn) === -1) {
                        this.store.registeredFeatures.push(registerFn)
                        registerFn(this.store)
                    }
                }
            }

            render () {
                return createElement(WrappedComponent, {
                    ...this.props,
                    store: this.store,
                })
            }
        }

        Connect.contextTypes = contextTypes
        Connect.propTypes = contextTypes
        Connect.WrappedComponent = WrappedComponent

        return hoistStatics(Connect, WrappedComponent)
    }

    return connectStore
}

export default createConnectStore
