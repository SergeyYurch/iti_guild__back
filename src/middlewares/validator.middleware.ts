import {Request, Response, NextFunction} from "express";
import {body, validationResult} from 'express-validator';
import {APIErrorResultModel} from "../controllers/dto/apiErrorResult.dto";
import {queryRepository} from "../repositories/query.repository";

export const validatorMiddleware = {
    validateCommentInputModel: () => [
        body('content')
            .exists()
            .withMessage('content is required')
            .isLength({min: 20, max: 300})
            .withMessage('content length is wrong')
    ],
    validateAuthInputModel: () => [
        body('loginOrEmail')
            .trim()
            .isLength({min: 1})
            .withMessage('name must be min 1 chars long')
            .exists()
            .withMessage('loginOrEmail is required'),
        body('password')
            .exists()
            .withMessage('password is required')
            .isLength({min: 1, max: 500})
            .withMessage('password must be min 1 chars long')
    ],
    validateUserInputModel: () => [
        body('login')
            .trim()
            .isLength({min: 3, max: 10})
            .withMessage('length of login must be 3-10 chars')
            .matches(/^[a-zA-Z0-9_-]*$/)
            .withMessage('login is wrong')
            .exists()
            .withMessage('login is required'),
        body('password')
            .isLength({min: 6, max: 20})
            .withMessage('length of password must be  6-20 chars')
            .exists()
            .withMessage('password is required'),
        body('email')
            .trim()
            .exists()
            .withMessage('email is required')
            .matches(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)
            .withMessage('email is wrong')
    ],
    validateBlogInputModel: () => [
        body('name')
            .trim()
            .isLength({min: 1, max: 15})
            .withMessage('name must be at max 10 chars long')
            .exists()
            .withMessage('name is required'),
        body('description')
            .trim()
            .exists()
            .withMessage('description is required')
            .isLength({min: 1, max: 500})
            .withMessage('length is wrong'),
        body('websiteUrl')
            .exists()
            .trim()
            .isLength({max: 100})
            .withMessage('websiteUrl must be at max 100 chars long')
            .matches(/^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
            .exists()
            .withMessage('name is required')
    ],
    validatePostInputModel: () => [
        body('title')
            .exists()
            .trim()
            .withMessage('title is required')
            .isLength({min: 1, max: 30})
            .withMessage('title must be at max 30 chars long'),
        body('shortDescription')
            .exists()
            .trim()
            .withMessage('shortDescription is required')
            .isLength({min: 1, max: 100})
            .withMessage('shortDescription must be at max 100 chars long'),
        body('content')
            .exists()
            .trim()
            .isLength({min: 1, max: 1000})
            .withMessage('content must be at max 1000 chars long'),
    ],
    validateBlogId: () => [
        body('blogId')
            .trim()
            .custom(
                async (blogId) => {
                    console.log(blogId);
                    const blog = await queryRepository.getBlogById(blogId);
                    if (!blog) throw new Error();
                }
            )
            .exists()
            .withMessage('blogId is required')
    ],
    validateResult: (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        const errorMessages: APIErrorResultModel = {
            errorsMessages: result.array({onlyFirstError: true}).map(e => ({
                message: e.msg,
                field: e.param
            }))
        };
        if (!result.isEmpty()) return res.status(400).json(errorMessages);
        return next();
    }
};