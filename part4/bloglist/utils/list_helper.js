const blog = require("../models/blog")

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

    if (favoriteBlog) {
        return {
            title: favoriteBlog.title,
            author: favoriteBlog.author,
            likes: favoriteBlog.likes,
        }
    } else {
        return undefined
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const blogsPerAuthorReducer = (blogsPerAuthorCounter, blog) => {
        blogsPerAuthorCounter[blog.author] = (blogsPerAuthorCounter[blog.author] || 0) + 1
        return blogsPerAuthorCounter
    }

    const blogsPerAuthor = blogs.reduce(blogsPerAuthorReducer, {})

    return Object.entries(blogsPerAuthor).reduce((authorWithMostBlogs, [author, blogs]) => {
        return authorWithMostBlogs.blogs > blogs ? authorWithMostBlogs : { author: author, blogs: blogs }
    }, { author: '', blogs: 0 })
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const likesPerAuthorReducer = (likesPerAuthorCounter, blog) => {
        likesPerAuthorCounter[blog.author] = (likesPerAuthorCounter[blog.author] || 0) + blog.likes
        return likesPerAuthorCounter
    }

    const likesPerAuthor = blogs.reduce(likesPerAuthorReducer, {})

    return Object.entries(likesPerAuthor).reduce((authorWithMostLikes, [author, likes]) => {
        return authorWithMostLikes.likes > likes ? authorWithMostLikes : { author: author, likes: likes }
    }, { author: '', likes: 0 })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}