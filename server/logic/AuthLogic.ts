import { UserType, UserModel, Role, User } from '../models/UserModel';
import ms from 'ms';
import jwt, { Algorithm } from 'jsonwebtoken';
import {
  RefreshTokenType,
  RefreshTokenModel,
} from '../models/RefreshTokenModel';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { ResponseError } from '../config/express';

// These should be in .env
// secret (generated using `openssl rand -base64 48` from console)
const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm: Algorithm = process.env.JWT_ALGORITHM as Algorithm;
const jwtExpiresIn = ms(process.env.JWT_EXPIRATION);
const refreshTokenExpiration = ms(process.env.REFRESH_TOKEN_EXPIRATION);

export const register = async (
  body: Partial<User> & { password: string },
  req: Request,
  res: Response
) => {
  const password: string = body.password;
  let newUser: UserType = new UserModel(body);
  if (req.user?.role !== Role.OWNER) {
    newUser.location_can_edit = [];
    newUser.resource_can_edit = [];
    newUser.cat_can_edit_members = [];
    newUser.role = Role.EDITOR;
  }

  newUser = await UserModel.register(newUser, password);
  const jwtToken = generateJwtToken(newUser);
  const refreshToken = generateRefreshToken(newUser, req.ip);
  await refreshToken.save();
  // If not already logged on
  if (!req.user) {
    setRefreshTokenCookie(res, refreshToken);
  }
  return { user: newUser, token: jwtToken, refreshToken: refreshToken.token };
};

export const login = async (
  email: string,
  password: string,
  req: Request,
  res: Response
) => {
  const {
    user,
    error,
  }: { user: UserType; error: Error } = await UserModel.authenticate()(
    email,
    password
  );
  if (error) {
    throw error;
  }
  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, req.ip);
  await refreshToken.save();
  setRefreshTokenCookie(res, refreshToken);
  return {
    user: user,
    token: jwtToken,
    refreshToken: refreshToken.token,
  };
};

export const refreshToken = async (
  refreshToken: string,
  req: Request,
  res: Response
) => {
  if (!refreshToken) throw new ResponseError('Token is required', 400);

  const oldRefreshToken = await RefreshTokenModel.findOne({
    token: refreshToken,
  }).populate('user');

  if (!oldRefreshToken?.is_active) {
    throw new ResponseError('Refresh token is revoked', 401);
  }

  const ipAddress = req.ip;
  const newRefreshToken = generateRefreshToken(
    oldRefreshToken.user as UserType,
    ipAddress
  );
  oldRefreshToken.revoked = new Date(Date.now());
  oldRefreshToken.revoked_by_ip = ipAddress;
  oldRefreshToken.replaced_by_token = newRefreshToken.token;
  await oldRefreshToken.save();
  await newRefreshToken.save();
  // generate new jwt
  const jwtToken = generateJwtToken(newRefreshToken.user as UserType);

  setRefreshTokenCookie(res, newRefreshToken);

  return {
    user: newRefreshToken.user as UserType,
    token: jwtToken,
    refreshToken: newRefreshToken,
  };
};

export const revokeTokens = async (id: string, req: Request, res: Response) => {
  if (req.user?.id !== id && req.user?.role !== Role.OWNER)
    throw new ResponseError('Unauthorized', 401);

  const refreshTokens = await RefreshTokenModel.find({ user: id });
  refreshTokens.forEach(async (refreshToken) => {
    if (refreshToken.is_active) {
      refreshToken.revoked = new Date(Date.now());
      refreshToken.revoked_by_ip = req.ip;
      await refreshToken.save();
    }
  });
};

export const revokeToken = async (
  refreshToken: string,
  req: Request,
  res: Response
) => {
  if (!refreshToken) throw new ResponseError('Token is required', 400);

  const refreshTokenDoc = await RefreshTokenModel.findOne({
    token: refreshToken,
  }).populate('user');

  if (!refreshTokenDoc?.is_active) {
    throw new ResponseError('Refresh token already revoked', 401);
  }

  // users can revoke their own tokens and admins can revoke any tokens
  if (
    (refreshTokenDoc.user as UserType)?.id !== req.user?.id &&
    req.user?.role !== Role.OWNER
  ) {
    throw new ResponseError('Unauthorized', 401);
  }

  refreshTokenDoc.revoked = new Date(Date.now());
  refreshTokenDoc.revoked_by_ip = req.ip;
  await refreshTokenDoc.save();
};

export const generateJwtToken = (user: UserType): string => {
  // Create a signed token
  return jwt.sign(
    // payload
    {
      id: user.id.toString(),
    },
    // secret
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user.id.toString(),
    }
  );
};

export const generateRefreshToken = (
  user: UserType,
  ipAddress
): RefreshTokenType => {
  const expiryDate = new Date(Date.now() + refreshTokenExpiration);
  return new RefreshTokenModel({
    user: user.id,
    token: randomTokenString(),
    expires: expiryDate,
    createdByIp: ipAddress,
  });
};

export const randomTokenString = (): string => {
  return crypto.randomBytes(128).toString('base64');
};

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: RefreshTokenType
) => {
  // create http only cookie with refresh token that expires
  const cookieOptions = {
    httpOnly: true,
    expires: refreshToken.expires,
  };
  res.cookie('refreshToken', refreshToken.token, cookieOptions);
};
