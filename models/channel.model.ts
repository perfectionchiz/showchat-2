export interface LiveProgram {
  program_id: string;
  title: string;
  end_time: string;
  vibe: string | null;
}

export interface Channel {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  is_live: boolean;
  live_program: LiveProgram | null;
  subtitle: string;
  upcoming_count: number;
}
export interface ChannelsResponse {
  channels: Channel[];
}
