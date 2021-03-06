'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getReducers = exports.decorateStore = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reducerRegistry = require('./reducer-registry');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var decorateStore = exports.decorateStore = function decorateStore(_ref) {
    var store = _ref.store,
        history = _ref.history,
        events = _ref.events,
        initialReducers = _ref.initialReducers;

    store.registeredReducers = [];
    store.registeredServices = [];
    store.registeredListeners = [];
    store.syncFeatures = [];
    store.registeredFeatures = [];

    // add reducer registry to allow inject new reducers
    store.reducersRegistry = new _reducerRegistry.ReducerRegistry();
    store.reducersRegistry.setChangeListener(function (reducers) {
        store.replaceReducer((0, _reducerRegistry.recombine)(reducers, initialReducers));
    });

    store.registerReducer = function (key, fn) {
        return new Promise(function (resolve, reject) {
            store.reducersRegistry.register(key, fn);
            setTimeout(function () {
                return setTimeout(resolve);
            });
        });
    };

    store.registerService = function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(service) {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(store.registeredServices.indexOf(service) !== -1)) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return');

                        case 2:
                            store.registeredServices.push(service);

                            // initialize the service
                            // @TODO: improve error handling
                            _context.t0 = service.init;

                            if (!_context.t0) {
                                _context.next = 7;
                                break;
                            }

                            _context.next = 7;
                            return service.init(store, history)(store.dispatch, store.getState);

                        case 7:
                            _context.t1 = service.start;

                            if (!_context.t1) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 11;
                            return service.start(store, history)(store.dispatch, store.getState);

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    store.registerListener = function (listener) {
        // prevent multiple initialization
        if (store.registeredListeners.indexOf(listener) !== -1) return;
        store.registeredListeners.push(listener);

        // register listener
        // @TODO: improve error handling
        events && events.registerListener(listener);
    };

    store.registerFeature = function () {
        console.log('register feature');
    };

    store.registerSyncFeature = function (feature) {
        store.syncFeatures.push(feature);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = feature.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var listener = _step.value;

                store.registerListener(listener);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    store.registerSyncFeatures = function (features) {
        return features.forEach(function (feature) {
            return store.registerSyncFeature(feature);
        });
    };

    store.startSyncFeatures = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var services, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, feature, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, service, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _service;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        services = [];
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 4;

                        for (_iterator2 = store.syncFeatures[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            feature = _step2.value;

                            services = [].concat((0, _toConsumableArray3.default)(services), (0, _toConsumableArray3.default)(feature.services));
                        }
                        // init
                        _context2.next = 12;
                        break;

                    case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2['catch'](4);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t0;

                    case 12:
                        _context2.prev = 12;
                        _context2.prev = 13;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 15:
                        _context2.prev = 15;

                        if (!_didIteratorError2) {
                            _context2.next = 18;
                            break;
                        }

                        throw _iteratorError2;

                    case 18:
                        return _context2.finish(15);

                    case 19:
                        return _context2.finish(12);

                    case 20:
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context2.prev = 23;
                        _iterator3 = services[Symbol.iterator]();

                    case 25:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 33;
                            break;
                        }

                        service = _step3.value;

                        if (!service.init) {
                            _context2.next = 30;
                            break;
                        }

                        _context2.next = 30;
                        return service.init(store, history)(store.dispatch, store.getState);

                    case 30:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 25;
                        break;

                    case 33:
                        _context2.next = 39;
                        break;

                    case 35:
                        _context2.prev = 35;
                        _context2.t1 = _context2['catch'](23);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t1;

                    case 39:
                        _context2.prev = 39;
                        _context2.prev = 40;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 42:
                        _context2.prev = 42;

                        if (!_didIteratorError3) {
                            _context2.next = 45;
                            break;
                        }

                        throw _iteratorError3;

                    case 45:
                        return _context2.finish(42);

                    case 46:
                        return _context2.finish(39);

                    case 47:
                        // start
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;
                        _context2.prev = 50;
                        _iterator4 = services[Symbol.iterator]();

                    case 52:
                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                            _context2.next = 60;
                            break;
                        }

                        _service = _step4.value;

                        if (!_service.start) {
                            _context2.next = 57;
                            break;
                        }

                        _context2.next = 57;
                        return _service.start(store, history)(store.dispatch, store.getState);

                    case 57:
                        _iteratorNormalCompletion4 = true;
                        _context2.next = 52;
                        break;

                    case 60:
                        _context2.next = 66;
                        break;

                    case 62:
                        _context2.prev = 62;
                        _context2.t2 = _context2['catch'](50);
                        _didIteratorError4 = true;
                        _iteratorError4 = _context2.t2;

                    case 66:
                        _context2.prev = 66;
                        _context2.prev = 67;

                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }

                    case 69:
                        _context2.prev = 69;

                        if (!_didIteratorError4) {
                            _context2.next = 72;
                            break;
                        }

                        throw _iteratorError4;

                    case 72:
                        return _context2.finish(69);

                    case 73:
                        return _context2.finish(66);

                    case 74:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[4, 8, 12, 20], [13,, 15, 19], [23, 35, 39, 47], [40,, 42, 46], [50, 62, 66, 74], [67,, 69, 73]]);
    }));

    store.registerAsyncFeature = function () {
        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(feature) {
            var reducer, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, listener, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, service, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _service2;

            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!(store.registeredFeatures.indexOf(feature) !== -1)) {
                                _context3.next = 2;
                                break;
                            }

                            return _context3.abrupt('return');

                        case 2:
                            store.registeredFeatures.push(store.registeredFeatures);

                            // inject stores
                            _context3.t0 = _regenerator2.default.keys(feature.reducers);

                        case 4:
                            if ((_context3.t1 = _context3.t0()).done) {
                                _context3.next = 10;
                                break;
                            }

                            reducer = _context3.t1.value;
                            _context3.next = 8;
                            return store.registerReducer(reducer, feature.reducers[reducer]);

                        case 8:
                            _context3.next = 4;
                            break;

                        case 10:

                            // register listeners
                            _iteratorNormalCompletion5 = true;
                            _didIteratorError5 = false;
                            _iteratorError5 = undefined;
                            _context3.prev = 13;
                            _iterator5 = feature.listeners[Symbol.iterator]();

                        case 15:
                            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                                _context3.next = 22;
                                break;
                            }

                            listener = _step5.value;
                            _context3.next = 19;
                            return store.registerListener(listener);

                        case 19:
                            _iteratorNormalCompletion5 = true;
                            _context3.next = 15;
                            break;

                        case 22:
                            _context3.next = 28;
                            break;

                        case 24:
                            _context3.prev = 24;
                            _context3.t2 = _context3['catch'](13);
                            _didIteratorError5 = true;
                            _iteratorError5 = _context3.t2;

                        case 28:
                            _context3.prev = 28;
                            _context3.prev = 29;

                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }

                        case 31:
                            _context3.prev = 31;

                            if (!_didIteratorError5) {
                                _context3.next = 34;
                                break;
                            }

                            throw _iteratorError5;

                        case 34:
                            return _context3.finish(31);

                        case 35:
                            return _context3.finish(28);

                        case 36:

                            // init
                            _iteratorNormalCompletion6 = true;
                            _didIteratorError6 = false;
                            _iteratorError6 = undefined;
                            _context3.prev = 39;
                            _iterator6 = feature.services[Symbol.iterator]();

                        case 41:
                            if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                _context3.next = 49;
                                break;
                            }

                            service = _step6.value;

                            if (!service.init) {
                                _context3.next = 46;
                                break;
                            }

                            _context3.next = 46;
                            return service.init(store, history)(store.dispatch, store.getState);

                        case 46:
                            _iteratorNormalCompletion6 = true;
                            _context3.next = 41;
                            break;

                        case 49:
                            _context3.next = 55;
                            break;

                        case 51:
                            _context3.prev = 51;
                            _context3.t3 = _context3['catch'](39);
                            _didIteratorError6 = true;
                            _iteratorError6 = _context3.t3;

                        case 55:
                            _context3.prev = 55;
                            _context3.prev = 56;

                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }

                        case 58:
                            _context3.prev = 58;

                            if (!_didIteratorError6) {
                                _context3.next = 61;
                                break;
                            }

                            throw _iteratorError6;

                        case 61:
                            return _context3.finish(58);

                        case 62:
                            return _context3.finish(55);

                        case 63:
                            // start
                            _iteratorNormalCompletion7 = true;
                            _didIteratorError7 = false;
                            _iteratorError7 = undefined;
                            _context3.prev = 66;
                            _iterator7 = feature.services[Symbol.iterator]();

                        case 68:
                            if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                                _context3.next = 76;
                                break;
                            }

                            _service2 = _step7.value;

                            if (!_service2.start) {
                                _context3.next = 73;
                                break;
                            }

                            _context3.next = 73;
                            return _service2.start(store, history)(store.dispatch, store.getState);

                        case 73:
                            _iteratorNormalCompletion7 = true;
                            _context3.next = 68;
                            break;

                        case 76:
                            _context3.next = 82;
                            break;

                        case 78:
                            _context3.prev = 78;
                            _context3.t4 = _context3['catch'](66);
                            _didIteratorError7 = true;
                            _iteratorError7 = _context3.t4;

                        case 82:
                            _context3.prev = 82;
                            _context3.prev = 83;

                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }

                        case 85:
                            _context3.prev = 85;

                            if (!_didIteratorError7) {
                                _context3.next = 88;
                                break;
                            }

                            throw _iteratorError7;

                        case 88:
                            return _context3.finish(85);

                        case 89:
                            return _context3.finish(82);

                        case 90:
                            if (!feature.onLoad) {
                                _context3.next = 93;
                                break;
                            }

                            _context3.next = 93;
                            return feature.onLoad(store, history)(store.dispatch, store.getState);

                        case 93:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[13, 24, 28, 36], [29,, 31, 35], [39, 51, 55, 63], [56,, 58, 62], [66, 78, 82, 90], [83,, 85, 89]]);
        }));

        return function (_x2) {
            return _ref4.apply(this, arguments);
        };
    }();

    return store;
}; /* eslint-disable */
var getReducers = exports.getReducers = function getReducers(features) {
    var reducers = {};
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = features[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var feature = _step8.value;

            for (var reducer in feature.reducers) {
                reducers[reducer] = feature.reducers[reducer];
            }
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }

    return reducers;
};