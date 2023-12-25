import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import asyncHandler from '../middlewares/asyncHandler.js';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {
  const { username, id, password, isTeacher, isAdmin } = req.body;
  if (!username || !id || !password || !isTeacher) {
    throw new Error('Please fill all inputs');
  }

  const userExists = await User.findOne({ id });
  if (userExists) {
    return res.status(400).send('User already exists!'); // Add 'return' here
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    id,
    password: hashedPassword,
    isAdmin,
    isTeacher,
  });

  try {
    await newUser.save();
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
  const users = await User.find({}).select('-password');
  res.json(users);
});

const getAllStudent = asyncHandler(async (req, res) => {
  const students = await User.find({ isTeacher: false, isAdmin: false }).select(
    '-password'
  );
  res.status(200).json(students);
});
const editStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, srn, password } = req.body;

  if (!username || !srn) {
    throw new Error('Please provide proper details');
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error('User not found');
  }
  user.username = username;
  user.id = srn;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  await user.save();

  res.status(200).json({
    message: 'User updated successfully',
  });
});
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error('User not found');
  }
  await user.deleteOne();

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

const getAllTeacher = asyncHandler(async (req, res) => {
  const teachers = await User.find({ isTeacher: true, isAdmin: false }).select(
    '-password'
  );
  res.status(200).json(teachers);
});
const editTeacher = asyncHandler(async (req, res) => {
  const { UId } = req.params;
  console.log(UId);
  const { username, id, password } = req.body; //Tid refers to tacher's id
  console.log(username + '' + id);

  if (!username || !id) {
    throw new Error('Please provide proper details');
  }
  const user = await User.findOne({ _id: UId });
  if (!user) {
    throw new Error('User not found');
  }
  user.username = username;
  user.id = id;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  await user.save();

  res.status(200).json({
    message: 'User updated successfully',
  });
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { UId } = req.params;
  const user = await User.findOne({ _id: UId });
  if (!user) {
    throw new Error('User not found');
  }
  await user.deleteOne();

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUser,
  getAllStudent,
  editStudent,
  deleteStudent,
  getAllTeacher,
  editTeacher,
  deleteTeacher,
};
