import { NextFunction, Request, Response } from "express";
import { CowService } from "./cow.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { ICow } from "./cow.interface";

const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;
  // console.log(cowData);
  const result = await CowService.createCow(cowData);
  sendResponse<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "cow created successfully!",
    data: result,
  });
});
const getAllCow = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const filters = pick(req.query, ["searchTerm"]);
    const paginationOptions = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await CowService.getAllCow(paginationOptions);
    sendResponse<ICow[]>(res, {
      statusCode: 200,
      success: true,
      message: "Cow retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "Single Cow retrieved successfully!",
    data: result,
  });
});
const updateCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await CowService.updateCow(id, updateData);

  sendResponse<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "Updated Cow  successfully!",
    data: result,
  });
});
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CowService.deleteCow(id);

  sendResponse<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "Deleted Cow  successfully!",
    data: result,
  });
});
export const CowController = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
