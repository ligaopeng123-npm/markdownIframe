/**********************************************************************
 *
 * @模块名称: http.test
 *
 * @模块用途: http.test
 *
 * @date: 2021/8/13 16:14
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {getMdFileFromGitRaw} from "../src";

describe('http', () => {
    test('getMdFileFromGitRaw', () => {
        return getMdFileFromGitRaw("https://raw.githubusercontent.com/ligaopeng123/react-project-template/react-simple-template/README.md")
            .then(data => {
                expect(data).toHaveLength(data.length);
            }).catch((err) => {
                console.error(err);
            });
    });
});





