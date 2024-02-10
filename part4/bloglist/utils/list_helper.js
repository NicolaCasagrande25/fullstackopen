const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (total, blog) => {
        return total + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favoriteBlog, blog) => {
        return favoriteBlog.likes > blog.likes ? favoriteBlog : blog
    }

    const favoriteBlog = blogs.length > 0 ? blogs.reduce(reducer, blogs[0]) : undefined
    
    if(favoriteBlog){
        return {
            title: favoriteBlog.title,
            author: favoriteBlog.author,
            likes: favoriteBlog.likes,
        }
    } else {
        return undefined
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}