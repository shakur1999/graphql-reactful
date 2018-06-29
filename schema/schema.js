// import { type } from "os";
// import { GraphQLNonNull } from "../../../Library/Caches/typescript/2.6/node_modules/@types/graphql/type/definition";

const graphql = require("graphql");
const axios = require("axios");
// const _ = require("lodash");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// const users = [
//     { id: "23", firstname: "Bill", age: 20},
//     { id: "47", firstname: "Samantha", age: 30}
// ];


const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString},
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data);
            }
        }
    })
}); 

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id:{ type:GraphQLString} ,
        firstname: { type:GraphQLString } ,
        age: { type:GraphQLInt },
        company: { 
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://local:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data);
            }
        } 
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // return _.find(users, { id: args.id });
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
            }
            },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data);
                }
            }
        }
})

const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstname: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull (GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, { firstname, age }) {
                return axios.post('http://localhost:3000/usrs', { firstname, age })
                    .then(resp => resp.data);
            }
        }
    }
})

const newLocal = module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
}); 

