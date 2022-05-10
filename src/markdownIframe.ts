/** ********************************************************************
 *
 * @模块名称: markdownIframe
 *
 * @模块用途: markdownIframe
 *
 * @date: 2022/5/6 13:57
 *
 * @版权所有: pgli
 *
 ********************************************************************* */
import {defaultMatchEnd, defaultMatchStart, findMdFileList, writeIframes, WriteIframesProps} from "./file";

class markdownIframe {
    private __path: string;
    private __matchStart: string;
    private __matchEnd: string;

    constructor(props: WriteIframesProps) {
        this.__path = props.path;
        this.__matchStart = props.matchStart || defaultMatchStart;
        this.__matchEnd = props.matchEnd || defaultMatchEnd;
    };

    /**
     * 开始处理
     */
    run = async () => {
        // 查找文件
        const list = await findMdFileList(this.__path);
        for (let _path of list) {
            console.log(`process ${_path} ...`)
            await writeIframes({path: _path, matchStart: this.__matchStart, matchEnd: this.__matchEnd});
        }
        return 'success';
    }
}

export default markdownIframe;
