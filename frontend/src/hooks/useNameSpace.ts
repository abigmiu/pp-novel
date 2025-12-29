import { createContext, useContext, useMemo } from 'react'

export const defaultNamespace = 'xhs'
const statePrefix = 'is-'

// 内部 BEM 拼接函数
const _bem = (
    namespace: string,
    block: string,
    blockSuffix?: string,
    element?: string,
    modifier?: string
) => {
    let cls = `${namespace}-${block}`
    if (blockSuffix) cls += `-${blockSuffix}`
    if (element) cls += `__${element}`
    if (modifier) cls += `--${modifier}`
    return cls
}

// context，用于 namespace 继承
export const NamespaceContext = createContext<string | undefined>(defaultNamespace)

// 获取命名空间（相当于 useGetDerivedNamespace）
export const useGetDerivedNamespace = (namespaceOverride?: string) => {
    const contextNamespace = useContext(NamespaceContext)
    return useMemo(() => {
        return namespaceOverride || contextNamespace || defaultNamespace
    }, [namespaceOverride, contextNamespace])
}

// 主 hook：useNamespace
export const useNamespace = (block: string, namespaceOverride?: string) => {
    const namespace = useGetDerivedNamespace(namespaceOverride)

    const b = (blockSuffix = '') => _bem(namespace, block, blockSuffix)
    const e = (element?: string) => (element ? _bem(namespace, block, '', element) : '')
    const m = (modifier?: string) => (modifier ? _bem(namespace, block, '', '', modifier) : '')
    const be = (blockSuffix?: string, element?: string) =>
        blockSuffix && element ? _bem(namespace, block, blockSuffix, element) : ''
    const em = (element?: string, modifier?: string) =>
        element && modifier ? _bem(namespace, block, '', element, modifier) : ''
    const bm = (blockSuffix?: string, modifier?: string) =>
        blockSuffix && modifier ? _bem(namespace, block, blockSuffix, '', modifier) : ''
    const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
        blockSuffix && element && modifier ? _bem(namespace, block, blockSuffix, element, modifier) : ''

    const is = (name: string, state: boolean = true) =>
        name && state ? `${statePrefix}${name}` : ''

    // css var 工具
    const cssVar = (object: Record<string, string>) => {
        const styles: Record<string, string> = {}
        for (const key in object) {
            if (object[key]) styles[`--${namespace}-${key}`] = object[key]
        }
        return styles
    }

    const cssVarBlock = (object: Record<string, string>) => {
        const styles: Record<string, string> = {}
        for (const key in object) {
            if (object[key]) styles[`--${namespace}-${block}-${key}`] = object[key]
        }
        return styles
    }

    const cssVarName = (name: string) => `--${namespace}-${name}`
    const cssVarBlockName = (name: string) => `--${namespace}-${block}-${name}`

    return {
        namespace,
        b,
        e,
        m,
        be,
        em,
        bm,
        bem,
        is,
        cssVar,
        cssVarBlock,
        cssVarName,
        cssVarBlockName,
    }
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>
