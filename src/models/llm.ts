export interface LLMMessage {
  id: number
  message: string
  role: 'user' | 'assistant' | 'system'
}
