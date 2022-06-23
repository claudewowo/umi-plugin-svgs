"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensure = ensure;
exports.reactSVGGeneratorFromSVGDir = reactSVGGeneratorFromSVGDir;
exports.singleReactSVGGenerator = singleReactSVGGenerator;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regeneratorRuntime2 = _interopRequireDefault(require("@babel/runtime/helpers/regeneratorRuntime"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cpy = _interopRequireDefault(require("cpy"));

var _fs = require("fs");

var _path = _interopRequireWildcard(require("path"));

// TODO

/**
 * 增量生成 react-svg 组件
 * @param param0
 * @returns
 */
function singleReactSVGGenerator(_x) {
  return _singleReactSVGGenerator.apply(this, arguments);
}
/**
 * 批量生成 react-svg 组件
 * @param param0
 * @returns
 */


function _singleReactSVGGenerator() {
  _singleReactSVGGenerator = (0, _asyncToGenerator2.default)( /*#__PURE__*/(0, _regeneratorRuntime2.default)().mark(function _callee(_ref) {
    var SVGPath, output, ASNDirName, svgsDirName;
    return (0, _regeneratorRuntime2.default)().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            SVGPath = _ref.SVGPath, output = _ref.output, ASNDirName = _ref.ASNDirName, svgsDirName = _ref.svgsDirName;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _singleReactSVGGenerator.apply(this, arguments);
}

function reactSVGGeneratorFromSVGDir(_x2) {
  return _reactSVGGeneratorFromSVGDir.apply(this, arguments);
} // 读取SVG文件夹下所有svg


function _reactSVGGeneratorFromSVGDir() {
  _reactSVGGeneratorFromSVGDir = (0, _asyncToGenerator2.default)( /*#__PURE__*/(0, _regeneratorRuntime2.default)().mark(function _callee2(_ref2) {
    var output, entry, write;
    return (0, _regeneratorRuntime2.default)().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            output = _ref2.output, entry = _ref2.entry;
            ensure(output); // 同步写入方法
            // TODO 支持 JS

            write = function write(data) {
              var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'a+';
              (0, _fs.writeFileSync)((0, _path.resolve)(output, 'svg.tsx'), data, {
                flag: flag
              });
            };

            readSvgs(entry).then(function (data) {
              write("import React from 'react';");
              write('export default {', 'w+');
              data.forEach(function (item) {
                Object.keys(item).forEach(function (key, i) {
                  write("".concat(convertStringToCamelCase(key), ": (props: any) => ("));
                  var str = item[key];
                  var reg = /([a-z])-([a-z])/g; // 给 svg 传递属性， 如果属性名称中包含 - 则需要替换成驼峰式

                  var content = str.replace('<svg', '<svg {...props}').replace(reg, function (words) {
                    var _words$split = words.split(''),
                        _words$split2 = (0, _slicedToArray2.default)(_words$split, 3),
                        $1 = _words$split2[0],
                        $2 = _words$split2[2];

                    return $1 + $2.toUpperCase();
                  });
                  write(Buffer.from(content));
                  write('),');
                });
              });
              write('}');
            }).catch(function (err) {
              console.log(err);
            });
            _context2.next = 6;
            return copySVGComponents({
              output: output
            });

          case 6:
            return _context2.abrupt("return", '111');

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _reactSVGGeneratorFromSVGDir.apply(this, arguments);
}

function readSvgs(SVGPath) {
  return new Promise(function (resolve, reject) {
    (0, _fs.readdir)(SVGPath, function (err, files) {
      if (err) reject(err);
      Promise.all(files.map(function (filename) {
        return readfile(SVGPath, filename);
      })).then(function (data) {
        resolve(data);
      }).catch(function (error) {
        return reject(error);
      });
    });
  });
} // 读取单个文件


function readfile(SVGPath, filename) {
  return new Promise(function (resolve, reject) {
    (0, _fs.readFile)(_path.default.join(SVGPath, filename), 'utf-8', function (err, data) {
      if (err) reject(err);

      if (data) {
        resolve((0, _defineProperty2.default)({}, filename.slice(0, filename.lastIndexOf('.')), data));
      }
    });
  });
}
/**
 * create dir if dir don't existing.
 * @param filepath
 * @param next
 */


function ensure(filepath) {
  var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  try {
    (0, _fs.statSync)(filepath);

    if (next.length !== 0) {
      (0, _fs.mkdirSync)(next.pop());
      ensure(filepath, next);
    }
  } catch (_unused) {
    var needToCreate = (0, _path.dirname)(filepath);
    ensure(needToCreate, next.concat(filepath));
  }
}

function copySVGComponents(_x3) {
  return _copySVGComponents.apply(this, arguments);
}

function _copySVGComponents() {
  _copySVGComponents = (0, _asyncToGenerator2.default)( /*#__PURE__*/(0, _regeneratorRuntime2.default)().mark(function _callee3(_ref3) {
    var output;
    return (0, _regeneratorRuntime2.default)().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            output = _ref3.output;
            _context3.next = 3;
            return (0, _cpy.default)((0, _path.resolve)(__dirname, './index.tsx.tpl'), output, {
              rename: function rename(path) {
                return path.replace('.tsx.tpl', '.tsx');
              }
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _copySVGComponents.apply(this, arguments);
}

function convertStringToCamelCase(sentence) {
  return sentence.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (camelCaseMatch, i) {
    if (+camelCaseMatch === 0) return '';
    return i === 0 ? camelCaseMatch.toLowerCase() : camelCaseMatch.toUpperCase();
  });
}