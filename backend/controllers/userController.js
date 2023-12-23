import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import asyncHandler from '../middlewares/asyncHandler.js';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {
  const { username, id, password } = req.body;
  if (!username || !id || !password) {
    throw new Error('Please fill all inputs');
  }

  const userExists = await User.findOne({ id });
  if (userExists) {
    return res.status(400).send('User already exists!'); // Add 'return' here
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, id, password: hashedPassword });

  try {
    await newUser.save();
    // createToken(res, newUser._id);

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      srn: newUser.id,
      isAdmin: newUser.isAdmin,
      isTeacher: newUser.isTeacher,
    });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  console.log('login');
  const { username, id, password } = req.body;
  const existingUser = await User.findOne({ id });

  if (!username || !id || !password) {
    throw new Error('Please fill all inputs');
  }
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log(isPasswordValid);

    if (isPasswordValid) {
      createToken(res, existingUser._id);
      console.log(existingUser);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        id: existingUser.id,
        isAdmin: existingUser.isAdmin,
        isTeacher: existingUser.isTeacher,
      });
    } else {
      throw new Error('Please enter valid credentials');
    }
  } else {
    throw new Error('User not exists');
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'logout successfully' });
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getAllStudent = asyncHandler(async (req, res) => {
  const students = await User.find({ isTeacher: false, isAdmin: false });
  res.status(200).json(students);
});

export { createUser, loginUser, logoutCurrentUser, getAllUser, getAllStudent };
