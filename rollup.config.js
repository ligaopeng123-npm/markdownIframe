/**********************************************************************
 *
 * @模块名称: rollup.config
 *
 * @模块用途: rollup.config
 *
 * @date: 2022/4/18 8:35
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import fs_extra from 'fs-extra';
import path from "path";
import packageConfig from "./package.json";
import ttypescript from 'ttypescript';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';

const filename = packageConfig.name;

function writeCjsEntryFile() {
    const baseLine = `module.exports = require('./${filename}`;
    const contents =
        `
'use strict'

if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.production.min.js')
} else {
  ${baseLine}.cjs.development.js')
}
`;
    return fs_extra.outputFile(path.join('dist', 'index.js'), contents);
}

writeCjsEntryFile();

export default {
    input: path.join(__dirname, './src/index.ts'),
    output: [{
        file: path.join(__dirname, `./dist/${filename}.cjs.development.js`),
        format: 'cjs',
        compact: true,
        banner: '// welcome to imooc.com',
        footer: '// powered by sam',
    }, {
        file: path.join(__dirname, `./dist/${filename}.cjs.production.min.js`),
        format: 'cjs',
        compact: true,
        banner: '// welcome to imooc.com',
        footer: '// powered by sam',
        plugins: [
            terser()
        ]
    }, {
        file: path.join(__dirname, `./dist/${filename}.esm.js`),
        format: 'es',
        compact: true,
        banner: '// welcome to imooc.com',
        footer: '// powered by sam'
    }],
    plugins: [
        typescript({
            typescript: ttypescript,
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
            useTsconfigDeclarationDir: false,
            emitDeclarationOnly: true,
            tsconfigDefaults: {
                exclude: [
                    '**/*.test.ts',
                    'node_modules',
                ]
            },
        })
    ],
    // 处理外部依赖 不进行编译
    external: (id) => {
        return !id.startsWith('.') && !path.isAbsolute(id);
    },
}
