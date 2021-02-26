import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import {Resolver, Ctx, Arg, Mutation, InputType, Field, ObjectType} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2"

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse{
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
     @Arg("options") options: UsernamePasswordInput,
     @Ctx() {em}: MyContext  
    ):Promise<UserResponse>{
        if(options.username.length <= 2){
            return {
                errors: [{
                    field: 'username',
                    message: "length must be greater than 2"
                }]
            }
        }
        if(options.password.length <= 6){
            return {
                errors: [{
                    field: 'password',
                    message: "length must be greater than 6"
                }]
            }
        }
      const hashedPassword = await argon2.hash(options.password)  
        const user = await em.create(User,{
            username: options.username,
            password: hashedPassword,
        })
       try{
        await em.persistAndFlush(user) 
       } catch(err) {
           if(err.code === "23505" || err.detail.includes("already exist")){
               return {
                   errors: [
                       {
                           field: "username",
                           message: "username already taken"
                       }
                   ]
               }
           }
           return err.message
       }
        return {
            user
        }
    }

    @Mutation(() => UserResponse)
    async login(
     @Arg("options") options: UsernamePasswordInput,
     @Ctx() {em}: MyContext  
    ): Promise<UserResponse>{
        const user = await em.findOne(User, {username: options.username.toLowerCase()})
        if(!user){
            return {
                 errors: [
                     {
                         field: "username",
                         message: "username does not exist"
                     }
                 ]
            }
        }
        const valid = await argon2.verify(user.password, options.password)
        if(!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password"
                    } 
                ]
            }
        }
        return {
            user,
        }
    }

}