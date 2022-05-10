/** ********************************************************************
 *
 * @模块名称: file
 *
 * @模块用途: file 文件读写查找操作
 *
 * @date: 2022/4/18 13:12
 *
 * @版权所有: pgli
 *
 ********************************************************************* */
import {readFile as _readFile, outputFile} from 'fs-extra';
import {readdirSync, statSync} from "fs";
import {join} from "path";
import {getMdFileFromGitRaw} from "./https";

/**
 * 文件写入
 * @param path
 */
export const readFile = async (path: string) => {
    return new Promise((resolve, reject) => {
        _readFile(path, (err: Error, data: Buffer) => {
            if (err) {
                reject(err);
                throw err;
            } else {
                resolve(data);
            }
        });
    });
}
/**
 * 文件写入
 * @param path
 * @param data
 */
export const writeFile = async (path: string, data: any) => {
    return new Promise((resolve, reject) => {
        outputFile(path, data, (err) => {
            if (err) {
                reject(err);
                throw err;
            } else {
                resolve(true);
            }
        })
    })
};

/**
 * 查找文件路径
 * @param filePath
 * @param fileList
 */
const findFilePath = (filePath: string, fileList: any[string]) => {
    const files = readdirSync(filePath);
    //遍历读取到的文件列表
    files.forEach((filename: string, index: number) => {
        //获取当前文件的绝对路径
        const dirPath = join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        const stats = statSync(dirPath);
        const isFile = stats.isFile();//是文件
        const isDir = stats.isDirectory();//是文件夹
        if (isFile) {
            fileList.push(dirPath);
        }
        if (isDir) {
            findFilePath(dirPath, fileList); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
};

/**
 *查找dir目录下的文件
 * @param dirPath
 */
export const findFileList = async (dirPath: string): Promise<any[string]> => {
    return new Promise((resolve, reject) => {
        try {
            const fileList: any[string] = [];
            findFilePath(dirPath, fileList);
            resolve(fileList);
        } catch (e) {
            reject(e);
        }
    });
}
/**
 * 查找markdown文件的list集合
 */
export const findMdFileList = async (dirPath: string) => {
    const list = await findFileList(dirPath);
    return list?.filter((itemFilePath: string) => {
        return itemFilePath.endsWith('.md') || itemFilePath.endsWith('.MD')
    });
}
export const defaultMatchStart = "[filename](";
export const defaultMatchEnd = " ':include')";
/**
 * 根据raws内容 找到复合配置的iframe链接
 */
export const findGitRawList = (raw: string, matchStart?: string, matchEnd?: string): IterableIterator<RegExpMatchArray> => {
    const startMatch = (matchStart || defaultMatchStart).replace('[', '\\[').replace('(', '\\(').replace(']', '\\]');
    const endMatch = (matchEnd || defaultMatchEnd).replace(')', '\\)');
    const reg = new RegExp(`(?<=(${startMatch})).*(?=(${endMatch}))`, 'g');
    return raw.matchAll(reg);
}

/**
 * 根据rawList将查询到的内容放到数组中去
 * @param rawList
 */
type FindIframesByRawListItem = {
    url: string,
    matchStr: string;
    content: string;
}

export const findGitRawListAndContent = (raw: IterableIterator<RegExpMatchArray>, matchStart?: string, matchEnd?: string): Array<FindIframesByRawListItem> => {
    // 处理好字符串
    const raws: Array<FindIframesByRawListItem> = [];
    for (const regExpMatchArray of raw) {
        raws.push({
            url: regExpMatchArray[0],
            matchStr: `${matchStart || defaultMatchStart}${regExpMatchArray[0]}${matchEnd || defaultMatchEnd}`,
            content: ''
        });
    }
    return raws
}
export const findIframesByRawList = (
    rawList: IterableIterator<RegExpMatchArray>,
    matchStart?: string, matchEnd?: string): Promise<Array<FindIframesByRawListItem>> => {
    return new Promise((resolve, reject) => {
        const raws = findGitRawListAndContent(rawList, matchStart, matchEnd);
        if (raws.length) {
            Promise.all(raws.map(({url, matchStr}) => {
                return getMdFileFromGitRaw(url);
            })).then((date) => {
                date.forEach((item, index) => {
                    raws[index].content = item.toString();
                });
                resolve(raws);
            });
        } else {
            resolve([]);
        }
    });
}

/**
 * 获取重新组装的数据
 * @param contents
 * @param raws
 */
export const getIframesByRaws = (contents: string, raws: Array<FindIframesByRawListItem>) => {
    for (const {matchStr, content} of raws) {
        const newMatchStr = new RegExp(matchStr
            .replace('[', '\\[').replace(']', '\\]')
            .replace('(', '\\(').replace(')', '\\)')
            .replace(/\./g, '\\.').replace(/\//g, '\\/'));
        // 替换字符串
        contents = contents.replace(newMatchStr, content);
    }
    return contents;
}

export interface WriteIframesProps {
    path: string,
    matchStart?: string,
    matchEnd?: string,
}

/**
 * 写入Iframe内容
 * @param _path
 */
export const writeIframes = async (props: WriteIframesProps) => {
    const _path = props.path;
    const {matchStart, matchEnd} = props;
    // 根据路径读取文件内容
    const contents = await readFile(_path);
    // 根据文件内容 查找是否有iframe链接
    const raws = findGitRawList(contents.toString(), matchStart, matchEnd);
    // 根据链接去获取对应的链接内容
    const list = await findIframesByRawList(raws, matchStart, matchEnd);
    // 查询到链接标签 说明有内容需要爬取替换 此处做写入处理
    if (list?.length) {
        for (const findIframesByRawListItem of list) {
            const newContents = getIframesByRaws(contents.toString(), list);
            await writeFile(_path, newContents);
        }
    }
}
