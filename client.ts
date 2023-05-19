import {JRPCClient} from '@habeetat/jrpc-client';
import axios from 'axios';

export interface DemoRpcMethods {
    hello(name?: string): Promise<string>;
}

(async () => {
    const resolver = async (url: string, data: string, resolve: (result: any) => void) => {
        console.log('Request', data);
        console.log('URL', url);
        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            throw error;
        });
    };
    const client = new JRPCClient<DemoRpcMethods>("http://127.0.0.1:3000/jrpc", resolver);
    const proxy = client.createProxy();
    const result = await proxy.hello();
    console.log(result);
    const result2 = await proxy.hello('Demo');
    console.log(result2);
})();