/** ********************************************************************
 *
 * @模块名称: https
 *
 * @模块用途: https
 *
 * @date: 2022/4/18 13:46
 *
 * @版权所有: pgli
 *
 ********************************************************************* */
import {get} from "https";

/**
 * 根据URL地址 获取远程文件
 * @param url
 */
export const getFile = async (uri: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        get(uri, {timeout: 60000}, (response) => {
            let todo: string = '';
            // called when a data chunk is received.
            response.on('data', (chunk) => {
                todo += chunk;
            });
            // called when the complete response is received.
            response.on('end', () => {
                resolve(todo);
            });
        }).on("error", (error) => {
            reject("Error: " + error.message);
        });
    });
}

export const getMdFileFromGitRaw = getFile

