import gql from 'graphql-tag'
import apolloClient from '~/api/graphql'

export function questionById(params: any) {
  return apolloClient.query({
    query: gql`query ($id: ID) {
    questionById(id: $id) {
         id
         title
         content
         userId
    }
 }`,
    variables: params,
  })
}
