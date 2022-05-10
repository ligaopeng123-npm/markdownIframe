/**********************************************************************
 *
 * @模块名称: file.test
 *
 * @模块用途: file.test
 *
 * @date: 2021/8/13 16:14
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {findFileList, readFile, findGitRawList, findIframesByRawList} from "../src";
import * as path from "path";

describe('file', () => {
    test('findFileList', () => {
        return findFileList(path.join(__dirname, '/assets')).then(data => {
            expect(data).toStrictEqual([
                path.join(__dirname, 'assets/README.md'),
                path.join(__dirname, 'assets/README2.md'),
            ]);
        });
    });

    test('findMdFileList', () => {
        return findFileList(path.join(__dirname, '/assets')).then(data => {
            expect(data).toStrictEqual([
                path.join(__dirname, 'assets/README.md'),
                path.join(__dirname, 'assets/README2.md'),
            ]);
        });
    });

    test('findGitRawsList', () => {
        return readFile(path.join(__dirname, '/assets/README.md')).then((raw: string) => {
            const arr = [];
            for (const regExpMatchArray of findGitRawList(raw.toString())) {
                arr.push(regExpMatchArray[0]);
            }
            expect(arr).toContain("https://raw.githubusercontent.com/ligaopeng123/react-project-template/react-simple-template/README.md");
        })
    });

    test('findIframesByRawList', () => {
        return readFile(path.join(__dirname, '/assets/README.md')).then((raw: string) => {
            const list = findGitRawList(raw.toString());
            findIframesByRawList(list).then((raws) => {
                console.log(raws)
            });
        })
    });
});





