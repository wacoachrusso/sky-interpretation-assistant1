import { createClient } from '@supabase/supabase-js'
import { isRetryableError } from '@/lib/errors'

const SUPABASE_URL = "https://xnlzqsoujwsffoxhhybk.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHpxc291andzZmZveGhoeWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODA1ODUsImV4cCI6MjA1MDA1NjU4NX0.G-N5b6L3-208ox8jRHPj8NDyQAg8xIDST3r8v8Tlae8"

interface QueryOptions {
  query?: string
  filter?: Record<string, any>
  order?: Array<{ column: string; ascending?: boolean }>
}

interface SupabaseResponse<T> {
  data: T | null
  error: any
}

class SupabaseClient {
  private client = createClient(SUPABASE_URL, SUPABASE_KEY)

  private async query<T>(operation: () => Promise<SupabaseResponse<T>>): Promise<T> {
    const { data, error } = await operation()
    if (error) throw error
    if (!data) throw new Error('No data returned')
    return data
  }

  async select<T>(table: string, options: QueryOptions = {}) {
    let query = this.client.from(table).select(options.query || '*')

    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options.order) {
      options.order.forEach(({ column, ascending = true }) => {
        query = query.order(column, { ascending })
      })
    }

    return this.query<T>(() => query)
  }

  async insert<T>(table: string, data: any) {
    return this.query<T>(() => 
      this.client.from(table).insert(data).select().single()
    )
  }

  async update<T>(table: string, data: any, match: Record<string, any>) {
    let query = this.client.from(table).update(data)
    Object.entries(match).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    return this.query<T>(() => query.select())
  }

  async delete(table: string, match: Record<string, any>) {
    let query = this.client.from(table).delete()
    Object.entries(match).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    return this.query(() => query)
  }

  async deleteAll(table: string, userId: string) {
    return this.delete(table, { user_id: userId })
  }

  get auth() {
    return this.client.auth
  }

  get functions() {
    return this.client.functions
  }
}

export const supabase = new SupabaseClient()