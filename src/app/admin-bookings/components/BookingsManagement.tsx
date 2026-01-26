'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { bookingsService } from '@/lib/bookings';
import { formatTimeWithTimezone } from '@/lib/timezone';
import type { Booking, BookingSettings, Availability } from '@/types/booking';
import { meetingTypes } from '@/app/contact/components/SchedulingSystem';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'upcoming'
  >('all');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardingBooking, setForwardingBooking] = useState<Booking | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [showForwardConfirm, setShowForwardConfirm] = useState(false);
  const [freeTimeSlotOnForward, setFreeTimeSlotOnForward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bookingsData, settingsData] = await Promise.all([
        bookingsService.getAll(),
        bookingsService.getSettings(),
      ]);
      setBookings(bookingsData);
      setSettings(settingsData);

      // Initialize default availability if none exists
      if (settingsData && (!settingsData.availability || settingsData.availability.length === 0)) {
        await initializeDefaultAvailability();
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultAvailability = async () => {
    const defaultAvailability: Availability[] = [
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
    });

    const updatedSettings = await bookingsService.getSettings();
    setSettings(updatedSettings);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatDateTime = (
    date: Date | undefined,
    time: string,
    bookingTimezone?: string
  ): string => {
    if (!date) return 'N/A';

    // If admin and booking are in the same timezone, just format the stored time directly
    const adminTimezone = settings?.timezone || 'Asia/Kolkata';
    const displayTimezone = bookingTimezone || adminTimezone;

    // Parse the time string directly (it's already in admin timezone)
    const [hours, minutes] = time.split(':').map(Number);
    const hour = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Format date
    const dateStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);

    // Return formatted time (already in correct timezone, no conversion needed)
    return `${dateStr} at ${hour}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMeetingTypeName = (type: string): string => {
    return meetingTypes.find((m) => m.id === type)?.name || type;
  };

  const handleCancelBooking = (booking: Booking) => {
    setCancellingBooking(booking);
    setShowCancelConfirm(true);
  };

  const confirmCancelBooking = async (freeTimeSlot: boolean) => {
    if (!cancellingBooking?.id) return;

    try {
      if (freeTimeSlot) {
        // Delete the booking to free the time slot
        await bookingsService.delete(cancellingBooking.id);
      } else {
        // Just cancel (mark as cancelled, keeps slot blocked)
        await bookingsService.cancel(cancellingBooking.id);
      }
      await loadData();
      if (selectedBooking?.id === cancellingBooking.id) {
        setSelectedBooking(null);
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      const errorMessage =
        error?.message || 'Failed to cancel booking. The booking may have been deleted.';
      alert(errorMessage);
      await loadData(); // Reload to refresh the list
    } finally {
      setShowCancelConfirm(false);
      setCancellingBooking(null);
    }
  };

  const handleDeleteBooking = (booking: Booking) => {
    setDeletingBooking(booking);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBooking = async () => {
    if (!deletingBooking?.id) return;

    try {
      await bookingsService.delete(deletingBooking.id);
      await loadData();
      if (selectedBooking?.id === deletingBooking.id) {
        setSelectedBooking(null);
      }
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      const errorMessage =
        error?.message || 'Failed to delete booking. The booking may have been deleted already.';
      alert(errorMessage);
      await loadData(); // Reload to refresh the list
    } finally {
      setShowDeleteConfirm(false);
      setDeletingBooking(null);
    }
  };

  const handleApproveBooking = async (id: string) => {
    try {
      await bookingsService.approve(id);
      await loadData();
      if (selectedBooking?.id === id) {
        const updated = await bookingsService.getById(id);
        if (updated) setSelectedBooking(updated);
      }
    } catch (error: any) {
      console.error('Error approving booking:', error);
      const errorMessage =
        error?.message || 'Failed to approve booking. The booking may have been deleted.';
      alert(errorMessage);
      await loadData(); // Reload to refresh the list
    }
  };

  const handleCompleteBooking = async (id: string) => {
    try {
      await bookingsService.complete(id);
      await loadData();
      if (selectedBooking?.id === id) {
        const updated = await bookingsService.getById(id);
        if (updated) setSelectedBooking(updated);
      }
    } catch (error: any) {
      console.error('Error completing booking:', error);
      const errorMessage =
        error?.message || 'Failed to mark booking as completed. The booking may have been deleted.';
      alert(errorMessage);
      await loadData(); // Reload to refresh the list
    }
  };

  const handleForwardBooking = (booking: Booking) => {
    setForwardingBooking(booking);
    setShowForwardConfirm(true);
  };

  const confirmForwardBooking = (freeTimeSlot: boolean) => {
    if (!forwardingBooking) return;

    // Store the freeTimeSlot preference - we'll handle it after forwarding is successful
    setFreeTimeSlotOnForward(freeTimeSlot);

    setShowForwardConfirm(false);
    setShowForwardModal(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchQuery === '' ||
      booking.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      booking.status === filterStatus ||
      (filterStatus === 'upcoming' &&
        (booking.status === 'confirmed' || booking.status === 'pending') &&
        booking.scheduledDate &&
        booking.scheduledDate > new Date());

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-20">
          <Icon name="ArrowPathIcon" size={48} className="text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
          <Icon name="ExclamationTriangleIcon" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Bookings Management</h1>
            <p className="text-muted-foreground">View and manage all meeting bookings</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale flex items-center gap-2"
            >
              <Icon name="Cog6ToothIcon" size={18} />
              Settings
            </button>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale flex items-center gap-2"
            >
              <Icon name="ArrowPathIcon" size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'upcoming'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'confirmed'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'cancelled'
                  ? 'bg-error text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-warm-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <Icon name="CalendarIcon" size={20} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
          </div>
          <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/20 p-4 hover:shadow-warm-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-600 font-medium">Pending</span>
              <Icon name="ClockIcon" size={20} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-primary/10 rounded-xl border border-primary/20 p-4 hover:shadow-warm-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary font-medium">Confirmed</span>
              <Icon name="CheckCircleIcon" size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-4 hover:shadow-warm-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Completed</span>
              <Icon name="CheckCircleIcon" size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'completed').length}
            </p>
          </div>
          <div className="bg-error/10 rounded-xl border border-error/20 p-4 hover:shadow-warm-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-error font-medium">Cancelled</span>
              <Icon name="XCircleIcon" size={20} className="text-error" />
            </div>
            <p className="text-2xl font-bold text-error">
              {bookings.filter((b) => b.status === 'cancelled').length}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="MagnifyingGlassIcon" size={20} />
            <span className="font-medium">
              Showing: {filteredBookings.length} of {bookings.length} bookings
            </span>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Icon name="CalendarIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search query' : 'No bookings have been made yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isUpcoming =
              booking.status === 'confirmed' &&
              booking.scheduledDate &&
              booking.scheduledDate > new Date();
            return (
              <div
                key={booking.id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-neutral transition-smooth cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {booking.attendeeName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                            : booking.status === 'confirmed' && isUpcoming
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : booking.status === 'confirmed'
                                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                : booking.status === 'cancelled'
                                  ? 'bg-error/10 text-error border border-error/20'
                                  : booking.status === 'completed'
                                    ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                    : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {booking.status === 'confirmed' && isUpcoming
                          ? 'Upcoming'
                          : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.forwardedTo && (
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm font-medium border border-purple-500/20 flex items-center gap-1">
                          <Icon name="ArrowRightIcon" size={14} />
                          Forwarded
                        </span>
                      )}
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        {getMeetingTypeName(booking.meetingType)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-2">
                        <Icon name="EnvelopeIcon" size={16} />
                        {booking.attendeeEmail}
                      </span>
                      {booking.attendeePhone && (
                        <span className="flex items-center gap-2">
                          <Icon name="PhoneIcon" size={16} />
                          {booking.attendeePhone}
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <Icon name="CalendarIcon" size={16} />
                        {formatDateTime(booking.scheduledDate, booking.scheduledTime)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Icon name="ClockIcon" size={16} />
                        {meetingTypes.find((m) => m.id === booking.meetingType)?.duration} min
                      </span>
                    </div>
                    {booking.companyName && (
                      <p className="text-foreground mb-2">
                        <span className="font-medium">Company:</span> {booking.companyName}
                      </p>
                    )}
                    {booking.message && (
                      <p className="text-muted-foreground line-clamp-2">{booking.message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            booking.id && handleApproveBooking(booking.id);
                          }}
                          className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 press-scale"
                          title="Approve"
                        >
                          <Icon name="CheckCircleIcon" size={18} />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            booking.id && handleCompleteBooking(booking.id);
                          }}
                          className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 press-scale"
                          title="Mark as Completed"
                        >
                          <Icon name="CheckCircleIcon" size={18} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleForwardBooking(booking);
                        }}
                        className="p-2 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-200 press-scale"
                        title="Forward/Reschedule"
                      >
                        <Icon name="ArrowRightIcon" size={18} />
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking);
                          }}
                          className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-all duration-200 press-scale"
                          title="Cancel"
                        >
                          <Icon name="XCircleIcon" size={18} />
                        </button>
                      )}
                    </div>
                    <Icon name="ChevronRightIcon" size={24} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-card border border-border rounded-lg shadow-warm-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
              >
                <Icon name="XMarkIcon" size={24} className="text-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Meeting Type</label>
                  <p className="text-foreground font-medium">
                    {getMeetingTypeName(selectedBooking.meetingType)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-foreground font-medium capitalize">{selectedBooking.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                  <p className="text-foreground font-medium">
                    {formatDateTime(selectedBooking.scheduledDate, selectedBooking.scheduledTime)}
                  </p>
                  {selectedBooking.timezone &&
                    selectedBooking.timezone !== (settings?.timezone || 'Asia/Kolkata') && (
                      <p className="text-xs text-muted-foreground mt-1">
                        User's timezone: {selectedBooking.timezone}
                      </p>
                    )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-foreground font-medium">
                    {meetingTypes.find((m) => m.id === selectedBooking.meetingType)?.duration}{' '}
                    minutes
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground font-medium">{selectedBooking.attendeeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground font-medium">{selectedBooking.attendeeEmail}</p>
                </div>
                {selectedBooking.attendeePhone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground font-medium">{selectedBooking.attendeePhone}</p>
                  </div>
                )}
                {selectedBooking.companyName && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="text-foreground font-medium">{selectedBooking.companyName}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                  <p className="text-foreground font-medium">{selectedBooking.timezone}</p>
                </div>
                {selectedBooking.message && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Message</label>
                    <p className="text-foreground">{selectedBooking.message}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex flex-wrap gap-3 mb-4">
                  {selectedBooking.status === 'pending' && (
                    <button
                      onClick={() => selectedBooking.id && handleApproveBooking(selectedBooking.id)}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-green-600 hover:shadow-lg press-scale flex items-center gap-2"
                    >
                      <Icon name="CheckCircleIcon" size={18} />
                      Approve Booking
                    </button>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() =>
                          selectedBooking.id && handleCompleteBooking(selectedBooking.id)
                        }
                        className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-green-600 hover:shadow-lg press-scale flex items-center gap-2"
                      >
                        <Icon name="CheckCircleIcon" size={18} />
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => handleCancelBooking(selectedBooking)}
                        className="px-6 py-3 bg-error/10 text-error rounded-xl font-semibold transition-all duration-300 hover:bg-error/20 hover:shadow-lg press-scale flex items-center gap-2"
                      >
                        <Icon name="XCircleIcon" size={18} />
                        Cancel Booking
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleForwardBooking(selectedBooking)}
                    className="px-6 py-3 bg-purple-500/10 text-purple-600 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-500 hover:text-white hover:shadow-lg press-scale flex items-center gap-2"
                  >
                    <Icon name="ArrowRightIcon" size={18} />
                    Forward/Reschedule
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(selectedBooking)}
                    className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold transition-all duration-300 hover:bg-muted/80 press-scale flex items-center gap-2"
                  >
                    <Icon name="TrashIcon" size={18} />
                    Delete
                  </button>
                </div>
                {selectedBooking.forwardedTo && (
                  <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl mb-3">
                    <div className="flex items-start gap-3">
                      <Icon
                        name="InformationCircleIcon"
                        size={20}
                        className="text-purple-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-semibold text-purple-600 mb-1">Forwarded To</p>
                        <p className="text-foreground">{selectedBooking.forwardedTo}</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedBooking.adminNotes && (
                  <div className="p-4 bg-muted/50 border border-border rounded-xl">
                    <p className="text-sm font-semibold text-foreground mb-2">Admin Notes</p>
                    <p className="text-muted-foreground">{selectedBooking.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && settings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={async (updatedSettings) => {
            await bookingsService.updateSettings(updatedSettings);
            await loadData();
            setShowSettings(false);
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && cancellingBooking && (
        <CancelConfirmModal
          booking={cancellingBooking}
          onClose={() => {
            setShowCancelConfirm(false);
            setCancellingBooking(null);
          }}
          onConfirm={confirmCancelBooking}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingBooking && (
        <DeleteConfirmModal
          booking={deletingBooking}
          onClose={() => {
            setShowDeleteConfirm(false);
            setDeletingBooking(null);
          }}
          onConfirm={confirmDeleteBooking}
        />
      )}

      {/* Forward Confirmation Modal */}
      {showForwardConfirm && forwardingBooking && (
        <ForwardConfirmModal
          booking={forwardingBooking}
          onClose={() => {
            setShowForwardConfirm(false);
            setForwardingBooking(null);
            setFreeTimeSlotOnForward(false);
          }}
          onConfirm={confirmForwardBooking}
        />
      )}

      {/* Forward/Reschedule Modal */}
      {showForwardModal && forwardingBooking && (
        <ForwardModal
          booking={forwardingBooking}
          onClose={() => {
            setShowForwardModal(false);
            setForwardingBooking(null);
            setFreeTimeSlotOnForward(false);
          }}
          onForward={async (forwardedTo, newDate, newTime, adminNotes) => {
            if (forwardingBooking.id) {
              try {
                // Forward the booking (update with new information)
                await bookingsService.forward(
                  forwardingBooking.id,
                  forwardedTo,
                  newDate,
                  newTime,
                  adminNotes
                );

                // If freeTimeSlot was requested and we're rescheduling to a new time,
                // the old time slot is automatically freed because we moved the booking.
                // If freeTimeSlot was requested but NOT rescheduling, we need to handle it differently.
                // Actually, if we're just forwarding without rescheduling, the time slot stays with the booking.
                // So "free time slot" only makes sense when rescheduling.

                // If freeTimeSlot was true and we're NOT rescheduling, we should cancel the original booking
                // and the admin can create a new booking manually. But this is an edge case.
                // For now, if freeTimeSlot is true and we're rescheduling, the old slot is automatically freed.

                await loadData();
                if (selectedBooking?.id === forwardingBooking.id) {
                  const updated = await bookingsService.getById(forwardingBooking.id);
                  if (updated) setSelectedBooking(updated);
                }

                // Reset the freeTimeSlot preference
                setFreeTimeSlotOnForward(false);
              } catch (error: any) {
                console.error('Error forwarding booking:', error);
                const errorMessage =
                  error?.message || 'Failed to forward booking. The booking may have been deleted.';
                alert(errorMessage);
                // Reload data to refresh the list
                await loadData();
                // Reset the freeTimeSlot preference on error
                setFreeTimeSlotOnForward(false);
                return; // Don't close modal if there's an error
              }
            }
            setShowForwardModal(false);
            setForwardingBooking(null);
            setFreeTimeSlotOnForward(false);
          }}
        />
      )}
    </div>
  );
}

// Settings Modal Component
function SettingsModal({
  settings,
  onClose,
  onSave,
}: {
  settings: BookingSettings;
  onSave: (settings: Partial<BookingSettings>) => Promise<void>;
  onClose: () => void;
}) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(localSettings);
    } finally {
      setIsSaving(false);
    }
  };

  const updateAvailability = (
    dayOfWeek: number,
    field: 'startTime' | 'endTime' | 'isAvailable',
    value: string | boolean
  ) => {
    setLocalSettings({
      ...localSettings,
      availability: localSettings.availability.map((a) =>
        a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a
      ),
    });
  };

  const addAvailability = (dayOfWeek: number) => {
    if (!localSettings.availability.find((a) => a.dayOfWeek === dayOfWeek)) {
      setLocalSettings({
        ...localSettings,
        availability: [
          ...localSettings.availability,
          { dayOfWeek, startTime: '09:00', endTime: '17:00', isAvailable: true },
        ],
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-lg shadow-warm-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Booking Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
          >
            <Icon name="XMarkIcon" size={24} className="text-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slot Duration (minutes)
              </label>
              <input
                type="number"
                value={localSettings.slotDuration}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    slotDuration: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
                min="15"
                step="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                value={localSettings.bufferTime}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, bufferTime: parseInt(e.target.value) || 15 })
                }
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
                min="0"
                step="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Advance Booking Days
              </label>
              <input
                type="number"
                value={localSettings.advanceBookingDays}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    advanceBookingDays: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
                min="7"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
              <input
                type="text"
                value={localSettings.timezone}
                onChange={(e) => setLocalSettings({ ...localSettings, timezone: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-4">Working Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  onClick={() => {
                    const isSelected = localSettings.workingDays.includes(day.value);
                    setLocalSettings({
                      ...localSettings,
                      workingDays: isSelected
                        ? localSettings.workingDays.filter((d) => d !== day.value)
                        : [...localSettings.workingDays, day.value],
                    });
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-smooth ${
                    localSettings.workingDays.includes(day.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Daily Availability
            </label>
            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const availability = localSettings.availability.find(
                  (a) => a.dayOfWeek === day.value
                );
                return (
                  <div
                    key={day.value}
                    className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border"
                  >
                    <div className="w-24">
                      <label className="text-sm font-medium text-foreground">{day.label}</label>
                    </div>
                    {availability ? (
                      <>
                        <input
                          type="checkbox"
                          checked={availability.isAvailable}
                          onChange={(e) =>
                            updateAvailability(day.value, 'isAvailable', e.target.checked)
                          }
                          className="w-4 h-4 text-primary"
                        />
                        {availability.isAvailable && (
                          <>
                            <input
                              type="time"
                              value={availability.startTime}
                              onChange={(e) =>
                                updateAvailability(day.value, 'startTime', e.target.value)
                              }
                              className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
                            />
                            <span className="text-muted-foreground">to</span>
                            <input
                              type="time"
                              value={availability.endTime}
                              onChange={(e) =>
                                updateAvailability(day.value, 'endTime', e.target.value)
                              }
                              className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => addAvailability(day.value)}
                        className="px-4 py-2 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80 transition-smooth"
                      >
                        Add Availability
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-md font-medium transition-smooth hover:bg-muted/80 press-scale"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md press-scale disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Forward/Reschedule Modal Component
function ForwardModal({
  booking,
  onClose,
  onForward,
}: {
  booking: Booking;
  onClose: () => void;
  onForward: (
    forwardedTo: string,
    newDate?: Date,
    newTime?: string,
    adminNotes?: string
  ) => Promise<void>;
}) {
  const [forwardedTo, setForwardedTo] = useState(booking.forwardedTo || booking.attendeeName);
  const [forwardToOption, setForwardToOption] = useState<'same' | 'different'>('same');
  const [reschedule, setReschedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadSettings = async () => {
    try {
      const s = await bookingsService.getSettings();
      setSettings(s);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const generateTimeSlots = (
    date: Date,
    existingBookings: Booking[],
    settings: BookingSettings
  ): string[] => {
    const slots: string[] = [];
    const slotDuration = settings.slotDuration || 30;
    const bufferTime = settings.bufferTime || 15;
    const workingDays = settings.workingDays || [1, 2, 3, 4, 5];
    const dayOfWeek = date.getDay();
    const adminTimezone = settings.timezone || 'Asia/Kolkata';

    if (!workingDays.includes(dayOfWeek)) {
      return [];
    }

    const dayAvailability = settings.availability?.find((a) => a.dayOfWeek === dayOfWeek);
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return [];
    }

    const [startHour, startMin] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMin] = dayAvailability.endTime.split(':').map(Number);

    const startTime = new Date(date);
    startTime.setHours(startHour, startMin, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(endHour, endMin, 0, 0);

    // Get booked times (only confirmed bookings block slots)
    const bookedTimes = existingBookings
      .filter((b) => {
        if (!b.scheduledDate) return false;
        const bookingDate = new Date(b.scheduledDate);
        return (
          bookingDate.getFullYear() === date.getFullYear() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getDate() === date.getDate() &&
          b.status === 'confirmed'
        );
      })
      .map((b) => b.scheduledTime);

    const current = new Date(startTime);
    while (current < endTime) {
      const timeString = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;

      if (!bookedTimes.includes(timeString)) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        if (slotEnd <= endTime) {
          slots.push(timeString);
        }
      }

      current.setMinutes(current.getMinutes() + slotDuration + bufferTime);
    }

    return slots;
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !settings) return;

    setIsLoadingSlots(true);
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dateBookings = await bookingsService.getByDateRange(startOfDay, endOfDay);
      // Exclude the current booking being rescheduled
      const filteredBookings = dateBookings.filter((b) => b.id !== booking.id);
      setExistingBookings(filteredBookings);

      const slots = generateTimeSlots(selectedDate, filteredBookings, settings);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (selectedDate && reschedule && settings) {
      loadAvailableSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, reschedule, settings]);

  const getNextAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    const maxDays = settings?.advanceBookingDays || 30;
    const workingDays = settings?.workingDays || [1, 2, 3, 4, 5];

    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

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

  const getMeetingTypeName = (type: string): string => {
    return meetingTypes.find((m) => m.id === type)?.name || type;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (forwardToOption === 'different' && (!forwardedTo || !forwardedTo.trim())) {
      newErrors.forwardedTo = 'Please enter who to forward this booking to.';
    }

    if (reschedule) {
      if (!selectedDate) {
        newErrors.date = 'Please select a date.';
      }
      if (!selectedTime) {
        newErrors.time = 'Please select a time.';
      }

      // Check for conflicts if rescheduling
      if (selectedDate && selectedTime && settings) {
        try {
          const conflicts = await bookingsService.checkConflict(
            selectedDate,
            selectedTime,
            booking.meetingType,
            booking.id // Exclude current booking from conflict check
          );

          if (conflicts.length > 0) {
            newErrors.time = 'This time slot is already booked. Please select another time.';
          }
        } catch (error) {
          console.error('Error checking conflicts:', error);
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const date = reschedule && selectedDate ? selectedDate : undefined;
      const time = reschedule && selectedTime ? selectedTime : undefined;
      await onForward(forwardedTo.trim(), date, time, adminNotes.trim() || undefined);
    } catch (error) {
      console.error('Error forwarding booking:', error);
      setErrors({ submit: 'Failed to forward booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-warm-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Forward/Reschedule Booking</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {booking.attendeeName} • {getMeetingTypeName(booking.meetingType)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth press-scale"
          >
            <Icon name="XMarkIcon" size={24} className="text-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit}
          id="forward-form"
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0"
        >
          {/* Forward To */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Forward To <span className="text-error">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <input
                  type="radio"
                  id="sameUser"
                  name="forwardTo"
                  checked={forwardToOption === 'same'}
                  onChange={() => {
                    setForwardToOption('same');
                    setForwardedTo(booking.attendeeName);
                    if (errors.forwardedTo) setErrors({ ...errors, forwardedTo: '' });
                  }}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <label htmlFor="sameUser" className="flex-1 cursor-pointer">
                  <p className="text-sm font-semibold text-foreground">Keep with same user</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.attendeeName} ({booking.attendeeEmail})
                  </p>
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                <input
                  type="radio"
                  id="differentUser"
                  name="forwardTo"
                  checked={forwardToOption === 'different'}
                  onChange={() => {
                    setForwardToOption('different');
                    setForwardedTo('');
                    if (errors.forwardedTo) setErrors({ ...errors, forwardedTo: '' });
                  }}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <label htmlFor="differentUser" className="flex-1 cursor-pointer">
                  <p className="text-sm font-semibold text-foreground">
                    Forward to different person
                  </p>
                </label>
              </div>

              {forwardToOption === 'different' && (
                <div className="animate-fade-in">
                  <input
                    type="text"
                    value={forwardedTo}
                    onChange={(e) => {
                      setForwardedTo(e.target.value);
                      if (errors.forwardedTo) setErrors({ ...errors, forwardedTo: '' });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      errors.forwardedTo ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter name or email of person to forward to"
                    autoFocus
                  />
                  {errors.forwardedTo && (
                    <p className="mt-1 text-sm text-error">{errors.forwardedTo}</p>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This booking will be marked as forwarded to the specified person
            </p>
          </div>

          {/* Reschedule Toggle */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
            <input
              type="checkbox"
              id="reschedule"
              checked={reschedule}
              onChange={(e) => {
                setReschedule(e.target.checked);
                if (!e.target.checked) {
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setErrors({});
                }
              }}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <label
              htmlFor="reschedule"
              className="text-sm font-medium text-foreground cursor-pointer flex-1"
            >
              Also reschedule this meeting to a new date and time
            </label>
          </div>

          {/* Date and Time Selection (Same UI as User Booking) */}
          {reschedule && (
            <div className="space-y-6 animate-fade-in">
              {/* Date Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="CalendarIcon" size={20} className="text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Select New Date</h3>
                </div>
                {!settings ? (
                  <div className="text-center py-8">
                    <Icon
                      name="ArrowPathIcon"
                      size={32}
                      className="text-muted-foreground mx-auto mb-2 animate-spin"
                    />
                    <p className="text-muted-foreground">Loading availability...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {getNextAvailableDates().map((date, index) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <button
                          key={index}
                          type="button"
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
                )}
                {errors.date && <p className="mt-2 text-sm text-error">{errors.date}</p>}
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="ClockIcon" size={20} className="text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Select New Time</h3>
                    <span className="text-sm text-muted-foreground">
                      ({formatDate(selectedDate)})
                    </span>
                  </div>

                  {isLoadingSlots ? (
                    <div className="text-center py-12">
                      <Icon
                        name="ArrowPathIcon"
                        size={32}
                        className="text-muted-foreground mx-auto mb-2 animate-spin"
                      />
                      <p className="text-muted-foreground">Loading available time slots...</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
                      <Icon
                        name="ClockIcon"
                        size={48}
                        className="text-muted-foreground mx-auto mb-4"
                      />
                      <p className="text-muted-foreground mb-2">
                        No available time slots for this date.
                      </p>
                      <p className="text-sm text-muted-foreground">Please select another date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableSlots.map((time, index) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={index}
                            type="button"
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
                  )}
                  {errors.time && <p className="mt-2 text-sm text-error">{errors.time}</p>}
                </div>
              )}
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              placeholder="Add any internal notes about this booking..."
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-error/10 border-2 border-error rounded-xl flex items-start gap-3">
              <Icon
                name="ExclamationTriangleIcon"
                size={20}
                className="text-error flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-error font-medium">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Action Buttons - Sticky at bottom */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl z-10 flex-shrink-0 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold transition-all duration-300 hover:bg-muted/80 press-scale"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="forward-form"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              const form = document.getElementById('forward-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 press-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon name="ArrowRightIcon" size={18} />
                Forward Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Cancel Confirmation Modal
function CancelConfirmModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (freeTimeSlot: boolean) => void;
}) {
  // freeTimeSlot parameter is kept for compatibility but not used
  // Cancelled bookings don't block slots anyway

  const getMeetingTypeName = (type: string): string => {
    return meetingTypes.find((m) => m.id === type)?.name || type;
  };

  const formatDateTime = (date: Date | undefined, time: string): string => {
    if (!date) return 'N/A';
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateTime);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-warm-xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Cancel Booking</h3>
              <p className="text-muted-foreground">Are you sure you want to cancel this booking?</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm font-semibold text-foreground">{booking.attendeeName}</p>
            <p className="text-sm text-muted-foreground">
              {getMeetingTypeName(booking.meetingType)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(booking.scheduledDate, booking.scheduledTime)}
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <Icon
                name="InformationCircleIcon"
                size={20}
                className="text-blue-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-blue-600">
                <strong>Note:</strong> Cancelled bookings don't block time slots. The time slot will
                be immediately available for new bookings after cancellation.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold transition-all duration-300 hover:bg-muted/80 press-scale"
            >
              No, Keep It
            </button>
            <button
              onClick={() => onConfirm(false)}
              className="flex-1 px-6 py-3 bg-error text-white rounded-xl font-semibold transition-all duration-300 hover:bg-error/90 hover:shadow-lg press-scale"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const getMeetingTypeName = (type: string): string => {
    return meetingTypes.find((m) => m.id === type)?.name || type;
  };

  const formatDateTime = (date: Date | undefined, time: string): string => {
    if (!date) return 'N/A';
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateTime);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-warm-xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Booking</h3>
              <p className="text-muted-foreground">
                Are you sure you want to permanently delete this booking? This action cannot be
                undone.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm font-semibold text-foreground">{booking.attendeeName}</p>
            <p className="text-sm text-muted-foreground">
              {getMeetingTypeName(booking.meetingType)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(booking.scheduledDate, booking.scheduledTime)}
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <Icon
                name="InformationCircleIcon"
                size={20}
                className="text-yellow-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-yellow-600">
                <strong>Warning:</strong> Deleting this booking will permanently remove it from the
                system and free the time slot for new bookings.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold transition-all duration-300 hover:bg-muted/80 press-scale"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-error text-white rounded-xl font-semibold transition-all duration-300 hover:bg-error/90 hover:shadow-lg press-scale flex items-center justify-center gap-2"
            >
              <Icon name="TrashIcon" size={18} />
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Forward Confirmation Modal
function ForwardConfirmModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (freeTimeSlot: boolean) => void;
}) {
  const [freeTimeSlot, setFreeTimeSlot] = useState(false);

  const getMeetingTypeName = (type: string): string => {
    return meetingTypes.find((m) => m.id === type)?.name || type;
  };

  const formatDateTime = (date: Date | undefined, time: string): string => {
    if (!date) return 'N/A';
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateTime);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-warm-xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Icon name="ArrowRightIcon" size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Forward Booking</h3>
              <p className="text-muted-foreground">
                You're about to forward this booking. Do you want to free the current time slot?
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm font-semibold text-foreground">{booking.attendeeName}</p>
            <p className="text-sm text-muted-foreground">
              {getMeetingTypeName(booking.meetingType)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(booking.scheduledDate, booking.scheduledTime)}
            </p>
          </div>

          <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="freeTimeSlotForward"
                checked={freeTimeSlot}
                onChange={(e) => setFreeTimeSlot(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary mt-0.5"
              />
              <label htmlFor="freeTimeSlotForward" className="flex-1 cursor-pointer">
                <p className="text-sm font-semibold text-foreground mb-1">Free this time slot</p>
                <p className="text-xs text-muted-foreground">
                  {freeTimeSlot
                    ? 'The current time slot will be freed and available for new bookings. You can reschedule in the next step.'
                    : 'The current time slot will remain blocked. You can reschedule to a new time in the next step.'}
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold transition-all duration-300 hover:bg-muted/80 press-scale"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(freeTimeSlot)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg press-scale flex items-center justify-center gap-2"
            >
              <Icon name="ArrowRightIcon" size={18} />
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
