'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { growthAuditService } from '@/lib/growthAudit';
import type { GrowthAuditSubmission } from '@/types/growthAudit';
import { questions } from '@/app/home/components/GrowthAuditForm';

export default function GrowthAuditManagement() {
  const [submissions, setSubmissions] = useState<GrowthAuditSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<GrowthAuditSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'recent'>('recent');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await growthAuditService.getAll();
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      searchQuery === '' ||
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && submission.submittedAt && submission.submittedAt >= sevenDaysAgo;
    }

    return matchesSearch;
  });

  const getQuestionText = (questionId: string): string => {
    const question = questions.find((q) => q.id === questionId);
    return question?.question || questionId;
  };

  const renderAnswer = (questionId: string, answer: string | string[]): React.ReactNode => {
    if (Array.isArray(answer)) {
      return (
        <div className="flex flex-wrap gap-2">
          {answer.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }
    return <p className="text-foreground whitespace-pre-wrap">{answer}</p>;
  };

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
            onClick={fetchSubmissions}
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Growth Audit Submissions</h1>
            <p className="text-muted-foreground">
              View and manage all growth audit form submissions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchSubmissions}
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
              onClick={() => setFilterStatus('recent')}
              className={`px-4 py-3 rounded-md font-medium transition-smooth press-scale ${
                filterStatus === 'recent'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Recent (7 days)
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="ChartBarIcon" size={20} />
            <span className="font-medium">
              Total Submissions: {submissions.length} | Showing: {filteredSubmissions.length}
            </span>
          </div>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Icon name="DocumentTextIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No submissions found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search query' : 'No growth audit submissions yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-neutral transition-smooth cursor-pointer"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{submission.name}</h3>
                    {submission.companyName && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {submission.companyName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-2">
                      <Icon name="EnvelopeIcon" size={16} />
                      {submission.email}
                    </span>
                    {submission.mobile && (
                      <span className="flex items-center gap-2">
                        <Icon name="PhoneIcon" size={16} />
                        {submission.mobile}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Icon name="CalendarIcon" size={16} />
                      {formatDate(submission.submittedAt)}
                    </span>
                  </div>
                  {submission.message && (
                    <p className="text-foreground line-clamp-2">{submission.message}</p>
                  )}
                </div>
                <Icon name="ChevronRightIcon" size={24} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-card border border-border rounded-lg shadow-warm-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-muted rounded-md transition-smooth press-scale"
              >
                <Icon name="XMarkIcon" size={24} className="text-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="UserCircleIcon" size={20} />
                  User Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground font-medium">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground font-medium">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.mobile && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                      <p className="text-foreground font-medium">{selectedSubmission.mobile}</p>
                    </div>
                  )}
                  {selectedSubmission.companyName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company</label>
                      <p className="text-foreground font-medium">{selectedSubmission.companyName}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Message</label>
                    <p className="text-foreground">{selectedSubmission.message}</p>
                  </div>
                </div>
              </div>

              {/* Answers */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="DocumentTextIcon" size={20} />
                  Answers
                </h3>
                <div className="space-y-6">
                  {Object.entries(selectedSubmission.answers).map(([questionId, answer]) => (
                    <div key={questionId} className="border-b border-border pb-4 last:border-0">
                      <h4 className="font-semibold text-foreground mb-2">
                        {getQuestionText(questionId)}
                      </h4>
                      <div className="text-muted-foreground">
                        {renderAnswer(questionId, answer)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="CalendarIcon" size={16} />
                  <span>Submitted: {formatDate(selectedSubmission.submittedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
