/**********************************************************************
 *
 * @模块名称: markdownIframe.test
 *
 * @模块用途: markdownIframe.test
 *
 * @date: 2022年5月7日13:30:04
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {markdownIframe} from "../src";
import * as path from "path";

describe('markdownIframe', () => {
    test('markdownIframe.run', () => {
        const mi = new markdownIframe({path: path.join(__dirname, '/assets')});
        return mi.run()
            .then(data => {
                expect(data).toEqual('success');
            }).catch((err) => {
                console.error(err);
            });
    });
});
