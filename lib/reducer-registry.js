'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.recombine = exports.ReducerRegistry = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReducerRegistry = exports.ReducerRegistry = function () {
    function ReducerRegistry() {
        (0, _classCallCheck3.default)(this, ReducerRegistry);

        this._emitChange = null;
        this._reducers = {};
    }

    (0, _createClass3.default)(ReducerRegistry, [{
        key: 'getReducers',
        value: function getReducers() {
            return Object.assign({}, this._reducers);
        }
    }, {
        key: 'register',
        value: function register(name, reducer) {
            this._reducers = Object.assign({}, this._reducers, (0, _defineProperty3.default)({}, name, reducer));
            if (this._emitChange) {
                this._emitChange(this.getReducers());
            }
        }
    }, {
        key: 'setChangeListener',
        value: function setChangeListener(listener) {
            this._emitChange = listener;
        }
    }]);
    return ReducerRegistry;
}();

var recombine = exports.recombine = function recombine(reducers, initialReducers) {
    return (0, _redux.combineReducers)(Object.assign({}, initialReducers, reducers));
};