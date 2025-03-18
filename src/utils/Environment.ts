import { auth } from '../firebaseConfig';
import eventEmitter from './eventEmitter'
import { TechieError } from './protocol'

import { invoke } from '@tauri-apps/api/core';

// const ENVIRONMENT_ENDPOINT = process.env.ENVIRONMENT_ENDPOINT ?? 'https://nwz2n4ootcbj5csth6awr6vjty0ggclp.lambda-url.us-east-1.on.aws';

class Environment {
  private static instance: Environment;
  private profile: ProfileData;

  private constructor(profile: ProfileData) {
    this.profile = profile;
  }

  public static async getInstance(): Promise<Environment> {
    if (!Environment.instance) {
      const profile = await Environment.fetchEnvironment()
      Environment.instance = new Environment(profile);
    }
    return Environment.instance;
  }

  private static async getEndpoint(): Promise<string> {
    return await invoke<string>('get_endpoint');
  }

  private static async fetchEnvironment(): Promise<ProfileData> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');
      const token = await currentUser.getIdToken();
      const endpoint = await Environment.getEndpoint();
      const response = await fetch(`${endpoint}/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error: TechieError = { type: 'error', message: 'Failed to fetch environment information', code: 'EnvironmentFetchError' };
        eventEmitter.emit('techieError', error);
        throw new Error('Failed to fetch environment information');
      }
      const profile = await response.json();
      return profile;
    } catch (error) {
      const err: TechieError = { type: 'error', message: `Failed to fetch environment information:\n${(error as Error).message}`, code: 'EnvironmentFetchError' };
      eventEmitter.emit('techieError', err);
      console.error('Error fetching environment information:', error);
      throw error;
    }
  }

  public async fetchConsumption(conversationId: string): Promise<ConsumptionData> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');
      const token = await currentUser.getIdToken();
      const endpoint = await Environment.getEndpoint();
      const response = await fetch(`${endpoint}/consumption?conversation_id=${conversationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch consumption data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      const err: TechieError = { type: 'error', message: `Failed to fetch consumption data:\n${(error as Error).message}`, code: 'ConsumptionFetchError' };
      eventEmitter.emit('techieError', err);
      throw error;
    }
  }

  public getWebSocketEndpoint(): string {
    return this.profile.ws;
  }

  public getProfileData(): ProfileData {
    return this.profile;
  }

  public setConversationId(conversationId: string): void {
    localStorage.setItem('conversationId', conversationId);
  }

  public getConversationId(): string {
    return localStorage.getItem('conversationId') ?? '';
  }
}

export default Environment;

export type ProfileData = {
  /** Websocket endpoint */
  ws: string;
  /** API endpoint for managing user plans, credits, and top-ups */
  user: string;
  /** API for handling checkout using Stripe */
  checkout: string;
}

export type ConsumptionData = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}
