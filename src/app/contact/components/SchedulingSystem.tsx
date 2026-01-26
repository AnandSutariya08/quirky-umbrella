'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { bookingsService } from '@/lib/bookings';
import { convertAvailabilityToUserTimezone, convertToAdminTimezone } from '@/lib/timezone';
import type { MeetingType, MeetingTypeOption, Booking, BookingSettings } from '@/types/booking';

export const meetingTypes: MeetingTypeOption[] = [
  {
    id: 'discovery',
    name: 'Free Discovery Call',
    duration: 15,
    description: 'A quick 15-minute call to discuss your needs and see how we can help.',
  },
  {
    id: 'strategy',
    name: 'Growth Strategy Session',
    duration: 30,
    description: 'A comprehensive 30-minute session to dive deep into your growth strategy.',
  },
  {
    id: 'consultation',
    name: 'Service Consultation',
    duration: 30,
    description: 'A 30-minute consultation to explore our services and find the best fit for you.',
  },
];

export default function SchedulingSystem() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [formData, setFormData] = useState({
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
    companyName: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Detect user timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);
    loadSettings();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedMeetingType) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedMeetingType, bookings]);

  const loadSettings = async () => {
    try {
      let s = await bookingsService.getSettings();

      // Initialize default availability if none exists
      if (s && (!s.availability || s.availability.length === 0)) {
        const defaultAvailability = [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Monday
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Tuesday
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Wednesday
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Thursday
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Friday
        ];

        await bookingsService.updateSettings({
          availability: defaultAvailability,
          workingDays: [1, 2, 3, 4, 5],
          slotDuration: 30,
          bufferTime: 15,
          advanceBookingDays: 30,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        s = await bookingsService.getSettings();
      }

      setSettings(s);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedMeetingType) return;

    try {
      // Get bookings for selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dateBookings = await bookingsService.getByDateRange(startOfDay, endOfDay);
      setBookings(dateBookings);

      // Generate available time slots
      const slots = generateTimeSlots(selectedDate, dateBookings);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
    }
  };

  const generateTimeSlots = (date: Date, existingBookings: Booking[]): string[] => {
    if (!settings) return [];

    const slots: string[] = [];
    const slotDuration = settings.slotDuration || 30;
    const bufferTime = settings.bufferTime || 15;
    const workingDays = settings.workingDays || [1, 2, 3, 4, 5];
    const dayOfWeek = date.getDay();
    const adminTimezone = settings.timezone || 'Asia/Kolkata';

    // Check if it's a working day
    if (!workingDays.includes(dayOfWeek)) {
      return [];
    }

    // Get availability for this day
    const dayAvailability = settings.availability?.find((a) => a.dayOfWeek === dayOfWeek);
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return [];
    }

    // Check if user and admin are in the same timezone
    const isSameTimezone = adminTimezone === userTimezone;

    // Convert availability from admin timezone to user timezone (only if different)
    let availabilityStartTime = dayAvailability.startTime;
    let availabilityEndTime = dayAvailability.endTime;

    if (!isSameTimezone) {
      const userAvailability = convertAvailabilityToUserTimezone(
        { startTime: dayAvailability.startTime, endTime: dayAvailability.endTime },
        adminTimezone,
        userTimezone,
        date
      );
      availabilityStartTime = userAvailability.startTime;
      availabilityEndTime = userAvailability.endTime;
    }

    // Parse start and end times
    const [startHour, startMin] = availabilityStartTime.split(':').map(Number);
    const [endHour, endMin] = availabilityEndTime.split(':').map(Number);

    const startTime = new Date(date);
    startTime.setHours(startHour, startMin, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(endHour, endMin, 0, 0);

    // Get booked times - convert to user timezone for comparison (only if different timezone)
    // Only count confirmed bookings - cancelled/completed bookings don't block slots
    const bookedTimes = existingBookings
      .filter((b) => {
        // Only include bookings for the same date
        if (!b.scheduledDate) return false;
        const bookingDate = new Date(b.scheduledDate);
        return (
          bookingDate.getFullYear() === date.getFullYear() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getDate() === date.getDate() &&
          b.status === 'confirmed' // Only confirmed bookings block slots
        );
      })
      .map((b) => {
        if (isSameTimezone) {
          // Same timezone - use stored time directly
          return b.scheduledTime;
        } else {
          // Different timezone - convert
          const bookedDate = b.scheduledDate || new Date();
          const bookedTimeInUserTz = convertAvailabilityToUserTimezone(
            { startTime: b.scheduledTime, endTime: b.scheduledTime },
            adminTimezone,
            userTimezone,
            bookedDate
          );
          return bookedTimeInUserTz.startTime;
        }
      });

    // Generate slots
    const current = new Date(startTime);
    while (current < endTime) {
      const timeString = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;

      // Check if slot is available (not booked)
      if (!bookedTimes.includes(timeString)) {
        // Check if we have enough time before end time
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        if (slotEnd <= endTime) {
          slots.push(timeString);
        }
      }

      // Move to next slot (with buffer)
      current.setMinutes(current.getMinutes() + slotDuration + bufferTime);
    }

    return slots;
  };

  const getNextAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    const maxDays = settings?.advanceBookingDays || 30;
    const workingDays = settings?.workingDays || [1, 2, 3, 4, 5];

    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (
      dates.length < 14 &&
      currentDate <= new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000)
    ) {
      const dayOfWeek = currentDate.getDay();
      if (workingDays.includes(dayOfWeek)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleMeetingTypeSelect = (type: MeetingType) => {
    setSelectedMeetingType(type);
    setCurrentStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setCurrentStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(4);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.attendeeName.trim()) {
      newErrors.attendeeName = 'Name is required';
    }
    if (!formData.attendeeEmail.trim()) {
      newErrors.attendeeEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.attendeeEmail)) {
      newErrors.attendeeEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedMeetingType || !selectedDate || !selectedTime) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!settings) {
        setErrors({ submit: 'Settings not loaded. Please refresh the page.' });
        setIsSubmitting(false);
        return;
      }

      // Convert user's selected time to admin's timezone for storage (only if different timezone)
      const adminTimezone = settings.timezone || 'Asia/Kolkata';
      // Normalize timezone strings (Asia/Calcutta and Asia/Kolkata are the same)
      const normalizedUserTz = userTimezone.replace('Calcutta', 'Kolkata');
      const normalizedAdminTz = adminTimezone.replace('Calcutta', 'Kolkata');
      const isSameTimezone = normalizedUserTz === normalizedAdminTz;

      let adminDate: Date;
      let adminTime: string;

      if (isSameTimezone) {
        // Same timezone - use selected time directly, no conversion needed
        adminDate = new Date(selectedDate!);
        adminTime = selectedTime!; // Store exactly as user selected
      } else {
        // Different timezone - convert
        const converted = convertToAdminTimezone(
          selectedDate!,
          selectedTime!,
          userTimezone,
          adminTimezone
        );
        adminDate = converted.date;
        adminTime = converted.time;
      }

      // Double-check for conflicts (using admin timezone)
      const conflicts = await bookingsService.checkConflict(
        adminDate,
        adminTime,
        selectedMeetingType
      );

      if (conflicts.length > 0) {
        setErrors({ submit: 'This time slot was just booked. Please select another time.' });
        setIsSubmitting(false);
        await loadAvailableSlots(); // Refresh slots
        return;
      }

      // Store booking in admin's timezone (for consistency)
      await bookingsService.create({
        meetingType: selectedMeetingType,
        attendeeName: formData.attendeeName,
        attendeeEmail: formData.attendeeEmail,
        attendeePhone: formData.attendeePhone || undefined,
        companyName: formData.companyName || undefined,
        message: formData.message || undefined,
        scheduledDate: adminDate, // Store in admin timezone
        scheduledTime: adminTime, // Store in admin timezone
        timezone: userTimezone, // Store user's timezone for reference
        status: 'confirmed',
      });

      setSubmitted(true);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setErrors({ submit: error.message || 'Failed to create booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedMeeting = meetingTypes.find((m) => m.id === selectedMeetingType);

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl shadow-warm-xl border border-border p-8 lg:p-12 text-center animate-fade-in w-full max-w-full overflow-hidden">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6 animate-scale-in relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
          <Icon name="CheckCircleIcon" size={56} className="text-primary relative z-10" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent break-words">
          Booking Confirmed! 🎉
        </h3>
        <p className="text-muted-foreground mb-8 break-words">
          Your meeting has been successfully scheduled
        </p>

        <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-primary/20 w-full">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="CalendarIcon" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Meeting Type</p>
                <p className="text-foreground font-semibold">{selectedMeeting?.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="ClockIcon" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="text-foreground font-semibold">
                  {selectedDate && formatDate(selectedDate)} at{' '}
                  {selectedTime && formatTime(selectedTime)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">({userTimezone})</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="ClockIcon" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-foreground font-semibold">{selectedMeeting?.duration} minutes</p>
              </div>
            </div>
          </div>

          {settings && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <Icon name="InformationCircleIcon" size={14} className="inline mr-1" />
                Time shown in your timezone. Meeting scheduled in{' '}
                {settings.timezone || 'admin timezone'}.
              </p>
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6 max-w-md mx-auto w-full">
          <p className="text-sm text-foreground break-words">
            <Icon name="EnvelopeIcon" size={16} className="inline mr-2 text-primary" />
            Confirmation email sent to{' '}
            <span className="font-semibold break-all">{formData.attendeeEmail}</span>
          </p>
        </div>

        <p className="text-muted-foreground mb-6 break-words px-4">
          We look forward to speaking with you! See you soon. 👋
        </p>

        <button
          onClick={() => {
            setSubmitted(false);
            setCurrentStep(1);
            setSelectedMeetingType(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setFormData({
              attendeeName: '',
              attendeeEmail: '',
              attendeePhone: '',
              companyName: '',
              message: '',
            });
            setErrors({});
          }}
          className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:shadow-warm-xl hover:-translate-y-1 press-scale flex items-center gap-2 mx-auto w-full max-w-xs"
        >
          <Icon name="PlusCircleIcon" size={20} />
          <span className="whitespace-nowrap">Book Another Meeting</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-warm-xl border border-border p-8 lg:p-10 relative overflow-hidden w-full max-w-full">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-full">
        {/* Progress Indicator */}
        <div className="mb-10 w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Step {currentStep} of 4
              </span>
              <h2 className="text-lg font-bold text-foreground mt-1">
                {currentStep === 1 && 'Choose Your Meeting'}
                {currentStep === 2 && 'Pick a Date'}
                {currentStep === 3 && 'Select Time'}
                {currentStep === 4 && 'Complete Booking'}
              </h2>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step <= currentStep ? 'bg-primary w-8' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary via-secondary to-accent h-full rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Select Meeting Type */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Icon name="VideoCameraIcon" size={18} className="text-primary" />
                <span className="text-sm font-medium text-primary">Select Meeting Type</span>
              </div>
              <p className="text-muted-foreground">
                Choose the type of meeting that best fits your needs
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {meetingTypes.map((type, index) => (
                <button
                  key={type.id}
                  onClick={() => handleMeetingTypeSelect(type.id)}
                  className="group relative p-6 bg-gradient-to-br from-background to-muted/30 border-2 border-border rounded-2xl hover:border-primary hover:shadow-warm-xl transition-all duration-300 text-left overflow-hidden transform hover:-translate-y-1 w-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                      <Icon
                        name="CalendarIcon"
                        size={24}
                        className="text-primary group-hover:text-primary-foreground transition-colors"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {type.name}
                        </h3>
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                          <Icon name="ClockIcon" size={14} className="text-primary" />
                          <span className="text-xs font-bold text-primary">
                            {type.duration} min
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>

                    <Icon
                      name="ArrowRightIcon"
                      size={20}
                      className="hidden md:block text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {currentStep === 2 && selectedMeetingType && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedDate(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Icon name="ArrowLeftIcon" size={20} className="text-foreground" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CalendarIcon" size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Select a Date</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-muted-foreground">{selectedMeeting.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {getNextAvailableDates().map((date, index) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`group relative p-4 lg:p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-warm-md scale-105'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-card"></div>
                    )}
                    <div className="text-center">
                      <div className="text-xs font-medium opacity-70 mb-1">
                        {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}
                      </div>
                      <div className="text-lg font-bold mb-1">
                        {new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-primary rounded-xl animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {currentStep === 3 && selectedDate && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => {
                  setCurrentStep(2);
                  setSelectedTime(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Icon name="ArrowLeftIcon" size={20} className="text-foreground" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="ClockIcon" size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Select a Time</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Icon name="CalendarIcon" size={16} className="text-muted-foreground" />
                    <p className="text-muted-foreground">{formatDate(selectedDate)}</p>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-muted-foreground">{selectedMeeting?.name}</p>
                </div>
              </div>
            </div>

            {availableSlots.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                  <Icon name="ClockIcon" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Available Slots</h3>
                <p className="text-muted-foreground mb-6">
                  This date is fully booked. Please choose another date.
                </p>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:shadow-warm-md hover:-translate-y-1 press-scale flex items-center gap-2 mx-auto"
                >
                  <Icon name="ArrowLeftIcon" size={18} />
                  Choose Another Date
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Icon name="InformationCircleIcon" size={16} />
                  <span>Times shown in your timezone ({userTimezone})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSlots.map((time, index) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          isSelected
                            ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-warm-md scale-105'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Icon
                            name="ClockIcon"
                            size={18}
                            className={isSelected ? 'text-primary' : 'text-muted-foreground'}
                          />
                          <span className="font-semibold">{formatTime(time)}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Icon
                              name="CheckCircleIcon"
                              size={12}
                              className="text-primary-foreground"
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Booking Form */}
        {currentStep === 4 && selectedTime && (
          <form onSubmit={handleSubmit} className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Icon name="ArrowLeftIcon" size={20} className="text-foreground" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="UserCircleIcon" size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Your Details</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
                    <Icon name="CalendarIcon" size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {formatDate(selectedDate!)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
                    <Icon name="ClockIcon" size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {formatTime(selectedTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-lg">
                    <Icon name="VideoCameraIcon" size={14} className="text-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      {selectedMeeting?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="attendeeName"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Icon name="UserCircleIcon" size={16} className="text-primary" />
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="attendeeName"
                    name="attendeeName"
                    required
                    value={formData.attendeeName}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ${
                      errors.attendeeName
                        ? 'border-error focus:ring-error/50'
                        : 'border-border hover:border-primary/50'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.attendeeName && (
                    <p className="flex items-center gap-1 text-sm text-error">
                      <Icon name="ExclamationCircleIcon" size={14} />
                      {errors.attendeeName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="attendeeEmail"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Icon name="EnvelopeIcon" size={16} className="text-primary" />
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    id="attendeeEmail"
                    name="attendeeEmail"
                    required
                    value={formData.attendeeEmail}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ${
                      errors.attendeeEmail
                        ? 'border-error focus:ring-error/50'
                        : 'border-border hover:border-primary/50'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.attendeeEmail && (
                    <p className="flex items-center gap-1 text-sm text-error">
                      <Icon name="ExclamationCircleIcon" size={14} />
                      {errors.attendeeEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="attendeePhone"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Icon name="PhoneIcon" size={16} className="text-muted-foreground" />
                    Phone Number{' '}
                    <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="attendeePhone"
                    name="attendeePhone"
                    value={formData.attendeePhone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/50"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="companyName"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Icon name="BuildingOffice2Icon" size={16} className="text-muted-foreground" />
                    Company Name{' '}
                    <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/50"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <Icon
                    name="ChatBubbleLeftRightIcon"
                    size={16}
                    className="text-muted-foreground"
                  />
                  Additional Message{' '}
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none hover:border-primary/50"
                  placeholder="Tell us what you'd like to discuss..."
                />
              </div>

              {errors.submit && (
                <div className="p-4 bg-error/10 border-2 border-error rounded-xl flex items-start gap-3 animate-shake">
                  <Icon
                    name="ExclamationTriangleIcon"
                    size={20}
                    className="text-error flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-error font-medium">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-warm-xl hover:-translate-y-1 press-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="ArrowPathIcon" size={22} className="animate-spin" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircleIcon" size={22} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
