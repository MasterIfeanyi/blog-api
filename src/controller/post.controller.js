import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../auth/auth.js'
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { refreshSecretKey } from '../auth/config.js';
import { signUpSchema, signInSchema } from '../validators/authValidators.js';
import { setRefreshToken, setAccessToken, removeAccessToken, removeRefreshToken } from '../utils/authCookies.js';
import axios from 'axios'
import slugify from 'slugify';
import {Post} from '../models/post.model.js';



export const createPost = async (req, res) => {
  try {
    const { title, content, status, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const baseSlug = slugify(title, { lower: true, strict: true });

    let slug = baseSlug;
    let count = 1;

    while (await Post.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const post = await Post.create({
      title,
      slug,
      content,
      tags,
      status: status || 'draft',
      author: req.user._id
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post' });
  }
};
