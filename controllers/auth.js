import User from "../models/user.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken(); //short live
    const refreshToken = await user.generateRefreshToken(); //long live
    user.refreshToken = refreshToken;
    user.lastLogin=Date.now();
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
    throw ApiError(500, "Internal server error");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend

  const { username, email, password, cnf_password } = req.body;
  if ([email, username, password,cnf_password].some((field) => field?.trim() === "")) {
    throw ApiError(400, "All fields are required!");
  }
  if (password !== cnf_password) {
    throw ApiError(400, "Password is not matching!");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw ApiError(409, "User with email or username already exist!");
  }
  // console.log(req.files);
  // console.log(req.body)
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverLocalPath = req.files?.coverImage[0]?.path;
  console.log("files: ",req.files)
  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath);
  }

  if (!avatarLocalPath) throw  ApiError(400, "Avatar file is required!");
  // console.log(avatarLocalPath, coverLocalPath);
  let avatar = null;
  if (avatarLocalPath) {
    avatar = await uplaodCloudinary(avatarLocalPath);
  }

  if (!avatar) throw  ApiError(400, "Avatar file is required!");

  const user = await User.create({
    avatar: avatar?.url || "",
    email,
    password,
    username,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(ApiResponse(200, createdUser, "User registerd successfully!"));

  // validation
  // check if user already exists: username , email
  // check for images, check for avatar
  // upload them to cloudinary,avatar
  // create user object -  create entry in Database
  // remove password and refresh token field form response
  // check for user creation
  // return response

  // res.status(200).json({ message: "OK" });
});

const loginUser = asyncHandler(async (req, res) => {
  // check for username or email
  // check for password
  //based on  matching with username or email and password, user should login
  //send cookie
  const { email, username, password } = req.body;
  // console.log(temp);
  try {
    if (!email && !username) {
      throw ApiError(400, "username or email required!");
    }
    if (!password) {
      throw ApiError(400, "password required!");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      throw ApiError(404, "user does not exist!");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    // console.log(user, isValidPassword);
    // console.log(isPasswordValid);
    if (!isPasswordValid) {
      throw ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    )

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  } catch (error) {
    throw ApiError(500, error.message);
  }
});
export { registerUser, loginUser };
