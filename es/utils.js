import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/helpers/esm/regeneratorRuntime";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import cpy from 'cpy';
import { mkdirSync, readdir, readFile, statSync, writeFileSync } from 'fs';
import path, { dirname, resolve } from 'path'; // TODO

/**
 * 增量生成 react-svg 组件
 * @param param0
 * @returns
 */

export function singleReactSVGGenerator(_x) {
  return _singleReactSVGGenerator.apply(this, arguments);
}
/**
 * 批量生成 react-svg 组件
 * @param param0
 * @returns
 */

function _singleReactSVGGenerator() {
  _singleReactSVGGenerator = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
    var SVGPath, output, ASNDirName, svgsDirName;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
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

export function reactSVGGeneratorFromSVGDir(_x2) {
  return _reactSVGGeneratorFromSVGDir.apply(this, arguments);
} // 读取SVG文件夹下所有svg

function _reactSVGGeneratorFromSVGDir() {
  _reactSVGGeneratorFromSVGDir = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_ref2) {
    var output, entry, write;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            output = _ref2.output, entry = _ref2.entry;
            ensure(output); // 同步写入方法
            // TODO 支持 JS

            write = function write(data) {
              var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'a+';
              writeFileSync(resolve(output, 'svg.tsx'), data, {
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
                        _words$split2 = _slicedToArray(_words$split, 3),
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
    readdir(SVGPath, function (err, files) {
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
    readFile(path.join(SVGPath, filename), 'utf-8', function (err, data) {
      if (err) reject(err);

      if (data) {
        resolve(_defineProperty({}, filename.slice(0, filename.lastIndexOf('.')), data));
      }
    });
  });
}
/**
 * create dir if dir don't existing.
 * @param filepath
 * @param next
 */


export function ensure(filepath) {
  var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  try {
    statSync(filepath);

    if (next.length !== 0) {
      mkdirSync(next.pop());
      ensure(filepath, next);
    }
  } catch (_unused) {
    var needToCreate = dirname(filepath);
    ensure(needToCreate, next.concat(filepath));
  }
}

function copySVGComponents(_x3) {
  return _copySVGComponents.apply(this, arguments);
}

function _copySVGComponents() {
  _copySVGComponents = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref3) {
    var output;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            output = _ref3.output;
            _context3.next = 3;
            return cpy(resolve(__dirname, './index.tsx.tpl'), output, {
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