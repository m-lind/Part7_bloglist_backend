const dummy = blogs => {
  return 1;
};

const totalLikes = list => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return list.length === 0 ? 0 : list.reduce(reducer, 0);
};

const favoriteBlog = list => {
  const reducer = (max, item) => {
    return max.likes > item.likes
      ? (({ title, author, likes }) => ({ title, author, likes }))(max)
      : (({ title, author, likes }) => ({ title, author, likes }))(item);
  };

  return list.length === 0 ? {} : list.reduce(reducer, {});
};

const mostBlogs = list => {
  const authorList = [];
  list.map(item => {
    const authorExistsIndex = authorList.findIndex(
      name => name.author === item.author
    );

    if (authorExistsIndex !== -1) {
      authorList[authorExistsIndex].blogs += 1;
    } else {
      authorList.push({ author: item.author, blogs: 1 });
    }
  });

  const blogsReducer = (max, item) => {
    return max.blogs > item.blogs ? max : item;
  };

  return list.length === 0 ? {} : authorList.reduce(blogsReducer, {});
};

const mostLikes = list => {
  const authorList = [];
  list.map(item => {
    const authorExistsIndex = authorList.findIndex(
      name => name.author === item.author
    );

    if (authorExistsIndex !== -1) {
      authorList[authorExistsIndex].blogs += 1;
      authorList[authorExistsIndex].likes += item.likes;
    } else {
      authorList.push({ author: item.author, blogs: 1, likes: item.likes });
    }
  });
  const blogsReducer = (max, item) => {
    return max.likes > item.likes
      ? (({ author, likes }) => ({ author, likes }))(max)
      : (({ author, likes }) => ({ author, likes }))(item);
  };

  return list.length === 0 ? {} : authorList.reduce(blogsReducer, {});
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
