function extractHashtags(text) {
    return text.match(/#\w+/g) || [];
}

export default extractHashtags;