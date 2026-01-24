# Timezone Handling in Booking System

## How It Works

### **Scenario: User in US, Admin in India**

**Example:**
- **Admin (India)**: Sets availability as 9:00 AM - 5:00 PM IST (Indian Standard Time)
- **User (US)**: Views the booking page in their timezone (e.g., EST - Eastern Standard Time)

### **Step-by-Step Flow:**

1. **Admin Sets Availability:**
   - Admin sets: Monday-Friday, 9:00 AM - 5:00 PM
   - This is stored in **admin's timezone** (e.g., `Asia/Kolkata`)

2. **User Views Available Times:**
   - System detects user's timezone (e.g., `America/New_York`)
   - Converts admin's availability (9 AM - 5 PM IST) to user's timezone
   - **9:00 AM IST = 11:30 PM EST (previous day)** or **9:00 AM IST = 10:30 PM EST** depending on DST
   - User sees times in **their local timezone**

3. **User Selects a Time:**
   - User selects: "2:00 PM" (in their timezone - EST)
   - System converts this to admin's timezone before storing
   - **2:00 PM EST = 12:30 AM IST (next day)** or **2:00 PM EST = 11:30 PM IST** depending on DST
   - Booking is stored in **admin's timezone** for consistency

4. **Admin Views Booking:**
   - Admin sees: "12:30 AM IST" (or "11:30 PM IST")
   - Also shows: "User's timezone: America/New_York" for reference

### **Key Points:**

✅ **Availability is always in admin's timezone** (stored in settings)
✅ **Display converts to user's timezone** (for user experience)
✅ **Bookings are stored in admin's timezone** (for consistency)
✅ **User's timezone is also stored** (for reference)

### **Conflict Prevention:**

- All conflict checks happen in **admin's timezone**
- Prevents double bookings regardless of user's location
- Works correctly even if multiple users book from different timezones

### **Example Timeline:**

**Admin in India (IST - UTC+5:30):**
- Sets: 9:00 AM - 5:00 PM IST
- This is: 3:30 AM - 11:30 AM UTC

**User in US (EST - UTC-5, or EDT - UTC-4):**
- Sees: 10:30 PM - 6:30 AM EST (previous day/next day)
- Or: 9:30 PM - 5:30 AM EDT (previous day/next day)

**When User Books:**
- User selects: "11:00 PM EST"
- System converts: "9:30 AM IST" (next day)
- Stored as: Date + "09:30" in IST

### **Benefits:**

1. ✅ **No Conflicts**: All bookings stored in one timezone
2. ✅ **User-Friendly**: Users see times in their timezone
3. ✅ **Admin-Friendly**: Admin sees times in their timezone
4. ✅ **Accurate**: Proper timezone conversion prevents errors
5. ✅ **Scalable**: Works with users from any timezone

### **Technical Implementation:**

- Uses browser's `Intl.DateTimeFormat` API for conversions
- Stores timezone strings (e.g., "Asia/Kolkata", "America/New_York")
- Handles Daylight Saving Time (DST) automatically
- Converts at display time, stores in admin timezone

### **Admin Settings:**

Admin can set their timezone in booking settings:
- Default: Auto-detected from browser
- Can be changed to any timezone
- All availability times are relative to this timezone

---

**This ensures perfect timezone handling regardless of where users and admin are located!** 🌍
