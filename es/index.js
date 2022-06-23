import _regeneratorRuntime from "@babel/runtime/helpers/esm/regeneratorRuntime";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { chalk, chokidar } from '@umijs/utils';
import { resolve } from 'path';
import { reactSVGGeneratorFromSVGDir } from './utils';
export default (function (api) {
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
  var svgsOutput = resolve(api.paths.absTmpPath, 'plugin-svgs');

  if (svgs === undefined) {
    return;
  }

  var entry = svgs.entry,
      _svgs$alias = svgs.alias,
      alias = _svgs$alias === void 0 ? '@svgs' : _svgs$alias;

  if (entry === undefined) {
    console.log(chalk.red('Please set svgs.entry as SVG dir.'));
  }

  api.chainWebpack(function (config) {
    config.resolve.alias.set(alias, svgsOutput);
    return config;
  });
  api.modifyBabelPresetOpts(function (opts) {
    return _objectSpread(_objectSpread({}, opts), {}, {
      import: (opts.import || []).concat([{
        libraryName: alias,
        libraryDirectory: 'svgs',
        camel2DashComponentName: false
      }])
    });
  });
  api.onGenerateFiles(function () {
    reactSVGGeneratorFromSVGDir({
      entry: entry,
      output: svgsOutput
    });
    console.log(chalk.green('生成 SVG COMPONENT 成功'));
  });

  function growthGenerateSvg(_x) {
    return _growthGenerateSvg.apply(this, arguments);
  }

  function _growthGenerateSvg() {
    _growthGenerateSvg = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(SVGPath) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return reactSVGGeneratorFromSVGDir({
                entry: entry,
                output: svgsOutput
              });

            case 2:
              console.log(chalk.green('生成 SVG COMPONENT 成功'));

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
    chokidar.watch(entry, {
      ignoreInitial: true,
      ignored: /(^|[\/\\])\../
    }).on('add', growthGenerateSvg).on('change', growthGenerateSvg).on('unlink', growthGenerateSvg);
  }
});