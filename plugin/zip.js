// plugin/zip.js
import { cwd } from 'node:process';
import path from 'path';
import compressing from 'compressing';

// 默认参数配置
const defaultOption = {
  sourceName: 'docs',
  type: 'zip',
  targetName: 'docs',
};

export function compression(options = defaultOption) {
  const sourceName = options.sourceName ?? 'docs';
  const type = options.type ?? 'zip';
  const targetName = options.targetName ?? 'docs';
  const targetPath = path.resolve(cwd(), sourceName);
  const outputFile = path.resolve(cwd(), `${targetName}.${type}`);

  return {
    name: 'compression',
    closeBundle() {
      console.log(`📦 正在压缩目录: ${targetPath}`);
      compressing.zip
        .compressDir(targetPath, outputFile)
        .then(() => {
          console.log(`✅ 压缩完成，输出文件: ${outputFile}`);
        })
        .catch((err) => {
          console.error(`❌ 压缩失败:`, err);
        });
    },
  };
}
