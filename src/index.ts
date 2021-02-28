import {MikroORM} from "@mikro-orm/core";
import {__prod__} from "./constants";
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import 'reflect-metadata';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";


const main = async() => {
    const orm =await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const app = express()

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
    session({
        name: "qid",
        store: new RedisStore({
            client: redisClient, 
            disableTouch: true,
        }),
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax',
            secure: __prod__,
        },
        saveUninitialized: false,
        secret: 'ilovemylatestredisinstalled',
        resave: false,
    })
    )
    const appoloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req,res}): MyContext => ({em: orm.em, req,res})
    });

    appoloServer.applyMiddleware({app})
    
    app.listen(4000, ()=> {
        console.log('server started on localhost:4000')
    })
}

main().catch(err => {
    console.log(err)
})