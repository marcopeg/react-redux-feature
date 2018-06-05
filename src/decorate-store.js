/* eslint-disable */
import { ReducerRegistry, recombine } from './reducer-registry'

export const decorateStore = ({ store, history, events, initialReducers }) => {
    store.registeredReducers = []
    store.registeredServices = []
    store.registeredListeners = []
    store.syncFeatures = []
    store.registeredFeatures = []

    // add reducer registry to allow inject new reducers
    store.reducersRegistry = new ReducerRegistry()
    store.reducersRegistry.setChangeListener(reducers => {
        store.replaceReducer(recombine(reducers, initialReducers))
    })

    store.registerReducer = (key, fn) => new Promise((resolve, reject) => {
        store.reducersRegistry.register(key, fn)
        setTimeout(() => setTimeout(resolve))
    })

    store.registerService = async (service) => {
        // prevent multiple initialization
        if (store.registeredServices.indexOf(service) !== -1) return
        store.registeredServices.push(service)

        // initialize the service
        // @TODO: improve error handling
        service.init && await service.init(store, history)(store.dispatch, store.getState)
        service.start && await service.start(store, history)(store.dispatch, store.getState)
    }

    store.registerListener = (listener) => {
        // prevent multiple initialization
        if (store.registeredListeners.indexOf(listener) !== -1) return
        store.registeredListeners.push(listener)

        // register listener
        // @TODO: improve error handling
        events && events.registerListener(listener)
    }

    store.registerFeature = () => {
        console.log('register feature')
    }

    store.registerSyncFeature = (feature) => {
        store.syncFeatures.push(feature)
        for (const listener of feature.listeners) {
            store.registerListener(listener)
        }
    }

    store.registerSyncFeatures = features =>
        features.forEach(feature => store.registerSyncFeature(feature))

    store.startSyncFeatures = async () => {
        let services = []
        for (const feature of store.syncFeatures) {
            services = [ ...services, ...feature.services ]
        }
        // init
        for (const service of services) {
            if (service.init) {
                await service.init(store, history)(store.dispatch, store.getState)
            }
        }
        // start
        for (const service of services) {
            if (service.start) {
                await service.start(store, history)(store.dispatch, store.getState)
            }
        }
    }

    store.registerAsyncFeature = async (feature) => {
        // handle singleton register
        if (store.registeredFeatures.indexOf(feature) !== -1) return
        store.registeredFeatures.push(store.registeredFeatures)

        // inject stores
        for (const reducer in feature.reducers) {
            await store.registerReducer(reducer, feature.reducers[reducer])
        }

        // register listeners
        for (const listener of feature.listeners) {
            await store.registerListener(listener)
        }

        // init
        for (const service of feature.services) {
            if (service.init) {
                await service.init(store, history)(store.dispatch, store.getState)
            }
        }
        // start
        for (const service of feature.services) {
            if (service.start) {
                await service.start(store, history)(store.dispatch, store.getState)
            }
        }

        // feature onLoad hook
        if (feature.onLoad) {
            await feature.onLoad(store, history)(store.dispatch, store.getState)
        }
    }

    return store
}

export const getReducers = (features) => {
    const reducers = {}
    for (const feature of features) {
        for (const reducer in feature.reducers) {
            reducers[reducer] = feature.reducers[reducer]
        }
    }
    return reducers
}