# URL Structure & Slug Explanation

## What is a Slug?

A **slug** is a URL-friendly version of a title or name. It's used to create clean, readable URLs.

### Examples:
- **Title**: "The Future of Brand Strategy"
- **Slug**: `the-future-of-brand-strategy`

- **Title**: "Workflow Automations"
- **Slug**: `workflow-automations`

### How Slugs are Generated:
```javascript
function generateSlug(title) {
  return title
    .toLowerCase()              // Convert to lowercase
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces/special chars with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}
```

**Example transformations:**
- "Hello World!" → `hello-world`
- "AI & Machine Learning" → `ai-machine-learning`
- "What's New in 2024?" → `whats-new-in-2024`

---

## Current URL Structure

### 📝 **BLOGS** (Query Parameter Method)

**Blog Listing:**
```
URL: /blog-listing
Purpose: Shows all published blog posts
```

**Blog Detail:**
```
URL: /blog-detail?slug=the-future-of-brand-strategy
Method: Query parameter (?slug=...)
```

**How it works:**
1. User clicks a blog card → navigates to `/blog-detail?slug=blog-slug`
2. Page reads the `slug` from URL query parameters
3. Fetches blog from Firestore using `blogsService.getBySlug(slug)`
4. Displays the blog content

**Code Example:**
```typescript
// In BlogDetailInteractive.tsx
const searchParams = useSearchParams();
const slug = searchParams.get('slug'); // Gets "the-future-of-brand-strategy"
const blog = await blogsService.getBySlug(slug);
```

**Pros:**
- ✅ Simple to implement
- ✅ Works with client-side routing

**Cons:**
- ❌ Not SEO-friendly (query parameters are less preferred)
- ❌ URLs look less clean
- ❌ Harder to share (longer URLs)

---

### 🛠️ **SERVICES** (Dynamic Route Method)

**Service Detail:**
```
URL: /services/workflow-automations
Method: Dynamic route ([slug])
```

**How it works:**
1. User navigates to `/services/workflow-automations`
2. Next.js extracts `workflow-automations` as the `slug` parameter
3. Server-side fetches service using `servicesService.getBySlug(slug)`
4. Renders the service page

**Code Example:**
```typescript
// In /services/[slug]/page.tsx
export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await servicesService.getBySlug(params.slug); // Gets "workflow-automations"
  // ...
}
```

**Pros:**
- ✅ SEO-friendly (clean URLs)
- ✅ Better for sharing
- ✅ Can generate static pages at build time
- ✅ More professional appearance

**Cons:**
- ⚠️ Requires `generateStaticParams()` for static export

---

## Database Structure

### Blog in Firestore:
```json
{
  "id": "abc123",
  "title": "The Future of Brand Strategy",
  "slug": "the-future-of-brand-strategy",  // ← Used to fetch blog
  "excerpt": "Explore how modern brands...",
  "contentHtml": "<p>...</p>",
  "status": "published",
  // ... other fields
}
```

### Service in Firestore:
```json
{
  "id": "xyz789",
  "title": "Workflow Automations",
  "slug": "workflow-automations",  // ← Used to fetch service
  "tagline": "Streamline your business...",
  "description": "Automate repetitive tasks...",
  "isActive": true,
  // ... other fields
}
```

---

## How Fetching Works

### Blog Fetching:
```typescript
// src/lib/blogs.ts
async getBySlug(slug: string): Promise<Blog | null> {
  const q = query(
    collection(db, 'blogs'),
    where('slug', '==', slug)  // Find blog where slug matches
  );
  const querySnapshot = await getDocs(q);
  // Returns the blog document
}
```

### Service Fetching:
```typescript
// src/lib/services.ts
async getBySlug(slug: string): Promise<Service | null> {
  const q = query(
    collection(db, 'services'),
    where('slug', '==', slug)  // Find service where slug matches
  );
  const querySnapshot = await getDocs(q);
  // Returns the service document
}
```

---

## Comparison Table

| Feature | Blogs (Current) | Services (Current) |
|---------|----------------|-------------------|
| **URL Format** | `/blog-detail?slug=title` | `/services/title` |
| **Method** | Query Parameter | Dynamic Route |
| **SEO Friendly** | ❌ Less optimal | ✅ Better |
| **URL Length** | Longer | Shorter |
| **Sharing** | Less clean | More professional |
| **Implementation** | Client-side (`useSearchParams`) | Server-side (`params`) |
| **Static Generation** | Not possible | Possible with `generateStaticParams()` |

---

## Recommendations

### For Better SEO (Blogs):
Change blogs to use dynamic routes like services:
- **Current**: `/blog-detail?slug=title`
- **Recommended**: `/blogs/title`

This would:
1. ✅ Improve SEO rankings
2. ✅ Create cleaner URLs
3. ✅ Enable static page generation
4. ✅ Match modern web standards

**Example URLs after change:**
- `/blogs/the-future-of-brand-strategy`
- `/blogs/ai-and-machine-learning`
- `/blogs/digital-marketing-trends-2024`

---

## Summary

**Slug** = URL-friendly version of a title (e.g., "Hello World" → `hello-world`)

**Blogs** = Currently use query parameters (`?slug=...`) - less SEO-friendly
**Services** = Use dynamic routes (`/services/[slug]`) - more SEO-friendly

Both store the `slug` field in Firestore and use it to fetch the correct document.
