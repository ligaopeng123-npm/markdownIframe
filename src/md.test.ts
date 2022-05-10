/** ********************************************************************
 *
 * @模块名称: test
 *
 * @模块用途: test
 *
 * @date: 2022/5/7 13:42
 *
 * @版权所有: pgli
 *
 ********************************************************************* */
import {
    findGitRawList,
    findGitRawListAndContent,
    findIframesByRawList,
    markdownIframe,
    readFile,
    writeFile
} from "./index";
import {join} from "path";
import * as path from "path";
import {getIframesByRaws} from "./file";

const mi = new markdownIframe({path: join(__dirname, '../__test__/assets')});
mi.run()
    .then(data => {
        console.log('data', data);
    }).catch((err) => {
    console.error(err);
});


const mdTest = async () => {
    const __path = path.join(__dirname, '../__test__/assets/README.md');
    const contents = await readFile(__path);
    const raws = findGitRawList(contents.toString());
    const newRaws = findGitRawListAndContent(raws);
    const newContents = getIframesByRaws(contents.toString(), newRaws);
}

// test();
