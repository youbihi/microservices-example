import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
  const [blogposts, setBlogposts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get('http://posts.com/blogposts');

    setBlogposts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedBlogposts = Object.values(blogposts).map((blogposts) => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
        key={blogposts.id}
      >
        <div className="card-body">
          <h3>{blogposts.title}</h3>
          <CommentList comments={blogposts.comments} />
          <CommentCreate blogpostId={blogposts.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedBlogposts}
    </div>
  );
};
