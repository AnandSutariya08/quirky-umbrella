'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import IndustryTableRow from './IndustryTableRow';
import IndustryCard from './IndustryCard';
import IndustryFormModal from './IndustryFormModal';
import IndustryPreviewModal from './IndustryPreviewModal';

interface Industry {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  imageUrl: string;
  imageAlt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const IndustriesManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [filteredIndustries, setFilteredIndustries] = useState<Industry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    setIsHydrated(true);
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      filterAndSortIndustries();
    }
  }, [searchQuery, sortBy, sortOrder, industries, isHydrated]);

  const fetchIndustries = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockIndustries: Industry[] = [
      {
        id: '1',
        title: 'Technology Solutions',
        slug: 'technology-solutions',
        metaTitle: 'Technology Solutions - Quirky Umbrella',
        metaDescription: 'Innovative technology solutions for modern businesses seeking digital transformation and competitive advantage.',
        contentHtml: `<h2>Transforming Businesses Through Technology</h2>\n<p>We deliver cutting-edge technology solutions that drive innovation and growth. Our expertise spans cloud computing, AI integration, and digital transformation strategies.</p>\n<h3>Our Technology Services</h3>\n<ul>\n  <li>Cloud Infrastructure & Migration</li>\n  <li>AI & Machine Learning Integration</li>\n  <li>Custom Software Development</li>\n  <li>Cybersecurity Solutions</li>\n</ul>\n<p>Partner with us to leverage technology for sustainable competitive advantage.</p>`,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        imageAlt: 'Modern technology office with multiple computer monitors displaying code and data analytics on sleek desks',
        isPublished: true,
        createdAt: '2026-01-15T10:30:00Z',
        updatedAt: '2026-01-19T14:20:00Z',
      },
      {
        id: '2',
        title: 'Healthcare Innovation',
        slug: 'healthcare-innovation',
        metaTitle: 'Healthcare Innovation - Quirky Umbrella',
        metaDescription: 'Revolutionizing healthcare delivery with innovative solutions that improve patient outcomes and operational efficiency.',
        contentHtml: `<h2>Advancing Healthcare Through Innovation</h2>\n<p>Our healthcare solutions combine medical expertise with cutting-edge technology to improve patient care and streamline operations.</p>\n<h3>Healthcare Capabilities</h3>\n<ul>\n  <li>Telemedicine Platform Development</li>\n  <li>Electronic Health Records (EHR) Systems</li>\n  <li>Patient Engagement Solutions</li>\n  <li>Healthcare Analytics & Insights</li>\n</ul>\n<p>Transform your healthcare organization with our innovative solutions.</p>`,
        imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?w=800&q=80',
        imageAlt: 'Healthcare professional in white coat using digital tablet in modern medical facility with advanced equipment',
        isPublished: true,
        createdAt: '2026-01-14T09:15:00Z',
        updatedAt: '2026-01-18T16:45:00Z',
      },
      {
        id: '3',
        title: 'Financial Services',
        slug: 'financial-services',
        metaTitle: 'Financial Services - Quirky Umbrella',
        metaDescription: 'Comprehensive financial solutions designed to optimize operations, ensure compliance, and drive growth.',
        contentHtml: `<h2>Empowering Financial Excellence</h2>\n<p>We provide innovative financial solutions that help institutions navigate complex regulatory environments while delivering exceptional customer experiences.</p>\n<h3>Financial Solutions</h3>\n<ul>\n  <li>Digital Banking Platforms</li>\n  <li>Payment Processing Systems</li>\n  <li>Risk Management Solutions</li>\n  <li>Regulatory Compliance Tools</li>\n</ul>\n<p>Build trust and drive growth with our financial technology expertise.</p>`,
        imageUrl: 'https://images.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg?w=800&q=80',
        imageAlt: 'Financial analyst reviewing stock market data on multiple screens showing charts and graphs in modern office',
        isPublished: false,
        createdAt: '2026-01-13T11:00:00Z',
        updatedAt: '2026-01-17T10:30:00Z',
      },
      {
        id: '4',
        title: 'Retail & E-commerce',
        slug: 'retail-ecommerce',
        metaTitle: 'Retail & E-commerce - Quirky Umbrella',
        metaDescription: 'Omnichannel retail solutions that create seamless shopping experiences and drive sales growth.',
        contentHtml: `<h2>Revolutionizing Retail Experiences</h2>\n<p>Our retail solutions bridge online and offline channels to create unified shopping experiences that delight customers and boost revenue.</p>\n<h3>Retail Solutions</h3>\n<ul>\n  <li>E-commerce Platform Development</li>\n  <li>Inventory Management Systems</li>\n  <li>Customer Loyalty Programs</li>\n  <li>Point of Sale (POS) Solutions</li>\n</ul>\n<p>Transform your retail business with our comprehensive solutions.</p>`,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        imageAlt: 'Modern retail store interior with clothing displays, bright lighting, and customers browsing merchandise',
        isPublished: true,
        createdAt: '2026-01-12T13:45:00Z',
        updatedAt: '2026-01-16T09:15:00Z',
      },
      {
        id: '5',
        title: 'Education & Learning',
        slug: 'education-learning',
        metaTitle: 'Education & Learning - Quirky Umbrella',
        metaDescription: 'Innovative educational technology solutions that enhance learning outcomes and institutional efficiency.',
        contentHtml: `<h2>Transforming Education Through Technology</h2>\n<p>We create engaging learning experiences through innovative educational technology that empowers students and educators alike.</p>\n<h3>Education Solutions</h3>\n<ul>\n  <li>Learning Management Systems (LMS)</li>\n  <li>Virtual Classroom Platforms</li>\n  <li>Student Information Systems</li>\n  <li>Educational Content Development</li>\n</ul>\n<p>Enhance learning outcomes with our educational technology solutions.</p>`,
        imageUrl: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?w=800&q=80',
        imageAlt: 'Students collaborating around laptop in modern classroom with interactive whiteboard and colorful learning materials',
        isPublished: true,
        createdAt: '2026-01-11T08:30:00Z',
        updatedAt: '2026-01-15T14:00:00Z',
      },
    ];

    setIndustries(mockIndustries);
    setIsLoading(false);
  };

  const filterAndSortIndustries = () => {
    let filtered = [...industries];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (industry) =>
          industry.title.toLowerCase().includes(query) ||
          industry.slug.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const aValue = sortBy === 'title' ? a.title : new Date(a.updatedAt).getTime();
      const bValue = sortBy === 'title' ? b.title : new Date(b.updatedAt).getTime();

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredIndustries(filtered);
  };

  const handleAddNew = () => {
    setSelectedIndustry(null);
    setShowFormModal(true);
  };

  const handleEdit = (industry: Industry) => {
    setSelectedIndustry(industry);
    setShowFormModal(true);
  };

  const handleDelete = (id: string) => {
    setIndustries((prev) => prev.filter((industry) => industry.id !== id));
  };

  const handlePreview = (industry: Industry) => {
    setSelectedIndustry(industry);
    setShowPreviewModal(true);
  };

  const handleSave = (industryData: Omit<Industry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedIndustry) {
      setIndustries((prev) =>
        prev.map((industry) =>
          industry.id === selectedIndustry.id
            ? {
                ...industry,
                ...industryData,
                updatedAt: new Date().toISOString(),
              }
            : industry
        )
      );
    } else {
      const newIndustry: Industry = {
        id: Date.now().toString(),
        ...industryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIndustries((prev) => [newIndustry, ...prev]);
    }
    setShowFormModal(false);
  };

  const toggleSort = (field: 'title' | 'updatedAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Industries Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your industry content and SEO settings
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm press-scale"
          >
            <Icon name="PlusIcon" size={20} />
            Add New Industry
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search industries..."
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 flex-1 lg:flex-initial">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 rounded-md transition-smooth press-scale ${
                    viewMode === 'table' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  title="Table View"
                >
                  <Icon name="TableCellsIcon" size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-md transition-smooth press-scale ${
                    viewMode === 'grid' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  title="Grid View"
                >
                  <Icon name="Squares2X2Icon" size={20} />
                </button>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [
                    'title' | 'updatedAt',
                    'asc' | 'desc'
                  ];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2.5 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent flex-1 lg:flex-initial"
              >
                <option value="updatedAt-desc">Latest Updated</option>
                <option value="updatedAt-asc">Oldest Updated</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredIndustries.length} {filteredIndustries.length === 1 ? 'industry' : 'industries'} found
            </span>
            <span>
              {filteredIndustries.filter((i) => i.isPublished).length} published
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-card rounded-lg border border-border p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading industries...</p>
            </div>
          </div>
        ) : filteredIndustries.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Icon name="FolderOpenIcon" size={48} className="text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-1">No industries found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first industry'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm press-scale"
                >
                  <Icon name="PlusIcon" size={20} />
                  Add New Industry
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => toggleSort('title')}
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                      >
                        Industry
                        {sortBy === 'title' && (
                          <Icon
                            name={sortOrder === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                            size={16}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => toggleSort('updatedAt')}
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                      >
                        Last Updated
                        {sortBy === 'updatedAt' && (
                          <Icon
                            name={sortOrder === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                            size={16}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndustries.map((industry) => (
                    <IndustryTableRow
                      key={industry.id}
                      industry={industry}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPreview={handlePreview}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIndustries.map((industry) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
      </div>

      {showFormModal && (
        <IndustryFormModal
          industry={selectedIndustry}
          onClose={() => setShowFormModal(false)}
          onSave={handleSave}
        />
      )}

      {showPreviewModal && selectedIndustry && (
        <IndustryPreviewModal
          industry={selectedIndustry}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default IndustriesManagementInteractive;