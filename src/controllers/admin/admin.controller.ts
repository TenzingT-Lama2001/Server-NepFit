// import { Request, Response } from "express";

// export async function login(req: Request, res: Response) {
//   const token = await adminAuthService.login(req.body);
//   res
//     .status(200)
//     .cookie("token", token, authConfig.admin.cookieOptions)
//     .json({ token });
// }

// export async function logout(req: Request, res: Response) {
//   res.cookie("token", "none", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     message: "Logout successfull",
//   });
// }
