export const composeQuery = (params: Record<string, string | null>) => {
    if (!Object.keys(params).length) {
        return ''
    }
    return `?${Object.entries(params).filter(([_, val]) => !!val).map(([key, val]) => `${key}=${val}`).join('&')}`
}