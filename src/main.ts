import { createAuthLink, AuthOptions } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { ApolloClient, InMemoryCache, ApolloLink, gql } from '@apollo/client/core';
import { autoId } from './utils';
import moment from 'moment';
import fetch from 'node-fetch';
import ws from 'ws';
import readline from 'readline';
import appSyncConfig from './aws-exports';

global['fetch'] = fetch;
global['WebSocket'] = ws;

type Post = {
	id: string
	content: string
	send_at: string
}

const url = appSyncConfig.aws_appsync_graphqlEndpoint;
const region = appSyncConfig.aws_appsync_region;
const auth: AuthOptions = {
  type: 'API_KEY',
  apiKey: appSyncConfig.aws_appsync_apiKey
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth })
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const rl = readline.createInterface(process.stdin, process.stdout);

const console_out = msg => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}

const subscription = client.subscribe<{ onAddPost: Post}>({
  query: gql`
  subscription MySubscription {
    onAddPost {
      id
      content
      send_at
    }
  }
`})
.subscribe(x => {
  if (x.data?.onAddPost != null) {
    const p = x.data?.onAddPost;
    console_out(`${p.send_at}：${p.content}`);
  }
});

const readLinePromise = () => new Promise<string>(r => {
  rl.question("comment?(\\q to exit) > ", async (comment) => {
    rl.prompt(true);
    r(comment);
  });
})

setTimeout(async () => {
  while (true) {
    const comment = await readLinePromise();
    if (comment === '\\q') {
      subscription?.unsubscribe();
      process.exit(0);
    }

    await client.mutate({
      mutation: gql`
        mutation MyMutation {
          addPost(id: "${autoId()}", content: "${comment}", send_at: "${moment().toISOString()}") {
            id,
            content,
            send_at
          }
        }
      `,
    })
  }

}, 100)
