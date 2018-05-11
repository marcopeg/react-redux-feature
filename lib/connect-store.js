'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.storeShape = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storeKey = 'store'; /**
                         * Fetches default's Redux store from context and passes it down
                         * as property to the wrapped component.
                         *
                         * It also executes an optional `registerFn` that is passwed to the
                         * factory function.
                         */

var storeShape = exports.storeShape = _propTypes2.default.shape({
    subscribe: _propTypes2.default.func.isRequired,
    dispatch: _propTypes2.default.func.isRequired,
    getState: _propTypes2.default.func.isRequired
});

var createConnectStore = function createConnectStore(registerFn) {
    var connectStore = function connectStore(WrappedComponent) {
        var contextTypes = (0, _defineProperty3.default)({}, storeKey, storeShape);

        var Connect = function (_Component) {
            (0, _inherits3.default)(Connect, _Component);

            function Connect(props, context) {
                (0, _classCallCheck3.default)(this, Connect);

                var _this = (0, _possibleConstructorReturn3.default)(this, (Connect.__proto__ || Object.getPrototypeOf(Connect)).call(this, props, context));

                _this.store = props[storeKey] || context[storeKey];
                return _this;
            }

            // Execute the register feature handler
            // It prevents multiple executions of the `registerFn`


            (0, _createClass3.default)(Connect, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    if (registerFn) {
                        if (!registerFn.hasFired) {
                            registerFn.hasFired = true;
                            registerFn(this.store);
                        }
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    return (0, _react.createElement)(WrappedComponent, Object.assign({}, this.props, {
                        store: this.store
                    }));
                }
            }]);
            return Connect;
        }(_react.Component);

        Connect.contextTypes = contextTypes;
        Connect.propTypes = contextTypes;
        Connect.WrappedComponent = WrappedComponent;

        return (0, _hoistNonReactStatics2.default)(Connect, WrappedComponent);
    };

    return connectStore;
};

exports.default = createConnectStore;