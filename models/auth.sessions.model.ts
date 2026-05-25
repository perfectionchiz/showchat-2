export interface DeviceInfo {
  id: string;
  session_id: string;
  device_name: string;
  device_type: string;
  is_current: boolean;
  created_at: string;
  last_active: string;
  ip_address: string | null;
  location: string | null;
}

export interface AuthSessionData {
  success: boolean;
  status: number;
  message: string;
  current_device: DeviceInfo;
  other_devices: DeviceInfo[] | [];
}
