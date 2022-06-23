"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regeneratorRuntime2 = _interopRequireDefault(require("@babel/runtime/helpers/regeneratorRuntime"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _utils = require("@umijs/utils");

var _path = require("path");

var _utils2 = require("./utils");

var _default = function _default(api) {
  console.log('SVGS 插件启动'); // 插件注册

  api.describe({
    key: 'svgs',
    config: {
      default: './src/assets/svg',
      schema: function schema(joi) {
        return joi.object({
          entry: joi.string().required(),
          output: api.paths.absTmpPath,
          alias: joi.string().default('@svgs')
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  var svgs = api.userConfig.svgs;
  var svgsOutput = (0, _path.resolve)(api.paths.absTmpPath, 'plugin-svgs');

  if (svgs === undefined) {
    return;
  }

  var entry = svgs.entry,
      _svgs$alias = svgs.alias,
      alias = _svgs$alias === void 0 ? '@svgs' : _svgs$alias;

  if (entry === undefined) {
    console.log(_utils.chalk.red('Please set svgs.entry as SVG dir.'));
  }

  api.chainWebpack(function (config) {
    config.resolve.alias.set(alias, svgsOutput);
    return config;
  });
  api.modifyBabelPresetOpts(function (opts) {
    return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, opts), {}, {
      import: (opts.import || []).concat([{
        libraryName: alias,
        libraryDirectory: 'svgs',
        camel2DashComponentName: false
      }])
    });
  });
  api.onGenerateFiles(function () {
    (0, _utils2.reactSVGGeneratorFromSVGDir)({
      entry: entry,
      output: svgsOutput
    });
    console.log(_utils.chalk.green('生成 SVG COMPONENT 成功'));
  });

  function growthGenerateSvg(_x) {
    return _growthGenerateSvg.apply(this, arguments);
  }

  function _growthGenerateSvg() {
    _growthGenerateSvg = (0, _asyncToGenerator2.default)( /*#__PURE__*/(0, _regeneratorRuntime2.default)().mark(function _callee(SVGPath) {
      return (0, _regeneratorRuntime2.default)().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _utils2.reactSVGGeneratorFromSVGDir)({
                entry: entry,
                output: svgsOutput
              });

            case 2:
              console.log(_utils.chalk.green('生成 SVG COMPONENT 成功'));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _growthGenerateSvg.apply(this, arguments);
  }

  if (api.env === 'development') {
    _utils.chokidar.watch(entry, {
      ignoreInitial: true,
      ignored: /(^|[\/\\])\../
    }).on('add', growthGenerateSvg).on('change', growthGenerateSvg).on('unlink', growthGenerateSvg);
  }
};

exports.default = _default;