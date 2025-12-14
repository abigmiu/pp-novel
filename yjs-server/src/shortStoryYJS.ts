import { Server, type onAuthenticatePayload, type onLoadDocumentPayload, type onStoreDocumentPayload } from "@hocuspocus/server";
import { Doc, applyUpdate, encodeStateAsUpdate } from "yjs";
import path from "path";
import axios from "axios";
import fs from 'node:fs/promises'

const storageDir = path.resolve(import.meta.url, 'short-story');


async function authValidate(token: string) {
    const data = await axios.get(`http://localhost:8080/shortStoryEdit/validateToken`, {
        params: {
            token,
        }
    })

    if ( data.data && typeof data.data.data === 'boolean' && data.data.data == true) {
        return true;
    } 
    return false;
}


function createInitialDocTemplate() {
    return new Doc();
}

async function handleStoreDocument(payload: onStoreDocumentPayload) {
    const { documentName, document } = payload;
    const filePath = path.join(storageDir, `${documentName}.ydoc`);
    const update = encodeStateAsUpdate(document);
    await fs.writeFile(filePath, update);
}

async function handleLoadDocument(payload: onLoadDocumentPayload) {
    const { documentName } = payload;

    const filePath = path.join(storageDir, `${documentName}.ydoc`);
    let fileExit = false;
    try {
        await fs.stat(filePath);
        fileExit = true;
    } catch (err) {
        const e = err as NodeJS.ErrnoException;
        if (e.code === 'ENOENT') {
            fileExit = false;
        }
        throw new Error('判断文件是否存在失败');
    }
    if (!fileExit) {
        return createInitialDocTemplate();
    }
    try {
        const doc = new Doc();
        const docData  = await fs.readFile(filePath);
        const unit8Array = new Uint8Array(docData);
        applyUpdate(doc, unit8Array);
        return doc;
    } catch (e) {
        throw new Error('读取文件失败')
    }

}

async function handleAuthenticate(payload: onAuthenticatePayload) {
    const { token } = payload;
    const validated = await authValidate(token);
    return validated;
}

export function initShortStoryYJS() {
    const server = new Server({
        port: 3456,
        onLoadDocument: handleLoadDocument,
        onStoreDocument: handleStoreDocument,
        onAuthenticate: handleAuthenticate
    })
    return server;
}