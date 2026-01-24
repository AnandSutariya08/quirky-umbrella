/**
 * Timezone utility functions - Using browser's Intl API for reliable conversion
 * 
 * How it works:
 * 1. Admin sets availability in their timezone (e.g., 9 AM - 5 PM IST)
 * 2. When user views, we convert admin's times to user's timezone for display
 * 3. When user books, we convert their selected time back to admin's timezone for storage
 * 4. All conflict checks use admin's timezone (consistent storage)
 */

/**
 * Convert time from one timezone to another
 * Uses a reliable method with Intl.DateTimeFormat
 */
export function convertTimeBetweenTimezones(
  time: string,
  fromTimezone: string,
  toTimezone: string,
  date: Date = new Date()
): string {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Create a date string in ISO format
    const isoDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${time}:00`;
    
    // Create a date object (this will be interpreted as local time)
    const localDate = new Date(isoDateStr);
    
    // Get the UTC timestamp that this time represents in the source timezone
    // We do this by creating a date and adjusting for timezone offset
    const sourceFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: fromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    // Format the date in source timezone to get the actual values
    const sourceParts = sourceFormatter.formatToParts(localDate);
    const sourceYear = parseInt(sourceParts.find(p => p.type === 'year')?.value || String(year));
    const sourceMonth = parseInt(sourceParts.find(p => p.type === 'month')?.value || '1') - 1;
    const sourceDay = parseInt(sourceParts.find(p => p.type === 'day')?.value || String(day));
    const sourceHour = parseInt(sourceParts.find(p => p.type === 'hour')?.value || '0');
    const sourceMinute = parseInt(sourceParts.find(p => p.type === 'minute')?.value || '0');
    
    // Create a date object with these values
    const sourceDate = new Date(sourceYear, sourceMonth, sourceDay, sourceHour, sourceMinute);
    
    // Calculate the offset between source timezone and local
    const sourceDateStr = sourceDate.toLocaleString('en-US', { timeZone: fromTimezone });
    const localDateStr = sourceDate.toLocaleString('en-US');
    const sourceDateObj = new Date(sourceDateStr);
    const localDateObj = new Date(localDateStr);
    const offset = sourceDateObj.getTime() - localDateObj.getTime();
    
    // Create UTC equivalent
    const utcMoment = new Date(sourceDate.getTime() - offset);
    
    // Now format in target timezone
    const targetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: toTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const targetParts = targetFormatter.formatToParts(utcMoment);
    const targetHour = targetParts.find(p => p.type === 'hour')?.value.padStart(2, '0') || '00';
    const targetMinute = targetParts.find(p => p.type === 'minute')?.value.padStart(2, '0') || '00';
    
    return `${targetHour}:${targetMinute}`;
  } catch (error) {
    console.error('Error converting timezone:', error);
    // Fallback: return original time
    return time;
  }
}

/**
 * Convert user's selected time to admin timezone for storage
 * This is critical - all bookings must be stored in admin's timezone
 */
export function convertToAdminTimezone(
  date: Date,
  time: string,
  userTimezone: string,
  adminTimezone: string
): { date: Date; time: string } {
  try {
    // Normalize timezone strings (Asia/Calcutta = Asia/Kolkata)
    const normalizedUserTz = userTimezone.replace('Calcutta', 'Kolkata');
    const normalizedAdminTz = adminTimezone.replace('Calcutta', 'Kolkata');
    
    // If same timezone, return as-is (NO CONVERSION NEEDED)
    if (normalizedUserTz === normalizedAdminTz) {
      return { date: new Date(date), time };
    }
    
    // Different timezones - need to convert
    const [hours, minutes] = time.split(':').map(Number);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Create a date string in ISO format
    const isoDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    // Create a temporary date (this will be in browser's local timezone)
    const tempDate = new Date(isoDateStr);
    
    // Get what this time represents in UTC
    // Then convert that UTC moment to admin's timezone
    const utcTime = tempDate.getTime() + (tempDate.getTimezoneOffset() * 60 * 1000);
    
    // Get offset for user timezone
    const userOffsetMs = getTimezoneOffset(userTimezone) * 60 * 60 * 1000;
    
    // Get offset for admin timezone  
    const adminOffsetMs = getTimezoneOffset(adminTimezone) * 60 * 60 * 1000;
    
    // Calculate the UTC timestamp for this time in user's timezone
    const utcTimestamp = utcTime - userOffsetMs;
    
    // Convert to admin timezone
    const adminTimestamp = utcTimestamp + adminOffsetMs;
    const adminDateObj = new Date(adminTimestamp);
    
    // Format in admin timezone
    const adminParts = new Intl.DateTimeFormat('en-US', {
      timeZone: adminTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(adminDateObj);
    
    const adminYear = parseInt(adminParts.find(p => p.type === 'year')?.value || String(year));
    const adminMonth = parseInt(adminParts.find(p => p.type === 'month')?.value || '1') - 1;
    const adminDay = parseInt(adminParts.find(p => p.type === 'day')?.value || String(day));
    const adminHour = adminParts.find(p => p.type === 'hour')?.value.padStart(2, '0') || '00';
    const adminMinute = adminParts.find(p => p.type === 'minute')?.value.padStart(2, '0') || '00';
    
    return {
      date: new Date(adminYear, adminMonth, adminDay),
      time: `${adminHour}:${adminMinute}`,
    };
  } catch (error) {
    console.error('Error converting to admin timezone:', error);
    // Fallback: if conversion fails and timezones are same, return as-is
    const normalizedUserTz = userTimezone.replace('Calcutta', 'Kolkata');
    const normalizedAdminTz = adminTimezone.replace('Calcutta', 'Kolkata');
    if (normalizedUserTz === normalizedAdminTz) {
      return { date: new Date(date), time };
    }
    return { date, time };
  }
}

/**
 * Convert availability times from admin timezone to user timezone
 */
export function convertAvailabilityToUserTimezone(
  availability: { startTime: string; endTime: string },
  adminTimezone: string,
  userTimezone: string,
  date: Date
): { startTime: string; endTime: string } {
  try {
    const startTime = convertTimeBetweenTimezones(
      availability.startTime,
      adminTimezone,
      userTimezone,
      date
    );
    const endTime = convertTimeBetweenTimezones(
      availability.endTime,
      adminTimezone,
      userTimezone,
      date
    );
    
    return { startTime, endTime };
  } catch (error) {
    console.error('Error converting availability:', error);
    return availability;
  }
}

/**
 * Format time with timezone label
 */
export function formatTimeWithTimezone(time: string, timezone: string): string {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const hour = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Get timezone abbreviation
    const tzAbbr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value || timezone;
    
    return `${hour}:${String(minutes).padStart(2, '0')} ${ampm} (${tzAbbr})`;
  } catch (error) {
    return time;
  }
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffset(timezone: string): number {
  try {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone })).getTime();
    return (tzTime - utcTime) / (1000 * 60 * 60);
  } catch (error) {
    return 0;
  }
}
