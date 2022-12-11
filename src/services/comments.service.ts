
import {usersRepository} from "../repositories/users.repository";
import {CommentViewModelDto} from "../controllers/dto/commentViewModel.dto";
import {CommentInputModelDto} from "../controllers/dto/commentInputModel.dto";
import {CommentEntity} from "./entities/comment.entity";
import {commentsRepository} from "../repositories/comments.repository";

const {getUserById} = usersRepository;
const {createNewUserComment, deleteUserCommentById, editComment} = commentsRepository;

export const commentsService = {
    async createUserComment({content}: CommentInputModelDto, userId: string, postId:string): Promise<CommentViewModelDto | null> {
        const createdAt = new Date().toISOString();
        const user = await getUserById(userId);
        const userLogin = user!.login;
        const newUserComment: CommentEntity = {
            userId, createdAt, content, userLogin, postId
        };
        const result = await createNewUserComment(newUserComment);
        if (result) return {
            id: result.toString(),
            content,
            userId,
            userLogin,
            createdAt
        };
        return null
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return await deleteUserCommentById(id);
    },

    async editComment (id: string, comment:CommentInputModelDto): Promise<boolean>{
        console.log(`[commentsService] comment id:${id} editing`);
        return await editComment(id, comment)
    }
};
