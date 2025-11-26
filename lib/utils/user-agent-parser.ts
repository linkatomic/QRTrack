import { UAParser } from 'ua-parser-js';

export interface ParsedUserAgent {
  device_type: string;
  os: string;
  browser: string;
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  let device_type = 'desktop';
  if (result.device.type === 'mobile') device_type = 'mobile';
  else if (result.device.type === 'tablet') device_type = 'tablet';

  const os = result.os.name || 'Unknown';
  const browser = result.browser.name || 'Unknown';

  return {
    device_type,
    os,
    browser,
  };
}
