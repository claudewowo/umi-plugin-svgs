import { IApi } from '@umijs/types';
import { chalk, chokidar } from '@umijs/utils';
import { resolve } from 'path';
import { reactSVGGeneratorFromSVGDir } from './utils';
export default (api: IApi) => {
  console.log('SVGS 插件启动');
  // 插件注册
  api.describe({
    key: 'svgs',
    config: {
      default: './src/assets/svg',
      schema(joi) {
        return joi.object({
          entry: joi.string().required(),
          output: api.paths.absTmpPath,
          alias: joi.string().default('@svgs'),
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  const { svgs } = api.userConfig;
  const svgsOutput = resolve(api.paths.absTmpPath!, 'plugin-svgs');

  if (svgs === undefined) {
    return;
  }
  const { entry, alias = '@svgs' } = svgs;

  if (entry === undefined) {
    console.log(chalk.red('Please set svgs.entry as SVG dir.'));
  }

  api.chainWebpack((config) => {
    config.resolve.alias.set(alias, svgsOutput);
    return config;
  });

  api.modifyBabelPresetOpts((opts) => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        {
          libraryName: alias,
          libraryDirectory: 'svgs',
          camel2DashComponentName: false,
        },
      ]),
    };
  });

  api.onGenerateFiles(() => {
    reactSVGGeneratorFromSVGDir({
      entry,
      output: svgsOutput,
    });
    console.log(chalk.green('生成 SVG COMPONENT 成功'));
  });

  async function growthGenerateSvg(SVGPath: string) {
    await reactSVGGeneratorFromSVGDir({
      entry,
      output: svgsOutput,
    });
    console.log(chalk.green('生成 SVG COMPONENT 成功'));
  }

  if (api.env === 'development') {
    chokidar
      .watch(entry, {
        ignoreInitial: true,
        ignored: /(^|[\/\\])\../,
      })
      .on('add', growthGenerateSvg)
      .on('change', growthGenerateSvg)
      .on('unlink', growthGenerateSvg);
  }
};
