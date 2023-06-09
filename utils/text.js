function toTitleCase(str) {
    return str
        .toLowerCase()
        .replace(
            /(^\w{1})|(\s+\w{1})/g,
            letter => letter.toUpperCase()
        )
}

export { toTitleCase }