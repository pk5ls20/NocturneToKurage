import { client } from '@/client/client';
import { reactive, Reactive, UnwrapRef } from 'vue';

class clientManager {
  clients = reactive<client[]>([]) as Reactive<client[]>;

  public addClient(client: client): void {
    this.clients.push(client as unknown as UnwrapRef<client>);
  }

  public getClients(): Reactive<client[]> {
    return this.clients;
  }
}

export const ClientManager = new clientManager();
